import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, ProductCategory } from "@/types";
import { getAllCategories, getCategoryName } from "@/data/products"; // Import categories

// Validation Schema using Zod
const productFormSchema = z.object({
  id: z.string().optional(), // ID is optional for new products
  name: z.string().min(3, { message: "يجب أن يكون اسم المنتج 3 أحرف على الأقل." }),
  description: z.string().optional(),
  category: z.enum(["distribution_transformers", "power_transformers", "meters", "fiber_cables", "irons"], {
    required_error: "يجب اختيار فئة المنتج.",
  }),
  price: z.coerce.number().positive({ message: "يجب أن يكون السعر رقمًا موجبًا." }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: "يجب أن يكون عنوان URL للصورة صالحًا." }).optional().or(z.literal('')),
  // parent_id: z.string().optional(), // Add later if needed
  stock_quantity: z.coerce.number().int().nonnegative({ message: "يجب أن يكون مخزون الكمية رقمًا صحيحًا غير سالب." }).optional().or(z.literal('')),
  isCustomizable: z.boolean().optional(),
  // Add more fields for specifications as needed
  capacity: z.string().optional(),
  voltage: z.string().optional(),
  current: z.string().optional(),
  phase: z.string().optional(),
  fibers: z.coerce.number().int().nonnegative().optional().or(z.literal('')),
  productType: z.string().optional(),
  // Simple details for now
  details: z.record(z.any()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => Promise<void>;
  initialData?: Product | null;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const allCategories = getAllCategories();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category,
      price: initialData?.price || '',
      imageUrl: initialData?.imageUrl || '',
      stock_quantity: initialData?.details?.stock_quantity || '', // Check details for this field
      isCustomizable: initialData?.isCustomizable || false,
      capacity: initialData?.capacity || "",
      voltage: initialData?.voltage || "",
      current: initialData?.current || "",
      phase: initialData?.phase || "",
      fibers: initialData?.fibers || '',
      productType: initialData?.productType || "",
      details: initialData?.details || {},
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    // Combine specific fields back into details if needed before submitting
    // For now, we pass the structured values directly
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id="product-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-3">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المنتج *</FormLabel>
              <FormControl>
                <Input placeholder="مثال: محولة توزيع 100 KVA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea placeholder="أدخل وصفًا تفصيليًا للمنتج..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الفئة *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فئة المنتج" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryName(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>السعر (د.ع)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="مثال: 50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock Quantity - Assuming it might be in details */}
        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الكمية في المخزون</FormLabel>
              <FormControl>
                <Input type="number" placeholder="مثال: 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         {/* Is Customizable */}
         <FormField
          control={form.control}
          name="isCustomizable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                 <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  قابل للتخصيص؟
                </FormLabel>
                <FormDescription>
                  هل يمكن للعميل طلب مواصفات خاصة لهذا المنتج؟
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* --- Specifications --- */}
        <h3 className="text-lg font-medium pt-4 border-t">المواصفات الفنية</h3>

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>القدرة</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 100 KVA, 10 MVA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Voltage */}
        <FormField
          control={form.control}
          name="voltage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الجهد</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 11/0.416 KV, 3*416/240 V" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current */}
        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem>
              <FormLabel>التيار</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 20-60 A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phase */}
        <FormField
          control={form.control}
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عدد الأطوار</FormLabel>
              <FormControl>
                <Input placeholder="مثال: أحادي, ثلاثي" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fibers */}
        <FormField
          control={form.control}
          name="fibers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عدد الشعيرات (للقابلوات)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="مثال: 24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Type */}
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع المنتج الفرعي</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 11_0416_kv, electrical, armored" {...field} />
              </FormControl>
              <FormDescription>
                معرّف داخلي للتمييز بين أنواع المنتجات ضمن نفس الفئة (اختياري).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         {/* Note: The submit button is in the Dialog Footer in AdminProducts.tsx */}
         {/* <Button type="submit" disabled={isLoading}>{isLoading ? 'جاري الحفظ...' : (initialData ? 'حفظ التغييرات' : 'إضافة منتج')}</Button> */}
      </form>
    </Form>
  );
}; 