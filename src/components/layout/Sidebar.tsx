import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Library, 
  TestTube,
  ChevronLeft,
  ChevronRight,
  Settings,
  Plus,
  Activity,
  Bookmark,
  History,
  Shield
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { useAppDispatch, useSidebarCollapsed } from '../../hooks/redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

const primaryNavigation = [
  {
    name: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: '전체 현황을 확인합니다'
  },
  {
    name: '스크립트',
    href: '/scripts',
    icon: FileText,
    description: '스크립트를 생성하고 관리합니다',
    badge: '24'
  },
  {
    name: '템플릿',
    href: '/templates',
    icon: Library,
    description: '검증된 템플릿을 찾아보세요'
  },
  {
    name: '테스트 결과',
    href: '/test-results',
    icon: TestTube,
    description: '실행 결과를 확인합니다'
  },
];

const secondaryNavigation = [
  {
    name: '최근 활동',
    href: '/activity',
    icon: Activity,
    description: '최근 작업 내역'
  },
  {
    name: '북마크',
    href: '/bookmarks', 
    icon: Bookmark,
    description: '즐겨찾는 스크립트'
  },
  {
    name: '실행 이력',
    href: '/history',
    icon: History,
    description: '스크립트 실행 기록'
  },
];

const quickActions = [
  {
    name: '새 스크립트',
    href: '/scripts/new',
    icon: Plus,
    description: '새로운 스크립트 생성'
  },
];

interface NavigationItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ElementType;
    description: string;
    badge?: string;
  };
  collapsed: boolean;
  isActive: boolean;
  navigate: (path: string) => void;
}

function NavigationItem({ item, collapsed, isActive, navigate }: NavigationItemProps) {
  const Icon = item.icon;
  
  const content = (
    <button
      onClick={() => navigate(item.href)}
      className={cn(
        'sidebar-nav-item flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-300 w-full text-left group',
        'hover:bg-primary/10 hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isActive
          ? 'active bg-primary/20 text-primary border-l-2 border-primary shadow-lg shadow-primary/20'
          : 'text-muted-foreground hover:text-foreground border-l-2 border-transparent',
        collapsed ? 'justify-center px-2 py-3' : 'gap-3'
      )}
    >
      <Icon className={cn(
        'flex-shrink-0 transition-all duration-300', 
        collapsed ? 'h-6 w-6' : 'h-5 w-5',
        isActive ? 'text-primary drop-shadow-[0_0_6px_hsl(200,98%,39%)]' : '',
        'group-hover:scale-110'
      )} />
      {!collapsed && (
        <>
          <span className="flex-1 font-medium transition-all duration-300">{item.name}</span>
          {item.badge && (
            <Badge 
              variant="secondary" 
              className={cn(
                "ml-auto h-5 px-1.5 text-xs transition-all duration-300",
                isActive ? "bg-primary/20 text-primary border-primary/30" : ""
              )}
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="cyber-card flex flex-col gap-1">
            <div className="font-medium text-primary">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
            {item.badge && (
              <Badge variant="secondary" className="w-fit">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const collapsed = useSidebarCollapsed();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentPath = () => {
    const path = location.pathname;
    return path === '/' ? '/dashboard' : path;
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out',
          'cyber-card border-r bg-card/50 backdrop-blur-xl',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full w-full flex-col">
          {/* Header with toggle */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-border/50">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                  Menu
                </h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          {!collapsed && (
            <div className="px-4 pb-2 pt-4">
              <div className="mb-2">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  빠른 작업
                </div>
              </div>
              <div className="space-y-1">
                {quickActions.map((item) => (
                  <NavigationItem
                    key={item.href}
                    item={item}
                    collapsed={false}
                    isActive={getCurrentPath() === item.href}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Primary Navigation */}
          <div className="flex-1 px-4 py-2">
            <div className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                    주요 메뉴
                  </div>
                </div>
              )}
              {primaryNavigation.map((item) => (
                <NavigationItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isActive={getCurrentPath() === item.href}
                  navigate={navigate}
                />
              ))}
            </div>

            <Separator className="my-4 bg-border/50" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                    도구
                  </div>
                </div>
              )}
              {secondaryNavigation.map((item) => (
                <NavigationItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isActive={getCurrentPath() === item.href}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>

          {/* Bottom Section - Settings */}
          <div className="border-t border-border/50 p-4">
            <NavigationItem
              item={{
                name: '설정',
                href: '/settings',
                icon: Settings,
                description: '애플리케이션 설정'
              }}
              collapsed={collapsed}
              isActive={getCurrentPath() === '/settings'}
              navigate={navigate}
            />
          </div>
        </div>
      </div>
      
      {/* Sidebar spacer for desktop */}
      <div
        className={cn(
          'hidden lg:block transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64'
        )}
      />
    </>
  );
}