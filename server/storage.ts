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
  donations, type Donation, type InsertDonation,
  subscriptions, type Subscription, type InsertSubscription,
  projectProposals, type ProjectProposal, type InsertProjectProposal,
  userActivityLogs, type UserActivityLog, type InsertUserActivityLog,
  impactProjects, type ImpactProject, type InsertImpactProject,
  impactTimelineEvents, type ImpactTimelineEvent, type InsertImpactTimelineEvent,
  caseStudies, type CaseStudy, type InsertCaseStudy,
  publications, type Publication, type InsertPublication,
  faqs, type FAQ, type InsertFAQ,
  userFeedback, type UserFeedback, type InsertUserFeedback,
  errorReports, type ErrorReport, type InsertErrorReport,
  passwordResetTokens, type PasswordResetToken, type InsertPasswordResetToken,
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
import { randomBytes } from "crypto";
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
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserFreeConsultationUsage(id: number): Promise<User | undefined>;
  updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId?: string }): Promise<User | undefined>;
  
  // User Activity Logs
  getUserActivityLogs(userId: number): Promise<UserActivityLog[]>;
  createUserActivityLog(log: InsertUserActivityLog): Promise<UserActivityLog>;
  
  // Project Proposals
  getProjectProposals(userId?: number): Promise<ProjectProposal[]>;
  getProjectProposal(id: number): Promise<ProjectProposal | undefined>;
  createProjectProposal(proposal: InsertProjectProposal): Promise<ProjectProposal>;
  updateProjectProposal(id: number, proposal: Partial<InsertProjectProposal>): Promise<ProjectProposal | undefined>;
  deleteProjectProposal(id: number): Promise<boolean>;
  
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
  
  // Donations
  getDonations(): Promise<Donation[]>;
  getDonationsByEmail(email: string): Promise<Donation[]>;
  getDonationsByUserId(userId: number): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string): Promise<Donation | undefined>;
  
  // Subscriptions
  getSubscriptions(): Promise<Subscription[]>;
  getSubscriptionsByEmail(email: string): Promise<Subscription[]>;
  getSubscriptionsByUserId(userId: number): Promise<Subscription[]>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<Subscription | undefined>;
  
  // Impact Projects
  getImpactProjects(options?: { featured?: boolean, category?: string }): Promise<ImpactProject[]>;
  getImpactProject(id: number): Promise<ImpactProject | undefined>;
  createImpactProject(project: InsertImpactProject): Promise<ImpactProject>;
  updateImpactProject(id: number, project: Partial<InsertImpactProject>): Promise<ImpactProject | undefined>;
  deleteImpactProject(id: number): Promise<boolean>;
  
  // Impact Timeline Events
  getImpactTimelineEvents(projectId?: number): Promise<ImpactTimelineEvent[]>;
  getImpactTimelineEvent(id: number): Promise<ImpactTimelineEvent | undefined>;
  createImpactTimelineEvent(event: InsertImpactTimelineEvent): Promise<ImpactTimelineEvent>;
  updateImpactTimelineEvent(id: number, event: Partial<InsertImpactTimelineEvent>): Promise<ImpactTimelineEvent | undefined>;
  deleteImpactTimelineEvent(id: number): Promise<boolean>;
  
  // Case Studies
  getCaseStudies(options?: { published?: boolean }): Promise<CaseStudy[]>;
  getCaseStudyById(id: number): Promise<CaseStudy | undefined>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: number, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined>;
  deleteCaseStudy(id: number): Promise<boolean>;
  
  // Publications
  getPublications(options?: { published?: boolean }): Promise<Publication[]>;
  getPublicationById(id: number): Promise<Publication | undefined>;
  createPublication(publication: InsertPublication): Promise<Publication>;
  updatePublication(id: number, publication: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<boolean>;
  
  // FAQs
  getFAQs(): Promise<FAQ[]>;
  getFAQsByCategory(category: string): Promise<FAQ[]>;
  getFAQById(id: number): Promise<FAQ | undefined>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  updateFAQ(id: number, faq: Partial<InsertFAQ>): Promise<FAQ | undefined>;
  deleteFAQ(id: number): Promise<boolean>;
  
  // User Feedback
  getUserFeedback(options?: { resolved?: boolean, category?: string }): Promise<UserFeedback[]>;
  getUserFeedbackById(id: number): Promise<UserFeedback | undefined>;
  createUserFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
  updateUserFeedbackResolution(id: number, resolved: boolean, adminNotes?: string): Promise<UserFeedback | undefined>;
  deleteUserFeedback(id: number): Promise<boolean>;
  
  // Error Reports
  getErrorReports(options?: { status?: string }): Promise<ErrorReport[]>;
  getErrorReportById(id: number): Promise<ErrorReport | undefined>;
  createErrorReport(report: InsertErrorReport): Promise<ErrorReport>;
  updateErrorReportStatus(id: number, status: string, adminNotes?: string): Promise<ErrorReport | undefined>;
  deleteErrorReport(id: number): Promise<boolean>;
  
  // Password Reset Tokens
  createPasswordResetToken(userId: number): Promise<PasswordResetToken>;
  getPasswordResetTokenByToken(token: string): Promise<PasswordResetToken | undefined>;
  validatePasswordResetToken(token: string): Promise<User | undefined>;
  markTokenAsUsed(tokenId: number): Promise<PasswordResetToken | undefined>;
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
  private donations: Map<number, Donation>;
  private subscriptions: Map<number, Subscription>;
  private _projectProposals: Map<number, ProjectProposal>;
  private _userActivityLogs: Map<number, UserActivityLog>;
  private _impactProjects: Map<number, ImpactProject>;
  private _impactTimelineEvents: Map<number, ImpactTimelineEvent>;
  private _caseStudies: Map<number, CaseStudy>;
  private _publications: Map<number, Publication>;
  private _faqs: Map<number, FAQ>;
  private _userFeedback: Map<number, UserFeedback>;
  private _errorReports: Map<number, ErrorReport>;
  private _passwordResetTokens: Map<number, PasswordResetToken>;
  
  private currentUserId: number;
  private currentContactMessageId: number;
  private currentNewsletterSubscriberId: number;
  private currentServiceId: number;
  private currentTestimonialId: number;
  private currentImpactMetricId: number;
  private currentBlogPostId: number;
  private currentSettingId: number;
  private currentPartnerId: number;
  private currentDonationId: number;
  private currentSubscriptionId: number;
  private _currentProjectProposalId: number;
  private _currentUserActivityLogId: number;
  private _currentImpactProjectId: number;
  private _currentImpactTimelineEventId: number;
  private _currentCaseStudyId: number;
  private _currentPublicationId: number;
  private _currentFaqId: number;
  private _currentUserFeedbackId: number;
  private _currentErrorReportId: number;
  private _currentPasswordResetTokenId: number;

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
    this.donations = new Map();
    this.subscriptions = new Map();
    this._projectProposals = new Map();
    this._userActivityLogs = new Map();
    this._impactProjects = new Map();
    this._impactTimelineEvents = new Map();
    this._caseStudies = new Map();
    this._publications = new Map();
    this._faqs = new Map();
    this._userFeedback = new Map();
    this._errorReports = new Map();
    this._passwordResetTokens = new Map();
    
    this.currentUserId = 1;
    this.currentContactMessageId = 1;
    this.currentNewsletterSubscriberId = 1;
    this.currentServiceId = 1;
    this.currentTestimonialId = 1;
    this.currentImpactMetricId = 1;
    this.currentBlogPostId = 1;
    this.currentSettingId = 1;
    this.currentPartnerId = 1;
    this.currentDonationId = 1;
    this.currentSubscriptionId = 1;
    this._currentProjectProposalId = 1;
    this._currentUserActivityLogId = 1;
    this._currentImpactProjectId = 1;
    this._currentImpactTimelineEventId = 1;
    this._currentCaseStudyId = 1;
    this._currentPublicationId = 1;
    this._currentFaqId = 1;
    this._currentUserFeedbackId = 1;
    this._currentErrorReportId = 1;
    this._currentPasswordResetTokenId = 1;
    
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
    
    // Add sample impact projects
    const impactProjects = [
      {
        title: "Urban Green Data Initiative",
        description: "A collaborative project to collect and analyze environmental data in urban areas to inform sustainable city planning and green space development.",
        category: "environmental",
        location: "Manchester, UK",
        latitude: 53.4808,
        longitude: -2.2426,
        featuredImage: "https://images.unsplash.com/photo-1610036615665-09c7edf27288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "active",
        startDate: new Date("2022-03-15"),
        endDate: null,
        impact: "Improved green space planning in 5 urban districts",
        partners: ["Manchester City Council", "University of Manchester"],
        budget: 75000,
        featured: true
      },
      {
        title: "Rural Digital Inclusion",
        description: "Bringing technology training and internet access to underserved rural communities to bridge the digital divide and create economic opportunities.",
        category: "social",
        location: "Yorkshire Dales, UK",
        latitude: 54.3097,
        longitude: -2.2088,
        featuredImage: "https://images.unsplash.com/photo-1586769412527-f3d9d8211867?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
        status: "active",
        startDate: new Date("2022-06-10"),
        endDate: null,
        impact: "Connected 12 rural communities with training for over 800 residents",
        partners: ["Yorkshire Rural Network", "BT Group"],
        budget: 120000,
        featured: true
      },
      {
        title: "Green Tech Innovation Hub",
        description: "An incubator for startups focused on developing technology solutions to environmental challenges, providing mentorship, technical resources, and funding opportunities.",
        category: "technology",
        location: "Bristol, UK",
        latitude: 51.4545,
        longitude: -2.5879,
        featuredImage: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "planning",
        startDate: new Date("2023-01-10"),
        endDate: null,
        impact: "Supported 8 environmental tech startups in their early stages",
        partners: ["Bristol University", "Tech Nation", "Future Planet Capital"],
        budget: 350000,
        featured: true
      },
      {
        title: "Community Air Quality Monitoring",
        description: "Installing low-cost air quality sensors in partnership with community organizations to collect data, raise awareness about air pollution, and advocate for cleaner air policies.",
        category: "environmental",
        location: "Birmingham, UK",
        latitude: 52.4862,
        longitude: -1.8904,
        featuredImage: "https://images.unsplash.com/photo-1573511860302-28c11ff60a20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "completed",
        startDate: new Date("2021-09-20"),
        endDate: new Date("2022-10-30"),
        impact: "Installed 120 sensors and collected over 200,000 data points on urban air quality",
        partners: ["Clean Air Birmingham", "University of Birmingham"],
        budget: 95000,
        featured: false
      },
      {
        title: "Data Ethics Education Platform",
        description: "An online learning platform to educate organizations and individuals about ethical data practices, privacy considerations, and responsible AI.",
        category: "education",
        location: "Online",
        latitude: 51.5074,
        longitude: -0.1278,
        featuredImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "active",
        startDate: new Date("2022-11-05"),
        endDate: null,
        impact: "Trained over 3,000 professionals in ethical data practices",
        partners: ["Open Data Institute", "Alan Turing Institute"],
        budget: 185000,
        featured: false
      }
    ];
    
    // Add the impact projects to the storage
    impactProjects.forEach(project => this.createImpactProject(project));
    
    // Add sample case studies
    const caseStudies = [
      {
        title: "Urban Air Quality Monitoring Network",
        location: "Manchester, UK",
        slug: "urban-air-quality-monitoring-network",
        content: "# Urban Air Quality Monitoring Network\n\nECODATA CIC partnered with the Manchester City Council and local community organizations to implement a comprehensive air quality monitoring network across the city.\n\n## Challenge\nManchester, like many urban areas, faces significant air pollution challenges that impact public health and quality of life. Traditional monitoring stations were limited in number and provided insufficient granular data to inform targeted interventions.\n\n## Approach\nWe designed and deployed a network of 120 low-cost air quality sensors across key areas of the city, focusing on high-risk zones near schools, hospitals, and major traffic corridors. Our solution incorporated:\n\n- Calibrated PM2.5, PM10, NO2, and O3 sensors\n- Solar-powered operations where possible\n- Real-time data transmission to a central dashboard\n- Community engagement program to involve residents in monitoring\n- Integration with traffic management systems\n\n## Results\nThe project delivered significant environmental and social benefits:\n\n- Identified 15 previously unknown pollution hotspots\n- Led to targeted traffic management changes that reduced pollution by 23% in school zones\n- Provided data for new urban planning policies\n- Created a public awareness dashboard accessed by over 15,000 residents monthly\n- Assisted vulnerable populations with real-time alerts during pollution events\n\n## Sustainability Impact\nBeyond technical implementation, the project catalyzed broader sustainable actions, including increased cycling infrastructure funding, expanded public transport schedules, and new school anti-idling campaigns. The data also supported successful grant applications for green infrastructure projects totaling £1.2 million.",
        summary: "Implementation of a citywide air quality monitoring network with 120 sensors that identified pollution hotspots and led to targeted interventions reducing pollution by 23% in school zones.",
        sector: "Environmental Monitoring",
        impactType: "Environmental",
        coverImage: "https://images.unsplash.com/photo-1573511860302-28c11ff60a20?auto=format&fit=crop&w=800&q=80",
        clientName: "Manchester City Council",
        technologies: ["IoT Sensors", "Data Analytics", "Cloud Infrastructure"],
        published: true,
        publishDate: new Date("2022-07-15"),
        stats: {
          sensors: 120,
          pollutionReduction: "23%",
          userEngagement: 15000
        }
      },
      {
        title: "Rural Digital Inclusion Program",
        location: "Yorkshire Dales, UK",
        slug: "rural-digital-inclusion-program",
        content: "# Rural Digital Inclusion Program\n\nECODATA CIC worked with the Yorkshire Rural Network to bridge the digital divide in remote communities across the Yorkshire Dales.\n\n## Challenge\nRural communities in the Yorkshire Dales faced significant digital exclusion, with limited broadband access, insufficient digital skills, and lack of access to technology. This created educational, economic, and social disadvantages compared to urban areas.\n\n## Approach\nWe implemented a comprehensive digital inclusion strategy involving:\n\n- Establishing five community technology hubs with free internet access\n- Delivering digital skills training programs tailored for different age groups\n- Coordinating with service providers to improve broadband infrastructure\n- Providing refurbished devices to low-income households\n- Creating a tech support network staffed by trained local volunteers\n\n## Results\nThe program achieved remarkable outcomes:\n\n- Connected 12 isolated villages with reliable broadband internet\n- Trained over 800 residents in essential digital skills\n- Distributed 250 refurbished computers to households in need\n- Created 15 part-time jobs for local tech facilitators\n- Enabled 35 residents to secure remote work opportunities\n\n## Sustainability Impact\nThe program had broader sustainability implications by reducing travel needs (lowering carbon emissions), enabling remote education during COVID-19, and connecting local businesses to wider markets. By building local digital capacity, we helped create more resilient communities less dependent on physical transportation infrastructure.",
        summary: "A comprehensive digital inclusion initiative that connected 12 rural communities, trained 800+ residents, and created economic opportunities while reducing travel-related carbon emissions.",
        sector: "Digital Inclusion",
        impactType: "Social",
        coverImage: "https://images.unsplash.com/photo-1586769412527-f3d9d8211867?auto=format&fit=crop&w=800&q=80",
        clientName: "Yorkshire Rural Network",
        technologies: ["Broadband Infrastructure", "Digital Education", "Community Engagement"],
        published: true,
        publishDate: new Date("2023-01-22"),
        stats: {
          communitiesConnected: 12,
          peopleTrainedInDigitalSkills: 800,
          jobsCreated: 15
        }
      },
      {
        title: "Circular Economy Data Platform",
        location: "Bristol, UK",
        slug: "circular-economy-data-platform",
        content: "# Circular Economy Data Platform\n\nECODATA CIC developed a data-driven platform to support Bristol's transition to a circular economy.\n\n## Challenge\nBristol, like many cities, faced challenges in tracking material flows, identifying waste reduction opportunities, and connecting potential partners in circular economy initiatives. Businesses and policymakers lacked the data infrastructure to make informed decisions about resource efficiency.\n\n## Approach\nWe created a comprehensive digital platform that:\n\n- Mapped material flows across key sectors (construction, food, manufacturing)\n- Provided analytics tools to identify circular economy opportunities\n- Connected businesses with potential partners for waste-to-resource exchanges\n- Integrated with existing waste management and procurement systems\n- Visualized environmental and economic benefits of circular initiatives\n\n## Results\nThe platform catalyzed significant circular economy progress:\n\n- Enabled 45 new material exchange partnerships between businesses\n- Diverted 1,200 tonnes of waste from landfill in the first year\n- Facilitated investment of £3.2 million in circular business models\n- Supported policymakers with data for new procurement guidelines\n- Created a replicable model adopted by three other UK cities\n\n## Sustainability Impact\nThe project contributed to broader sustainability goals by reducing extraction of virgin materials, lowering greenhouse gas emissions from waste processing, and creating new green business opportunities. The platform continues to evolve with new data sources and analytical capabilities.",
        summary: "Development of a data platform mapping material flows across Bristol, enabling 45 new circular economy partnerships and diverting 1,200 tonnes of waste from landfill annually.",
        sector: "Circular Economy",
        impactType: "Environmental",
        coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
        clientName: "Bristol City Council",
        technologies: ["Data Analytics", "Machine Learning", "Material Flow Analysis"],
        published: true,
        publishDate: new Date("2022-11-05"),
        stats: {
          materialExchanges: 45,
          wasteDiverted: "1,200 tonnes",
          investmentFacilitated: "£3.2 million"
        }
      }
    ];
    
    // Add the case studies to storage
    caseStudies.forEach(caseStudy => this.createCaseStudy(caseStudy));
    
    // Add sample publications
    const publications = [
      {
        type: "Research Paper",
        title: "Measuring the Environmental Impact of Cloud Computing Infrastructure",
        summary: "This paper presents a comprehensive methodology for assessing the environmental footprint of cloud computing services, incorporating energy consumption, water usage, and hardware lifecycle impacts.",
        organization: "Journal of Sustainable Computing",
        year: 2022,
        topic: "Green Computing",
        published: true,
        coverImage: "https://images.unsplash.com/photo-1483000805330-4eaf0a0d82df?auto=format&fit=crop&w=800&q=80",
        authors: ["Dr. James Richards", "Dr. Sarah Williams", "Mark Thompson"],
        fileUrl: "https://ecodatacic.org/publications/measuring-environmental-impact-cloud-computing.pdf"
      },
      {
        type: "White Paper",
        title: "Data-Driven Approaches to Biodiversity Conservation",
        summary: "This white paper explores how modern data collection, machine learning, and spatial analysis techniques can enhance biodiversity conservation efforts and improve ecological monitoring.",
        organization: "ECODATA CIC",
        year: 2023,
        topic: "Biodiversity",
        published: true,
        coverImage: "https://images.unsplash.com/photo-1621459555843-75ca4893cd5e?auto=format&fit=crop&w=800&q=80",
        authors: ["Dr. Emma Chen", "Prof. Robert Davis"],
        fileUrl: "https://ecodatacic.org/publications/data-driven-biodiversity-conservation.pdf"
      },
      {
        type: "Policy Brief",
        title: "Ethical Frameworks for Environmental Data Collection",
        summary: "This policy brief outlines recommended governance structures and ethical guidelines for the collection, storage, and usage of environmental data, with special consideration for indigenous knowledge and community data sovereignty.",
        organization: "UK Environmental Data Initiative",
        year: 2022,
        topic: "Data Ethics",
        published: true,
        coverImage: "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=800&q=80",
        authors: ["Dr. Maya Patel", "Christopher Johnson", "Dr. Lisa Turner"],
        fileUrl: "https://ecodatacic.org/publications/ethical-frameworks-environmental-data.pdf"
      }
    ];
    
    // Add the publications to storage
    publications.forEach(publication => this.createPublication(publication));
    
    // Add sample FAQs
    const faqs = [
      {
        category: "Services",
        question: "What types of organizations do you work with?",
        answer: "ECODATA CIC works with a diverse range of organizations including local authorities, nonprofits, academic institutions, and private sector companies. We specialize in supporting organizations that are committed to improving their environmental and social impact through better data practices and technology solutions.",
        order: 1
      },
      {
        category: "Services",
        question: "Do you offer training for our team?",
        answer: "Yes, we offer comprehensive training programs tailored to your organization's needs. Our training covers topics like sustainable IT practices, data analytics for environmental impact assessment, and digital skills for green economy jobs. All our training programs include practical, hands-on components and ongoing support resources.",
        order: 2
      },
      {
        category: "Technology",
        question: "How do you ensure data security and privacy?",
        answer: "We implement industry-leading security measures including encryption, secure access controls, regular security audits, and compliance with GDPR and other relevant regulations. Our ethical data framework ensures transparency about how data is collected, stored, and used, with special attention to sensitive environmental and community data.",
        order: 1
      },
      {
        category: "Technology",
        question: "What technologies do you use for your data platforms?",
        answer: "We employ a range of technologies selected for both performance and sustainability. Our stack typically includes energy-efficient cloud infrastructure, open-source data processing frameworks like Apache Spark, and visualization tools that make complex environmental data accessible. We prioritize technologies with lower carbon footprints where feasible.",
        order: 2
      },
      {
        category: "Impact",
        question: "How do you measure the impact of your projects?",
        answer: "We establish clear baseline measurements before projects begin and track both technical and sustainability metrics throughout implementation. Depending on the project, we might measure reduced carbon emissions, improved resource efficiency, community engagement levels, or enhanced decision-making capabilities. We provide transparent impact reports to all partners.",
        order: 1
      },
      {
        category: "Impact",
        question: "Do you offer ongoing support after project completion?",
        answer: "Yes, sustainability is built into our approach, which includes ensuring projects continue to deliver impact long-term. We offer different support packages including technical maintenance, data analysis services, knowledge transfer to your team, and periodic impact assessments to ensure continued value from our solutions.",
        order: 2
      }
    ];
    
    // Add the FAQs to storage
    faqs.forEach(faq => this.createFAQ(faq));
    
    // Add sample timeline events for the projects
    const impactTimelineEvents = [
      {
        projectId: 1, // Urban Green Data Initiative
        title: "Project Launch",
        description: "Official launch of the Urban Green Data Initiative with community stakeholders and city officials.",
        date: new Date("2022-03-15"),
        importance: 5,
        mediaUrl: "https://images.unsplash.com/photo-1629111462456-06fb9368de7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
      },
      {
        projectId: 1,
        title: "Sensor Deployment Phase 1",
        description: "First batch of environmental sensors deployed across Manchester's city center.",
        date: new Date("2022-04-20"),
        importance: 3,
        mediaUrl: "https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
      },
      {
        projectId: 1,
        title: "Data Dashboard Release",
        description: "Public release of the real-time data dashboard showing environmental metrics across the city.",
        date: new Date("2022-08-10"),
        importance: 4,
        mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        projectId: 1,
        title: "City Planning Integration",
        description: "Integration of collected data with Manchester's urban planning department for future green space development.",
        date: new Date("2023-01-25"),
        importance: 4,
        mediaUrl: null
      },
      {
        projectId: 2, // Rural Digital Inclusion
        title: "Project Kick-off",
        description: "Rural Digital Inclusion project begins with community meetings in the Yorkshire Dales.",
        date: new Date("2022-06-10"),
        importance: 5,
        mediaUrl: "https://images.unsplash.com/photo-1578932750295-f5075e86f9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        projectId: 2,
        title: "First Training Center",
        description: "Opening of the first digital skills training center in Hawes, Yorkshire.",
        date: new Date("2022-09-05"),
        importance: 4,
        mediaUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        projectId: 2,
        title: "Broadband Installation Complete",
        description: "High-speed internet installation completed in 5 villages, connecting over 300 households.",
        date: new Date("2023-02-15"),
        importance: 5,
        mediaUrl: null
      },
      {
        projectId: 3, // Green Tech Innovation Hub
        title: "Hub Planning Workshop",
        description: "Initial planning workshop with key stakeholders to define the scope and mission of the Green Tech Innovation Hub.",
        date: new Date("2023-01-10"),
        importance: 3,
        mediaUrl: "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        projectId: 3,
        title: "Funding Secured",
        description: "Major funding milestone reached with investment from Future Planet Capital and public sector grants.",
        date: new Date("2023-04-20"),
        importance: 5,
        mediaUrl: null
      },
      {
        projectId: 4, // Community Air Quality Monitoring
        title: "Project Launch",
        description: "Launch of the Community Air Quality Monitoring project in Birmingham with citizen science volunteers.",
        date: new Date("2021-09-20"),
        importance: 4,
        mediaUrl: "https://images.unsplash.com/photo-1573511860302-28c11ff60a20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        projectId: 4,
        title: "Sensor Network Complete",
        description: "Installation of all 120 air quality sensors completed across Birmingham.",
        date: new Date("2022-01-30"),
        importance: 3,
        mediaUrl: null
      },
      {
        projectId: 4,
        title: "Research Paper Published",
        description: "Publication of research findings in the Journal of Environmental Monitoring, highlighting areas of concern for urban air quality.",
        date: new Date("2022-07-15"),
        importance: 4,
        mediaUrl: null
      },
      {
        projectId: 4,
        title: "Project Completion",
        description: "Official completion of the project with handover of monitoring systems to local community organizations for ongoing use.",
        date: new Date("2022-10-30"),
        importance: 5,
        mediaUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1436&q=80"
      },
      {
        projectId: 5, // Data Ethics Education Platform
        title: "Platform Development Begins",
        description: "Start of development for the online education platform on data ethics and responsible AI.",
        date: new Date("2022-11-05"),
        importance: 3,
        mediaUrl: null
      },
      {
        projectId: 5,
        title: "Beta Launch",
        description: "Beta version of the platform launched with initial courses on data privacy and ethical AI principles.",
        date: new Date("2023-02-20"),
        importance: 4,
        mediaUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      {
        projectId: 5,
        title: "Corporate Partnership Program",
        description: "Launch of the corporate training partnership program with five major companies enrolled.",
        date: new Date("2023-05-15"),
        importance: 5,
        mediaUrl: null
      }
    ];
    
    // Add the timeline events to the storage
    impactTimelineEvents.forEach(event => this.createImpactTimelineEvent(event));

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
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
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
    const user: User = { 
      ...userWithRole, 
      id, 
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImage: insertUser.profileImage || null,
      bio: insertUser.bio || null,
      interests: insertUser.interests || [],
      watchlist: insertUser.watchlist || [],
      notificationsEnabled: insertUser.notificationsEnabled ?? true,
      stripeCustomerId: null,
      lastLogin: null,
      isEmailVerified: false,
      verificationToken: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserFreeConsultationUsage(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      hasUsedFreeConsultation: true
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId?: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId: stripeInfo.stripeCustomerId,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
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
    // Ensure subscriptionTier is always set
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: now,
      subscriptionTier: insertSubscriber.subscriptionTier || "basic",
      interests: insertSubscriber.interests || null
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
  
  // Donations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }
  
  async getDonationsByEmail(email: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.userId === userId
    );
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }
  
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const newDonation: Donation = {
      id: this.currentDonationId++,
      userId: donation.userId || null,
      name: donation.name ?? null,
      email: donation.email,
      fundingGoalId: donation.fundingGoalId || null,
      createdAt: new Date(),
      status: donation.status || 'completed',
      amount: donation.amount,
      currency: donation.currency || 'gbp',
      stripePaymentId: donation.stripePaymentId,
      stripeSessionId: donation.stripeSessionId,
      isGiftAid: donation.isGiftAid || false,
      giftAidName: donation.giftAidName ?? null,
      giftAidAddress: donation.giftAidAddress ?? null,
      giftAidPostcode: donation.giftAidPostcode ?? null,
      metadata: donation.metadata ?? {}
    };
    this.donations.set(newDonation.id, newDonation);
    return newDonation;
  }
  
  async updateDonationStatus(id: number, status: string): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) {
      return undefined;
    }
    
    const updatedDonation: Donation = {
      ...donation,
      status
    };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }
  
  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }
  
  async getSubscriptionsByEmail(email: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      subscription => subscription.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      subscription => subscription.userId === userId
    );
  }
  
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }
  
  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      subscription => subscription.stripeSubscriptionId === stripeSubscriptionId
    );
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const newSubscription: Subscription = {
      id: this.currentSubscriptionId++,
      userId: subscription.userId || null,
      name: subscription.name ?? null,
      email: subscription.email,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      amount: subscription.amount,
      currency: subscription.currency || 'gbp',
      interval: subscription.interval,
      tier: subscription.tier || 'standard',
      status: subscription.status || 'active',
      isGiftAid: subscription.isGiftAid || false,
      giftAidName: subscription.giftAidName ?? null,
      giftAidAddress: subscription.giftAidAddress ?? null,
      giftAidPostcode: subscription.giftAidPostcode ?? null,
      canceledAt: null,
      currentPeriodEnd: subscription.currentPeriodEnd ?? null,
      metadata: subscription.metadata ?? {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptions.set(newSubscription.id, newSubscription);
    return newSubscription;
  }
  
  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      return undefined;
    }
    
    const updatedSubscription: Subscription = {
      ...subscription,
      status,
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  async cancelSubscription(id: number): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      return undefined;
    }
    
    const updatedSubscription: Subscription = {
      ...subscription,
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // User Activity Logs
  // These properties are moved to the class level declaration

  async getUserActivityLogs(userId: number): Promise<UserActivityLog[]> {
    return Array.from(this._userActivityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });
  }

  async createUserActivityLog(activityLog: InsertUserActivityLog): Promise<UserActivityLog> {
    const id = this._currentUserActivityLogId++;
    const now = new Date();
    const log: UserActivityLog = {
      id,
      userId: activityLog.userId,
      action: activityLog.action,
      details: activityLog.details || {},
      ipAddress: activityLog.ipAddress || null,
      userAgent: activityLog.userAgent || null,
      createdAt: now
    };
    this._userActivityLogs.set(id, log);
    return log;
  }

  // Project Proposals
  // These properties are moved to the class level declaration

  async getProjectProposals(userId?: number): Promise<ProjectProposal[]> {
    let proposals = Array.from(this._projectProposals.values());
    
    if (userId !== undefined) {
      proposals = proposals.filter(proposal => proposal.userId === userId);
    }
    
    return proposals.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }

  async getProjectProposal(id: number): Promise<ProjectProposal | undefined> {
    return this._projectProposals.get(id);
  }

  async createProjectProposal(proposal: InsertProjectProposal): Promise<ProjectProposal> {
    const id = this._currentProjectProposalId++;
    const now = new Date();
    const newProposal: ProjectProposal = {
      id,
      userId: proposal.userId,
      title: proposal.title,
      description: proposal.description,
      category: proposal.category,
      fundingNeeded: proposal.fundingNeeded || null,
      location: proposal.location || null,
      timeline: proposal.timeline || null,
      goals: proposal.goals || null,
      impact: proposal.impact || null,
      status: proposal.status || 'pending',
      attachments: proposal.attachments || [],
      adminNotes: null,
      createdAt: now,
      updatedAt: now
    };
    this._projectProposals.set(id, newProposal);
    return newProposal;
  }

  async updateProjectProposal(id: number, proposalUpdate: Partial<InsertProjectProposal>): Promise<ProjectProposal | undefined> {
    const proposal = this._projectProposals.get(id);
    if (!proposal) return undefined;
    
    const now = new Date();
    const updatedProposal = { 
      ...proposal, 
      ...proposalUpdate,
      updatedAt: now
    };
    this._projectProposals.set(id, updatedProposal);
    return updatedProposal;
  }

  async deleteProjectProposal(id: number): Promise<boolean> {
    return this._projectProposals.delete(id);
  }
  
  // Impact Projects
  async getImpactProjects(options?: { featured?: boolean, category?: string }): Promise<ImpactProject[]> {
    let projects = Array.from(this._impactProjects.values());
    
    if (options?.featured !== undefined) {
      projects = projects.filter(project => project.featured === options.featured);
    }
    
    if (options?.category) {
      projects = projects.filter(project => project.category === options.category);
    }
    
    return projects;
  }
  
  async getImpactProject(id: number): Promise<ImpactProject | undefined> {
    return this._impactProjects.get(id);
  }
  
  async createImpactProject(project: InsertImpactProject): Promise<ImpactProject> {
    const id = this._currentImpactProjectId++;
    const now = new Date();
    const newProject: ImpactProject = {
      id,
      ...project,
      createdAt: now,
      updatedAt: now
    };
    this._impactProjects.set(id, newProject);
    return newProject;
  }
  
  async updateImpactProject(id: number, projectUpdate: Partial<InsertImpactProject>): Promise<ImpactProject | undefined> {
    const project = this._impactProjects.get(id);
    if (!project) return undefined;
    
    const now = new Date();
    const updatedProject = { 
      ...project, 
      ...projectUpdate,
      updatedAt: now
    };
    this._impactProjects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteImpactProject(id: number): Promise<boolean> {
    return this._impactProjects.delete(id);
  }
  
  // Impact Timeline Events
  async getImpactTimelineEvents(projectId?: number): Promise<ImpactTimelineEvent[]> {
    let events = Array.from(this._impactTimelineEvents.values());
    
    if (projectId !== undefined) {
      events = events.filter(event => event.projectId === projectId);
    }
    
    // Sort by date and then by importance (descending)
    return events.sort((a, b) => {
      // First, sort by date (newest first)
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are equal, sort by importance (highest first)
      return (b.importance || 1) - (a.importance || 1);
    });
  }
  
  async getImpactTimelineEvent(id: number): Promise<ImpactTimelineEvent | undefined> {
    return this._impactTimelineEvents.get(id);
  }
  
  async createImpactTimelineEvent(event: InsertImpactTimelineEvent): Promise<ImpactTimelineEvent> {
    const id = this._currentImpactTimelineEventId++;
    const now = new Date();
    const newEvent: ImpactTimelineEvent = {
      id,
      ...event,
      createdAt: now,
      updatedAt: now
    };
    this._impactTimelineEvents.set(id, newEvent);
    return newEvent;
  }
  
  async updateImpactTimelineEvent(id: number, eventUpdate: Partial<InsertImpactTimelineEvent>): Promise<ImpactTimelineEvent | undefined> {
    const event = this._impactTimelineEvents.get(id);
    if (!event) return undefined;
    
    const now = new Date();
    const updatedEvent = { 
      ...event, 
      ...eventUpdate,
      updatedAt: now
    };
    this._impactTimelineEvents.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteImpactTimelineEvent(id: number): Promise<boolean> {
    return this._impactTimelineEvents.delete(id);
  }
  
  // Case Studies
  async getCaseStudies(options?: { published?: boolean }): Promise<CaseStudy[]> {
    const caseStudies = Array.from(this._caseStudies.values());
    
    if (options?.published !== undefined) {
      return caseStudies.filter(study => study.published === options.published);
    }
    
    return caseStudies;
  }
  
  async getCaseStudyById(id: number): Promise<CaseStudy | undefined> {
    return this._caseStudies.get(id);
  }
  
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    return Array.from(this._caseStudies.values()).find(
      study => study.slug === slug
    );
  }
  
  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const now = new Date();
    const newCaseStudy: CaseStudy = {
      id: this._currentCaseStudyId++,
      createdAt: now,
      updatedAt: now,
      ...caseStudy
    };
    
    this._caseStudies.set(newCaseStudy.id, newCaseStudy);
    return newCaseStudy;
  }
  
  async updateCaseStudy(id: number, caseStudyData: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined> {
    const caseStudy = this._caseStudies.get(id);
    
    if (!caseStudy) {
      return undefined;
    }
    
    const updatedCaseStudy: CaseStudy = {
      ...caseStudy,
      ...caseStudyData,
      updatedAt: new Date()
    };
    
    this._caseStudies.set(id, updatedCaseStudy);
    return updatedCaseStudy;
  }
  
  async deleteCaseStudy(id: number): Promise<boolean> {
    return this._caseStudies.delete(id);
  }
  
  // Publications
  async getPublications(options?: { published?: boolean }): Promise<Publication[]> {
    const publications = Array.from(this._publications.values());
    
    if (options?.published !== undefined) {
      return publications.filter(pub => pub.published === options.published);
    }
    
    return publications;
  }
  
  async getPublicationById(id: number): Promise<Publication | undefined> {
    return this._publications.get(id);
  }
  
  async createPublication(publication: InsertPublication): Promise<Publication> {
    const now = new Date();
    const newPublication: Publication = {
      id: this._currentPublicationId++,
      createdAt: now,
      updatedAt: now,
      ...publication
    };
    
    this._publications.set(newPublication.id, newPublication);
    return newPublication;
  }
  
  async updatePublication(id: number, publicationData: Partial<InsertPublication>): Promise<Publication | undefined> {
    const publication = this._publications.get(id);
    
    if (!publication) {
      return undefined;
    }
    
    const updatedPublication: Publication = {
      ...publication,
      ...publicationData,
      updatedAt: new Date()
    };
    
    this._publications.set(id, updatedPublication);
    return updatedPublication;
  }
  
  async deletePublication(id: number): Promise<boolean> {
    return this._publications.delete(id);
  }
  
  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    return Array.from(this._faqs.values());
  }
  
  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return Array.from(this._faqs.values()).filter(
      faq => faq.category === category
    );
  }
  
  async getFAQById(id: number): Promise<FAQ | undefined> {
    return this._faqs.get(id);
  }
  
  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const now = new Date();
    const newFAQ: FAQ = {
      id: this._currentFaqId++,
      createdAt: now,
      updatedAt: now,
      ...faq
    };
    
    this._faqs.set(newFAQ.id, newFAQ);
    return newFAQ;
  }
  
  async updateFAQ(id: number, faqData: Partial<InsertFAQ>): Promise<FAQ | undefined> {
    const faq = this._faqs.get(id);
    
    if (!faq) {
      return undefined;
    }
    
    const updatedFAQ: FAQ = {
      ...faq,
      ...faqData,
      updatedAt: new Date()
    };
    
    this._faqs.set(id, updatedFAQ);
    return updatedFAQ;
  }
  
  async deleteFAQ(id: number): Promise<boolean> {
    return this._faqs.delete(id);
  }
  
  // User Feedback
  async getUserFeedback(options?: { resolved?: boolean, category?: string }): Promise<UserFeedback[]> {
    let feedbacks = Array.from(this._userFeedback.values());
    
    if (options) {
      if (options.resolved !== undefined) {
        feedbacks = feedbacks.filter(feedback => feedback.resolved === options.resolved);
      }
      
      if (options.category) {
        feedbacks = feedbacks.filter(feedback => feedback.category === options.category);
      }
    }
    
    return feedbacks;
  }
  
  async getUserFeedbackById(id: number): Promise<UserFeedback | undefined> {
    return this._userFeedback.get(id);
  }
  
  async createUserFeedback(feedback: InsertUserFeedback): Promise<UserFeedback> {
    const now = new Date();
    const newFeedback: UserFeedback = {
      id: this._currentUserFeedbackId++,
      createdAt: now,
      updatedAt: now,
      resolved: false,
      adminNotes: null,
      ...feedback
    };
    
    this._userFeedback.set(newFeedback.id, newFeedback);
    return newFeedback;
  }
  
  async updateUserFeedbackResolution(id: number, resolved: boolean, adminNotes?: string): Promise<UserFeedback | undefined> {
    const feedback = this._userFeedback.get(id);
    
    if (!feedback) {
      return undefined;
    }
    
    const updatedFeedback: UserFeedback = {
      ...feedback,
      resolved,
      adminNotes: adminNotes !== undefined ? adminNotes : feedback.adminNotes,
      updatedAt: new Date()
    };
    
    this._userFeedback.set(id, updatedFeedback);
    return updatedFeedback;
  }
  
  async deleteUserFeedback(id: number): Promise<boolean> {
    return this._userFeedback.delete(id);
  }

  // Error Reports
  async getErrorReports(options?: { status?: string }): Promise<ErrorReport[]> {
    let reports = Array.from(this._errorReports.values());
    
    if (options?.status) {
      reports = reports.filter(report => report.status === options.status);
    }
    
    return reports.sort((a, b) => {
      const dateA = a.reportedAt?.getTime() || 0;
      const dateB = b.reportedAt?.getTime() || 0;
      return dateB - dateA; // Sort by most recent first
    });
  }

  async getErrorReportById(id: number): Promise<ErrorReport | undefined> {
    return this._errorReports.get(id);
  }

  async createErrorReport(report: InsertErrorReport): Promise<ErrorReport> {
    const newReport: ErrorReport = {
      id: this._currentErrorReportId++,
      reportedAt: new Date(),
      resolvedAt: null,
      status: "pending", // Default status
      ...report
    };
    
    this._errorReports.set(newReport.id, newReport);
    return newReport;
  }

  async updateErrorReportStatus(id: number, status: string, adminNotes?: string): Promise<ErrorReport | undefined> {
    const report = this._errorReports.get(id);
    
    if (!report) {
      return undefined;
    }
    
    // Set resolvedAt when status is resolved
    const resolvedAt = status === "resolved" ? new Date() : report.resolvedAt;
    
    const updatedReport: ErrorReport = {
      ...report,
      status,
      resolvedAt,
      adminNotes: adminNotes || report.adminNotes
    };
    
    this._errorReports.set(id, updatedReport);
    return updatedReport;
  }

  async deleteErrorReport(id: number): Promise<boolean> {
    if (this._errorReports.has(id)) {
      this._errorReports.delete(id);
      return true;
    }
    return false;
  }
  
  // Password Reset Token methods
  async createPasswordResetToken(userId: number): Promise<PasswordResetToken> {
    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    
    // Set expiration to 30 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    const passwordResetToken: PasswordResetToken = {
      id: this._currentPasswordResetTokenId++,
      userId,
      token,
      expiresAt,
      used: false,
      createdAt: new Date()
    };
    
    this._passwordResetTokens.set(passwordResetToken.id, passwordResetToken);
    return passwordResetToken;
  }
  
  async getPasswordResetTokenByToken(token: string): Promise<PasswordResetToken | undefined> {
    for (const resetToken of this._passwordResetTokens.values()) {
      if (resetToken.token === token) {
        return resetToken;
      }
    }
    return undefined;
  }
  
  async validatePasswordResetToken(token: string): Promise<User | undefined> {
    const resetToken = await this.getPasswordResetTokenByToken(token);
    
    if (!resetToken) {
      return undefined;
    }
    
    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return undefined;
    }
    
    // Check if token has been used
    if (resetToken.used) {
      return undefined;
    }
    
    // Get the user associated with this token
    return this.getUser(resetToken.userId);
  }
  
  async markTokenAsUsed(tokenId: number): Promise<PasswordResetToken | undefined> {
    const token = this._passwordResetTokens.get(tokenId);
    
    if (!token) {
      return undefined;
    }
    
    const updatedToken = {
      ...token,
      used: true
    };
    
    this._passwordResetTokens.set(tokenId, updatedToken);
    return updatedToken;
  }
}

