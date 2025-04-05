import type { Express, Request, Response } from "express";
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
  insertPartnerSchema
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

  // Authentication routes
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

      // Get amount from request body with validation
      const { amount } = req.body;
      
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
        success_url: `${req.headers.origin}/donation-success`,
        cancel_url: `${req.headers.origin}`,
        metadata: {
          donationAmount: donationAmount.toFixed(2) // Store formatted amount as metadata for reference
        }
      });

      console.log("Checkout session created successfully");
      
      // Verify that we have a valid URL
      if (!session?.url) {
        throw new Error('Stripe session created but no redirect URL was provided');
      }
      
      // Return the URL to redirect to
      res.json({ url: session.url });
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
