import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Play, Code, Eye, FileText, Sparkles, TrendingUp, Shield, Copy, Check } from 'lucide-react';
import { AIService, ImprovementRequest, ImprovementResponse } from '../services/aiService';
import LoadingOverlay from '../components/ui/LoadingOverlay';

interface TestResult {
  id: string;
  timestamp: string;
  scriptName: string;
  originalScript: string;
  testScript: string;
  testCases: string[];
  expectedResults: string[];
  explanation: string;
  status: string;
  results: {
    testCase: string;
    expectedResult: string;
    actualResult: string;
    status: 'passed' | 'failed';
  }[];
  templateId?: string;
  os?: string;
  application?: string;
  improvements?: ImprovementResponse;
}

export default function TestResults() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 테스트 결과 로드
    console.log('📄 TestResults 페이지 마운트됨');
    const savedResults = localStorage.getItem('testResults');
    console.log('💾 로컬스토리지에서 가져온 데이터:', savedResults);
    
    if (savedResults) {
      try {
        const parsedResults: TestResult[] = JSON.parse(savedResults);
        console.log('✅ 파싱된 테스트 결과:', parsedResults);
        setTestResults(parsedResults);
      } catch (error) {
        console.error('❌ 테스트 결과 로드 실패:', error);
      }
    } else {
      console.log('📭 저장된 테스트 결과가 없습니다');
    }
  }, []);

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 페이지 포커스됨 - 데이터 새로고침');
      const savedResults = localStorage.getItem('testResults');
      if (savedResults) {
        try {
          const parsedResults: TestResult[] = JSON.parse(savedResults);
          setTestResults(parsedResults);
        } catch (error) {
          console.error('❌ 데이터 새로고침 실패:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // storage 이벤트 감지 (다른 탭에서 데이터 변경 시)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'testResults' && e.newValue) {
        console.log('📦 Storage 이벤트 감지됨:', e.newValue);
        try {
          const parsedResults: TestResult[] = JSON.parse(e.newValue);
          setTestResults(parsedResults);
        } catch (error) {
          console.error('❌ Storage 이벤트 처리 실패:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedResult) {
        setSelectedResult(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedResult]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (selectedResult) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedResult]);

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
      warning: 'secondary',
      completed: 'default'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const calculateScore = (results: TestResult['results']) => {
    if (results.length === 0) return 0;
    const passedCount = results.filter(r => r.status === 'passed').length;
    return Math.round((passedCount / results.length) * 100);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  const generateImprovements = async (result: TestResult) => {
    if (!AIService.isConfigured()) {
      alert('AI 서비스가 설정되지 않았습니다. OpenRouter API 키를 확인해주세요.');
      return;
    }

    setIsGeneratingImprovements(true);
    
    try {
      console.log('🔧 코드 개선 제안 생성 시작...');
      
      const improvementRequest: ImprovementRequest = {
        originalScript: result.originalScript,
        testResults: result.results,
        templateId: result.templateId || 'unknown',
        os: result.os || 'linux',
        application: result.application || 'general'
      };

      const improvements = await AIService.generateImprovements(improvementRequest);
      
      // 개선 제안을 결과에 추가
      const updatedResult = { ...result, improvements };
      
      // 로컬 스토리지 업데이트
      const updatedResults = testResults.map(r => 
        r.id === result.id ? updatedResult : r
      );
      setTestResults(updatedResults);
      localStorage.setItem('testResults', JSON.stringify(updatedResults));
      
      // 선택된 결과 업데이트
      setSelectedResult(updatedResult);
      
      console.log('✅ 코드 개선 제안 생성 완료!');
      
    } catch (error) {
      console.error('❌ 코드 개선 제안 생성 실패:', error);
      
      let errorMessage = '코드 개선 제안 생성 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('API 키')) {
          errorMessage = '❌ OpenRouter API 키 문제:\n\n' + error.message + '\n\n.env 파일을 확인해주세요.';
        } else if (error.message.includes('401')) {
          errorMessage = '❌ 인증 오류:\nOpenRouter API 키가 유효하지 않습니다.';
        } else if (error.message.includes('429')) {
          errorMessage = '❌ 요청 한도 초과:\n잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = '❌ 오류 발생:\n' + error.message;
        }
      }
      
      alert(errorMessage);
      
    } finally {
      setIsGeneratingImprovements(false);
    }
  };

  const handleCopyScript = async (script: string, itemType: string) => {
    try {
      await navigator.clipboard.writeText(script);
      setCopiedItem(itemType);
      console.log(`📋 ${itemType}이(가) 클립보드에 복사되었습니다.`);
      
      // 2초 후 복사 완료 상태 초기화
      setTimeout(() => {
        setCopiedItem(null);
      }, 2000);
    } catch (error) {
      console.error('❌ 클립보드 복사 실패:', error);
      
      // 폴백: 텍스트 선택 방식
      try {
        const textArea = document.createElement('textarea');
        textArea.value = script;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (result) {
          setCopiedItem(itemType);
          console.log(`📋 ${itemType}이(가) 클립보드에 복사되었습니다. (폴백 방식)`);
          setTimeout(() => {
            setCopiedItem(null);
          }, 2000);
        } else {
          alert('❌ 클립보드 복사에 실패했습니다.');
        }
      } catch (fallbackError) {
        console.error('❌ 폴백 복사도 실패:', fallbackError);
        alert('❌ 클립보드 복사에 실패했습니다.');
      }
    }
  };

  return (
    <LoadingOverlay 
      isLoading={isGeneratingImprovements} 
      loadingText="🔧 AI가 코드 개선 제안을 생성하고 있습니다..."
    >
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">테스트 결과</h1>
          <p className="text-sm text-muted-foreground">AI 기반 보안 스크립트 테스트 결과를 확인하세요</p>
        </div>
        <Button onClick={() => navigate('/scripts/new')}>
          <Play className="w-4 h-4 mr-2" />
          새 테스트 실행
        </Button>
      </div>

      {testResults.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-base font-semibold mb-2">테스트 결과가 없습니다</h3>
            <p className="text-sm text-muted-foreground mb-4">
              스크립트 템플릿 에디터에서 '테스트 실행' 버튼을 클릭하여 첫 번째 테스트를 실행해보세요.
            </p>
            <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted rounded">
              디버깅 정보: 로컬스토리지 키 'testResults' = {localStorage.getItem('testResults') ? '데이터 있음' : '데이터 없음'}
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/scripts/new')}>
                <Code className="w-4 h-4 mr-2" />
                스크립트 편집기로 이동
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('🔄 수동 새로고침');
                  const savedResults = localStorage.getItem('testResults');
                  if (savedResults) {
                    try {
                      const parsedResults: TestResult[] = JSON.parse(savedResults);
                      setTestResults(parsedResults);
                    } catch (error) {
                      console.error('❌ 수동 새로고침 실패:', error);
                    }
                  }
                }}
              >
                새로고침
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">최근 테스트 결과</CardTitle>
              <CardDescription className="text-sm">AI로 생성된 테스트 스크립트 실행 결과 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>테스트명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>성공률</TableHead>
                    <TableHead>실행일시</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="flex items-center gap-2">
                        {getStatusIcon(result.status === 'completed' ? 'passed' : result.status)}
                        {result.scriptName}
                      </TableCell>
                      <TableCell>{getStatusBadge(result.status)}</TableCell>
                      <TableCell>{calculateScore(result.results)}%</TableCell>
                      <TableCell>{formatDate(result.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedResult(result)}
                            className="w-full sm:w-auto"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                          {!result.improvements && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => generateImprovements(result)}
                              disabled={isGeneratingImprovements}
                              className="w-full sm:w-auto"
                            >
                              <Sparkles className="w-4 h-4 mr-1" />
                              AI 개선
                            </Button>
                          )}
                          {result.improvements && (
                            <Badge variant="default" className="justify-center sm:justify-start">
                              <Sparkles className="w-3 h-3 mr-1" />
                              개선 완료
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>

          {/* 상세 결과 모달/다이얼로그 */}
          {selectedResult && (
            <div 
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setSelectedResult(null)}
            >
              <Card 
                className="w-full max-w-6xl max-h-[90vh] bg-background border shadow-lg overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(selectedResult.status === 'completed' ? 'passed' : selectedResult.status)}
                      {selectedResult.scriptName} - 상세 결과
                    </CardTitle>
                    <CardDescription>
                      실행일시: {formatDate(selectedResult.timestamp)}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedResult(null)}
                  >
                    닫기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 overflow-auto flex-1">
                <Tabs defaultValue="results" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="results">테스트 결과</TabsTrigger>
                    <TabsTrigger value="testScript">테스트 스크립트</TabsTrigger>
                    <TabsTrigger value="originalScript">원본 스크립트</TabsTrigger>
                    {selectedResult.improvements && (
                      <TabsTrigger value="improvements">
                        <Sparkles className="w-4 h-4 mr-1" />
                        AI 개선 제안
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="results" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {selectedResult.results.filter(r => r.status === 'passed').length}
                          </div>
                          <div className="text-sm text-muted-foreground">성공</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-red-500">
                            {selectedResult.results.filter(r => r.status === 'failed').length}
                          </div>
                          <div className="text-sm text-muted-foreground">실패</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-500">
                            {calculateScore(selectedResult.results)}%
                          </div>
                          <div className="text-sm text-muted-foreground">성공률</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">테스트 케이스 결과</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                        {selectedResult.results.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                              {result.status === 'passed' ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{result.testCase}</div>
                                <div className="text-xs text-muted-foreground">
                                  예상: {result.expectedResult} | 실제: {result.actualResult}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={result.status === 'passed' ? 'default' : 'destructive'}
                              className="ml-2 flex-shrink-0"
                            >
                              {result.status}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <h4 className="font-semibold">설명</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedResult.explanation}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="testScript">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">생성된 테스트 스크립트</CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyScript(selectedResult.testScript, 'testScript')}
                            className={copiedItem === 'testScript' ? 'border-green-500 text-green-600' : ''}
                          >
                            {copiedItem === 'testScript' ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copiedItem === 'testScript' ? '복사됨!' : '복사'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                          <code>{selectedResult.testScript}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="originalScript">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">원본 스크립트</CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyScript(selectedResult.originalScript, 'originalScript')}
                            className={copiedItem === 'originalScript' ? 'border-green-500 text-green-600' : ''}
                          >
                            {copiedItem === 'originalScript' ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copiedItem === 'originalScript' ? '복사됨!' : '복사'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                          <code>{selectedResult.originalScript}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {selectedResult.improvements && (
                    <TabsContent value="improvements" className="space-y-6">
                      {/* 개선 요약 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-500">
                              {selectedResult.improvements.improvements.length}
                            </div>
                            <div className="text-sm text-muted-foreground">일반 개선사항</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-500">
                              {selectedResult.improvements.securityEnhancements?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">보안 강화</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-500">
                              {selectedResult.improvements.performanceOptimizations?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">성능 최적화</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 개선된 스크립트 */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Code className="w-5 h-5" />
                              개선된 스크립트
                            </CardTitle>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyScript(selectedResult.improvements?.improvedScript || '', 'improvedScript')}
                              className={copiedItem === 'improvedScript' ? 'border-green-500 text-green-600' : ''}
                            >
                              {copiedItem === 'improvedScript' ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              {copiedItem === 'improvedScript' ? '복사됨!' : '복사'}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                            <code>{selectedResult.improvements.improvedScript}</code>
                          </pre>
                        </CardContent>
                      </Card>

                      {/* 개선사항 목록 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            주요 개선사항
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedResult.improvements.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <p className="text-sm">{improvement}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* 보안 강화사항 */}
                      {selectedResult.improvements.securityEnhancements && selectedResult.improvements.securityEnhancements.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              보안 강화사항
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedResult.improvements.securityEnhancements.map((enhancement, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                <p className="text-sm">{enhancement}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* 성능 최적화사항 */}
                      {selectedResult.improvements.performanceOptimizations && selectedResult.improvements.performanceOptimizations.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              성능 최적화사항
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedResult.improvements.performanceOptimizations.map((optimization, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                                <p className="text-sm">{optimization}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* 상세 설명 */}
                      <Card>
                        <CardHeader>
                          <CardTitle>상세 설명</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {selectedResult.improvements.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
            </div>
          )}
        </>
      )}
    </div>
    </LoadingOverlay>
  );
}