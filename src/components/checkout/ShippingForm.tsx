import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
  isProcessing: boolean;
}

export interface ShippingData {
  shippingAddress: string;
  phoneNumber: string;
  notes: string;
}

export const ShippingForm = ({ onSubmit, isProcessing }: ShippingFormProps) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ shippingAddress, phoneNumber, notes });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipping-address">عنوان الشحن</Label>
            <Textarea
              id="shipping-address"
              placeholder="أدخل عنوان الشحن الكامل"
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone-number">رقم الهاتف</Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder="أدخل رقم الهاتف"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="أي ملاحظات إضافية للطلب"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-diala-600 hover:bg-diala-700"
            disabled={isProcessing}
          >
            {isProcessing ? 'جاري المعالجة...' : 'إكمال الطلب'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 