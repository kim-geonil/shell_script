import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
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
  Database,
  Calendar,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';
import {
  useGetAssetTypesQuery,
  useCreateAssetTypeMutation,
  useUpdateAssetTypeMutation,
  useDeleteAssetTypeMutation,
} from '../../services/adminApi';
import type { AssetType, AssetTypeFormData } from '../../types/admin';

interface AssetTypeFormProps {
  assetType?: AssetType;
  onSubmit: (data: AssetTypeFormData) => void;
  isLoading?: boolean;
}

function AssetTypeForm({ assetType, onSubmit, isLoading }: AssetTypeFormProps) {
  const [formData, setFormData] = useState<AssetTypeFormData>({
    name: assetType?.name || '',
    description: assetType?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('자산유형 이름을 입력해주세요');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">자산유형 이름 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="예: OS, DBMS, WEB/WAS"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="자산유형에 대한 설명을 입력해주세요"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {assetType ? '수정' : '생성'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AssetTypeManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<AssetType | null>(null);

  const {
    data: assetTypesResponse,
    isLoading,
    error,
    refetch
  } = useGetAssetTypesQuery();

  const [createAssetType, { isLoading: isCreating }] = useCreateAssetTypeMutation();
  const [updateAssetType, { isLoading: isUpdating }] = useUpdateAssetTypeMutation();
  const [deleteAssetType, { isLoading: isDeleting }] = useDeleteAssetTypeMutation();

  const assetTypes = assetTypesResponse?.assetTypes || [];

  const handleCreate = async (data: AssetTypeFormData) => {
    try {
      await createAssetType(data).unwrap();
      toast.success('자산유형이 성공적으로 생성되었습니다');
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('자산유형 생성 실패:', error);
      toast.error('자산유형 생성에 실패했습니다');
    }
  };

  const handleUpdate = async (data: AssetTypeFormData) => {
    if (!editingAssetType) return;
    
    try {
      await updateAssetType({ 
        id: editingAssetType.id, 
        ...data 
      }).unwrap();
      toast.success('자산유형이 성공적으로 수정되었습니다');
      setEditingAssetType(null);
      refetch();
    } catch (error) {
      console.error('자산유형 수정 실패:', error);
      toast.error('자산유형 수정에 실패했습니다');
    }
  };

  const handleDelete = async (assetType: AssetType) => {
    try {
      await deleteAssetType(assetType.id).unwrap();
      toast.success('자산유형이 성공적으로 삭제되었습니다');
      refetch();
    } catch (error) {
      console.error('자산유형 삭제 실패:', error);
      toast.error('자산유형 삭제에 실패했습니다. 연관된 제품이 있는지 확인해주세요.');
    }
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
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
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
          자산유형 데이터를 불러오는 중 오류가 발생했습니다.
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
          <h3 className="text-lg font-semibold">자산유형 관리</h3>
          <p className="text-sm text-muted-foreground">
            시스템에서 사용하는 자산유형을 관리합니다
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              새 자산유형
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 자산유형 생성</DialogTitle>
              <DialogDescription>
                새로운 자산유형을 생성합니다. 생성 후 관련 제품들을 추가할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <AssetTypeForm 
              onSubmit={handleCreate} 
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 자산유형 목록 */}
      {assetTypes.length === 0 ? (
        <Card className="cyber-card">
          <CardContent className="py-8 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">자산유형이 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              아직 등록된 자산유형이 없습니다. 첫 번째 자산유형을 생성해보세요.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              자산유형 생성
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assetTypes.map((assetType) => (
            <Card key={assetType.id} className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assetType.name}</CardTitle>
                      <CardDescription>{assetType.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog 
                      open={editingAssetType?.id === assetType.id} 
                      onOpenChange={(open) => !open && setEditingAssetType(null)}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingAssetType(assetType)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>자산유형 수정</DialogTitle>
                          <DialogDescription>
                            자산유형 정보를 수정합니다.
                          </DialogDescription>
                        </DialogHeader>
                        <AssetTypeForm 
                          assetType={editingAssetType || undefined}
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
                          <AlertDialogTitle>자산유형 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            '{assetType.name}' 자산유형을 삭제하시겠습니까? 
                            이 작업은 되돌릴 수 없으며, 연관된 제품과 점검항목도 함께 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(assetType)}
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
                <Separator className="mb-4" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      생성: {new Date(assetType.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                    {assetType.updatedAt !== assetType.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        수정: {new Date(assetType.updatedAt).toLocaleDateString('ko-KR')}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary">
                    ID: {assetType.id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
