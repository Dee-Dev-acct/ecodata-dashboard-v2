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
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    websiteUrl: "https://www.ibm.com",
    category: "technology"
  },
  {
    name: "AWS",
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