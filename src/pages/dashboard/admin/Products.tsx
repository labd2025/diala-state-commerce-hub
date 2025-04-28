import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductCategory } from '@/types';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/utils/productHelpers'; // Assuming these exist
import { getCategoryName, getAllCategories } from '@/data/products'; // Moved getAllCategories here
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { ProductForm, ProductFormValues as FormSchemaValues } from "@/components/products/ProductForm"; // Import the form component and its schema type

// Type for mutation functions, ensure it matches what addProduct/updateProduct expect
// We use the inferred type from the Zod schema in ProductForm for submissions
type ProductSubmitData = FormSchemaValues;

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  // Add state for managing dialogs (add/edit/delete)
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  // Fetch products query
  const { data: products = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['adminProducts'],
    queryFn: getAllProducts,
  });

  // Add Mutation
  const addMutation = useMutation<string, Error, ProductSubmitData>({
    mutationFn: async (newProductData) => {
      // Map form values to the Omit<Product, 'id'> structure expected by addProduct
      const productToAdd: Omit<Product, 'id'> = {
        name: newProductData.name,
        description: newProductData.description || "",
        category: newProductData.category,
        price: newProductData.price ? Number(newProductData.price) : undefined,
        imageUrl: newProductData.imageUrl || undefined,
        isCustomizable: newProductData.isCustomizable || false,
        capacity: newProductData.capacity || undefined,
        voltage: newProductData.voltage || undefined,
        current: newProductData.current || undefined,
        phase: newProductData.phase || undefined,
        fibers: newProductData.fibers ? Number(newProductData.fibers) : undefined,
        productType: newProductData.productType || undefined,
        // Reconstruct details, excluding specific fields managed separately
        details: {
           ...(newProductData.details || {}),
           stock_quantity: newProductData.stock_quantity ? Number(newProductData.stock_quantity) : undefined,
           // Add other potential detail fields if needed
        },
        parent_id: undefined, // Assuming parent_id is not handled in this form yet
        subCategory: undefined // Assuming subCategory is not handled directly
      };
      return addProduct(productToAdd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({ title: "نجاح", description: "تمت إضافة المنتج بنجاح." });
      setIsAddEditDialogOpen(false);
    },
    onError: (err) => {
      toast({ title: "خطأ", description: `فشل إضافة المنتج: ${err.message}`, variant: "destructive" });
    },
  });

  // Update Mutation
  const updateMutation = useMutation<void, Error, ProductSubmitData>({
    mutationFn: async (updatedProductData) => {
       if (!selectedProduct?.id) {
         throw new Error("Product ID is missing for update.");
       }
        // Map form values to Partial<Product> expected by updateProduct
       const productToUpdate: Partial<Product> = {
         name: updatedProductData.name,
         description: updatedProductData.description,
         category: updatedProductData.category,
         price: updatedProductData.price ? Number(updatedProductData.price) : undefined,
         imageUrl: updatedProductData.imageUrl,
         isCustomizable: updatedProductData.isCustomizable,
         capacity: updatedProductData.capacity,
         voltage: updatedProductData.voltage,
         current: updatedProductData.current,
         phase: updatedProductData.phase,
         fibers: updatedProductData.fibers ? Number(updatedProductData.fibers) : undefined,
         productType: updatedProductData.productType,
         details: {
           ...(selectedProduct.details || {}), // Start with existing details
           ...(updatedProductData.details || {}),
           stock_quantity: updatedProductData.stock_quantity ? Number(updatedProductData.stock_quantity) : undefined,
         }
         // parent_id, subCategory updates not handled here yet
       };
       // Filter out undefined values to avoid overwriting with undefined in Supabase
       Object.keys(productToUpdate).forEach(key => productToUpdate[key as keyof typeof productToUpdate] === undefined && delete productToUpdate[key as keyof typeof productToUpdate]);
       if (productToUpdate.details && Object.keys(productToUpdate.details).length === 0) {
          delete productToUpdate.details; // Don't send empty details object
       }

       return updateProduct(selectedProduct.id, productToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({ title: "نجاح", description: "تم تحديث المنتج بنجاح." });
      setIsAddEditDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      toast({ title: "خطأ", description: `فشل تحديث المنتج: ${err.message}`, variant: "destructive" });
    },
  });

  // Delete Mutation (No changes needed here)
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({ title: "نجاح", description: "تم حذف المنتج بنجاح." });
    },
    onError: (err) => {
      toast({ title: "خطأ", description: `فشل حذف المنتج: ${err.message}`, variant: "destructive" });
    },
  });

  // Filtered products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(product.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsAddEditDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsAddEditDialogOpen(true);
  }

  // Handle form submission
  const handleFormSubmit = async (values: FormSchemaValues) => {
     console.log("Form Values Submitted:", values);
    try {
      if (selectedProduct) {
        // Update existing product
        await updateMutation.mutateAsync(values);
      } else {
        // Add new product
        await addMutation.mutateAsync(values);
      }
    } catch (e) {
      // Errors are handled by mutation's onError callback
      console.error("Submit error caught in component:", e);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">خطأ في تحميل المنتجات: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة المنتجات</h1>

      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="relative flex-grow max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="بحث بالاسم، ID، الفئة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> إضافة منتج جديد
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المعرف (ID)</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs">{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{getCategoryName(product.category)}</TableCell>
                    <TableCell>{product.price ? `${product.price.toLocaleString()} د.ع` : 'غير محدد'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                هذا الإجراء سيعطل المنتج ({product.name}). لا يمكن التراجع عنه بسهولة.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(product.id)}
                                disabled={deleteMutation.isPending}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {deleteMutation.isPending ? 'جاري التعطيل...' : 'تعطيل المنتج'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    لا توجد منتجات تطابق البحث.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
       <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
         <DialogContent className="sm:max-w-[600px]">
           <DialogHeader>
             <DialogTitle>{selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
             <DialogDescription>
               {selectedProduct ? 'قم بتعديل تفاصيل المنتج أدناه.' : 'أدخل تفاصيل المنتج الجديد أدناه.'}
             </DialogDescription>
           </DialogHeader>
           <ProductForm
             key={selectedProduct?.id || 'new'}
             onSubmit={handleFormSubmit}
             initialData={selectedProduct}
             isLoading={addMutation.isPending || updateMutation.isPending}
            />
           <DialogFooter>
             <DialogClose asChild>
               <Button type="button" variant="outline">إلغاء</Button>
             </DialogClose>
             <Button type="submit" form="product-form" disabled={addMutation.isPending || updateMutation.isPending}>
                {selectedProduct ? (updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات') : (addMutation.isPending ? 'جاري الإضافة...' : 'إضافة منتج')}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </div>
  );
};

export default AdminProducts; 