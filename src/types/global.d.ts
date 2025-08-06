declare global {
  interface Window {
    __networkListenersAdded?: boolean;
    
    // Monaco Editor
    MonacoEnvironment?: {
      getWorkerUrl?: (workerId: string, label: string) => string;
      getWorker?: (workerId: string, label: string) => Worker;
    };
  }

  // 커스텀 이벤트 타입
  interface CustomEventMap {
    'monaco-save': CustomEvent<{ content: string }>;
    'monaco-validate': CustomEvent<{ content: string }>;
    'monaco-format': CustomEvent<{ content: string }>;
  }

  interface Window {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(
      ev: CustomEventMap[K]
    ): boolean;
  }
}

// Monaco Editor 모듈 선언
declare module 'monaco-editor' {
  // Monaco editor 타입이 이미 정의되어 있으므로 추가 선언 불필요
}

export {};