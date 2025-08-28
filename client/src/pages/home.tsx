import { Header } from "@/components/header";
import { TtsForm } from "@/components/tts-form";
import { RecentTests } from "@/components/recent-tests";
import { Footer } from "@/components/footer";
import designElementsImage from '../assets/images.png';

export default function Home() {
  return (
    <div className="min-h-screen font-inter relative overflow-hidden">
      {/* Full page background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: `url(${designElementsImage})` }}
      ></div>
      
      {/* Background color overlay */}
      <div className="fixed inset-0 bg-background/85"></div>
      
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <TtsForm />
        <RecentTests />
      </main>
      <Footer />
    </div>
  );
}
