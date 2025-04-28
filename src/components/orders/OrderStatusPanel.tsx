import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface OrderStatusPanelProps {
  order: any; // يمكن تحسين هذا باستخدام واجهة أكثر تحديدًا
}

export const OrderStatusPanel = ({ order }: OrderStatusPanelProps) => {
  // تحديد لون الحالة
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      review: "bg-yellow-100 text-yellow-800 border-yellow-200",
      verification: "bg-blue-100 text-blue-800 border-blue-200",
      approval: "bg-purple-100 text-purple-800 border-purple-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-diala-100 text-diala-800 border-diala-200",
    };
    return colors[order.current_status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // تحديد عنوان الحالة
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      review: "قيد المراجعة",
      verification: "قيد التدقيق",
      approval: "قيد الموافقة",
      approved: "تمت الموافقة على الطلب",
      completed: "تم اكتمال الطلب",
    };
    return labels[status] || "غير معروف";
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">حالة الطلب</h3>
          <p className="text-sm text-gray-500">رقم الطلب: {order.order_number}</p>
        </div>
        <Badge className={getStatusColor(order.current_status)}>
          {getStatusLabel(order.current_status)}
        </Badge>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-2">تفاصيل الطلب</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">السعر الإجمالي:</span>
            <span>{order.total_amount.toLocaleString()} د.ع</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">تاريخ الطلب:</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          {order.shipping_address && (
            <div className="flex justify-between">
              <span className="text-gray-500">عنوان الشحن:</span>
              <span className="text-left max-w-[250px]">{order.shipping_address}</span>
            </div>
          )}
          {order.phone_number && (
            <div className="flex justify-between">
              <span className="text-gray-500">رقم الهاتف:</span>
              <span>{order.phone_number}</span>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">سجل حالة الطلب</h4>
        <div className="space-y-4">
          {order.statusHistory && order.statusHistory.map((item: any, index: number) => (
            <div key={index} className="relative pb-4">
              {index !== order.statusHistory.length - 1 && (
                <div className="absolute right-[0.625rem] top-[1.75rem] bottom-0 w-0.5 bg-gray-200" />
              )}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-diala-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{getStatusLabel(item.status)}</p>
                  <time className="text-sm text-gray-500">{formatDate(item.created_at)}</time>
                  {item.note && (
                    <p className="mt-1 text-sm text-gray-700">{item.note}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 