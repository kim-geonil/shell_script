import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, FileText, Play, Download } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { title: '새 스크립트', icon: Plus, description: '새로운 보안 스크립트 생성' },
    { title: '템플릿 사용', icon: FileText, description: '기존 템플릿으로 시작' },
    { title: '테스트 실행', icon: Play, description: '스크립트 실행 및 테스트' },
    { title: '결과 다운로드', icon: Download, description: '최근 결과 다운로드' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 작업</CardTitle>
        <CardDescription>자주 사용하는 기능들</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button key={index} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Icon className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}