import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, ShoppingCart, Plus, Edit, Trash2, MessageCircle, Star, Eye, DollarSign, Users, Calendar, Clock, ImageIcon, Activity, Zap, Upload, X, FileText, Camera, Sparkles } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  items: any;
  created_at: string;
  user_id: string;
}

interface Conversation {
  id: string;
  customer_id: string;
  product_id: number;
  last_message_at: string;
  customer_name?: string;
  product_name?: string;
}

// Mock data for demo
const mockProducts: Product[] = [
  // {
  //   id: 1,
  //   name: "iPhone 15 Pro Max",
  //   description: "Latest Apple smartphone with amazing features",
  //   price: 850000,
  //   category: "Electronics",
  //   stock: 15,
  //   images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
  //   is_active: true,
  //   created_at: "2024-01-15T10:00:00Z",
  //   updated_at: "2024-01-15T10:00:00Z"
  // },
  // {
  //   id: 2,
  //   name: "Nike Air Force 1",
  //   description: "Classic white sneakers for everyday wear",
  //   price: 85000,
  //   category: "Clothing",
  //   stock: 8,
  //   images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
  //   is_active: true,
  //   created_at: "2024-01-14T15:30:00Z",
  //   updated_at: "2024-01-14T15:30:00Z"
  // },
  // {
  //   id: 3,
  //   name: "MacBook Pro 16\"",
  //   description: "Professional laptop for creators and developers",
  //   price: 1200000,
  //   category: "Electronics",
  //   stock: 3,
  //   images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
  //   is_active: false,
  //   created_at: "2024-01-13T09:15:00Z",
  //   updated_at: "2024-01-13T09:15:00Z"
  // }
];


const mockOrders: Order[] = [
  { id: "ord_001", amount: 850000, status: "completed", items: {}, created_at: "2024-01-15T14:30:00Z", user_id: "user1" },
  { id: "ord_002", amount: 85000, status: "pending", items: {}, created_at: "2024-01-15T12:15:00Z", user_id: "user2" },
  { id: "ord_003", amount: 170000, status: "completed", items: {}, created_at: "2024-01-14T16:45:00Z", user_id: "user3" }
];

const mockConversations: Conversation[] = [
  { id: "conv_001", customer_id: "user1", product_id: 1, last_message_at: "2024-01-15T15:45:00Z", customer_name: "John Doe", product_name: "iPhone 15 Pro Max" },
  { id: "conv_002", customer_id: "user2", product_id: 2, last_message_at: "2024-01-15T14:20:00Z", customer_name: "Jane Smith", product_name: "Nike Air Force 1" }
];

