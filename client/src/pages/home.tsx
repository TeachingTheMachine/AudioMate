import { Header } from "@/components/header";
import { TtsForm } from "@/components/tts-form";
import { RecentTests } from "@/components/recent-tests";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-inter">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <TtsForm />
        <RecentTests />
      </main>
      <Footer />
    </div>
  );
}
