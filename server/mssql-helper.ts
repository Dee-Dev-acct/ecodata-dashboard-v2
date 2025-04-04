import * as mssql from 'mssql';
import { mssqlClient, useMSSQL } from './db';
import { 
  User, InsertUser,
  ContactMessage, InsertContactMessage,
  NewsletterSubscriber, InsertNewsletterSubscriber,
  Service, InsertService,
  Testimonial, InsertTestimonial,
  ImpactMetric, InsertImpactMetric,
  BlogPost, InsertBlogPost,
  Setting, InsertSetting
} from '@shared/schema';

// Helper functions to execute MSSQL queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  if (!useMSSQL || !mssqlClient) {
    throw new Error('MSSQL client not initialized');
  }

  try {
    const request = mssqlClient.request();
    
    // Add parameters
    params.forEach((param, index) => {
      request.input(`p${index}`, param);
    });
    
    const result = await request.query(query);
    return result.recordset as T[];
  } catch (error) {
    console.error('Error executing MSSQL query:', error);
    throw error;
  }
}

// User Management
export async function getUserById(id: number): Promise<User | undefined> {
  const users = await executeQuery<User>(
    'SELECT * FROM users WHERE id = @p0',
    [id]
  );
  return users.length ? users[0] : undefined;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = await executeQuery<User>(
    'SELECT * FROM users WHERE username = @p0',
    [username]
  );
  return users.length ? users[0] : undefined;
}

export async function createUser(user: InsertUser): Promise<User> {
  const now = new Date();
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO users (username, password, email, role, created_at) 
     VALUES (@p0, @p1, @p2, @p3, @p4);
     SELECT SCOPE_IDENTITY() AS id`,
    [user.username, user.password, user.email, user.role || 'user', now]
  );
  
  const id = result[0].id;
  return { ...user, id, createdAt: now };
}

// Contact Messages
export async function getContactMessages(): Promise<ContactMessage[]> {
  return executeQuery<ContactMessage>(
    'SELECT * FROM contact_messages ORDER BY created_at DESC'
  );
}

export async function getContactMessageById(id: number): Promise<ContactMessage | undefined> {
  const messages = await executeQuery<ContactMessage>(
    'SELECT * FROM contact_messages WHERE id = @p0',
    [id]
  );
  return messages.length ? messages[0] : undefined;
}

export async function createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
  const now = new Date();
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO contact_messages (name, email, subject, message, consent, is_read, created_at) 
     VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6);
     SELECT SCOPE_IDENTITY() AS id`,
    [message.name, message.email, message.subject, message.message, message.consent, false, now]
  );
  
  const id = result[0].id;
  return { ...message, id, isRead: false, createdAt: now };
}

export async function updateContactMessageReadStatus(id: number, isRead: boolean): Promise<ContactMessage | undefined> {
  await executeQuery(
    'UPDATE contact_messages SET is_read = @p0 WHERE id = @p1',
    [isRead, id]
  );
  
  return getContactMessageById(id);
}

export async function deleteContactMessage(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM contact_messages WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Newsletter Subscribers
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return executeQuery<NewsletterSubscriber>(
    'SELECT * FROM newsletter_subscribers ORDER BY created_at DESC'
  );
}

export async function getNewsletterSubscriberById(id: number): Promise<NewsletterSubscriber | undefined> {
  const subscribers = await executeQuery<NewsletterSubscriber>(
    'SELECT * FROM newsletter_subscribers WHERE id = @p0',
    [id]
  );
  return subscribers.length ? subscribers[0] : undefined;
}

export async function getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
  const subscribers = await executeQuery<NewsletterSubscriber>(
    'SELECT * FROM newsletter_subscribers WHERE email = @p0',
    [email]
  );
  return subscribers.length ? subscribers[0] : undefined;
}

export async function createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
  const now = new Date();
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO newsletter_subscribers (email, consent, created_at) 
     VALUES (@p0, @p1, @p2);
     SELECT SCOPE_IDENTITY() AS id`,
    [subscriber.email, subscriber.consent, now]
  );
  
  const id = result[0].id;
  return { ...subscriber, id, createdAt: now };
}

export async function deleteNewsletterSubscriber(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM newsletter_subscribers WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Services
export async function getServices(): Promise<Service[]> {
  return executeQuery<Service>('SELECT * FROM services');
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const services = await executeQuery<Service>(
    'SELECT * FROM services WHERE id = @p0',
    [id]
  );
  return services.length ? services[0] : undefined;
}

export async function createService(service: InsertService): Promise<Service> {
  const now = new Date();
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO services (title, description, icon, created_at, updated_at) 
     VALUES (@p0, @p1, @p2, @p3, @p4);
     SELECT SCOPE_IDENTITY() AS id`,
    [service.title, service.description, service.icon, now, now]
  );
  
  const id = result[0].id;
  return { ...service, id, createdAt: now, updatedAt: now };
}

