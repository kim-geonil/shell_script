import type {
  AssetType,
  Product,
  InspectionItem,
  AssetTypesResponse,
  ProductsResponse,
  InspectionItemsResponse,
  CreateAssetTypeRequest,
  UpdateAssetTypeRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CreateInspectionItemRequest,
  UpdateInspectionItemRequest,
} from '../types/admin';

// 내부 저장소 (외부로 직접 노출 금지)
let assetTypesStore: AssetType[] = [
  {
    id: '1',
    name: 'OS',
    description: '운영체제 관련 자산유형',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'DBMS',
    description: '데이터베이스 관리 시스템',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    name: 'WEB/WAS',
    description: '웹 서버 및 웹 애플리케이션 서버',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
];

let productsStore: Product[] = [
  {
    id: '1',
    name: 'Windows',
    assetTypeId: '1',
    assetTypeName: 'OS',
    version: '10',
    description: 'Microsoft Windows 운영체제',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Linux',
    assetTypeId: '1',
    assetTypeName: 'OS',
    version: 'Ubuntu 22.04',
    description: 'Linux 운영체제',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    name: 'MySQL',
    assetTypeId: '2',
    assetTypeName: 'DBMS',
    version: '8.0',
    description: 'MySQL 데이터베이스',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '4',
    name: 'MongoDB',
    assetTypeId: '2',
    assetTypeName: 'DBMS',
    version: '6.0',
    description: 'MongoDB NoSQL 데이터베이스',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '5',
    name: 'Apache Tomcat',
    assetTypeId: '3',
    assetTypeName: 'WEB/WAS',
    version: '9.0',
    description: 'Apache Tomcat 웹 애플리케이션 서버',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '6',
    name: 'Nginx',
    assetTypeId: '3',
    assetTypeName: 'WEB/WAS',
    version: '1.20',
    description: 'Nginx 웹 서버',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
];

let inspectionItemsStore: InspectionItem[] = [
  {
    id: '1',
    name: '패스워드 정책 확인',
    description: '시스템 패스워드 정책이 보안 요구사항을 만족하는지 확인',
    assetTypeId: '1',
    assetTypeName: 'OS',
    productIds: ['1', '2'],
    productNames: ['Windows', 'Linux'],
    script: `#!/bin/bash
# 패스워드 정책 확인 스크립트
if [ -f /etc/login.defs ]; then
    echo "패스워드 최소 길이:"
    grep PASS_MIN_LEN /etc/login.defs
    echo "패스워드 최대 사용기간:"
    grep PASS_MAX_DAYS /etc/login.defs
fi`,
    category: '보안',
    severity: 'high',
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: '방화벽 상태 확인',
    description: '시스템 방화벽이 활성화되어 있는지 확인',
    assetTypeId: '1',
    assetTypeName: 'OS',
    script: `#!/bin/bash
# 방화벽 상태 확인
if command -v ufw &> /dev/null; then
    echo "UFW 상태:"
    ufw status
elif command -v firewall-cmd &> /dev/null; then
    echo "firewalld 상태:"
    firewall-cmd --state
fi`,
    category: '보안',
    severity: 'critical',
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    name: 'MySQL 보안 설정 확인',
    description: 'MySQL 데이터베이스의 보안 설정을 확인',
    assetTypeId: '2',
    assetTypeName: 'DBMS',
    productIds: ['3'],
    productNames: ['MySQL'],
    script: `-- MySQL 보안 설정 확인
SHOW VARIABLES LIKE 'validate_password%';
SELECT User, Host, authentication_string FROM mysql.user WHERE User = 'root';
SHOW VARIABLES LIKE 'log_error';`,
    category: '보안',
    severity: 'high',
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '4',
    name: 'MongoDB 인증 설정 확인',
    description: 'MongoDB의 인증 및 권한 설정을 확인',
    assetTypeId: '2',
    assetTypeName: 'DBMS',
    productIds: ['4'],
    productNames: ['MongoDB'],
    script: `// MongoDB 인증 설정 확인
db.runCommand({connectionStatus : 1})
db.adminCommand("listCollections")
db.runCommand({usersInfo: 1})`,
    category: '보안',
    severity: 'medium',
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '5',
    name: 'Tomcat 보안 헤더 확인',
    description: 'Apache Tomcat의 보안 헤더 설정을 확인',
    assetTypeId: '3',
    assetTypeName: 'WEB/WAS',
    productIds: ['5'],
    productNames: ['Apache Tomcat'],
    script: `#!/bin/bash
# Tomcat 보안 헤더 확인
curl -I http://localhost:8080 | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)"
# web.xml 보안 설정 확인
grep -A 10 -B 5 "security-constraint" /opt/tomcat/webapps/*/WEB-INF/web.xml`,
    category: '보안',
    severity: 'medium',
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '6',
    name: 'Nginx 보안 설정 확인',
    description: 'Nginx 웹 서버의 보안 설정을 확인',
    assetTypeId: '3',
    assetTypeName: 'WEB/WAS',
    productIds: ['6'],
    productNames: ['Nginx'],
    script: `#!/bin/bash
# Nginx 보안 설정 확인
nginx -T | grep -E "(server_tokens|add_header|ssl_)"
# 접근 제한 확인
nginx -T | grep -A 5 "location"`,
    category: '보안',
    severity: 'low',
    isActive: false,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
];

// 유틸: 깊은 복제 (RTK Query의 freeze로부터 내부 저장소 보호)
function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// 조회(읽기) 함수들 - 항상 복제본 반환
export function listAssetTypesResponse(): AssetTypesResponse {
  return { assetTypes: deepClone(assetTypesStore), total: assetTypesStore.length };
}

export function listProductsResponse(filter?: { assetTypeId?: string; search?: string }): ProductsResponse {
  let filtered = productsStore;
  if (filter?.assetTypeId) {
    filtered = filtered.filter(p => p.assetTypeId === filter.assetTypeId);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }
  return { products: deepClone(filtered), total: filtered.length };
}

export function listInspectionItemsResponse(filter?: { assetTypeId?: string; severity?: string; isActive?: boolean; search?: string }): InspectionItemsResponse {
  let filtered = inspectionItemsStore;
  if (filter?.assetTypeId) {
    filtered = filtered.filter(i => i.assetTypeId === filter.assetTypeId);
  }
  if (filter?.severity) {
    filtered = filtered.filter(i => i.severity === filter.severity);
  }
  if (filter?.isActive !== undefined) {
    filtered = filtered.filter(i => i.isActive === filter.isActive);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(i => i.name.toLowerCase().includes(q));
  }
  return { inspectionItems: deepClone(filtered), total: filtered.length };
}

export function listProductsByAssetType(assetTypeId: string): Product[] {
  return deepClone(productsStore.filter(p => p.assetTypeId === assetTypeId));
}

// 변경(쓰기) 함수들 - 내부 저장소만 변경, 반환은 복제본
export function createAssetType(data: CreateAssetTypeRequest): AssetType {
  const now = new Date().toISOString();
  const created: AssetType = { id: String(assetTypesStore.length + 1), name: data.name, description: data.description, createdAt: now, updatedAt: now };
  assetTypesStore = [...assetTypesStore, created];
  return deepClone(created);
}

export function updateAssetType(id: string, data: UpdateAssetTypeRequest): AssetType | undefined {
  const idx = assetTypesStore.findIndex(a => a.id === id);
  if (idx === -1) return undefined;
  const updated: AssetType = { ...assetTypesStore[idx], name: data.name, description: data.description, updatedAt: new Date().toISOString() };
  assetTypesStore = [...assetTypesStore.slice(0, idx), updated, ...assetTypesStore.slice(idx + 1)];
  return deepClone(updated);
}

export function deleteAssetType(id: string): boolean {
  const exists = assetTypesStore.some(a => a.id === id);
  if (!exists) return false;
  // 관련 데이터 정리
  productsStore = productsStore.filter(p => p.assetTypeId !== id);
  inspectionItemsStore = inspectionItemsStore.filter(i => i.assetTypeId !== id);
  assetTypesStore = assetTypesStore.filter(a => a.id !== id);
  return true;
}

export function createProduct(data: CreateProductRequest): Product | undefined {
  const assetType = assetTypesStore.find(a => a.id === data.assetTypeId);
  if (!assetType) return undefined;
  const now = new Date().toISOString();
  const created: Product = {
    id: String(productsStore.length + 1),
    name: data.name,
    assetTypeId: data.assetTypeId,
    assetTypeName: assetType.name,
    version: data.version,
    description: data.description,
    createdAt: now,
    updatedAt: now,
  };
  productsStore = [...productsStore, created];
  return deepClone(created);
}

export function updateProduct(id: string, data: UpdateProductRequest): Product | undefined {
  const idx = productsStore.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  const assetType = assetTypesStore.find(a => a.id === data.assetTypeId);
  if (!assetType) return undefined;
  const updated: Product = {
    ...productsStore[idx],
    name: data.name,
    assetTypeId: data.assetTypeId,
    assetTypeName: assetType.name,
    version: data.version,
    description: data.description,
    updatedAt: new Date().toISOString(),
  };
  productsStore = [...productsStore.slice(0, idx), updated, ...productsStore.slice(idx + 1)];
  return deepClone(updated);
}

export function deleteProduct(id: string): boolean {
  const idx = productsStore.findIndex(p => p.id === id);
  if (idx === -1) return false;
  const productName = productsStore[idx].name;
  // 점검항목에서 제품 참조 제거
  inspectionItemsStore = inspectionItemsStore.map(i => ({
    ...i,
    productIds: i.productIds?.filter(pid => pid !== id),
    productNames: i.productNames?.filter(n => n !== productName),
  }));
  productsStore = [...productsStore.slice(0, idx), ...productsStore.slice(idx + 1)];
  return true;
}

export function createInspectionItem(data: CreateInspectionItemRequest): InspectionItem | undefined {
  const assetType = assetTypesStore.find(a => a.id === data.assetTypeId);
  if (!assetType) return undefined;
  const productNames = (data.productIds || [])
    .map(pid => productsStore.find(p => p.id === pid)?.name)
    .filter(Boolean) as string[];
  const now = new Date().toISOString();
  const created: InspectionItem = {
    id: String(inspectionItemsStore.length + 1),
    name: data.name,
    description: data.description,
    assetTypeId: data.assetTypeId,
    assetTypeName: assetType.name,
    productIds: data.productIds,
    productNames,
    script: data.script,
    category: data.category,
    severity: data.severity,
    isActive: data.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };
  inspectionItemsStore = [...inspectionItemsStore, created];
  return deepClone(created);
}

export function updateInspectionItem(id: string, data: UpdateInspectionItemRequest): InspectionItem | undefined {
  const idx = inspectionItemsStore.findIndex(i => i.id === id);
  if (idx === -1) return undefined;
  const assetType = assetTypesStore.find(a => a.id === data.assetTypeId);
  if (!assetType) return undefined;
  const productNames = (data.productIds || [])
    .map(pid => productsStore.find(p => p.id === pid)?.name)
    .filter(Boolean) as string[];
  const updated: InspectionItem = {
    ...inspectionItemsStore[idx],
    name: data.name,
    description: data.description,
    assetTypeId: data.assetTypeId,
    assetTypeName: assetType.name,
    productIds: data.productIds,
    productNames,
    script: data.script,
    category: data.category,
    severity: data.severity,
    isActive: data.isActive ?? inspectionItemsStore[idx].isActive,
    updatedAt: new Date().toISOString(),
  };
  inspectionItemsStore = [...inspectionItemsStore.slice(0, idx), updated, ...inspectionItemsStore.slice(idx + 1)];
  return deepClone(updated);
}

export function deleteInspectionItem(id: string): boolean {
  const exists = inspectionItemsStore.some(i => i.id === id);
  if (!exists) return false;
  inspectionItemsStore = inspectionItemsStore.filter(i => i.id !== id);
  return true;
}

export function toggleInspectionItemStatus(id: string, isActive: boolean): InspectionItem | undefined {
  const idx = inspectionItemsStore.findIndex(i => i.id === id);
  if (idx === -1) return undefined;
  const updated: InspectionItem = { ...inspectionItemsStore[idx], isActive, updatedAt: new Date().toISOString() };
  inspectionItemsStore = [...inspectionItemsStore.slice(0, idx), updated, ...inspectionItemsStore.slice(idx + 1)];
  return deepClone(updated);
}

export function getAdminDashboardStats() {
  return {
    assetTypesCount: assetTypesStore.length,
    productsCount: productsStore.length,
    inspectionItemsCount: inspectionItemsStore.length,
    activeInspectionItemsCount: inspectionItemsStore.filter(i => i.isActive).length,
    recentActivities: [
      {
        id: '1',
        type: 'inspection-item' as const,
        action: 'created' as const,
        entityName: '패스워드 정책 확인',
        timestamp: '2024-01-15T10:30:00Z',
        userId: 'admin',
        userName: '관리자',
      },
      {
        id: '2',
        type: 'product' as const,
        action: 'created' as const,
        entityName: 'MySQL',
        timestamp: '2024-01-15T10:15:00Z',
        userId: 'admin',
        userName: '관리자',
      },
      {
        id: '3',
        type: 'asset-type' as const,
        action: 'created' as const,
        entityName: 'DBMS',
        timestamp: '2024-01-15T09:45:00Z',
        userId: 'admin',
        userName: '관리자',
      },
    ],
  };
}

