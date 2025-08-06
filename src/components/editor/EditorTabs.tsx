import React from 'react';
import { X, Plus, Save, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../../components/ui/context-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { useAppDispatch, useEditor } from '../../hooks/redux';
import { createTab, closeTab, setActiveTab, saveTab } from '../store/slices/editorSlice';
import { EditorTab } from '../../types/editor';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';

interface EditorTabsProps {
  className?: string;
  maxTabs?: number;
  showNewTabButton?: boolean;
}

export default function EditorTabs({
  className,
  maxTabs = 10,
  showNewTabButton = true
}: EditorTabsProps) {
  const dispatch = useAppDispatch();
  const editorState = useEditor();
  const [tabToClose, setTabToClose] = React.useState<string | null>(null);

  // Create new tab
  const handleCreateTab = () => {
    if (editorState.tabs.length >= maxTabs) {
      toast.error(`최대 ${maxTabs}개의 탭만 열 수 있습니다`);
      return;
    }

    const newTab: Omit<EditorTab, 'id'> = {
      title: `새 스크립트 ${editorState.tabs.length + 1}`,
      content: '#!/bin/bash\n\n# 새로운 보안 검사 스크립트\n',
      language: 'bash',
      isDirty: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    dispatch(createTab(newTab));
  };

  // Close tab with confirmation if dirty
  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const tab = editorState.tabs.find(t => t.id === tabId);
    if (tab?.isDirty) {
      setTabToClose(tabId);
    } else {
      dispatch(closeTab(tabId));
    }
  };

  // Confirm close dirty tab
  const confirmCloseTab = () => {
    if (tabToClose) {
      dispatch(closeTab(tabToClose));
      setTabToClose(null);
    }
  };

  // Save tab
  const handleSaveTab = (tabId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    dispatch(saveTab(tabId));
    toast.success('스크립트가 저장되었습니다');
  };

  // Save all tabs
  const handleSaveAllTabs = () => {
    const dirtyTabs = editorState.tabs.filter(tab => tab.isDirty);
    dirtyTabs.forEach(tab => dispatch(saveTab(tab.id)));
    toast.success(`${dirtyTabs.length}개의 스크립트가 저장되었습니다`);
  };

  // Close all tabs
  const handleCloseAllTabs = () => {
    const dirtyTabs = editorState.tabs.filter(tab => tab.isDirty);
    if (dirtyTabs.length > 0) {
      toast.error('저장되지 않은 탭이 있습니다. 먼저 저장해주세요.');
      return;
    }

    editorState.tabs.forEach(tab => dispatch(closeTab(tab.id)));
  };

  // Close other tabs
  const handleCloseOtherTabs = (currentTabId: string) => {
    const otherTabs = editorState.tabs.filter(tab => tab.id !== currentTabId);
    const dirtyOtherTabs = otherTabs.filter(tab => tab.isDirty);
    
    if (dirtyOtherTabs.length > 0) {
      toast.error('저장되지 않은 탭이 있습니다. 먼저 저장해주세요.');
      return;
    }

    otherTabs.forEach(tab => dispatch(closeTab(tab.id)));
  };

  // Get tab display name
  const getTabDisplayName = (tab: EditorTab) => {
    let name = tab.title;
    if (name.length > 20) {
      name = name.substring(0, 17) + '...';
    }
    return name;
  };

  // Get tab icon based on content
  const getTabIcon = (tab: EditorTab) => {
    if (tab.language === 'bash') {
      return <FileText className="w-3 h-3" />;
    }
    return <FileText className="w-3 h-3" />;
  };

  return (
    <>
      <div className={cn('flex items-center bg-muted/30 border-b', className)}>
        <div className="flex-1 flex items-center min-w-0">
          <Tabs 
            value={editorState.activeTabId || ''} 
            onValueChange={(tabId) => dispatch(setActiveTab(tabId))}
            className="w-full"
          >
            <TabsList className="h-auto p-0 bg-transparent justify-start w-full">
              {editorState.tabs.map((tab) => (
                <ContextMenu key={tab.id}>
                  <ContextMenuTrigger asChild>
                    <TabsTrigger
                      value={tab.id}
                      className={cn(
                        'relative h-10 px-3 rounded-none border-r data-[state=active]:bg-background',
                        'data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary',
                        'hover:bg-accent/50 transition-colors',
                        'group min-w-0 max-w-48 flex items-center gap-2'
                      )}
                    >
                      {getTabIcon(tab)}
                      <span className="truncate flex-1 min-w-0 text-sm">
                        {getTabDisplayName(tab)}
                      </span>
                      
                      {tab.isDirty && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => handleCloseTab(tab.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TabsTrigger>
                  </ContextMenuTrigger>
                  
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => dispatch(setActiveTab(tab.id))}>
                      탭 활성화
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem 
                      onClick={(e) => handleSaveTab(tab.id, e)}
                      disabled={!tab.isDirty}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => handleCloseTab(tab.id)}>
                      탭 닫기
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleCloseOtherTabs(tab.id)}>
                      다른 탭 모두 닫기
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleCloseAllTabs}>
                      모든 탭 닫기
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Actions */}
        <div className="flex items-center gap-1 px-2 flex-shrink-0">
          {showNewTabButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleCreateTab}
              disabled={editorState.tabs.length >= maxTabs}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}

          {editorState.tabs.some(tab => tab.isDirty) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-orange-600 hover:text-orange-700"
              onClick={handleSaveAllTabs}
            >
              <Save className="h-3 w-3 mr-1" />
              모두 저장
            </Button>
          )}

          <Badge variant="outline" className="ml-2 text-xs">
            {editorState.tabs.length}/{maxTabs}
          </Badge>
        </div>
      </div>

      {/* Confirm close dialog */}
      <AlertDialog open={!!tabToClose} onOpenChange={() => setTabToClose(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              저장되지 않은 변경사항
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 탭에는 저장되지 않은 변경사항이 있습니다. 
              저장하지 않고 닫으면 변경사항이 손실됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTabToClose(null)}>
              취소
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                if (tabToClose) {
                  handleSaveTab(tabToClose);
                  dispatch(closeTab(tabToClose));
                  setTabToClose(null);
                }
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              저장 후 닫기
            </Button>
            <AlertDialogAction onClick={confirmCloseTab}>
              저장하지 않고 닫기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}