export async function updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
  const now = new Date();
  const currentService = await getServiceById(id);
  
  if (!currentService) return undefined;

  const updates = [];
  const params = [];
  let paramIndex = 0;

  if (serviceUpdate.title !== undefined) {
    updates.push(`title = @p${paramIndex}`);
    params.push(serviceUpdate.title);
    paramIndex++;
  }

  if (serviceUpdate.description !== undefined) {
    updates.push(`description = @p${paramIndex}`);
    params.push(serviceUpdate.description);
    paramIndex++;
  }

  if (serviceUpdate.icon !== undefined) {
    updates.push(`icon = @p${paramIndex}`);
    params.push(serviceUpdate.icon);
    paramIndex++;
  }

  updates.push(`updated_at = @p${paramIndex}`);
  params.push(now);
  paramIndex++;

  params.push(id); // For the WHERE clause

  await executeQuery(
    `UPDATE services SET ${updates.join(', ')} WHERE id = @p${paramIndex}`,
    params
  );
  
  return getServiceById(id);
}

export async function deleteService(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM services WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  return executeQuery<Testimonial>('SELECT * FROM testimonials');
}

export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
  const testimonials = await executeQuery<Testimonial>(
    'SELECT * FROM testimonials WHERE id = @p0',
    [id]
  );
  return testimonials.length ? testimonials[0] : undefined;
}

export async function createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
  const now = new Date();
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO testimonials (name, position, company, testimonial, rating, image_url, created_at, updated_at) 
     VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7);
     SELECT SCOPE_IDENTITY() AS id`,
    [
      testimonial.name, 
      testimonial.position, 
      testimonial.company, 
      testimonial.testimonial, 
      testimonial.rating, 
      testimonial.imageUrl || null, 
      now, 
      now
    ]
  );
  
  const id = result[0].id;
  return { 
    ...testimonial, 
    id, 
    createdAt: now, 
    updatedAt: now,
    imageUrl: testimonial.imageUrl || null
  };
}

export async function updateTestimonial(
  id: number, 
  testimonialUpdate: Partial<InsertTestimonial>
): Promise<Testimonial | undefined> {
  const now = new Date();
  const currentTestimonial = await getTestimonialById(id);
  
  if (!currentTestimonial) return undefined;

  const updates = [];
  const params = [];
  let paramIndex = 0;

  if (testimonialUpdate.name !== undefined) {
    updates.push(`name = @p${paramIndex}`);
    params.push(testimonialUpdate.name);
    paramIndex++;
  }

  if (testimonialUpdate.position !== undefined) {
    updates.push(`position = @p${paramIndex}`);
    params.push(testimonialUpdate.position);
    paramIndex++;
  }

  if (testimonialUpdate.company !== undefined) {
    updates.push(`company = @p${paramIndex}`);
    params.push(testimonialUpdate.company);
    paramIndex++;
  }

  if (testimonialUpdate.testimonial !== undefined) {
    updates.push(`testimonial = @p${paramIndex}`);
    params.push(testimonialUpdate.testimonial);
    paramIndex++;
  }

  if (testimonialUpdate.rating !== undefined) {
    updates.push(`rating = @p${paramIndex}`);
    params.push(testimonialUpdate.rating);
    paramIndex++;
  }

  if (testimonialUpdate.imageUrl !== undefined) {
    updates.push(`image_url = @p${paramIndex}`);
    params.push(testimonialUpdate.imageUrl || null);
    paramIndex++;
  }

  updates.push(`updated_at = @p${paramIndex}`);
  params.push(now);
  paramIndex++;

  params.push(id); // For the WHERE clause

  await executeQuery(
    `UPDATE testimonials SET ${updates.join(', ')} WHERE id = @p${paramIndex}`,
    params
  );
  
  return getTestimonialById(id);
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM testimonials WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Impact Metrics
export async function getImpactMetrics(): Promise<ImpactMetric[]> {
  return executeQuery<ImpactMetric>('SELECT * FROM impact_metrics');
}

export async function getImpactMetricById(id: number): Promise<ImpactMetric | undefined> {
  const metrics = await executeQuery<ImpactMetric>(
    'SELECT * FROM impact_metrics WHERE id = @p0',
    [id]
  );
  return metrics.length ? metrics[0] : undefined;
}

export async function createImpactMetric(metric: InsertImpactMetric): Promise<ImpactMetric> {
  const now = new Date();
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO impact_metrics (title, value, description, icon, category, created_at, updated_at) 
     VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6);
     SELECT SCOPE_IDENTITY() AS id`,
    [
      metric.title, 
      metric.value, 
      metric.description, 
      metric.icon, 
      metric.category, 
      now, 
      now
    ]
  );
  
  const id = result[0].id;
  return { ...metric, id, createdAt: now, updatedAt: now };
}

