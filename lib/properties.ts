import propertiesData from "@/data/properties.json";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  region: string;
  category: string;
  lifecycle: string;
  currentMilestone: string;
  lat: number;
  lng: number;
  image: string;
  images: string[];
  tokenPriceNGN: number;
  totalValueNGN: number;
  expectedReturn: number;
  rentalYield: number;
  availableTokens: number;
  totalTokens: number;
  funded: number;
  completionPercentage: number;
  features: string[];
  documents: string[];
  neighborhoodInsights: {
    walkScore: number;
    safetyIndex: string;
    transitAccess: string;
    infrastructure: { name: string; distance: string; type: string }[];
  };
}

export function getAllProperties(): Property[] {
  return propertiesData as Property[];
}

export function getPropertyByIdOrSlug(idOrSlug: string): Property | undefined {
  return (propertiesData as Property[]).find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
}

export function getPropertiesByCategory(category: string): Property[] {
  if (category === "ALL") return getAllProperties();
  return (propertiesData as Property[]).filter((p) => p.category === category);
}

export function getPropertiesByLifecycle(lifecycle: string): Property[] {
  if (lifecycle === "ALL") return getAllProperties();
  return (propertiesData as Property[]).filter((p) => p.lifecycle === lifecycle);
}

export function getPropertiesByRegion(region: string): Property[] {
  if (region === "ALL") return getAllProperties();
  return (propertiesData as Property[]).filter((p) => p.region === region);
}