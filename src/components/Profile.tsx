import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Camera, Trophy, Target, Zap } from 'lucide-react';

interface ProfileData {
  username: string;
  avatarUrl: string;
  totalClicks: number;
  level: number;
  achievements: number;
  joinDate: string;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: 'Кликер Pro',
    avatarUrl: '',
    totalClicks: 0,
    level: 1,
    achievements: 0,
    joinDate: new Date().toLocaleDateString('ru-RU')
  });
  
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem('crimson-clicker-profile');
    const savedProgress = localStorage.getItem('crimson-clicker-progress');
    
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...data }));
        setNewUsername(data.username || '');
        setNewAvatarUrl(data.avatarUrl || '');
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setProfile(prev => ({
          ...prev,
          totalClicks: progress.total_clicks || 0,
          level: Math.floor((progress.total_clicks || 0) / 1000) + 1
        }));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  const saveProfile = () => {
    const updatedProfile = {
      ...profile,
      username: newUsername || profile.username,
      avatarUrl: newAvatarUrl
    };
    
    setProfile(updatedProfile);
    localStorage.setItem('crimson-clicker-profile', JSON.stringify(updatedProfile));
    
    toast({
      title: "Профиль обновлен!",
      description: "Ваши изменения были сохранены",
      className: "bg-crimson text-white"
    });
  };

  const resetAvatar = () => {
    setNewAvatarUrl('');
    setProfile(prev => ({ ...prev, avatarUrl: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32 border-4 border-crimson shadow-lg">
              <AvatarImage 
                src={profile.avatarUrl} 
                alt={profile.username}
                className="object-cover"
              />
              <AvatarFallback className="bg-crimson text-white text-3xl">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
            
            <Badge variant="outline" className="border-crimson text-crimson">
              Уровень {profile.level}
            </Badge>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-crimson">{profile.username}</h1>
              <p className="text-muted-foreground">Присоединился: {profile.joinDate}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background border border-crimson/20 rounded-lg">
                <Target className="w-8 h-8 text-crimson mx-auto mb-2" />
                <div className="text-2xl font-bold text-crimson font-mono">
                  {profile.totalClicks.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Всего кликов</div>
              </div>
              
              <div className="text-center p-4 bg-background border border-crimson/20 rounded-lg">
                <Trophy className="w-8 h-8 text-crimson-light mx-auto mb-2" />
                <div className="text-2xl font-bold text-crimson-light font-mono">
                  {profile.achievements}
                </div>
                <div className="text-sm text-muted-foreground">Достижения</div>
              </div>
              
              <div className="text-center p-4 bg-background border border-crimson/20 rounded-lg">
                <Zap className="w-8 h-8 text-crimson-glow mx-auto mb-2" />
                <div className="text-2xl font-bold text-crimson-glow font-mono">
                  {Math.floor(profile.totalClicks / 100)}
                </div>
                <div className="text-sm text-muted-foreground">Рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-crimson" />
          Редактировать профиль
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Введите ваше имя"
                className="border-crimson/20 focus:border-crimson"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">URL аватарки</Label>
              <Input
                id="avatar"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="border-crimson/20 focus:border-crimson"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={saveProfile}
              className="bg-crimson hover:bg-crimson-dark text-white"
            >
              Сохранить изменения
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetAvatar}
              className="border-crimson text-crimson hover:bg-crimson hover:text-white"
            >
              Сбросить аватар
            </Button>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-crimson" />
          Достижения
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-crimson/20 rounded-lg bg-background/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-crimson rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Первый клик</span>
            </div>
            <p className="text-sm text-muted-foreground">Сделайте свой первый клик</p>
          </div>
          
          <div className="p-4 border border-muted rounded-lg bg-muted/20 opacity-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-muted-foreground">Кликер-новичок</span>
            </div>
            <p className="text-sm text-muted-foreground">Достигните 1000 кликов</p>
          </div>
          
          <div className="p-4 border border-muted rounded-lg bg-muted/20 opacity-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-muted-foreground">Быстрые пальцы</span>
            </div>
            <p className="text-sm text-muted-foreground">Достигните 10 кликов/сек</p>
          </div>
        </div>
      </Card>
    </div>
  );
};