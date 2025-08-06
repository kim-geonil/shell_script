import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { useAuth, useAppDispatch } from '../hooks/redux';
import { logout, updateUser } from '../store/slices/authSlice';
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Save,
  Key,
  Globe
} from 'lucide-react';

export default function Settings() {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  
  // 프로필 설정 상태
  const [profileData, setProfileData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    role: auth.user?.role || 'user'
  });

  // 알림 설정 상태
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    scriptCompletionNotifications: true,
    securityAlerts: true,
    weeklyReports: false
  });

  // 에디터 설정 상태
  const [editorSettings, setEditorSettings] = useState({
    theme: 'dark',
    fontSize: '14',
    wordWrap: true,
    autoSave: true,
    showLineNumbers: true
  });

  // 보안 설정 상태
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    allowMultipleSessions: false,
    requirePasswordChange: false
  });

  const handleSaveProfile = () => {
    dispatch(updateUser(profileData));
    console.log('프로필 저장:', profileData);
    // TODO: 성공 토스트 표시
  };

  const handleSaveNotifications = () => {
    console.log('알림 설정 저장:', notificationSettings);
    // TODO: API 호출하여 설정 저장
  };

  const handleSaveEditor = () => {
    console.log('에디터 설정 저장:', editorSettings);
    // TODO: 로컬 스토리지에 저장
  };

  const handleSaveSecurity = () => {
    console.log('보안 설정 저장:', securitySettings);
    // TODO: API 호출하여 보안 설정 저장
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleExportData = () => {
    console.log('데이터 내보내기');
    // TODO: 사용자 데이터 내보내기 구현
  };

  const handleImportData = () => {
    console.log('데이터 가져오기');
    // TODO: 데이터 가져오기 구현
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('계정 삭제');
      // TODO: 계정 삭제 API 호출
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-muted-foreground">
          계정, 알림, 보안 및 에디터 설정을 관리하세요.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="editor">에디터</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
          <TabsTrigger value="data">데이터</TabsTrigger>
        </TabsList>

        {/* 프로필 설정 */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                프로필 정보
              </CardTitle>
              <CardDescription>
                기본 프로필 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">역할</Label>
                <Select 
                  value={profileData.role} 
                  onValueChange={(value) => setProfileData({...profileData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">일반 사용자</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                    <SelectItem value="auditor">감사자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                프로필 저장
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                비밀번호 변경
              </CardTitle>
              <CardDescription>
                계정 보안을 위해 주기적으로 비밀번호를 변경하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>비밀번호 변경</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                알림 설정
              </CardTitle>
              <CardDescription>
                받고 싶은 알림을 선택하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    중요한 업데이트를 이메일로 받습니다.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({...notificationSettings, emailNotifications: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="script-completion">스크립트 완료 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    스크립트 실행이 완료되면 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  id="script-completion"
                  checked={notificationSettings.scriptCompletionNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({...notificationSettings, scriptCompletionNotifications: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security-alerts">보안 경고</Label>
                  <p className="text-sm text-muted-foreground">
                    보안 문제가 발견되면 즉시 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({...notificationSettings, securityAlerts: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">주간 보고서</Label>
                  <p className="text-sm text-muted-foreground">
                    매주 활동 요약 보고서를 받습니다.
                  </p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({...notificationSettings, weeklyReports: checked})
                  }
                />
              </div>
              
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                알림 설정 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 에디터 설정 */}
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                에디터 설정
              </CardTitle>
              <CardDescription>
                코드 에디터의 모양과 동작을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="editor-theme">테마</Label>
                  <Select 
                    value={editorSettings.theme} 
                    onValueChange={(value) => setEditorSettings({...editorSettings, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">다크</SelectItem>
                      <SelectItem value="light">라이트</SelectItem>
                      <SelectItem value="high-contrast">고대비</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">글꼴 크기</Label>
                  <Select 
                    value={editorSettings.fontSize} 
                    onValueChange={(value) => setEditorSettings({...editorSettings, fontSize: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="word-wrap">자동 줄바꿈</Label>
                  <Switch
                    id="word-wrap"
                    checked={editorSettings.wordWrap}
                    onCheckedChange={(checked) => 
                      setEditorSettings({...editorSettings, wordWrap: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save">자동 저장</Label>
                  <Switch
                    id="auto-save"
                    checked={editorSettings.autoSave}
                    onCheckedChange={(checked) => 
                      setEditorSettings({...editorSettings, autoSave: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="line-numbers">줄 번호 표시</Label>
                  <Switch
                    id="line-numbers"
                    checked={editorSettings.showLineNumbers}
                    onCheckedChange={(checked) => 
                      setEditorSettings({...editorSettings, showLineNumbers: checked})
                    }
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveEditor}>
                <Save className="h-4 w-4 mr-2" />
                에디터 설정 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                보안 설정
              </CardTitle>
              <CardDescription>
                계정 보안을 강화하는 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">2단계 인증</Label>
                  <p className="text-sm text-muted-foreground">
                    추가 보안을 위해 2단계 인증을 사용합니다.
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">세션 타임아웃 (분)</Label>
                <Select 
                  value={securitySettings.sessionTimeout} 
                  onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15분</SelectItem>
                    <SelectItem value="30">30분</SelectItem>
                    <SelectItem value="60">1시간</SelectItem>
                    <SelectItem value="120">2시간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="multiple-sessions">다중 세션 허용</Label>
                  <p className="text-sm text-muted-foreground">
                    여러 기기에서 동시 로그인을 허용합니다.
                  </p>
                </div>
                <Switch
                  id="multiple-sessions"
                  checked={securitySettings.allowMultipleSessions}
                  onCheckedChange={(checked) => 
                    setSecuritySettings({...securitySettings, allowMultipleSessions: checked})
                  }
                />
              </div>
              
              <Button onClick={handleSaveSecurity}>
                <Save className="h-4 w-4 mr-2" />
                보안 설정 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 데이터 관리 */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                데이터 관리
              </CardTitle>
              <CardDescription>
                사용자 데이터를 내보내거나 가져올 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  데이터 내보내기
                </Button>
                <Button variant="outline" onClick={handleImportData}>
                  <Upload className="h-4 w-4 mr-2" />
                  데이터 가져오기
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                스크립트, 설정, 테스트 결과 등 모든 데이터를 백업하거나 복원할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                위험한 작업
              </CardTitle>
              <CardDescription>
                다음 작업들은 되돌릴 수 없습니다. 신중하게 진행하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleLogout}>
                  모든 기기에서 로그아웃
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  계정 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}