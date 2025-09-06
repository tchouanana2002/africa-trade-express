import { useState } from 'react';
import { MapPin, Calendar, Users, Star, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Discover = () => {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const countries = [
    'All Countries', 'Nigeria', 'Kenya', 'Ghana', 'South Africa', 
    'Ethiopia', 'Morocco', 'Egypt', 'Tanzania', 'Uganda'
  ];

  const categories = [
    'All Categories', 'Art & Culture', 'Food & Cuisine', 'Fashion', 
    'Technology', 'Agriculture', 'Music & Entertainment', 'Tourism'
  ];

  const featuredStories = [
    {
      id: 1,
      title: 'The Rise of Ethiopian Coffee Culture',
      description: 'Exploring the rich history and modern innovation in Ethiopian coffee production',
      image: '/placeholder.svg',
      author: 'Amara Tadesse',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Food & Cuisine',
      country: 'Ethiopia'
    },
    {
      id: 2,
      title: 'Kenyan Tech Startups Revolutionizing Agriculture',
      description: 'How young entrepreneurs are using technology to transform farming in Kenya',
      image: '/placeholder.svg',
      author: 'James Mwangi',
      date: '2024-01-12',
      readTime: '8 min read',
      category: 'Technology',
      country: 'Kenya'
    },
    {
      id: 3,
      title: 'Traditional Kente Meets Modern Fashion',
      description: 'Ghanaian designers bringing traditional textiles to global runways',
      image: '/placeholder.svg',
      author: 'Esi Ankrah',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'Fashion',
      country: 'Ghana'
    }
  ];

  const culturalSpotlights = [
    {
      id: 1,
      title: 'Maasai Beadwork Traditions',
      description: 'The intricate art and cultural significance of Maasai jewelry',
      image: '/placeholder.svg',
      location: 'Kenya & Tanzania',
      participants: '200+ artisans'
    },
    {
      id: 2,
      title: 'West African Drumming Heritage',
      description: 'Preserving ancient rhythms in the modern world',
      image: '/placeholder.svg',
      location: 'Ghana, Mali, Senegal',
      participants: '500+ musicians'
    },
    {
      id: 3,
      title: 'Ethiopian Injera Making',
      description: 'The traditional fermented flatbread that brings families together',
      image: '/placeholder.svg',
      location: 'Ethiopia',
      participants: '1000+ families'
    }
  ];

  const entrepreneurs = [
    {
      id: 1,
      name: 'Fatima Nduka',
      business: 'Savannah Solar Solutions',
      country: 'Nigeria',
      image: '/placeholder.svg',
      description: 'Bringing clean energy to rural communities across West Africa',
      achievement: 'Powered 10,000+ homes'
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      business: 'Desert Bloom Agriculture',
      country: 'Morocco',
      image: '/placeholder.svg',
      description: 'Revolutionizing desert farming with innovative irrigation techniques',
      achievement: '500% crop yield increase'
    },
    {
      id: 3,
      name: 'Naledi Mokoena',
      business: 'Ubuntu Crafts Collective',
      country: 'South Africa',
      image: '/placeholder.svg',
      description: 'Empowering women artisans through fair trade partnerships',
      achievement: '200+ women employed'
    }
  ];

  const filteredStories = featuredStories.filter(story => {
    const matchesCountry = selectedCountry === 'all' || story.country === selectedCountry;
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesCountry && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Discover Africa
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Stories That 
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Inspire & Connect
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore the rich tapestry of African culture, innovation, and entrepreneurship. 
                Discover stories that celebrate the continent's vibrant heritage and bright future.
              </p>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="stories" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
                <TabsTrigger value="entrepreneurs">Entrepreneurs</TabsTrigger>
              </TabsList>

              <TabsContent value="stories" className="space-y-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country.toLowerCase().replace(' ', '-')}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Stories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredStories.map((story) => (
                    <Card key={story.id} className="group hover:shadow-lg transition-shadow duration-200">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {story.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {story.country}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {story.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {story.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>by {story.author}</span>
                          <span>{story.readTime}</span>
                        </div>
                        <Button variant="outline" className="w-full group">
                          Read Story
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="culture" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Cultural Spotlights
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Celebrating the diverse traditions, arts, and customs that make Africa unique
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {culturalSpotlights.map((spotlight) => (
                    <Card key={spotlight.id} className="group hover:shadow-lg transition-shadow duration-200">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={spotlight.image}
                          alt={spotlight.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{spotlight.title}</CardTitle>
                        <CardDescription>{spotlight.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {spotlight.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {spotlight.participants}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Explore Tradition
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="entrepreneurs" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    African Entrepreneurs
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Meet the innovators and business leaders driving positive change across the continent
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {entrepreneurs.map((entrepreneur) => (
                    <Card key={entrepreneur.id} className="group hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                          <img
                            src={entrepreneur.image}
                            alt={entrepreneur.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle>{entrepreneur.name}</CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="font-semibold text-primary">{entrepreneur.business}</div>
                          <div className="text-sm">{entrepreneur.country}</div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {entrepreneur.description}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-sm font-semibold text-primary">
                            {entrepreneur.achievement}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Read Their Story
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;