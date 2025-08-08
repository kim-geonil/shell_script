// OpenRouter API를 통한 Claude Sonnet 4 연동 서비스

interface AIRequest {
  currentScript: string;
  requirement: string;
  templateId: string;
  os: string;
  application: string;
  inspectionConfig: any;
}

interface AIResponse {
  improvedScript: string;
  changes: string[];
  explanation: string;
}

export interface TestRequest {
  script: string;
  templateId: string;
  os: string;
  application: string;
  inspectionConfig: any;
}

export interface TestResponse {
  testScript: string;
  testCases: string[];
  expectedResults: string[];
  explanation: string;
}

export interface ImprovementRequest {
  originalScript: string;
  testResults: {
    testCase: string;
    expectedResult: string;
    actualResult: string;
    status: 'passed' | 'failed';
  }[];
  templateId: string;
  os: string;
  application: string;
}

export interface ImprovementResponse {
  improvedScript: string;
  improvements: string[];
  explanation: string;
  securityEnhancements: string[];
  performanceOptimizations: string[];
}

// Prompt Editor 요청/응답 인터페이스
export interface RefinePromptRequest {
  originalPrompt: string;
  conversation: { role: 'user' | 'assistant'; content: string }[];
}

export interface RefinePromptResponse {
  refinedPrompt: string;
  explanation: string;
}

export class AIService {
  private static readonly API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  private static readonly MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.5-pro';
  private static readonly API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  static async improveScript(request: AIRequest): Promise<AIResponse> {
    if (!this.API_KEY) {
      throw new Error('OpenRouter API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENROUTER_API_KEY를 추가해주세요.');
    }

    const systemPrompt = `당신은 보안 스크립트 전문가입니다. 사용자의 요구사항에 따라 Bash 보안 스크립트를 개선해주세요.

**개선 원칙:**
1. 보안성을 최우선으로 고려
2. 에러 처리를 강화
3. 로깅을 상세하게 기록
4. 성능을 최적화
5. 코드 가독성을 향상
6. 한국어 주석 추가

**중요: 응답 형식 규칙**
- 반드시 유효한 JSON 형식으로만 응답하세요
- 코드 블록(\`\`\`)이나 마크다운 형식을 사용하지 마세요
- JSON 외의 다른 텍스트를 포함하지 마세요

**컨텍스트 정보:**
- 템플릿 ID: ${request.templateId}
- 운영체제: ${request.os}
- 애플리케이션: ${request.application}
- 점검 설정: ${JSON.stringify(request.inspectionConfig, null, 2)}`;

    const userPrompt = `**현재 스크립트:**
\`\`\`bash
${request.currentScript}
\`\`\`

**개선 요구사항:**
${request.requirement}

**요청:**
위 스크립트를 요구사항에 맞게 개선해주세요. 

**중요: 응답은 반드시 아래의 정확한 JSON 형식으로만 해주세요. 코드 블록이나 다른 텍스트는 포함하지 마세요:**

{
  "improvedScript": "개선된 스크립트 전체 내용",
  "changes": ["변경사항 1", "변경사항 2", "..."],
  "explanation": "개선 이유와 설명"
}

JSON 형식 외의 어떤 텍스트도 포함하지 마세요.`;

    try {
      console.log('🤖 OpenRouter API 요청 시작...');
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Security Script AI Assistant'
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API 오류: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ OpenRouter API 응답 수신:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('유효하지 않은 응답 형식입니다.');
      }

      const aiContent = data.choices[0].message.content;
      
      // JSON 응답 파싱
      try {
        // 코드 블록과 마크다운 형식 제거
        let cleanedContent = aiContent;
        
        // 코드 블록 제거 (```language ... ```)
        cleanedContent = cleanedContent.replace(/```[\w]*\n([\s\S]*?)\n```/g, '$1');
        
        // 인라인 코드 블록 제거 (`code`)
        cleanedContent = cleanedContent.replace(/`([^`]+)`/g, '$1');
        
        // JSON 객체 추출 (중첩된 중괄호 고려)
        const jsonMatch = this.extractJsonFromText(cleanedContent);
        if (!jsonMatch) {
          throw new Error('JSON 형식을 찾을 수 없습니다.');
        }
        
        const parsedResponse: AIResponse = JSON.parse(jsonMatch);
        
        // 응답 검증
        if (!parsedResponse.improvedScript || !parsedResponse.changes || !parsedResponse.explanation) {
          throw new Error('응답에 필수 필드가 누락되었습니다.');
        }

        console.log('🎉 AI 스크립트 개선 완료!');
        return parsedResponse;
        
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.log('원본 AI 응답:', aiContent);
        
        // 간단한 텍스트 추출 시도
        const fallbackResponse = this.extractFallbackResponse(aiContent, request);
        
        return {
          improvedScript: fallbackResponse.script || request.currentScript,
          changes: ['AI 응답을 부분적으로 파싱했습니다. 전체 응답을 확인해주세요.'],
          explanation: `파싱 오류가 발생했습니다: ${parseError}\n\nAI 원본 응답:\n${aiContent.slice(0, 1000)}${aiContent.length > 1000 ? '...' : ''}`
        };
      }

    } catch (error) {
      console.error('❌ AI 서비스 오류:', error);
      throw error;
    }
  }

  // API 키 유효성 검사
  static isConfigured(): boolean {
    return !!this.API_KEY;
  }

  // 사용 가능한 모델 목록 조회
  static async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data?.map((model: any) => model.id) || [];
      }
    } catch (error) {
      console.error('모델 목록 조회 실패:', error);
    }
    
    return ['google/gemini-2.5-pro'];
  }

  // 테스트 스크립트 생성
  static async generateTestScript(request: TestRequest): Promise<TestResponse> {
    if (!this.API_KEY) {
      throw new Error('OpenRouter API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENROUTER_API_KEY를 추가해주세요.');
    }

    const systemPrompt = '당신은 보안 스크립트 테스트 전문가입니다. 주어진 보안 스크립트에 대한 포괄적인 테스트 스크립트를 생성해주세요.\n\n' +
      '**테스트 원칙:**\n' +
      '1. 기능 테스트 - 스크립트의 핵심 기능이 제대로 작동하는지 확인\n' +
      '2. 보안 테스트 - 보안 검사 항목들이 올바르게 수행되는지 검증\n' +
      '3. 에러 처리 테스트 - 예외 상황에서의 동작 확인\n' +
      '4. 성능 테스트 - 스크립트 실행 시간 및 리소스 사용량 확인\n' +
      '5. 환경별 테스트 - 다양한 환경에서의 호환성 확인\n\n' +
      '**중요: 응답 형식 규칙**\n' +
      '- 반드시 유효한 JSON 형식으로만 응답하세요\n' +
      '- 코드 블록(```)이나 마크다운 형식을 사용하지 마세요\n' +
      '- JSON 외의 다른 텍스트를 포함하지 마세요\n\n' +
      '**컨텍스트 정보:**\n' +
      '- 템플릿 ID: ' + request.templateId + '\n' +
      '- 운영체제: ' + request.os + '\n' +
      '- 애플리케이션: ' + request.application + '\n' +
      '- 점검 설정: ' + JSON.stringify(request.inspectionConfig, null, 2);

