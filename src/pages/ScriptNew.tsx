import { useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft,
  ArrowRight,
  Monitor,
  Database,
  Server,
  Check,
  Search // Search 아이콘 추가
} from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import { Input } from '../components/ui/input'; // Input 컴포넌트 추가

// 위자드 단계
enum WizardStep {
  CATEGORY = 'category',
  CHECKLIST = 'checklist'
}

// 카테고리별 옵션 데이터
const CATEGORIES = {
  OS: {
    title: 'OS',
    description: '점검할 운영체제를 선택하세요',
    icon: Monitor,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    options: [
      { id: ' ', name: ' ', description: '  Server 및 클라이언트 OS' },
      { id: 'linux', name: 'Linux', description: 'Linux 배포판 (Ubuntu, CentOS, RHEL 등)' }
    ]
  },
  DBMS: {
    title: 'DBMS',
    description: '점검할 데이터베이스 관리 시스템을 선택하세요',
    icon: Database,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    options: [
      { id: 'mariadb', name: 'MariaDB', description: 'MariaDB 데이터베이스 서버' },
      { id: 'mongodb', name: 'MongoDB', description: 'MongoDB NoSQL 데이터베이스' },
      { id: 'mssql', name: 'MSSQL', description: 'Microsoft SQL Server' },
      { id: 'mysql', name: 'MySQL', description: 'MySQL 데이터베이스 서버' },
      { id: 'oracle', name: 'Oracle', description: 'Database' },
      { id: 'postgresql', name: 'PostgreSQL', description: '데이터베이스' },
      { id: 'redis', name: 'Redis', description: '인메모리 데이터 구조 저장소' },
      { id: 'rds', name: 'RDS', description: 'Amazon (다양한 DB 엔진)' }
    ]
  },
  WEB_WAS: {
    title: 'WEB/WAS',
    description: '점검할 웹서버 또는 웹 애플리케이션 서버를 선택하세요',
    icon: Server,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    options: [
      { id: 'apache', name: 'Apache', description: 'HTTP Server' },
      { id: 'iis', name: 'IIS', description: 'Microsoft Internet Information Services' },
      { id: 'jeus', name: 'JEUS', description: 'TmaxSoft 애플리케이션 서버' },
      { id: 'nginx', name: 'NGINX', description: '웹서버 및 리버스 프록시' },
      { id: 'tibero', name: 'Tibero', description: 'TmaxData 데이터베이스' },
      { id: 'tomcat', name: 'Tomcat', description: '서블릿 컨테이너' },
      { id: 'webtob', name: 'WebtoB', description: 'TmaxSoft 웹서버' }
    ]
  }
};

