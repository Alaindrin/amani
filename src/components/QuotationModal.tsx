import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { quotationAPI } from "@/lib/api";

interface QuotationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuotationModal = ({ open, onOpenChange }: QuotationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      projectType: formData.get("projectType") as string,
      budget: formData.get("budget") as string,
      timeline: formData.get("timeline") as string,
      description: formData.get("description") as string,
    };

    try {
      const result = await quotationAPI.create(data);
      
      if (result.success) {
        toast({
          title: "Quotation Request Sent!",
          description: "Thank you! I'll review your request and get back to you within 24 hours.",
        });
        onOpenChange(false);
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Failed to submit quotation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-3xl text-foreground">Request a Quotation</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Tell me about your project and I'll provide you with a detailed quotation within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+250 123 456 789"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                name="company"
                placeholder="Your Company"
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type *</Label>
            <Select name="projectType" required>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-app">Web Application</SelectItem>
                <SelectItem value="mobile-app">Mobile Application</SelectItem>
                <SelectItem value="elearning">E-Learning Platform</SelectItem>
                <SelectItem value="iot">IoT / Smart Systems</SelectItem>
                <SelectItem value="ai-integration">AI Integration</SelectItem>
                <SelectItem value="custom">Custom Software Solution</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select name="budget">
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300-500">300,000 - 500,000 Frw</SelectItem>
                  <SelectItem value="500-1000">500,000 - 1,000,000 Frw</SelectItem>
                  <SelectItem value="1000-5000">1,000,000 - 5,000,000 Frw</SelectItem>
                  <SelectItem value="5000-50000">5,000,000 - 50,000,000 Frw</SelectItem>
                  <SelectItem value="50000-plus">50,000,000+ Frw</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Expected Timeline</Label>
              <Select name="timeline">
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                  <SelectItem value="short">Short (1 month)</SelectItem>
                  <SelectItem value="medium">Medium (2-3 months)</SelectItem>
                  <SelectItem value="long">Long (3-6 months)</SelectItem>
                  <SelectItem value="very-long">Extended (6+ months)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Please describe your project in detail:&#10;- What problem does it solve?&#10;- Who are the users?&#10;- Key features you need&#10;- Any technical requirements&#10;- Integration needs"
              className="bg-background border-border resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Submit Request <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationModal;
