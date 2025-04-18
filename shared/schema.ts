import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer as sqliteInteger, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define MSSQL table interfaces
// These don't actually define database structure but provide TypeScript interfaces for our API
// We're using raw SQL for database operations

// Users MSSQL schema interface
export interface MSSQLUser {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
  created_at: Date;
}

// Contact messages MSSQL schema interface
export interface MSSQLContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  is_read: boolean;
  created_at: Date;
}

// Newsletter subscribers MSSQL schema interface
export interface MSSQLNewsletterSubscriber {
  id: number;
  email: string;
  consent: boolean;
  subscription_tier: string; // Basic, Professional, Research
  interests: string; // Stored as JSON string in SQL Server
  created_at: Date;
}

// Services MSSQL schema interface
export interface MSSQLService {
  id: number;
  title: string;
  description: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

// Testimonials MSSQL schema interface
export interface MSSQLTestimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

// Impact metrics MSSQL schema interface
export interface MSSQLImpactMetric {
  id: number;
  title: string;
  value: string;
  description: string;
  icon: string;
  category: string;
  created_at: Date;
  updated_at: Date;
}

// Blog posts MSSQL schema interface
export interface MSSQLBlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: number;
  featured_image: string | null;
  tags: string | null; // Stored as JSON string in SQL Server
  category: string;
  published: boolean;
  publish_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Settings MSSQL schema interface
export interface MSSQLSetting {
  id: number;
  section: string;
  key: string;
  value: string; // Stored as JSON string in SQL Server
  updated_at: Date;
}

// Partners MSSQL schema interface
export interface MSSQLPartner {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  category: string;
  created_at: Date;
  updated_at: Date;
}

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("user"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  interests: text("interests").array(),
  watchlist: text("watchlist").array(),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  stripeCustomerId: text("stripe_customer_id"),
  lastLogin: timestamp("last_login"),
  isEmailVerified: boolean("is_email_verified").default(false),
  hasUsedFreeConsultation: boolean("has_used_free_consultation").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  profileImage: true,
  bio: true,
  interests: true,
  watchlist: true,
  notificationsEnabled: true,
  stripeCustomerId: true,
  isEmailVerified: true,
  hasUsedFreeConsultation: true
});

// Contact messages schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  consent: boolean("consent").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
  consent: true
});

// Newsletter subscribers schema
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  consent: boolean("consent").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default("basic"),
  interests: text("interests").array(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
  consent: true,
  subscriptionTier: true,
  interests: true
});

// Services schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  description: true,
  icon: true
});

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  company: text("company").notNull(),
  testimonial: text("testimonial").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  position: true,
  company: true,
  testimonial: true,
  rating: true,
  imageUrl: true
});

// Impact metrics schema
export const impactMetrics = pgTable("impact_metrics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  value: text("value").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertImpactMetricSchema = createInsertSchema(impactMetrics).pick({
  title: true,
  value: true,
  description: true,
  icon: true,
  category: true
});

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  authorId: integer("author_id").notNull(),
  featuredImage: text("featured_image"),
  tags: text("tags").array(),
  category: text("category").notNull(),
  published: boolean("published").notNull().default(false),
  publishDate: timestamp("publish_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  authorId: true,
  featuredImage: true,
  tags: true,
  category: true,
  published: true,
  publishDate: true
});

// Settings schema
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSettingSchema = createInsertSchema(settings).pick({
  section: true,
  key: true,
  value: true
});

// Partners schema
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url"),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertPartnerSchema = createInsertSchema(partners).pick({
  name: true,
  logoUrl: true,
  websiteUrl: true,
  category: true
});

