// Store 관련 타입들을 별도 파일로 분리하여 순환 참조 방지
export interface StoreState {
  auth: any;
  scripts: any;
  templates: any;
  ui: any;
  editor: any;
  tabs: any;
  api: any;
}

// 타입 유틸리티
export type RootState = StoreState;
export type AppDispatch = any; // 실제로는 store.dispatch의 타입이지만 순환 참조 방지를 위해 any 사용