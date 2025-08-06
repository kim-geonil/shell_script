import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { FileText, Play, CheckCircle, AlertTriangle } from 'lucide-react';

export function StatsGrid() {
  const stats = [
    { title: '총 스크립트', value: '24', icon: FileText, description: '생성된 스크립트 개수' },
    { title: '실행 횟수', value: '156', icon: Play, description: '오늘 실행된 테스트' },
    { title: '성공률', value: '94%', icon: CheckCircle, description: '지난 30일 평균' },
    { title: '경고 항목', value: '3', icon: AlertTriangle, description: '주의가 필요한 항목' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}