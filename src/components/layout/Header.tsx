import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Bell, Search, Settings, LogOut, User, Shield, Menu } from 'lucide-react';
import { useAuth, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';

export default function Header() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogoClick = () => {
    window.history.pushState(null, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-border/50">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo and brand */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <div className="relative">
            <Shield className="h-8 w-8 text-primary group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse opacity-30">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-glow bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-cyan-400/80 transition-all">
              NcuScript Automator
            </h1>
            <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">보안 검증 자동화 플랫폼</p>
          </div>
        </button>
      </div>

      {/* Right side - Actions and user menu */}
      <div className="flex items-center gap-2">
        {/* Search button for mobile */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 cyber-card">
            <DropdownMenuLabel className="text-primary">알림</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">스크립트 실행 완료</p>
                  <p className="text-xs text-muted-foreground">U-102 보안 검사가 성공적으로 완료되었습니다.</p>
                  <p className="text-xs text-muted-foreground">5분 전</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">스크립트 경고</p>
                  <p className="text-xs text-muted-foreground">U-103 검사에서 2개의 경고가 발생했습니다.</p>
                  <p className="text-xs text-muted-foreground">15분 전</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">시스템 알림</p>
                  <p className="text-xs text-muted-foreground">새로운 보안 템플릿이 업데이트되었습니다.</p>
                  <p className="text-xs text-muted-foreground">1시간 전</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-center text-sm">
                모든 알림 보기
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 cyber-card" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-primary">{user?.name || '사용자'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {user?.role || 'Security Analyst'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-accent/50">
              <User className="mr-2 h-4 w-4" />
              <span>프로필</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent/50">
              <Settings className="mr-2 h-4 w-4" />
              <span>설정</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}