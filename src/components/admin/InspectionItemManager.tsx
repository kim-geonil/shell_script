import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  AlertTriangle,
  Loader2,
  Filter,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';
import {
  useGetAssetTypesQuery,
  useGetProductsByAssetTypeQuery,
  useGetInspectionItemsQuery,
  useCreateInspectionItemMutation,
  useUpdateInspectionItemMutation,
  useDeleteInspectionItemMutation,
  useToggleInspectionItemStatusMutation,
} from '../../services/adminApi';
import type { InspectionItem, InspectionItemFormData, InspectionItemFilter } from '../../types/admin';

const severityColors = {
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const severityIcons = {
  low: CheckCircle,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: XCircle,
};

interface InspectionItemFormProps {
  inspectionItem?: InspectionItem;
  onSubmit: (data: InspectionItemFormData) => void;
  isLoading?: boolean;
}

function InspectionItemForm({ inspectionItem, onSubmit, isLoading }: InspectionItemFormProps) {
  const { data: assetTypesResponse } = useGetAssetTypesQuery();
  const assetTypes = assetTypesResponse?.assetTypes || [];

  const [formData, setFormData] = useState<InspectionItemFormData>({
    name: inspectionItem?.name || '',
    description: inspectionItem?.description || '',
    assetTypeId: inspectionItem?.assetTypeId || '',
    productIds: inspectionItem?.productIds || [],
    script: inspectionItem?.script || '',
    category: inspectionItem?.category || '',
    severity: inspectionItem?.severity || 'medium',
    isActive: inspectionItem?.isActive ?? true,
  });

  const { data: products } = useGetProductsByAssetTypeQuery(formData.assetTypeId, {
    skip: !formData.assetTypeId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('점검항목 이름을 입력해주세요');
      return;
    }
    if (!formData.assetTypeId) {
      toast.error('자산유형을 선택해주세요');
      return;
    }
    if (!formData.script.trim()) {
      toast.error('점검 스크립트를 입력해주세요');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assetTypeId">자산유형 *</Label>
          <Select 
            value={formData.assetTypeId} 
            onValueChange={(value) => setFormData({ 
              ...formData, 
              assetTypeId: value,
              productIds: [] // 자산유형 변경시 선택된 제품 초기화
            })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="자산유형을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((assetType) => (
                <SelectItem key={assetType.id} value={assetType.id}>
                  {assetType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">심각도 *</Label>
          <Select 
            value={formData.severity} 
            onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">낮음</SelectItem>
              <SelectItem value="medium">보통</SelectItem>
              <SelectItem value="high">높음</SelectItem>
              <SelectItem value="critical">치명적</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">점검항목 이름 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="예: 패스워드 정책 확인, 포트 점검"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">카테고리</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="예: 보안, 성능, 가용성"
          disabled={isLoading}
        />
      </div>

      {/* 제품 선택 (다중 선택) */}
      {products && products.length > 0 && (
        <div className="space-y-2">
          <Label>특정 제품에만 적용 (선택사항)</Label>
          <div className="border rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={formData.productIds.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        productIds: [...formData.productIds, product.id]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        productIds: formData.productIds.filter(id => id !== product.id)
                      });
                    }
                  }}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
                <Label htmlFor={`product-${product.id}`} className="text-sm">
                  {product.name} {product.version && `(v${product.version})`}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            선택하지 않으면 해당 자산유형의 모든 제품에 적용됩니다.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="점검항목에 대한 설명을 입력해주세요"
          rows={2}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="script">점검 스크립트 *</Label>
        <Textarea
          id="script"
          value={formData.script}
          onChange={(e) => setFormData({ ...formData, script: e.target.value })}
          placeholder="점검을 수행할 스크립트를 입력해주세요"
          rows={4}
          disabled={isLoading}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          disabled={isLoading}
        />
        <Label htmlFor="isActive">활성화</Label>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {inspectionItem ? '수정' : '생성'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function InspectionItemManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInspectionItem, setEditingInspectionItem] = useState<InspectionItem | null>(null);
  const [filter, setFilter] = useState<InspectionItemFilter>({});

  const { data: assetTypesResponse } = useGetAssetTypesQuery();
  const assetTypes = assetTypesResponse?.assetTypes || [];

  const {
    data: inspectionItemsResponse,
    isLoading,
    error,
    refetch
  } = useGetInspectionItemsQuery(filter);

  const [createInspectionItem, { isLoading: isCreating }] = useCreateInspectionItemMutation();
  const [updateInspectionItem, { isLoading: isUpdating }] = useUpdateInspectionItemMutation();
  const [deleteInspectionItem, { isLoading: isDeleting }] = useDeleteInspectionItemMutation();
  const [toggleInspectionItemStatus] = useToggleInspectionItemStatusMutation();

  const inspectionItems = inspectionItemsResponse?.inspectionItems || [];

  const handleCreate = async (data: InspectionItemFormData) => {
    try {
      await createInspectionItem(data).unwrap();
      toast.success('점검항목이 성공적으로 생성되었습니다');
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('점검항목 생성 실패:', error);
      toast.error('점검항목 생성에 실패했습니다');
    }
  };

  const handleUpdate = async (data: InspectionItemFormData) => {
    if (!editingInspectionItem) return;
    
    try {
      await updateInspectionItem({ 
        id: editingInspectionItem.id, 
        ...data 
      }).unwrap();
      toast.success('점검항목이 성공적으로 수정되었습니다');
      setEditingInspectionItem(null);
      refetch();
    } catch (error) {
      console.error('점검항목 수정 실패:', error);
      toast.error('점검항목 수정에 실패했습니다');
    }
  };

  const handleDelete = async (inspectionItem: InspectionItem) => {
    try {
      await deleteInspectionItem(inspectionItem.id).unwrap();
      toast.success('점검항목이 성공적으로 삭제되었습니다');
      refetch();
    } catch (error) {
      console.error('점검항목 삭제 실패:', error);
      toast.error('점검항목 삭제에 실패했습니다');
    }
  };

  const handleToggleStatus = async (inspectionItem: InspectionItem) => {
    try {
      await toggleInspectionItemStatus({
        id: inspectionItem.id,
        isActive: !inspectionItem.isActive
      }).unwrap();
      toast.success(`점검항목이 ${!inspectionItem.isActive ? '활성화' : '비활성화'}되었습니다`);
      refetch();
    } catch (error) {
      console.error('점검항목 상태 변경 실패:', error);
      toast.error('점검항목 상태 변경에 실패했습니다');
    }
  };

  const handleFilterChange = (key: keyof InspectionItemFilter, value: string | boolean) => {
    setFilter(prev => ({
      ...prev,
      [key]: value === 'all' || value === '' ? undefined : value
    }));
  };

  const clearFilter = () => {
    setFilter({});
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
        <p className="text-muted-foreground mb-4">
          점검항목 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">점검항목 관리</h3>
          <p className="text-sm text-muted-foreground">
            자산유형별 점검항목을 관리합니다
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              새 점검항목
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 점검항목 생성</DialogTitle>
              <DialogDescription>
                새로운 점검항목을 생성합니다.
              </DialogDescription>
            </DialogHeader>
            <InspectionItemForm 
              onSubmit={handleCreate} 
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 필터 */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="assetTypeFilter">자산유형</Label>
              <Select 
                value={filter.assetTypeId || 'all'} 
                onValueChange={(value) => handleFilterChange('assetTypeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {assetTypes.map((assetType) => (
                    <SelectItem key={assetType.id} value={assetType.id}>
                      {assetType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="severityFilter">심각도</Label>
              <Select 
                value={filter.severity || 'all'} 
                onValueChange={(value) => handleFilterChange('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="critical">치명적</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="statusFilter">상태</Label>
              <Select 
                value={filter.isActive === undefined ? 'all' : filter.isActive.toString()} 
                onValueChange={(value) => handleFilterChange('isActive', value === 'all' ? 'all' : value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="true">활성</SelectItem>
                  <SelectItem value="false">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="searchFilter">검색</Label>
              <div className="flex gap-2">
                <Input
                  id="searchFilter"
                  value={filter.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="점검항목명으로 검색"
                />
                <Button 
                  variant="outline" 
                  onClick={clearFilter}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 점검항목 목록 */}
      {inspectionItems.length === 0 ? (
        <Card className="cyber-card">
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">점검항목이 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              {Object.keys(filter).length > 0
                ? '필터 조건에 맞는 점검항목이 없습니다.' 
                : '아직 등록된 점검항목이 없습니다. 첫 번째 점검항목을 생성해보세요.'
              }
            </p>
            {Object.keys(filter).length === 0 && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                점검항목 생성
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inspectionItems.map((inspectionItem) => {
            const SeverityIcon = severityIcons[inspectionItem.severity];
            return (
              <Card key={inspectionItem.id} className={cn("cyber-card", !inspectionItem.isActive && "opacity-60")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", severityColors[inspectionItem.severity])}>
                        <SeverityIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {inspectionItem.name}
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {inspectionItem.assetTypeName}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs", severityColors[inspectionItem.severity])}
                            >
                              {inspectionItem.severity === 'low' ? '낮음' : 
                               inspectionItem.severity === 'medium' ? '보통' :
                               inspectionItem.severity === 'high' ? '높음' : '치명적'}
                            </Badge>
                            {inspectionItem.category && (
                              <Badge variant="outline" className="text-xs">
                                {inspectionItem.category}
                              </Badge>
                            )}
                          </div>
                        </CardTitle>
                        {inspectionItem.description && (
                          <CardDescription>{inspectionItem.description}</CardDescription>
                        )}
                        {inspectionItem.productNames && inspectionItem.productNames.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">적용 제품:</span>
                            <div className="flex gap-1">
                              {inspectionItem.productNames.map((productName, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {productName}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(inspectionItem)}
                        className={cn(
                          "gap-2",
                          inspectionItem.isActive 
                            ? "text-green-600 hover:text-green-700" 
                            : "text-gray-500 hover:text-gray-600"
                        )}
                      >
                        {inspectionItem.isActive ? (
                          <>
                            <Activity className="h-4 w-4" />
                            활성
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            비활성
                          </>
                        )}
                      </Button>

                              <Dialog 
          open={editingInspectionItem?.id === inspectionItem.id} 
          onOpenChange={(open: boolean) => !open && setEditingInspectionItem(null)}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingInspectionItem(inspectionItem)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>점검항목 수정</DialogTitle>
                            <DialogDescription>
                              점검항목 정보를 수정합니다.
                            </DialogDescription>
                          </DialogHeader>
                          <InspectionItemForm 
                            inspectionItem={editingInspectionItem || undefined}
                            onSubmit={handleUpdate} 
                            isLoading={isUpdating}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>점검항목 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              '{inspectionItem.name}' 점검항목을 삭제하시겠습니까? 
                              이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(inspectionItem)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {inspectionItem.script && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">점검 스크립트</Label>
                      <div className="mt-1 p-3 bg-muted/20 rounded-lg">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {inspectionItem.script.substring(0, 200)}
                          {inspectionItem.script.length > 200 && '...'}
                        </pre>
                      </div>
                    </div>
                  )}

                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        생성: {new Date(inspectionItem.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                      {inspectionItem.updatedAt !== inspectionItem.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          수정: {new Date(inspectionItem.updatedAt).toLocaleDateString('ko-KR')}
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary">
                      ID: {inspectionItem.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
