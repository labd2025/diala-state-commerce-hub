import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, ArrowLeft, ArrowRight, Layers, Tag, LayoutGrid, ChevronDown, Check, Send } from "lucide-react";
import { Product } from "@/types";
import { getCategoryName } from "@/data/products";
import { getChildProducts, getParentProduct } from "@/utils/productHelpers";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProductDetailsCardProps {
  product: Product;
  showRelated?: boolean;
}

interface CustomOrderForm {
  capacity: string;
  inputVoltage: string;
  outputVoltage: string;
  fibers?: number;
  description: string;
  customerName: string;
  contactInfo: string;
  needConsultation: boolean;
}

export function ProductDetailsCard({ product, showRelated = true }: ProductDetailsCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [childProducts, setChildProducts] = useState<Product[]>([]);
  const [parentProduct, setParentProduct] = useState<Product | null>(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [customOrderFormOpen, setCustomOrderFormOpen] = useState(false);
  
  // نموذج الطلب بمواصفات خاصة
  const [customOrderForm, setCustomOrderForm] = useState<CustomOrderForm>({
    capacity: "",
    inputVoltage: "",
    outputVoltage: "",
    fibers: undefined,
    description: "",
    customerName: "",
    contactInfo: "",
    needConsultation: false
  });
  
  // جديد: تنظيم المنتجات الفرعية حسب الخصائص
  const [groupedChildProducts, setGroupedChildProducts] = useState<Record<string, Product[]>>({});
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load parent product if it exists
    const loadData = async () => {
      try {
        // Load parent product if exists
        if (product.parent_id) {
          const parent = await getParentProduct(product.parent_id);
          if (parent) {
            setParentProduct(parent);
          }
        }

        // Load child products
        const children = await getChildProducts(product.id);
        setChildProducts(children);
        
        // Organize child products by type
        if (children.length > 0) {
          const grouped = groupProductsByType(children);
          setGroupedChildProducts(grouped);
        }

        // Load related products (products from the same category)
        if (product.parent_id) {
          const siblingProducts = await getChildProducts(product.parent_id);
          const related = siblingProducts.filter(p => p.id !== product.id).slice(0, 4);
          setRelatedProducts(related);
        }

        // Set default values
        setSelectedVariant(product);
      } catch (error) {
        console.error("Error loading product data:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات المنتج.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [product]);

  // دالة لتنظيم المنتجات حسب النوع
  const groupProductsByType = (products: Product[]): Record<string, Product[]> => {
    const result: Record<string, Product[]> = {};
    
    // جمع كل المنتجات التي لها نفس السمة معاً
    products.forEach(p => {
      // البحث عن السمة الرئيسية للتصنيف (السعة، الجهد، الطور، الشعيرات، الخ)
      let key = "";
      
      if (p.capacity) {
        key = "capacity";
      } else if (p.voltage) {
        key = "voltage";
      } else if (p.phase) {
        key = "phase";
      } else if (p.fibers) {
        key = "fibers";
      } else if (p.current) {
        key = "current";
      } else if (p.productType) {
        key = "productType";
      } else {
        key = "other";
      }
      
      if (!result[key]) {
        result[key] = [];
      }
      
      result[key].push(p);
    });
    
    return result;
  };

  const handleAddToCart = async () => {
    try {
      const productToAdd = selectedVariant || product;
      await addToCart(productToAdd.id, 1);
      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة ${productToAdd.name} إلى سلة التسوق.`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المنتج إلى السلة.",
        variant: "destructive",
      });
    }
  };

  const selectVariant = (variant: Product) => {
    setSelectedVariant(variant);
  };

  // الحصول على العنوان العربي للخاصية
  const getPropertyName = (key: string): string => {
    const propertyNames: Record<string, string> = {
      capacity: "السعة",
      voltage: "الجهد",
      phase: "الطور",
      fibers: "عدد الشعيرات",
      current: "التيار",
      productType: "النوع",
      other: "خصائص أخرى"
    };
    
    return propertyNames[key] || key;
  };

  // الحصول على قيمة الخاصية من المنتج
  const getPropertyValue = (product: Product, key: string): string => {
    switch (key) {
      case "capacity": return product.capacity || "";
      case "voltage": return product.voltage || "";
      case "phase": return product.phase || "";
      case "fibers": return product.fibers?.toString() || "";
      case "current": return product.current || "";
      case "productType": return product.productType || "";
      default: return "";
    }
  };

  // معالجة تغييرات نموذج الطلب المخصص
  const handleCustomOrderChange = (field: keyof CustomOrderForm, value: any) => {
    setCustomOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // إرسال طلب بمواصفات خاصة
  const handleSubmitCustomOrder = () => {
    // سيتم تنفيذ إرسال البيانات هنا (API)
    toast({
      title: "تم إرسال الطلب",
      description: "تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.",
    });
    setCustomOrderFormOpen(false);
  };

  // إرسال طلب استشارة
  const handleSubmitConsultation = () => {
    // سيتم تنفيذ إرسال طلب الاستشارة هنا (API)
    toast({
      title: "تم إرسال طلب الاستشارة",
      description: "تم إرسال طلب الاستشارة بنجاح. سيتم التواصل معك قريباً.",
    });
    setShowConsultationForm(false);
  };

  const renderSpecifications = () => {
    const specs = selectedVariant?.details || product.details;
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">الخاصية</TableHead>
            <TableHead>القيمة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(specs).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
          {selectedVariant?.capacity && (
            <TableRow>
              <TableCell className="font-medium">السعة</TableCell>
              <TableCell>{selectedVariant.capacity}</TableCell>
            </TableRow>
          )}
          {selectedVariant?.voltage && (
            <TableRow>
              <TableCell className="font-medium">الفولتية</TableCell>
              <TableCell>{selectedVariant.voltage}</TableCell>
            </TableRow>
          )}
          {selectedVariant?.current && (
            <TableRow>
              <TableCell className="font-medium">التيار</TableCell>
              <TableCell>{selectedVariant.current}</TableCell>
            </TableRow>
          )}
          {selectedVariant?.phase && (
            <TableRow>
              <TableCell className="font-medium">الأطوار</TableCell>
              <TableCell>{selectedVariant.phase}</TableCell>
            </TableRow>
          )}
          {selectedVariant?.fibers && (
            <TableRow>
              <TableCell className="font-medium">عدد الشعيرات</TableCell>
              <TableCell>{selectedVariant.fibers}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const renderProductVariants = () => {
    if (Object.keys(groupedChildProducts).length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">خيارات المنتج</h3>
        
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(groupedChildProducts).map(([key, variants]) => {
            if (variants.length === 0) return null;
            
            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-md font-medium">
                  {getPropertyName(key)}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {variants.map(variant => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const value = getPropertyValue(variant, key);
                      
                      return (
                        <div 
                          key={variant.id}
                          onClick={() => selectVariant(variant)}
                          className={`
                            p-3 border rounded-md cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-gray-200 hover:border-gray-300'}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{value}</span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                          {variant.price && (
                            <div className="mt-1 text-sm font-medium">
                              {variant.price.toLocaleString()} د.ع
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  };

  // تقديم الاختيار السريع للمنتج (قائمة منسدلة) بجانب الكمية
  const renderQuickVariantSelector = () => {
    if (childProducts.length === 0) return null;
    
    return (
      <div className="w-full">
        <label className="block text-sm font-medium mb-2">النوع</label>
        <Select
          value={selectedVariant?.id}
          onValueChange={(value) => {
            const variant = childProducts.find(p => p.id === value) || product;
            selectVariant(variant);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر النوع" />
          </SelectTrigger>
          <SelectContent>
            {childProducts.map((variant) => (
              <SelectItem key={variant.id} value={variant.id}>
                {variant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // نموذج الطلب بمواصفات خاصة
  const renderCustomOrderForm = () => {
    const isCableFiber = product.category === "fiber_cables";
    const isTransformer = product.category === "distribution_transformers" || product.category === "power_transformers";
    
    return (
      <Dialog open={customOrderFormOpen} onOpenChange={setCustomOrderFormOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-2 w-full">
            <Settings className="h-4 w-4 ml-2" />
            طلب بمواصفات خاصة
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>طلب منتج بمواصفات خاصة</DialogTitle>
            <DialogDescription>
              يرجى تعبئة التفاصيل المطلوبة للحصول على منتج مخصص حسب احتياجاتك.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel>بيانات العميل</FormLabel>
              <Input
                placeholder="الاسم الكامل"
                value={customOrderForm.customerName}
                onChange={(e) => handleCustomOrderChange('customerName', e.target.value)}
              />
              <Input
                placeholder="معلومات الاتصال (هاتف / ايميل)"
                value={customOrderForm.contactInfo}
                onChange={(e) => handleCustomOrderChange('contactInfo', e.target.value)}
              />
            </div>
            
            {isTransformer && (
              <div className="grid gap-2">
                <FormLabel>مواصفات المحولة</FormLabel>
                <Input
                  placeholder="السعة (KVA)"
                  value={customOrderForm.capacity}
                  onChange={(e) => handleCustomOrderChange('capacity', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="فولتية الإدخال (KV)"
                    value={customOrderForm.inputVoltage}
                    onChange={(e) => handleCustomOrderChange('inputVoltage', e.target.value)}
                  />
                  <Input
                    placeholder="فولتية الإخراج (KV)"
                    value={customOrderForm.outputVoltage}
                    onChange={(e) => handleCustomOrderChange('outputVoltage', e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {isCableFiber && (
              <div className="grid gap-2">
                <FormLabel>مواصفات القابلو الضوئي</FormLabel>
                <Input
                  type="number"
                  placeholder="عدد الشعيرات"
                  value={customOrderForm.fibers || ""}
                  onChange={(e) => handleCustomOrderChange('fibers', parseInt(e.target.value) || 0)}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <FormLabel>الوصف التفصيلي للمتطلبات</FormLabel>
              <Textarea
                placeholder="يرجى وصف متطلباتك بالتفصيل"
                rows={4}
                value={customOrderForm.description}
                onChange={(e) => handleCustomOrderChange('description', e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="consultation"
                checked={customOrderForm.needConsultation}
                onCheckedChange={(checked) => handleCustomOrderChange('needConsultation', checked)}
              />
              <FormLabel htmlFor="consultation" className="mr-2">أحتاج إلى استشارة فنية قبل الطلب</FormLabel>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitCustomOrder}>
              <Send className="h-4 w-4 ml-2" />
              إرسال الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // نموذج طلب استشارة
  const renderConsultationForm = () => {
    return (
      <Dialog open={showConsultationForm} onOpenChange={setShowConsultationForm}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-2">
            طلب استشارة
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>طلب استشارة فنية</DialogTitle>
            <DialogDescription>
              يرجى تعبئة البيانات التالية للحصول على استشارة فنية من فريق المبيعات.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel>بيانات العميل</FormLabel>
              <Input
                placeholder="الاسم الكامل"
                value={customOrderForm.customerName}
                onChange={(e) => handleCustomOrderChange('customerName', e.target.value)}
              />
              <Input
                placeholder="معلومات الاتصال (هاتف / ايميل)"
                value={customOrderForm.contactInfo}
                onChange={(e) => handleCustomOrderChange('contactInfo', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <FormLabel>وصف احتياجك أو استفسارك</FormLabel>
              <Textarea
                placeholder="يرجى وصف احتياجك أو استفسارك بالتفصيل"
                rows={4}
                value={customOrderForm.description}
                onChange={(e) => handleCustomOrderChange('description', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <FormLabel>نوع الاستشارة المطلوبة</FormLabel>
              <RadioGroup defaultValue="technical">
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <RadioGroupItem value="technical" id="technical" />
                  <FormLabel htmlFor="technical" className="mr-2">استشارة فنية حول المواصفات</FormLabel>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <RadioGroupItem value="quotation" id="quotation" />
                  <FormLabel htmlFor="quotation" className="mr-2">عرض سعر لمنتج بكميات كبيرة</FormLabel>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="custom" id="custom" />
                  <FormLabel htmlFor="custom" className="mr-2">استشارة حول منتج بمواصفات خاصة</FormLabel>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitConsultation}>
              <Send className="h-4 w-4 ml-2" />
              إرسال طلب الاستشارة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderProductNavigation = () => {
    // إذا كان المنتج له منتج أب، نعرض رابط العودة إليه
    if (parentProduct) {
      return (
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/products/${parentProduct.id}`}>
              <ArrowRight className="ml-2 h-4 w-4" />
              {parentProduct.name}
            </Link>
          </Button>
        </div>
      );
    }
    
    return null;
  };

  const renderRelatedProducts = () => {
    if (!showRelated || relatedProducts.length === 0) return null;
    
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">منتجات ذات صلة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedProducts.map(related => (
            <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={related.imageUrl}
                  alt={related.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-md">{related.name}</CardTitle>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button asChild size="sm" className="w-full">
                  <Link to={`/products/${related.id}`}>عرض المنتج</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      {renderProductNavigation()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div>
          <div className="flex flex-col h-full">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{selectedVariant?.name || product.name}</h1>
                {product.isCustomizable && (
                  <Badge variant="outline" className="mr-2">
                    <Settings className="h-3 w-3 ml-1" />
                    قابل للتخصيص
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center mt-2">
                <Badge variant="secondary">
                  <LayoutGrid className="h-3 w-3 ml-1" />
                  {getCategoryName(product.category)}
                </Badge>
                
                {product.subCategory && (
                  <Badge variant="outline" className="mr-2">
                    <Layers className="h-3 w-3 ml-1" />
                    {product.subCategory}
                  </Badge>
                )}
              </div>
              
              <p className="mt-4 text-gray-700">
                {selectedVariant?.description || product.description}
              </p>
              
              {(selectedVariant?.price || product.price) && (
                <div className="mt-4 flex items-center">
                  <Tag className="h-5 w-5 ml-2 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {selectedVariant?.price || product.price} د.ع
                  </span>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            {/* عرض خيارات المنتج */}
            {renderProductVariants()}
            
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* إضافة القائمة المنسدلة للنوع */}
                {renderQuickVariantSelector()}
                
                <div>
                  <label className="block text-sm font-medium mb-2">الكمية</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full"
                    disabled={!selectedVariant?.price && !product.price}
                  >
                    إضافة إلى السلة
                  </Button>
                </div>
              </div>
              
              {product.isCustomizable && (
                <div className="mt-4 bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">منتج قابل للتخصيص</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    يمكنك طلب هذا المنتج بمواصفات خاصة حسب احتياجاتك.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {renderCustomOrderForm()}
                    {renderConsultationForm()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="specifications" className="mt-8">
        <TabsList>
          <TabsTrigger value="specifications">المواصفات</TabsTrigger>
          {product.details["التفاصيل الفنية"] && (
            <TabsTrigger value="technical">التفاصيل الفنية</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="specifications" className="mt-4 bg-white p-6 rounded-lg border">
          {renderSpecifications()}
        </TabsContent>
        {product.details["التفاصيل الفنية"] && (
          <TabsContent value="technical" className="mt-4 bg-white p-6 rounded-lg border">
            <div className="prose max-w-none">
              {product.details["التفاصيل الفنية"]}
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {renderRelatedProducts()}
    </div>
  );
} 