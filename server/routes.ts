import type { Express, Request, Response } from "express";

// Declare user property on Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role: string;
      };
    }
  }
}
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authenticateToken, isAdmin, login } from "./auth";
import { sendContactNotification, sendContactConfirmation, sendNewsletterConfirmation, sendNewSubscriberNotification } from "./emailService";
import Stripe from "stripe";
import { z } from "zod";
import {
  insertContactMessageSchema,
  insertNewsletterSubscriberSchema,
  insertUserSchema,
  insertServiceSchema,
  insertTestimonialSchema,
  insertImpactMetricSchema,
  insertBlogPostSchema,
  insertSettingSchema,
  insertPartnerSchema,
  insertDonationSchema,
  insertSubscriptionSchema
} from "@shared/schema";

// Initialize Stripe
// Log environment variable availability (not the actual value)
console.log('Stripe key availability:', process.env.STRIPE_SECRET_KEY ? 'Available' : 'Not available');

// Make sure we have a Stripe key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set. Donation functionality will not work.');
}

// Initialize with the proper API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { 
  apiVersion: '2023-10-16' as any // Use a stable API version with type assertion
});

// We'll verify Stripe in a test route instead

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Debug route for admin login
  app.get("/api/debug/admin", async (req: Request, res: Response) => {
    const adminUser = await storage.getUserByUsername("admin");
    
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    
    // Don't return the actual password, just check if it exists
    const adminInfo = {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      passwordExists: !!adminUser.password,
      passwordLength: adminUser.password.length
    };
    
    return res.json(adminInfo);
  });
  
  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Parse and validate the request body
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: result.error.errors 
        });
      }
      
      const userData = result.data;
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Generate token
      const token = generateToken(user.id, user.username, user.role);
      
      // Return the token and user data (excluding password)
      return res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "An error occurred during registration" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const authResult = await login(username, password);
      
      if (!authResult) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      return res.json(authResult);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "An error occurred during login" });
    }
  });

  // Contact form routes
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = insertContactMessageSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid form data", errors: result.error.errors });
      }
      
      // Check honeypot field for spam
      if (req.body.website) {
        // Silently reject spam without letting the spammer know
        return res.status(200).json({ message: "Message received" });
      }
      
      // Create contact message
      const contactMessage = await storage.createContactMessage(result.data);
      
      // Send email notifications
      sendContactNotification(contactMessage);
      sendContactConfirmation(contactMessage);
      
      return res.status(201).json({ 
        message: "Your message has been sent successfully",
        id: contactMessage.id
      });
    } catch (error) {
      console.error("Contact form error:", error);
      return res.status(500).json({ message: "An error occurred while sending your message" });
    }
  });

  // Newsletter subscription routes
  // User routes
  app.get("/api/user/profile", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user data without sensitive information
      // Use type assertion since we know these properties exist on the User type
      const userWithSensitiveInfo = user as any;
      const { password, verificationToken, resetPasswordToken, ...userData } = userWithSensitiveInfo;
      return res.json(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  app.put("/api/user/profile", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate update data (allow only specific fields to be updated)
      const allowedFields = ["firstName", "lastName", "email", "bio", "interests", "notificationsEnabled"];
      const updateData: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      
      // Return updated user data without sensitive information
      // Use type assertion since we know these properties exist on the User type
      const userWithSensitiveInfo = updatedUser as any;
      const { password, verificationToken, resetPasswordToken, ...userData } = userWithSensitiveInfo;
      return res.json(userData);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  
  app.get("/api/user/donations", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.userId;
      const donations = await storage.getDonationsByUserId(userId);
      return res.json(donations);
    } catch (error) {
      console.error("Error fetching user donations:", error);
      return res.status(500).json({ message: "Failed to fetch donation history" });
    }
  });
  
  app.get("/api/user/subscriptions", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.userId;
      const subscriptions = await storage.getSubscriptionsByUserId(userId);
      return res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
      return res.status(500).json({ message: "Failed to fetch subscription history" });
    }
  });
  
  app.put("/api/user/watchlist", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.userId;
      
      // Since we don't have watchlist in our user schema,
      // we'll need to store this in a separate table or use settings
      // For now, just return a success response
      return res.json({ message: "Watchlist feature coming soon" });
    } catch (error) {
      console.error("Error updating watchlist:", error);
      return res.status(500).json({ message: "Failed to update watchlist" });
    }
  });
  
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = insertNewsletterSubscriberSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid subscription data", errors: result.error.errors });
      }
      
      // Check honeypot field for spam
      if (req.body.website) {
        // Silently reject spam without letting the spammer know
        return res.status(200).json({ message: "Subscription received" });
      }
      
      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(result.data.email);
      
      if (existingSubscriber) {
        return res.status(400).json({ message: "This email is already subscribed" });
      }
      
      // Format and handle subscription data
      const subscriptionData = {
        ...result.data,
        subscriptionTier: result.data.subscriptionTier || "basic", // Default to basic if not specified
        interests: result.data.interests || [] // Default to empty array if not specified
      };
      
      // Create newsletter subscriber
      const subscriber = await storage.createNewsletterSubscriber(subscriptionData);
      
      // Send confirmation emails
      sendNewsletterConfirmation(subscriber);
      sendNewSubscriberNotification(subscriber);
      
      return res.status(201).json({ 
        message: "You have been subscribed successfully",
        id: subscriber.id
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return res.status(500).json({ message: "An error occurred during subscription" });
    }
  });

  // Public API routes
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getServices();
      return res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      return res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/impact-metrics", async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getImpactMetrics();
      return res.json(metrics);
    } catch (error) {
      console.error("Error fetching impact metrics:", error);
      return res.status(500).json({ message: "Failed to fetch impact metrics" });
    }
  });
  
  app.get("/api/partners", async (req: Request, res: Response) => {
    try {
      const partners = await storage.getPartners();
      return res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      return res.status(500).json({ message: "Failed to fetch partners" });
    }
  });
  
  app.get("/api/funding-goals", async (req: Request, res: Response) => {
    try {
      // In a production app, this would retrieve data from the database
      // For now, we'll return sample data for demonstration purposes
      const fundingGoals = [
        {
          id: 'reforestation',
          title: 'Reforestation Data Initiative',
          description: 'Help us fund data collection and analysis for reforestation projects',
          currentAmount: 3750,
          targetAmount: 10000,
          urgency: 'medium', // Options: low, medium, high, critical
          daysRemaining: 42,
          featured: true,
          location: 'Amazon Basin',
          iconName: 'TreePine',
          coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000',
          impact: 'Track 50,000 trees across 10 reforestation sites with advanced data collection',
          suggestedDonations: [25, 50, 100, 250],
          milestones: [
            {
              value: 2500,
              label: 'Monitoring Systems',
              description: 'Fund initial data collection sensors for forest monitoring',
              iconName: 'Leaf'
            },
            {
              value: 5000,
              label: 'Halfway Mark',
              description: 'Enable expanded data analysis and visualization tools',
              iconName: 'Target'
            },
            {
              value: 7500,
              label: 'Research Phase',
              description: 'Launch comprehensive environmental impact assessment studies',
              iconName: 'Award'
            },
            {
              value: 10000,
              label: 'Full Funding',
              description: 'Complete implementation of the entire data-driven reforestation monitoring system',
              iconName: 'Trophy'
            }
          ],
          theme: 'forest'
        },
        {
          id: 'water-quality',
          title: 'Water Quality Monitoring Network',
          description: 'Support our initiative to build a network of water quality sensors across key waterways',
          currentAmount: 8200,
          targetAmount: 15000,
          urgency: 'high',
          daysRemaining: 21,
          featured: true,
          location: 'Thames River Basin',
          iconName: 'Droplets',
          coverImage: 'https://images.unsplash.com/photo-1581022295087-35e593bcc689?q=80&w=1000',
          impact: 'Monitor water quality for 3 million residents with real-time data alerts',
          suggestedDonations: [50, 150, 300, 750],
          milestones: [
            {
              value: 3000,
              label: 'Initial Sensors',
              description: 'Deploy the first batch of water quality monitoring sensors',
              iconName: 'Leaf'
            },
            {
              value: 6000,
              label: 'Data Platform',
              description: 'Develop the data collection and analysis platform',
              iconName: 'Target'
            },
            {
              value: 9000,
              label: 'Network Expansion',
              description: 'Expand the sensor network to additional waterways',
              iconName: 'Award'
            },
            {
              value: 12000,
              label: 'Community Engagement',
              description: 'Launch community science program for participatory data collection',
              iconName: 'Users'
            },
            {
              value: 15000,
              label: 'Full Coverage',
              description: 'Achieve full regional coverage and real-time monitoring capabilities',
              iconName: 'Trophy'
            }
          ],
          theme: 'ocean'
        },
        {
          id: 'community-impact',
          title: 'Community Impact Measurement',
          description: 'Fund our community-focused data collection and impact assessment projects',
          currentAmount: 4500,
          targetAmount: 8000,
          urgency: 'critical',
          daysRemaining: 14,
          featured: false,
          location: 'London Metropolitan Area',
          iconName: 'Users',
          coverImage: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000',
          impact: 'Provide data-driven insights to 25 community organizations serving 100,000 people',
          suggestedDonations: [20, 50, 100, 200],
          milestones: [
            {
              value: 2000,
              label: 'Research Tools',
              description: 'Develop community impact assessment methodologies and tools',
              iconName: 'Leaf'
            },
            {
              value: 4000,
              label: 'Data Collection',
              description: 'Implement initial community data collection projects',
              iconName: 'Target'
            },
            {
              value: 6000,
              label: 'Analysis Framework',
              description: 'Build comprehensive analytics framework for social impact data',
              iconName: 'Award'
            },
            {
              value: 8000,
              label: 'Full Implementation',
              description: 'Complete the community impact measurement system and dashboards',
              iconName: 'Trophy'
            }
          ],
          theme: 'sunset'
        },
        {
          id: 'carbon-tracking',
          title: 'Carbon Impact Monitoring System',
          description: 'Help build our next-generation carbon impact monitoring and verification platform',
          currentAmount: 2200,
          targetAmount: 12000,
          urgency: 'medium',
          daysRemaining: 60,
          featured: true,
          location: 'Global Initiative',
          iconName: 'Wind',
          coverImage: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1000',
          impact: 'Enable precise carbon impact measurement across 500 environmental projects',
          suggestedDonations: [100, 250, 500, 1000],
          milestones: [
            {
              value: 3000,
              label: 'Data Architecture',
              description: 'Develop the core data architecture and collection methodology',
              iconName: 'Database'
            },
            {
              value: 6000,
              label: 'Sensor Network',
              description: 'Deploy initial sensor network and data collection systems',
              iconName: 'Signal'
            },
            {
              value: 9000,
              label: 'Analytics Platform',
              description: 'Build comprehensive analytics and visualization platform',
              iconName: 'BarChart'
            },
            {
              value: 12000,
              label: 'Verification System',
              description: 'Complete the carbon impact verification and certification system',
              iconName: 'CheckCircle'
            }
          ],
          theme: 'default'
        }
      ];
      
      return res.json(fundingGoals);
    } catch (error) {
      console.error("Error fetching funding goals:", error);
      return res.status(500).json({ message: "Failed to fetch funding goals" });
    }
  });

  // Serve blog posts at both API paths for compatibility
  app.get(["/api/blog/posts", "/api/blog-posts"], async (req: Request, res: Response) => {
    try {
      const published = req.query.published === 'true';
      console.log("Fetching blog posts with published =", published);
      const posts = await storage.getBlogPosts({ published });
      console.log("Found blog posts:", posts.length);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Serve single blog post by slug at both API paths for compatibility
  app.get(["/api/blog/posts/:slug", "/api/blog-posts/:slug"], async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Protected admin routes
  app.get("/api/admin/messages", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getContactMessages();
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.put("/api/admin/messages/:id/read", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isRead } = req.body;
      
      if (isRead === undefined) {
        return res.status(400).json({ message: "isRead field is required" });
      }
      
      const updatedMessage = await storage.updateContactMessageReadStatus(parseInt(id), isRead);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      return res.json(updatedMessage);
    } catch (error) {
      console.error("Error updating message status:", error);
      return res.status(500).json({ message: "Failed to update message status" });
    }
  });

  app.delete("/api/admin/messages/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteContactMessage(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      return res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      return res.status(500).json({ message: "Failed to delete message" });
    }
  });

  app.get("/api/admin/subscribers", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      return res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      return res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.delete("/api/admin/subscribers/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteNewsletterSubscriber(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      return res.json({ message: "Subscriber deleted successfully" });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      return res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  // CMS Routes - Services
  app.post("/api/admin/services", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertServiceSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid service data", errors: result.error.errors });
      }
      
      const service = await storage.createService(result.data);
      return res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      return res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = insertServiceSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid service data", errors: result.error.errors });
      }
      
      const service = await storage.updateService(parseInt(id), result.data);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      return res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      return res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteService(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      return res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      return res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // CMS Routes - Testimonials
  app.post("/api/admin/testimonials", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertTestimonialSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: result.error.errors });
      }
      
      const testimonial = await storage.createTestimonial(result.data);
      return res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      return res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = insertTestimonialSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: result.error.errors });
      }
      
      const testimonial = await storage.updateTestimonial(parseInt(id), result.data);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      return res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTestimonial(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      return res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      return res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // CMS Routes - Impact Metrics
  app.post("/api/admin/impact-metrics", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertImpactMetricSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid impact metric data", errors: result.error.errors });
      }
      
      const metric = await storage.createImpactMetric(result.data);
      return res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating impact metric:", error);
      return res.status(500).json({ message: "Failed to create impact metric" });
    }
  });

  app.put("/api/admin/impact-metrics/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = insertImpactMetricSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid impact metric data", errors: result.error.errors });
      }
      
      const metric = await storage.updateImpactMetric(parseInt(id), result.data);
      
      if (!metric) {
        return res.status(404).json({ message: "Impact metric not found" });
      }
      
      return res.json(metric);
    } catch (error) {
      console.error("Error updating impact metric:", error);
      return res.status(500).json({ message: "Failed to update impact metric" });
    }
  });

  app.delete("/api/admin/impact-metrics/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteImpactMetric(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Impact metric not found" });
      }
      
      return res.json({ message: "Impact metric deleted successfully" });
    } catch (error) {
      console.error("Error deleting impact metric:", error);
      return res.status(500).json({ message: "Failed to delete impact metric" });
    }
  });

  // CMS Routes - Blog
  app.post("/api/admin/blog/posts", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertBlogPostSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid blog post data", errors: result.error.errors });
      }
      
      const post = await storage.createBlogPost(result.data);
      return res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = insertBlogPostSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid blog post data", errors: result.error.errors });
      }
      
      const post = await storage.updateBlogPost(parseInt(id), result.data);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // CMS Routes - Settings
  app.get("/api/settings/:section/:key", async (req: Request, res: Response) => {
    try {
      const { section, key } = req.params;
      const setting = await storage.getSettingByKey(section, key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      return res.json(setting);
    } catch (error) {
      console.error("Error fetching setting:", error);
      return res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.post("/api/admin/settings", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertSettingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid setting data", errors: result.error.errors });
      }
      
      // Check if setting already exists
      const existingSetting = await storage.getSettingByKey(result.data.section, result.data.key);
      
      if (existingSetting) {
        // Update existing setting
        const updated = await storage.updateSetting(existingSetting.id, result.data);
        return res.json(updated);
      }
      
      // Create new setting
      const setting = await storage.createSetting(result.data);
      return res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating/updating setting:", error);
      return res.status(500).json({ message: "Failed to create/update setting" });
    }
  });
  
  // CMS Routes - Partners
  app.get("/api/admin/partners", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const partners = await storage.getPartners();
      return res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      return res.status(500).json({ message: "Failed to fetch partners" });
    }
  });
  
  app.post("/api/admin/partners", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertPartnerSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid partner data", errors: result.error.errors });
      }
      
      const partner = await storage.createPartner(result.data);
      return res.status(201).json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      return res.status(500).json({ message: "Failed to create partner" });
    }
  });
  
  app.put("/api/admin/partners/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = insertPartnerSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid partner data", errors: result.error.errors });
      }
      
      const partner = await storage.updatePartner(parseInt(id), result.data);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      return res.json(partner);
    } catch (error) {
      console.error("Error updating partner:", error);
      return res.status(500).json({ message: "Failed to update partner" });
    }
  });
  
  app.delete("/api/admin/partners/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePartner(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      return res.json({ message: "Partner deleted successfully" });
    } catch (error) {
      console.error("Error deleting partner:", error);
      return res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      // Verify Stripe is configured properly
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY environment variable is not set or invalid');
        return res.status(503).json({ 
          error: "Stripe configuration error", 
          message: "Donation functionality is currently unavailable. Please try again later." 
        });
      }

      // Check if it's a publishable key mistakenly used as secret key
      if (process.env.STRIPE_SECRET_KEY.startsWith('pk_')) {
        console.error('Publishable key used where secret key is required');
        return res.status(503).json({ 
          error: "Stripe configuration error", 
          message: "Donation functionality is currently unavailable due to invalid configuration." 
        });
      }

      // Get donation details from request body with validation
      const { amount, isGiftAid, giftAidName, giftAidAddress, giftAidPostcode, email } = req.body;
      
      // Validate amount is a number and within acceptable range (£1 to £500)
      const donationAmount = parseFloat(amount);
      if (isNaN(donationAmount) || donationAmount < 1 || donationAmount > 500) {
        console.error(`Invalid donation amount: ${amount}`);
        return res.status(400).json({
          error: "Invalid amount",
          message: 'Invalid donation amount. Please enter an amount between £1 and £500.'
        });
      }

      // Convert to pence (GBP) for Stripe
      const amountInPence = Math.round(donationAmount * 100);
      console.log(`Starting checkout session creation for £${donationAmount} (${amountInPence} pence)...`);

      // Create a Stripe Checkout Session with the custom donation amount
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: "Donation to ECODATA CIC",
                description: "Supporting eco-friendly data initiatives",
              },
              unit_amount: amountInPence, // Amount in pence
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}`,
        metadata: {
          donationAmount: donationAmount.toFixed(2),
          isGiftAid: isGiftAid ? "true" : "false",
          giftAidName: giftAidName || "",
          giftAidAddress: giftAidAddress || "",
          giftAidPostcode: giftAidPostcode || "",
          email: email || ""
        },
        customer_email: email // Pre-fill the customer's email if provided
      });

      console.log("Checkout session created successfully");
      
      // Verify that we have a valid URL
      if (!session?.url) {
        throw new Error('Stripe session created but no redirect URL was provided');
      }
      
      // Return the URL to redirect to
      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      
      // Identify specific error cases for better user feedback
      let statusCode = 500;
      let errorMessage = "Failed to process donation. Please try again later.";
      
      // Handle specific Stripe errors with more detailed diagnostics
      if (error.type === 'StripeAuthenticationError') {
        statusCode = 503;
        errorMessage = "Payment service authentication error. Please contact support.";
        console.error('Stripe Authentication Error: This usually means the API key is invalid or revoked.');
      } else if (error.type === 'StripeInvalidRequestError') {
        statusCode = 400;
        errorMessage = "Invalid donation request. Please try again.";
        console.error('Stripe Invalid Request Error:', error.message);
      } else if (error.type === 'StripeConnectionError') {
        statusCode = 503;
        errorMessage = "Unable to connect to payment service. Please try again later.";
        console.error('Stripe Connection Error: This could be due to network issues or Stripe service disruption.');
      } else if (error.type === 'StripeRateLimitError') {
        statusCode = 429;
        errorMessage = "Too many donation requests. Please try again in a few minutes.";
        console.error('Stripe Rate Limit Error: The API request rate limit has been exceeded.');
      } else {
        // Log unknown errors with full details for debugging
        console.error('Unexpected Stripe error:', error);
      }
      
      // Return appropriate error response with helpful context
      res.status(statusCode).json({ 
        error: "Checkout session error", 
        message: errorMessage,
        code: error.code || 'unknown',
        recoverable: statusCode < 500, // Indicates if the user can reasonably retry the operation
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
  
  // New API route to create recurring subscription donation via Stripe
  app.post("/api/create-subscription", async (req: Request, res: Response) => {
    try {
      // Verify Stripe is configured properly
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY environment variable is not set or invalid');
        return res.status(503).json({ 
          error: "Stripe configuration error", 
          message: "Subscription functionality is currently unavailable. Please try again later." 
        });
      }

      // Get subscription details from request body
      const { amount, interval, isGiftAid, giftAidName, giftAidAddress, giftAidPostcode, email, name } = req.body;
      
      // Validate amount is a number and within acceptable range
      const donationAmount = parseFloat(amount);
      if (isNaN(donationAmount) || donationAmount < 1 || donationAmount > 500) {
        console.error(`Invalid subscription amount: ${amount}`);
        return res.status(400).json({
          error: "Invalid amount",
          message: 'Invalid subscription amount. Please enter an amount between £1 and £500.'
        });
      }
      
      // Validate interval
      if (interval !== 'month' && interval !== 'year') {
        return res.status(400).json({
          error: "Invalid interval",
          message: 'Invalid subscription interval. Please select either monthly or yearly.'
        });
      }

      // Convert to pence (GBP) for Stripe
      const amountInPence = Math.round(donationAmount * 100);
      
      // Create a product for this subscription if it doesn't exist
      const productName = `${interval === 'month' ? 'Monthly' : 'Annual'} Donation to ECODATA CIC`;
      const product = await stripe.products.create({
        name: productName,
        description: `Supporting eco-friendly data initiatives (${interval}ly)`
      });
      
      // Create a price for this product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amountInPence,
        currency: 'gbp',
        recurring: {
          interval: interval
        }
      });
      
      // Create a checkout session for the subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: price.id,
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}`,
        metadata: {
          donationAmount: donationAmount.toFixed(2),
          interval: interval,
          isGiftAid: isGiftAid ? "true" : "false",
          giftAidName: giftAidName || "",
          giftAidAddress: giftAidAddress || "",
          giftAidPostcode: giftAidPostcode || "",
          email: email || "",
          name: name || ""
        },
        customer_email: email // Pre-fill the customer's email if provided
      });
      
      // Return the session URL and ID
      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      
      // Identify specific error cases for better user feedback
      let statusCode = 500;
      let errorMessage = "Failed to process subscription. Please try again later.";
      
      // Handle specific Stripe errors (same as one-time donations)
      if (error.type === 'StripeAuthenticationError') {
        statusCode = 503;
        errorMessage = "Payment service authentication error. Please contact support.";
      } else if (error.type === 'StripeInvalidRequestError') {
        statusCode = 400;
        errorMessage = "Invalid subscription request. Please try again.";
      } else if (error.type === 'StripeConnectionError') {
        statusCode = 503;
        errorMessage = "Unable to connect to payment service. Please try again later.";
      } else if (error.type === 'StripeRateLimitError') {
        statusCode = 429;
        errorMessage = "Too many subscription requests. Please try again in a few minutes.";
      }
      
      // Return appropriate error response with helpful context
      res.status(statusCode).json({ 
        error: "Subscription error", 
        message: errorMessage,
        code: error.code || 'unknown',
        recoverable: statusCode < 500
      });
    }
  });
  
  // Webhook endpoint to handle Stripe events
  app.post('/api/webhook', async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    // Verify webhook signature
    try {
      if (!webhookSecret) {
        console.warn('No webhook secret configured, skipping signature verification');
        event = req.body;
      } else {
        event = stripe.webhooks.constructEvent(
          (req as any).rawBody || req.body,
          sig,
          webhookSecret
        );
      }
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          
          if (session.mode === 'payment') {
            // Handle one-time donation
            await handleDonationSuccess(session);
          } else if (session.mode === 'subscription') {
            // Handle subscription
            await handleSubscriptionSuccess(session);
          }
          break;
        }
        case 'invoice.paid': {
          // Handle subscription renewal payment
          const invoice = event.data.object;
          await handleSubscriptionRenewal(invoice);
          break;
        }
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          // Handle subscription status change
          const subscription = event.data.object;
          await handleSubscriptionUpdate(subscription);
          break;
        }
      }
      
      // Return a 200 response to acknowledge receipt of the event
      res.json({ received: true });
    } catch (err) {
      console.error(`Error processing webhook event: ${err}`);
      res.status(500).send('Error processing webhook');
    }
  });
  
  // Function to handle successful one-time donation
  async function handleDonationSuccess(session: any) {
    try {
      // Extract metadata from session
      const { donationAmount, isGiftAid, giftAidName, giftAidAddress, giftAidPostcode, email } = session.metadata;
      
      // Get payment details
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
      
      // Create donation record
      await storage.createDonation({
        amount: donationAmount,
        currency: session.currency || 'gbp',
        email: email || session.customer_details?.email,
        name: session.customer_details?.name,
        stripePaymentId: session.payment_intent,
        stripeSessionId: session.id,
        status: 'completed',
        isGiftAid: isGiftAid === 'true',
        giftAidName: giftAidName || null,
        giftAidAddress: giftAidAddress || null,
        giftAidPostcode: giftAidPostcode || null,
        metadata: { 
          paymentMethod: paymentIntent.payment_method_types[0],
          customerDetails: session.customer_details
        }
      });
      
      console.log(`Donation record created for session ${session.id}`);
    } catch (error) {
      console.error('Error creating donation record:', error);
      throw error;
    }
  }
  
  // Function to handle subscription creation success
  async function handleSubscriptionSuccess(session: any) {
    try {
      // Get the subscription details from the session - use any type as the Stripe types aren't matching well
      const subscription: any = await stripe.subscriptions.retrieve(session.subscription);
      
      // Extract metadata
      const { donationAmount, interval, isGiftAid, giftAidName, giftAidAddress, giftAidPostcode, email, name } = session.metadata;
      
      // Get customer ID as string
      const stripeCustomerId = typeof subscription.customer === 'string' 
        ? subscription.customer 
        : subscription.customer.id;
      
      // Create subscription record
      await storage.createSubscription({
        email: email || session.customer_details?.email,
        name: name || session.customer_details?.name,
        stripeCustomerId: stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        amount: donationAmount,
        currency: subscription.currency || 'gbp',
        interval: interval || 'month',
        status: subscription.status,
        isGiftAid: isGiftAid === 'true',
        giftAidName: giftAidName || null,
        giftAidAddress: giftAidAddress || null,
        giftAidPostcode: giftAidPostcode || null,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        metadata: {
          sessionId: session.id,
          customerDetails: session.customer_details
        }
      });
      
      console.log(`Subscription record created for subscription ${subscription.id}`);
    } catch (error) {
      console.error('Error creating subscription record:', error);
      throw error;
    }
  }
  
  // Function to handle subscription renewal
  async function handleSubscriptionRenewal(invoice: any) {
    try {
      // Get the subscription - use any type for Stripe API consistency
      const subscription: any = await stripe.subscriptions.retrieve(invoice.subscription);
      
      // Find the subscription in our database
      const existingSubscription = await storage.getSubscriptionByStripeId(subscription.id);
      
      if (existingSubscription) {
        // Update the subscription status and current period end
        await storage.updateSubscriptionStatus(existingSubscription.id, subscription.status);
        
        console.log(`Subscription ${subscription.id} renewal processed`);
      } else {
        console.warn(`Subscription ${subscription.id} not found in database for renewal event`);
      }
    } catch (error) {
      console.error('Error processing subscription renewal:', error);
      throw error;
    }
  }
  
  // Function to handle subscription status updates
  async function handleSubscriptionUpdate(subscription: any) {
    try {
      // Find the subscription in our database
      const existingSubscription = await storage.getSubscriptionByStripeId(subscription.id);
      
      if (existingSubscription) {
        // Update subscription status
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await storage.cancelSubscription(existingSubscription.id);
        } else {
          await storage.updateSubscriptionStatus(existingSubscription.id, subscription.status);
        }
        
        console.log(`Subscription ${subscription.id} status updated to ${subscription.status}`);
      } else {
        console.warn(`Subscription ${subscription.id} not found in database for status update event`);
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }
  
  // Donation endpoints
  
  // Public API for donation success verification
  app.get("/api/donations/verify/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
      }
      
      // Retrieve the checkout session from Stripe
      const session: any = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Return appropriate data based on session status
      return res.json({
        status: session.status,
        paymentStatus: session.payment_status,
        amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : null,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        mode: session.mode
      });
    } catch (error) {
      console.error("Error verifying donation:", error);
      return res.status(500).json({ error: "Failed to verify donation" });
    }
  });
  
  // Admin API for donations
  app.get("/api/admin/donations", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const donations = await storage.getDonations();
      return res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      return res.status(500).json({ message: "Failed to fetch donations" });
    }
  });
  
  // Admin API for subscriptions
  app.get("/api/admin/subscriptions", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const subscriptions = await storage.getSubscriptions();
      return res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });
  
  // Public API for subscription success verification
  app.get("/api/subscriptions/verify/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
      }
      
      // Retrieve the checkout session from Stripe
      const session: any = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Get subscription details if available
      let subscriptionDetails = null;
      if (session.subscription) {
        const subscription: any = await stripe.subscriptions.retrieve(session.subscription);
        subscriptionDetails = {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          interval: subscription.items.data[0].plan.interval,
        };
      }
      
      // Return appropriate data based on session status
      return res.json({
        status: session.status,
        paymentStatus: session.payment_status,
        subscription: subscriptionDetails,
        amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : null,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        mode: session.mode
      });
    } catch (error) {
      console.error("Error verifying subscription:", error);
      return res.status(500).json({ error: "Failed to verify subscription" });
    }
  });
  
  // Admin API for cancelling subscriptions
  app.post("/api/admin/subscriptions/:id/cancel", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const subscription = await storage.getSubscription(parseInt(id));
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Cancel in Stripe first
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      
      // Then update our record
      const updatedSubscription = await storage.cancelSubscription(parseInt(id));
      
      return res.json(updatedSubscription);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      return res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
