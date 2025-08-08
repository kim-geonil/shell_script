# AI 스크립트 개선 기능 설정 가이드

## 🤖 OpenRouter & Claude Sonnet 4 연동 설정

### 1. OpenRouter API 키 발급

1. [OpenRouter](https://openrouter.ai/) 웹사이트 방문
2. 회원가입 또는 로그인
3. `Settings` → `API Keys` 메뉴로 이동
4. `Create API Key` 버튼 클릭
5. API 키 복사 및 저장

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
# OpenRouter API 설정
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# OpenRouter 모델 설정 (기본값: Claude 3.5 Sonnet)
VITE_OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# OpenRouter API URL (기본값)
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
```

### 3. 사용 방법

1. **스크립트 에디터** 페이지 접속
2. 우측 패널의 **"스크립트 도구"** 섹션 확인
3. **"AI 개선 요구사항"** 텍스트 영역에 원하는 개선사항 입력
4. 빠른 템플릿 버튼 활용 (로깅 개선, 에러 처리 강화 등)
5. **"AI 개선"** 버튼 클릭
6. Claude Sonnet 4가 스크립트를 분석하고 개선
7. 개선된 스크립트가 에디터에 자동 적용

### 4. AI 개선 요청 예시

#### 🔧 기본 개선
```
로깅 개선 해주세요.
에러 처리 강화 해주세요.
```

#### 🚀 고급 개선
```
스크립트의 성능을 최적화하고, 대용량 파일 처리 시 메모리 사용량을 줄여주세요.
보안을 강화하여 입력값 검증과 권한 체크를 추가해주세요.
```

#### 📝 상세 개선
```
다음 요구사항에 맞게 개선해주세요:
1. 로그 출력을 JSON 형식으로 변경
2. 진행률 표시 기능 추가
3. 실패 시 재시도 로직 구현
4. 한국어 주석 추가
```

### 5. 지원 기능

- ✅ **실시간 AI 처리**: Claude Sonnet 4를 통한 즉시 스크립트 개선
- ✅ **컨텍스트 인식**: 현재 스크립트, OS, 애플리케이션 정보 자동 전달
- ✅ **상세한 피드백**: 변경사항과 개선 이유 제공
- ✅ **에러 처리**: 명확한 오류 메시지와 해결 방법 안내
- ✅ **빠른 템플릿**: 자주 사용되는 개선 요청 원클릭 적용

### 6. 문제 해결

#### API 키 오류
```
❌ OpenRouter API 키가 설정되지 않았습니다.
```
→ `.env` 파일에 `VITE_OPENROUTER_API_KEY` 추가

#### 인증 오류 (401)
```
❌ 인증 오류: OpenRouter API 키가 유효하지 않습니다.
```
→ API 키가 올바른지 확인

#### 요청 한도 초과 (429)
```
❌ 요청 한도 초과: 잠시 후 다시 시도해주세요.
```
→ OpenRouter 계정의 사용량 확인

### 7. 비용 정보

- **Claude 3.5 Sonnet**: 입력 $3.00/1M tokens, 출력 $15.00/1M tokens
- **평균 요청**: 약 2,000-4,000 tokens (요청당 $0.01-0.06)
- **권장**: 소량 테스트 후 본격 사용

### 8. 보안 주의사항

⚠️ **중요**: 
- API 키를 GitHub에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어야 합니다
- 프로덕션 환경에서는 환경 변수로 별도 관리하세요

---

## 🚀 시작하기

1. OpenRouter에서 API 키 발급
2. `.env` 파일에 API 키 설정
3. 개발 서버 재시작: `npm run dev`
4. 스크립트 에디터에서 AI 개선 기능 사용

**문의사항이 있으시면 프로젝트 이슈나 문서를 참고해주세요!**