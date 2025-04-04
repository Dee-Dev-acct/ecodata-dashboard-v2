import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Impact from "@/components/Impact";
import Technology from "@/components/Technology";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Impact />
        <Technology />
        <Partners />
        <Testimonials />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
