import React, { useState, useEffect } from 'react';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Send, Sparkles, Check, X, ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import { AIService } from '../services/aiService';

const PromptEditor = () => {
  const [promptContent, setPromptContent] = useState('');
  const [previousPromptContent, setPreviousPromptContent] = useState('');
  const [diffResult, setDiffResult] = useState<[number, string][] | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'diff'>('edit');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configStr = params.get('config');
    
    const loadPromptContent = async (checkItems: string[]) => {
      let content = '### 스크립트 지침 프롬프트 ###\n\n';
      for (const item of checkItems) {
        // 'u102-shell-check' -> 'u102'
        const fileId = item.split('-')[0]; 
        
        try {
          // 동적 import를 사용하여 md 파일 로드
          const module = await import(`../../template/${fileId}_script_analysis.md?raw`);
          content += `--- START OF ${fileId} ---\n\n`;
          content += module.default;
          content += `\n\n--- END OF ${fileId} ---\n\n`;
        } catch (e) {
          console.warn(`Could not load template for ${item}:`, e);
          content += `--- ERROR: ${item}에 대한 템플릿을 불러올 수 없습니다. ---\n\n`;
        }
      }
      setPromptContent(content);
    };

    if (configStr) {
      const config = JSON.parse(decodeURIComponent(configStr));
      if (config.checkItems && config.checkItems.length > 0) {
        loadPromptContent(config.checkItems);
      }
    }
  }, []);

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newMessages = [...chatMessages, { role: 'user' as const, content: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      setPreviousPromptContent(promptContent);
      const response = await AIService.refinePrompt({
        originalPrompt: promptContent,
        conversation: newMessages,
      });
      
      const dmp = new diff_match_patch();
      const diff = dmp.diff_main(promptContent, response.refinedPrompt);
      dmp.diff_cleanupSemantic(diff);

      setDiffResult(diff);
      setViewMode('diff');
      
      setChatMessages([...newMessages, { role: 'assistant', content: response.explanation }]);

    } catch (error) {
      console.error("AI 응답 처리 중 오류 발생:", error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setChatMessages([...newMessages, { role: 'assistant', content: `죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptChanges = () => {
    if (diffResult) {
      const dmp = new diff_match_patch();
      const patches = dmp.patch_make(previousPromptContent, diffResult);
      const [newText] = dmp.patch_apply(patches, previousPromptContent);
      setPromptContent(newText);
    }
    setViewMode('edit');
    setDiffResult(null);
  };

  const handleRejectChanges = () => {
    setViewMode('edit');
    setDiffResult(null);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <PageTransition className="p-4 sm:p-6 lg:p-8 h-screen flex flex-col">
      {/* 헤더 - 뒤로가기 버튼 */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">스크립트 지침 프롬프트 편집기</h1>
          <p className="text-sm text-muted-foreground mt-1">AI와 대화하여 스크립트 지침을 개선하세요</p>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left: Script Prompting */}
        <Card className="lg:col-span-2 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              스크립트 지침 프롬프팅
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            {viewMode === 'edit' ? (
              <Textarea
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                className="w-full h-full resize-none text-sm flex-grow"
                placeholder="이곳에 스크립트 지침을 작성하거나 AI와 대화하여 수정하세요."
              />
            ) : (
              <div className="w-full h-full overflow-y-auto p-4 border rounded-md bg-muted/20 whitespace-pre-wrap text-sm flex-grow">
                {diffResult?.map(([op, text], index) => {
                  const style =
                    op === DIFF_INSERT
                      ? { backgroundColor: 'rgba(60, 179, 113, 0.3)', textDecoration: 'underline' }
                      : op === DIFF_DELETE
                      ? { backgroundColor: 'rgba(255, 99, 71, 0.3)', textDecoration: 'line-through' }
                      : {};
                  return (
                    <span key={index} style={style}>
                      {text}
                    </span>
                  );
                })}
              </div>
            )}
          </CardContent>
          {viewMode === 'diff' && (
            <CardFooter className="justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleRejectChanges}>
                <X className="h-4 w-4 mr-2" />
                변경 취소
              </Button>
              <Button onClick={handleAcceptChanges}>
                <Check className="h-4 w-4 mr-2" />
                변경 사항 적용
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Right: AI Chat */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-base">AI 채팅</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 bg-muted/50 rounded-lg mb-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-sm text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-lg bg-background text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-primary/80 rounded-full animate-pulse delay-100"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-200"></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">AI가 생각하고 있어요</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="스크립트 지침 수정 요청..."
                className="pr-16 text-sm"
                rows={2}
              />
              <Button
                size="icon"
                className="absolute right-2 bottom-2"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default PromptEditor;