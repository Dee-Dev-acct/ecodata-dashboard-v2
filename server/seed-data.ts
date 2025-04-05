import { storage } from "./storage";
import { 
  InsertService, 
  InsertTestimonial, 
  InsertImpactMetric, 
  InsertBlogPost,
  InsertPartner 
} from "@shared/schema";

// Sample partners data for tech companies
const partnersData: InsertPartner[] = [
  {
    name: "Google",
    logoUrl: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    websiteUrl: "https://www.google.com",
    category: "technology"
  },
  {
    name: "Microsoft",
    logoUrl: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
    websiteUrl: "https://www.microsoft.com",
    category: "technology"
  },
  {
    name: "IBM",
    logoUrl: "https://1000logos.net/wp-content/uploads/2018/02/IBM-Logo.png",
    websiteUrl: "https://www.ibm.com",
    category: "technology"
  },
  {
    name: "AWS",
    logoUrl: "https://1000logos.net/wp-content/uploads/2022/07/AWS-Logo.png",
    websiteUrl: "https://aws.amazon.com",
    category: "technology"
  },
  {
    name: "Intel",
    logoUrl: "https://1000logos.net/wp-content/uploads/2017/02/Intel-Logo.png",
    websiteUrl: "https://www.intel.com",
    category: "technology"
  },
  {
    name: "NVIDIA",
    logoUrl: "https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/logo-and-brand/01-nvidia-logo-vert-500x200-2c50-p@2x.png",
    websiteUrl: "https://www.nvidia.com",
    category: "technology"
  }
];

// Seed partner data if none exists
export async function seedPartners() {
  const existingPartners = await storage.getPartners();
  
  if (existingPartners.length === 0) {
    console.log("Seeding partners data...");
    
    for (const partner of partnersData) {
      await storage.createPartner(partner);
    }
    
    console.log(`Successfully seeded ${partnersData.length} partners`);
  } else {
    console.log(`Partners data already exists. Found ${existingPartners.length} partners.`);
  }
}

// Add more seed functions as needed for other entity types

// Main seed function that can be called to seed all necessary data
export async function seedAllData() {
  try {
    await seedPartners();
    // Add calls to other seed functions here
    console.log("Data seeding completed successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}