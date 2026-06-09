import React, { useState } from "react";
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Compass, 
  ArrowRight, 
  ShieldAlert, 
  DollarSign, 
  Clock, 
  Star,
  Layers,
  MapPin,
  Check,
  Plus,
  Tv,
  Users,
  ArrowUpDown
} from "lucide-react";
import { ServiceItem } from "../types";
import { allServices } from "../data";
import { addonRegistry } from "../servicesCatalog";

interface ServiceExplorerProps {
  onOpenQuote: (service?: string) => void;
  services?: ServiceItem[];
}

export default function ServiceExplorer({ onOpenQuote, services = allServices }: ServiceExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Commercial" | "Domestic" | "Specialised">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeServiceSlug, setActiveServiceSlug] = useState<string>("commercial-cleaning");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "duration">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Premium inclusions list depending on category
  const getInclusions = (category: string) => {
    switch (category) {
      case "Commercial":
        return [
          "WHS & ISO Compliant Method Statements",
          "TGA-Approved Hospital Grade Disinfectant Use",
          "High-Frequency Touchpoint Micro-Sanitisation",
          "HEPA-Filtration Dust Extraction Control",
          "Dedicated Site Coordinator Supervision",
          "Full Public Liability & Workers Comp Cover"
        ];
      case "Domestic":
        return [
          "100% Bond Back Placement Guarantee (Lease)",
          "Police Cleared & WWCC Screened Specialists",
          "Eco-Friendly Child & Pet-Safe Chemicals",
          "Full Kitchen & Oven Interior Detailing",
          "Wet Scrub Bathrooms & Grout De-moulding",
          "Wall Wash, Skirtings & Light-switch Clean"
        ];
      default:
        return [
          "High-Pressure Thermodynamic Hot Water Wash",
          "Acid Wash & Grout Shield Protection",
          "Silica Dust Control and Air Scrubbing",
          "Deionised Exterior Reach Pole Systems",
          "Polymer Sump Filtration (Where Mandated)",
          "Commercial Stain Extraction & Fiber Shields"
        ];
    }
  };

  const activeService = services.find(s => s.slug === activeServiceSlug) || services[0] || allServices[0];

  // Addon services list
  const dynamicAddons = addonRegistry
    .filter((a) => a.categories.includes(activeService.category as any))
    .slice(0, 4)
    .map((add) => ({
      name: add.icon + " " + add.name,
      price: `$${add.price} AUD`,
      desc: add.description
    }));

  // Filtering list
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting list
  const sortedServices = [...filteredServices].sort((a, b) => {
    let factorA: any = a[sortBy];
    let factorB: any = b[sortBy];
    
    if (sortBy === "duration") {
      factorA = a.durationEstimateHours;
      factorB = b.durationEstimateHours;
    }
    
    if (typeof factorA === "string") {
      return sortDirection === "asc"
        ? factorA.localeCompare(factorB)
        : factorB.localeCompare(factorA);
    } else {
      return sortDirection === "asc"
        ? (factorA || 0) - (factorB || 0)
        : (factorB || 0) - (factorA || 0);
    }
  });


  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page title section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 select-none">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" /> CERTIFIED GEOGRAPHIC MULTI-SERVICE DIRECTORY
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Our Enterprise Services Suite
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Australia’s leading location-optimised, ISO certified sanitation systems. Custom calculated base frameworks constructed to suit commercial facilities, NDIS homes, and detailed site handovers.
          </p>
        </div>

        {/* Categories, Search, Filters & Sorting Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* Categories Toggle list */}
            <div className="flex flex-wrap gap-2">
              {(["All", "Commercial", "Domestic", "Specialised"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat === "All" ? "🌐 Show All Services" : cat}
                </button>
              ))}
            </div>

            {/* Search bar helper */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sanitation specialties..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:bg-white text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-xs">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider">
              <ArrowUpDown className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Catalog Sort Criteria:</span>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { label: "Alphabetical (Name)", value: "name" },
                { label: "Highest Customer Rating", value: "rating" },
                { label: "Roster Duration Team-Hours", value: "duration" },
              ].map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (sortBy === opt.value) {
                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortBy(opt.value as any);
                        setSortDirection(opt.value === "name" ? "asc" : "desc");
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="text-[10px] font-mono font-black ml-1">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Master services display grid (Left list, Right high fidelity detail card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cards List view (5 columns) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Found {sortedServices.length} Match{sortedServices.length === 1 ? "" : "es"}
              </span>
              <span className="text-xs font-semibold text-slate-500">Locally Certified</span>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {sortedServices.map((service) => {
                const isActive = service.slug === activeServiceSlug;
                return (
                  <button
                    key={service.slug}
                    onClick={() => setActiveServiceSlug(service.slug)}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group focus:outline-none ${
                      isActive 
                        ? "bg-indigo-900/10 border-indigo-500 text-indigo-950 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200/85 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-inner transition-colors ${
                        isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        {service.icon.length > 2 ? "🧼" : service.icon}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-900 transition-colors">
                          {service.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">
                            {service.category}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">•</span>
                          <span className="text-xs font-bold text-emerald-600">
                            Fr. ${service.baseRatePerHour}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${
                      isActive ? "text-indigo-600 translate-x-1" : "text-slate-300 group-hover:text-slate-400"
                    }`} />
                  </button>
                );
              })}

              {sortedServices.length === 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                  <span className="text-3xl">🧩</span>
                  <div className="font-bold text-slate-800">No Services Found</div>
                  <p className="text-xs text-slate-500">Try cleaning your search query or choosing another category selector tab.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Rich Details Card (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-8 sticky top-24">
            
            {/* Header: Name, Category, Quick Statistics */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                  {activeService.category} Tier Specialist
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {activeService.name}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed max-w-md">
                  {activeService.description}
                </p>
              </div>

              {/* Badges */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-row sm:flex-col gap-3 sm:gap-1.5 self-stretch sm:self-start justify-around items-center sm:items-start select-none">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-slate-800">{activeService.rating.toFixed(2)} Rated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Est. {activeService.durationEstimateHours} hrs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-600">${activeService.baseRatePerHour}/hr Base</span>
                </div>
              </div>
            </div>

            {/* Section: Comprehensive Inclusions Checklist */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Professional Inclusions Directory
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getInclusions(activeService.category).map((inclusion, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Suggested Bio-Surgical Add-ons */}
            <div className="space-y-4 pt-1.5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Recommended Addons & Upgrades
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {dynamicAddons.map((add, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start justify-between gap-2.5 hover:bg-slate-120 transition-all select-none">
                    <div>
                      <div className="font-extrabold text-[11px] text-slate-900 group-hover:text-indigo-900">
                        {add.name}
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-snug">{add.desc}</p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-700 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm shrink-0">
                      {add.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Sourcing Location & Suburbs Optimized Footer banner */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-300">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#93c5fd] uppercase block">
                  Optimised SEO Citation Network
                </span>
                <p className="text-xs font-sans text-slate-200">
                  Fully operational across <strong>Sydney, Perth, Melbourne</strong> postcodes, scaling pricing modifiers to suit target municipal transport corridors.
                </p>
              </div>
              <div className="flex items-center gap-1 bg-blue-950/40 px-2.5 py-1 rounded border border-blue-500/20 text-[10px] font-mono text-[#60a5fa] font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" /> ISO SYSTEM APPLICABLE
              </div>
            </div>

            {/* Booking Flow Core Launcher Trigger CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
              <button
                onClick={() => onOpenQuote(activeService.name)}
                className="w-full sm:flex-1 bg-gradient-to-r from-indigo-700 via-purple-700 to-red-500 text-white hover:brightness-105 active:scale-98 transition-all px-6 py-4 rounded-2xl font-bold text-sm text-center shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Launch Quote Estimator for {activeService.name}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={() => {
                  window.location.hash = "#coverage";
                  const target = document.getElementById("coverage");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-6 rounded-2xl text-xs font-bold font-sans tracking-wide text-center cursor-pointer transition-colors"
              >
                Map Coverage Zones
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
