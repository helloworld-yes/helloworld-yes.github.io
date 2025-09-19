import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Zap, Target, TrendingUp, Crown, Sparkles, Rocket } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  icon: React.ReactNode;
  category: 'basic' | 'advanced' | 'premium';
  owned: number;
  maxOwned?: number;
}

const shopItems: ShopItem[] = [
  // Basic Upgrades
  {
    id: 'auto-clicker',
    name: 'Авто-кликер',
    description: 'Автоматически кликает за вас',
    cost: 50,
    effect: '+1 клик/сек',
    icon: <Target className="w-5 h-5" />,
    category: 'basic',
    owned: 0
  },
  {
    id: 'power-boost',
    name: 'Усилитель мощности',
    description: 'Увеличивает силу каждого клика',
    cost: 200,
    effect: 'x2 к кликам',
    icon: <Zap className="w-5 h-5" />,
    category: 'basic',
    owned: 0,
    maxOwned: 10
  },
  {
    id: 'combo-master',
    name: 'Мастер комбо',
    description: 'Мощный автокликер',
    cost: 1000,
    effect: '+5 кликов/сек',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'basic',
    owned: 0
  },
  
  // Advanced Upgrades
  {
    id: 'turbo-engine',
    name: 'Турбо двигатель',
    description: 'Супер быстрый автокликер',
    cost: 5000,
    effect: '+25 кликов/сек',
    icon: <Rocket className="w-5 h-5" />,
    category: 'advanced',
    owned: 0
  },
  {
    id: 'mega-multiplier',
    name: 'Мега множитель',
    description: 'Огромное увеличение силы кликов',
    cost: 10000,
    effect: 'x5 к кликам',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'advanced',
    owned: 0,
    maxOwned: 5
  },
  
  // Premium Upgrades
  {
    id: 'golden-clicker',
    name: 'Золотой кликер',
    description: 'Элитное улучшение для профессионалов',
    cost: 50000,
    effect: '+100 кликов/сек',
    icon: <Crown className="w-5 h-5" />,
    category: 'premium',
    owned: 0,
    maxOwned: 1
  }
];

export const Shop: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>(shopItems);
  const [userClicks, setUserClicks] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'advanced' | 'premium'>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load user clicks and owned items
    const savedProgress = localStorage.getItem('crimson-clicker-progress');
    const savedShop = localStorage.getItem('crimson-clicker-shop');
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setUserClicks(progress.clicks || 0);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
    
    if (savedShop) {
      try {
        const shopData = JSON.parse(savedShop);
        setItems(prev => prev.map(item => ({
          ...item,
          owned: shopData[item.id]?.owned || 0
        })));
      } catch (error) {
        console.error('Error loading shop data:', error);
      }
    }
  }, []);

  const saveShopData = (updatedItems: ShopItem[]) => {
    const shopData = updatedItems.reduce((acc, item) => {
      acc[item.id] = { owned: item.owned };
      return acc;
    }, {} as Record<string, { owned: number }>);
    
    localStorage.setItem('crimson-clicker-shop', JSON.stringify(shopData));
  };

  const buyItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (userClicks < getItemCost(item)) {
      toast({
        title: "Недостаточно кликов!",
        description: `Нужно ${getItemCost(item).toLocaleString()} кликов для покупки ${item.name}`,
        variant: "destructive"
      });
      return;
    }

    if (item.maxOwned && item.owned >= item.maxOwned) {
      toast({
        title: "Максимум достигнут!",
        description: `Вы уже купили максимальное количество ${item.name}`,
        variant: "destructive"
      });
      return;
    }

    const newClicks = userClicks - getItemCost(item);
    const updatedItems = items.map(i => 
      i.id === itemId ? { ...i, owned: i.owned + 1 } : i
    );

    setUserClicks(newClicks);
    setItems(updatedItems);
    
    // Update localStorage
    const savedProgress = localStorage.getItem('crimson-clicker-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        progress.clicks = newClicks;
        localStorage.setItem('crimson-clicker-progress', JSON.stringify(progress));
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
    
    saveShopData(updatedItems);

    toast({
      title: "Покупка совершена!",
      description: `${item.name} добавлен в ваш арсенал`,
      className: "bg-crimson text-white"
    });
  };

  const getItemCost = (item: ShopItem) => {
    // Increase cost based on owned items
    return Math.floor(item.cost * Math.pow(1.5, item.owned));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'premium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-crimson flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Магазин улучшений
            </h1>
            <p className="text-muted-foreground">Покупайте улучшения для увеличения силы ваших кликов</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-crimson font-mono">
              {userClicks.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Кликов в наличии</div>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'basic', 'advanced', 'premium'] as const).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-crimson hover:bg-crimson-dark" : ""}
            >
              {category === 'all' ? 'Все' : 
               category === 'basic' ? 'Базовые' :
               category === 'advanced' ? 'Продвинутые' : 'Премиум'}
            </Button>
          ))}
        </div>
      </Card>

      {/* Shop Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const cost = getItemCost(item);
          const canAfford = userClicks >= cost;
          const maxReached = item.maxOwned && item.owned >= item.maxOwned;
          
          return (
            <Card key={item.id} className="p-6 hover:border-crimson/50 transition-colors">
              <div className="space-y-4">
                
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-crimson/20 rounded-lg text-crimson">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category === 'basic' ? 'Базовый' :
                         item.category === 'advanced' ? 'Продвинутый' : 'Премиум'}
                      </Badge>
                    </div>
                  </div>
                  
                  {item.owned > 0 && (
                    <Badge variant="outline" className="border-crimson text-crimson">
                      x{item.owned}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {/* Effect */}
                <div className="p-3 bg-crimson/10 rounded-lg border border-crimson/20">
                  <div className="text-sm font-semibold text-crimson">{item.effect}</div>
                </div>

                {/* Cost and Buy Button */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Стоимость:</span>
                    <span className="font-mono font-bold text-crimson">
                      {cost.toLocaleString()}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => buyItem(item.id)}
                    disabled={!canAfford || maxReached}
                    className="w-full"
                    variant={canAfford && !maxReached ? "default" : "outline"}
                  >
                    {maxReached ? 'Максимум' : 
                     canAfford ? 'Купить' : 'Недостаточно кликов'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};