export async function updateImpactMetric(
  id: number, 
  metricUpdate: Partial<InsertImpactMetric>
): Promise<ImpactMetric | undefined> {
  const now = new Date();
  const currentMetric = await getImpactMetricById(id);
  
  if (!currentMetric) return undefined;

  const updates = [];
  const params = [];
  let paramIndex = 0;

  if (metricUpdate.title !== undefined) {
    updates.push(`title = @p${paramIndex}`);
    params.push(metricUpdate.title);
    paramIndex++;
  }

  if (metricUpdate.value !== undefined) {
    updates.push(`value = @p${paramIndex}`);
    params.push(metricUpdate.value);
    paramIndex++;
  }

  if (metricUpdate.description !== undefined) {
    updates.push(`description = @p${paramIndex}`);
    params.push(metricUpdate.description);
    paramIndex++;
  }

  if (metricUpdate.icon !== undefined) {
    updates.push(`icon = @p${paramIndex}`);
    params.push(metricUpdate.icon);
    paramIndex++;
  }

  if (metricUpdate.category !== undefined) {
    updates.push(`category = @p${paramIndex}`);
    params.push(metricUpdate.category);
    paramIndex++;
  }

  updates.push(`updated_at = @p${paramIndex}`);
  params.push(now);
  paramIndex++;

  params.push(id); // For the WHERE clause

  await executeQuery(
    `UPDATE impact_metrics SET ${updates.join(', ')} WHERE id = @p${paramIndex}`,
    params
  );
  
  return getImpactMetricById(id);
}

