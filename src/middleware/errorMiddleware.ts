import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

// 액션 타입들을 직접 정의하여 순환 참조 방지
interface AddNotificationAction {
  type: 'ui/addNotification';
  payload: {
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    duration?: number;
  };
}

interface LogoutAction {
  type: 'auth/logout';
}

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  // RTK Query 에러 처리
  if (isRejectedWithValue(action)) {
    const { payload } = action;
    
    // 알림 액션 생성 함수
    const createNotification = (notification: AddNotificationAction['payload']): AddNotificationAction => ({
      type: 'ui/addNotification',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...notification,
      } as any,
    });
    
    // 로그아웃 액션 생성 함수
    const createLogout = (): LogoutAction => ({
      type: 'auth/logout',
    });
    
    // HTTP 상태 코드별 에러 처리
    if (payload?.status === 401) {
      store.dispatch(createNotification({
        type: 'error',
        title: '인증 오류',
        message: '세션이 만료되었습니다. 다시 로그인해 주세요.',
        duration: 5000,
      }));
      
      // 자동 로그아웃
      store.dispatch(createLogout());
      
      // 로그인 페이지로 리다이렉트 (현재 로그인 페이지가 아닌 경우)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else if (payload?.status === 403) {
      store.dispatch(createNotification({
        type: 'error',
        title: '권한 없음',
        message: '이 작업을 수행할 권한이 없습니다.',
        duration: 5000,
      }));
    } else if (payload?.status === 404) {
      store.dispatch(createNotification({
        type: 'error',
        title: '찾을 수 없음',
        message: '요청한 리소스를 찾을 수 없습니다.',
        duration: 4000,
      }));
    } else if (payload?.status === 422) {
      store.dispatch(createNotification({
        type: 'error',
        title: '입력 오류',
        message: '입력 데이터를 확인해 주세요.',
        duration: 4000,
      }));
    } else if (payload?.status === 429) {
      store.dispatch(createNotification({
        type: 'warning',
        title: '요청 제한',
        message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.',
        duration: 6000,
      }));
    } else if (payload?.status === 500) {
      store.dispatch(createNotification({
        type: 'error',
        title: '서버 오류',
        message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        duration: 5000,
      }));
    } else if (payload?.status === 503) {
      store.dispatch(createNotification({
        type: 'error',
        title: '서비스 점검',
        message: '현재 서비스 점검 중입니다. 잠시 후 다시 시도해 주세요.',
        duration: 6000,
      }));
    } else if (payload?.status === 'FETCH_ERROR') {
      store.dispatch(createNotification({
        type: 'error',
        title: '네트워크 오류',
        message: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.',
        duration: 6000,
      }));
    } else if (payload?.status === 'PARSING_ERROR') {
      store.dispatch(createNotification({
        type: 'error',
        title: '데이터 오류',
        message: '서버 응답을 처리하는 중 오류가 발생했습니다.',
        duration: 5000,
      }));
    } else {
      // 일반적인 에러 처리
      const errorMessage = 
        payload?.data?.message || 
        payload?.data?.error || 
        payload?.message || 
        action.error?.message || 
        '알 수 없는 오류가 발생했습니다.';
      
      store.dispatch(createNotification({
        type: 'error',
        title: '오류',
        message: errorMessage,
        duration: 5000,
      }));
    }
    
    // 개발 환경에서는 콘솔에 자세한 에러 로그
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 RTK Query Error');
      console.error('Action:', action);
      console.error('Payload:', payload);
      console.error('Original Error:', action.error);
      console.groupEnd();
    }
  }

  return next(action);
};