import { useState } from 'react';
import { Calendar, Clock, Gift, Tag, Star, ArrowRight, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Promotions = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentPromotions = [
    {
      id: 1,
      title: 'African Heritage Month Sale',
      description: 'Celebrate African heritage with up to 40% off on traditional crafts and art',
      discount: '40%',
      validUntil: '2024-02-29',
      image: '/placeholder.svg',
      category: 'Crafts & Art',
      featured: true,
      claimed: 156,
      totalAvailable: 500
    },
    {
      id: 2,
      title: 'First-Time Buyer Bonus',
      description: 'New customers get 25% off their first order plus free shipping',
      discount: '25%',
      validUntil: '2024-03-31',
      image: '/placeholder.svg',
      category: 'All Products',
      featured: false,
      claimed: 89,
      totalAvailable: 200
    },
    {
      id: 3,
      title: 'Bulk Order Discount',
      description: 'Save big on bulk orders - perfect for retailers and businesses',
      discount: 'Up to 30%',
      validUntil: '2024-04-15',
      image: '/placeholder.svg',
      category: 'Wholesale',
      featured: true,
      claimed: 34,
      totalAvailable: 100
    }
  ];

  const flashDeals = [
    {
      id: 1,
      productName: 'Handwoven Kente Cloth',
      originalPrice: 89.99,
      salePrice: 53.99,
      discount: 40,
      timeLeft: '2h 45m',
      image: '/placeholder.svg',
      vendor: 'Ghana Weavers',
      rating: 4.8,
      soldCount: 23,
      totalStock: 50
    },
    {
      id: 2,
      productName: 'Ethiopian Coffee Set',
      originalPrice: 45.00,
      salePrice: 31.50,
      discount: 30,
      timeLeft: '5h 12m',
      image: '/placeholder.svg',
      vendor: 'Addis Coffee Co.',
      rating: 4.9,
      soldCount: 67,
      totalStock: 100
    },
    {
      id: 3,
      productName: 'Maasai Beaded Jewelry',
      originalPrice: 35.99,
      salePrice: 25.19,
      discount: 30,
      timeLeft: '1h 23m',
      image: '/placeholder.svg',
      vendor: 'Kenya Crafts',
      rating: 4.7,
      soldCount: 45,
      totalStock: 75
    }
  ];

  const loyaltyProgram = {
    currentTier: 'Gold',
    pointsBalance: 2450,
    pointsToNextTier: 550,
    nextTier: 'Platinum',
    benefits: [
      'Free shipping on all orders',
      '15% exclusive member discount',
      'Early access to new products',
      'Priority customer support',
      'Monthly bonus points'
    ]
  };

  const couponCodes = [
    {
      code: 'AFRICA20',
      description: '20% off African textiles and fabrics',
      validUntil: '2024-03-15',
      category: 'Textiles'
    },
    {
      code: 'NEWBIE15',
      description: '15% off for new customers',
      validUntil: '2024-04-30',
      category: 'All Products'
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on orders over $50',
      validUntil: '2024-02-28',
      category: 'Shipping'
    }
  ];

  const calculateProgress = (claimed: number, total: number) => {
    return (claimed / total) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Special Offers
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Amazing
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Deals & Promotions
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover incredible savings on authentic African products. 
                From flash deals to loyalty rewards, there's always a great offer waiting for you.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-12">
                <TabsTrigger value="current">Current Deals</TabsTrigger>
                <TabsTrigger value="flash">Flash Sales</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Current Promotions
                  </h2>
                  <p className="text-muted-foreground">
                    Limited-time offers you don't want to miss
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentPromotions.map((promotion) => (
                    <Card key={promotion.id} className={`group hover:shadow-lg transition-shadow duration-200 ${
                      promotion.featured ? 'ring-2 ring-primary/20' : ''
                    }`}>
                      {promotion.featured && (
                        <div className="absolute -top-2 left-4 z-10">
                          <Badge className="bg-gradient-primary text-white">
                            Featured Deal
                          </Badge>
                        </div>
                      )}
                      <div className="aspect-video overflow-hidden rounded-t-lg relative">
                        <img
                          src={promotion.image}
                          alt={promotion.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                          {promotion.discount} OFF
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{promotion.category}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            Until {new Date(promotion.validUntil).toLocaleDateString()}
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {promotion.title}
                        </CardTitle>
                        <CardDescription>
                          {promotion.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Claimed: {promotion.claimed}</span>
                            <span>Available: {promotion.totalAvailable}</span>
                          </div>
                          <Progress value={calculateProgress(promotion.claimed, promotion.totalAvailable)} />
                        </div>
                        <Button className="w-full bg-gradient-primary hover:opacity-90">
                          Claim Offer
                          <Gift className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="flash" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Flash Sales
                  </h2>
                  <p className="text-muted-foreground">
                    Lightning deals that won't last long
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {flashDeals.map((deal) => (
                    <Card key={deal.id} className="group hover:shadow-lg transition-shadow duration-200 border-red-200">
                      <div className="aspect-square overflow-hidden rounded-t-lg relative">
                        <img
                          src={deal.image}
                          alt={deal.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          -{deal.discount}%
                        </div>
                        <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                          {deal.timeLeft}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">
                          {deal.productName}
                        </CardTitle>
                        <CardDescription>
                          by {deal.vendor}
                        </CardDescription>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ${deal.salePrice}
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            ${deal.originalPrice}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {deal.rating}
                          </div>
                          <div>
                            {deal.soldCount} sold
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Sold: {deal.soldCount}</span>
                            <span>Stock: {deal.totalStock}</span>
                          </div>
                          <Progress value={calculateProgress(deal.soldCount, deal.totalStock)} />
                        </div>
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                          Buy Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="loyalty" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Loyalty Program
                  </h2>
                  <p className="text-muted-foreground">
                    Earn points and unlock exclusive benefits
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <Card className="mb-8">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">
                        Your Loyalty Status
                      </CardTitle>
                      <CardDescription>
                        Current Tier: <span className="font-semibold text-yellow-600">{loyaltyProgram.currentTier}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {loyaltyProgram.pointsBalance}
                        </div>
                        <div className="text-muted-foreground">
                          Available Points
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress to {loyaltyProgram.nextTier}</span>
                          <span>{loyaltyProgram.pointsToNextTier} points needed</span>
                        </div>
                        <Progress value={75} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Your Benefits</h4>
                          <ul className="space-y-2">
                            {loyaltyProgram.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">How to Earn Points</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Purchase products: 1 point per $1 spent</li>
                            <li>• Write product reviews: 50 points</li>
                            <li>• Refer friends: 200 points</li>
                            <li>• Social media shares: 10 points</li>
                            <li>• Birthday bonus: 500 points</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="coupons" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Coupon Codes
                  </h2>
                  <p className="text-muted-foreground">
                    Enter these codes at checkout for instant savings
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  {couponCodes.map((coupon, index) => (
                    <Card key={index} className="border-dashed border-2">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                              <Percent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-mono text-xl font-bold text-primary">
                                {coupon.code}
                              </div>
                              <p className="text-muted-foreground">
                                {coupon.description}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-2">
                              {coupon.category}
                            </Badge>
                            <Button variant="outline" size="sm" className="block">
                              Copy Code
                            </Button>
                          </div>
                        </div>
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

export default Promotions;