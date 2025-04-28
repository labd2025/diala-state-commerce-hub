
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-diala-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">عن شركة ديالى العامة</h1>
              <p className="text-lg text-gray-700">
                تأسست شركة ديالى العامة عام 1974 كإحدى تشكيلات وزارة الصناعة والمعادن، وتعتبر من أكبر الشركات الصناعية في العراق المتخصصة في مجال الصناعات الكهربائية.
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-heading mb-6">نبذة عن الشركة</h2>
                <p className="text-gray-700 mb-4">
                  تمتلك شركة ديالى خبرة تزيد عن 40 عاماً في مجال تصنيع المحولات الكهربائية والمقاييس الكهربائية وانتاج المنتجات الالكترونية والمنزلية المختلفة.
                </p>
                <p className="text-gray-700 mb-4">
                  تتميز منتجات الشركة بجودتها العالية ومطابقتها للمواصفات العالمية، حيث تلبي احتياجات السوق المحلي وتصدر إلى الأسواق الإقليمية والعالمية.
                </p>
                <p className="text-gray-700">
                  تضم الشركة كوادر هندسية وفنية متخصصة وذات خبرة عالية في مجال الصناعات الكهربائية، وتتبع أحدث التقنيات والمعايير العالمية في خطوط الإنتاج.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/src/assets/categories/hero-bg.jpg" 
                  alt="شركة ديالى العامة" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-heading mb-12 text-center">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-t-diala-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 font-heading">الجودة</h3>
                  <p className="text-gray-700">
                    نلتزم بتقديم منتجات ذات جودة عالية تتوافق مع المعايير العالمية وتلبي احتياجات عملائنا بكفاءة واعتمادية.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-diala-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 font-heading">الابتكار</h3>
                  <p className="text-gray-700">
                    نسعى باستمرار لتطوير منتجاتنا وعملياتنا من خلال اعتماد أحدث التقنيات والممارسات الصناعية.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-diala-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 font-heading">الاستدامة</h3>
                  <p className="text-gray-700">
                    نؤمن بأهمية الحفاظ على البيئة ونعمل على تبني ممارسات صناعية صديقة للبيئة وفعالة في استهلاك الطاقة.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-diala-100 text-diala-600 rounded-full flex items-center justify-center text-3xl mb-6">
                    👁️
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-heading">رؤيتنا</h3>
                  <p className="text-gray-700">
                    أن نكون الشركة الرائدة في مجال الصناعات الكهربائية في المنطقة، ونسعى لتوسيع نطاق أعمالنا لنصل إلى الأسواق العالمية مع الحفاظ على أعلى معايير الجودة والابتكار.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-diala-100 text-diala-600 rounded-full flex items-center justify-center text-3xl mb-6">
                    🚀
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-heading">مهمتنا</h3>
                  <p className="text-gray-700">
                    تقديم منتجات كهربائية عالية الجودة بأسعار تنافسية للسوق المحلي والعالمي، والمساهمة في تطوير قطاع الصناعات الكهربائية في العراق من خلال الاستثمار في التكنولوجيا والموارد البشرية.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
