import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoServices from "./components/BentoServices";
import IntegrationConsole from "./components/IntegrationConsole";
import DeveloperSuite from "./components/DeveloperSuite";
import CoverageCertifications from "./components/CoverageCertifications";
import { useRef } from "react";
import QuoteModal from "./components/QuoteModal";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

// New components
import AdminPanel from "./components/AdminPanel";
import CleanersApp from "./components/CleanersApp";
import SeoEEATCommand from "./components/SeoEEATCommand";
import MetadataManager from "./components/MetadataManager";
import ServiceExplorer from "./components/ServiceExplorer";
import PricingCalculator from "./components/PricingCalculator";
import CustomerDashboard from "./components/CustomerDashboard";
import HermesChatwootWidget from "./components/HermesChatwootWidget";
import ProgrammaticLandingPage from "./components/ProgrammaticLandingPage";
import CityBranchHub from "./components/CityBranchHub";

import { QuoteRequest, ConnectionLog, WebhookConfig, Cleaner, ServiceItem, StateCoverage, PostcodeCoverage } from "./types";
import { defaultWebhookConfig, allServices } from "./data";
import { Copy, Terminal, Database, Check, AlertCircle, Sparkles, Code, Link2 } from "lucide-react";
import { safeLocalStorage as localStorage } from "./utils/storageFallback";

const DEFAULT_CLEANERS: Cleaner[] = [
  { id: "cleaner_1", name: "Liam Vance", phone: "0412 111 222", email: "liam.vance@aastaclean.com.au", status: "active", rating: 4.9 },
  { id: "cleaner_2", name: "Niamh O'Connor", phone: "0423 222 333", email: "niamh.oconnor@aastaclean.com.au", status: "active", rating: 5.0 },
  { id: "cleaner_3", name: "Brodie Marshall", phone: "0491 555 777", email: "brodie.marshall@aastaclean.com.au", status: "active", rating: 4.8 },
  { id: "cleaner_4", name: "Aiden Fletcher", phone: "0405 888 999", email: "aiden.fletcher@aastaclean.com.au", status: "active", rating: 4.7 }
];

