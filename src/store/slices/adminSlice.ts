import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AssetType, Product, InspectionItem, AdminTab } from '../../types/admin';

interface AdminState {
  // 현재 활성 탭
  activeTab: AdminTab;
  
  // 선택된 항목들 (편집, 삭제 등을 위해)
  selectedAssetType: AssetType | null;
  selectedProduct: Product | null;
  selectedInspectionItem: InspectionItem | null;
  
  // 필터 상태
  filters: {
    assetTypeId?: string;
    productFilter: {
      assetTypeId?: string;
      search?: string;
    };
    inspectionItemFilter: {
      assetTypeId?: string;
      productId?: string;
      category?: string;
      severity?: string;
      isActive?: boolean;
      search?: string;
    };
  };
  
  // UI 상태
  ui: {
    isCreateDialogOpen: boolean;
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    bulkSelectMode: boolean;
    selectedItemIds: string[];
  };
  
  // 로딩 상태 (RTK Query 외에 추가적인 로딩이 필요한 경우)
  isLoading: {
    bulkDelete: boolean;
    export: boolean;
    import: boolean;
  };
  
  // 에러 상태
  error: string | null;
  
  // 통계 캐시 (자주 접근하는 데이터)
  stats: {
    lastUpdated?: string;
    assetTypesCount: number;
    productsCount: number;
    inspectionItemsCount: number;
    activeInspectionItemsCount: number;
  };
}

const initialState: AdminState = {
  activeTab: 'asset-types',
  selectedAssetType: null,
  selectedProduct: null,
  selectedInspectionItem: null,
  filters: {
    productFilter: {},
    inspectionItemFilter: {},
  },
  ui: {
    isCreateDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    bulkSelectMode: false,
    selectedItemIds: [],
  },
  isLoading: {
    bulkDelete: false,
    export: false,
    import: false,
  },
  error: null,
  stats: {
    assetTypesCount: 0,
    productsCount: 0,
    inspectionItemsCount: 0,
    activeInspectionItemsCount: 0,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 탭 관리
    setActiveTab: (state, action: PayloadAction<AdminTab>) => {
      state.activeTab = action.payload;
      // 탭 변경시 선택 상태 초기화
      state.selectedAssetType = null;
      state.selectedProduct = null;
      state.selectedInspectionItem = null;
      state.ui.selectedItemIds = [];
      state.ui.bulkSelectMode = false;
    },

    // 선택된 항목 관리
    setSelectedAssetType: (state, action: PayloadAction<AssetType | null>) => {
      state.selectedAssetType = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSelectedInspectionItem: (state, action: PayloadAction<InspectionItem | null>) => {
      state.selectedInspectionItem = action.payload;
    },

    // 필터 관리
    setAssetTypeFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.assetTypeId = action.payload;
    },
    setProductFilter: (state, action: PayloadAction<Partial<AdminState['filters']['productFilter']>>) => {
      state.filters.productFilter = { ...state.filters.productFilter, ...action.payload };
    },
    setInspectionItemFilter: (state, action: PayloadAction<Partial<AdminState['filters']['inspectionItemFilter']>>) => {
      state.filters.inspectionItemFilter = { ...state.filters.inspectionItemFilter, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        productFilter: {},
        inspectionItemFilter: {},
      };
    },

    // UI 상태 관리
    setCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.isCreateDialogOpen = action.payload;
    },
    setEditDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.isEditDialogOpen = action.payload;
    },
    setDeleteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.isDeleteDialogOpen = action.payload;
    },
    setBulkSelectMode: (state, action: PayloadAction<boolean>) => {
      state.ui.bulkSelectMode = action.payload;
      if (!action.payload) {
        state.ui.selectedItemIds = [];
      }
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.ui.selectedItemIds.indexOf(itemId);
      if (index > -1) {
        state.ui.selectedItemIds.splice(index, 1);
      } else {
        state.ui.selectedItemIds.push(itemId);
      }
    },
    selectAllItems: (state, action: PayloadAction<string[]>) => {
      state.ui.selectedItemIds = action.payload;
    },
    clearItemSelection: (state) => {
      state.ui.selectedItemIds = [];
    },

    // 로딩 상태 관리
    setBulkDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.bulkDelete = action.payload;
    },
    setExportLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.export = action.payload;
    },
    setImportLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.import = action.payload;
    },

    // 에러 관리
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // 통계 업데이트
    updateStats: (state, action: PayloadAction<Partial<AdminState['stats']>>) => {
      state.stats = { 
        ...state.stats, 
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      };
    },

    // 전체 상태 초기화
    resetAdminState: (state) => {
      return { ...initialState };
    },

    // 특정 탭의 상태만 초기화
    resetTabState: (state, action: PayloadAction<AdminTab>) => {
      const tab = action.payload;
      switch (tab) {
        case 'asset-types':
          state.selectedAssetType = null;
          break;
        case 'products':
          state.selectedProduct = null;
          state.filters.productFilter = {};
          break;
        case 'inspection-items':
          state.selectedInspectionItem = null;
          state.filters.inspectionItemFilter = {};
          break;
      }
      state.ui.selectedItemIds = [];
      state.ui.bulkSelectMode = false;
      state.error = null;
    },
  },
});

export const {
  // 탭 관리
  setActiveTab,
  
  // 선택된 항목 관리
  setSelectedAssetType,
  setSelectedProduct,
  setSelectedInspectionItem,
  
  // 필터 관리
  setAssetTypeFilter,
  setProductFilter,
  setInspectionItemFilter,
  clearFilters,
  
  // UI 상태 관리
  setCreateDialogOpen,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setBulkSelectMode,
  toggleItemSelection,
  selectAllItems,
  clearItemSelection,
  
  // 로딩 상태 관리
  setBulkDeleteLoading,
  setExportLoading,
  setImportLoading,
  
  // 에러 관리
  setError,
  clearError,
  
  // 통계 업데이트
  updateStats,
  
  // 상태 초기화
  resetAdminState,
  resetTabState,
} = adminSlice.actions;

export default adminSlice.reducer;

// 셀렉터들
export const selectAdminActiveTab = (state: { admin: AdminState }) => state.admin.activeTab;
export const selectAdminSelectedAssetType = (state: { admin: AdminState }) => state.admin.selectedAssetType;
export const selectAdminSelectedProduct = (state: { admin: AdminState }) => state.admin.selectedProduct;
export const selectAdminSelectedInspectionItem = (state: { admin: AdminState }) => state.admin.selectedInspectionItem;
export const selectAdminFilters = (state: { admin: AdminState }) => state.admin.filters;
export const selectAdminUI = (state: { admin: AdminState }) => state.admin.ui;
export const selectAdminLoading = (state: { admin: AdminState }) => state.admin.isLoading;
export const selectAdminError = (state: { admin: AdminState }) => state.admin.error;
export const selectAdminStats = (state: { admin: AdminState }) => state.admin.stats;
