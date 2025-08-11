import { api } from './api';
import {
  listAssetTypesResponse,
  listProductsResponse,
  listInspectionItemsResponse,
  getAdminDashboardStats,
  listProductsByAssetType,
  createAssetType as createAssetTypeStore,
  updateAssetType as updateAssetTypeStore,
  deleteAssetType as deleteAssetTypeStore,
  createProduct as createProductStore,
  updateProduct as updateProductStore,
  deleteProduct as deleteProductStore,
  createInspectionItem as createInspectionItemStore,
  updateInspectionItem as updateInspectionItemStore,
  deleteInspectionItem as deleteInspectionItemStore,
  toggleInspectionItemStatus as toggleInspectionItemStatusStore,
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
        return { data: listAssetTypesResponse() };
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
        const created = createAssetTypeStore(assetType);
        if (!created) return { error: { status: 400, data: 'Create failed' } } as any;
        return { data: created };
      },
      invalidatesTags: ['AssetTypes'],
    }),
    
    updateAssetType: builder.mutation<AssetType, UpdateAssetTypeRequest>({
      queryFn: async ({ id, ...assetType }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const updated = updateAssetTypeStore(id, { id, ...assetType });
        if (!updated) return { error: { status: 404, data: 'Asset type not found' } } as any;
        return { data: updated };
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
        const ok = deleteAssetTypeStore(id);
        if (!ok) return { error: { status: 404, data: 'Asset type not found' } } as any;
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
        return { data: listProductsResponse(filter || {}) };
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
        return { data: listProductsByAssetType(assetTypeId) };
      },
      providesTags: ['Products'],
    }),
    
    createProduct: builder.mutation<Product, CreateProductRequest>({
      queryFn: async (product) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const created = createProductStore(product);
        if (!created) return { error: { status: 400, data: 'Asset type not found' } } as any;
        return { data: created };
      },
      invalidatesTags: ['Products'],
    }),
    
    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      queryFn: async ({ id, ...product }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const updated = updateProductStore(id, { id, ...product });
        if (!updated) return { error: { status: 404, data: 'Product not found' } } as any;
        return { data: updated };
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
        const ok = deleteProductStore(id);
        if (!ok) return { error: { status: 404, data: 'Product not found' } } as any;
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
        return { data: listInspectionItemsResponse(filter || {}) };
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
        const created = createInspectionItemStore(inspectionItem);
        if (!created) return { error: { status: 400, data: 'Asset type not found' } } as any;
        return { data: created };
      },
      invalidatesTags: ['InspectionItems'],
    }),
    
    updateInspectionItem: builder.mutation<InspectionItem, UpdateInspectionItemRequest>({
      queryFn: async ({ id, ...inspectionItem }) => {
        // 목 데이터 사용 (실제 백엔드 대신)
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const updated = updateInspectionItemStore(id, { id, ...inspectionItem });
        if (!updated) return { error: { status: 404, data: 'Inspection item not found' } } as any;
        return { data: updated };
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
        const ok = deleteInspectionItemStore(id);
        if (!ok) return { error: { status: 404, data: 'Inspection item not found' } } as any;
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
        const updated = toggleInspectionItemStatusStore(id, isActive);
        if (!updated) return { error: { status: 404, data: 'Inspection item not found' } } as any;
        return { data: updated };
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
        return { data: getAdminDashboardStats() };
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
