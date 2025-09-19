import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Gamepad2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-crimson to-crimson-dark rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-crimson to-crimson-light bg-clip-text text-transparent">
                Crimson Click Quest
              </h1>
              <p className="text-sm text-muted-foreground">Веб-кликер с красно-черным дизайном</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-crimson text-crimson">
              v1.0
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};