    const userPrompt = '**테스트할 스크립트:**\n' +
      '```bash\n' +
      request.script + '\n' +
      '```\n\n' +
      '**요청:**\n' +
      '위 스크립트에 대한 포괄적인 테스트 스크립트를 생성해주세요.\n\n' +
      '**중요: 응답은 반드시 아래의 정확한 JSON 형식으로만 해주세요:**\n\n' +
      '{\n' +
      '  "testScript": "완전한 테스트 스크립트 내용",\n' +
      '  "testCases": ["테스트 케이스 1", "테스트 케이스 2", "..."],\n' +
      '  "expectedResults": ["예상 결과 1", "예상 결과 2", "..."],\n' +
      '  "explanation": "테스트 스크립트에 대한 설명"\n' +
      '}\n\n' +
      'JSON 형식 외의 어떤 텍스트도 포함하지 마세요.';

    try {
      console.log('🧪 테스트 스크립트 생성 요청...');
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.API_KEY,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Security Script Test Generator'
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('OpenRouter API 오류: ' + response.status + ' - ' + (errorData.error?.message || 'Unknown error'));
      }

      const data = await response.json();
      console.log('✅ 테스트 스크립트 생성 응답 수신:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('유효하지 않은 응답 형식입니다.');
      }

      const aiContent = data.choices[0].message.content;
      
