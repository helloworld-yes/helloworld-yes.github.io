import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Zap, Target, TrendingUp, Award, MousePointer, User, ShoppingCart, Settings as SettingsIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { Profile } from '@/components/Profile';
import { Shop } from '@/components/Shop';
import { Settings } from '@/components/Settings';

interface GameProgress {
  clicks: number;
  total_clicks: number;
  clicks_per_second: number;
  multiplier: number;
  prestige_level: number;
  ascension_level: number;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  icon: React.ReactNode;
}

const upgrades: Upgrade[] = [
  {
    id: 'auto-clicker',
    name: 'Авто-кликер',
    description: '+1 клик/сек',
    cost: 50,
    multiplier: 1,
    icon: <Target className="w-4 h-4" />
  },
  {
    id: 'power-boost',
    name: 'Усилитель мощности',
    description: 'x2 к кликам',
    cost: 200,
    multiplier: 2,
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'combo-master',
    name: 'Мастер комбо',
    description: '+5 кликов/сек',
    cost: 1000,
    multiplier: 5,
    icon: <TrendingUp className="w-4 h-4" />
  }
];

export const ClickerGame: React.FC = () => {
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    clicks: 0,
    total_clicks: 0,
    clicks_per_second: 0,
    multiplier: 1,
    prestige_level: 0,
    ascension_level: 0
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [user] = useState({ id: 'demo-user', email: 'demo@example.com' }); // Demo user for now
  const { toast } = useToast();

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crimson-clicker-progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setGameProgress({
          clicks: Number(progress.clicks) || 0,
          total_clicks: Number(progress.total_clicks) || 0,
          clicks_per_second: Number(progress.clicks_per_second) || 0,
          multiplier: Number(progress.multiplier) || 1,
          prestige_level: Number(progress.prestige_level) || 0,
          ascension_level: Number(progress.ascension_level) || 0
        });
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Auto-save to localStorage every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('crimson-clicker-progress', JSON.stringify(gameProgress));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameProgress]);

  // Auto-clicker effect
  useEffect(() => {
    if (gameProgress.clicks_per_second > 0) {
      const interval = setInterval(() => {
        setGameProgress(prev => ({
          ...prev,
          clicks: prev.clicks + prev.clicks_per_second,
          total_clicks: prev.total_clicks + prev.clicks_per_second
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameProgress.clicks_per_second]);

  const handleClick = useCallback(() => {
    const clickValue = gameProgress.multiplier;
    
    setGameProgress(prev => ({
      ...prev,
      clicks: prev.clicks + clickValue,
      total_clicks: prev.total_clicks + clickValue
    }));
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
  }, [gameProgress.multiplier]);

  const handleUpgrade = useCallback(async (upgrade: Upgrade) => {
    if (gameProgress.clicks < upgrade.cost) {
      toast({
        title: "Недостаточно кликов!",
        description: `Нужно ${upgrade.cost} кликов для покупки ${upgrade.name}`,
        variant: "destructive"
      });
      return;
    }

    const newProgress = {
      ...gameProgress,
      clicks: gameProgress.clicks - upgrade.cost,
      clicks_per_second: upgrade.id === 'auto-clicker' || upgrade.id === 'combo-master' 
        ? gameProgress.clicks_per_second + upgrade.multiplier 
        : gameProgress.clicks_per_second,
      multiplier: upgrade.id === 'power-boost' 
        ? gameProgress.multiplier * upgrade.multiplier 
        : gameProgress.multiplier
    };

    setGameProgress(newProgress);
    
    toast({
      title: "Улучшение куплено!",
      description: `${upgrade.name} активировано`,
      className: "bg-crimson text-white"
    });
  }, [gameProgress, toast]);


  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="game" className="w-full">
            
            {/* Navigation Tabs */}
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="game" className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Игра
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="shop" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Магазин
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Настройки
              </TabsTrigger>
            </TabsList>

            {/* Game Tab */}
            <TabsContent value="game" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Stats Panel */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-crimson" />
                      Статистика
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Всего кликов</span>
                          <span className="text-crimson font-mono">
                            {gameProgress.total_clicks.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Кликов/сек</span>
                          <span className="text-crimson-light font-mono">
                            {gameProgress.clicks_per_second}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Множитель</span>
                          <span className="text-crimson-glow font-mono">
                            x{gameProgress.multiplier}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Badge variant="outline" className="border-crimson text-crimson">
                          Уровень {gameProgress.prestige_level}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Upgrades */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Быстрые улучшения</h2>
                    <div className="space-y-3">
                      {upgrades.slice(0, 3).map((upgrade) => (
                        <Button
                          key={upgrade.id}
                          variant="upgrade"
                          className="w-full h-auto p-4 flex justify-between"
                          onClick={() => handleUpgrade(upgrade)}
                          disabled={gameProgress.clicks < upgrade.cost}
                        >
                          <div className="flex items-start gap-3">
                            {upgrade.icon}
                            <div className="text-left">
                              <div className="font-semibold">{upgrade.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {upgrade.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-crimson">
                              {upgrade.cost.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">кликов</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Main Game Area */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
                  
                  {/* Current Clicks Display */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-crimson font-mono mb-2">
                      {gameProgress.clicks.toLocaleString()}
                    </div>
                    <div className="text-xl text-muted-foreground">Кликов</div>
                  </div>

                  {/* Main Click Button */}
                  <div className="relative">
                    <Button
                      variant="clicker"
                      size="massive"
                      onClick={handleClick}
                      className={`
                        ${isAnimating ? 'animate-click-bounce' : ''}
                        animate-pulse-glow
                        shadow-[0_0_40px_hsl(var(--crimson-glow)/0.3)]
                        hover:shadow-[0_0_60px_hsl(var(--crimson-glow)/0.6)]
                        flex flex-col items-center gap-2
                      `}
                    >
                      <MousePointer className="w-8 h-8" />
                      <span>КЛИК</span>
                    </Button>
                    
                    {/* Click effect */}
                    {isAnimating && (
                      <div className="absolute inset-0 rounded-full bg-crimson-glow opacity-30 animate-ping"></div>
                    )}
                  </div>

                  {/* Progress to next level */}
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Прогресс уровня</span>
                      <span>{Math.floor((gameProgress.total_clicks % 1000) / 10)}%</span>
                    </div>
                    <Progress 
                      value={(gameProgress.total_clicks % 1000) / 10} 
                      className="h-3"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <Profile />
            </TabsContent>

            {/* Shop Tab */}
            <TabsContent value="shop" className="mt-0">
              <Shop />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0">
              <Settings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};