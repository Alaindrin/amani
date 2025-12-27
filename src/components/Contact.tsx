import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageAPI } from "@/lib/api";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const result = await messageAPI.create(data);
      
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I'll get back to you soon!",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-secondary/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text-animated">
          Get In Touch
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-primary mx-auto mb-4 animate-gradient"></div>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gradient-card p-8 rounded-xl shadow-card hover:shadow-glow transition-all duration-300 group">
              <h3 className="text-2xl font-semibold mb-6 text-foreground group-hover:text-primary transition-colors">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a href="mailto:amanialaindrin7@gmail.com" className="text-foreground hover:text-accent transition-colors">
                      amanialaindrin7@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a href="tel:+250786333880" className="text-foreground hover:text-accent transition-colors">
                      +250 786 333 880
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card p-8 rounded-xl shadow-card hover:shadow-glow transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors relative z-10">
                Let's Build Something Great
              </h3>
              <p className="text-foreground/80 relative z-10">
                Whether you need a custom web application, AI integration, or innovative software solutions, 
                I'm here to help bring your vision to life.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-card p-8 rounded-xl shadow-card hover:shadow-glow transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="bg-secondary border-border text-foreground"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-secondary border-border text-foreground"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="bg-secondary border-border text-foreground resize-none"
                  placeholder="Tell me......."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow hover:shadow-glow hover:scale-105 transition-all group/btn"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse">Sending...</span>
                  </span>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
