import { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://realtyx.io", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://realtyx.io/properties", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://realtyx.io/about", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://realtyx.io/education", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://realtyx.io/trust", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://realtyx.io/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://realtyx.io/faq", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://realtyx.io/blog", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://realtyx.io/getting-started", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://realtyx.io/privacy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://realtyx.io/terms", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://realtyx.io/compliance", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://realtyx.io/auth/signin", lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: "https://realtyx.io/auth/signup", lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: "https://realtyx.io/auth/forgot", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]
}