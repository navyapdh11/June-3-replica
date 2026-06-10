import { ServiceItem, WebhookConfig, LocationItem, IndustryItem, AppUser, SupportTicket } from "./types";

export const allServices: ServiceItem[] = [
  {
    name: "Regular Cleaning",
    slug: "regular-cleaning",
    icon: "🧹",
    category: "Domestic",
    description: "Routine maintenance for a clean, consistent living environment (Fantastic & Jim's style).",
    baseRatePerHour: 45,
    rating: 4.9,
    durationEstimateHours: 3,
  },
  {
    name: "Commercial Cleaning",
    slug: "commercial-cleaning",
    icon: "🏢",
    category: "Commercial",
    description: "Enterprise-grade office complexes, retail, and corporate facilities under ISO WHS guidelines.",
    baseRatePerHour: 48,
    rating: 4.9,
    durationEstimateHours: 4,
  },
  {
    name: "Office Cleaning",
    slug: "office-cleaning",
    icon: "💼",
    category: "Commercial",
    description: "Scheduled high-frequency sanitation of workstations, boardrooms, and communal breakrooms.",
    baseRatePerHour: 42,
    rating: 4.8,
    durationEstimateHours: 3,
  },
  {
    name: "Carpet Cleaning",
    slug: "carpet-cleaning",
    icon: "🧹",
    category: "Specialised",
    description: "Deep hot-water steam extraction, commercial stain removal, and fibre conditioning.",
    baseRatePerHour: 65,
    rating: 4.7,
    durationEstimateHours: 2,
  },
  {
    name: "Tile & Grout",
    slug: "tile-grout-cleaning",
    icon: "🧱",
    category: "Specialised",
    description: "High-pressure dynamic scrubbing, grout acid washing, and protective hydrophobic coating.",
    baseRatePerHour: 70,
    rating: 4.6,
    durationEstimateHours: 3,
  },
  {
    name: "Window Cleaning",
    slug: "window-cleaning",
    icon: "🪟",
    category: "Specialised",
    description: "Deionised water reach-pole exterior wash, safety harness high-rise, and interior glass polishing.",
    baseRatePerHour: 55,
    rating: 4.5,
    durationEstimateHours: 3,
  },
  {
    name: "Pressure Cleaning",
    slug: "pressure-cleaning",
    icon: "💦",
    category: "Specialised",
    description: "Heavy machinery washdown, concrete driveways, brick masonry scaling, and stain blasting.",
    baseRatePerHour: 80,
    rating: 4.9,
    durationEstimateHours: 2,
  },
  {
    name: "NDIS Cleaning",
    slug: "ndis-cleaning",
    icon: "♿",
    category: "Domestic",
    description: "Fully registered NDIS support-compliant household hygiene, regular carer-compatible maintenance.",
    baseRatePerHour: 45,
    rating: 4.95,
    durationEstimateHours: 3,
  },
  {
    name: "End of Lease",
    slug: "end-of-lease-cleaning",
    icon: "🔑",
    category: "Domestic",
    description: "100% Bond Back guarantee coverage of domestic and corporate tenancy exit specifications.",
    baseRatePerHour: 50,
    rating: 4.85,
    durationEstimateHours: 6,
  },
  {
    name: "Builders Cleaning",
    slug: "builders-cleaning",
    icon: "🏗️",
    category: "Specialised",
    description: "Post-construction dust filtration, silica protective control, premium detailing finishes.",
    baseRatePerHour: 85,
    rating: 4.75,
    durationEstimateHours: 8,
  },
  {
    name: "Upholstery Cleaning",
    slug: "upholstery-cleaning",
    icon: "🛋️",
    category: "Specialised",
    description: "Fabric, commercial seating, and high-quality leather steam sanitation and stain shield.",
    baseRatePerHour: 60,
    rating: 4.65,
    durationEstimateHours: 2,
  },
  {
    name: "Bathroom Sanitising",
    slug: "bathroom-cleaning",
    icon: "Shower",
    category: "Commercial",
    description: "Heavy chemical wash, microbial disinfectant coating, deep-drain cleaning and replenishment.",
    baseRatePerHour: 42,
    rating: 4.4,
    durationEstimateHours: 1.5,
  },
  {
    name: "Kitchen Deep-Clean",
    slug: "kitchen-cleaning",
    icon: "🍳",
    category: "Commercial",
    description: "HACCP compliant kitchen sanitation, extraction canopy steam, flat-top carbon scraping.",
    baseRatePerHour: 58,
    rating: 4.8,
    durationEstimateHours: 4,
  }
];

export const demoPostcodes = ["6000", "6004", "6005", "6007", "6008", "6009", "6010", "6019", "6027", "6160", "6210", "2000", "2001", "2002", "3000", "3001", "3002", "4000", "4001", "4002", "5000", "7000", "8000"];

export const defaultWebhookConfig: WebhookConfig = {
  webhookUrl: "https://api.aastaclean.com/v1/quotes",
  headerName: "X-AASTACLEAN-CRM-KEY",
  headerValue: "aasta_secret_bearer_926600",
  crmType: "Zapier",
  triggerOnQuote: true,
  triggerOnSearch: true,
  isActive: true,
};