// Donations schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Optional - for logged in users
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("gbp"),
  email: text("email").notNull(),
  name: text("name"),
  fundingGoalId: text("funding_goal_id"), // Associated funding goal if any
  stripePaymentId: text("stripe_payment_id").notNull(),
  stripeSessionId: text("stripe_session_id").notNull(),
  status: text("status").notNull().default("completed"),
  isGiftAid: boolean("is_gift_aid").notNull().default(false),
  giftAidName: text("gift_aid_name"),
  giftAidAddress: text("gift_aid_address"),
  giftAidPostcode: text("gift_aid_postcode"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  userId: true,
  amount: true,
  currency: true,
  email: true,
  name: true,
  fundingGoalId: true,
  stripePaymentId: true,
  stripeSessionId: true,
  status: true,
  isGiftAid: true,
  giftAidName: true,
  giftAidAddress: true,
  giftAidPostcode: true,
  metadata: true
});

// Subscription Donations schema
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Optional - for logged in users
  email: text("email").notNull(),
  name: text("name"),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("gbp"),
  interval: text("interval").notNull(), // 'month' or 'year'
  tier: text("tier").default("standard"), // tier level of subscription
  status: text("status").notNull().default("active"),
  isGiftAid: boolean("is_gift_aid").notNull().default(false),
  giftAidName: text("gift_aid_name"),
  giftAidAddress: text("gift_aid_address"),
  giftAidPostcode: text("gift_aid_postcode"),
  canceledAt: timestamp("canceled_at"),
  currentPeriodEnd: timestamp("current_period_end"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  email: true,
  name: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  amount: true,
  currency: true,
  interval: true,
  tier: true,
  status: true,
  isGiftAid: true,
  giftAidName: true,
  giftAidAddress: true,
  giftAidPostcode: true,
  currentPeriodEnd: true,
  metadata: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type InsertImpactMetric = z.infer<typeof insertImpactMetricSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Project Proposal schema
export const projectProposals = pgTable("project_proposals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  fundingNeeded: decimal("funding_needed", { precision: 10, scale: 2 }),
  location: text("location"),
  timeline: text("timeline"),
  goals: text("goals"),
  impact: text("impact"),
  attachments: text("attachments").array(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, funded
  adminNotes: text("admin_notes"), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertProjectProposalSchema = createInsertSchema(projectProposals).pick({
  userId: true,
  title: true,
  description: true,
  category: true,
  fundingNeeded: true,
  location: true,
  timeline: true,
  goals: true,
  impact: true,
  attachments: true,
  status: true
});

export type ProjectProposal = typeof projectProposals.$inferSelect;
export type InsertProjectProposal = z.infer<typeof insertProjectProposalSchema>;

// User Activity Log schema
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).pick({
  userId: true,
  action: true,
  details: true,
  ipAddress: true,
  userAgent: true
});

export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
  donations: many(donations),
  subscriptions: many(subscriptions),
  projectProposals: many(projectProposals),
  activityLogs: many(userActivityLogs)
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id]
  })
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  user: one(users, {
    fields: [donations.userId],
    references: [users.id]
  })
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  })
}));

export const projectProposalsRelations = relations(projectProposals, ({ one }) => ({
  user: one(users, {
    fields: [projectProposals.userId],
    references: [users.id]
  })
}));

export const userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
  user: one(users, {
    fields: [userActivityLogs.userId],
    references: [users.id]
  })
}));

