// 관리자 페이지 관련 타입 정의

export interface AssetType {
  id: string;
  name: string; // OS, DBMS, WEB/WAS
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string; // Linux, Windows, MongoDB, MySQL 등
  assetTypeId: string;
  assetTypeName?: string; // 조인된 자산유형 이름
  version?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  description: string;
  assetTypeId: string; // 특정 자산유형의 공통 항목
  assetTypeName?: string; // 조인된 자산유형 이름
  productIds?: string[]; // 특정 제품에만 적용되는 경우
  productNames?: string[]; // 조인된 제품 이름들
  script: string; // 점검 스크립트
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API 요청 타입들
export interface CreateAssetTypeRequest {
  name: string;
  description: string;
}

export interface UpdateAssetTypeRequest extends CreateAssetTypeRequest {
  id: string;
}

export interface CreateProductRequest {
  name: string;
  assetTypeId: string;
  version?: string;
  description: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export interface CreateInspectionItemRequest {
  name: string;
  description: string;
  assetTypeId: string;
  productIds?: string[];
  script: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive?: boolean;
}

export interface UpdateInspectionItemRequest extends CreateInspectionItemRequest {
  id: string;
}

// API 응답 타입들
export interface AssetTypesResponse {
  assetTypes: AssetType[];
  total: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface InspectionItemsResponse {
  inspectionItems: InspectionItem[];
  total: number;
}

// 폼 관련 타입들
export interface AssetTypeFormData {
  name: string;
  description: string;
}

export interface ProductFormData {
  name: string;
  assetTypeId: string;
  version: string;
  description: string;
}

export interface InspectionItemFormData {
  name: string;
  description: string;
  assetTypeId: string;
  productIds: string[];
  script: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

// 관리자 탭 타입
export type AdminTab = 'asset-types' | 'products' | 'inspection-items';

// 필터 및 검색 타입들
export interface ProductFilter {
  assetTypeId?: string;
  search?: string;
}

export interface InspectionItemFilter {
  assetTypeId?: string;
  productId?: string;
  category?: string;
  severity?: string;
  isActive?: boolean;
  search?: string;
}
