import OpenAI from "openai";
import { FAQ } from "@shared/schema";

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const GPT_MODEL = "gpt-4o";

type ChatbotContext = {
  faqs: FAQ[];
  services: any[];
  impactMetrics: any[];
  sdgs: any;
};

/**
 * Generate a system prompt with context about the organization and available information
 */
function generateSystemPrompt(context: ChatbotContext): string {
  // Create a condensed version of FAQs for the system prompt
  const faqSection = context.faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");

  // Create a condensed version of services
  const servicesSection = context.services
    .map((service) => `- ${service.title}: ${service.shortDescription || service.description.substring(0, 100)}...`)
    .join("\n");

  // Create a condensed version of impact metrics
  const impactSection = context.impactMetrics
    .map((metric) => `- ${metric.title}: ${metric.value} ${metric.unit}`)
    .join("\n");

  // Create a condensed version of SDGs
  const sdgSection = Object.entries(context.sdgs)
    .map(([number, sdg]: [string, any]) => `- SDG ${number}: ${sdg.title} - ${sdg.description.substring(0, 100)}...`)
    .join("\n");

  return `
You are EcodataBot, the helpful assistant for ECODATA CIC, a UK-based Community Interest Company dedicated to sustainability, data analytics, and environmental impact.

Your role is to assist users by answering questions about ECODATA's services, impact metrics, and sustainability initiatives. You should be friendly, informative, and guide users toward taking action like booking appointments, donating, or subscribing to the newsletter.

Here's key information about ECODATA CIC:

SERVICES:
${servicesSection}

IMPACT METRICS:
${impactSection}

SUSTAINABLE DEVELOPMENT GOALS (SDGs) WE SUPPORT:
${sdgSection}

FREQUENTLY ASKED QUESTIONS:
${faqSection}

GUIDELINES:
1. Provide concise, helpful responses focused on ECODATA's work
2. For technical or detailed questions, suggest booking an appointment
3. For donation inquiries, direct users to the support/donate page
4. For newsletter subscriptions, direct to the newsletter signup form
5. Use British English spelling (e.g., "organisation" not "organization")
6. If you don't know an answer, don't make things up - suggest contacting ECODATA directly
7. For services, always link to specific service pages like "/services/digital-literacy", "/services/web-development", "/services/environmental-research", "/services/data-analytics", "/services/community-innovation", "/services/it-consultancy", or "/services/social-impact" (never use just "/services" as it doesn't exist)
8. Always maintain a positive, supportive tone aligned with environmental values

Keep responses under 120 words unless complex information is requested.
`;
}

/**
 * Process a user message and generate a response using OpenAI
 */
export async function processChatMessage(
  message: string,
  context: ChatbotContext
): Promise<string> {
  try {
    // For very basic queries, we can use a rule-based approach to save API calls
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword matching for basic queries
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi ")) {
      return "Hello! I'm EcodataBot, here to help with questions about ECODATA CIC's services, impact initiatives, and sustainability projects. How can I assist you today?";
    }

    // Simple navigation helpers
    if (lowerMessage.includes("contact") && lowerMessage.includes("how")) {
      return "You can contact ECODATA CIC through our contact form at /contact, or book an appointment directly at /book-appointment. Would you like more details about either option?";
    }
    
    // Service navigation helper - ensure we direct to specific service pages
    if (lowerMessage.includes("services") && (lowerMessage.includes("what") || lowerMessage.includes("offer") || lowerMessage.includes("provide"))) {
      return "ECODATA CIC offers several services: Digital Literacy & Tech Training (/services/digital-literacy), Web Development (/services/web-development), IT Consultancy (/services/it-consultancy), Environmental Research (/services/environmental-research), Data Analytics (/services/data-analytics), and Community Innovation & Social Impact Projects (/services/community-innovation). Which would you like to learn more about?";
    }

    // For more complex queries, use the OpenAI API
    const systemPrompt = generateSystemPrompt(context);
    
    const response = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try asking in a different way.";
  } catch (error) {
    console.error("Error in OpenAI service:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact ECODATA directly through our contact page.";
  }
}

/**
 * Rate limiting implementation to prevent abuse
 */
const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function isRateLimited(userId: string): boolean {
  const MAX_REQUESTS = 10; // Maximum 10 requests
  const WINDOW_MS = 60 * 1000; // per minute (60000ms)
  
  const now = Date.now();
  const userRequests = requestCounts.get(userId);
  
  // If no previous requests or window expired, create new record
  if (!userRequests || now - userRequests.timestamp > WINDOW_MS) {
    requestCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }
  
  // If within window but exceeded limit
  if (userRequests.count >= MAX_REQUESTS) {
    return true;
  }
  
  // Within window and below limit, increment count
  userRequests.count += 1;
  return false;
}