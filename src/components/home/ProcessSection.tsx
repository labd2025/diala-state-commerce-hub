
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "استقبال طلب البيع",
    description: "استلام طلبات الشراء من العملاء والتحقق من بيانات العميل وتسجيل الطلب في النظام",
    icon: "📝"
  },
  {
    id: 2,
    title: "التأكد من توفر المنتج",
    description: "الاستعلام عن توفر المنتج في المخزون وتحديد الكميات المتاحة وإعداد عرض السعر للعميل",
    icon: "🔍"
  },
  {
    id: 3,
    title: "مراجعة وموافقة الإدارة",
    description: "مراجعة العرض من قبل إدارة المبيعات والتحقق من الأسعار والشروط والحصول على موافقة الإدارة المالية",
    icon: "✅"
  },
  {
    id: 4,
    title: "تأكيد العميل للعرض",
    description: "استلام تأكيد العميل على العرض وإصدار أمر البيع الرسمي وربط الطلب بالعمليات الداخلية",
    icon: "🤝"
  },
  {
    id: 5,
    title: "تجهيز المنتج وتسليمه",
    description: "تجهيز المنتج للتسليم وتنسيق عملية التسليم للعميل وإصدار الفاتورة النهائية",
    icon: "🚚"
  }
];

const ProcessSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">مراحل عملية البيع</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نعتمد على عملية منظمة من خمس مراحل لضمان تلبية احتياجات العملاء بأعلى معايير الجودة والكفاءة
          </p>
        </div>

        <div className="relative">
          {/* Process steps line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-diala-200 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.id} className="relative z-10">
                <Card className="h-full border-2 border-diala-100 hover:border-diala-400 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-diala-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                      <span>{step.icon}</span>
                    </div>
                    <div className="w-8 h-8 bg-diala-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                      {step.id}
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