// 점검 항목 템플릿 (선택된 카테고리와 옵션에 따라 동적으로 생성)
const CHECKLIST_TEMPLATES = {
  // OS -  
  'OS- ': [
    { id: 'win-guest-account', name: '  게스트 계정 비활성화 점검', description: 'Guest 계정의 활성화 상태를 점검하여 비인가된 접근을 차단합니다.' },
    { id: 'win-rdp-limit', name: '  원격 데스크톱 연결 제한 점검', description: '원격 데스크톱 연결이 필요한 그룹에만 허용되었는지 확인합니다.' },
    { id: 'win-screensaver', name: '  화면 보호기 설정 점검', description: '화면 보호기 작동 및 암호 보호 설정 여부를 점검합니다.' },
    { id: 'win-sam-permission', name: '  SAM 파일 접근 권한 점검', description: '보안 계정 관리자(SAM) 파일의 접근 권한을 확인하여 계정 정보 유출을 방지합니다.' },
    { id: 'win-system-restore', name: '  시스템 복원 지점 보호 점검', description: '시스템 복원 지점의 보안 설정을 확인하여 시스템 무결성을 보장합니다.' },
    { id: 'win-event-log-mgmt', name: '  이벤트 로그 관리 설정 점검', description: '로그온/로그오프 등 주요 이벤트가 기록되도록 감사 정책을 확인합니다.' }
  ],
  // OS - Linux
  'OS-linux': [
    { id: 'u102-shell-check', name: '시스템 계정 쉘 검사', description: '시스템 계정의 /bin/false, /sbin/nologin 쉘 설정 확인' },
    { id: 'u103-maxrepeat', name: '패스워드 반복 문자 제한', description: 'maxrepeat 값이 1 또는 2로 설정되어 있는지 확인' },
    { id: 'u106-password-complexity', name: ' 패스워드 복잡성 정책', description: 'lcredit, ucredit, dcredit, ocredit 값 확인' },
    { id: 'u107-password-enhance', name: ' 패스워드 복잡성 강화', description: '4가지 credit 값이 모두 -1로 설정되었는지 검증' },
    { id: 'u301-account-lockout', name: ' 계정 잠금 임계값', description: '로그인 실패 4회 시 계정 잠금, 120초 후 해제 정책 검증' },
    // { id: 'linux-log-permission', name: 'Linux 시스템 로그 파일 권한 점검', description: '주요 로그 파일의 권한 설정을 확인하여 로그의 무결성을 보장합니다.' },
    // { id: 'linux-critical-file-permission', name: 'Linux 중요 파일 및 디렉토리 권한 점검', description: '시스템의 중요 파일 및 디렉토리의 권한이 적절히 설정되었는지 확인합니다.' },
    // { id: 'linux-suid-sgid', name: 'Linux SUID, SGID 설정 파일 점검', description: '불필요한 SUID/SGID 설정을 제거하여 권한 상승 공격을 방지합니다.' }
  ],
  
  // DBMS 점검 항목들
  'DBMS-mariadb': [
    { id: 'mariadb-remote-access', name: '원격 접속 제한 미적용 점검', description: '불필요한 원격 접속을 제한하여 비인가 접근을 차단합니다.' },
    { id: 'mariadb-ip-restriction', name: '접속 IP 제한 미적용 점검', description: '허용된 IP에서만 데이터베이스에 접속하도록 설정되었는지 확인합니다.' },
    { id: 'mariadb-info-exposure', name: '중요 정보 노출 취약점 점검', description: '에러 메시지 등을 통해 중요 정보가 노출되지 않도록 설정되었는지 확인합니다.' },
    { id: 'mariadb-system-table-access', name: '일반 계정의 시스템 테이블 접근 제한 미적용 점검', description: '일반 사용자가 시스템 테이블에 접근할 수 없도록 권한을 확인합니다.' }
  ],
  'DBMS-mongodb': [
    { id: 'mongodb-user-permission', name: '일반 사용자 계정 권한 점검', description: '일반 사용자 계정에 최소한의 권한만 부여되었는지 확인합니다.' },
    { id: 'mongodb-data-encryption', name: '중요 정보 암호화 미적용 점검', description: '저장되는 중요 데이터가 암호화되었는지 확인합니다.' }
  ],
  'DBMS-mssql': [
    { id: 'mssql-builtin-admin', name: 'BUILTIN\\Administrators 그룹 제거 미적용 점검', description: '로컬 Administrators 그룹의 데이터베이스 접근 권한을 제거했는지 확인합니다.' },
    { id: 'mssql-xp-cmdshell', name: 'xp_cmdshell 확장 프로시저 비활성화 점검', description: '시스템 명령어 실행이 가능한 xp_cmdshell 프로시저의 비활성화 여부를 점검합니다.' },
    { id: 'mssql-remote-procedure', name: '원격 프로시저 호출 비활성화 점검', description: '원격 프로시저 호출 기능의 비활성화 여부를 점검합니다.' },
    { id: 'mssql-login-attempts', name: '로그인 시도 횟수 제한 미설정 점검', description: '로그인 시도 횟수 제한 및 계정 잠금 정책이 설정되었는지 확인합니다.' },
    { id: 'mssql-db-encryption', name: '데이터베이스 암호화 미적용 점검', description: 'TDE 등을 이용한 데이터베이스 암호화 적용 여부를 확인합니다.' }
  ],
  'DBMS-mysql': [
    { id: 'mysql-root-remote-access', name: '\'root\' 계정 원격 접속 제한 미적용 점검', description: 'root 계정의 원격 접속 제한 여부를 확인합니다.' },
    { id: 'mysql-unnecessary-accounts', name: '불필요한 계정 제거 미적용 점검', description: '기본 설치 시 생성되는 불필요한 계정의 존재 여부를 확인합니다.' },
    { id: 'mysql-db-access', name: '데이터베이스 접근 권한 점검', description: '사용자별 데이터베이스 접근 권한이 최소한으로 부여되었는지 확인합니다.' },
    { id: 'mysql-file-access', name: '파일 접근 권한 점검', description: '데이터베이스 파일에 대한 OS 레벨의 접근 권한을 확인합니다.' },
    { id: 'mysql-system-resource', name: '시스템 자원 접근 제한 미적용 점검', description: '일반 사용자의 시스템 자원 접근 제한 여부를 확인합니다.' }
  ],
  'DBMS-oracle': [
    { id: 'oracle-initial-accounts', name: '초기 계정 및 테스트 계정 제거 미적용 점검', description: '불필요한 초기 및 테스트 계정의 존재 여부를 확인합니다.' },
    { id: 'oracle-password-complexity', name: '패스워드 복잡성 설정 미흡 점검', description: '패스워드 복잡성 정책이 적절히 설정되었는지 확인합니다.' },
    { id: 'oracle-password-file', name: '패스워드 파일 보호 미흡 점검', description: '패스워드 파일의 접근 권한 및 보안 설정을 확인합니다.' },
    { id: 'oracle-listener-password', name: '리스너 패스워드 설정 미흡 점검', description: '리스너에 패스워드가 설정되었는지 확인합니다.' },
    { id: 'oracle-db-encryption', name: '데이터베이스 암호화 미적용 점검', description: 'TDE 등을 이용한 데이터베이스 암호화 적용 여부를 확인합니다.' },
    { id: 'oracle-audit-disabled', name: '감사 기능 비활성화 점검', description: '감사 기능이 활성화되어 있는지 확인합니다.' },
    { id: 'oracle-system-privileges', name: '시스템 권한 제한 미흡 점검', description: '사용자에게 부여된 시스템 권한이 최소한인지 확인합니다.' },
    { id: 'oracle-object-privileges', name: '객체 권한 제한 미흡 점검', description: '객체에 대한 사용자 권한이 최소한인지 확인합니다.' },
    { id: 'oracle-dml-ddl-audit', name: 'DML/DDL 명령어 감사 미설정 점검', description: '중요 DML/DDL 명령어에 대한 감사 설정 여부를 확인합니다.' },
    { id: 'oracle-system-resource-access', name: '시스템 자원 접근 제한 미적용 점검', description: '프로파일을 이용한 시스템 자원 접근 제한 여부를 확인합니다.' },
    { id: 'oracle-network-service-access', name: '네트워크 서비스 접근 제한 미적용 점검', description: '네트워크 서비스에 대한 접근 제어 설정 여부를 확인합니다.' },
    { id: 'oracle-remote-admin', name: '원격 관리 기능 제한 미흡 점검', description: '원격 관리가 필요한 경우에만 제한적으로 허용되었는지 확인합니다.' },
    { id: 'oracle-unnecessary-services', name: '불필요한 서비스 비활성화 점검', description: '불필요한 서비스가 비활성화되었는지 확인합니다.' },
    { id: 'oracle-info-encryption', name: '중요 정보 암호화 미적용 점검', description: '데이터베이스 내 중요 정보가 암호화되어 저장되는지 확인합니다.' },
    { id: 'oracle-db-link-security', name: '데이터베이스 링크 보안 설정 미흡 점검', description: '데이터베이스 링크의 보안 설정이 적절한지 확인합니다.' },
    { id: 'oracle-web-console-security', name: '웹 기반 관리 콘솔 보안 설정 미흡 점검', description: '웹 기반 관리 콘솔의 보안 설정이 적절한지 확인합니다.' },
    { id: 'oracle-tde-check', name: 'TDE(Transparent Data Encryption) 설정 점검', description: 'TDE 설정 및 키 관리의 적절성을 확인합니다.' },
    { id: 'oracle-listener-log', name: '리스너 로그 설정 점검', description: '리스너 로그 기록 설정 및 관리의 적절성을 확인합니다.' },
    { id: 'oracle-table-access-log', name: '중요 테이블 접근 로깅 설정 점검', description: '중요 테이블에 대한 접근 로깅 설정 여부를 확인합니다.' },
    { id: 'oracle-backup-recovery', name: '데이터베이스 백업 및 복구 절차 점검', description: '백업 및 복구 절차의 보안성을 확인합니다.' },
    { id: 'oracle-password-reuse', name: '패스워드 재사용 금지 설정 점검', description: '패스워드 재사용 금지 정책이 설정되었는지 확인합니다.' },
    { id: 'oracle-account-lockout-threshold', name: '계정 잠금 임계값 설정 점검', description: '계정 잠금 임계값이 적절히 설정되었는지 확인합니다.' },
    { id: 'oracle-session-timeout', name: '세션 타임아웃 설정 점검', description: '세션 타임아웃이 적절히 설정되었는지 확인합니다.' },
    { id: 'oracle-audit-log-mgmt', name: '감사 로그 관리 점검', description: '감사 로그의 생성, 보관, 폐기 절차의 적절성을 확인합니다.' },
    { id: 'oracle-critical-data-access', name: '중요 데이터 접근 제어 설정 점검', description: '중요 데이터에 대한 접근 제어 설정이 적절한지 확인합니다.' },
    { id: 'oracle-version-patch', name: '데이터베이스 버전 및 패치 관리 점검', description: '데이터베이스의 버전 및 보안 패치가 최신인지 확인합니다.' },
    { id: 'oracle-public-role', name: 'PUBLIC 롤 권한 제한 미흡 점검', description: 'PUBLIC 롤에 부여된 권한이 최소한인지 확인합니다.' },
    { id: 'oracle-unnecessary-procs', name: '불필요한 프로시저 및 함수 제거 미적용 점검', description: '불필요한 프로시저 및 함수의 존재 여부를 확인합니다.' },
    { id: 'oracle-directory-object-permission', name: '디렉토리 객체 접근 권한 점검', description: '디렉토리 객체에 대한 접근 권한이 적절한지 확인합니다.' },
    { id: 'oracle-external-proc-execution', name: '외부 프로시저 실행 권한 점검', description: '외부 프로시저 실행 권한이 최소한으로 부여되었는지 확인합니다.' },
    { id: 'oracle-audit-policy', name: '감사 정책 설정 점검', description: '감사 정책이 적절히 설정되었는지 확인합니다.' },
    { id: 'oracle-db-link-auth', name: '데이터베이스 링크 사용자 인증 정보 보호 점검', description: '데이터베이스 링크 사용자 인증 정보가 안전하게 관리되는지 확인합니다.' },
    { id: 'oracle-listener-security', name: '리스너 보안 설정 점검', description: '리스너의 보안 설정이 적절한지 확인합니다.' },
    { id: 'oracle-db-file-permission', name: '데이터베이스 파일 권한 점검', description: '데이터베이스 파일에 대한 OS 레벨의 접근 권한을 확인합니다.' },
    { id: 'oracle-audit-data-integrity', name: '감사 데이터 무결성 보장 점검', description: '감사 데이터의 무결성을 보장하는 설정이 되었는지 확인합니다.' },
    { id: 'oracle-scheduler-security', name: '데이터베이스 작업 스케줄러 보안 설정 점검', description: '작업 스케줄러의 보안 설정이 적절한지 확인합니다.' },
    { id: 'oracle-replication-security', name: '데이터베이스 복제 및 동기화 보안 설정 점검', description: '데이터베이스 복제 및 동기화의 보안 설정이 적절한지 확인합니다.' }
  ],
  'DBMS-postgresql': [
    { id: 'postgresql-initial-accounts', name: '초기 계정 및 테스트 계정 제거 미적용 점검', description: '불필요한 초기 및 테스트 계정의 존재 여부를 확인합니다.' },
    { id: 'postgresql-db-access', name: '데이터베이스 접근 권한 점검', description: '사용자별 데이터베이스 접근 권한이 최소한으로 부여되었는지 확인합니다.' },
    { id: 'postgresql-info-encryption', name: '중요 정보 암호화 미적용 점검', description: '데이터베이스 내 중요 정보가 암호화되어 저장되는지 확인합니다.' }
  ],
  'DBMS-redis': [
    { id: 'redis-remote-access', name: '원격 접속 제한 미적용 점검', description: '허용된 IP에서만 접속하도록 bind 지시어 설정을 확인합니다.' },
    { id: 'redis-auth', name: '인증(Authentication) 미설정 점검', description: 'requirepass 지시어를 사용하여 패스워드 인증 설정 여부를 확인합니다.' },
    { id: 'redis-critical-commands', name: '중요 명령어 비활성화 점검', description: 'FLUSHDB, FLUSHALL, CONFIG 등 중요 명령어의 rename-command 설정 여부를 확인합니다.' },
    { id: 'redis-data-dir-permission', name: '데이터 디렉토리 및 파일 권한 점검', description: '데이터 파일(dump.rdb) 및 디렉토리의 권한을 확인합니다.' },
    { id: 'redis-info-encryption-transport', name: '중요 정보 암호화 미적용 점검', description: 'SSL/TLS를 사용하여 전송 구간 암호화 적용 여부를 확인합니다.' },
    { id: 'redis-sentinel-auth', name: 'Sentinel 인증 설정 점검', description: 'Sentinel 인스턴스 간 통신 및 마스터 인증 설정 여부를 확인합니다.' },
    { id: 'redis-cluster-security', name: 'Cluster 보안 설정 점검', description: '클러스터 노드 간 통신 보안 및 인증 설정 여부를 확인합니다.' },
    { id: 'redis-pubsub-access', name: 'Pub/Sub 채널 접근 제어 점검', description: 'Pub/Sub 채널에 대한 접근 제어 설정 여부를 확인합니다.' },
    { id: 'redis-lua-script-security', name: 'Lua 스크립트 실행 환경 보안 점검', description: 'Lua 스크립트 실행 환경의 보안 설정 및 권한을 확인합니다.' },
    { id: 'redis-log-file-access', name: '로그 파일 접근 제한 점검', description: '로그 파일의 접근 권한을 확인하여 정보 유출을 방지합니다.' }
  ],
  'DBMS-rds': [
    { id: 'rds-security-group', name: '보안 그룹 설정', description: 'VPC 보안 그룹 규칙 및 접근 제어 확인' },
    { id: 'rds-encryption', name: '암호화 설정', description: '저장 데이터 암호화 및 전송 구간 암호화 설정' },
    { id: 'rds-backup-security', name: '백업 보안', description: '자동 백업 설정 및 백업 데이터 암호화' },
    { id: 'rds-monitoring', name: '모니터링 설정', description: 'CloudWatch 모니터링 및 로그 설정' }
  ],
  
  // WEB/WAS 점검 항목들
  'WEB_WAS-apache': [
    { id: 'apache-log-permission', name: '로그 디렉터리 권한 점검', description: '로그 디렉터리의 접근 권한 및 보안 설정 확인' },
    { id: 'apache-process-permission', name: '프로세스 권한 및 설정 파일 권한 점검', description: '프로세스 실행 권한과 설정 파일 접근 권한 검증' },
    { id: 'apache-options-directive', name: 'Options 지시어 설정 점검', description: 'Options 지시어의 보안 설정 상태 확인' }
  ],
  
  'WEB_WAS-iis': [
    { id: 'iis-default-website', name: 'Default Web Site 활성화 여부 확인', description: 'IIS의 기본 웹사이트 활성화 상태 및 보안 위험도 점검' },
    { id: 'iis-directory-browsing', name: '웹사이트의 디렉터리 검색 취약점 점검', description: '디렉터리 브라우징 기능의 비활성화 상태 확인' },
    { id: 'iis-log-acl', name: '웹사이트 로그 디렉터리의 접근 권한(ACL) 보안 취약점 점검', description: '로그 디렉터리에 대한 ACL 설정 및 접근 제어 확인' },
    { id: 'iis-parent-paths', name: '웹사이트의 Enable Parent Paths 활성화 여부 보안 점검', description: 'Parent Paths 설정의 보안 위험도 평가 및 점검' },
    { id: 'iis-classic-asp', name: 'IIS클래식 ASP 사용 현황 및 파일 업로드 제한 관련 종합 보안 점검', description: 'ASP 설정 및 파일 업로드 제한 정책 확인' }
  ],
  
  'WEB_WAS-jeus': [
    { id: 'jeus-webadmin-access', name: '웹 어드민(WebAdmin) 접근 제어 설정 점검', description: 'WebAdmin 콘솔의 접근 제어 및 인증 설정 확인' },
    { id: 'jeus-password-encryption', name: '계정 패스워드 암호화 방식 점검', description: '계정 패스워드의 암호화 방식 및 보안 강도 확인' },
    { id: 'jeus-process-account', name: '프로세스 실행 계정 및 환경설정 경로 점검', description: '프로세스 실행 계정 권한 및 설정 경로 보안 확인' },
    { id: 'jeus-directory-permission', name: '주요 디렉토리 소유자 및 권한 점검', description: '중요 디렉토리의 소유자 및 접근 권한 설정 확인' },
    { id: 'jeus-config-password', name: '주요 설정 파일 내 패스워드 암호화 점검', description: '설정 파일 내 저장된 패스워드의 암호화 상태 확인' },
    { id: 'jeus-http-method', name: '불필요한 HTTP 메소드(HTTP Method) 제한 점검', description: '위험한 HTTP 메소드의 제한 설정 확인' }
  ],
  
  'WEB_WAS-nginx': [
    { id: 'nginx-daemon-permission', name: '데몬 권한 설정 점검', description: '데몬 프로세스의 실행 권한 및 사용자 설정 확인' },
    { id: 'nginx-config-permission', name: '설정 파일 권한 점검', description: '설정 파일의 접근 권한 및 소유자 설정 확인' },
    { id: 'nginx-log-permission', name: '로그 디렉터리 및 로그 파일 권한 점검', description: '로그 디렉터리와 로그 파일의 접근 권한 설정 확인' },
    { id: 'nginx-main-page', name: '메인 페이지(기본 index) 사용 제한 점검', description: '기본 인덱스 페이지의 노출 제한 설정 확인' },
    { id: 'nginx-ssl-config', name: '암호화 통신(SSL) 설정 점검', description: 'SSL/TLS 설정 및 암호화 통신 보안 확인' },
    { id: 'nginx-http-method', name: '취약한 HTTP 메소드 사용 제한 점검', description: '위험한 HTTP 메소드의 차단 설정 확인' },
    { id: 'nginx-error-page', name: '에러 메시지 관리(error_page) 설정 점검', description: '에러 페이지 설정 및 정보 노출 방지 확인' }
  ],
  
  'WEB_WAS-tibero': [
    { id: 'tibero-account-mgmt', name: '계정 관리 현황 점검', description: '데이터베이스 계정 관리 및 권한 설정 확인' },
    { id: 'tibero-account-profile', name: '계정 목적별 프로파일 점검', description: '계정별 프로파일 설정 및 용도별 권한 관리 확인' },
    { id: 'tibero-template-account', name: '(템플릿) 계정 관련 점검', description: '템플릿 계정의 보안 설정 및 권한 관리 확인' }
  ],
  
  'WEB_WAS-tomcat': [
    { id: 'tomcat-port-admin', name: '포트 및 관리자 콘솔 설정 점검', description: '포트 설정 및 관리자 콘솔 접근 제어 확인' },
    { id: 'tomcat-default-account', name: '기본 계정 및 비밀번호 설정 점검', description: '기본 계정의 변경 및 강력한 비밀번호 설정 확인' },
    { id: 'tomcat-password-policy', name: '계정 비밀번호 정책 점검', description: '계정 비밀번호 정책 및 복잡성 요구사항 확인' },
    { id: 'tomcat-account-permission', name: '계정 파일 권한 및 소유자 점검', description: '계정 관련 파일의 권한 및 소유자 설정 확인' },
    { id: 'tomcat-process-permission', name: '프로세스 권한 점검', description: '프로세스의 실행 권한 및 사용자 설정 확인' },
    { id: 'tomcat-directory-permission', name: '주요 디렉토리 권한 및 소유자 점검', description: '중요 디렉토리의 접근 권한 및 소유자 설정 확인' },
    { id: 'tomcat-config-permission', name: '설정 파일 권한 및 소유자 점검', description: '설정 파일의 접근 권한 및 소유자 설정 확인' },
    { id: 'tomcat-webxml-param', name: 'web.xml 파라미터 설정 점검', description: 'web.xml 파일의 보안 관련 파라미터 설정 확인' },
    { id: 'tomcat-log-permission', name: '로그 디렉토리 및 파일 권한 점검', description: '로그 디렉토리와 파일의 접근 권한 설정 확인' },
    { id: 'tomcat-connector-attr', name: 'server.xml Connector 속성 점검', description: 'server.xml의 Connector 보안 속성 설정 확인' },
    { id: 'tomcat-error-page', name: '에러 페이지 설정 점검', description: '에러 페이지 설정 및 정보 노출 방지 확인' },
    { id: 'tomcat-http-method', name: 'HTTP Method 제한 설정 점검', description: '위험한 HTTP 메소드의 제한 설정 확인' },
    { id: 'tomcat-example-directory', name: '예제/불필요 디렉토리 존재 점검', description: '예제 애플리케이션 및 불필요한 디렉토리 제거 확인' },
    { id: 'tomcat-manager-directory', name: 'manager 디렉토리 존재 점검', description: 'manager 애플리케이션의 보안 설정 및 접근 제어 확인' }
  ],
  
  'WEB_WAS-webtob': [
    { id: 'webtob-daemon-mgmt', name: '데몬 관리 점검', description: '데몬 프로세스의 관리 및 보안 설정 확인' },
    { id: 'webtob-directory-browsing', name: '디렉터리 검색 기능 제거 점검', description: '디렉터리 브라우징 기능의 비활성화 상태 확인' },
    { id: 'webtob-error-message', name: '에러 메시지 관리 점검', description: '에러 메시지 설정 및 정보 노출 방지 확인' }
  ]
};

