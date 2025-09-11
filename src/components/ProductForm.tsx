import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, X, ImageIcon, DollarSign, Package, Tag, FileText, Camera, Sparkles } from 'lucide-react';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  is_active: boolean;
}

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = [
  'Electronics',
  'Clothing', 
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Automotive',
  'Other'
];

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0,
    images: product?.images || [],
    is_active: product?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Product data:', formData);
      alert(`Product ${product?.id ? 'updated' : 'created'} successfully!`);
      onSuccess();
    } catch (error: any) {
      alert('Error: ' + error.message);
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
        // Convert to base64 for demo purposes
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
          <div className="space-y-8">
            {/* Product Name */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Product Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-lg py-6 border-2 focus:border-blue-500 transition-all duration-300"
                placeholder="Enter an amazing product name..."
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-32 text-base border-2 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Describe your product in detail..."
              />
            </div>

            {/* Price and Stock Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="price" className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Price (XAF)
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="text-lg py-6 border-2 focus:border-green-500 transition-all duration-300 pl-12"
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 font-bold">XAF</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="stock" className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="text-lg py-6 border-2 focus:border-orange-500 transition-all duration-300"
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
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-500" />
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="text-lg py-6 border-2 focus:border-purple-500 transition-all duration-300">
                  <SelectValue placeholder="Choose a category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-base py-3">
                      <span className="flex items-center gap-3">
                        <span>{getCategoryIcon(category)}</span>
                        {category}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5 text-pink-500" />
                Product Images
              </Label>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
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
                    onClick={() => fileInputRef.current?.click()}
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
                <Label htmlFor="active" className="text-lg font-semibold cursor-pointer">
                  Product Status
                </Label>
                <p className="text-gray-600">Make this product visible to customers</p>
              </div>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleSubmit}
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
                variant="outline"
                onClick={onCancel}
                className="px-8 py-6 text-lg border-2 hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}