import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts)
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id]
  })
}));
