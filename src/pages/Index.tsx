import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Sample product data - in a real app this would come from an API
  const popularProducts = [
    {
      id: 1,
      name: "Premium African Coffee Beans - Arabica Blend",
      price: "$24.99",
      originalPrice: "$29.99",
      vendor: "Ethiopian Coffee Co.",
      rating: 5,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      badge: "Best Seller",
      category: "Food & Beverages"
    },
    {
      id: 2,
      name: "Handwoven Kente Cloth - Traditional Design",
      price: "$89.99",
      vendor: "Ghana Textiles Ltd",
      rating: 5,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      category: "Fashion & Textiles"
    },
    {
      id: 3,
      name: "Solar Power Bank - 20000mAh Portable Charger",
      price: "$45.99",
      originalPrice: "$59.99",
      vendor: "EcoTech Solutions",
      rating: 4,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1609592806066-3a9a03bfe9f1?w=400&h=300&fit=crop",
      badge: "Eco-Friendly",
      category: "Electronics"
    },
    {
      id: 4,
      name: "Organic Shea Butter - Raw & Unrefined 500g",
      price: "$19.99",
      vendor: "Natural Beauty Co.",
      rating: 5,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      category: "Beauty & Personal Care"
    },
    {
      id: 5,
      name: "African Drums Set - Handcrafted Djembe",
      price: "$129.99",
      vendor: "Musical Heritage",
      rating: 5,
      reviews: 43,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      category: "Music & Arts"
    },
    {
      id: 6,
      name: "Moroccan Argan Oil - Pure & Organic 100ml",
      price: "$34.99",
      vendor: "Atlas Beauty",
      rating: 4,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop",
      category: "Beauty & Personal Care"
    },
    {
      id: 7,
      name: "Solar LED Lantern - Weather Resistant",
      price: "$29.99",
      vendor: "BrightLight Tech",
      rating: 4,
      reviews: 73,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      category: "Electronics"
    },
    {
      id: 8,
      name: "African Print Ankara Fabric - Premium Quality",
      price: "$15.99",
      vendor: "Fabric World Africa",
      rating: 5,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1506629905607-4b9f99071d4b?w=400&h=300&fit=crop",
      category: "Fashion & Textiles"
    }
  ];

  const bestSellers = [
    {
      id: 9,
      name: "Bluetooth Wireless Earbuds - Premium Sound",
      price: "$39.99",
      originalPrice: "$49.99",
      vendor: "AudioTech Pro",
      rating: 4,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop",
      badge: "Top Rated",
      category: "Electronics"
    },
    {
      id: 10,
      name: "Traditional Wooden Mask - Hand Carved",
      price: "$67.99",
      vendor: "Artisan Crafts",
      rating: 5,
      reviews: 56,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      category: "Arts & Crafts"
    },
    {
      id: 11,
      name: "Organic Baobab Fruit Powder - Superfood 250g",
      price: "$22.99",
      vendor: "Superfood Africa",
      rating: 5,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400&h=300&fit=crop",
      category: "Health & Wellness"
    },
    {
      id: 12,
      name: "Smart Fitness Tracker - Health Monitor",
      price: "$79.99",
      originalPrice: "$99.99",
      vendor: "FitTech Solutions",
      rating: 4,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop",
      badge: "New Arrival",
      category: "Electronics"
    }
  ];

  const categories = [
    "Electronics", 
    "Fashion & Textiles", 
    "Food & Beverages", 
    "Beauty & Personal Care", 
    "Arts & Crafts", 
    "Health & Wellness"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <ProductGrid 
          title="Popular Products"
          subtitle="Discover the most loved products from verified vendors across Africa"
          products={popularProducts}
        />
        
        <ProductGrid 
          title="Best Sellers"
          subtitle="Top-performing products by category with highest sales and customer satisfaction"
          products={bestSellers}
          showFilters={true}
          categories={categories}
        />
        
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;