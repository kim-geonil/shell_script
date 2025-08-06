import { FileText, Library, TestTube, TrendingUp } from 'lucide-react';

export const DASHBOARD_STATS = [
  {
    title: '총 스크립트',
    value: '12',
    description: '+2 from last month',
    icon: FileText,
    trend: '+16.2%',
  },
  {
    title: '템플릿',
    value: '5',
    description: 'U-102, U-103, U-106, U-107, U-301',
    icon: Library,
  },
  {
    title: '테스트 성공률',
    value: '89%',
    description: 'Average pass rate',
    icon: TestTube,
    trend: '+2.4%',
  },
  {
    title: '이번 달 실행',
    value: '147',
    description: 'Script executions',
    icon: TrendingUp,
    trend: '+12.5%',
  },
];

export const RECENT_SCRIPTS = [
  {
    id: '1',
    title: 'SSH 보안 검사 스크립트',
    description: 'SSH 서비스 보안 설정을 검사하고 취약점을 탐지합니다.',
    type: 'U-102' as const,
    status: 'completed' as const,
    lastModified: '2시간 전',
    author: '김보안',
  },
  {
    id: '2',
    title: '패스워드 정책 검증',
    description: '시스템의 패스워드 정책 준수 여부를 확인합니다.',
    type: 'U-103' as const,
    status: 'in-progress' as const,
    lastModified: '4시간 전',
    author: '이관리',
  },
  {
    id: '3',
    title: '파일 권한 검사',
    description: '중요 시스템 파일의 권한 설정을 검증합니다.',
    type: 'U-106' as const,
    status: 'draft' as const,
    lastModified: '1일 전',
    author: '박시스템',
  },
];

export const QUICK_ACTIONS = [
  {
    id: 'new-script',
    title: '새 스크립트 작성',
    description: '템플릿을 사용해 스크립트 생성',
    icon: FileText,
    path: '/scripts',
  },
  {
    id: 'templates',
    title: '템플릿 라이브러리',
    description: '보안 검사 템플릿 탐색',
    icon: Library,
    path: '/templates',
  },
  {
    id: 'test-results',
    title: '테스트 결과',
    description: '최근 실행 결과 확인',
    icon: TestTube,
    path: '/test-results',
  },
];