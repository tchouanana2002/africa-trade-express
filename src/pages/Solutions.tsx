import { ArrowRight, Users, Globe, TrendingUp, Shield, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Solutions = () => {
  const solutions = [
    {
      icon: Users,
      title: 'For Sellers & Vendors',
      description: 'Comprehensive tools to grow your business',
      features: [
        'Multi-channel inventory management',
        'Integrated payment processing',
        'Customer analytics & insights',
        'Marketing automation tools',
        'Global shipping solutions'
      ],
      cta: 'Start Selling',
      color: 'text-blue-600'
    },
    {
      icon: Globe,
      title: 'For Buyers & Retailers',
      description: 'Discover authentic African products',
      features: [
        'Verified authentic products',
        'Direct supplier connections',
        'Bulk ordering capabilities',
        'Quality assurance programs',
        'Flexible payment terms'
      ],
      cta: 'Explore Products',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'For Enterprises',
      description: 'Scale your business with our platform',
      features: [
        'Custom integration solutions',
        'Dedicated account management',
        'White-label opportunities',
        'Advanced analytics dashboard',
        'Priority customer support'
      ],
      cta: 'Contact Sales',
      color: 'text-purple-600'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Bank-level security with encrypted payments and fraud protection'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast platform with 99.9% uptime guarantee'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Supporting local communities and sustainable business practices'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Active Vendors' },
    { number: '2M+', label: 'Products Listed' },
    { number: '45+', label: 'Countries Served' },
    { number: '98%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                Tailored Solutions
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Solutions for Every
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Business Need
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're a small artisan or a large enterprise, we have the perfect solution 
                to help you succeed in the African marketplace.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors duration-200">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center`}>
                      <solution.icon className={`h-8 w-8 ${solution.color}`} />
                    </div>
                    <CardTitle className="text-2xl">
                      {solution.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      {solution.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built with African businesses in mind, our platform provides the tools and support 
                you need to succeed in the global marketplace.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of African businesses already growing with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Start Your Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Solutions;