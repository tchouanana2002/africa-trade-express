import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All Products',
    'Agriculture',
    'Crafts & Art',
    'Textiles',
    'Food & Beverages',
    'Technology',
    'Health & Beauty',
    'Home & Garden',
    'Fashion & Accessories'
  ];

  const products = [
    {
      id: 1,
      name: 'Ethiopian Coffee Beans',
      price: 24.99,
      originalPrice: 29.99,
      vendor: 'Addis Coffee Co.',
      rating: 4.8,
      image: '/placeholder.svg',
      category: 'Food & Beverages',
      description: 'Premium organic coffee beans from the highlands of Ethiopia'
    },
    {
      id: 2,
      name: 'Kente Cloth Scarf',
      price: 45.00,
      vendor: 'Ghana Weavers',
      rating: 4.9,
      image: '/placeholder.svg',
      category: 'Textiles',
      description: 'Handwoven traditional Kente cloth scarf with authentic patterns'
    },
    {
      id: 3,
      name: 'Wooden Sculpture Set',
      price: 89.99,
      vendor: 'Nairobi Arts',
      rating: 4.7,
      image: '/placeholder.svg',
      category: 'Crafts & Art',
      description: 'Beautiful hand-carved wooden sculptures representing African wildlife'
    },
    {
      id: 4,
      name: 'Organic Shea Butter',
      price: 18.50,
      vendor: 'Burkina Beauty',
      rating: 4.6,
      image: '/placeholder.svg',
      category: 'Health & Beauty',
      description: 'Pure, unrefined shea butter from sustainable sources'
    },
    {
      id: 5,
      name: 'Baobab Fruit Powder',
      price: 32.00,
      vendor: 'SuperFruit Co.',
      rating: 4.5,
      image: '/placeholder.svg',
      category: 'Food & Beverages',
      description: 'Nutrient-rich superfruit powder from the iconic baobab tree'
    },
    {
      id: 6,
      name: 'Traditional Basket',
      price: 67.99,
      vendor: 'Rwanda Crafts',
      rating: 4.8,
      image: '/placeholder.svg',
      category: 'Crafts & Art',
      description: 'Handwoven basket using traditional techniques and natural materials'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Discover African Products
          </h1>
          <p className="text-muted-foreground">
            Explore authentic products from across Africa, made by local artisans and businesses
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`group hover:shadow-lg transition-shadow duration-200 ${
              viewMode === 'list' ? 'flex flex-row' : ''
            }`}>
              <div className={viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className={viewMode === 'list' ? 'flex-1' : ''}>
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ${product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    by {product.vendor}
                  </CardDescription>
                  {viewMode === 'list' && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;