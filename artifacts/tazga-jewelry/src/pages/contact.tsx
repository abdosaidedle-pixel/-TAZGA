import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We will get back to you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-wider mb-4">CONTACT US</h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6"></div>
          <p className="font-arabic text-xl text-muted-foreground" dir="rtl">تواصل معنا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl tracking-wider mb-8">GET IN TOUCH</h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-12">
              Whether you have a question about our collections, need assistance with an order, or wish to inquire about bespoke creations, our team is here to help.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif tracking-wider mb-1">BOUTIQUE & WORKSHOP</h3>
                  <p className="text-muted-foreground font-light">15 Salah El-Din St, Zamalek<br />Cairo, Egypt</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif tracking-wider mb-1">PHONE / WHATSAPP</h3>
                  <p className="text-muted-foreground font-light">+20 100 123 4567<br />+20 2 2736 8901</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif tracking-wider mb-1">EMAIL</h3>
                  <p className="text-muted-foreground font-light">info@tazgajewelry.com<br />concierge@tazgajewelry.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif tracking-wider mb-1">HOURS</h3>
                  <p className="text-muted-foreground font-light">Saturday - Thursday: 10:00 AM - 9:00 PM<br />Friday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary p-8 md:p-12 border border-white/5">
            <h2 className="font-serif text-2xl tracking-wider mb-8">SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</label>
                <Input id="name" required className="bg-background border-border h-12 rounded-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</label>
                <Input id="email" type="email" required className="bg-background border-border h-12 rounded-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs uppercase tracking-wider text-muted-foreground">Subject</label>
                <Input id="subject" required className="bg-background border-border h-12 rounded-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
                <Textarea id="message" required className="bg-background border-border min-h-[150px] rounded-none resize-none" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-14 bg-primary text-primary-foreground font-serif tracking-[0.2em] uppercase rounded-none hover:bg-primary/90 transition-colors">
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}