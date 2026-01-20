import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display selection:bg-amber-200/30">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}