      // JSON 응답 파싱
      try {
        // 코드 블록과 마크다운 형식 제거
        let cleanedContent = aiContent;
        
        // 코드 블록 제거 (```language ... ```)
        cleanedContent = cleanedContent.replace(/\`\`\`[\\w]*\\n([\\s\\S]*?)\\n\`\`\`/g, '$1');
        
        // 인라인 코드 블록 제거 (`code`)
        cleanedContent = cleanedContent.replace(/\`([^\`]+)\`/g, '$1');
        
        // JSON 객체 추출 (중첩된 중괄호 고려)
        const jsonMatch = this.extractJsonFromText(cleanedContent);
        if (!jsonMatch) {
          throw new Error('JSON 형식을 찾을 수 없습니다.');
        }
        
        const parsedResponse: TestResponse = JSON.parse(jsonMatch);
        
        // 응답 검증
        if (!parsedResponse.testScript || !parsedResponse.testCases || !parsedResponse.expectedResults || !parsedResponse.explanation) {
          throw new Error('응답에 필수 필드가 누락되었습니다.');
        }

        console.log('🎉 테스트 스크립트 생성 완료!');
        return parsedResponse;
        
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.log('원본 AI 응답:', aiContent);
        
        // fallback 응답 생성
        return {
          testScript: '#!/bin/bash\n' +
            '# 자동 생성된 기본 테스트 스크립트\n' +
            'echo "테스트 시작..."\n\n' +
            '# 원본 스크립트 실행\n' +
            request.script + '\n\n' +
            'echo "테스트 완료"',
          testCases: ['기본 실행 테스트', 'AI 응답 파싱 중 오류가 발생했습니다.'],
          expectedResults: ['스크립트가 정상적으로 실행됨', '오류 처리 확인'],
          explanation: '테스트 스크립트 생성 중 파싱 오류가 발생했습니다: ' + parseError + '\n\nAI 원본 응답:\n' + aiContent.slice(0, 1000) + (aiContent.length > 1000 ? '...' : '')
        };
      }

    } catch (error) {
      console.error('❌ 테스트 스크립트 생성 오류:', error);
      throw error;
    }
  }

  // 테스트 결과 기반 코드 개선 제안
  static async generateImprovements(request: ImprovementRequest): Promise<ImprovementResponse> {
    if (!this.API_KEY) {
      throw new Error('OpenRouter API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENROUTER_API_KEY를 추가해주세요.');
    }

    const failedTests = request.testResults.filter(result => result.status === 'failed');
    const passedTests = request.testResults.filter(result => result.status === 'passed');

    const systemPrompt = '당신은 보안 스크립트 최적화 전문가입니다. 테스트 결과를 바탕으로 스크립트의 보안성, 성능, 안정성을 개선하는 구체적인 제안을 해주세요.\n\n' +
      '**개선 원칙:**\n' +
      '1. 보안 강화 - 취약점 제거 및 보안 모범 사례 적용\n' +
      '2. 성능 최적화 - 실행 속도 및 리소스 사용량 개선\n' +
      '3. 안정성 향상 - 에러 처리 및 예외 상황 대응 강화\n' +
      '4. 가독성 개선 - 코드 구조 및 주석 향상\n' +
      '5. 유지보수성 증대 - 모듈화 및 재사용성 향상\n\n' +
      '**중요: 응답 형식 규칙**\n' +
      '- 반드시 유효한 JSON 형식으로만 응답하세요\n' +
      '- 코드 블록(```)이나 마크다운 형식을 사용하지 마세요\n' +
      '- JSON 외의 다른 텍스트를 포함하지 마세요\n\n' +
      '**컨텍스트 정보:**\n' +
      '- 템플릿 ID: ' + request.templateId + '\n' +
      '- 운영체제: ' + request.os + '\n' +
      '- 애플리케이션: ' + request.application;

    const testResultsSummary = request.testResults.map((result, index) => 
      (index + 1) + '. ' + result.testCase + ' - ' + result.status + 
      ' (예상: ' + result.expectedResult + ', 실제: ' + result.actualResult + ')'
    ).join('\n');

    const userPrompt = '**원본 스크립트:**\n' +
      request.originalScript + '\n\n' +
      '**테스트 결과 요약:**\n' +
      '- 성공한 테스트: ' + passedTests.length + '개\n' +
      '- 실패한 테스트: ' + failedTests.length + '개\n\n' +
      '**상세 테스트 결과:**\n' +
      testResultsSummary + '\n\n' +
      '**요청:**\n' +
      '위 테스트 결과를 바탕으로 스크립트를 개선해주세요. 특히 실패한 테스트들을 해결하고 전반적인 보안성과 성능을 향상시켜주세요.\n\n' +
      '**중요: 응답은 반드시 아래의 정확한 JSON 형식으로만 해주세요:**\n\n' +
      '{\n' +
      '  "improvedScript": "개선된 전체 스크립트 내용",\n' +
      '  "improvements": ["개선사항 1", "개선사항 2", "..."],\n' +
      '  "explanation": "개선 내용에 대한 상세 설명",\n' +
      '  "securityEnhancements": ["보안 강화사항 1", "보안 강화사항 2", "..."],\n' +
      '  "performanceOptimizations": ["성능 최적화사항 1", "성능 최적화사항 2", "..."]\n' +
      '}\n\n' +
      'JSON 형식 외의 어떤 텍스트도 포함하지 마세요.';

    try {
      console.log('🔧 코드 개선 제안 생성 요청...');
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.API_KEY,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Security Script Improvement Assistant'
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('OpenRouter API 오류: ' + response.status + ' - ' + (errorData.error?.message || 'Unknown error'));
      }

      const data = await response.json();
      console.log('✅ 코드 개선 제안 응답 수신:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('유효하지 않은 응답 형식입니다.');
      }

      const aiContent = data.choices[0].message.content;
      
      // JSON 응답 파싱
      try {
        // 코드 블록과 마크다운 형식 제거
        let cleanedContent = aiContent;
        
        // 코드 블록 제거 (```language ... ```)
        cleanedContent = cleanedContent.replace(/```[\w]*\n([\s\S]*?)\n```/g, '$1');
        
        // 인라인 코드 블록 제거 (`code`)
        cleanedContent = cleanedContent.replace(/`([^`]+)`/g, '$1');
        
        // JSON 객체 추출 (중첩된 중괄호 고려)
        const jsonMatch = this.extractJsonFromText(cleanedContent);
        if (!jsonMatch) {
          throw new Error('JSON 형식을 찾을 수 없습니다.');
        }
        
        const parsedResponse: ImprovementResponse = JSON.parse(jsonMatch);
        
        // 응답 검증
        if (!parsedResponse.improvedScript || !parsedResponse.improvements || !parsedResponse.explanation) {
          throw new Error('응답에 필수 필드가 누락되었습니다.');
        }

        console.log('🎉 코드 개선 제안 생성 완료!');
        return parsedResponse;
        
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.log('원본 AI 응답:', aiContent);
        
        // fallback 응답 생성
        return {
          improvedScript: request.originalScript + '\n\n# 개선된 코드가 곧 제공됩니다...',
          improvements: ['AI 응답 파싱 중 오류가 발생했습니다.', '원본 스크립트가 반환되었습니다.'],
          explanation: '코드 개선 제안 생성 중 파싱 오류가 발생했습니다: ' + parseError + '\n\nAI 원본 응답:\n' + aiContent.slice(0, 1000) + (aiContent.length > 1000 ? '...' : ''),
          securityEnhancements: ['파싱 오류로 인해 보안 강화사항을 생성할 수 없습니다.'],
          performanceOptimizations: ['파싱 오류로 인해 성능 최적화사항을 생성할 수 없습니다.']
        };
      }

    } catch (error) {
      console.error('❌ 코드 개선 제안 생성 오류:', error);
      throw error;
    }
  }

  // 프롬프트 지침 수정
  static async refinePrompt(request: RefinePromptRequest): Promise<RefinePromptResponse> {
    if (!this.API_KEY) {
      throw new Error('OpenRouter API 키가 설정되지 않았습니다.');
    }

    const systemPrompt = `당신은 보안 스크립트 프롬프트 엔지니어입니다. 사용자와의 대화를 바탕으로 기존 스크립트 지침 프롬프트를 수정해주세요.
    
**수정 원칙:**
1. 사용자의 요구사항을 정확하게 반영합니다.
2. 기존 프롬프트의 구조와 맥락을 최대한 유지합니다.
3. 명확하고 간결한 문장으로 수정합니다.
4. 보안 점검의 목적에 부합하도록 내용을 보강합니다.
5. 실제로 프롬프트 내용을 수정해야 합니다 - 단순히 기존 내용을 그대로 반환하지 마세요.
6. "[이하 동일한 내용 유지...]", "[기존 내용 유지...]" 등의 멘트를 사용하지 마세요.
7. 기존 내용에 새로운 내용을 추가할 때는 기존 내용을 유지하면서 새로운 내용을 자연스럽게 통합하세요.
8. 기존 내용과 새로운 내용이 중복되지 않도록 하세요.
9. 모든 내용은 완전한 문장으로 작성하세요.
10. 내용을 생략하거나 축약하지 마세요.

**중요: 응답 형식 규칙**
- 반드시 유효한 JSON 형식으로만 응답하세요.
- 코드 블록(\`\`\`)이나 마크다운 형식을 사용하지 마세요.
- JSON 외의 다른 텍스트를 포함하지 마세요.
- 실제로 수정된 프롬프트 내용만 반환하세요.
- 모든 내용은 완전한 형태로 작성하세요.
- 내용 생략이나 축약을 위한 "..." 등의 표현을 사용하지 마세요.`;

    // 대화 기록을 프롬프트에 포함
    const conversationHistory = request.conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    const userPrompt = `**기존 프롬프트:**
---
${request.originalPrompt}
---

**대화 기록:**
${conversationHistory}

**요청:**
위 대화 기록을 바탕으로 **기존 프롬프트**를 실제로 수정해주세요. 

**중요한 지침:**
1. 단순히 기존 내용을 그대로 반환하지 마세요.
2. "[이하 동일한 내용 유지...]", "[기존 내용 유지...]" 등의 멘트를 사용하지 마세요.
3. 실제로 프롬프트 내용을 수정하고, 수정된 전체 프롬프트를 반환하세요.
4. 사용자의 요구사항이 반영된 구체적인 변경사항을 포함해야 합니다.
5. 기존 내용과 새로운 내용을 자연스럽게 통합하세요.
6. 내용을 생략하거나 축약하지 마세요.
7. 모든 내용은 완전한 문장으로 작성하세요.
8. "..." 등의 생략 표현을 사용하지 마세요.
9. 기존 내용과 새로운 내용이 중복되지 않도록 하세요.
10. 모든 내용은 완전한 형태로 작성하세요.

**중요: 응답은 반드시 아래의 정확한 JSON 형식으로만 해주세요:**
{
  "refinedPrompt": "실제로 수정된 전체 프롬프트 내용 (기존 내용을 그대로 반환하지 말고 실제 수정사항 포함)",
  "explanation": "어떤 요구사항이 어떻게 반영되었는지에 대한 간결한 설명"
}

JSON 형식 외의 어떤 텍스트도 포함하지 마세요.
코드 블록이나 마크다운 형식을 사용하지 마세요.
모든 내용은 JSON 형식 내에서 완전한 형태로 작성하세요.`;

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt Refinement Assistant'
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.5,
          max_tokens: 4000,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API 오류: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;

      try {
        const jsonMatch = this.extractJsonFromText(aiContent);
        if (!jsonMatch) throw new Error('JSON 형식을 찾을 수 없습니다.');
        
        // JSON 문자열 정리
        const cleanedJson = this.cleanJsonString(jsonMatch);
        
        const parsedResponse: RefinePromptResponse = JSON.parse(cleanedJson);
        if (!parsedResponse.refinedPrompt || !parsedResponse.explanation) {
          throw new Error('응답에 필수 필드가 누락되었습니다.');
        }
        return parsedResponse;
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError, '원본 응답:', aiContent);
        return {
          refinedPrompt: request.originalPrompt,
          explanation: `AI 응답 파싱에 실패했습니다: ${parseError}. 원본 프롬프트를 반환합니다.`
        };
      }
    } catch (error) {
      console.error('❌ 프롬프트 수정 오류:', error);
      throw error;
    }
  }

  // 텍스트에서 JSON 객체 추출 (중첩된 중괄호 고려)
  private static extractJsonFromText(text: string): string | null {
    const openBrace = text.indexOf('{');
    if (openBrace === -1) return null;

    let braceCount = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = openBrace; i < text.length; i++) {
      const char = text[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        continue;
      }

      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            return text.substring(openBrace, i + 1);
          }
        }
      }
    }

    return null;
  }

  // JSON 파싱 전에 제어 문자 정리
  private static cleanJsonString(jsonString: string): string {
    // 제어 문자 제거 (개행, 탭 등)
    return jsonString
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 제어 문자 제거
      .replace(/\n/g, '\\n') // 개행을 이스케이프된 형태로 변환
      .replace(/\r/g, '\\r') // 캐리지 리턴을 이스케이프된 형태로 변환
      .replace(/\t/g, '\\t'); // 탭을 이스케이프된 형태로 변환
  }

  // JSON 파싱 실패 시 fallback 응답 추출
  private static extractFallbackResponse(content: string, request: any): { script?: string } {
    try {
      // 코드 블록에서 스크립트 추출 시도
      const codeBlockMatch = content.match(/```(?:bash|sh|shell)?\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        return { script: codeBlockMatch[1].trim() };
      }

      // 간단한 스크립트 패턴 찾기
      const scriptMatch = content.match(/#!/i);
      if (scriptMatch) {
        const lines = content.split('\n');
        const scriptLines = [];
        let inScript = false;
        
        for (const line of lines) {
          if (line.startsWith('#!') || inScript) {
            inScript = true;
            scriptLines.push(line);
          }
        }
        
        if (scriptLines.length > 0) {
          return { script: scriptLines.join('\n') };
        }
      }
    } catch (error) {
      console.warn('Fallback 추출 실패:', error);
    }

    return {};
  }
}