// Error Reports schema
export const errorReports = pgTable("error_reports", {
  id: serial("id").primaryKey(),
  email: text("email"),
  errorDetails: text("error_details").notNull(),
  currentPage: text("current_page").notNull(),
  browserInfo: jsonb("browser_info"),
  status: text("status").notNull().default("pending"), // pending, in-progress, resolved
  adminNotes: text("admin_notes"),
  reportedAt: timestamp("reported_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

export const insertErrorReportSchema = createInsertSchema(errorReports).pick({
  email: true,
  errorDetails: true,
  currentPage: true,
  browserInfo: true,
  status: true,
  adminNotes: true,
  reportedAt: true
});

export type ErrorReport = typeof errorReports.$inferSelect;
export type InsertErrorReport = z.infer<typeof insertErrorReportSchema>;

// Case Studies schema
export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  sector: text("sector").notNull(),
  location: text("location").notNull(),
  impactType: text("impact_type").notNull(),
  coverImage: text("cover_image"),
  results: text("results"),
  client: text("client"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  published: boolean("published").notNull().default(true),
  projectDate: timestamp("project_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  sector: true,
  location: true,
  impactType: true,
  coverImage: true,
  results: true,
  client: true,
  tags: true,
  featured: true,
  published: true,
  projectDate: true
});

// Publications schema
export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // Report, White Paper, Research, etc.
  authors: text("authors").array(),
  categories: text("categories").array(),
  summary: text("summary").notNull(),
  fileUrl: text("file_url"),
  externalUrl: text("external_url"),
  publicationDate: timestamp("publication_date"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertPublicationSchema = createInsertSchema(publications).pick({
  title: true,
  type: true,
  authors: true,
  categories: true,
  summary: true,
  fileUrl: true,
  externalUrl: true,
  publicationDate: true,
  published: true
});

// FAQs schema
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertFaqSchema = createInsertSchema(faqs).pick({
  question: true,
  answer: true,
  category: true,
  orderIndex: true
});

// Impact Projects schema
export const impactProjects = pgTable("impact_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Climate, Housing, Health, Education, etc.
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("active"), // active, completed, planned
  imageUrl: text("image_url"),
  partners: text("partners").array(),
  impactDescription: text("impact_description"),
  metricsAchieved: jsonb("metrics_achieved"), // Store achievements as JSON
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertImpactProjectSchema = createInsertSchema(impactProjects).pick({
  title: true,
  description: true,
  category: true,
  location: true,
  latitude: true,
  longitude: true,
  startDate: true,
  endDate: true,
  status: true,
  imageUrl: true,
  partners: true,
  impactDescription: true,
  metricsAchieved: true,
  featured: true
});

// Impact Timeline Events schema
export const impactTimelineEvents = pgTable("impact_timeline_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  projectId: integer("project_id").references(() => impactProjects.id),
  importance: integer("importance").default(1), // 1-5 scale for sorting/highlighting
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertImpactTimelineEventSchema = createInsertSchema(impactTimelineEvents).pick({
  title: true,
  description: true,
  date: true,
  category: true,
  imageUrl: true,
  projectId: true,
  importance: true
});

export type ImpactProject = typeof impactProjects.$inferSelect;
export type InsertImpactProject = z.infer<typeof insertImpactProjectSchema>;

export type ImpactTimelineEvent = typeof impactTimelineEvents.$inferSelect;
export type InsertImpactTimelineEvent = z.infer<typeof insertImpactTimelineEventSchema>;

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;

// Add relationship between impact projects and timeline events
export const impactProjectsRelations = relations(impactProjects, ({ many }) => ({
  timelineEvents: many(impactTimelineEvents)
}));

export const impactTimelineEventsRelations = relations(impactTimelineEvents, ({ one }) => ({
  project: one(impactProjects, {
    fields: [impactTimelineEvents.projectId],
    references: [impactProjects.id]
  })
}));

// User Feedback schema
export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(), // 1-5 rating
  feedback: text("feedback"), // Optional text feedback
  pageUrl: text("page_url").notNull(), // The URL where feedback was submitted
  userAgent: text("user_agent"), // Browser/device information 
  ipAddress: text("ip_address"), // IP address for analytics
  userId: integer("user_id").references(() => users.id), // Optional - for logged in users
  category: text("category").default("general"), // general, usability, content, etc.
  resolved: boolean("resolved").default(false), // Whether the feedback has been addressed
  adminNotes: text("admin_notes"), // Notes from admins regarding the feedback
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).pick({
  rating: true,
  feedback: true,
  pageUrl: true,
  userAgent: true,
  ipAddress: true,
  userId: true,
  category: true
});

export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;

export const userFeedbackRelations = relations(userFeedback, ({ one }) => ({
  user: one(users, {
    fields: [userFeedback.userId],
    references: [users.id]
  })
}));

// Password reset tokens schema
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).pick({
  userId: true,
  token: true,
  expiresAt: true
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id]
  })
}));
