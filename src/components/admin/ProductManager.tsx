import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
  HardDrive,
  Calendar,
  AlertTriangle,
  Loader2,
  Filter,
  X,
  Package
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';
import {
  useGetAssetTypesQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useCreateProductWithInspectionItemsMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../services/adminApi';
import type { Product, ProductFormData, ProductFilter } from '../../types/admin';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

function ProductForm({ product, onSubmit, isLoading }: ProductFormProps) {
  const { data: assetTypesResponse } = useGetAssetTypesQuery();
  const assetTypes = assetTypesResponse?.assetTypes || [];

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    assetTypeId: product?.assetTypeId || '',
    version: product?.version || '',
    description: product?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('제품 이름을 입력해주세요');
      return;
    }
    if (!formData.assetTypeId) {
      toast.error('자산유형을 선택해주세요');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assetTypeId">자산유형 *</Label>
        <Select 
          value={formData.assetTypeId} 
          onValueChange={(value) => setFormData({ ...formData, assetTypeId: value })}
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
        <Label htmlFor="name">제품 이름 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="예: Windows, Linux, MySQL, MongoDB"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="version">버전</Label>
        <Input
          id="version"
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          placeholder="예: 10, 8.0, 2019"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="제품에 대한 설명을 입력해주세요"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? '수정' : '생성'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function ProductManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<ProductFilter>({});
  const [showWithInspectionItems, setShowWithInspectionItems] = useState(false);

  const { data: assetTypesResponse } = useGetAssetTypesQuery();
  const assetTypes = assetTypesResponse?.assetTypes || [];

  const {
    data: productsResponse,
    isLoading,
    error,
    refetch
  } = useGetProductsQuery(filter);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [createProductWithInspectionItems, { isLoading: isCreatingWithItems }] = useCreateProductWithInspectionItemsMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = productsResponse?.products || [];

  const handleCreate = async (data: ProductFormData) => {
    try {
      if (showWithInspectionItems) {
        await createProductWithInspectionItems(data).unwrap();
        toast.success('제품과 기본 점검항목이 성공적으로 생성되었습니다');
      } else {
        await createProduct(data).unwrap();
        toast.success('제품이 성공적으로 생성되었습니다');
      }
      setIsCreateDialogOpen(false);
      setShowWithInspectionItems(false);
      refetch();
    } catch (error) {
      console.error('제품 생성 실패:', error);
      toast.error('제품 생성에 실패했습니다');
    }
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (!editingProduct) return;
    
    try {
      await updateProduct({ 
        id: editingProduct.id, 
        ...data 
      }).unwrap();
      toast.success('제품이 성공적으로 수정되었습니다');
      setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error('제품 수정 실패:', error);
      toast.error('제품 수정에 실패했습니다');
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id).unwrap();
      toast.success('제품이 성공적으로 삭제되었습니다');
      refetch();
    } catch (error) {
      console.error('제품 삭제 실패:', error);
      toast.error('제품 삭제에 실패했습니다. 연관된 점검항목이 있는지 확인해주세요.');
    }
  };

  const handleFilterChange = (key: keyof ProductFilter, value: string) => {
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
          제품 데이터를 불러오는 중 오류가 발생했습니다.
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
          <h3 className="text-lg font-semibold">제품 관리</h3>
          <p className="text-sm text-muted-foreground">
            자산유형별 제품을 관리합니다
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              새 제품
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 제품 생성</DialogTitle>
              <DialogDescription>
                새로운 제품을 생성합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center space-x-2 mb-4 p-3 bg-muted/20 rounded-lg">
              <input
                type="checkbox"
                id="withInspectionItems"
                checked={showWithInspectionItems}
                onChange={(e) => setShowWithInspectionItems(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="withInspectionItems" className="text-sm">
                기본 점검항목도 함께 생성
              </Label>
            </div>

            <ProductForm 
              onSubmit={handleCreate} 
              isLoading={isCreating || isCreatingWithItems}
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
          <div className="flex gap-4 items-end">
            <div className="flex-1">
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
            
            <div className="flex-1">
              <Label htmlFor="searchFilter">검색</Label>
              <Input
                id="searchFilter"
                value={filter.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="제품명으로 검색"
              />
            </div>

            <Button 
              variant="outline" 
              onClick={clearFilter}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 제품 목록 */}
      {products.length === 0 ? (
        <Card className="cyber-card">
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">제품이 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              {filter.assetTypeId || filter.search 
                ? '필터 조건에 맞는 제품이 없습니다.' 
                : '아직 등록된 제품이 없습니다. 첫 번째 제품을 생성해보세요.'
              }
            </p>
            {!filter.assetTypeId && !filter.search && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                제품 생성
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <HardDrive className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {product.name}
                        {product.version && (
                          <Badge variant="secondary" className="text-xs">
                            v{product.version}
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {product.assetTypeName}
                        </Badge>
                        {product.description && (
                          <CardDescription>{product.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog 
                      open={editingProduct?.id === product.id} 
                      onOpenChange={(open) => !open && setEditingProduct(null)}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>제품 수정</DialogTitle>
                          <DialogDescription>
                            제품 정보를 수정합니다.
                          </DialogDescription>
                        </DialogHeader>
                        <ProductForm 
                          product={editingProduct || undefined}
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
                          <AlertDialogTitle>제품 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            '{product.name}' 제품을 삭제하시겠습니까? 
                            이 작업은 되돌릴 수 없으며, 연관된 점검항목도 함께 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product)}
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
                      생성: {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                    {product.updatedAt !== product.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        수정: {new Date(product.updatedAt).toLocaleDateString('ko-KR')}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary">
                    ID: {product.id}
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
