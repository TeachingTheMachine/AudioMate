import { Header } from "@/components/header";
import { TtsForm } from "@/components/tts-form";
import { RecentTests } from "@/components/recent-tests";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen font-inter relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-60 right-20 w-48 h-48 bg-gradient-to-bl from-secondary/30 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-tr from-accent/25 to-transparent rounded-full blur-xl"></div>
      </div>
      
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <TtsForm />
        <RecentTests />
      </main>
      <Footer />
    </div>
  );
}
