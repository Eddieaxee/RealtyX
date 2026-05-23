import { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://realtyx.io", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://realtyx.io/properties", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://realtyx.io/about", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://realtyx.io/education", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://realtyx.io/trust", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]
}