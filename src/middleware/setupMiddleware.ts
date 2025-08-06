import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';
import { store } from '../store';

export interface ApiError {
  status: number;
  data: {
    message: string;
    code?: string;
    details?: any;
  };
}

const getErrorMessage = (error: any): string => {
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

const getErrorTitle = (status: number): string => {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Authentication Required';
    case 403:
      return 'Permission Denied';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Validation Error';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      return 'Error';
  }
};

export const setupErrorHandling = () => {
  // Listen to store actions and handle errors
  const unsubscribe = store.subscribe(() => {
    // This will be triggered after each action
  });

  // Manual error handler for API errors
  const handleApiError = (action: any) => {
    if (isRejectedWithValue(action)) {
      const { payload, error } = action;
      const status = payload?.status || error?.status || 500;
      const errorMessage = getErrorMessage(payload || error);
      const errorTitle = getErrorTitle(status);

      console.error('API Error:', {
        status,
        message: errorMessage,
        action: action.type,
        payload,
        error,
      });

      // Handle specific error status codes
      switch (status) {
        case 401:
          // Unauthorized - logout user and redirect to login
          store.dispatch(logout());
          store.dispatch(addNotification({
            type: 'error',
            title: 'Session Expired',
            message: 'Your session has expired. Please log in again.',
            duration: 5000,
          }));
          
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - show permission error
          store.dispatch(addNotification({
            type: 'error',
            title: 'Permission Denied',
            message: 'You don\'t have permission to perform this action.',
            duration: 5000,
          }));
          break;

        case 404:
          // Not found - only show notification for explicit API calls
          if (!action.type.includes('getScript') && !action.type.includes('getTemplate')) {
            store.dispatch(addNotification({
              type: 'error',
              title: 'Not Found',
              message: 'The requested resource was not found.',
              duration: 4000,
            }));
          }
          break;

        case 409:
          // Conflict - resource already exists or version conflict
          store.dispatch(addNotification({
            type: 'error',
            title: 'Conflict',
            message: errorMessage || 'A conflict occurred. Please refresh and try again.',
            duration: 5000,
          }));
          break;

        case 422:
          // Validation error - show specific validation messages
          store.dispatch(addNotification({
            type: 'error',
            title: 'Validation Error',
            message: errorMessage || 'Please check your input and try again.',
            duration: 6000,
          }));
          break;

        case 429:
          // Rate limiting
          store.dispatch(addNotification({
            type: 'warning',
            title: 'Too Many Requests',
            message: 'You\'re making requests too quickly. Please wait a moment and try again.',
            duration: 5000,
          }));
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          store.dispatch(addNotification({
            type: 'error',
            title: errorTitle,
            message: 'A server error occurred. Please try again later or contact support if the problem persists.',
            duration: 7000,
          }));
          break;

        default:
          // Network errors or other unknown errors
          if (status === 'FETCH_ERROR' || status === 'PARSING_ERROR' || !navigator.onLine) {
            store.dispatch(addNotification({
              type: 'error',
              title: 'Connection Error',
              message: 'Unable to connect to the server. Please check your internet connection.',
              duration: 5000,
            }));
          } else {
            store.dispatch(addNotification({
              type: 'error',
              title: errorTitle,
              message: errorMessage,
              duration: 5000,
            }));
          }
      }
    }

    // Handle auth slice errors
    if (action.type.endsWith('/rejected') && action.type.includes('auth')) {
      const errorMessage = getErrorMessage(action.payload || action.error);
      
      store.dispatch(addNotification({
        type: 'error',
        title: 'Authentication Error',
        message: errorMessage,
        duration: 5000,
      }));
    }
  };

  return { unsubscribe, handleApiError };
};

export const setupNetworkMonitoring = () => {
  if (typeof window !== 'undefined') {
    // Monitor online/offline status
    const handleOnline = () => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Connection Restored',
        message: 'You\'re back online!',
        duration: 3000,
      }));
    };

    const handleOffline = () => {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Connection Lost',
        message: 'You\'re currently offline. Some features may not work properly.',
        duration: 0, // Persistent until back online
      }));
    };

    // Add event listeners only once
    if (!window.__networkListenersAdded) {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.__networkListenersAdded = true;
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.__networkListenersAdded = false;
    };
  }

  return () => {};
};