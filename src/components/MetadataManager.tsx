import { useCleaners } from "../context/CleanersContext";
import React, { useEffect } from "react";

interface MetadataManagerProps {
  currentView: "client" | "admin" | "cleaner" | "seo";
  selectedPostcode?: string;
}

const SUBURB_MAP: Record<string, { suburb: string; state: string; law: string; council: string }> = {
  "6008": { suburb: "Subiaco", state: "WA", law: "Work Health and Safety Act 2020 (WA)", council: "City of Subiaco" },
  "2000": { suburb: "Sydney CBD", state: "NSW", law: "Work Health and Safety Act 2011 (NSW)", council: "City of Sydney" },
  "3000": { suburb: "Melbourne CBD", state: "VIC", law: "Occupational Health and Safety Act 2004 (VIC)", council: "City of Melbourne" },
  "4000": { suburb: "Brisbane CBD", state: "QLD", law: "Work Health and Safety Act 2011 (QLD)", council: "City of Brisbane" },
  "5000": { suburb: "Adelaide CBD", state: "SA", law: "Work Health and Safety Act 2012 (SA)", council: "City of Adelaide" },
  "6007": { suburb: "West Leederville", state: "WA", law: "Work Health and Safety Act 2020 (WA)", council: "Town of Cambridge" },
  "7000": { suburb: "Hobart", state: "TAS", law: "Work Health and Safety Act 2012 (TAS)", council: "City of Hobart" },
  "8000": { suburb: "Darwin", state: "NT", law: "Work Health and Safety Act 2011 (NT)", council: "City of Darwin" }
};

export default function MetadataManager({ currentView, selectedPostcode = "6008" }: MetadataManagerProps) {
  useEffect(() => {
    const geo = SUBURB_MAP[selectedPostcode] || {
      suburb: "National Capital",
      state: "ACT",
      law: "Work Health and Safety Act 2011 (Cth)",
      council: "National Capital Authority"
    };

    // 1. Dynamic Title Formulation
    let computedTitle = "AASTACLEAN Enterprise | Triple-ISO Certified Australia Cleaning";
    let computedDesc = "Get professional, ISO 9001/45001 certified commercial, office, carpet, and NDIS cleaning. Premium standard compliant workflows across Australia.";
    let computedKeywords = "commercial cleaning, NDIS cleaning, office sanitation, triple-certified cleaners, carpet steam extraction, Australia cleaning agency";

    if (currentView === "client") {
      computedTitle = `AASTACLEAN Enterprise | Premium Cleaning in ${geo.suburb} ${selectedPostcode}`;
      computedDesc = `AASTACLEAN provides premium commercial, office, carpet & NDIS cleaning services in ${geo.suburb} (${geo.state} ${selectedPostcode}). Operating under ${geo.law} in the ${geo.council}. Book instantly with direct dispatch!`;
      computedKeywords = `cleaners ${geo.suburb}, office cleaning ${geo.suburb} ${selectedPostcode}, NDIS cleaners ${selectedPostcode}, ${geo.council} commercial sanitising`;
    } else if (currentView === "admin") {
      computedTitle = "Admin System Panel | AASTACLEAN Roster Control & Dispatch Hub";
      computedDesc = "Internal secure control tower for scheduling accredited multi-user technicians and validating CRM webhook dispatches.";
    } else if (currentView === "cleaner") {
      computedTitle = "Accredited Crew Members Terminal | AASTACLEAN Mobile";
      computedDesc = "Electronic job verification, checklist audits, safe site-arrival timers, and client sign-off digital signature logs.";
    } else if (currentView === "seo") {
      computedTitle = "E-E-A-T & AEO Command Console | AASTACLEAN SEO Systems";
      computedDesc = "Analyze live Perplexity search results, validate localized citations, and inject schema.org spatial microdata patterns.";
    }

    document.title = computedTitle;

    // 2. Setup Meta Elements
    let metaDescElt = document.querySelector('meta[name="description"]');
    if (!metaDescElt) {
      metaDescElt = document.createElement("meta");
      metaDescElt.setAttribute("name", "description");
      document.head.appendChild(metaDescElt);
    }
    metaDescElt.setAttribute("content", computedDesc);

    let metaKeywordsElt = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsElt) {
      metaKeywordsElt = document.createElement("meta");
      metaKeywordsElt.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywordsElt);
    }
    metaKeywordsElt.setAttribute("content", computedKeywords);

    // 3. Inject Schema.org LocalBusiness Structured Microdata
    let schemaScriptElt = document.getElementById("aastaclean-localbusiness-schema");
    if (!schemaScriptElt) {
      schemaScriptElt = document.createElement("script");
      schemaScriptElt.setAttribute("type", "application/ld+json");
      schemaScriptElt.setAttribute("id", "aastaclean-localbusiness-schema");
      document.head.appendChild(schemaScriptElt);
    }

  const { inputData } = useCleaners(); // Access context for intent-based flags
  

    const isNDIS = inputData?.slaTier === 'ndis-certified' || inputData?.slaTier === 'ndis';
    const isHACCP = inputData?.slaTier === 'gold-haccp' || inputData?.slaTier === 'haccp';
    const isPlatinum = inputData?.slaTier === 'platinum-surgical' || inputData?.slaTier === 'platinum';

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `AASTACLEAN Premium - ${geo.suburb}`,
      "additionalProperty": [
        isNDIS && { "@type": "PropertyValue", "name": "ServiceTier", "value": "NDIS Registered Provider" },
        isHACCP && { "@type": "PropertyValue", "name": "ServiceTier", "value": "HACCP Certified Facility Hygiene" },
        isPlatinum && { "@type": "PropertyValue", "name": "ServiceTier", "value": "Platinum Surgical Grade Sanitisation" }
      ].filter(Boolean),
      

      "image": "https://aastaclean.com.au/assets/hero.jpg",
      "telephone": "1300 00 AASTA",
      "email": "corporate@aastaclean.com.au",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": geo.suburb,
        "addressRegion": geo.state,
        "postalCode": selectedPostcode,
        "addressCountry": "AU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": selectedPostcode === "2000" ? "-33.8688" : selectedPostcode === "3000" ? "-37.8136" : "-31.9505",
        "longitude": selectedPostcode === "2000" ? "151.2093" : selectedPostcode === "3000" ? "144.9631" : "115.8605"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Professional Compliance Cleaning Catalog",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Office Sanitisation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "NDIS Accessible Domestic Cleaning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "High Pressure Concrete Extraction" } }
        ]
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": geo.suburb },
        { "@type": "AdministrativeArea", "name": geo.council }
      ],
      "knowsAbout": [
        "ISO 9001 Certified Quality Management",
        "ISO 45001 Occupational Health and Safety Guidelines",
        geo.law
      ]
    };

    schemaScriptElt.textContent = JSON.stringify(localBusinessSchema, null, 2);

    return () => {
      // Document reset defaults if preferred (or leave for SPA state transitions)
    };
  }, [currentView, selectedPostcode]);

  return null; // Side-effect node only
}
