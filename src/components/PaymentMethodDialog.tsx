import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Phone, Truck } from 'lucide-react';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (method: 'card' | 'phone' | 'delivery', details: string) => void;
  isProcessing: boolean;
}

export const PaymentMethodDialog = ({ open, onOpenChange, onConfirm, isProcessing }: PaymentMethodDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'phone' | 'delivery'>('phone');
  const [cardNumber, setCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleConfirm = () => {
    let details = '';
    if (paymentMethod === 'card') {
      details = cardNumber;
    } else if (paymentMethod === 'phone') {
      details = phoneNumber;
    }
    onConfirm(paymentMethod, details);
  };

  const isValid = () => {
    if (paymentMethod === 'card') return cardNumber.length >= 16;
    if (paymentMethod === 'phone') return phoneNumber.length >= 9;
    return true; // Pay on delivery is always valid
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'phone' | 'delivery')}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="phone" id="phone" />
                <Phone className="h-5 w-5 text-primary" />
                <Label htmlFor="phone" className="flex-1 cursor-pointer">
                  Mobile Money (Campay)
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-primary" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  Credit/Debit Card
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="delivery" id="delivery" />
                <Truck className="h-5 w-5 text-primary" />
                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                  Pay on Delivery
                </Label>
              </div>
            </div>
          </RadioGroup>

          <Separator />

          {paymentMethod === 'phone' && (
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                placeholder="+237 6XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter your mobile money number for Campay payment
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                maxLength={19}
              />
              <p className="text-sm text-muted-foreground">
                Enter your 16-digit card number
              </p>
            </div>
          )}

          {paymentMethod === 'delivery' && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                You will pay when your order is delivered to your address. 
                Cash and mobile money payments are accepted.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!isValid() || isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};