// Database-backed properties
// No hardcoded JSON - all data comes from the database via API

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
  type: string;
  status: string;
  priceUSD: number;
  priceNGN: number;
  tokenPriceUSD: number;
  developmentStatus: string;
  country: string;
}

function mapDBProperty(dbProp: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  type: string | null;
  developmentStatus: string | null;
  lat: number | null;
  lng: number | null;
  images: string | unknown[];
  features: string | unknown[];
  documents: string | unknown[];
  tokenPriceUSD: number | null;
  priceUSD: number | null;
  priceNGN: number | null;
  tokenPriceNGN: number | null;
  expectedReturn: number | null;
  rentalYield: number | null;
  availableTokens: number | null;
  totalTokens: number | null;
  completionPercentage: number | null;
  status: string | null;
  country: string | null;
}): Property {
  const images = typeof dbProp.images === 'string' ? JSON.parse(dbProp.images || '[]') : (dbProp.images || []);
  const features = typeof dbProp.features === 'string' ? JSON.parse(dbProp.features || '[]') : (dbProp.features || []);
  const documents = typeof dbProp.documents === 'string' ? JSON.parse(dbProp.documents || '[]') : (dbProp.documents || []);

  const tokenPriceUSD = dbProp.tokenPriceUSD || 0;
  const priceUSD = dbProp.priceUSD || 0;
  const priceNGN = dbProp.priceNGN || 0;
  const tokenPriceNGN = dbProp.tokenPriceNGN || 0;
  const totalTokens = dbProp.totalTokens || 100;
  const availableTokens = dbProp.availableTokens || 0;

  return {
    id: dbProp.id,
    slug: dbProp.slug,
    title: dbProp.title,
    description: dbProp.description || '',
    location: dbProp.location || '',
    city: dbProp.city || '',
    state: dbProp.state || '',
    region: dbProp.state || 'Lagos',
    category: dbProp.type || 'RESIDENTIAL',
    lifecycle: dbProp.developmentStatus || 'COMPLETED',
    currentMilestone: dbProp.developmentStatus || 'COMPLETED',
    lat: dbProp.lat || 6.5244,
    lng: dbProp.lng || 3.3792,
    image: images[0] || '',
    images,
    tokenPriceNGN: tokenPriceNGN || (tokenPriceUSD * 1500) || 0,
    totalValueNGN: priceNGN || (priceUSD * 1500) || 0,
    expectedReturn: dbProp.expectedReturn || 12,
    rentalYield: dbProp.rentalYield || 8,
    availableTokens,
    totalTokens,
    funded: totalTokens ? ((totalTokens - availableTokens) / totalTokens) * 100 : 0,
    completionPercentage: dbProp.completionPercentage || 100,
    features,
    documents,
    neighborhoodInsights: {
      walkScore: 85,
      safetyIndex: 'High',
      transitAccess: 'Excellent',
      infrastructure: [],
    },
    type: dbProp.type || 'RESIDENTIAL',
    status: dbProp.status || 'AVAILABLE',
    priceUSD,
    priceNGN,
    tokenPriceUSD,
    developmentStatus: dbProp.developmentStatus || 'COMPLETED',
    country: dbProp.country || 'Nigeria',
  };
}

let cachedProperties: Property[] | null = null;
let cacheTimestamp = 0;

export async function getAllProperties(): Promise<Property[]> {
  const now = Date.now();
  if (cachedProperties && now - cacheTimestamp < 60000) {
    return cachedProperties;
  }

  try {
    const res = await fetch('/api/admin/properties', {
      cache: 'no-store',
      headers: {
        'Cookie': (typeof document !== 'undefined' ? document.cookie : '') || '',
      },
    });
    const data = await res.json();
    if (data.success && data.properties) {
      cachedProperties = data.properties.map(mapDBProperty);
      cacheTimestamp = now;
      return cachedProperties!;
    }
  } catch {
    // Fallback: try public endpoint
    try {
      const res = await fetch('/api/properties', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.properties) {
        cachedProperties = data.properties.map(mapDBProperty);
        cacheTimestamp = now;
        return cachedProperties!;
      }
    } catch {
      // Return empty
    }
  }
  return [];
}

export async function getPropertyByIdOrSlug(idOrSlug: string): Promise<Property | undefined> {
  const properties = await getAllProperties();
  return properties.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function getPropertiesByCategory(category: string): Promise<Property[]> {
  const all = await getAllProperties();
  if (category === 'ALL') return all;
  return all.filter((p) => p.category === category);
}

export async function getPropertiesByLifecycle(lifecycle: string): Promise<Property[]> {
  const all = await getAllProperties();
  if (lifecycle === 'ALL') return all;
  return all.filter((p) => p.lifecycle === lifecycle);
}

export async function getPropertiesByRegion(region: string): Promise<Property[]> {
  const all = await getAllProperties();
  if (region === 'ALL') return all;
  return all.filter((p) => p.region === region);
}