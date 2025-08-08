import { api } from './api';
import {
  getMockAssetTypesResponse,
  getMockProductsResponse,
  getMockInspectionItemsResponse,
  getMockAdminDashboardStats,
  mockAssetTypes,
  mockProducts,
  mockInspectionItems
} from './mockAdminData';
import type {
  AssetType,
  Product,
  InspectionItem,
  CreateAssetTypeRequest,
  UpdateAssetTypeRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CreateInspectionItemRequest,
  UpdateInspectionItemRequest,
  AssetTypesResponse,
  ProductsResponse,
  InspectionItemsResponse,
  ProductFilter,
  InspectionItemFilter
} from '../types/admin';

// 관리자 API 엔드포인트
export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 자산 유형 관리
    getAssetTypes: builder.query<AssetTypesResponse, void>({
      queryFn: async () => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        return { data: getMockAssetTypesResponse() };
      },
      providesTags: ['AssetTypes'],
    }),
    
    getAssetTypeById: builder.query<AssetType, string>({
      query: (id) => `/admin/asset-types/${id}`,
      providesTags: (result, error, id) => [{ type: 'AssetTypes', id }],
    }),
    
    createAssetType: builder.mutation<AssetType, CreateAssetTypeRequest>({
      queryFn: async (assetType) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const newAssetType: AssetType = {
          id: (mockAssetTypes.length + 1).toString(),
          name: assetType.name,
          description: assetType.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockAssetTypes.push(newAssetType);
        return { data: newAssetType };
      },
      invalidatesTags: ['AssetTypes'],
    }),
    
    updateAssetType: builder.mutation<AssetType, UpdateAssetTypeRequest>({
      queryFn: async ({ id, ...assetType }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const index = mockAssetTypes.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Asset type not found' } };
        }
        const updatedAssetType: AssetType = {
          ...mockAssetTypes[index],
          name: assetType.name,
          description: assetType.description,
          updatedAt: new Date().toISOString()
        };
        mockAssetTypes[index] = updatedAssetType;
        return { data: updatedAssetType };
      },
      invalidatesTags: (result, error, { id }) => [
        'AssetTypes',
        { type: 'AssetTypes', id },
      ],
    }),
    
    deleteAssetType: builder.mutation<void, string>({
      queryFn: async (id) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const index = mockAssetTypes.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Asset type not found' } };
        }
        
        // 관련 제품과 점검항목도 삭제
        const relatedProducts = mockProducts.filter(p => p.assetTypeId === id);
        relatedProducts.forEach(product => {
          const productIndex = mockProducts.findIndex(p => p.id === product.id);
          if (productIndex > -1) mockProducts.splice(productIndex, 1);
        });
        
        const relatedInspectionItems = mockInspectionItems.filter(item => item.assetTypeId === id);
        relatedInspectionItems.forEach(item => {
          const itemIndex = mockInspectionItems.findIndex(i => i.id === item.id);
          if (itemIndex > -1) mockInspectionItems.splice(itemIndex, 1);
        });
        
        mockAssetTypes.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [
        'AssetTypes',
        { type: 'AssetTypes', id },
        'Products', // 자산유형 삭제시 관련 제품도 영향받음
        'InspectionItems', // 점검항목도 영향받음
      ],
    }),

    // 제품 관리
    getProducts: builder.query<ProductsResponse, ProductFilter>({
      queryFn: async (filter) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        return { data: getMockProductsResponse(filter) };
      },
      providesTags: ['Products'],
    }),
    
    getProductById: builder.query<Product, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    
    getProductsByAssetType: builder.query<Product[], string>({
      queryFn: async (assetTypeId) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 200)); // 로딩 시뮬레이션
        const filteredProducts = mockProducts.filter(p => p.assetTypeId === assetTypeId);
        return { data: filteredProducts };
      },
      providesTags: ['Products'],
    }),
    
    createProduct: builder.mutation<Product, CreateProductRequest>({
      queryFn: async (product) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const assetType = mockAssetTypes.find(at => at.id === product.assetTypeId);
        if (!assetType) {
          return { error: { status: 400, data: 'Asset type not found' } };
        }
        
        const newProduct: Product = {
          id: (mockProducts.length + 1).toString(),
          name: product.name,
          assetTypeId: product.assetTypeId,
          assetTypeName: assetType.name,
          version: product.version,
          description: product.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockProducts.push(newProduct);
        return { data: newProduct };
      },
      invalidatesTags: ['Products'],
    }),
    
    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      queryFn: async ({ id, ...product }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const index = mockProducts.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Product not found' } };
        }
        
        const assetType = mockAssetTypes.find(at => at.id === product.assetTypeId);
        if (!assetType) {
          return { error: { status: 400, data: 'Asset type not found' } };
        }
        
        const updatedProduct: Product = {
          ...mockProducts[index],
          name: product.name,
          assetTypeId: product.assetTypeId,
          assetTypeName: assetType.name,
          version: product.version,
          description: product.description,
          updatedAt: new Date().toISOString()
        };
        mockProducts[index] = updatedProduct;
        return { data: updatedProduct };
      },
      invalidatesTags: (result, error, { id }) => [
        'Products',
        { type: 'Products', id },
      ],
    }),
    
    deleteProduct: builder.mutation<void, string>({
      queryFn: async (id) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const index = mockProducts.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Product not found' } };
        }
        
        // 관련 점검항목에서 이 제품 ID 제거
        mockInspectionItems.forEach(item => {
          if (item.productIds?.includes(id)) {
            item.productIds = item.productIds.filter(pid => pid !== id);
            item.productNames = item.productNames?.filter(name => 
              name !== mockProducts[index].name
            );
          }
        });
        
        mockProducts.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [
        'Products',
        { type: 'Products', id },
        'InspectionItems', // 제품 삭제시 관련 점검항목도 영향받음
      ],
    }),

    // 제품 추가시 기본 점검항목 자동 생성
    createProductWithInspectionItems: builder.mutation<{
      product: Product;
      inspectionItems: InspectionItem[];
    }, CreateProductRequest>({
      query: (product) => ({
        url: '/admin/products/with-inspection-items',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products', 'InspectionItems'],
    }),

    // 점검 항목 관리
    getInspectionItems: builder.query<InspectionItemsResponse, InspectionItemFilter>({
      queryFn: async (filter) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 400)); // 로딩 시뮬레이션
        return { data: getMockInspectionItemsResponse(filter) };
      },
      providesTags: ['InspectionItems'],
    }),
    
    getInspectionItemById: builder.query<InspectionItem, string>({
      query: (id) => `/admin/inspection-items/${id}`,
      providesTags: (result, error, id) => [{ type: 'InspectionItems', id }],
    }),
    
    getInspectionItemsByAssetType: builder.query<InspectionItem[], string>({
      query: (assetTypeId) => `/admin/inspection-items/by-asset-type/${assetTypeId}`,
      providesTags: ['InspectionItems'],
    }),
    
    getInspectionItemsByProduct: builder.query<InspectionItem[], string>({
      query: (productId) => `/admin/inspection-items/by-product/${productId}`,
      providesTags: ['InspectionItems'],
    }),
    
    createInspectionItem: builder.mutation<InspectionItem, CreateInspectionItemRequest>({
      queryFn: async (inspectionItem) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const assetType = mockAssetTypes.find(at => at.id === inspectionItem.assetTypeId);
        if (!assetType) {
          return { error: { status: 400, data: 'Asset type not found' } };
        }
        
        // 선택된 제품들의 이름 가져오기
        const productNames = inspectionItem.productIds?.map(pid => {
          const product = mockProducts.find(p => p.id === pid);
          return product?.name;
        }).filter(Boolean) as string[];
        
        const newInspectionItem: InspectionItem = {
          id: (mockInspectionItems.length + 1).toString(),
          name: inspectionItem.name,
          description: inspectionItem.description,
          assetTypeId: inspectionItem.assetTypeId,
          assetTypeName: assetType.name,
          productIds: inspectionItem.productIds,
          productNames: productNames,
          script: inspectionItem.script,
          category: inspectionItem.category,
          severity: inspectionItem.severity,
          isActive: inspectionItem.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockInspectionItems.push(newInspectionItem);
        return { data: newInspectionItem };
      },
      invalidatesTags: ['InspectionItems'],
    }),
    
    updateInspectionItem: builder.mutation<InspectionItem, UpdateInspectionItemRequest>({
      queryFn: async ({ id, ...inspectionItem }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const index = mockInspectionItems.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Inspection item not found' } };
        }
        
        const assetType = mockAssetTypes.find(at => at.id === inspectionItem.assetTypeId);
        if (!assetType) {
          return { error: { status: 400, data: 'Asset type not found' } };
        }
        
        // 선택된 제품들의 이름 가져오기
        const productNames = inspectionItem.productIds?.map(pid => {
          const product = mockProducts.find(p => p.id === pid);
          return product?.name;
        }).filter(Boolean) as string[];
        
        const updatedInspectionItem: InspectionItem = {
          ...mockInspectionItems[index],
          name: inspectionItem.name,
          description: inspectionItem.description,
          assetTypeId: inspectionItem.assetTypeId,
          assetTypeName: assetType.name,
          productIds: inspectionItem.productIds,
          productNames: productNames,
          script: inspectionItem.script,
          category: inspectionItem.category,
          severity: inspectionItem.severity,
          isActive: inspectionItem.isActive,
          updatedAt: new Date().toISOString()
        };
        mockInspectionItems[index] = updatedInspectionItem;
        return { data: updatedInspectionItem };
      },
      invalidatesTags: (result, error, { id }) => [
        'InspectionItems',
        { type: 'InspectionItems', id },
      ],
    }),
    
    deleteInspectionItem: builder.mutation<void, string>({
      queryFn: async (id) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const index = mockInspectionItems.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Inspection item not found' } };
        }
        
        mockInspectionItems.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [
        'InspectionItems',
        { type: 'InspectionItems', id },
      ],
    }),

    // 대량 작업
    deleteMultipleInspectionItems: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/admin/inspection-items/bulk-delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['InspectionItems'],
    }),

    // 점검항목 활성화/비활성화 토글
    toggleInspectionItemStatus: builder.mutation<InspectionItem, { id: string; isActive: boolean }>({
      queryFn: async ({ id, isActive }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        const index = mockInspectionItems.findIndex(item => item.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Inspection item not found' } };
        }
        
        const updatedInspectionItem: InspectionItem = {
          ...mockInspectionItems[index],
          isActive: isActive,
          updatedAt: new Date().toISOString()
        };
        mockInspectionItems[index] = updatedInspectionItem;
        return { data: updatedInspectionItem };
      },
      invalidatesTags: (result, error, { id }) => [
        'InspectionItems',
        { type: 'InspectionItems', id },
      ],
    }),

    // 통계 및 요약 정보
    getAdminDashboardStats: builder.query<{
      assetTypesCount: number;
      productsCount: number;
      inspectionItemsCount: number;
      activeInspectionItemsCount: number;
      recentActivities: Array<{
        id: string;
        type: 'asset-type' | 'product' | 'inspection-item';
        action: 'created' | 'updated' | 'deleted';
        entityName: string;
        timestamp: string;
        userId: string;
        userName: string;
      }>;
    }, void>({
      queryFn: async () => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        return { data: getMockAdminDashboardStats() };
      },
      providesTags: ['AdminStats'],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  // 자산 유형
  useGetAssetTypesQuery,
  useGetAssetTypeByIdQuery,
  useCreateAssetTypeMutation,
  useUpdateAssetTypeMutation,
  useDeleteAssetTypeMutation,
  
  // 제품
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByAssetTypeQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductWithInspectionItemsMutation,
  
  // 점검항목
  useGetInspectionItemsQuery,
  useGetInspectionItemByIdQuery,
  useGetInspectionItemsByAssetTypeQuery,
  useGetInspectionItemsByProductQuery,
  useCreateInspectionItemMutation,
  useUpdateInspectionItemMutation,
  useDeleteInspectionItemMutation,
  useDeleteMultipleInspectionItemsMutation,
  useToggleInspectionItemStatusMutation,
  
  // 통계
  useGetAdminDashboardStatsQuery,
} = adminApi;

// RTK Query에서 태그 타입 업데이트를 위해 기존 api.ts에 추가해야 할 태그들
declare module './api' {
  interface ApiTags {
    AssetTypes: 'AssetTypes';
    Products: 'Products';
    InspectionItems: 'InspectionItems';
    AdminStats: 'AdminStats';
  }
}
