import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Users, Award, Globe, MessageCircle } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Advanced security measures and verified vendors ensure safe transactions for all users."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Reliable delivery network across Africa with real-time tracking and multiple delivery options."
    },
    {
      icon: Users,
      title: "Multiple Stores",
      description: "Access thousands of verified vendors and stores all in one convenient marketplace platform."
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with vendors for negotiations, product inquiries, and customer support."
    },
    {
      icon: Globe,
      title: "Pan-African Reach",
      description: "Connecting businesses and customers across the African continent with seamless commerce."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Rigorous vendor verification and quality control processes ensure premium products and services."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Vendors" },
    { number: "500K+", label: "Happy Customers" },
    { number: "1M+", label: "Products Listed" },
    { number: "50+", label: "Cities Covered" }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            About AfriMarket
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connecting buyers and sellers across Africa with a trusted digital marketplace that empowers 
            businesses to grow and customers to access quality products with confidence.
          </p>
          <Button size="lg" className="bg-gradient-primary hover:opacity-90">
            Learn More About Us
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center bg-muted/50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              To revolutionize commerce across Africa by creating a seamless, secure, and trusted 
              digital marketplace that empowers businesses of all sizes to reach new customers, 
              while providing buyers with access to quality products and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Start Selling Today
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground">
                Explore Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;