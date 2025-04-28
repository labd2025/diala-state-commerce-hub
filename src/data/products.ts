import { Product, ProductCategory } from "@/types";

// ------- محولات التوزيع (Distribution Transformers) -------

// 1. محولات توزيع خفض بنسبة تحويل (11/0.416) KV
const distributionTransformers11kv: Product[] = [
  {
    id: "dt-11kv",
    name: "محولات خفض بنسبة تحويل (11/0.416) KV",
    description: "محولات خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN)",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    subCategory: "محولات خفض 11/0.416",
    details: {
      "نسبة التحويل": "11/0.416 KV",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN"
    },
    parent_id: null
  },
  // محولات 11kv - القدرات المختلفة
  {
    id: "dt-11kv-100",
    name: "محولة توزيع 100 KVA",
    description: "محولة خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 100 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 5000,
    capacity: "100 KVA",
    voltage: "11/0.416 KV",
    details: {
      "القدرة": "100 كيلو فولت أمبير",
      "نسبة التحويل": "11/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-11kv",
    productType: "11_0416_kv"
  },
  {
    id: "dt-11kv-250",
    name: "محولة توزيع 250 KVA",
    description: "محولة خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 250 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 8000,
    capacity: "250 KVA",
    voltage: "11/0.416 KV",
    details: {
      "القدرة": "250 كيلو فولت أمبير",
      "نسبة التحويل": "11/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-11kv",
    productType: "11_0416_kv"
  },
  {
    id: "dt-11kv-400",
    name: "محولة توزيع 400 KVA",
    description: "محولة خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 400 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 12000,
    capacity: "400 KVA",
    voltage: "11/0.416 KV",
    details: {
      "القدرة": "400 كيلو فولت أمبير",
      "نسبة التحويل": "11/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-11kv",
    productType: "11_0416_kv"
  },
  {
    id: "dt-11kv-630",
    name: "محولة توزيع 630 KVA",
    description: "محولة خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 630 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 18000,
    capacity: "630 KVA",
    voltage: "11/0.416 KV",
    details: {
      "القدرة": "630 كيلو فولت أمبير",
      "نسبة التحويل": "11/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-11kv",
    productType: "11_0416_kv"
  },
  {
    id: "dt-11kv-1000",
    name: "محولة توزيع 1000 KVA",
    description: "محولة خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 1000 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 25000,
    capacity: "1000 KVA",
    voltage: "11/0.416 KV",
    details: {
      "القدرة": "1000 كيلو فولت أمبير",
      "نسبة التحويل": "11/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-11kv",
    productType: "11_0416_kv"
  },
  {
    id: "dt-11kv-1600",
    name: "محولة توزيع 1600 KVA",
    description: "محولة خفض بنسبة تحويل (11/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 1600 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 35000,
    capacity: "1600 KVA",
    voltage: "11/0.416 KV",
    details: {
      "القدرة": "1600 كيلو فولت أمبير",
      "نسبة التحويل": "11/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-11kv",
    productType: "11_0416_kv"
  }
];

// 2. محولات توزيع خفض بنسبة تحويل (33/0.416) KV
const distributionTransformers33kv: Product[] = [
  {
    id: "dt-33kv",
    name: "محولات خفض بنسبة تحويل (33/0.416) KV",
    description: "محولات خفض بنسبة تحويل (33/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN)",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    subCategory: "محولات خفض 33/0.416",
    details: {
      "نسبة التحويل": "33/0.416 KV",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN"
    },
    parent_id: null
  },
  // محولات 33kv - القدرات المختلفة
  {
    id: "dt-33kv-100",
    name: "محولة توزيع 100 KVA",
    description: "محولة خفض بنسبة تحويل (33/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 100 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 6000,
    capacity: "100 KVA",
    voltage: "33/0.416 KV",
    details: {
      "القدرة": "100 كيلو فولت أمبير",
      "نسبة التحويل": "33/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-33kv",
    productType: "33_0416_kv"
  },
  {
    id: "dt-33kv-250",
    name: "محولة توزيع 250 KVA",
    description: "محولة خفض بنسبة تحويل (33/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 250 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 9000,
    capacity: "250 KVA",
    voltage: "33/0.416 KV",
    details: {
      "القدرة": "250 كيلو فولت أمبير",
      "نسبة التحويل": "33/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-33kv",
    productType: "33_0416_kv"
  },
  {
    id: "dt-33kv-400",
    name: "محولة توزيع 400 KVA",
    description: "محولة خفض بنسبة تحويل (33/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 400 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 14000,
    capacity: "400 KVA",
    voltage: "33/0.416 KV",
    details: {
      "القدرة": "400 كيلو فولت أمبير",
      "نسبة التحويل": "33/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-33kv",
    productType: "33_0416_kv"
  },
  {
    id: "dt-33kv-630",
    name: "محولة توزيع 630 KVA",
    description: "محولة خفض بنسبة تحويل (33/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 630 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 20000,
    capacity: "630 KVA",
    voltage: "33/0.416 KV",
    details: {
      "القدرة": "630 كيلو فولت أمبير",
      "نسبة التحويل": "33/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-33kv",
    productType: "33_0416_kv"
  },
  {
    id: "dt-33kv-1000",
    name: "محولة توزيع 1000 KVA",
    description: "محولة خفض بنسبة تحويل (33/0.416) KV بمجموعة توصيل Dyn11 وتعمل بالتبريد الطبيعي (ONAN) بقدرة 1000 KVA",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: 28000,
    capacity: "1000 KVA",
    voltage: "33/0.416 KV",
    details: {
      "القدرة": "1000 كيلو فولت أمبير",
      "نسبة التحويل": "33/0.416 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "dt-33kv",
    productType: "33_0416_kv"
  }
];

// 3. محولات بمواصفات خاصة
const customDistributionTransformers: Product[] = [
  {
    id: "dt-custom",
    name: "محولات بمواصفات خاصة",
    description: "تصميم محولات توزيع بمواصفات خاصة حسب طلب العميل (السعة، الادخال، الإخراج)",
    category: "distribution_transformers",
    imageUrl: "/src/assets/categories/dest tr.png",
    price: null,
    details: {
      "المواصفات": "حسب طلب العميل"
    },
    isCustomizable: true,
    parent_id: null,
    productType: "custom"
  }
];

// تجميع كل محولات التوزيع
const allDistributionTransformers: Product[] = [
  ...distributionTransformers11kv,
  ...distributionTransformers33kv,
  ...customDistributionTransformers
];

// ------- محولات القدرة (Power Transformers) -------

// 1. محولات قدرة ذات التبريد الطبيعي (ONAN) بنسبة تحويل (33/11.5) KV
const powerTransformersOnan: Product[] = [
  {
    id: "pt-onan",
    name: "محولات قدرة ذات التبريد الطبيعي (ONAN)",
    description: "محولات قدرة ذات التبريد الطبيعي (ONAN) وبمجموعة توصيل Dyn11 وبنسبة تحويل (33/11.5) KV",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    subCategory: "محولات قدرة ONAN",
    details: {
      "نسبة التحويل": "33/11.5 KV",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN"
    },
    parent_id: null
  },
  // محولات قدرة ONAN - القدرات المختلفة
  {
    id: "pt-onan-5",
    name: "محولة قدرة 5 MVA",
    description: "محولة قدرة ذات التبريد الطبيعي (ONAN) وبمجموعة توصيل Dyn11 وبنسبة تحويل (33/11.5) KV بقدرة 5 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 200000,
    capacity: "5 MVA",
    voltage: "33/11.5 KV",
    details: {
      "القدرة": "5 ميجا فولت أمبير",
      "نسبة التحويل": "33/11.5 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onan",
    productType: "33_115_kv"
  },
  {
    id: "pt-onan-10",
    name: "محولة قدرة 10 MVA",
    description: "محولة قدرة ذات التبريد الطبيعي (ONAN) وبمجموعة توصيل Dyn11 وبنسبة تحويل (33/11.5) KV بقدرة 10 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 350000,
    capacity: "10 MVA",
    voltage: "33/11.5 KV",
    details: {
      "القدرة": "10 ميجا فولت أمبير",
      "نسبة التحويل": "33/11.5 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onan",
    productType: "33_115_kv"
  },
  {
    id: "pt-onan-16",
    name: "محولة قدرة 16 MVA",
    description: "محولة قدرة ذات التبريد الطبيعي (ONAN) وبمجموعة توصيل Dyn11 وبنسبة تحويل (33/11.5) KV بقدرة 16 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 500000,
    capacity: "16 MVA",
    voltage: "33/11.5 KV",
    details: {
      "القدرة": "16 ميجا فولت أمبير",
      "نسبة التحويل": "33/11.5 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onan",
    productType: "33_115_kv"
  },
  {
    id: "pt-onan-31.5",
    name: "محولة قدرة 31.5 MVA",
    description: "محولة قدرة ذات التبريد الطبيعي (ONAN) وبمجموعة توصيل Dyn11 وبنسبة تحويل (33/11.5) KV بقدرة 31.5 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 800000,
    capacity: "31.5 MVA",
    voltage: "33/11.5 KV",
    details: {
      "القدرة": "31.5 ميجا فولت أمبير",
      "نسبة التحويل": "33/11.5 كيلو فولت",
      "مجموعة التوصيل": "Dyn11",
      "نوع التبريد": "ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onan",
    productType: "33_115_kv"
  }
];

// 2. محولات قدرة ذات التبريد الطبيعي والقسري (ONAF & ONAN) بسعة 63 MVA
const powerTransformersOnafOnan: Product[] = [
  {
    id: "pt-onaf-onan",
    name: "محولات قدرة ذات التبريد الطبيعي والقسري (ONAF & ONAN)",
    description: "محولات قدرة ذات التبريد الطبيعي والقسري (ONAF & ONAN) بسعة 63 MVA وبمجاميع توصيل مختلفة",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    subCategory: "محولات قدرة ONAF & ONAN",
    details: {
      "القدرة": "63 MVA",
      "نوع التبريد": "ONAF & ONAN"
    },
    parent_id: null
  },
  // محولات قدرة ONAF & ONAN - نسب التحويل المختلفة
  {
    id: "pt-onaf-onan-132",
    name: "محولة قدرة 63 MVA - 132 KV",
    description: "محولة قدرة ذات التبريد الطبيعي والقسري (ONAF & ONAN) بنسبة تحويل 132 KV بقدرة 63 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 1500000,
    capacity: "63 MVA",
    voltage: "132 KV",
    details: {
      "القدرة": "63 ميجا فولت أمبير",
      "الجهد": "132 كيلو فولت",
      "نوع التبريد": "ONAF & ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onaf-onan",
    productType: "132_33_115_kv"
  },
  {
    id: "pt-onaf-onan-33",
    name: "محولة قدرة 63 MVA - 33 KV",
    description: "محولة قدرة ذات التبريد الطبيعي والقسري (ONAF & ONAN) بنسبة تحويل 33 KV بقدرة 63 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 1200000,
    capacity: "63 MVA",
    voltage: "33 KV",
    details: {
      "القدرة": "63 ميجا فولت أمبير",
      "الجهد": "33 كيلو فولت",
      "نوع التبريد": "ONAF & ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onaf-onan",
    productType: "132_33_115_kv"
  },
  {
    id: "pt-onaf-onan-11.5",
    name: "محولة قدرة 63 MVA - 11.5 KV",
    description: "محولة قدرة ذات التبريد الطبيعي والقسري (ONAF & ONAN) بنسبة تحويل 11.5 KV بقدرة 63 MVA",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: 1000000,
    capacity: "63 MVA",
    voltage: "11.5 KV",
    details: {
      "القدرة": "63 ميجا فولت أمبير",
      "الجهد": "11.5 كيلو فولت",
      "نوع التبريد": "ONAF & ONAN",
      "التردد": "50 هرتز"
    },
    parent_id: "pt-onaf-onan",
    productType: "132_33_115_kv"
  }
];

// 3. محولات قدرة بمواصفات خاصة
const customPowerTransformers: Product[] = [
  {
    id: "pt-custom",
    name: "محولات قدرة بمواصفات خاصة",
    description: "تصميم محولات قدرة بمواصفات خاصة حسب طلب العميل (السعة، الادخال، الإخراج)",
    category: "power_transformers",
    imageUrl: "/src/assets/categories/power tr.png",
    price: null,
    details: {
      "المواصفات": "حسب طلب العميل"
    },
    isCustomizable: true,
    parent_id: null,
    productType: "custom"
  }
];

// تجميع كل محولات القدرة
const allPowerTransformers: Product[] = [
  ...powerTransformersOnan,
  ...powerTransformersOnafOnan,
  ...customPowerTransformers
];

// ------- المقاييس (Meters) -------

// 1. المقاييس الكهربائية
const electricalMeters: Product[] = [
  {
    id: "meter-electrical",
    name: "المقاييس الكهربائية",
    description: "مقاييس كهربائية بأحادية وثلاثية الأطوار",
    category: "meters",
    imageUrl: "/src/assets/categories/electrical meter.png",
    subCategory: "مقاييس كهربائية",
    details: {
      "النوع": "كهربائي",
      "التردد": "50 هرتز"
    },
    parent_id: null
  },
  // المقاييس الكهربائية - الأنواع المختلفة
  {
    id: "meter-electrical-1phase",
    name: "مقياس طور واحد",
    description: "مقياس كهربائي طور واحد بفولتية 240 فولت وبتيار (10-40) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electrical meter.png",
    price: 150,
    voltage: "240 فولت",
    current: "10-40 أمبير",
    phase: "أحادي",
    details: {
      "الفولتية": "240 فولت",
      "التيار": "10-40 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "1"
    },
    parent_id: "meter-electrical",
    productType: "electrical"
  },
  {
    id: "meter-electrical-1phase-high",
    name: "مقياس طور واحد بتيار عالي",
    description: "مقياس كهربائي طور واحد بفولتية 240 فولت وبتيار (20-80) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electrical meter.png",
    price: 180,
    voltage: "240 فولت",
    current: "20-80 أمبير",
    phase: "أحادي",
    details: {
      "الفولتية": "240 فولت",
      "التيار": "20-80 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "1"
    },
    parent_id: "meter-electrical",
    productType: "electrical"
  },
  {
    id: "meter-electrical-3phase",
    name: "مقياس ثلاثة أطوار",
    description: "مقياس كهربائي ثلاثة أطوار بفولتية 3*416/240 فولت وبتيار (20-60) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electrical meter.png",
    price: 250,
    voltage: "3*416/240 فولت",
    current: "20-60 أمبير",
    phase: "ثلاثي",
    details: {
      "الفولتية": "3*416/240 فولت",
      "التيار": "20-60 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "3"
    },
    parent_id: "meter-electrical",
    productType: "electrical"
  }
];

// 2. المقاييس الإلكترونية
const electronicMeters: Product[] = [
  {
    id: "meter-electronic",
    name: "المقاييس الإلكترونية",
    description: "مقاييس إلكترونية أحادية وثلاثية الأطوار",
    category: "meters",
    imageUrl: "/src/assets/categories/electronic meter.png",
    subCategory: "مقاييس إلكترونية",
    details: {
      "النوع": "إلكتروني",
      "التردد": "50 هرتز"
    },
    parent_id: null
  },
  // المقاييس الإلكترونية - الأنواع المختلفة
  {
    id: "meter-electronic-1phase",
    name: "مقياس إلكتروني طور واحد",
    description: "مقياس إلكتروني طور واحد بفولتية 240 فولت وبتيار (10-40) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electronic meter.png",
    price: 180,
    voltage: "240 فولت",
    current: "10-40 أمبير",
    phase: "أحادي",
    details: {
      "الفولتية": "240 فولت",
      "التيار": "10-40 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "1"
    },
    parent_id: "meter-electronic",
    productType: "electronic"
  },
  {
    id: "meter-electronic-3phase-10-60",
    name: "مقياس إلكتروني ثلاثة أطوار",
    description: "مقياس إلكتروني ثلاثة أطوار بفولتية 240V×3 وبتيار (10-60) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electronic meter.png",
    price: 280,
    voltage: "240V×3",
    current: "10-60 أمبير",
    phase: "ثلاثي",
    details: {
      "الفولتية": "240V×3",
      "التيار": "10-60 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "3"
    },
    parent_id: "meter-electronic",
    productType: "electronic"
  },
  {
    id: "meter-electronic-3phase-30-90",
    name: "مقياس إلكتروني ثلاثة أطوار تيار متوسط",
    description: "مقياس إلكتروني ثلاثة أطوار بفولتية 240V×3 وبتيار (30-90) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electronic meter.png",
    price: 320,
    voltage: "240V×3",
    current: "30-90 أمبير",
    phase: "ثلاثي",
    details: {
      "الفولتية": "240V×3",
      "التيار": "30-90 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "3"
    },
    parent_id: "meter-electronic",
    productType: "electronic"
  },
  {
    id: "meter-electronic-3phase-50-150",
    name: "مقياس إلكتروني ثلاثة أطوار تيار عالي",
    description: "مقياس إلكتروني ثلاثة أطوار بفولتية 240V×3 وبتيار (50-150) أمبير وبتردد 50 هرتز",
    category: "meters",
    imageUrl: "/src/assets/categories/electronic meter.png",
    price: 380,
    voltage: "240V×3",
    current: "50-150 أمبير",
    phase: "ثلاثي",
    details: {
      "الفولتية": "240V×3",
      "التيار": "50-150 أمبير",
      "التردد": "50 هرتز",
      "عدد الأطوار": "3"
    },
    parent_id: "meter-electronic",
    productType: "electronic"
  }
];

// 3. المقاييس الذكية
const smartMeters: Product[] = [
  {
    id: "meter-smart",
    name: "المقاييس الذكية",
    description: "مقاييس ذكية مختلفة الأنواع",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    subCategory: "مقاييس ذكية",
    details: {
      "النوع": "ذكي"
    },
    parent_id: null
  },
  // المقاييس الذكية - الأنواع المختلفة
  {
    id: "meter-smart-1phase",
    name: "مقياس ذكي أحادي الطور",
    description: "مقياس ذكي أحادي الطور 5(100) أمبير",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    price: 280,
    current: "5(100) أمبير",
    phase: "أحادي",
    details: {
      "التيار": "5(100) أمبير",
      "عدد الأطوار": "1",
      "الميزات": "مراقبة ذكية"
    },
    parent_id: "meter-smart",
    productType: "smart"
  },
  {
    id: "meter-smart-3phase",
    name: "مقياس ذكي ثلاثي الأطوار",
    description: "مقياس ذكي ثلاثي الأطوار 5(100) أمبير",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    price: 350,
    current: "5(100) أمبير",
    phase: "ثلاثي",
    details: {
      "التيار": "5(100) أمبير",
      "عدد الأطوار": "3",
      "الميزات": "مراقبة ذكية"
    },
    parent_id: "meter-smart",
    productType: "smart"
  },
  {
    id: "meter-smart-prepaid-1phase",
    name: "مقياس ذكي مسبق الدفع أحادي الطور",
    description: "مقياس ذكي مسبق الدفع أحادي الطور 5(100) أمبير",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    price: 320,
    current: "5(100) أمبير",
    phase: "أحادي",
    details: {
      "التيار": "5(100) أمبير",
      "عدد الأطوار": "1",
      "الميزات": "مسبق الدفع، مراقبة ذكية"
    },
    parent_id: "meter-smart",
    productType: "smart"
  },
  {
    id: "meter-smart-prepaid-3phase",
    name: "مقياس ذكي مسبق الدفع ثلاثي الأطوار",
    description: "مقياس ذكي مسبق الدفع ثلاثي الأطوار 5(100) أمبير",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    price: 400,
    current: "5(100) أمبير",
    phase: "ثلاثي",
    details: {
      "التيار": "5(100) أمبير",
      "عدد الأطوار": "3",
      "الميزات": "مسبق الدفع، مراقبة ذكية"
    },
    parent_id: "meter-smart",
    productType: "smart"
  },
  {
    id: "meter-smart-industrial-ct",
    name: "مقياس ذكي صناعي CT ثلاثي الأطوار",
    description: "مقياس ذكي صناعي CT ثلاثي الأطوار للاستخدامات الصناعية",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    price: 550,
    phase: "ثلاثي",
    details: {
      "النوع": "صناعي CT",
      "عدد الأطوار": "3",
      "الميزات": "مراقبة ذكية، مناسب للاستخدامات الصناعية"
    },
    parent_id: "meter-smart",
    productType: "smart"
  },
  {
    id: "meter-smart-industrial-ct-vt",
    name: "مقياس ذكي صناعي CT/VT ثلاثي الأطوار",
    description: "مقياس ذكي صناعي CT/VT ثلاثي الأطوار للاستخدامات الصناعية المتخصصة",
    category: "meters",
    imageUrl: "/src/assets/categories/smart meter.png",
    price: 700,
    phase: "ثلاثي",
    details: {
      "النوع": "صناعي CT/VT",
      "عدد الأطوار": "3",
      "الميزات": "مراقبة ذكية، مناسب للاستخدامات الصناعية المتخصصة"
    },
    parent_id: "meter-smart",
    productType: "smart"
  }
];

// تجميع كل المقاييس
const allMeters: Product[] = [
  ...electricalMeters,
  ...electronicMeters,
  ...smartMeters
];

// ------- القابلوات الضوئية (Fiber Cables) -------

// 1. القابلوات الضوئية المسلحة
const armoredFiberCables: Product[] = [
  {
    id: "cable-armored",
    name: "القابلوات الضوئية المسلحة",
    description: "قابلوات ضوئية مسلحة من الجيل الجديد (ITU-TG-652D)",
    category: "fiber_cables",
    imageUrl: "/src/assets/categories/cables.png",
    subCategory: "قابلوات مسلحة",
    details: {
      "النوع": "مسلح",
      "المواصفات": "ITU-TG-652D",
      "الجيل": "الجديد"
    },
    parent_id: null
  },
  // القابلوات الضوئية المسلحة - الأنواع المختلفة
  {
    id: "cable-armored-8",
    name: "قابلو ضوئي مسلح 8 شعيرات",
    description: "قابلو ضوئي مسلح ذو 8 شعيرات من الجيل الجديد (ITU-TG-652D)",
    category: "fiber_cables",
    imageUrl: "/src/assets/categories/cables.png",
    price: 500,
    fibers: 8,
    details: {
      "النوع": "مسلح",
      "عدد الشعيرات": "8 شعيرة",
      "الطول": "500 متر",
      "المواصفات": "ITU-TG-652D"
    },
    parent_id: "cable-armored",
    productType: "armored"
  },
  {
    id: "cable-armored-12",
    name: "قابلو ضوئي مسلح 12 شعيرة",
    description: "قابلو ضوئي مسلح ذو 12 شعيرة من الجيل الجديد (ITU-TG-652D)",
    category: "fiber_cables",
    imageUrl: "/src/assets/categories/cables.png",
    price: 620,
    fibers: 12,
    details: {
      "النوع": "مسلح",
      "عدد الشعيرات": "12 شعيرة",
      "الطول": "500 متر",
      "المواصفات": "ITU-TG-652D"
    },
    parent_id: "cable-armored",
    productType: "armored"
  },
  {
    id: "cable-armored-24",
    name: "قابلو ضوئي مسلح 24 شعيرة",
    description: "قابلو ضوئي مسلح ذو 24 شعيرة من الجيل الجديد (ITU-TG-652D)",
    category: "fiber_cables",
    imageUrl: "/src/assets/categories/cables.png",
    price: 750,
    fibers: 24,
    details: {
      "النوع": "مسلح",
      "عدد الشعيرات": "24 شعيرة",
      "الطول": "500 متر",
      "المواصفات": "ITU-TG-652D"
    },
    parent_id: "cable-armored",
    productType: "armored"
  },
  {
    id: "cable-armored-48",
    name: "قابلو ضوئي مسلح 48 شعيرة",
    description: "قابلو ضوئي مسلح ذو 48 شعيرة من الجيل الجديد (ITU-TG-652D)",
    category: "fiber_cables",
    imageUrl: "/src/assets/categories/cables.png",
    price: 950,
    fibers: 48,
    details: {
      "النوع": "مسلح",
      "عدد الشعيرات": "48 شعيرة",
      "الطول": "500 متر",
      "المواصفات": "ITU-TG-652D"
    },
    parent_id: "cable-armored",
    productType: "armored"
  }
];

// 2. القابلوات الضوئية بمواصفات خاصة
const customFiberCables: Product[] = [
  {
    id: "cable-custom",
    name: "قابلوات ضوئية بمواصفات خاصة",
    description: "قابلوات ضوئية بمواصفات خاصة يمكن تحديد عدد الشعيرات والنوع (مسلح أو غير مسلح)",
    category: "fiber_cables",
    imageUrl: "/src/assets/categories/cables.png",
    price: null,
    details: {
      "المواصفات": "حسب طلب العميل"
    },
    isCustomizable: true,
    parent_id: null,
    productType: "custom"
  }
];

// تجميع كل القابلوات الضوئية
const allFiberCables: Product[] = [
  ...armoredFiberCables,
  ...customFiberCables
];

// تجميع كل المنتجات
export const products: Product[] = [
  ...allDistributionTransformers,
  ...allPowerTransformers,
  ...allMeters,
  ...allFiberCables
];

/**
 * الحصول على فئات المنتجات
 */
export const getAllCategories = (): ProductCategory[] => {
  return ["distribution_transformers", "power_transformers", "meters", "fiber_cables"];
};

/**
 * الحصول على اسم الفئة بالعربية
 */
export const getCategoryName = (category: ProductCategory): string => {
  const categoryNames: Record<ProductCategory, string> = {
    distribution_transformers: "محولات التوزيع",
    power_transformers: "محولات القدرة",
    meters: "المقاييس",
    fiber_cables: "القابلوات الضوئية",
    irons: "المكواة البخاري"
  };
  
  return categoryNames[category] || category;
};

/**
 * الحصول على منتجات فئة معينة
 * لعرض العناصر الرئيسية (الأصناف) فقط
 */
export const getCategoryProducts = (category: ProductCategory): Product[] => {
  // فلترة المنتجات حسب الفئة والحصول على المنتجات الرئيسية فقط (parent_id = null)
  return products.filter(product => 
    product.category === category && 
    product.parent_id === null
  );
};

/**
 * الحصول على المنتج بواسطة المعرف
 */
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

/**
 * الحصول على المنتجات الفرعية لمنتج معين
 */
export const getChildProducts = (parentId: string): Product[] => {
  return products.filter(product => product.parent_id === parentId);
};

/**
 * الحصول على المنتجات ذات الصلة
 * (منتجات من نفس الفئة ولكن ليست فرعية للمنتج الحالي)
 */
export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => 
      p.category === product.category && 
      p.id !== productId && 
      p.parent_id !== productId &&
      p.id !== product.parent_id
    )
    .slice(0, limit);
};
