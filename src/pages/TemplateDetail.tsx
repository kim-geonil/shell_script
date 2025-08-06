import React from 'react';
// React Router를 사용하지 않으므로 import 제거
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft,
  Download,
  Star,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  FileText,
  Terminal,
  Play,
  Copy
} from 'lucide-react';

// 임시 템플릿 데이터 (실제로는 Redux store에서 가져올 예정)
const getTemplateById = (id: string) => {
  const templates = {
    'u102-basic': {
      id: 'u102-basic',
      code: 'U-102',
      title: '사용자 계정 보안 검사',
      description: '시스템의 사용자 계정 설정과 보안 정책을 검사합니다.',
      category: 'user-security',
      difficulty: 'beginner',
      author: 'NcuScript Team',
      version: '1.0',
      downloadCount: 145,
      rating: 4.5,
      estimatedTime: '3-5분',
      tags: ['user-account', 'password', 'security', 'basic'],
      requirements: [
        'root 권한 필요',
        '/etc/passwd 파일 접근 권한',
        '/etc/shadow 파일 읽기 권한'
      ],
      scriptContent: `#!/bin/bash
# U-102: 사용자 계정 보안 검사
# 작성자: NcuScript Automator
# 버전: 1.0

echo "=== U-102 사용자 계정 보안 검사 시작 ==="

# 1. 패스워드 파일 권한 검사
echo "1. 패스워드 파일 권한 검사"
passwd_perm=$(ls -l /etc/passwd | awk '{print $1}')
shadow_perm=$(ls -l /etc/shadow | awk '{print $1}')

echo "- /etc/passwd 권한: $passwd_perm"
echo "- /etc/shadow 권한: $shadow_perm"

if [[ "$passwd_perm" == "-rw-r--r--" ]]; then
    echo "✅ /etc/passwd 권한이 올바릅니다."
else
    echo "❌ /etc/passwd 권한이 잘못되었습니다."
fi

if [[ "$shadow_perm" == "-rw-------" ]]; then
    echo "✅ /etc/shadow 권한이 올바릅니다."
else
    echo "❌ /etc/shadow 권한이 잘못되었습니다."
fi

# 2. 기본 계정 확인
echo -e "\\n2. 기본 계정 확인"
default_accounts=("daemon" "bin" "sys" "sync" "games" "man" "lp" "mail" "news" "uucp" "proxy" "www-data" "backup" "list" "irc" "gnats" "nobody")

for account in "\${default_accounts[@]}"; do
    if grep -q "^$account:" /etc/passwd; then
        shell=$(grep "^$account:" /etc/passwd | cut -d: -f7)
        if [[ "$shell" == "/bin/false" || "$shell" == "/usr/sbin/nologin" ]]; then
            echo "✅ $account: 로그인 불가 설정됨"
        else
            echo "❌ $account: 로그인 가능 ($shell)"
        fi
    fi
done

# 3. 빈 패스워드 계정 확인
echo -e "\\n3. 빈 패스워드 계정 확인"
empty_pass=$(awk -F: '($2 == "" ) { print $1 }' /etc/shadow 2>/dev/null)
if [[ -z "$empty_pass" ]]; then
    echo "✅ 빈 패스워드 계정이 없습니다."
else
    echo "❌ 빈 패스워드 계정 발견: $empty_pass"
fi

echo -e "\\n=== U-102 검사 완료 ==="`
    },
    'u103-basic': {
      id: 'u103-basic',
      code: 'U-103',
      title: '패스워드 정책 검사',
      description: '시스템의 패스워드 정책 설정을 검사하고 보안 강도를 평가합니다.',
      category: 'user-security',
      difficulty: 'intermediate',
      author: 'NcuScript Team',
      version: '1.0',
      downloadCount: 128,
      rating: 4.3,
      estimatedTime: '5-8분',
      tags: ['password-policy', 'pam', 'security', 'authentication'],
      requirements: [
        'root 권한 필요',
        'PAM 모듈 설정 파일 접근',
        '/etc/login.defs 파일 읽기 권한'
      ],
      scriptContent: `#!/bin/bash
# U-103: 패스워드 정책 검사
# 작성자: NcuScript Automator
# 버전: 1.0

echo "=== U-103 패스워드 정책 검사 시작 ==="

# 1. 패스워드 복잡성 정책 확인
echo "1. 패스워드 복잡성 정책 확인"
if [[ -f /etc/pam.d/common-password ]]; then
    echo "- PAM 설정 파일 확인: /etc/pam.d/common-password"
    
    if grep -q "pam_pwquality" /etc/pam.d/common-password; then
        echo "✅ pam_pwquality 모듈이 설정되어 있습니다."
        
        if [[ -f /etc/security/pwquality.conf ]]; then
            echo "- 패스워드 품질 설정:"
            grep -E "^(minlen|minclass|maxrepeat|dcredit|ucredit|lcredit|ocredit)" /etc/security/pwquality.conf || echo "  기본 설정 사용 중"
        fi
    else
        echo "❌ pam_pwquality 모듈이 설정되지 않았습니다."
    fi
else
    echo "❌ PAM 설정 파일을 찾을 수 없습니다."
fi

echo -e "\\n=== U-103 검사 완료 ==="`
    }
  };
  
  return templates[id as keyof typeof templates] || null;
};

