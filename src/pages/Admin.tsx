import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  BarChart3,
  Shield,
  RefreshCw
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useGetAdminDashboardStatsQuery } from '../services/adminApi';
import AssetTypeManager from '../components/admin/AssetTypeManager';
import ProductManager from '../components/admin/ProductManager';
import InspectionItemManager from '../components/admin/InspectionItemManager';
import type { AdminTab } from '../types/admin';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('asset-types');
  
  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useGetAdminDashboardStatsQuery();

  const handleRefreshStats = () => {
    refetchStats();
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              관리자 페이지
            </h1>
          </div>
          <p className="text-muted-foreground">
            시스템 자산유형, 제품, 점검항목을 관리합니다
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefreshStats}
          disabled={isStatsLoading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isStatsLoading && "animate-spin")} />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">자산 유형</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.assetTypesCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              등록된 자산 유형 수
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">제품</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.productsCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              등록된 제품 수
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">점검 항목</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.inspectionItemsCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 점검 항목 수
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 점검 항목</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                stats?.activeInspectionItemsCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              활성화된 점검 항목 수
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      {stats?.recentActivities && stats.recentActivities.length > 0 && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              최근 활동
            </CardTitle>
            <CardDescription>
              최근 관리자 페이지에서 수행된 작업들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1 rounded-full",
                      activity.action === 'created' && "bg-green-500/20 text-green-500",
                      activity.action === 'updated' && "bg-blue-500/20 text-blue-500",
                      activity.action === 'deleted' && "bg-red-500/20 text-red-500"
                    )}>
                      {activity.type === 'asset-type' && <Database className="h-3 w-3" />}
                      {activity.type === 'product' && <HardDrive className="h-3 w-3" />}
                      {activity.type === 'inspection-item' && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.entityName}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.userName}님이 {activity.action === 'created' ? '생성' : activity.action === 'updated' ? '수정' : '삭제'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.action === 'deleted' ? 'destructive' : 'secondary'}>
                      {activity.action === 'created' ? '생성' : activity.action === 'updated' ? '수정' : '삭제'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 관리 탭 */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            관리자 페이지
          </CardTitle>
          <CardDescription>
            자산유형, 제품, 점검항목을 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="asset-types" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                자산유형
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                제품
              </TabsTrigger>
              <TabsTrigger value="inspection-items" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                점검항목
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="asset-types" className="space-y-4">
                <AssetTypeManager />
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <ProductManager />
              </TabsContent>

              <TabsContent value="inspection-items" className="space-y-4">
                <InspectionItemManager />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
