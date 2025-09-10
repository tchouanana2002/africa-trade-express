import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodDialog } from './PaymentMethodDialog';

export const CartSheet = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleInitiateCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = async (method: 'card' | 'phone' | 'delivery', details: string) => {
    setIsProcessingPayment(true);

    try {
      if (method === 'delivery') {
        // Handle pay on delivery - just create order without payment
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            items,
            totalAmount: Math.round(getTotalPrice()),
            currency: 'XAF',
            paymentMethod: 'delivery',
          },
        });

        if (error) throw error;

        toast({
          title: "Order Placed",
          description: "Your order has been placed. You'll pay on delivery.",
        });
        
        clearCart();
        setShowPaymentDialog(false);
      } else {
        // Handle online payment (Campay)
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            items,
            totalAmount: Math.round(getTotalPrice()),
            currency: 'XAF',
            paymentMethod: method,
            paymentDetails: details,
          },
        });

        if (error) throw error;

        if (data?.url) {
          // Open Campay payment page in new tab
          window.open(data.url, '_blank');
          setShowPaymentDialog(false);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart ({getTotalItems()})</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">by {item.vendor}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{item.price}</p>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    XAF {getTotalPrice().toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={handleInitiateCheckout}
                  disabled={isProcessingPayment}
                  className="w-full"
                  size="lg"
                >
                  {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onConfirm={handlePaymentConfirm}
        isProcessing={isProcessingPayment}
      />
    </Sheet>
  );
};