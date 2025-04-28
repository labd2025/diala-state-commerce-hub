import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderStatus, OrderItem, OrderStatusHistory } from '@/types';
import { getAllOrders, updateOrderStatus } from '@/utils/orderHelpers';
import { useAuth } from "@/contexts/AuthContext"; // To get admin user ID
import { Eye, Edit2, Search } from 'lucide-react';

// Helper function to get badge variant based on status
const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pending':
      return 'outline';
    case 'processing':
      return 'default'; // Use default for active/processing
    case 'shipped':
      return 'secondary';
    case 'delivered':
      return 'secondary'; // Consider a success variant if available
    case 'cancelled':
      return 'destructive';
    case 'refunded':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Helper function to get status name in Arabic
const getStatusName = (status: OrderStatus): string => {
  const names: Record<OrderStatus, string> = {
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    refunded: 'مُرجع'
  };
  return names[status] || status;
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user: adminUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  // Fetch orders query
  const { data: orders = [], isLoading, error } = useQuery<Order[], Error>({
    queryKey: ['adminOrders'],
    queryFn: getAllOrders, // Fetches orders with items and history
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status, notes }: { orderId: string; status: OrderStatus; notes?: string }) => {
      if (!adminUser) throw new Error("Admin user not found");
      return updateOrderStatus(orderId, status, adminUser.id, notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      // Also invalidate specific order details if you have a separate query for that
      // queryClient.invalidateQueries({ queryKey: ['orderDetails', variables.orderId] });
      toast({ title: "نجاح", description: `تم تحديث حالة الطلب ${variables.orderId} إلى ${getStatusName(variables.status)}.` });
      setIsDetailModalOpen(false); // Close modal on success
    },
    onError: (err, variables) => {
      toast({ title: "خطأ", description: `فشل تحديث حالة الطلب ${variables.orderId}: ${err.message}`, variant: "destructive" });
    },
  });

  // Filtered orders
  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.contactPhone.includes(searchTerm) ||
    getStatusName(order.status).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedOrder && selectedStatus && selectedStatus !== selectedOrder.status) {
      updateStatusMutation.mutate({ orderId: selectedOrder.id, status: selectedStatus });
    }
  };

  if (!adminUser) {
     return <div className="p-4">خطأ: لم يتم العثور على مستخدم المسؤول.</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">خطأ في تحميل الطلبات: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة الطلبات</h1>

      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
         <div className="relative flex-grow max-w-xs">
           <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
           <Input
             placeholder="بحث بالمعرف، الهاتف، الحالة..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-8"
           />
         </div>
         {/* Add other filters or actions if needed */}
       </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم المرجعي</TableHead>
                <TableHead>معرف المستخدم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المبلغ الإجمالي</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.referenceNumber}</TableCell>
                    <TableCell className="font-mono text-xs">{order.userId}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{getStatusName(order.status)}</Badge>
                    </TableCell>
                    <TableCell>{order.totalAmount.toLocaleString()} د.ع</TableCell>
                    <TableCell>{format(order.createdAt, 'PPPpp', { locale: arSA })}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                        <Eye className="h-4 w-4 mr-1" /> تفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    لا توجد طلبات تطابق البحث.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Detail and Status Update Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
         <DialogContent className="sm:max-w-[700px]">
           <DialogHeader>
             <DialogTitle>تفاصيل الطلب: {selectedOrder?.referenceNumber}</DialogTitle>
             <DialogDescription>
               عرض تفاصيل الطلب وتحديث حالته.
             </DialogDescription>
           </DialogHeader>
           {selectedOrder && (
             <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-3">
                {/* Basic Order Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>معرف الطلب:</strong> <span className="font-mono text-xs">{selectedOrder.id}</span></div>
                  <div><strong>معرف المستخدم:</strong> <span className="font-mono text-xs">{selectedOrder.userId}</span></div>
                  <div><strong>تاريخ الإنشاء:</strong> {format(selectedOrder.createdAt, 'PPPpp', { locale: arSA })}</div>
                  <div><strong>المبلغ الإجمالي:</strong> {selectedOrder.totalAmount.toLocaleString()} د.ع</div>
                  <div><strong>عنوان الشحن:</strong> {selectedOrder.shippingAddress}</div>
                  <div><strong>هاتف الاتصال:</strong> {selectedOrder.contactPhone}</div>
                  <div><strong>طريقة الدفع:</strong> {selectedOrder.paymentMethod}</div>
                  <div><strong>ملاحظات العميل:</strong> {selectedOrder.notes || 'لا يوجد'}</div>
                </div>

               {/* Order Items */}
               <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">عناصر الطلب:</h4>
                  {selectedOrder.items.length > 0 ? (
                     <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead>معرف المنتج</TableHead>
                           <TableHead>الكمية</TableHead>
                           <TableHead>سعر الوحدة</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {selectedOrder.items.map(item => (
                           <TableRow key={item.id}>
                             <TableCell className="font-mono text-xs">{item.productId}</TableCell>
                             <TableCell>{item.quantity}</TableCell>
                             <TableCell>{item.unitPrice.toLocaleString()} د.ع</TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                  ) : (
                     <p className="text-sm text-gray-500">لا توجد عناصر في هذا الطلب.</p>
                  )}
               </div>

               {/* Status History */}
               <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">سجل الحالة:</h4>
                  {selectedOrder.statusHistory.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {selectedOrder.statusHistory.map(history => (
                        <li key={history.id} className="border-r-2 pr-2 border-gray-200">
                          <span className="font-medium">{getStatusName(history.status)}</span> - <span className="text-gray-500">{format(history.createdAt, 'Pp', { locale: arSA })}</span>
                          <p className="text-xs text-gray-600 pl-1">{history.notes} (بواسطة: {history.createdBy})</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                     <p className="text-sm text-gray-500">لا يوجد سجل لتغيير الحالة.</p>
                  )}
               </div>

                {/* Update Status Section */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">تحديث الحالة:</h4>
                  <div className="flex items-center gap-2">
                     <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus | '')}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="اختر الحالة الجديدة" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(getStatusName({} as OrderStatus)).map(statusKey => (
                            <SelectItem key={statusKey} value={statusKey}>{getStatusName(statusKey as OrderStatus)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                     <Button
                       onClick={handleStatusUpdate}
                       disabled={!selectedStatus || selectedStatus === selectedOrder.status || updateStatusMutation.isPending}
                     >
                       {updateStatusMutation.isPending ? 'جاري التحديث...' : 'تحديث الحالة'}
                     </Button>
                  </div>
                </div>

             </div>
           )}
           <DialogFooter>
             <DialogClose asChild>
               <Button type="button" variant="outline">إغلاق</Button>
             </DialogClose>
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </div>
  );
};

export default AdminOrders; 