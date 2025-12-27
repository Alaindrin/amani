import { useEffect, useState } from "react";
import { ChevronDown, Sparkles, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const roles = ["Web Developer", "AI Systems Builder", "Virtual Reality Solutions Engineer", "Software Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentRole.length) {
        setDisplayText(currentRole.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentRole.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((roleIndex + 1) % roles.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-100 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-50 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Floating badge - positioned better */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8 text-blue-700 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Available for new projects</span>
          </div>
          
          {/* Main heading - much smaller and elegant */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Amani Alain
            </span>
          </h1>
          
          {/* Dynamic role with better styling */}
          <div className="h-16 mb-8">
            <p className="text-xl md:text-2xl font-medium text-gray-600">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {displayText}
              </span>
              <span className="animate-pulse text-blue-500 ml-1">|</span>
            </p>
          </div>
          
          {/* Enhanced tagline */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Crafting <span className="text-blue-600 font-semibold">intelligent solutions</span> that transform ideas into reality
            </p>
          </div>
          
          {/* Modern CTA buttons */}
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              onClick={() => scrollToSection("projects")}
            >
              <Code className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              View My Work
            </Button>
            <Button 
              size="lg" 
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-all duration-300 group"
              onClick={() => scrollToSection("contact")}
            >
              <Zap className="w-5 h-5 mr-2 group-hover:text-current transition-colors" />
              Let's Connect
            </Button>
          </div>

          {/* Clean stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600 font-medium">Projects Delivered</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2">5+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean scroll indicator */}
      <button 
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer group"
        aria-label="Scroll to about section"
      >
        <div className="flex flex-col items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-3 hover:bg-white hover:shadow-lg transition-all">
          <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors font-medium">Explore More</span>
          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
