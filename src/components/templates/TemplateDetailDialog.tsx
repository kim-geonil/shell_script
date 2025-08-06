import React from 'react';
import { SecurityTemplate } from '../../types/template';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { 
  Download, 
  Star, 
  Clock, 
  User, 
  Shield, 
  Copy,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag
} from 'lucide-react';

interface TemplateDetailDialogProps {
  template: SecurityTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (template: SecurityTemplate) => void;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const categoryIcons = {
  'user-security': '👤',
  'access-control': '🔐',
  'system-security': '🛡️'
};

export default function TemplateDetailDialog({ 
  template, 
  isOpen, 
  onClose, 
  onUse 
}: TemplateDetailDialogProps) {
  if (!template) return null;

  const difficultyText = {
    beginner: '초급',
    intermediate: '중급', 
    advanced: '고급'
  };

  const categoryText = {
    'user-security': '사용자 보안',
    'access-control': '접근 제어',
    'system-security': '시스템 보안'
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(template.scriptContent);
      // TODO: Toast 알림 추가
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{categoryIcons[template.category]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono">
                  {template.code}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={difficultyColors[template.difficulty]}
                >
                  {difficultyText[template.difficulty]}
                </Badge>
                <Badge variant="outline">
                  {categoryText[template.category]}
                </Badge>
              </div>
              <DialogTitle className="text-xl">
                {template.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {template.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-lg mb-3">📋 기본 정보</h3>
              <p className="text-muted-foreground mb-4">
                {template.description}
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">작성자</div>
                    <div className="font-medium">{template.author}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">예상 시간</div>
                    <div className="font-medium">{template.estimatedTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">다운로드</div>
                    <div className="font-medium">{template.downloadCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div>
                    <div className="text-sm">평점</div>
                    <div className="font-medium">{template.rating}/5.0</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 태그 */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 요구사항 */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                실행 요구사항
              </h3>
              <ul className="space-y-2">
                {template.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* 스크립트 내용 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  스크립트 내용
                </h3>
                <Button variant="outline" size="sm" onClick={handleCopyScript}>
                  <Copy className="h-4 w-4 mr-1" />
                  복사
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {template.scriptContent}
                </pre>
              </div>
            </div>

            <Separator />

            {/* 버전 정보 */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                버전 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">버전:</span>
                  <span className="ml-2 font-medium">{template.version}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">생성일:</span>
                  <span className="ml-2 font-medium">{template.createdAt}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">수정일:</span>
                  <span className="ml-2 font-medium">{template.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            닫기
          </Button>
          <Button 
            onClick={() => {
              onUse(template);
              onClose();
            }}
            className="flex-1"
          >
            <Shield className="h-4 w-4 mr-2" />
            템플릿 사용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}