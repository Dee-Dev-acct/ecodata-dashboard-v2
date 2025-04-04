import { 
  users, type User, type InsertUser,
  contactMessages, type ContactMessage, type InsertContactMessage,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  services, type Service, type InsertService,
  testimonials, type Testimonial, type InsertTestimonial,
  impactMetrics, type ImpactMetric, type InsertImpactMetric,
  blogPosts, type BlogPost, type InsertBlogPost,
  settings, type Setting, type InsertSetting
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessageReadStatus(id: number, isRead: boolean): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Newsletter
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  deleteNewsletterSubscriber(id: number): Promise<boolean>;
  
  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Impact Metrics
  getImpactMetrics(): Promise<ImpactMetric[]>;
  getImpactMetric(id: number): Promise<ImpactMetric | undefined>;
  createImpactMetric(metric: InsertImpactMetric): Promise<ImpactMetric>;
  updateImpactMetric(id: number, metric: Partial<InsertImpactMetric>): Promise<ImpactMetric | undefined>;
  deleteImpactMetric(id: number): Promise<boolean>;
  
  // Blog
  getBlogPosts(options?: { published?: boolean }): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Settings
  getSettings(): Promise<Setting[]>;
  getSetting(id: number): Promise<Setting | undefined>;
  getSettingByKey(section: string, key: string): Promise<Setting | undefined>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(id: number, setting: Partial<InsertSetting>): Promise<Setting | undefined>;
  deleteSetting(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private services: Map<number, Service>;
  private testimonials: Map<number, Testimonial>;
  private impactMetrics: Map<number, ImpactMetric>;
  private blogPosts: Map<number, BlogPost>;
  private settings: Map<number, Setting>;
  
  private currentUserId: number;
  private currentContactMessageId: number;
  private currentNewsletterSubscriberId: number;
  private currentServiceId: number;
  private currentTestimonialId: number;
  private currentImpactMetricId: number;
  private currentBlogPostId: number;
  private currentSettingId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.newsletterSubscribers = new Map();
    this.services = new Map();
    this.testimonials = new Map();
    this.impactMetrics = new Map();
    this.blogPosts = new Map();
    this.settings = new Map();
    
    this.currentUserId = 1;
    this.currentContactMessageId = 1;
    this.currentNewsletterSubscriberId = 1;
    this.currentServiceId = 1;
    this.currentTestimonialId = 1;
    this.currentImpactMetricId = 1;
    this.currentBlogPostId = 1;
    this.currentSettingId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData(): void {
    // Add sample data for development (real data will come from the database)
    const adminUser: InsertUser = {
      username: "admin",
      password: "$2b$10$xIv9kI4pGVN4HFP2EcrlJOpBVl9ZCqAwPDEyRtbK8lklr0YmCJESm", // "admin123"
      email: "admin@ecodatacic.org",
      role: "admin"
    };
    this.createUser(adminUser);
    
    // Add sample services
    const services = [
      {
        title: "Data Analytics",
        description: "Transform your raw data into actionable insights with our advanced analytics and visualization services.",
        icon: "fa-chart-line"
      },
      {
        title: "Environmental Research",
        description: "Leverage data-driven environmental studies to understand impact and drive sustainable policy decisions.",
        icon: "fa-globe-americas"
      },
      {
        title: "IT Consultancy",
        description: "Optimize your technology infrastructure with sustainable and efficient IT solutions and strategies.",
        icon: "fa-server"
      },
      {
        title: "Social Impact Assessment",
        description: "Understand the social implications of your projects with our comprehensive impact assessment methodology.",
        icon: "fa-users"
      },
      {
        title: "Project Management",
        description: "Execute complex data and IT projects with our experienced project management team.",
        icon: "fa-project-diagram"
      },
      {
        title: "Training & Workshops",
        description: "Empower your team with data literacy and environmental assessment skills through our tailored training programs.",
        icon: "fa-chalkboard-teacher"
      }
    ];
    
    services.forEach(service => this.createService(service));
    
    // Add sample testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        position: "Director",
        company: "GreenTech Solutions",
        testimonial: "ECODATA's analytics platform helped us reduce our carbon footprint by 28% in just one year. Their team's expertise in environmental data is unmatched.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      {
        name: "Michael Torres",
        position: "CTO",
        company: "Sustainable City Initiative",
        testimonial: "Working with ECODATA transformed how we approach urban planning. Their data insights helped us design smarter, greener public spaces.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Priya Mehta",
        position: "Program Director",
        company: "Community Climate Fund",
        testimonial: "ECODATA's social impact analysis helped us secure funding by clearly demonstrating the outcomes of our community initiatives.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
    
    // Add sample impact metrics
    const impactMetrics = [
      {
        title: "Carbon Reduction",
        value: "247 tonnes",
        description: "CO₂ equivalent reduction achieved through our client projects since 2020.",
        icon: "fa-chart-line",
        category: "environmental"
      },
      {
        title: "Community Engagement",
        value: "3,500+ people",
        description: "Community members engaged through workshops, training, and volunteer initiatives.",
        icon: "fa-users",
        category: "social"
      },
      {
        title: "Resource Efficiency",
        value: "32% average",
        description: "Improvement in resource utilization efficiency across client operations.",
        icon: "fa-recycle",
        category: "efficiency"
      }
    ];
    
    impactMetrics.forEach(metric => this.createImpactMetric(metric));
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      isRead: false, 
      createdAt: now 
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async updateContactMessageReadStatus(id: number, isRead: boolean): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Newsletter Subscribers
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined> {
    return this.newsletterSubscribers.get(id);
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.currentNewsletterSubscriberId++;
    const now = new Date();
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: now 
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async deleteNewsletterSubscriber(id: number): Promise<boolean> {
    return this.newsletterSubscribers.delete(id);
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const now = new Date();
    const service: Service = { 
      ...insertService, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const now = new Date();
    const updatedService = { 
      ...service, 
      ...serviceUpdate,
      updatedAt: now
    };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const now = new Date();
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const now = new Date();
    const updatedTestimonial = { 
      ...testimonial, 
      ...testimonialUpdate,
      updatedAt: now
    };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Impact Metrics
  async getImpactMetrics(): Promise<ImpactMetric[]> {
    return Array.from(this.impactMetrics.values());
  }

  async getImpactMetric(id: number): Promise<ImpactMetric | undefined> {
    return this.impactMetrics.get(id);
  }

  async createImpactMetric(insertMetric: InsertImpactMetric): Promise<ImpactMetric> {
    const id = this.currentImpactMetricId++;
    const now = new Date();
    const metric: ImpactMetric = { 
      ...insertMetric, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.impactMetrics.set(id, metric);
    return metric;
  }

  async updateImpactMetric(id: number, metricUpdate: Partial<InsertImpactMetric>): Promise<ImpactMetric | undefined> {
    const metric = this.impactMetrics.get(id);
    if (!metric) return undefined;
    
    const now = new Date();
    const updatedMetric = { 
      ...metric, 
      ...metricUpdate,
      updatedAt: now
    };
    this.impactMetrics.set(id, updatedMetric);
    return updatedMetric;
  }

  async deleteImpactMetric(id: number): Promise<boolean> {
    return this.impactMetrics.delete(id);
  }

  // Blog Posts
  async getBlogPosts(options?: { published?: boolean }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    // Filter by published status if option is provided
    if (options?.published !== undefined) {
      posts = posts.filter(post => post.published === options.published);
    }
    
    // Sort by publish date or created date
    return posts.sort((a, b) => {
      const dateA = a.publishDate || a.createdAt;
      const dateB = b.publishDate || b.createdAt;
      return new Date(dateB!).getTime() - new Date(dateA!).getTime();
    });
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const now = new Date();
    const updatedPost = { 
      ...post, 
      ...postUpdate,
      updatedAt: now
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async getSetting(id: number): Promise<Setting | undefined> {
    return this.settings.get(id);
  }

  async getSettingByKey(section: string, key: string): Promise<Setting | undefined> {
    return Array.from(this.settings.values()).find(
      (setting) => setting.section === section && setting.key === key,
    );
  }

  async createSetting(insertSetting: InsertSetting): Promise<Setting> {
    const id = this.currentSettingId++;
    const now = new Date();
    const setting: Setting = { 
      ...insertSetting, 
      id, 
      updatedAt: now
    };
    this.settings.set(id, setting);
    return setting;
  }

  async updateSetting(id: number, settingUpdate: Partial<InsertSetting>): Promise<Setting | undefined> {
    const setting = this.settings.get(id);
    if (!setting) return undefined;
    
    const now = new Date();
    const updatedSetting = { 
      ...setting, 
      ...settingUpdate,
      updatedAt: now
    };
    this.settings.set(id, updatedSetting);
    return updatedSetting;
  }

  async deleteSetting(id: number): Promise<boolean> {
    return this.settings.delete(id);
  }
}

export const storage = new MemStorage();