export async function deleteImpactMetric(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM impact_metrics WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Blog Posts 
export async function getBlogPosts(options?: { published?: boolean }): Promise<BlogPost[]> {
  let query = 'SELECT * FROM blog_posts';
  const params = [];
  
  if (options?.published !== undefined) {
    query += ' WHERE published = @p0';
    params.push(options.published);
  }
  
  query += ' ORDER BY publish_date DESC, created_at DESC';
  
  return executeQuery<BlogPost>(query, params);
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const posts = await executeQuery<BlogPost>(
    'SELECT * FROM blog_posts WHERE id = @p0',
    [id]
  );
  return posts.length ? posts[0] : undefined;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await executeQuery<BlogPost>(
    'SELECT * FROM blog_posts WHERE slug = @p0',
    [slug]
  );
  return posts.length ? posts[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  const now = new Date();
  
  // Convert tags array to JSON string for storage
  const tagsJson = post.tags ? JSON.stringify(post.tags) : null;
  
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO blog_posts (
       title, slug, content, excerpt, author_id, featured_image, 
       tags, category, published, publish_date, created_at, updated_at
     ) VALUES (
       @p0, @p1, @p2, @p3, @p4, @p5, 
       @p6, @p7, @p8, @p9, @p10, @p11
     );
     SELECT SCOPE_IDENTITY() AS id`,
    [
      post.title,
      post.slug,
      post.content,
      post.excerpt,
      post.authorId,
      post.featuredImage || null,
      tagsJson,
      post.category,
      post.published || false,
      post.publishDate || null,
      now,
      now
    ]
  );
  
  const id = result[0].id;
  return { 
    ...post, 
    id, 
    tags: post.tags || null,
    published: post.published || false,
    featuredImage: post.featuredImage || null,
    publishDate: post.publishDate || null,
    createdAt: now, 
    updatedAt: now 
  };
}

export async function updateBlogPost(
  id: number, 
  postUpdate: Partial<InsertBlogPost>
): Promise<BlogPost | undefined> {
  const now = new Date();
  const currentPost = await getBlogPostById(id);
  
  if (!currentPost) return undefined;

  const updates = [];
  const params = [];
  let paramIndex = 0;

  if (postUpdate.title !== undefined) {
    updates.push(`title = @p${paramIndex}`);
    params.push(postUpdate.title);
    paramIndex++;
  }

  if (postUpdate.slug !== undefined) {
    updates.push(`slug = @p${paramIndex}`);
    params.push(postUpdate.slug);
    paramIndex++;
  }

  if (postUpdate.content !== undefined) {
    updates.push(`content = @p${paramIndex}`);
    params.push(postUpdate.content);
    paramIndex++;
  }

  if (postUpdate.excerpt !== undefined) {
    updates.push(`excerpt = @p${paramIndex}`);
    params.push(postUpdate.excerpt);
    paramIndex++;
  }

  if (postUpdate.authorId !== undefined) {
    updates.push(`author_id = @p${paramIndex}`);
    params.push(postUpdate.authorId);
    paramIndex++;
  }

  if (postUpdate.featuredImage !== undefined) {
    updates.push(`featured_image = @p${paramIndex}`);
    params.push(postUpdate.featuredImage || null);
    paramIndex++;
  }

  if (postUpdate.tags !== undefined) {
    updates.push(`tags = @p${paramIndex}`);
    const tagsJson = postUpdate.tags ? JSON.stringify(postUpdate.tags) : null;
    params.push(tagsJson);
    paramIndex++;
  }

  if (postUpdate.category !== undefined) {
    updates.push(`category = @p${paramIndex}`);
    params.push(postUpdate.category);
    paramIndex++;
  }

  if (postUpdate.published !== undefined) {
    updates.push(`published = @p${paramIndex}`);
    params.push(postUpdate.published);
    paramIndex++;
  }

  if (postUpdate.publishDate !== undefined) {
    updates.push(`publish_date = @p${paramIndex}`);
    params.push(postUpdate.publishDate);
    paramIndex++;
  }

  updates.push(`updated_at = @p${paramIndex}`);
  params.push(now);
  paramIndex++;

  params.push(id); // For the WHERE clause

  await executeQuery(
    `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = @p${paramIndex}`,
    params
  );
  
  return getBlogPostById(id);
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM blog_posts WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Settings
export async function getSettings(): Promise<Setting[]> {
  return executeQuery<Setting>('SELECT * FROM settings');
}

export async function getSettingById(id: number): Promise<Setting | undefined> {
  const settings = await executeQuery<Setting>(
    'SELECT * FROM settings WHERE id = @p0',
    [id]
  );
  return settings.length ? settings[0] : undefined;
}

export async function getSettingByKey(section: string, key: string): Promise<Setting | undefined> {
  const settings = await executeQuery<Setting>(
    'SELECT * FROM settings WHERE section = @p0 AND key = @p1',
    [section, key]
  );
  return settings.length ? settings[0] : undefined;
}

export async function createSetting(setting: InsertSetting): Promise<Setting> {
  const now = new Date();
  const valueJson = JSON.stringify(setting.value);
  
  const result = await executeQuery<{ id: number }>(
    `INSERT INTO settings (section, key, value, updated_at) 
     VALUES (@p0, @p1, @p2, @p3);
     SELECT SCOPE_IDENTITY() AS id`,
    [setting.section, setting.key, valueJson, now]
  );
  
  const id = result[0].id;
  return { ...setting, id, updatedAt: now };
}

export async function updateSetting(
  id: number, 
  settingUpdate: Partial<InsertSetting>
): Promise<Setting | undefined> {
  const now = new Date();
  const currentSetting = await getSettingById(id);
  
  if (!currentSetting) return undefined;

  const updates = [];
  const params = [];
  let paramIndex = 0;

  if (settingUpdate.section !== undefined) {
    updates.push(`section = @p${paramIndex}`);
    params.push(settingUpdate.section);
    paramIndex++;
  }

  if (settingUpdate.key !== undefined) {
    updates.push(`key = @p${paramIndex}`);
    params.push(settingUpdate.key);
    paramIndex++;
  }

  if (settingUpdate.value !== undefined) {
    updates.push(`value = @p${paramIndex}`);
    const valueJson = JSON.stringify(settingUpdate.value);
    params.push(valueJson);
    paramIndex++;
  }

  updates.push(`updated_at = @p${paramIndex}`);
  params.push(now);
  paramIndex++;

  params.push(id); // For the WHERE clause

  await executeQuery(
    `UPDATE settings SET ${updates.join(', ')} WHERE id = @p${paramIndex}`,
    params
  );
  
  return getSettingById(id);
}

export async function deleteSetting(id: number): Promise<boolean> {
  const result = await executeQuery<{ affected: number }>(
    'DELETE FROM settings WHERE id = @p0; SELECT @@ROWCOUNT AS affected',
    [id]
  );
  
  return result[0].affected > 0;
}

// Database initialization - creates tables if they don't exist
export async function initializeMSSQLDatabase(): Promise<void> {
  if (!useMSSQL || !mssqlClient) {
    throw new Error('MSSQL client not initialized');
  }

  console.log('Initializing MSSQL database tables...');

  try {
    // Create tables if they don't exist
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      BEGIN
        CREATE TABLE users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          username NVARCHAR(255) NOT NULL UNIQUE,
          password NVARCHAR(255) NOT NULL,
          email NVARCHAR(255) NOT NULL,
          role NVARCHAR(50) NOT NULL DEFAULT 'user',
          created_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'contact_messages')
      BEGIN
        CREATE TABLE contact_messages (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          email NVARCHAR(255) NOT NULL,
          subject NVARCHAR(255) NOT NULL,
          message NVARCHAR(4000) NOT NULL,
          consent BIT NOT NULL,
          is_read BIT NOT NULL DEFAULT 0,
          created_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'newsletter_subscribers')
      BEGIN
        CREATE TABLE newsletter_subscribers (
          id INT IDENTITY(1,1) PRIMARY KEY,
          email NVARCHAR(255) NOT NULL UNIQUE,
          consent BIT NOT NULL,
          created_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'services')
      BEGIN
        CREATE TABLE services (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          description NVARCHAR(1000) NOT NULL,
          icon NVARCHAR(100) NOT NULL,
          created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
          updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'testimonials')
      BEGIN
        CREATE TABLE testimonials (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          position NVARCHAR(255) NOT NULL,
          company NVARCHAR(255) NOT NULL,
          testimonial NVARCHAR(1000) NOT NULL,
          rating INT NOT NULL,
          image_url NVARCHAR(1000) NULL,
          created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
          updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'impact_metrics')
      BEGIN
        CREATE TABLE impact_metrics (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          value NVARCHAR(255) NOT NULL,
          description NVARCHAR(1000) NOT NULL,
          icon NVARCHAR(100) NOT NULL,
          category NVARCHAR(100) NOT NULL,
          created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
          updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'blog_posts')
      BEGIN
        CREATE TABLE blog_posts (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          slug NVARCHAR(255) NOT NULL UNIQUE,
          content NVARCHAR(MAX) NOT NULL,
          excerpt NVARCHAR(1000) NOT NULL,
          author_id INT NOT NULL,
          featured_image NVARCHAR(1000) NULL,
          tags NVARCHAR(MAX) NULL, -- Stored as JSON string
          category NVARCHAR(100) NOT NULL,
          published BIT NOT NULL DEFAULT 0,
          publish_date DATETIME2 NULL,
          created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
          updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'settings')
      BEGIN
        CREATE TABLE settings (
          id INT IDENTITY(1,1) PRIMARY KEY,
          section NVARCHAR(100) NOT NULL,
          key NVARCHAR(100) NOT NULL,
          value NVARCHAR(MAX) NOT NULL, -- Stored as JSON string
          updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    console.log('MSSQL database tables initialized successfully');

    // Check if admin user exists, if not create one
    const adminUser = await getUserByUsername('admin');
    if (!adminUser) {
      console.log('Creating default admin user...');
      await createUser({
        username: 'admin',
        password: '$2b$10$xIv9kI4pGVN4HFP2EcrlJOpBVl9ZCqAwPDEyRtbK8lklr0YmCJESm', // "admin123"
        email: 'admin@ecodatacic.org',
        role: 'admin'
      });
    }

  } catch (error) {
    console.error('Error initializing MSSQL database:', error);
    throw error;
  }
}