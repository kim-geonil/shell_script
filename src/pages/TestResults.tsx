import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';

export default function TestResults() {
  const testResults = [
    { id: 1, name: 'System Security Check', status: 'passed', score: 95, date: '2024-01-15' },
    { id: 2, name: 'User Account Audit', status: 'failed', score: 60, date: '2024-01-14' },
    { id: 3, name: 'File Permission Check', status: 'warning', score: 80, date: '2024-01-13' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      warning: 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">테스트 결과</h1>
          <p className="text-muted-foreground">보안 검사 실행 결과를 확인하세요</p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          새 테스트 실행
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 테스트 결과</CardTitle>
          <CardDescription>실행한 보안 검사 결과 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>테스트명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>점수</TableHead>
                <TableHead>실행일</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.name}
                  </TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell>{result.score}/100</TableCell>
                  <TableCell>{result.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">상세보기</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}