import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  vendor: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
}

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showFilters?: boolean;
  categories?: string[];
}

const ProductGrid = ({ title, subtitle, products, showFilters = false, categories = [] }: ProductGridProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendor: product.vendor,
      category: product.category,
    });
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Category Filters */}
        {showFilters && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button variant="default" size="sm" className="rounded-full">
              All Categories
            </Button>
            {categories.map((category) => (
              <Button 
                key={category}
                variant="outline" 
                size="sm" 
                className="rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    {product.badge}
                  </Badge>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {product.vendor}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < product.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-primary hover:text-primary-foreground"
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/chat?productId=${product.id}&vendorId=vendor-${product.vendor}`)}
                    className="hover:bg-primary hover:text-primary-foreground"
                    title="Chat with seller"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-secondary hover:bg-secondary/90"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;