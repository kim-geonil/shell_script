# U-301.sh 스크립트 분석

## 스크립트 목적
계정 잠금 정책에서 로그인 실패 제한 횟수(deny)가 4회, 잠금 해제 시간(unlock_time)이 120초로 설정되어 있는지 확인하는 보안 검사 스크립트

## 목표 설정값
- deny = 4 (로그인 실패 4회 시 계정 잠금)
- unlock_time = 120 (120초 후 자동 잠금 해제)

## 주요 기능
1. OS 종류와 버전 식별
2. OS별 PAM 파일과 모듈 결정
3. 계정 잠금 정책 설정값 추출
4. 목표값과 비교하여 검증

## 실행 절차

### 1단계: OS 식별
- `/etc/os-release` 파일이 있으면 ID와 VERSION_ID 추출
- 없으면 `/etc/redhat-release`에서 추출
- 버전은 소수점 앞 정수만 사용

### 2단계: OS별 PAM 파일과 모듈 결정

#### RHEL 계열 (rhel, centos, rocky, red)
**버전 7:**
- 파일: `/etc/pam.d/system-auth`, `/etc/pam.d/password-auth`
- 모듈: pam_faillock.so 또는 pam_tally2.so (둘 다 허용)

**버전 8 이상:**
- 파일: `/etc/pam.d/system-auth`, `/etc/pam.d/password-auth`  
- 모듈: pam_faillock.so만

**버전 6 이하:**
- 파일: `/etc/pam.d/system-auth`, `/etc/pam.d/password-auth`
- 모듈: pam_tally2.so만

#### Ubuntu/Debian
- 파일: `/etc/pam.d/common-auth`
- 모듈: pam_tally2.so

### 3단계: 설정값 추출
각 PAM 파일에서 다음 값들을 추출:

#### deny 값 추출
- 지정된 PAM 모듈이 포함된 줄에서 "deny=숫자" 패턴을 찾아 숫자만 추출
- 첫 번째로 발견된 값 사용

#### unlock_time 값 추출  
- 지정된 PAM 모듈이 포함된 줄에서 "unlock_time=숫자" 패턴을 찾아 숫자만 추출
- 첫 번째로 발견된 값 사용

### 4단계: 설정값 수집 로직
- 여러 PAM 파일을 순서대로 검사
- 각 파일에서 deny와 unlock_time 값을 추출
- **최초로 발견된 유효한 값**을 현재 설정값으로 사용 (중요: 첫 번째 값 우선)

### 5단계: 최종 검증
- 현재 deny 값이 정확히 4인지 확인
- 현재 unlock_time 값이 정확히 120인지 확인
- 둘 다 만족하면 Pass, 그렇지 않으면 Fail

## 검색 패턴 설명 (자연어)

### PAM 모듈 라인 검색
- 지정된 PAM 모듈 이름이 포함된 줄에서 설정값 검색
- 모듈 이름 뒤에 공백이나 다른 문자가 올 수 있음

### deny 값 추출
- PAM 모듈 라인에서 "deny=" 뒤에 오는 숫자들만 추출
- 등호 앞에 단어 경계 있어야 함

### unlock_time 값 추출
- PAM 모듈 라인에서 "unlock_time=" 뒤에 오는 숫자들만 추출  
- 등호 앞에 단어 경계 있어야 함

## 출력 형식

### 성공 시
- "Pass : deny=" 뒤에 현재값 " unlock_time=" 뒤에 현재값

### 실패 시  
- "Fail : deny=" 뒤에 현재값또는Not_Set " unlock_time=" 뒤에 현재값또는Not_Set " (Required: deny=4 unlock_time=120)"

## 특징

### 우선순위 처리
- 여러 PAM 파일 중 **첫 번째로 발견된 유효한 값** 사용
- 같은 파일 내에서도 첫 번째 매치만 사용

### 버전별 모듈 지원
- RHEL 7: faillock과 tally2 모두 지원
- RHEL 8+: faillock만 지원  
- RHEL 6-: tally2만 지원
- Ubuntu/Debian: tally2만 지원

### 오류 처리
- 파일이 존재하지 않으면 무시
- 설정값이 없으면 "Not_Set"으로 표시
- 지원하지 않는 OS는 오류 메시지 출력 후 종료

### 정확한 매칭
- 두 설정값이 모두 정확히 목표값과 일치해야 Pass
- 하나라도 다르거나 없으면 Fail

## 검증 기준
- deny=4: 로그인 실패 4회에 계정 잠금
- unlock_time=120: 120초 후 자동 잠금 해제