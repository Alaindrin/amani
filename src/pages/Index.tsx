import { useState } from "react";
import Navigation from "@/components/Navigation";
import QuotationModal from "@/components/QuotationModal";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation onQuotationClick={() => setIsQuotationOpen(true)} />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
      <QuotationModal open={isQuotationOpen} onOpenChange={setIsQuotationOpen} />
    </div>
  );
};

export default Index;
