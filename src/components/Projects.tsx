import { useState } from "react";
import { GraduationCap, Zap, Brain, ExternalLink, Glasses, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import elearningImg from "@/assets/elearning-project.jpg";
import smartmeterImg from "@/assets/smartmeter-project.jpg";
import aiAuditorImg from "@/assets/ai-auditor-project.jpg";

// VR Agriculture project image
const vrAgriImg = "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop";

// QuickPay fintech project image
const quickPayImg = "https://images.unsplash.com/photo-1599050751795-6cdaafbc2319?crop=entropy&cs=srgb&fm=jpg&w=800&h=600&fit=crop";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      icon: GraduationCap,
      image: elearningImg,
      title: "E-Learning System",
      subtitle: "Video-Based Learning + Interactive Quizzes",
      description: "A modern e-learning platform designed for schools and organizations.",
      fullDescription: "A comprehensive e-learning platform that includes high-quality video lessons, interactive quizzes, progress tracking, and a responsive dashboard. Learners can watch lessons anytime and take quizzes to test their understanding. The system was built to make learning simple, engaging, and accessible.",
      features: [
        "High-quality video streaming",
        "Interactive quiz system",
        "Real-time progress tracking",
        "Responsive admin dashboard",
        "Student performance analytics"
      ],
      tech: ["React", "Node.js", "MongoDB", "Video API"],
      color: "from-primary to-accent"
    },
    {
      icon: Zap,
      image: smartmeterImg,
      title: "Smart Meter System",
      subtitle: "Online Electricity Token Purchase",
      description: "A revolutionary electricity management solution.",
      fullDescription: "A smart electricity management solution where users can buy electricity tokens online and the system directly transfers the token to their smart meters instantly—no matter where they are. It improves convenience, speed, and accuracy, and reduces long queues at electricity offices.",
      features: [
        "Instant token delivery",
        "Secure online payments",
        "Real-time meter synchronization",
        "Usage history & analytics",
        "Mobile-responsive interface"
      ],
      tech: ["React", "Python", "PostgreSQL", "IoT Integration"],
      color: "from-accent to-primary"
    },
    {
      icon: Brain,
      image: aiAuditorImg,
      title: "AI Auditor Assistant",
      subtitle: "Intelligent Document Analysis",
      description: "An AI-powered audit assistant for professionals.",
      fullDescription: "An AI-powered audit assistant that helps auditors analyze documents, detect anomalies, highlight risk areas, and provide recommendations. It uses natural-language analysis to understand audit reports, identify errors, and support better decision-making.",
      features: [
        "Document analysis with NLP",
        "Anomaly detection",
        "Risk assessment automation",
        "Smart recommendations",
        "Report generation"
      ],
      tech: ["Python", "LLM Integration", "React", "FastAPI"],
      color: "from-primary via-accent to-primary"
    },
    {
      icon: Glasses,
      image: vrAgriImg,
      title: "VR + AI Smart Agriculture & Education",
      subtitle: "Virtual Reality Meets Intelligent Farming",
      description: "An innovative VR and AI solution for agriculture and immersive education.",
      fullDescription: "A cutting-edge Virtual Reality and AI-powered platform that revolutionizes agriculture and education. In agriculture, smart monitors detect crop health in real-time and send data to AI software for analysis, enabling admins to take immediate action. The system predicts harvest yields based on climate conditions and allows farmers to virtually navigate their farms using VR without leaving their location. In education, the VR system creates immersive learning experiences where students can explore the solar system, human anatomy, and other complex subjects in an engaging 3D environment.",
      features: [
        "Real-time crop health monitoring with smart sensors",
        "AI-powered harvest prediction based on climate data",
        "Virtual farm navigation using VR technology",
        "Immersive VR education for e-learning (solar system, human anatomy, etc.)",
        "Admin dashboard for farm management and alerts",
        "Interactive 3D learning environments for students"
      ],
      tech: ["Unity", "VR SDK", "AI/ML", "IoT Sensors", "Python", "React"],
      color: "from-accent via-primary to-accent"
    },
    {
      icon: Wallet,
      image: quickPayImg,
      title: "QuickPay",
      subtitle: "Your Digital Wallet, Everywhere",
      description: "A revolutionary fintech solution for seamless global payments.",
      fullDescription: "QuickPay is a cutting-edge fintech platform that consolidates all your payment cards into one secure digital wallet. Make instant transfers, receive money, and complete transactions anywhere in the world—all from your phone, without carrying physical cards. Experience the freedom of cardless payments with bank-level security and lightning-fast processing.",
      features: [
        "Unified digital wallet for all payment cards",
        "Instant money transfers worldwide",
        "Cardless payments via phone",
        "Multi-currency support",
        "Bank-level encryption and security",
        "Real-time transaction notifications",
        "Global acceptance at millions of merchants"
      ],
      tech: ["React Native", "Node.js", "Blockchain", "Payment Gateway API", "Encryption"],
      color: "from-primary to-accent"
    }
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <div className="w-24 h-1 bg-gradient-primary mx-auto mb-4"></div>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Explore some of the innovative solutions I've built to solve real-world challenges
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-3 cursor-pointer group overflow-hidden relative"
              onClick={() => setSelectedProject(index)}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 pointer-events-none`}></div>
              
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                
                {/* Icon badge */}
                <div className={`absolute top-4 right-4 w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform duration-300`}>
                  <project.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardHeader className="relative z-20">
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-20">
                <p className="text-foreground/80 mb-4">{project.description}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground group-hover:border-transparent transition-all"
                >
                  View Details <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
          {selectedProject !== null && (
            <>
              <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
                <img 
                  src={projects[selectedProject].image} 
                  alt={projects[selectedProject].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${projects[selectedProject].color} flex items-center justify-center mb-3`}>
                    {(() => {
                      const Icon = projects[selectedProject].icon;
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                </div>
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-3xl text-foreground">
                  {projects[selectedProject].title}
                </DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground">
                  {projects[selectedProject].subtitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Overview</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {projects[selectedProject].fullDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Key Features</h3>
                  <ul className="space-y-2">
                    {projects[selectedProject].features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {projects[selectedProject].tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
