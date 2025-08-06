import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { FileText, MoreHorizontal } from 'lucide-react';

export function RecentScripts() {
  const scripts = [
    { name: 'User Account Audit', type: 'U-102', modified: '2시간 전' },
    { name: 'File Permission Check', type: 'U-106', modified: '5시간 전' },
    { name: 'Password Policy', type: 'U-103', modified: '1일 전' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 스크립트</CardTitle>
        <CardDescription>최근에 수정된 스크립트 목록</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scripts.map((script, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{script.name}</p>
                <p className="text-sm text-muted-foreground">{script.modified}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{script.type}</Badge>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}