export default function TemplateDetail() {
  // URL에서 템플릿 ID 추출
  const getCurrentId = () => {
    const path = window.location.pathname;
    const parts = path.split('/templates/');
    return parts.length > 1 ? parts[1] : null;
  };
  
  const id = getCurrentId();
  
  // 커스텀 네비게이션 함수
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };
  
  // 템플릿 데이터 가져오기
  const template = id ? getTemplateById(id) : null;

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">템플릿을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">
          요청하신 템플릿이 존재하지 않거나 삭제되었습니다.
        </p>
        <Button onClick={() => navigate('/templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          템플릿 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800">초급</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800">중급</Badge>;
      case 'advanced':
        return <Badge className="bg-red-100 text-red-800">고급</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleUseTemplate = () => {
    // 템플릿을 사용하여 새 스크립트 생성
    navigate(`/scripts/new?template=${template.id}`);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(template.scriptContent);
    // TODO: 토스트 알림 표시
    console.log('스크립트가 클립보드에 복사되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{template.title}</h1>
              <Badge variant="outline" className="text-sm">
                {template.code}
              </Badge>
              {getDifficultyBadge(template.difficulty)}
            </div>
            <p className="text-muted-foreground text-lg">
              {template.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyScript}>
            <Copy className="h-4 w-4 mr-2" />
            스크립트 복사
          </Button>
          <Button onClick={handleUseTemplate}>
            <Play className="h-4 w-4 mr-2" />
            템플릿 사용하기
          </Button>
        </div>
      </div>

      {/* 메타 정보 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {renderStars(template.rating)}
              </div>
              <div className="text-2xl font-bold">{template.rating}</div>
              <p className="text-sm text-muted-foreground">평점</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{template.downloadCount}</div>
              <p className="text-sm text-muted-foreground">다운로드</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{template.estimatedTime}</div>
              <p className="text-sm text-muted-foreground">예상 실행 시간</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-lg font-bold">{template.author}</div>
              <p className="text-sm text-muted-foreground">작성자</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="script">스크립트</TabsTrigger>
          <TabsTrigger value="requirements">요구사항</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>템플릿 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">템플릿 코드:</span>
                  <Badge variant="outline">{template.code}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">카테고리:</span>
                  <span>
                    {template.category === 'user-security' && '사용자 보안'}
                    {template.category === 'access-control' && '접근 제어'}
                    {template.category === 'system-security' && '시스템 보안'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">난이도:</span>
                  {getDifficultyBadge(template.difficulty)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">버전:</span>
                  <span>v{template.version}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>태그</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>상세 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {template.description}
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>검사 항목:</strong> 이 템플릿은 {template.code} 보안 준수 기준에 따라 
                  시스템의 보안 설정을 자동으로 검사합니다. 검사 완료 후 상세한 보고서가 생성되며, 
                  발견된 문제점에 대한 해결 방안을 제시합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                스크립트 내용
              </CardTitle>
              <CardDescription>
                이 템플릿의 전체 Bash 스크립트 코드입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute top-2 right-2 z-10"
                  onClick={handleCopyScript}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  복사
                </Button>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap pr-20">
                  {template.scriptContent}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                시스템 요구사항
              </CardTitle>
              <CardDescription>
                이 템플릿을 실행하기 위해 필요한 조건들입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                주의사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    이 스크립트는 시스템 보안 설정을 검사하므로 관리자 권한이 필요합니다.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    프로덕션 환경에서 실행하기 전에 테스트 환경에서 충분히 검증하세요.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    실행 결과는 시스템 환경에 따라 달라질 수 있습니다.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}