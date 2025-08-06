import React from 'react';
import { 
  Play, 
  Save, 
  Undo2, 
  Redo2, 
  Search, 
  Replace,
  Download,
  Upload,
  Settings,
  Maximize2,
  Minimize2,
  FileText,
  FolderOpen,
  Copy,
  Scissors,
  Clipboard,
  Type,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { Badge } from '../../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { useAppDispatch, useEditor } from '../../hooks/redux';
import { EditorTab } from '../../types/editor';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';

interface EditorToolbarProps {
  className?: string;
  onSave?: () => void;
  onRun?: () => void;
  onValidate?: () => void;
  onFormat?: () => void;
  onFind?: () => void;
  onReplace?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  validationResult?: {
    isValid: boolean;
    errors: any[];
    warnings: any[];
    suggestions: any[];
  };
}

export default function EditorToolbar({
  className,
  onSave,
  onRun,
  onValidate,
  onFormat,
  onFind,
  onReplace,
  onDownload,
  onUpload,
  onToggleFullscreen,
  isFullscreen = false,
  validationResult
}: EditorToolbarProps) {
  const dispatch = useAppDispatch();
  const editorState = useEditor();

  const activeTab = editorState.tabs.find(tab => tab.isActive);
  const hasUnsavedChanges = editorState.tabs.some(tab => tab.isDirty);

  // File operations
  const handleNewFile = () => {
    // This would be handled by the parent component or tabs component
    toast.success('새 파일 생성');
  };

  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sh,.bash,.txt';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && onUpload) {
        onUpload();
      }
    };
    input.click();
  };

  // Edit operations
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(''); // Would get selected text from editor
      toast.success('복사됨');
    } catch (err) {
      toast.error('복사 실패');
    }
  };

  const handleCut = async () => {
    try {
      await navigator.clipboard.writeText(''); // Would get selected text from editor
      toast.success('잘라냄');
    } catch (err) {
      toast.error('잘라내기 실패');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Would paste into editor
      toast.success('붙여넣기 완료');
    } catch (err) {
      toast.error('붙여넣기 실패');
    }
  };

  // Get validation status for display
  const getValidationStatus = () => {
    if (!validationResult) return null;

    if (validationResult.isValid) {
      return {
        icon: CheckCircle2,
        text: '유효함',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        count: 0
      };
    } else {
      return {
        icon: AlertTriangle,
        text: '오류',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        count: validationResult.errors.length
      };
    }
  };

  const validationStatus = getValidationStatus();

  return (
    <TooltipProvider>
      <div className={cn(
        'flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}>
        {/* Left side - File & Edit operations */}
        <div className="flex items-center gap-1">
          {/* File operations */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                파일
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>파일</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleNewFile}>
                <FileText className="h-4 w-4 mr-2" />
                새 파일
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenFile}>
                <FolderOpen className="h-4 w-4 mr-2" />
                열기
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSave} disabled={!hasUnsavedChanges}>
                <Save className="h-4 w-4 mr-2" />
                저장
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onUpload}>
                <Upload className="h-4 w-4 mr-2" />
                업로드
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit operations */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                편집
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>편집</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Undo2 className="h-4 w-4 mr-2" />
                실행 취소
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Redo2 className="h-4 w-4 mr-2" />
                다시 실행
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                복사
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCut}>
                <Scissors className="h-4 w-4 mr-2" />
                잘라내기
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePaste}>
                <Clipboard className="h-4 w-4 mr-2" />
                붙여넣기
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onFind}>
                <Search className="h-4 w-4 mr-2" />
                찾기
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+F</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReplace}>
                <Replace className="h-4 w-4 mr-2" />
                바꾸기
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+H</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-4" />

          {/* Quick action buttons */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onSave}
                disabled={!hasUnsavedChanges}
                className={hasUnsavedChanges ? 'text-orange-600' : ''}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>저장 (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onFormat}>
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>코드 포맷</TooltipContent>
          </Tooltip>
        </div>

        {/* Center - Current file info */}
        <div className="flex items-center gap-2">
          {activeTab && (
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-md">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{activeTab.title}</span>
              {activeTab.isDirty && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Validation status */}
          {validationStatus && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'gap-1 cursor-pointer',
                    validationStatus.color
                  )}
                  onClick={onValidate}
                >
                  <validationStatus.icon className="h-3 w-3" />
                  {validationStatus.text}
                  {validationStatus.count > 0 && (
                    <span className="ml-1">({validationStatus.count})</span>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                클릭하여 유효성 검사 실행
              </TooltipContent>
            </Tooltip>
          )}

          <Separator orientation="vertical" className="h-4" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onRun}
                className="text-green-600 hover:text-green-700"
              >
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>스크립트 실행</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onValidate}>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>유효성 검사</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-4" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onToggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? '전체화면 해제' : '전체화면'}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>에디터 설정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                테마 설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                글꼴 설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                키보드 단축키
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                에디터 환경설정
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}