const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: "booking_101",
    postcode: "6008",
    propertyType: "Standalone House",
    serviceName: "Commercial Cleaning",
    name: "Sarah Reynolds",
    email: "sarah.reynolds@enterprise.com.au",
    phone: "0412345678",
    notes: "Requires standard commercial silica guidelines and Hepa filtration vacuuming.",
    timestamp: "2026-05-24T05:00:00Z",
    status: "transmitted",
    estimatedTotal: 288,
    assignedCleaner: "Liam Vance",
    bookingStatus: "en-route"
  },
  {
    id: "booking_102",
    postcode: "2000",
    propertyType: "Apartment",
    serviceName: "Carpet Cleaning",
    name: "Mark Chesterfield",
    email: "mark.c@sydneycorp.com.au",
    phone: "0433777888",
    notes: "Deep mud stains in boardroom carpet fibers. Needs high steam deionised water extract.",
    timestamp: "2026-05-25T01:15:00Z",
    status: "transmitted",
    estimatedTotal: 390,
    bookingStatus: "pending"
  },
  {
    id: "booking_103",
    postcode: "3000",
    propertyType: "Townhouse",
    serviceName: "NDIS Cleaning",
    name: "Chloe Henderson",
    email: "chloe.henderson@ndis-care.com.au",
    phone: "0499111222",
    notes: "Carer check-in is required before entering. Hypoallergenic compounds.",
    timestamp: "2026-05-25T03:30:00Z",
    status: "transmitted",
    estimatedTotal: 180,
    assignedCleaner: "Niamh O'Connor",
    bookingStatus: "completed"
  }
];

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const coverageRef = useRef<HTMLDivElement>(null);
  // Modal & Service Selection State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  // Geographic / Admin states initialized from data or localStorage
  const [dynServices, setDynServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem("aastaclean_services");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return allServices;
  });

  const [dynStates, setDynStates] = useState<StateCoverage[]>(() => {
    const saved = localStorage.getItem("aastaclean_states");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { code: "NSW", name: "New South Wales", isActive: true },
      { code: "VIC", name: "Victoria", isActive: true },
      { code: "QLD", name: "Queensland", isActive: true },
      { code: "WA", name: "Western Australia", isActive: true },
      { code: "SA", name: "South Australia", isActive: true },
      { code: "TAS", name: "Tasmania", isActive: true },
      { code: "NT", name: "Northern Territory", isActive: true }
    ];
  });

  const [dynPostcodes, setDynPostcodes] = useState<PostcodeCoverage[]>(() => {
    const defaultPostcodes: PostcodeCoverage[] = [
      { code: "2000", suburb: "Sydney CBD", state: "NSW", isActive: true, multiplier: 1.30, disabledServices: [] },
      { code: "3000", suburb: "Melbourne Central", state: "VIC", isActive: true, multiplier: 1.15, disabledServices: [] },
      { code: "4000", suburb: "Brisbane City", state: "QLD", isActive: true, multiplier: 1.10, disabledServices: [] },
      { code: "6000", suburb: "Perth CBD", state: "WA", isActive: true, multiplier: 1.25, disabledServices: [] },
      { code: "6004", suburb: "East Perth", state: "WA", isActive: true, multiplier: 1.20, disabledServices: [] },
      { code: "6005", suburb: "West Perth", state: "WA", isActive: true, multiplier: 1.15, disabledServices: [] },
      { code: "6007", suburb: "West Leederville", state: "WA", isActive: true, multiplier: 1.20, disabledServices: [] },
      { code: "6008", suburb: "Subiaco", state: "WA", isActive: true, multiplier: 1.20, disabledServices: [] },
      { code: "6009", suburb: "Nedlands", state: "WA", isActive: true, multiplier: 1.15, disabledServices: [] },
      { code: "6010", suburb: "Claremont", state: "WA", isActive: true, multiplier: 1.22, disabledServices: [] },
      { code: "6019", suburb: "Scarborough", state: "WA", isActive: true, multiplier: 1.18, disabledServices: [] },
      { code: "6027", suburb: "Joondalup", state: "WA", isActive: true, multiplier: 1.10, disabledServices: [] },
      { code: "6160", suburb: "Fremantle", state: "WA", isActive: true, multiplier: 1.22, disabledServices: [] },
      { code: "6210", suburb: "Mandurah", state: "WA", isActive: true, multiplier: 1.05, disabledServices: [] }
    ];
    const saved = localStorage.getItem("aastaclean_postcodes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PostcodeCoverage[];
        const merged = [...parsed];
        defaultPostcodes.forEach(defPC => {
          if (!merged.some(p => p.code === defPC.code)) {
            merged.push(defPC);
          }
        });
        return merged;
      } catch (e) {}
    }
    return defaultPostcodes;
  });

  // Guardrail states
  const [travelSurcharge, setTravelSurcharge] = useState<number>(() => {
    const saved = localStorage.getItem("aastaclean_travel_surcharge");
    return saved !== null ? Number(saved) : 15;
  });

  const [isUrgentActive, setIsUrgentActive] = useState<boolean>(() => {
    const saved = localStorage.getItem("aastaclean_is_urgent_active");
    return saved === "true";
  });

  const [minHoursLimit, setMinHoursLimit] = useState<number>(() => {
    const saved = localStorage.getItem("aastaclean_min_hours_limit");
    return saved !== null ? Number(saved) : 3;
  });

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem("aastaclean_services", JSON.stringify(dynServices));
  }, [dynServices]);

  useEffect(() => {
    localStorage.setItem("aastaclean_states", JSON.stringify(dynStates));
  }, [dynStates]);

  useEffect(() => {
    localStorage.setItem("aastaclean_postcodes", JSON.stringify(dynPostcodes));
  }, [dynPostcodes]);

  useEffect(() => {
    localStorage.setItem("aastaclean_travel_surcharge", String(travelSurcharge));
  }, [travelSurcharge]);

  useEffect(() => {
    localStorage.setItem("aastaclean_is_urgent_active", String(isUrgentActive));
  }, [isUrgentActive]);

  useEffect(() => {
    localStorage.setItem("aastaclean_min_hours_limit", String(minHoursLimit));
  }, [minHoursLimit]);

  // Dev mode toggle & config variables
  const [isDevMode, setIsDevMode] = useState(false);
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [cleaners, setCleaners] = useState<Cleaner[]>(DEFAULT_CLEANERS);
  const [currentView, setCurrentView] = useState<"client" | "admin" | "cleaner" | "seo" | "developer" | "services" | "pricing" | "dashboard" | "city-hub">("client");

  // Local state for tracking the webhook parameter settings
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(defaultWebhookConfig);

  // Initialize standard starter logs
  useEffect(() => {
    addLog({
      id: "log_init_system",
      type: "system",
      status: "success",
      message: "🤖 AASTACLEAN REST Core Router Engine initialised successfully. Status: 200 OK.",
      timestamp: new Date().toLocaleTimeString(),
    });

    addLog({
      id: "log_init_connector",
      type: "api",
      status: "info",
      message: "🛰️ Standing standby to transmit quote parameters. Sandbox mode is active.",
      timestamp: new Date().toLocaleTimeString(),
    });
  }, []);

  const addLog = (newLog: ConnectionLog) => {
    setLogs((prev) => {
      if (prev.some((log) => log.id === newLog.id)) {
        return prev;
      }
      return [...prev, newLog];
    });
  };

  const clearLogs = () => {
    setLogs([]);
    addLog({
      id: Math.random().toString(),
      type: "system",
      status: "info",
      message: "Console manually flushed. Ready.",
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // Trigger when a postcode gets submitted from the Hero component
  const handlePostcodeSubmit = (postcode: string) => {
    // 1. Log to developers console
    addLog({
      id: `pc_check_${Date.now()}`,
      type: "system",
      status: "info",
      message: `🔎 GEO Postcode lookup triggered: validated postcode "${postcode}" matching active state metrics`,
      timestamp: new Date().toLocaleTimeString(),
    });

    // 2. Simulate active Webhook trigger for Postcode searches
    if (webhookConfig.isActive && webhookConfig.triggerOnSearch) {
      triggerSimulatedWebhook({
        event: "POSTCODE_LOOKUP",
        data: { postcode, status: "covered", country: "Australia", latencyMs: 45 },
      });
    }
  };

  // Trigger when a quote gets successfully requested inside the modal
  const handleQuoteSubmit = (newQuote: QuoteRequest) => {
    setQuotes((prev) => [...prev, newQuote]);

    // 1. Log to developers console
    addLog({
      id: `quote_reg_${newQuote.id}`,
      type: "system",
      status: "success",
      message: `📝 Lead transaction created for client: "${newQuote.name}" - Service: "${newQuote.serviceName}"`,
      timestamp: new Date().toLocaleTimeString(),
    });

    // 2. Simulate high-end Webhook post dynamic action
    if (webhookConfig.isActive && webhookConfig.triggerOnQuote) {
      triggerSimulatedWebhook({
        event: "QUOTE_CREATED",
        data: newQuote,
      });
    }
  };

  // Function that simulates dynamic HTTP request delivery to external platforms
  const triggerSimulatedWebhook = async (payload: { event: string; data: any }) => {
    addLog({
      id: `wh_fire_${Date.now()}`,
      type: "webhook",
      status: "info",
      message: `🚀 Autotrigger: Transmitting payload event "${payload.event}" to CRM endpoint: ${webhookConfig.webhookUrl}`,
      timestamp: new Date().toLocaleTimeString(),
      payload: payload,
    });

    // Perform real fetch call if they set up custom target API (like Zapier Catch hooks or make.com)
    const isMockUrl = webhookConfig.webhookUrl.includes("aastaclean.com") || webhookConfig.webhookUrl.includes("example.com");
    
    if (!isMockUrl && webhookConfig.webhookUrl.startsWith("http")) {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (webhookConfig.headerName && webhookConfig.headerValue) {
          headers[webhookConfig.headerName] = webhookConfig.headerValue;
        }

        const response = await fetch(webhookConfig.webhookUrl, {
          method: "POST",
          mode: "cors",
          headers,
          body: JSON.stringify(payload),
        });

        addLog({
          id: `wh_resp_${Date.now()}`,
          type: "crm",
          status: "success",
          message: `🎯 Webhook broadcast delivered. Remote response status: ${response.status} ${response.statusText}`,
          timestamp: new Date().toLocaleTimeString(),
          payload: { status: response.status },
        });
      } catch (err: any) {
        addLog({
          id: `wh_err_${Date.now()}`,
          type: "crm",
          status: "error",
          message: `⚠️ REST Dispatcher failed: CORS rejection or site offline. Trace logic: ${err?.message}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } else {
      // Nice simulated timeout
      setTimeout(() => {
        addLog({
          id: `wh_sim_ok_${Date.now()}`,
          type: "crm",
          status: "success",
          message: `🛰️ [Simulated Autotrigger Ok] Event "${payload.event}" ingested cleanly on connected Webhook. 200 OK.`,
          timestamp: new Date().toLocaleTimeString(),
          payload: {
            success: true,
            networkLatency: "145ms",
            status: 200,
            simulatedSystem: webhookConfig.crmType,
            eventPayload: payload,
          },
        });
      }, 600);
    }
  };

  const handleOpenQuote = (serviceName?: string) => {
    setSelectedService(serviceName || "");
    setIsQuoteOpen(true);
  };

  const toggleDevMode = () => {
    const nextDev = !isDevMode;
    setIsDevMode(nextDev);
    if (nextDev) {
      setCurrentView("developer");
    } else {
      setCurrentView("client");
    }
  };

  const scrollToCoverage = () => {
    setCurrentView("client");
    setTimeout(() => coverageRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const handleViewChange = (view: "client" | "admin" | "cleaner" | "seo" | "developer" | "services" | "pricing" | "dashboard" | "city-hub") => {
    setCurrentView(view);
    if (view === "developer") {
      setIsDevMode(true);
    } else {
      setIsDevMode(false);
    }
  };

  // Roster mutations and synced scheduling update dispatchers
  const handleAddCleaner = (newCleaner: Cleaner) => {
    setCleaners((prev) => [...prev, newCleaner]);
    addLog({
      id: `add_cleaner_${Date.now()}`,
      type: "system",
      status: "success",
      message: `👤 Added accredited cleaner: "${newCleaner.name}" with a starting rating of ${newCleaner.rating.toFixed(1)}`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleRemoveCleaner = (id: string) => {
    const cleaner = cleaners.find((c) => c.id === id);
    setCleaners((prev) => prev.filter((c) => c.id !== id));
    if (cleaner) {
      addLog({
        id: `rm_cleaner_${Date.now()}`,
        type: "system",
        status: "warning",
        message: `👤 Revoked system credentials for cleaner: "${cleaner.name}"`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  const handleUpdateQuote = (updatedQuote: QuoteRequest) => {
    setQuotes((prev) => prev.map((q) => q.id === updatedQuote.id ? updatedQuote : q));
    addLog({
      id: `sync_quote_${Date.now()}`,
      type: "system",
      status: "info",
      message: `🔄 Real-time Sync: Syncing status / assignment parameters [${updatedQuote.bookingStatus}] for Job #${updatedQuote.id.slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
    });
    
    if (webhookConfig.isActive && webhookConfig.triggerOnQuote) {
      triggerSimulatedWebhook({
        event: "BOOKING_UPDATED",
        data: updatedQuote,
      });
    }
  };

  const handleRemoveQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    addLog({
      id: `rm_quote_${Date.now()}`,
      type: "system",
      status: "warning",
      message: `📝 Booking transaction #${id.slice(-6)} deleted from database registries`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleAddQuoteManually = (newQuote: QuoteRequest) => {
    setQuotes((prev) => [...prev, newQuote]);
    addLog({
      id: `add_manual_${Date.now()}`,
      type: "system",
      status: "success",
      message: `📝 Created manual dispatch job: ${newQuote.serviceName} - Client: "${newQuote.name}"`,
      timestamp: new Date().toLocaleTimeString(),
    });
    if (webhookConfig.isActive && webhookConfig.triggerOnQuote) {
      triggerSimulatedWebhook({
        event: "BOOKING_CREATED",
        data: newQuote,
      });
    }
  };

  if (!isMounted) return <div className="loading-state flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-purple-500 selection:text-white pb-0">
      
      <MetadataManager 
        currentView={currentView}
        selectedPostcode={quotes.length > 0 ? quotes[quotes.length - 1].postcode : "6008"}
      />

      {/* Persistent Hermes & Chatwoot Omni-Channel Support Drawer (Bottom-Left) */}
      <HermesChatwootWidget 
        onTriggerLog={addLog}
        currentView={currentView}
      />

      {/* Dynamic Dev HUD Sticky Indicator Banner */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleDevMode}
          className="bg-slate-950 text-white hover:text-yellow-400 font-extrabold text-xs px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-800 transition-all hover:scale-105"
        >
          <Code className="w-4 h-4 text-purple-400 stroke-[2.5]" />
          <span>{isDevMode ? "Hide Ingest Console" : "API & CRM Hub Controls"}</span>
          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
        </button>
      </div>

      {/* Floating alert highlighting active connection state */}
      <div className="fixed bottom-24 right-6 z-40 max-w-xs">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xl flex items-start gap-3">
          <div className="p-1.5 bg-indigo-50 rounded-xl text-indigo-600">
            <Link2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-800">Connection Engine</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Active webhook: <span className="font-mono text-purple-700 bg-slate-50 px-1 rounded block mt-0.5 max-w-[150px] truncate">{webhookConfig.webhookUrl}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Primary Header/Navbar with Multi-view switcher selection */}
      <Navbar
        onOpenQuote={handleOpenQuote}
        isDevMode={isDevMode}
        onToggleDevMode={toggleDevMode}
        currentView={currentView}
        onChangeView={handleViewChange}
      />

      {/* Spacing to clear fixed navbar */}
      <div className="h-[76px]" />

      {/* Conditionally Render Experience Portals */}
      {currentView === "client" ? (
        <>
          {/* Hero Header with ZIP locators */}
          <Hero
            onPostcodeSubmit={handlePostcodeSubmit}
            onOpenQuote={handleOpenQuote}
          />

          {/* Bento Layout Services Catalog with price disclosures */}
          <BentoServices
            onSelectService={handleOpenQuote}
          />

          {/* Coverage state maps and strict compliance frameworks */}
          <div ref={coverageRef}><CoverageCertifications /></div>

          {/* Stateful Accordion details */}
          <FAQ />
        </>
      ) : currentView === "services" ? (
        <ServiceExplorer
          onOpenQuote={handleOpenQuote}
          services={dynServices}
          onViewChange={scrollToCoverage}
        />
      ) : currentView === "pricing" ? (
        <PricingCalculator
          onOpenQuote={handleOpenQuote}
          onTriggerLog={addLog}
          services={dynServices}
          postcodes={dynPostcodes}
          states={dynStates}
          travelSurcharge={travelSurcharge}
          isUrgentActive={isUrgentActive}
          minHoursLimit={minHoursLimit}
        />
      ) : currentView === "developer" ? (
        <DeveloperSuite
          latestQuotes={quotes}
          cleaners={cleaners}
          webhookConfig={webhookConfig}
          onWebhookConfigChange={setWebhookConfig}
          onTriggerLog={addLog}
          logs={logs}
          onClearLogs={clearLogs}
          onAddCleaner={handleAddCleaner}
          onAddQuoteManually={handleAddQuoteManually}
        />
      ) : currentView === "admin" ? (
        <AdminPanel
          quotes={quotes}
          cleaners={cleaners}
          onAddCleaner={handleAddCleaner}
          onRemoveCleaner={handleRemoveCleaner}
          onUpdateQuote={handleUpdateQuote}
          onRemoveQuote={handleRemoveQuote}
          onAddQuoteManually={handleAddQuoteManually}
          services={dynServices}
          onUpdateServices={setDynServices}
          states={dynStates}
          onUpdateStates={setDynStates}
          postcodes={dynPostcodes}
          onUpdatePostcodes={setDynPostcodes}
          travelSurcharge={travelSurcharge}
          onUpdateTravelSurcharge={setTravelSurcharge}
          isUrgentActive={isUrgentActive}
          onUpdateUrgentActive={setIsUrgentActive}
          minHoursLimit={minHoursLimit}
          onUpdateMinHoursLimit={setMinHoursLimit}
        />
      ) : currentView === "cleaner" ? (
        <CleanersApp
          quotes={quotes}
          cleaners={cleaners}
          onUpdateQuote={handleUpdateQuote}
          onTriggerLog={addLog}
        />
      ) : currentView === "dashboard" ? (
        <CustomerDashboard
          quotes={quotes}
          cleaners={cleaners}
          onTriggerLog={addLog}
          onUpdateQuote={handleUpdateQuote}
          onChangeView={handleViewChange}
        />
      ) : currentView === "city-hub" ? (
        <CityBranchHub
          quotes={quotes}
          onOpenQuote={handleOpenQuote}
          onTriggerLog={addLog}
        />
      ) : (
        <>
          <ProgrammaticLandingPage
            onOpenQuote={handleOpenQuote}
            onTriggerLog={addLog}
          />
          <SeoEEATCommand
            onTriggerLog={addLog}
          />
        </>
      )}

      {/* Always render Business Footprints Layout */}
      <Footer
        onOpenQuote={handleOpenQuote}
      />

      {/* Multi-step Quote Estimator Modal panel */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        selectedService={selectedService}
        onQuoteSubmit={handleQuoteSubmit}
        onTriggerLog={addLog}
        cleaners={cleaners}
        onUpdateQuote={handleUpdateQuote}
        services={dynServices}
        postcodes={dynPostcodes}
        states={dynStates}
      />

    </div>
  );
}