export const allLocations: LocationItem[] = [
  {
    id: "loc_syd",
    cityName: "Sydney",
    slug: "sydney",
    state: "NSW",
    address: "Level 14, 200 George St, Sydney NSW 2000",
    phone: "1300 112 233",
    email: "sydney@aastaclean.com.au",
    latitude: -33.8634,
    longitude: 151.2111,
    managerName: "Marcus Sterling",
    isHeadquarters: true
  },
  {
    id: "loc_mel",
    cityName: "Melbourne",
    slug: "melbourne",
    state: "VIC",
    address: "Suite 4B, 360 Collins St, Melbourne VIC 3000",
    phone: "1300 112 244",
    email: "melbourne@aastaclean.com.au",
    latitude: -37.8142,
    longitude: 144.9631,
    managerName: "Elena Rostova"
  },
  {
    id: "loc_per",
    cityName: "Perth",
    slug: "perth",
    state: "WA",
    address: "88 William St, Perth WA 6000",
    phone: "1300 112 255",
    email: "perth@aastaclean.com.au",
    latitude: -31.9523,
    longitude: 115.8613,
    managerName: "Brodie Marshall"
  },
  {
    id: "loc_bne",
    cityName: "Brisbane",
    slug: "brisbane",
    state: "QLD",
    address: "Level 3, 10 Eagle St, Brisbane QLD 4000",
    phone: "1300 112 266",
    email: "brisbane@aastaclean.com.au",
    latitude: -27.4698,
    longitude: 153.0251,
    managerName: "Sarah Reynolds"
  }
];

export const allIndustries: IndustryItem[] = [
  {
    id: "ind_health",
    name: "Medical & Healthcare",
    slug: "healthcare",
    icon: "🏥",
    heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600",
    description: "Pathology facilities, dental clinics, aged care sanitisation matching strict state-level environmental bio-hazard control.",
    compliancePrereqs: ["AS/NZS 4187 Compliance", "Infection Control Certification", "TGA-Approved Disinfectant Standard"],
    keyClients: ["Metro Health NSW", "Brisbane Dental Precinct", "Starlight Aged Care"]
  },
  {
    id: "ind_ndis",
    name: "NDIS Registered Support",
    slug: "ndis",
    icon: "♿",
    heroImage: "https://images.unsplash.com/photo-1508847154043-be12a3bab74a?q=80&w=600",
    description: "Specialized in-home support plan-compliant services enabling safe mobility, allergen eradication and dynamic carer check-in registries.",
    compliancePrereqs: ["NDIS Practice Standards", "Worker Screening Checks", "Specialised Assistive Technology Safety"],
    keyClients: ["Aria Disability Care", "Melbourne Plan Managers"]
  },
  {
    id: "ind_corp",
    name: "Corporate & Enterprise Offices",
    slug: "corporate",
    icon: "🏢",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    description: "Multistory CBD commercial towers, boards facilities, secure computer storage nodes under rigid WHS policy.",
    compliancePrereqs: ["ISO 9001 Quality Certified", "WHS Act 2011 Compliance", "Secure Keyholding & NDA Clearances"],
    keyClients: ["Sydney Equity Group", "Vanguard Collins", "TechHub Australia"]
  },
  {
    id: "ind_construction",
    name: "Post-Build & Construction",
    slug: "builders",
    icon: "🏗️",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600",
    description: "Post-masonry particulate sweeps, silica dust fine-filtration, safety window scraping, and pre-occupancy sign-off handovers.",
    compliancePrereqs: ["White Card Verified Team", "Silica Dust Safety Equipment", "Commercial Structural Sign-Off Standards"],
    keyClients: ["Multiplex West", "Mirvac Corporate Group", "Lendlease Regional Development"]
  }
];

export const defaultUsers: AppUser[] = [
  {
    id: "usr_admin",
    email: "admin@aastaclean.com.au",
    fullName: "Marcus Sterling",
    role: "admin",
    phone: "0412 999 888"
  },
  {
    id: "usr_cleaner",
    email: "liam.vance@aastaclean.com.au",
    fullName: "Liam Vance",
    role: "cleaner",
    phone: "0412 111 222"
  },
  {
    id: "usr_cust",
    email: "client@sydneycorp.com.au",
    fullName: "Sophia Harrington",
    role: "customer",
    phone: "0422 345 678",
    companyName: "Sydney Corp Ltd"
  }
];

export const defaultTickets: SupportTicket[] = [
  {
    id: "tkt_101",
    customerId: "usr_cust",
    customerName: "Sophia Harrington",
    subject: "NDIS Compliance Billing Request",
    messages: [
      {
        id: "msg_1",
        sender: "customer",
        message: "Hi, I need an NDIS-compliant service item breakdown added to our upcoming invoice for auditing purposes.",
        timestamp: "2026-06-08T09:30:00Z"
      },
      {
        id: "msg_2",
        sender: "system",
        message: "Ticket assigned to Corporate Care Desk. Marcus Sterling is reviewing.",
        timestamp: "2026-06-08T09:35:00Z"
      },
      {
        id: "msg_3",
        sender: "agent",
        message: "Hello Sophia! I have updated your account profile. All future invoices will automatically list your exact Plan Reference & support guidelines.",
        timestamp: "2026-06-08T10:15:00Z"
      }
    ],
    status: "open",
    priority: "high",
    createdAt: "2026-06-08T09:30:00Z"
  }
];