export class DatabaseStorage implements IStorage {
  // Impact Projects
  async getImpactProjects(options?: { featured?: boolean, category?: string }): Promise<ImpactProject[]> {
    let query = db.select().from(impactProjects);
    
    if (options?.featured !== undefined) {
      query = query.where(eq(impactProjects.featured, options.featured));
    }
    
    if (options?.category) {
      query = query.where(eq(impactProjects.category, options.category));
    }
    
    return query.orderBy(desc(impactProjects.startDate));
  }
  
  async getImpactProject(id: number): Promise<ImpactProject | undefined> {
    const [project] = await db
      .select()
      .from(impactProjects)
      .where(eq(impactProjects.id, id));
    return project || undefined;
  }
  
  async createImpactProject(projectData: InsertImpactProject): Promise<ImpactProject> {
    const [project] = await db.insert(impactProjects).values(projectData).returning();
    return project;
  }
  
  async updateImpactProject(id: number, projectUpdate: Partial<InsertImpactProject>): Promise<ImpactProject | undefined> {
    const now = new Date();
    const [project] = await db
      .update(impactProjects)
      .set({ ...projectUpdate, updatedAt: now })
      .where(eq(impactProjects.id, id))
      .returning();
    return project || undefined;
  }
  
  async deleteImpactProject(id: number): Promise<boolean> {
    const result = await db.delete(impactProjects).where(eq(impactProjects.id, id));
    return result.count > 0;
  }
  
