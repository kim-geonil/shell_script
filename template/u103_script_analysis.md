# U-103.sh 스크립트 분석

## 스크립트 목적
패스워드 정책의 maxrepeat 값이 1 또는 2로 설정되어 있는지 확인하는 보안 검사 스크립트

## 주요 기능
1. OS 종류와 버전 식별
2. OS별 설정 파일 경로 결정
3. maxrepeat 값 추출
4. 값이 1 또는 2인지 검증

## 실행 절차

### 1단계: OS 식별
- `/etc/os-release` 파일이 있으면 거기서 ID와 VERSION_ID 추출
- 없으면 `/etc/redhat-release`에서 추출
- 버전은 소수점 앞 정수만 사용

### 2단계: 설정 파일 경로 결정
**RHEL 계열 (rhel, centos, rocky, red):**
- 버전 7 이상: `/etc/security/pwquality.conf`
- 버전 6 이하: `/etc/pam.d/system-auth`, `/etc/pam.d/passwd`

**Ubuntu/Debian:**
- `/etc/pam.d/common-password`
- `/etc/security/pwquality.conf`

### 3단계: maxrepeat 값 추출
**Ubuntu/Debian:**
- PAM 파일에서 `pam_pwquality.*maxrepeat=숫자` 패턴 검색 (우선)
- 설정 파일에서 `maxrepeat=숫자` 패턴 검색 (대안)

**RHEL 버전 7+:**
- pwquality.conf에서 `maxrepeat=숫자` 패턴 검색

**RHEL 버전 6 이하:**
- system-auth에서 `pam_cracklib.*maxrepeat=숫자` 검색 (1순위)
- passwd에서 `pam_cracklib.*maxrepeat=숫자` 검색 (2순위)  
- pwquality.conf에서 `maxrepeat=숫자` 검색 (3순위)

### 4단계: 최종 판정
- maxrepeat 값이 1 또는 2이면 "Pass"
- 그 외의 경우 "Fail : MAXREPEAT=값 (Allowed: 1 or 2)"

## 핵심 구현 요소

### 사용 명령어
- `grep -oP`: Perl 정규식으로 값만 추출
- `cut -d= -f2`: = 구분자로 두 번째 필드 추출
- `tr -d '"'`: 따옴표 제거
- `head -n1`: 첫 번째 결과만 사용

### 정규식 패턴 (자연어 설명)
**PAM 파일에서 검색:**
- `pam_pwquality` 또는 `pam_cracklib` 모듈 라인에서 `maxrepeat=숫자` 형태를 찾아 숫자만 추출
- 등호 앞뒤 공백 허용

**설정 파일에서 검색:**  
- 라인 시작부터 `maxrepeat=숫자` 형태를 찾아 숫자만 추출
- 라인 앞쪽 공백 허용, 등호 앞뒤 공백 허용

### 검증 조건 (자연어 설명)
- maxrepeat 값이 존재하고 (비어있지 않음)
- 그 값이 정확히 1 또는 2인 경우에만 통과

## 변수 구조
- `OS_ID`: OS 이름 (소문자)
- `OS_VERSION`: 주 버전 번호 (정수)
- `MAXREPEAT`: 추출된 maxrepeat 값
- 각 OS별 설정 파일 경로 변수들

## 출력 형식
- 성공: `Pass`
- 실패: `Fail : MAXREPEAT=값또는Not_Set (Allowed: 1 or 2)`