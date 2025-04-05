import { 
  users, type User, type InsertUser,
  contactMessages, type ContactMessage, type InsertContactMessage,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  services, type Service, type InsertService,
  testimonials, type Testimonial, type InsertTestimonial,
  impactMetrics, type ImpactMetric, type InsertImpactMetric,
  blogPosts, type BlogPost, type InsertBlogPost,
  settings, type Setting, type InsertSetting,
  partners, type Partner, type InsertPartner,
  // MSSQL schemas
  type MSSQLUser,
  type MSSQLContactMessage,
  type MSSQLNewsletterSubscriber,
  type MSSQLService,
  type MSSQLTestimonial,
  type MSSQLImpactMetric,
  type MSSQLBlogPost,
  type MSSQLSetting,
  type MSSQLPartner
} from "@shared/schema";
import { db, mssqlClient } from "./db";
import { 
  eq, 
  desc, 
  and, 
  asc, 
  isNull, 
  not, 
  sql,
} from "drizzle-orm";

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
  
  // Partners
  getPartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined>;
  deletePartner(id: number): Promise<boolean>;
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
  private partners: Map<number, Partner>;
  
  private currentUserId: number;
  private currentContactMessageId: number;
  private currentNewsletterSubscriberId: number;
  private currentServiceId: number;
  private currentTestimonialId: number;
  private currentImpactMetricId: number;
  private currentBlogPostId: number;
  private currentSettingId: number;
  private currentPartnerId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.newsletterSubscribers = new Map();
    this.services = new Map();
    this.testimonials = new Map();
    this.impactMetrics = new Map();
    this.blogPosts = new Map();
    this.settings = new Map();
    this.partners = new Map();
    
    this.currentUserId = 1;
    this.currentContactMessageId = 1;
    this.currentNewsletterSubscriberId = 1;
    this.currentServiceId = 1;
    this.currentTestimonialId = 1;
    this.currentImpactMetricId = 1;
    this.currentBlogPostId = 1;
    this.currentSettingId = 1;
    this.currentPartnerId = 1;
    
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
    
    // Add tech partner logos based on user-provided examples
    const partners = [
      {
        name: "IBM",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
        websiteUrl: "https://www.ibm.com",
        category: "technology"
      },
      {
        name: "Google",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        websiteUrl: "https://www.google.com",
        category: "technology"
      },
      {
        name: "Microsoft",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        websiteUrl: "https://www.microsoft.com",
        category: "technology"
      },
      {
        name: "Amazon Web Services",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        websiteUrl: "https://aws.amazon.com",
        category: "technology"
      },
      {
        name: "Intel",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
        websiteUrl: "https://www.intel.com",
        category: "technology"
      },
      {
        name: "NVIDIA",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
        websiteUrl: "https://www.nvidia.com",
        category: "technology"
      }
    ];
    
    partners.forEach(partner => this.createPartner(partner));
    
    // Add authentic services from company website
    const services = [
      {
        title: "Sustainable IT Consultancy",
        description: "We help organizations modernize their infrastructure through energy-efficient cloud migration, green data architecture, and secure managed IT services that reduce environmental impact.",
        icon: "fa-cloud"
      },
      {
        title: "Data Solutions",
        description: "Our energy-efficient platforms provide secure, scalable data storage and processing with a focus on minimizing environmental impact while maximizing insights and operational efficiency.",
        icon: "fa-database"
      },
      {
        title: "Research & Development",
        description: "Our interdisciplinary research combines data science, AI, and environmental studies to develop innovative solutions that address pressing social and ecological challenges.",
        icon: "fa-flask"
      },
      {
        title: "Green Data Infrastructure",
        description: "Energy-efficient cloud storage with Hadoop and Apache Spark infrastructure designed for minimal environmental impact without compromising performance.",
        icon: "fa-database"
      },
      {
        title: "Sustainability Analytics",
        description: "Advanced visual and predictive analytics platforms that transform data into actionable sustainability insights and decision-making tools.",
        icon: "fa-chart-line"
      },
      {
        title: "Ethical Data Security",
        description: "Enterprise-grade security protocols and compliance frameworks with a focus on ethical data practices and privacy protection.",
        icon: "fa-shield-alt"
      }
    ];
    
    services.forEach(service => this.createService(service));
    
    // Add authentic testimonials from company website
    const testimonials = [
      {
        name: "Sarah Johnson",
        position: "CTO",
        company: "GreenFuture Ltd",
        testimonial: "ECODATA CIC transformed our IT infrastructure while helping us achieve our carbon neutrality goals two years ahead of schedule. Their expertise in sustainable technology is unmatched.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      {
        name: "David Chen",
        position: "Director",
        company: "Urban Sustainability Initiative",
        testimonial: "The research conducted by ECODATA CIC provided invaluable insights that shaped our community sustainability programs. Their combination of technical expertise and social awareness is rare.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Michael Torres",
        position: "CTO",
        company: "Sustainable City Initiative",
        testimonial: "Working with ECODATA transformed how we approach urban planning. Their data insights helped us design smarter, greener public spaces.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/men/28.jpg"
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
    
    // Add authentic impact metrics from company website
    const impactMetrics = [
      {
        title: "Environmental Impact",
        value: "35%",
        description: "Our green IT solutions have helped clients reduce their carbon emissions by an average of 35% across their digital operations. Through our energy-efficient data centers and optimized cloud solutions, we've collectively saved over 2.5 million kWh of energy annually.",
        icon: "fa-leaf",
        category: "environmental"
      },
      {
        title: "Social Impact",
        value: "50,000+",
        description: "We've partnered with 12 educational institutions and 8 non-profits to deliver research and technology solutions that improve access to education, healthcare, and sustainable resources in underserved communities.",
        icon: "fa-users",
        category: "social"
      },
      {
        title: "Client Success",
        value: "30%",
        description: "Organizations working with ECODATA CIC report an average 30% reduction in operational costs while achieving their sustainability targets.",
        icon: "fa-chart-line",
        category: "efficiency"
      },
      {
        title: "Sustainability Projects",
        value: "100+",
        description: "Completed sustainability projects across multiple sectors including energy, transportation, and urban planning.",
        icon: "fa-project-diagram",
        category: "projects"
      }
    ];
    
    impactMetrics.forEach(metric => this.createImpactMetric(metric));

    // Add blog posts with authentic ECODATA CIC content
    const blogPosts = [
      {
        title: "Sustainable IT: Reducing Digital Carbon Footprints",
        category: "Technology",
        slug: "sustainable-it-reducing-digital-carbon-footprints",
        content: `<p>As our world becomes increasingly digital, the environmental impact of our IT infrastructure continues to grow. At ECODATA CIC, we're committed to helping organizations reduce their digital carbon footprints through sustainable IT practices.</p>
        
        <h3>The Growing Digital Carbon Footprint</h3>
        <p>Studies show that the ICT industry is responsible for approximately 2-3% of global carbon emissions, similar to the aviation industry. With the exponential growth of data centers, cloud computing, and digital services, this percentage is expected to increase.</p>
        
        <h3>Our Approach to Sustainable IT</h3>
        <p>At ECODATA CIC, we implement several strategies to help organizations minimize their digital environmental impact:</p>
        <ul>
          <li><strong>Energy-efficient cloud solutions</strong>: We design and implement cloud architectures that optimize resource utilization and minimize energy consumption.</li>
          <li><strong>Green data center practices</strong>: Our data storage solutions incorporate best practices for cooling, power management, and hardware lifecycle optimization.</li>
          <li><strong>Application optimization</strong>: We refactor legacy applications to be more energy-efficient and resource-conscious.</li>
          <li><strong>Remote work enablement</strong>: We help organizations transition to low-carbon remote work environments that reduce commuting while maintaining productivity.</li>
        </ul>
        
        <h3>Measuring Digital Sustainability</h3>
        <p>One of the challenges in sustainable IT is quantifying your digital carbon footprint. Our analytics platform provides organizations with clear metrics on their IT-related emissions, enabling data-driven sustainability decisions.</p>
        
        <h3>Case Study: Green Cloud Migration</h3>
        <p>In a recent project with a mid-sized financial services firm, our sustainable cloud migration strategy reduced their IT carbon footprint by 42% while simultaneously cutting operating costs by 30%. This demonstrates how sustainability and business objectives can align for mutual benefit.</p>
        
        <h3>Get Started with Sustainable IT</h3>
        <p>Ready to reduce your organization's digital environmental impact? Contact ECODATA CIC for a sustainability audit of your IT infrastructure and discover how we can help you implement greener technology practices.</p>`,
        excerpt: "Discover how ECODATA CIC helps organizations reduce their environmental impact through sustainable IT practices, green cloud solutions, and energy-efficient data management strategies.",
        authorId: 1,
        featuredImage: "https://images.unsplash.com/photo-1606765962248-7ff407b51667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        tags: ["sustainability", "cloud-computing", "green-it", "carbon-footprint"],
        published: true,
        publishDate: new Date("2023-04-15")
      },
      {
        title: "Data-Driven Environmental Decision Making",
        category: "Research",
        slug: "data-driven-environmental-decision-making",
        content: `<p>Environmental challenges are complex and multifaceted, requiring sophisticated approaches to problem-solving. At ECODATA CIC, we believe in the power of data to drive more effective environmental decisions and actions.</p>
        
        <h3>The Importance of Environmental Data</h3>
        <p>Quality environmental data provides the foundation for understanding ecological systems, identifying problems, and measuring the effectiveness of interventions. Without reliable data, environmental initiatives risk being misdirected or ineffective.</p>
        
        <h3>Challenges in Environmental Data Collection</h3>
        <p>Many organizations face significant challenges in collecting, managing, and analyzing environmental data, including:</p>
        <ul>
          <li>Disparate data sources with inconsistent formats</li>
          <li>High costs of environmental monitoring equipment</li>
          <li>Difficulties in establishing meaningful baselines</li>
          <li>Limited technical capacity for advanced data analysis</li>
        </ul>
        
        <h3>Our Approach: Democratizing Environmental Data</h3>
        <p>ECODATA CIC focuses on making environmental data more accessible, understandable, and actionable through:</p>
        <ul>
          <li><strong>Integrated data platforms</strong> that consolidate multiple environmental metrics in one place</li>
          <li><strong>Low-cost monitoring solutions</strong> leveraging IoT and community science approaches</li>
          <li><strong>Advanced visualization tools</strong> that communicate complex environmental data clearly</li>
          <li><strong>Predictive analytics</strong> that help anticipate environmental impacts and outcomes</li>
        </ul>
        
        <h3>Case Study: Watershed Management</h3>
        <p>A local river conservation trust partnered with ECODATA CIC to develop a comprehensive water quality monitoring program. By implementing affordable sensors, citizen science protocols, and an integrated data dashboard, the organization now has real-time insights into water quality factors that guide their restoration efforts and policy advocacy.</p>
        
        <h3>Turning Data into Action</h3>
        <p>Data alone doesn't solve environmental problems – it's how the data informs action that matters. Our environmental consultants work with organizations to translate data insights into practical strategies, policy recommendations, and community engagement initiatives.</p>
        
        <h3>Start Your Environmental Data Journey</h3>
        <p>Whether you're a municipal government, conservation organization, or business looking to reduce environmental impact, ECODATA CIC can help you develop the data infrastructure and analytical tools you need for more effective environmental decision-making.</p>`,
        excerpt: "Learn how ECODATA CIC is transforming environmental management through data-driven approaches, integrated monitoring solutions, and accessible analytics that empower more effective conservation and sustainability initiatives.",
        authorId: 1,
        featuredImage: "https://images.unsplash.com/photo-1578496781379-7dcfb995293d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        tags: ["environmental-data", "conservation", "data-analytics", "sustainability"],
        published: true,
        publishDate: new Date("2023-03-22")
      },
      {
        title: "Green Tech and Social Impact: The Future of Ethical Technology",
        category: "Technology",
        slug: "green-tech-and-social-impact-future-of-ethical-technology",
        content: `<p>The technology sector is at a crossroads. While digital innovation continues to transform our world in extraordinary ways, we must ensure these advances don't come at the expense of environmental sustainability or social equity. At ECODATA CIC, we envision a future where technology serves both people and planet.</p>
        
        <h3>The Rise of Ethical Technology</h3>
        <p>A growing movement within the tech industry is pushing for more ethical, sustainable approaches to innovation. This includes considerations of environmental impact, accessibility, privacy, labor conditions, and the social consequences of digital tools.</p>
        
        <h3>Green Tech: Beyond Energy Efficiency</h3>
        <p>While energy-efficient hardware and renewable-powered data centers are important, truly green technology encompasses the entire lifecycle of digital products and services:</p>
        <ul>
          <li><strong>Sustainable design principles</strong> that minimize resource use and waste</li>
          <li><strong>Circular economy approaches</strong> to hardware manufacturing and disposal</li>
          <li><strong>Carbon-aware software development</strong> that optimizes for minimal emissions</li>
          <li><strong>Environmental impact assessments</strong> throughout the development process</li>
        </ul>
        
        <h3>Technology for Social Good</h3>
        <p>At ECODATA CIC, we believe technology should serve human needs and address societal challenges:</p>
        <ul>
          <li><strong>Digital inclusion</strong> initiatives that ensure technology benefits marginalized communities</li>
          <li><strong>Civic tech solutions</strong> that enhance democratic participation and government transparency</li>
          <li><strong>Assistive technologies</strong> that improve quality of life for people with disabilities</li>
          <li><strong>Data tools</strong> for humanitarian organizations and social enterprises</li>
        </ul>
        
        <h3>Our Community-Centered Approach</h3>
        <p>Technology development should never happen in a vacuum. We practice community-centered design, engaging with users and stakeholders throughout the process to ensure our solutions truly address real-world needs and contexts.</p>
        
        <h3>Case Study: Tech for Community Resilience</h3>
        <p>ECODATA CIC recently developed a community resilience platform for a network of urban neighborhoods facing climate-related challenges. The platform combines environmental monitoring, resource sharing, emergency communication, and collaborative planning tools – all designed with extensive community input and operated by local residents.</p>
        
        <h3>Join the Ethical Tech Movement</h3>
        <p>Whether you're a technology professional looking to align your work with your values, an organization seeking more ethical tech solutions, or a community group with digital needs, ECODATA CIC is here to help build a more sustainable, equitable technological future.</p>`,
        excerpt: "Explore how ECODATA CIC is pioneering the integration of environmental sustainability and social impact in technology development, creating digital solutions that benefit communities while minimizing ecological harm.",
        authorId: 1,
        featuredImage: "https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        tags: ["ethical-technology", "social-impact", "sustainability", "community-tech"],
        published: true,
        publishDate: new Date("2023-02-08")
      }
    ];
    
    blogPosts.forEach(post => this.createBlogPost(post));
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
    // Ensure role is never undefined to match the User type
    const userWithRole = {
      ...insertUser,
      role: insertUser.role || "user" // Default to "user" if role is not provided
    };
    const user: User = { ...userWithRole, id, createdAt: now };
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
    // Ensure imageUrl is never undefined
    const testimonialData = {
      ...insertTestimonial,
      imageUrl: insertTestimonial.imageUrl ?? null
    };
    const testimonial: Testimonial = { 
      ...testimonialData, 
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
    // Ensure optional properties have the correct values to match BlogPost type
    const blogPostData = {
      ...insertPost,
      featuredImage: insertPost.featuredImage ?? null,
      tags: insertPost.tags ?? null,
      published: insertPost.published ?? false,
      publishDate: insertPost.publishDate ?? null
    };
    const post: BlogPost = { 
      ...blogPostData, 
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

  // Partners
  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partners.values());
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    return this.partners.get(id);
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const id = this.currentPartnerId++;
    const newPartner: Partner = {
      id,
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl ?? null,
      category: partner.category || "technology", // Default to "technology" if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.partners.set(id, newPartner);
    return newPartner;
  }

  async updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined> {
    const existingPartner = this.partners.get(id);
    
    if (!existingPartner) {
      return undefined;
    }
    
    // Create a properly typed updated partner object
    const updatedPartner: Partner = {
      ...existingPartner,
      name: partner.name ?? existingPartner.name,
      logoUrl: partner.logoUrl ?? existingPartner.logoUrl,
      websiteUrl: partner.websiteUrl !== undefined ? partner.websiteUrl : existingPartner.websiteUrl,
      category: partner.category ?? existingPartner.category,
      updatedAt: new Date()
    };
    
    this.partners.set(id, updatedPartner);
    return updatedPartner;
  }

  async deletePartner(id: number): Promise<boolean> {
    return this.partners.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  async updateContactMessageReadStatus(id: number, isRead: boolean): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set({ isRead })
      .where(eq(contactMessages.id, id))
      .returning();
    return message || undefined;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return result.count > 0;
  }

  // Newsletter Subscribers
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }

  async getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return subscriber || undefined;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber || undefined;
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    // Set default values if not provided
    const subscriberData = {
      ...insertSubscriber,
      subscriptionTier: insertSubscriber.subscriptionTier || "basic",
      interests: insertSubscriber.interests || []
    };
    
    const [subscriber] = await db.insert(newsletterSubscribers).values(subscriberData).returning();
    return subscriber;
  }

  async deleteNewsletterSubscriber(id: number): Promise<boolean> {
    const result = await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return result.count > 0;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const now = new Date();
    const [service] = await db
      .update(services)
      .set({ ...serviceUpdate, updatedAt: now })
      .where(eq(services.id, id))
      .returning();
    return service || undefined;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.count > 0;
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const now = new Date();
    const [testimonial] = await db
      .update(testimonials)
      .set({ ...testimonialUpdate, updatedAt: now })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial || undefined;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return result.count > 0;
  }

  // Impact Metrics
  async getImpactMetrics(): Promise<ImpactMetric[]> {
    return db.select().from(impactMetrics);
  }

  async getImpactMetric(id: number): Promise<ImpactMetric | undefined> {
    const [metric] = await db.select().from(impactMetrics).where(eq(impactMetrics.id, id));
    return metric || undefined;
  }

  async createImpactMetric(insertMetric: InsertImpactMetric): Promise<ImpactMetric> {
    const [metric] = await db.insert(impactMetrics).values(insertMetric).returning();
    return metric;
  }

  async updateImpactMetric(id: number, metricUpdate: Partial<InsertImpactMetric>): Promise<ImpactMetric | undefined> {
    const now = new Date();
    const [metric] = await db
      .update(impactMetrics)
      .set({ ...metricUpdate, updatedAt: now })
      .where(eq(impactMetrics.id, id))
      .returning();
    return metric || undefined;
  }

  async deleteImpactMetric(id: number): Promise<boolean> {
    const result = await db.delete(impactMetrics).where(eq(impactMetrics.id, id));
    return result.count > 0;
  }

  // Blog Posts
  async getBlogPosts(options?: { published?: boolean }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (options?.published !== undefined) {
      query = query.where(eq(blogPosts.published, options.published));
    }
    
    return query.orderBy(desc(blogPosts.publishDate), desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const now = new Date();
    const [post] = await db
      .update(blogPosts)
      .set({ ...postUpdate, updatedAt: now })
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.count > 0;
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }

  async getSetting(id: number): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.id, id));
    return setting || undefined;
  }

  async getSettingByKey(section: string, key: string): Promise<Setting | undefined> {
    const [setting] = await db
      .select()
      .from(settings)
      .where(and(eq(settings.section, section), eq(settings.key, key)));
    return setting || undefined;
  }

  async createSetting(insertSetting: InsertSetting): Promise<Setting> {
    const [setting] = await db.insert(settings).values(insertSetting).returning();
    return setting;
  }

  async updateSetting(id: number, settingUpdate: Partial<InsertSetting>): Promise<Setting | undefined> {
    const now = new Date();
    const [setting] = await db
      .update(settings)
      .set({ ...settingUpdate, updatedAt: now })
      .where(eq(settings.id, id))
      .returning();
    return setting || undefined;
  }

  async deleteSetting(id: number): Promise<boolean> {
    const result = await db.delete(settings).where(eq(settings.id, id));
    return result.count > 0;
  }

  // Partners
  async getPartners(): Promise<Partner[]> {
    return db.select().from(partners);
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values(insertPartner).returning();
    return partner;
  }

  async updatePartner(id: number, partnerUpdate: Partial<InsertPartner>): Promise<Partner | undefined> {
    const now = new Date();
    const [partner] = await db
      .update(partners)
      .set({ ...partnerUpdate, updatedAt: now })
      .where(eq(partners.id, id))
      .returning();
    return partner || undefined;
  }

  async deletePartner(id: number): Promise<boolean> {
    const result = await db.delete(partners).where(eq(partners.id, id));
    return result.count > 0;
  }
}

// Choose the correct database implementation based on which database is available
export const storage = 
  // Try PostgreSQL first
  process.env.DATABASE_URL
  ? new DatabaseStorage() // Prefer PostgreSQL if credentials are provided
  : (process.env.MSSQL_SERVER && process.env.MSSQL_DATABASE && process.env.MSSQL_USER && process.env.MSSQL_PASSWORD)
    ? new DatabaseStorage() // Fall back to MSSQL if available
    : new MemStorage();    // Use in-memory if no database is available