  // Impact Timeline Events
  async getImpactTimelineEvents(projectId?: number): Promise<ImpactTimelineEvent[]> {
    let query = db.select().from(impactTimelineEvents);
    
    if (projectId !== undefined) {
      query = query.where(eq(impactTimelineEvents.projectId, projectId));
    }
    
    return query.orderBy(desc(impactTimelineEvents.date), desc(impactTimelineEvents.importance));
  }
  
  async getImpactTimelineEvent(id: number): Promise<ImpactTimelineEvent | undefined> {
    const [event] = await db
      .select()
      .from(impactTimelineEvents)
      .where(eq(impactTimelineEvents.id, id));
    return event || undefined;
  }
  
  async createImpactTimelineEvent(eventData: InsertImpactTimelineEvent): Promise<ImpactTimelineEvent> {
    const [event] = await db.insert(impactTimelineEvents).values(eventData).returning();
    return event;
  }
  
  async updateImpactTimelineEvent(id: number, eventUpdate: Partial<InsertImpactTimelineEvent>): Promise<ImpactTimelineEvent | undefined> {
    const now = new Date();
    const [event] = await db
      .update(impactTimelineEvents)
      .set({ ...eventUpdate, updatedAt: now })
      .where(eq(impactTimelineEvents.id, id))
      .returning();
    return event || undefined;
  }
  
