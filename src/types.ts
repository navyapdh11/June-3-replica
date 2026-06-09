export interface ServiceItem {
  name: string;
  slug: string;
  icon: string;
  category: "Commercial" | "Specialised" | "Domestic";
  description: string;
  baseRatePerHour: number;
  rating: number;
  durationEstimateHours: number;
}

export interface SelectedAddon {
  name: string;
  price: number;
  icon?: string;
  quantity?: number;
}

export interface QuoteRequest {
  id: string;
  postcode: string;
  serviceName: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  timestamp: string;
  status: "pending" | "transmitted" | "failed";
  estimatedTotal?: number;
  assignedCleaner?: string;
  bookingStatus?: "pending" | "assigned" | "en-route" | "in-progress" | "completed";
  clientSignature?: string;
  siteArrivalTime?: string;
  siteDepartureTime?: string;
  actualSiteMinutes?: number;
  beforePhotos?: string[];
  afterPhotos?: string[];
  sentEmails?: Array<{ recipient: string; templateType: string; timestamp: string }>;
  // Dynamic Australian Booking Fields
  selectedAddons?: SelectedAddon[];
  subserviceName?: string;
  bedroomCount?: number;
  bathroomCount?: number;
  deskCount?: number;
  communalCount?: number;
  frequencyOption?: string;
  propertyType?: string;
  // Phase 1 Advanced Booking Fields
  roomBreakdown?: Record<string, number>;
  slaTier?: string;
  schedulingDetails?: {
    preferredDate?: string;
    timeSlot?: string; // e.g., Morning, Out-of-Hours/Nocturnal, Weekend Surge
    keyExchange?: string; // e.g., Lockbox PIN, Secure Keyholding, Front-desk Sign-in, Security Escort
  };
  assignedCrewId?: string;
  businessName?: string;
  industry?: string;
  isFlagged?: boolean;
}

export interface Cleaner {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive" | "vacation";
  rating: number;
}

export interface WebhookConfig {
  webhookUrl: string;
  headerName: string;
  headerValue: string;
  crmType: "Zapier" | "HubSpot" | "Salesforce" | "Custom webhook" | "Cleaners App API" | "Payload CRM";
  triggerOnQuote: boolean;
  triggerOnSearch: boolean;
  isActive: boolean;
}

export interface ConnectionLog {
  id: string;
  type: "webhook" | "crm" | "api" | "system";
  message: string;
  timestamp: string;
  status: "success" | "warning" | "info" | "error";
  payload?: any;
}

export interface StateCoverage {
  code: string;
  name: string;
  isActive: boolean;
}

export interface PostcodeCoverage {
  code: string;
  suburb: string;
  state: string;
  isActive: boolean;
  multiplier: number;
  disabledServices: string[];
}

export interface LocationItem {
  id: string;
  cityName: string;
  slug: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  managerName: string;
  isHeadquarters?: boolean;
}

export interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  heroImage: string;
  description: string;
  compliancePrereqs: string[];
  keyClients: string[];
}

export interface Job {
  id: string;
  quoteId: string;
  cleanerId: string;
  status: "assigned" | "en-route" | "in-progress" | "completed" | "paused";
  checklistProgressPercentage: number;
  completedTasks: string[];
  photoProofIds: string[];
  startTime: string;
  endTime?: string;
}

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "cleaner" | "customer" | "guest";
  phone?: string;
  companyName?: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  messages: Array<{
    id: string;
    sender: "customer" | "agent" | "system";
    message: string;
    timestamp: string;
  }>;
  status: "open" | "resolved" | "pending_client";
  priority: "low" | "medium" | "high";
  createdAt: string;
}