export default function ScriptNew() {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  // 위자드 상태 관리
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.CATEGORY);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCheckItems, setSelectedCheckItems] = useState<string[]>([]);
  const [checklistSearch, setChecklistSearch] = useState(''); // 검색어 상태 추가

  // 뒤로가기
  const handleBack = () => {
    if (currentStep === WizardStep.CHECKLIST) {
      setCurrentStep(WizardStep.CATEGORY);
      setSelectedCategory('');
      setSelectedCheckItems([]);
    }
  };

  // 카테고리 선택
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentStep(WizardStep.CHECKLIST);
  };

  // 옵션 선택 단계는 제거되었습니다

  // 점검 항목 토글
  const handleCheckItemToggle = (itemId: string) => {
    setSelectedCheckItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 스크립트 생성
  const handleCreateScript = () => {
    const scriptConfig = {
      category: selectedCategory,
      checkItems: selectedCheckItems
    };
    
    // 스크립트 에디터로 이동하면서 설정 전달
    navigate(`/prompt-editor?config=${encodeURIComponent(JSON.stringify(scriptConfig))}`);
  };

  // 현재 점검 항목 목록 가져오기
  const getCurrentCheckItems = () => {
    // 선택된 카테고리에 해당하는 모든 옵션의 점검 항목을 합쳐서 보여줍니다
    if (!selectedCategory) return [];

    const aggregated: { id: string; name: string; description: string }[] = [];
    Object.entries(CHECKLIST_TEMPLATES).forEach(([key, list]) => {
      if (key.startsWith(`${selectedCategory}-`)) {
        aggregated.push(...(list as any[]));
      }
    });

    const items = aggregated;

    if (checklistSearch.trim() === '') {
      return items;
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(checklistSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(checklistSearch.toLowerCase())
    );
  };

  // 진행률 계산
  const getProgress = () => {
    switch (currentStep) {
      case WizardStep.CATEGORY: return 50;
      case WizardStep.CHECKLIST: return 100;
      default: return 0;
    }
  };

  return (
    <PageTransition className="container mx-auto px-4 py-6 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-primary">새 스크립트 생성</h1>
        <p className="text-sm text-muted-foreground">위자드를 통해 맞춤형 보안 검사 스크립트를 생성하세요</p>
        
        {/* 진행률 표시 */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>진행률</span>
            <span>{getProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 네비게이션 브레드크럼 */}
      {currentStep !== WizardStep.CATEGORY && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            이전
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span>{CATEGORIES[selectedCategory as keyof typeof CATEGORIES]?.title}</span>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8">
          {/* 1단계: 카테고리 선택 */}
          {currentStep === WizardStep.CATEGORY && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <CardTitle className="text-xl">점검 카테고리 선택</CardTitle>
                <CardDescription className="text-sm">어떤 시스템을 점검하시겠습니까?</CardDescription>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(CATEGORIES).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <Card 
                      key={key}
                      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${category.borderColor} border-2`}
                      onClick={() => handleCategorySelect(key)}
                    >
                      <CardContent className="p-6 text-center space-y-4">
                        <div className={`p-4 rounded-full ${category.bgColor} mx-auto w-fit`}>
                          <IconComponent className={`h-8 w-8 ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{category.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2">{category.description}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <ArrowRight className={`h-5 w-5 ${category.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 옵션 선택 단계는 제거되었습니다 */}

          {/* 2단계: 점검 항목 선택 */}
          {currentStep === WizardStep.CHECKLIST && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <CardTitle className="text-xl">점검 항목 선택</CardTitle>
                <CardDescription className="text-sm">선택한 카테고리의 점검 항목을 선택하세요</CardDescription>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="점검 항목 검색..."
                  value={checklistSearch}
                  onChange={(e) => setChecklistSearch(e.target.value)}
                  className="pl-10 border-primary/50 focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getCurrentCheckItems().map((item) => (
                  <Card 
                    key={item.id}
                    className={`cursor-pointer transition-all duration-200 flex items-center ${
                      selectedCheckItems.includes(item.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/40'
                    }`}
                    onClick={() => handleCheckItemToggle(item.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3 w-full">
                      <div className={`rounded-full p-1 text-xs ${
                        selectedCheckItems.includes(item.id) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {getCurrentCheckItems().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>검색 결과가 없습니다.</p>
                </div>
              )}

              {selectedCheckItems.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary">
                        {selectedCheckItems.length}개 항목 선택됨
                      </Badge>
                    </div>
                    <Button onClick={handleCreateScript} size="lg">
                      스크립트 생성하기
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </PageTransition>
  );
}