import React, { useState } from 'react';
// React Router를 사용하지 않으므로 import 제거
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft,
  Save,
  Play,
  Download,
  Share,
  Settings,
  FileText,
  Terminal,
  Clock,
  User,
  Tag
} from 'lucide-react';

// 임시 스크립트 데이터 (실제로는 Redux store에서 가져올 예정)
const getScriptById = (id: string) => {
  const scripts = {
    '1': {
      id: '1',
      title: 'U-102 사용자 계정 보안 검사',
      description: '시스템의 사용자 계정 설정과 보안 정책을 검사합니다.',
      templateType: 'U-102',
      status: 'approved',
      version: '1.2',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'admin',
      tags: ['user-account', 'security', 'basic'],
      content: `#!/bin/bash
# U-102: 사용자 계정 보안 검사
# 작성자: NcuScript Automator
# 버전: 1.2

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

echo "=== U-102 검사 완료 ==="`
    }
  };
  
  return scripts[id as keyof typeof scripts] || null;
};

export default function ScriptDetail() {
  // URL에서 스크립트 ID 추출
  const getCurrentId = () => {
    const path = window.location.pathname;
    const parts = path.split('/scripts/');
    return parts.length > 1 ? parts[1] : null;
  };
  
  const id = getCurrentId();
  
  // 커스텀 네비게이션 함수
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };
  
  const [isEditing, setIsEditing] = useState(false);
  
  // 스크립트 데이터 가져오기
  const script = id ? getScriptById(id) : null;
  
  // 편집 가능한 필드들
  const [editedScript, setEditedScript] = useState({
    title: script?.title || '',
    description: script?.description || '',
    content: script?.content || '',
    tags: script?.tags.join(', ') || ''
  });

  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">스크립트를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">
          요청하신 스크립트가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button onClick={() => navigate('/scripts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          스크립트 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인됨</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">테스트 중</Badge>;
      case 'draft':
        return <Badge variant="secondary">초안</Badge>;
      case 'failed':
        return <Badge variant="destructive">실패</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const handleSave = () => {
    // 실제로는 Redux action을 dispatch하여 저장
    console.log('스크립트 저장:', editedScript);
    setIsEditing(false);
    // TODO: API 호출하여 스크립트 업데이트
  };

  const handleRun = () => {
    // 실제로는 스크립트 실행 로직
    console.log('스크립트 실행:', script.id);
    navigate(`/scripts/${script.id}/run`);
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/scripts')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditing ? '스크립트 편집' : script.title}
              </h1>
              {getStatusBadge(script.status)}
              <Badge variant="outline">{script.templateType}</Badge>
            </div>
            <p className="text-muted-foreground">
              {script.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                편집
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button onClick={handleRun}>
                <Play className="h-4 w-4 mr-2" />
                실행
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">스크립트 내용</TabsTrigger>
          <TabsTrigger value="info">정보</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보 편집</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">제목</label>
                    <Input
                      value={editedScript.title}
                      onChange={(e) => setEditedScript({...editedScript, title: e.target.value})}
                      placeholder="스크립트 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">설명</label>
                    <Textarea
                      value={editedScript.description}
                      onChange={(e) => setEditedScript({...editedScript, description: e.target.value})}
                      placeholder="스크립트 설명을 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">태그 (쉼표로 구분)</label>
                    <Input
                      value={editedScript.tags}
                      onChange={(e) => setEditedScript({...editedScript, tags: e.target.value})}
                      placeholder="예: security, basic, user-account"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    스크립트 내용 편집
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editedScript.content}
                    onChange={(e) => setEditedScript({...editedScript, content: e.target.value})}
                    placeholder="Bash 스크립트 내용을 입력하세요"
                    rows={20}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  스크립트 내용
                </CardTitle>
                <CardDescription>
                  현재 스크립트의 Bash 코드입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                  {script.content}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  스크립트 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">템플릿 유형:</span>
                  <Badge variant="outline">{script.templateType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상태:</span>
                  {getStatusBadge(script.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">버전:</span>
                  <span>v{script.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">생성자:</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {script.createdBy}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  타임스탬프
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">생성일:</span>
                  <span>{script.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수정일:</span>
                  <span>{script.updatedAt}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                태그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {script.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                스크립트 설정
              </CardTitle>
              <CardDescription>
                스크립트 실행 환경과 권한을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">실행 환경</label>
                <Select defaultValue="bash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bash">Bash</SelectItem>
                    <SelectItem value="sh">Shell</SelectItem>
                    <SelectItem value="zsh">Zsh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">권한 수준</label>
                <Select defaultValue="root">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">일반 사용자</SelectItem>
                    <SelectItem value="sudo">Sudo 권한</SelectItem>
                    <SelectItem value="root">Root 권한</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">타임아웃 (초)</label>
                <Input type="number" defaultValue="300" min="1" max="3600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}