  async deleteImpactTimelineEvent(id: number): Promise<boolean> {
    const result = await db.delete(impactTimelineEvents).where(eq(impactTimelineEvents.id, id));
    return result.count > 0;
  }
  
  // User Activity Logs
  async getUserActivityLogs(userId: number): Promise<UserActivityLog[]> {
    return db.select()
      .from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId))
      .orderBy(desc(userActivityLogs.createdAt));
  }

  async createUserActivityLog(log: InsertUserActivityLog): Promise<UserActivityLog> {
    const [activityLog] = await db.insert(userActivityLogs).values(log).returning();
    return activityLog;
  }
  
  // Project Proposals
  async getProjectProposals(userId?: number): Promise<ProjectProposal[]> {
    let query = db.select().from(projectProposals);
    
    if (userId !== undefined) {
      query = query.where(eq(projectProposals.userId, userId));
    }
    
    return query.orderBy(desc(projectProposals.createdAt));
  }
  
  async getProjectProposal(id: number): Promise<ProjectProposal | undefined> {
    const [proposal] = await db
      .select()
      .from(projectProposals)
      .where(eq(projectProposals.id, id));
    return proposal || undefined;
  }
  
  async createProjectProposal(proposalData: InsertProjectProposal): Promise<ProjectProposal> {
    const [proposal] = await db.insert(projectProposals).values(proposalData).returning();
    return proposal;
  }
  
  async updateProjectProposal(id: number, proposalUpdate: Partial<InsertProjectProposal>): Promise<ProjectProposal | undefined> {
    const now = new Date();
    const [proposal] = await db
      .update(projectProposals)
      .set({ ...proposalUpdate, updatedAt: now })
      .where(eq(projectProposals.id, id))
      .returning();
    return proposal || undefined;
  }
  
  async deleteProjectProposal(id: number): Promise<boolean> {
    const result = await db.delete(projectProposals).where(eq(projectProposals.id, id));
    return result.count > 0;
  }
  
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const now = new Date();
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: now })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  async updateUserFreeConsultationUsage(id: number): Promise<User | undefined> {
    const now = new Date();
    const [user] = await db
      .update(users)
      .set({ 
        hasUsedFreeConsultation: true,
        updatedAt: now 
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  async updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId?: string }): Promise<User | undefined> {
    const now = new Date();
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: stripeInfo.stripeCustomerId,
        updatedAt: now 
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
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

  // Donations
  async getDonations(): Promise<Donation[]> {
    return db.select().from(donations).orderBy(desc(donations.createdAt));
  }
  
  async getDonationsByEmail(email: string): Promise<Donation[]> {
    return db.select()
      .from(donations)
      .where(eq(donations.email, email))
      .orderBy(desc(donations.createdAt));
  }
  
  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    return db.select()
      .from(donations)
      .where(eq(donations.userId, userId))
      .orderBy(desc(donations.createdAt));
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }
  
  async createDonation(donationData: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(donationData).returning();
    return donation;
  }
  
  async updateDonationStatus(id: number, status: string): Promise<Donation | undefined> {
    const [donation] = await db
      .update(donations)
      .set({ status })
      .where(eq(donations.id, id))
      .returning();
    return donation || undefined;
  }
  
  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }
  
  async getSubscriptionsByEmail(email: string): Promise<Subscription[]> {
    return db.select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .orderBy(desc(subscriptions.createdAt));
  }
  
  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));
  }
  
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }
  
  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    return subscription || undefined;
  }
  
  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return subscription;
  }
  
  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined> {
    const now = new Date();
    const [subscription] = await db
      .update(subscriptions)
      .set({ status, updatedAt: now })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || undefined;
  }
  
  async cancelSubscription(id: number): Promise<Subscription | undefined> {
    const now = new Date();
    const [subscription] = await db
      .update(subscriptions)
      .set({ 
        status: "canceled", 
        canceledAt: now,
        updatedAt: now 
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || undefined;
  }

  // Case Studies
  async getCaseStudies(options?: { published?: boolean }): Promise<CaseStudy[]> {
    let query = db.select().from(caseStudies);
    
    if (options?.published !== undefined) {
      query = query.where(eq(caseStudies.published, options.published));
    }
    
    return query.orderBy(desc(caseStudies.createdAt));
  }
  
  async getCaseStudyById(id: number): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
    return caseStudy || undefined;
  }
  
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug));
    return caseStudy || undefined;
  }
  
  async createCaseStudy(caseStudyData: InsertCaseStudy): Promise<CaseStudy> {
    const [caseStudy] = await db.insert(caseStudies).values(caseStudyData).returning();
    return caseStudy;
  }
  
  async updateCaseStudy(id: number, caseStudyData: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db
      .update(caseStudies)
      .set({
        ...caseStudyData,
        updatedAt: new Date()
      })
      .where(eq(caseStudies.id, id))
      .returning();
    return caseStudy || undefined;
  }
  
  async deleteCaseStudy(id: number): Promise<boolean> {
    const result = await db.delete(caseStudies).where(eq(caseStudies.id, id));
    return result.rowCount > 0;
  }
  
  // Publications
  async getPublications(options?: { published?: boolean }): Promise<Publication[]> {
    let query = db.select().from(publications);
    
    if (options?.published !== undefined) {
      query = query.where(eq(publications.published, options.published));
    }
    
    return query.orderBy(desc(publications.createdAt));
  }
  
  async getPublicationById(id: number): Promise<Publication | undefined> {
    const [publication] = await db.select().from(publications).where(eq(publications.id, id));
    return publication || undefined;
  }
  
  async createPublication(publicationData: InsertPublication): Promise<Publication> {
    const [publication] = await db.insert(publications).values(publicationData).returning();
    return publication;
  }
  
  async updatePublication(id: number, publicationData: Partial<InsertPublication>): Promise<Publication | undefined> {
    const [publication] = await db
      .update(publications)
      .set({
        ...publicationData,
        updatedAt: new Date()
      })
      .where(eq(publications.id, id))
      .returning();
    return publication || undefined;
  }
  
  async deletePublication(id: number): Promise<boolean> {
    const result = await db.delete(publications).where(eq(publications.id, id));
    return result.rowCount > 0;
  }
  
  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    return db.select().from(faqs).orderBy(asc(faqs.id));
  }
  
  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return db.select().from(faqs).where(eq(faqs.category, category)).orderBy(asc(faqs.id));
  }
  
  async getFAQById(id: number): Promise<FAQ | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq || undefined;
  }
  
  async createFAQ(faqData: InsertFAQ): Promise<FAQ> {
    const [faq] = await db.insert(faqs).values(faqData).returning();
    return faq;
  }
  
  async updateFAQ(id: number, faqData: Partial<InsertFAQ>): Promise<FAQ | undefined> {
    const [faq] = await db
      .update(faqs)
      .set({
        ...faqData,
        updatedAt: new Date()
      })
      .where(eq(faqs.id, id))
      .returning();
    return faq || undefined;
  }
  
  async deleteFAQ(id: number): Promise<boolean> {
    const result = await db.delete(faqs).where(eq(faqs.id, id));
    return result.rowCount > 0;
  }
  
  // User Feedback
  async getUserFeedback(options?: { resolved?: boolean, category?: string }): Promise<UserFeedback[]> {
    let query = db.select().from(userFeedback);
    
    if (options) {
      if (options.resolved !== undefined) {
        query = query.where(eq(userFeedback.resolved, options.resolved));
      }
      
      if (options.category) {
        query = query.where(eq(userFeedback.category, options.category));
      }
    }
    
    return query.orderBy(desc(userFeedback.createdAt));
  }
  
  async getUserFeedbackById(id: number): Promise<UserFeedback | undefined> {
    const [feedback] = await db
      .select()
      .from(userFeedback)
      .where(eq(userFeedback.id, id));
    return feedback || undefined;
  }
  
  async createUserFeedback(feedbackData: InsertUserFeedback): Promise<UserFeedback> {
    const [feedback] = await db.insert(userFeedback).values({
      ...feedbackData,
      resolved: false,
      adminNotes: null
    }).returning();
    return feedback;
  }
  
  async updateUserFeedbackResolution(id: number, resolved: boolean, adminNotes?: string): Promise<UserFeedback | undefined> {
    const now = new Date();
    const updateData: Partial<UserFeedback> = { 
      resolved, 
      updatedAt: now 
    };
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    const [feedback] = await db
      .update(userFeedback)
      .set(updateData)
      .where(eq(userFeedback.id, id))
      .returning();
    return feedback || undefined;
  }
  
  async deleteUserFeedback(id: number): Promise<boolean> {
    const result = await db.delete(userFeedback).where(eq(userFeedback.id, id));
    return result.rowCount > 0;
  }

  // Error Reports
  async getErrorReports(options?: { status?: string }): Promise<ErrorReport[]> {
    let query = db.select().from(errorReports);
    
    if (options?.status) {
      query = query.where(eq(errorReports.status, options.status));
    }
    
    return query.orderBy(desc(errorReports.reportedAt));
  }

  async getErrorReportById(id: number): Promise<ErrorReport | undefined> {
    const [report] = await db
      .select()
      .from(errorReports)
      .where(eq(errorReports.id, id));
    return report || undefined;
  }

  async createErrorReport(report: InsertErrorReport): Promise<ErrorReport> {
    const [newReport] = await db
      .insert(errorReports)
      .values({
        ...report,
        status: report.status || "pending", // Default status if not provided
        reportedAt: report.reportedAt || new Date(),
        resolvedAt: null
      })
      .returning();
    return newReport;
  }

  async updateErrorReportStatus(id: number, status: string, adminNotes?: string): Promise<ErrorReport | undefined> {
    // If marking as resolved, set resolvedAt date
    const resolvedAt = status === "resolved" ? new Date() : undefined;
    
    const updateData: Partial<ErrorReport> = { 
      status,
      adminNotes: adminNotes,
      ...(resolvedAt && { resolvedAt })
    };
    
    const [report] = await db
      .update(errorReports)
      .set(updateData)
      .where(eq(errorReports.id, id))
      .returning();
    return report || undefined;
  }

  async deleteErrorReport(id: number): Promise<boolean> {
    const result = await db.delete(errorReports).where(eq(errorReports.id, id));
    return result.rowCount > 0;
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