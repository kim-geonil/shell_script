import type {
  AssetType,
  Product,
  InspectionItem,
  AssetTypesResponse,
  ProductsResponse,
  InspectionItemsResponse
} from '../types/admin';

// 목 데이터 생성
export const mockAssetTypes: AssetType[] = [
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

export const mockProducts: Product[] = [
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

export const mockInspectionItems: InspectionItem[] = [
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

// 목 응답 생성 함수들
export const getMockAssetTypesResponse = (): AssetTypesResponse => ({
  assetTypes: mockAssetTypes,
  total: mockAssetTypes.length
});

export const getMockProductsResponse = (filter?: any): ProductsResponse => {
  let filteredProducts = [...mockProducts];
  
  if (filter?.assetTypeId) {
    filteredProducts = filteredProducts.filter(p => p.assetTypeId === filter.assetTypeId);
  }
  
  if (filter?.search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(filter.search.toLowerCase())
    );
  }
  
  return {
    products: filteredProducts,
    total: filteredProducts.length
  };
};

export const getMockInspectionItemsResponse = (filter?: any): InspectionItemsResponse => {
  let filteredItems = [...mockInspectionItems];
  
  if (filter?.assetTypeId) {
    filteredItems = filteredItems.filter(item => item.assetTypeId === filter.assetTypeId);
  }
  
  if (filter?.severity) {
    filteredItems = filteredItems.filter(item => item.severity === filter.severity);
  }
  
  if (filter?.isActive !== undefined) {
    filteredItems = filteredItems.filter(item => item.isActive === filter.isActive);
  }
  
  if (filter?.search) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(filter.search.toLowerCase())
    );
  }
  
  return {
    inspectionItems: filteredItems,
    total: filteredItems.length
  };
};

export const getMockAdminDashboardStats = () => ({
  assetTypesCount: mockAssetTypes.length,
  productsCount: mockProducts.length,
  inspectionItemsCount: mockInspectionItems.length,
  activeInspectionItemsCount: mockInspectionItems.filter(item => item.isActive).length,
  recentActivities: [
    {
      id: '1',
      type: 'inspection-item' as const,
      action: 'created' as const,
      entityName: '패스워드 정책 확인',
      timestamp: '2024-01-15T10:30:00Z',
      userId: 'admin',
      userName: '관리자'
    },
    {
      id: '2',
      type: 'product' as const,
      action: 'created' as const,
      entityName: 'MySQL',
      timestamp: '2024-01-15T10:15:00Z',
      userId: 'admin',
      userName: '관리자'
    },
    {
      id: '3',
      type: 'asset-type' as const,
      action: 'created' as const,
      entityName: 'DBMS',
      timestamp: '2024-01-15T09:45:00Z',
      userId: 'admin',
      userName: '관리자'
    }
  ]
});