export default function VendorDashboard() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
    const { toast } = useToast();
  

  const stats = {
    totalProducts: products.length,
    totalSales: orders.reduce((sum, order) => sum + order.amount, 0),
    totalOrders: orders.length,
    revenue: orders.filter(order => order.status === 'completed').reduce((sum, order) => sum + order.amount, 0),
    activeProducts: products.filter(p => p.is_active).length,
    lowStock: products.filter(p => p.stock < 10).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    conversations: conversations.length
  };

  const handleDeleteProduct = async (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    alert('Product deleted successfully!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleFormSuccess = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleChatClick = (conversationId: string) => {
    alert(`Opening chat: ${conversationId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
const { getUserId } = useAuth();
const userId = getUserId();



useEffect(() => {
  if (userId) {
    fetchProducts();
  }
}, [userId]);


const fetchProducts = async () => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('vendor_id', userId)
      .order('created_at', { ascending: false });
      console.log("query",query);

    const { data: productsData, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(productsData);

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

    } else {
      setProducts([]);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoading(false);
  }
};
  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Books': '📚',
      'Home & Garden': '🏠',
      'Sports': '⚽',
      'Beauty': '💄',
      'Automotive': '🚗',
      'Other': '📦'
    };
    return emojis[category] || '📦';
  };
  

  // ProductForm Component
  const ProductForm = ({ product, onSuccess, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || '',
      stock: product?.stock || 0,
      images: product?.images || [],
      is_active: product?.is_active ?? true,
      vendor_id: userId,
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = [
      'Electronics', 'Clothing', 'Books', 'Home & Garden', 
      'Sports', 'Beauty', 'Automotive', 'Other'
    ];

    // const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault();
    //   setLoading(true);
      
    //   try {
    //     // Simulate API call
    //     await new Promise(resolve => setTimeout(resolve, 1500));
        
    //     // Update the products state with the new/edited product
    //     if (product?.id) {
    //       // Edit existing product
    //       setProducts(prev => prev.map(p => 
    //         p.id === product.id ? { ...p, ...formData, updated_at: new Date().toISOString() } : p
    //       ));
    //     } else {
    //       if (userId) {
    //         // Use the user ID
    //         console.log('Current user ID:', userId);
    //         const newProduct = {
    //           ...formData,
    //           id: Date.now(),
    //           created_at: new Date().toISOString(),
    //           updated_at: new Date().toISOString()
    //         };
    //         supabase.from('products').insert([newProduct]);
    //         setProducts(prev => [newProduct, ...prev]);
    //       } else {
    //         // User is not authenticated
    //         console.log('No user is currently logged in');
    //       }
    //       // Add new product
          
    //     }
        
    //     onSuccess();
    //     alert(`Product ${product?.id ? 'updated' : 'created'} successfully!`);
    //   } catch (error: any) {
    //     alert('Error: ' + error.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const productData = {
        ...formData,
        vendor_id: user.id,
      };

      if (product?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Product ${product?.id ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

    const handleImageUpload = async (files: FileList) => {
      setUploadingImages(true);
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string);
              if (newImages.length === files.length) {
                setFormData(prev => ({
                  ...prev,
                  images: [...prev.images, ...newImages]
                }));
                setUploadingImages(false);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    const removeImage = (index: number) => {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files);
      }
    };

    const getCategoryIcon = (category: string) => {
      const icons: Record<string, string> = {
        'Electronics': '📱',
        'Clothing': '👕', 
        'Books': '📚',
        'Home & Garden': '🏠',
        'Sports': '⚽',
        'Beauty': '💄',
        'Automotive': '🚗',
        'Other': '📦'
      };
      return icons[category] || '📦';
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {product?.id ? 'Edit Product' : 'Create New Product'}
              </CardTitle>
            </div>
            <p className="text-gray-600">Fill in the details below to {product?.id ? 'update' : 'create'} your amazing product</p>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Name */}
              <div className="space-y-3">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Product Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-lg py-6 px-4 border-2 rounded-lg focus:border-blue-500 transition-all duration-300 outline-none"
                  placeholder="Enter an amazing product name..."
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-32 text-base p-4 border-2 rounded-lg focus:border-blue-500 transition-all duration-300 resize-none outline-none"
                  placeholder="Describe your product in detail..."
                />
              </div>

              {/* Price and Stock Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Price (XAF)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full text-lg py-6 pl-12 pr-4 border-2 rounded-lg focus:border-green-500 transition-all duration-300 outline-none"
                      placeholder="0.00"
                      required
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 font-bold">XAF</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full text-lg py-6 px-4 border-2 rounded-lg focus:border-orange-500 transition-all duration-300 outline-none"
                    placeholder="0"
                    required
                  />
                  {formData.stock > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {formData.stock} units available
                    </Badge>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-lg py-6 px-4 border-2 rounded-lg focus:border-purple-500 transition-all duration-300 outline-none bg-white"
                  required
                >
                  <option value="">Choose a category...</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-pink-500" />
                  Product Images
                </label>
                
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-pink-100 rounded-full">
                        <Upload className="h-8 w-8 text-pink-500" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-gray-700">Drop images here or click to upload</p>
                      <p className="text-gray-500">Supports JPG, PNG, WebP up to 10MB each</p>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-500 transition-all duration-300"
                      disabled={uploadingImages}
                    >
                      <ImageIcon className="h-5 w-5 mr-2" />
                      {uploadingImages ? 'Uploading...' : 'Choose Images'}
                    </Button>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 transition-all duration-300 group-hover:border-pink-400"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-6 bg-gray-50/80 rounded-xl border">
                <div className="space-y-1">
                  <label className="text-lg font-semibold cursor-pointer">
                    Product Status
                  </label>
                  <p className="text-gray-600">Make this product visible to customers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.is_active ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      {product?.id ? 'Update Product' : 'Create Product'}
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-6 text-lg border-2 hover:bg-gray-50 transition-all duration-300 bg-white text-gray-700 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
              <Activity className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your products, orders, and customer interactions</p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalProducts}</div>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stats.activeProducts} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">XAF {stats.revenue.toLocaleString()}</div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <ShoppingCart className="h-3 w-3" />
                {stats.totalOrders} total orders
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Eye className="h-3 w-3" />
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Chats</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.conversations}</div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Users className="h-3 w-3" />
                Customer inquiries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="products" className="w-full">
            <div className="border-b border-gray-100">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50/80 rounded-none h-14">
                <TabsTrigger value="products" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Package className="h-5 w-5 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Conversations
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="products" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                    <p className="text-gray-600">Manage your product inventory and listings</p>
                  </div>
                  <Button 
                    onClick={() => setShowProductForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Product
                  </Button>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
                    <p className="text-gray-500 mb-6">Start by adding your first product to get started</p>
                    <Button 
                      onClick={() => setShowProductForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md">
                                {product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-gray-800 truncate">{product.name}</h3>
                                    <span className="text-lg">{getCategoryEmoji(product.category)}</span>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {product.category}
                                    </Badge>
                                    <Badge 
                                      className={product.is_active 
                                        ? 'bg-green-100 text-green-800 border-green-200' 
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                      }
                                    >
                                      {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <Badge 
                                      className={product.stock < 10 
                                        ? 'bg-red-100 text-red-800 border-red-200' 
                                        : 'bg-green-100 text-green-800 border-green-200'
                                      }
                                    >
                                      {product.stock} in stock
                                    </Badge>
                                  </div>
                                </div>

                                <div className="text-right ml-4">
                                  <div className="text-2xl font-bold text-green-600 mb-1">
                                    XAF {product.price.toLocaleString()}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleEditProduct(product)}
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-colors"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="bg-red-500 hover:bg-red-600"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                    <p className="text-gray-600">Track and manage your customer orders</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="px-3 py-1 bg-green-100 text-green-800">
                      {orders.filter(o => o.status === 'completed').length} Completed
                    </Badge>
                    <Badge className="px-3 py-1 bg-yellow-100 text-yellow-800">
                      {orders.filter(o => o.status === 'pending').length} Pending
                    </Badge>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500">Orders will appear here once customers start buying</p>
                  </div>
                ) : (
                  <Card className="shadow-lg border-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80">
                          <TableHead className="font-semibold">Order ID</TableHead>
                          <TableHead className="font-semibold">Amount</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Customer</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              XAF {order.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.user_id}</TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customer Conversations</h2>
                    <p className="text-gray-600">Chat with customers about your products</p>
                  </div>
                  <Badge className="px-3 py-1 bg-purple-100 text-purple-800">
                    {conversations.length} Active Chats
                  </Badge>
                </div>

                {conversations.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Conversations Yet</h3>
                    <p className="text-gray-500">Customer messages will appear here when they inquire about your products</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {conversations.map((conversation) => (
                      <Card key={conversation.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm cursor-pointer"
                            onClick={() => handleChatClick(conversation.id)}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-purple-100 rounded-full">
                                <MessageCircle className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800">
                                  {conversation.customer_name || `Customer ${conversation.customer_id}`}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  Inquiry about: <span className="font-medium">{conversation.product_name}</span>
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  Last message: {new Date(conversation.last_message_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-purple-50 hover:border-purple-300"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Open Chat
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}