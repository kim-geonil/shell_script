# U-106.sh 스크립트 분석

## 스크립트 목적
패스워드 복잡성 정책에서 4가지 문자 종류(소문자, 대문자, 숫자, 특수문자)가 모두 -1로 설정되어 있는지 확인하는 보안 검사 스크립트

## 주요 기능
1. OS 종류와 버전 식별
2. OS별 설정 파일 결정
3. 패스워드 복잡성 설정 추출 및 표시
4. 4가지 credit 값이 모두 -1인지 검증

## 실행 절차

### 1단계: OS 식별
- `/etc/os-release` 파일이 있으면 ID와 VERSION_ID 추출
- 없으면 `/etc/redhat-release`에서 추출
- 버전은 소수점 앞 정수만 사용

### 2단계: 검사 파일 결정
**RHEL 계열 (rhel, centos, rocky, red):**
- 버전 7 이상: `/etc/security/pwquality.conf`
- 버전 6 이하: `/etc/pam.d/system-auth`

**Ubuntu/Debian:**
- `/etc/pam.d/common-password`

### 3단계: 패스워드 복잡성 검사 함수
각 파일에 대해 다음을 수행:

#### 3-1: 설정 내용 추출
**pwquality.conf 파일인 경우:**
- 주석(#으로 시작하는 줄) 제외하고 모든 내용 추출

**PAM 파일인 경우:**
- 주석 제외 후 pam_pwquality.so 또는 pam_cracklib.so가 포함된 줄만 추출

#### 3-2: 현재 설정값 표시
4가지 credit 값을 추출하여 표시:
- lcredit (소문자 크레딧): lcredit=숫자 형태에서 숫자 추출 (음수 포함)
- ucredit (대문자 크레딧): ucredit=숫자 형태에서 숫자 추출 (음수 포함)  
- dcredit (숫자 크레딧): dcredit=숫자 형태에서 숫자 추출 (음수 포함)
- ocredit (특수문자 크레딧): ocredit=숫자 형태에서 숫자 추출 (음수 포함)
- 값이 없으면 'Not set' 표시

#### 3-3: 검증 로직
4가지 credit 값이 모두 정확히 -1로 설정되어 있는지 확인:
- lcredit=-1 패턴 검색
- ucredit=-1 패턴 검색  
- dcredit=-1 패턴 검색
- ocredit=-1 패턴 검색

모든 패턴이 발견되면 Pass, 하나라도 없으면 Fail

### 4단계: 최종 결과 판정
- 검사한 파일 중 하나라도 Pass면 전체 결과는 Pass
- 모든 파일이 Fail이면 전체 결과는 Fail

## 출력 형식

### 파일별 출력
- 구분선 (등호 65개)
- "Checking file: " 뒤에 파일 경로
- 4가지 credit 값을 각 줄에 표시 (이름: 값 또는 Not set)
- 빈 줄 하나
- "Status: " 뒤에 Pass 또는 Fail
- Fail인 경우 "Reason: Required settings not found in " 뒤에 파일 경로

### 최종 출력
- 구분선 (등호 56개)
- "Final Result: " 뒤에 Pass 또는 Fail

## 핵심 구현 요소

### 검색 패턴 설명 (자연어)
**설정값 추출 시:**
- credit 이름 뒤에 등호와 숫자(음수 포함)가 오는 패턴에서 숫자만 추출
- 등호 앞뒤 공백 허용

**검증 시:**
- credit 이름 뒤에 등호와 정확히 -1이 오는 패턴 검색
- 등호 앞뒤 공백 허용

## 검증 기준
4가지 패스워드 복잡성 요구사항이 모두 강제(필수) 설정:
- lcredit=-1 (소문자 최소 1개 필수)
- ucredit=-1 (대문자 최소 1개 필수)
- dcredit=-1 (숫자 최소 1개 필수)  
- ocredit=-1 (특수문자 최소 1개 필수)

## 특징
- 여러 파일 지원: 배열을 통한 다중 파일 검사
- 상세한 출력: 현재 설정값과 검증 결과 모두 표시
- OR 조건 판정: 하나의 파일이라도 조건을 만족하면 Pass
- 오류 처리: 파일이 없는 경우 적절한 메시지 출력