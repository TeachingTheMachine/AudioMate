import { Volume2 } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Volume2 className="text-white text-xl w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">TTS API Testing Tool</h1>
            <p className="text-sm text-gray-600">Test and compare different Text-to-Speech APIs</p>
          </div>
        </div>
      </div>
    </header>
  );
}
