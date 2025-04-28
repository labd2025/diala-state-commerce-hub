
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import ProcessSection from "@/components/home/ProcessSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <FeaturedProducts />
        <ProcessSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
