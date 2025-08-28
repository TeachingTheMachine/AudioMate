import { Volume2, Radio } from "lucide-react";
import designElementsImage from '@assets/generated_images/TTS_app_design_elements_7f4c4c40.png';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border relative overflow-hidden">
      {/* Background graphic */}
      <div 
        className="absolute right-0 top-0 h-full w-96 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${designElementsImage})` }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-md">
              <Volume2 className="text-white w-7 h-7" />
            </div>
            <div className="p-2 bg-gradient-to-br from-secondary/50 to-accent/50 rounded-lg">
              <Radio className="text-primary w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TTS API Testing Tool
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Test and compare different Text-to-Speech APIs with high-quality audio generation
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
