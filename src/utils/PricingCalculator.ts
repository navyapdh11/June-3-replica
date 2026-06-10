import { SERVICE_METADATA } from '../config/ServiceCatalog';

// Default static postcode fallbacks matching App.tsx coverage definitions
const postcodeMultipliers: Record<string, number> = {
  "2000": 1.30,
  "3000": 1.15,
  "4000": 1.10,
  "6000": 1.25,
  "6004": 1.20,
  "6005": 1.15,
  "6007": 1.20,
  "6008": 1.20,
  "6009": 1.15,
  "6010": 1.22,
  "6019": 1.18,
  "6027": 1.10,
  "6160": 1.22,
  "6210": 1.05
};

export const calculateQuote = (serviceId: string, inputData: any): number => {
  const service = SERVICE_METADATA[serviceId];
  if (!service) return 0;

  let basePrice = 0;

  // Handle service metadata models
  switch (service.model) {
    case 'hourly': {
      const hours = Number(inputData?.hours || 0);
      basePrice = Math.max(hours * (service.basePrice || 45), service.minFee || 106);
      break;
    }

    case 'fixed': {
      const propertyType = inputData?.propertyType || inputData?.modalPropertyType || '1br';
      basePrice = service.pricing?.[propertyType] || 0;
      break;
    }

    case 'per_room':
    case 'per_item': {
      basePrice = Object.entries(inputData || {}).reduce((total, [item, count]) => {
        if (item === 'addons') return total;
        const pricePerUnit = service.pricing?.[item] || 0;
        return total + (pricePerUnit * Number(count || 0));
      }, 0);
      break;
    }

    case 'sqm': {
      const area = Number(inputData?.sqm || 0);
      let rate = 5;
      if (service.priceTiers) {
        if (area <= 50) {
          rate = service.priceTiers["50"] || 6;
        } else if (area <= 100) {
          rate = service.priceTiers["100"] || 5.5;
        } else {
          rate = service.priceTiers["999"] || 5;
        }
      }
      basePrice = area * rate;
      break;
    }

    case 'quote_based':
    default:
      basePrice = 0;
      break;
  }

  // Handle Addon pricing
  const addonsSelected = inputData?.addons || inputData?.selectedAddons || [];
  // Selected addons could be full SelectedAddon objects or raw string arrays
  const addonTotal = addonsSelected.reduce((sum: number, addon: any) => {
    const addonName = typeof addon === 'string' ? addon : addon?.name;
    const price = typeof addon === 'object' && addon?.price !== undefined ? addon?.price : (service.addonPrices?.[addonName] || 0);
    const qty = typeof addon === 'object' && addon?.quantity !== undefined ? Number(addon.quantity || 1) : 1;
    return sum + (price * qty);
  }, 0);

  let rawTotal = basePrice + addonTotal;

  // Surcharges: roomBreakdown counts
  // Match both sets of keys
  const roomBreakdownInput = inputData?.roomBreakdown || {};
  
  const getCount = (keys: string[]): number => {
    for (const key of keys) {
      if (inputData?.[key] !== undefined) return Number(inputData[key]);
      if (roomBreakdownInput[key] !== undefined) return Number(roomBreakdownInput[key]);
    }
    return 0;
  };

  const meetingRooms = getCount(['meetingRooms', 'meetingRoom', 'glass partitions', 'glassPartitions', 'glass_partitions']);
  const workingDesks = getCount(['workingDesks', 'workingDesk', 'desks', 'deskCount']);
  const kitchenettes = getCount(['kitchenettes', 'kitchenette', 'kitchens', 'kitchen', 'communalCount']);
  const bathroomStalls = getCount(['bathroomStalls', 'bathroomStall', 'toilets', 'toiletCount']);
  const heavyCarpetZones = getCount(['heavyCarpetZones', 'heavyCarpetZone', 'flooring zones', 'flooring_zones', 'flooringZones']);

  // Dynamic Phase 2 physical asset breakout additions matching the UI exactly
  const assetBreakoutCost = 
    (meetingRooms * 45) + 
    (Math.max(0, workingDesks - 5) * 5) + 
    (kitchenettes * 60) + 
    (bathroomStalls * 50) + 
    (heavyCarpetZones * 80);

  // Dynamic SLA Coefficients
  let slaGapFee = 0;
  let slaMultiplier = 1.0;
  const rawSlaTier = String(inputData?.slaTier || '').toLowerCase();

  if (rawSlaTier === 'gold-haccp' || rawSlaTier === 'haccp') {
    // Gold-HACCP APPROVED
    slaGapFee = 50;
    slaMultiplier = 1.25;
  } else if (rawSlaTier === 'platinum-surgical' || rawSlaTier === 'platinum') {
    // Platinum Surgical Clinical
    slaGapFee = 120;
    slaMultiplier = 1.45;
  } else if (rawSlaTier === 'ndis-certified' || rawSlaTier === 'ndis') {
    // NDIS Access Certified
    slaGapFee = 30;
    slaMultiplier = 1.10;
  }

  // Scheduling Details Surcharge
  let shiftMultiplier = 1.0;
  const timeSlot = String(inputData?.schedulingDetails?.timeSlot || inputData?.timeSlot || '').toLowerCase();
  
  if (timeSlot.includes("nocturnal") || timeSlot.includes("out-of-hours") || timeSlot.includes("late")) {
    shiftMultiplier = 1.20;
  } else if (timeSlot.includes("weekend") || timeSlot.includes("surge") || timeSlot.includes("emergency")) {
    shiftMultiplier = 1.30;
  }

  // Regional Postcode Multiplier (Suburbs Dynamic Coefficients)
  const postcode = String(inputData?.postcode || '').trim();
  let multiplier = 1.0;
  if (postcode) {
    if (postcodeMultipliers[postcode] !== undefined) {
      multiplier = postcodeMultipliers[postcode];
    } else {
      // General dynamic mapping matching our National Matrix state regulations
      if (postcode.startsWith("2")) multiplier = 1.18; // NSW (High density corridor)
      else if (postcode.startsWith("3")) multiplier = 1.15; // VIC (Strategic metro expansion)
      else if (postcode.startsWith("4")) multiplier = 1.10; // QLD (Growth market tier)
      else if (postcode.startsWith("5")) multiplier = 0.95; // SA
      else if (postcode.startsWith("6")) multiplier = 1.05; // WA (Market maturity tier)
      else if (postcode.startsWith("7")) multiplier = 0.90; // TAS
      else if (postcode.startsWith("0")) multiplier = 1.15; // NT
      else if (postcode.startsWith("26")) multiplier = 1.05; // ACT
    }
  }

  // Consolidated pricing formula
  const cumulativeBase = rawTotal + assetBreakoutCost;
  const elevatedBase = (cumulativeBase * slaMultiplier * shiftMultiplier) + slaGapFee;
  const geoInflation = elevatedBase * (multiplier - 1);
  let finalCalculated = Math.round(elevatedBase + geoInflation + 15); // +$15 travel/prep fee

  // Handle promo code adjust if any (e.g., if passing appliedPromo or discountRate)
  const appliedPromo = String(inputData?.appliedPromo || inputData?.promoCode || '').toUpperCase();
  if (appliedPromo) {
    if (appliedPromo === "SAVE20") {
      finalCalculated = Math.round(finalCalculated * 0.8);
    } else if (appliedPromo === "FIRST10") {
      finalCalculated = Math.round(finalCalculated * 0.9);
    } else if (appliedPromo === "NDISFREE") {
      finalCalculated = Math.max(15, finalCalculated - 25);
    }
  }

  return finalCalculated;
};
