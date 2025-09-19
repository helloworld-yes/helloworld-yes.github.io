import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Volume2, VolumeX, Palette, Zap, RotateCcw, Download, Upload } from 'lucide-react';

interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  animationsEnabled: boolean;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  showClickNumbers: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    soundVolume: 50,
    animationsEnabled: true,
    autoSaveEnabled: true,
    autoSaveInterval: 30,
    showClickNumbers: true,
    darkMode: true,
    reducedMotion: false
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('crimson-clicker-settings');
    if (savedSettings) {
      try {
        const data = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('crimson-clicker-settings', JSON.stringify(newSettings));
    
    toast({
      title: "Настройки сохранены!",
      description: "Ваши настройки были обновлены",
      className: "bg-crimson text-white"
    });
  };

  const updateSetting = <K extends keyof GameSettings>(
    key: K, 
    value: GameSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings: GameSettings = {
      soundEnabled: true,
      soundVolume: 50,
      animationsEnabled: true,
      autoSaveEnabled: true,
      autoSaveInterval: 30,
      showClickNumbers: true,
      darkMode: true,
      reducedMotion: false
    };
    
    saveSettings(defaultSettings);
    toast({
      title: "Настройки сброшены!",
      description: "Все настройки возвращены к значениям по умолчанию",
    });
  };

  const exportSave = () => {
    const gameData = {
      progress: localStorage.getItem('crimson-clicker-progress'),
      profile: localStorage.getItem('crimson-clicker-profile'),
      shop: localStorage.getItem('crimson-clicker-shop'),
      settings: localStorage.getItem('crimson-clicker-settings')
    };
    
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `crimson-clicker-save-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Сохранение экспортировано!",
      description: "Файл сохранения загружен",
      className: "bg-crimson text-white"
    });
  };

  const importSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const gameData = JSON.parse(e.target?.result as string);
        
        if (gameData.progress) localStorage.setItem('crimson-clicker-progress', gameData.progress);
        if (gameData.profile) localStorage.setItem('crimson-clicker-profile', gameData.profile);
        if (gameData.shop) localStorage.setItem('crimson-clicker-shop', gameData.shop);
        if (gameData.settings) localStorage.setItem('crimson-clicker-settings', gameData.settings);
        
        toast({
          title: "Сохранение импортировано!",
          description: "Перезагрузите страницу для применения изменений",
          className: "bg-crimson text-white"
        });
      } catch (error) {
        toast({
          title: "Ошибка импорта!",
          description: "Неверный формат файла сохранения",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold text-crimson flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Настройки
        </h1>
        <p className="text-muted-foreground">Настройте игру под себя</p>
      </Card>

      {/* Audio Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {settings.soundEnabled ? (
            <Volume2 className="w-5 h-5 text-crimson" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
          Звук
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-enabled">Включить звуки</Label>
              <p className="text-sm text-muted-foreground">Звуковые эффекты для кликов и покупок</p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>
          
          {settings.soundEnabled && (
            <div className="space-y-2">
              <Label>Громкость звука: {settings.soundVolume}%</Label>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={(value) => updateSetting('soundVolume', value[0])}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Visual Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-crimson" />
          Визуальные эффекты
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="animations-enabled">Анимации</Label>
              <p className="text-sm text-muted-foreground">Анимации кликов и переходов</p>
            </div>
            <Switch
              id="animations-enabled"
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-click-numbers">Показывать числа кликов</Label>
              <p className="text-sm text-muted-foreground">Анимация чисел при клике</p>
            </div>
            <Switch
              id="show-click-numbers"
              checked={settings.showClickNumbers}
              onCheckedChange={(checked) => updateSetting('showClickNumbers', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduced-motion">Упрощенная анимация</Label>
              <p className="text-sm text-muted-foreground">Уменьшить количество анимаций</p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Game Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-crimson" />
          Игровые настройки
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save-enabled">Автосохранение</Label>
              <p className="text-sm text-muted-foreground">Автоматически сохранять прогресс</p>
            </div>
            <Switch
              id="auto-save-enabled"
              checked={settings.autoSaveEnabled}
              onCheckedChange={(checked) => updateSetting('autoSaveEnabled', checked)}
            />
          </div>
          
          {settings.autoSaveEnabled && (
            <div className="space-y-2">
              <Label>Интервал автосохранения: {settings.autoSaveInterval} сек</Label>
              <Slider
                value={[settings.autoSaveInterval]}
                onValueChange={(value) => updateSetting('autoSaveInterval', value[0])}
                min={10}
                max={300}
                step={10}
                className="w-full"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-crimson" />
          Управление данными
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={exportSave}
              className="bg-crimson hover:bg-crimson-dark text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт сохранения
            </Button>
            
            <div>
              <input
                type="file"
                accept=".json"
                onChange={importSave}
                style={{ display: 'none' }}
                id="import-save"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-save')?.click()}
                className="w-full border-crimson text-crimson hover:bg-crimson hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Импорт сохранения
              </Button>
            </div>
          </div>
          
          <Button
            variant="destructive"
            onClick={resetSettings}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить настройки
          </Button>
        </div>
      </Card>

      {/* Game Info */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Информация об игре</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Версия</Badge>
            <div className="text-sm text-muted-foreground">1.0.0</div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Сборка</Badge>
            <div className="text-sm text-muted-foreground">Alpha</div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Движок</Badge>
            <div className="text-sm text-muted-foreground">React</div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Платформа</Badge>
            <div className="text-sm text-muted-foreground">Web</div>
          </div>
        </div>
      </Card>
    </div>
  );
};