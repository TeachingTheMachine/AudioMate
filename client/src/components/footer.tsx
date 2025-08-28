import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border mt-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>© 2024 TTS Testing Tool</span>
            <a 
              href="#" 
              className="hover:text-gray-900 transition-colors duration-200"
              data-testid="link-documentation"
            >
              Documentation
            </a>
            <a 
              href="#" 
              className="hover:text-gray-900 transition-colors duration-200"
              data-testid="link-api-status"
            >
              API Status
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
