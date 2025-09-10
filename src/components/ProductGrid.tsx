import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  vendor_id: string;
  category: string;
  stock: number;
  images: string[];
  is_active: boolean;
  vendor_name?: string;
}

interface ProductGridProps {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
  categories?: string[];
  limit?: number;
}

const ProductGrid = ({ title, subtitle, showFilters = false, categories = [], limit }: ProductGridProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: productsData, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Get vendor profiles separately
      if (productsData?.length) {
        const vendorIds = [...new Set(productsData.map(p => p.vendor_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', vendorIds);

        // Transform data to include vendor name
        const productsWithVendor = productsData.map(product => ({
          ...product,
          vendor_name: profiles?.find(p => p.user_id === product.vendor_id)?.display_name || 'Unknown Vendor'
        }));

        setProducts(productsWithVendor);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: `XAF ${product.price.toLocaleString()}`,
      image: product.images[0] || '/placeholder.svg',
      vendor: product.vendor_name || 'Unknown Vendor',
      category: product.category,
    });
  };

  const handleChatWithVendor = (product: Product) => {
    navigate(`/chat?productId=${product.id}&vendorId=${product.vendor_id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

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
                  src={product.images[0] || '/placeholder.svg'} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock < 10 && product.stock > 0 && (
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    Low Stock
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                    Out of Stock
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
                    by {product.vendor_name}
                  </p>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      XAF {product.price.toLocaleString()}
                    </span>
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
                    onClick={() => handleChatWithVendor(product)}
                    className="hover:bg-primary hover:text-primary-foreground"
                    title="Chat with seller"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-secondary hover:bg-secondary/90"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
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