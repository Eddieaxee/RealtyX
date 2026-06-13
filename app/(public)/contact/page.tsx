import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/public/contact-form";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "contact@realtyx.co",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+234 (0) 800 REALTYX",
    description: "Mon-Fri, 9am-6pm WAT",
  },
  {
    icon: MapPin,
    title: "Office",
    details: "14 Admiralty Way, Lekki Phase 1",
    description: "Lagos, Nigeria",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Monday - Friday",
    description: "9:00 AM - 6:00 PM WAT",
  },
];

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the RealtyX team. We're here to help with your fractional real estate investment journey.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Get in <span className="text-gradient-gold">Touch</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about fractional real estate investing? Our team is ready to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((item) => (
                  <div key={item.title} className="p-5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                    <item.icon className="w-6 h-6 text-[#E2B93B] mb-3" />
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-sm font-medium">{item.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-2">Partnership Inquiries</h3>
                <p className="text-sm text-muted-foreground">
                  Interested in listing your property on RealtyX or becoming an institutional partner? 
                  Email us at <span className="text-[#E2B93B]">partnerships@realtyx.co</span>
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}