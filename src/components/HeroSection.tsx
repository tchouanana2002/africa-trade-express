import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Shield, Truck, Users } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-hero">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Africa's Premier 
              <span className="block bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                Digital Marketplace
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Connecting buyers and sellers across Africa with a trusted, secure platform for seamless commerce.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-md mx-auto lg:mx-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search products, vendors, categories..."
                  className="pl-10 h-12 bg-white/95 border-0 focus:bg-white"
                />
              </div>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 h-12 px-6">
                Search
              </Button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold h-12"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary h-12"
              >
                Start Selling
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Trusted Vendors</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional marketplace connecting African businesses"
                className="rounded-2xl shadow-2xl animate-float"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl animate-pulse-soft">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Vendors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;