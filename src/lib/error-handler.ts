import type { NavigateFunction } from 'react-router-dom';

interface ApiError {
  status: number;
  message: string;
}

export class ErrorHandler {
  private navigate: NavigateFunction;

  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  /**
   * Handles API errors without triggering navigation for data fetching errors
   */
  handleApiError(error: ApiError): ApiError {
    switch (error.status) {
      case 401:
        if (
          error.message.includes('authentication') ||
          error.message.includes('token')
        ) {
          this.navigate('/401');
        }
        break;
      case 500:
        if (
          error.message.includes('system') ||
          error.message.includes('critical')
        ) {
          this.navigate('/500');
        }
        break;
      default:
        console.error('API Error:', error);
    }

    return error;
  }

  /**
   * Handles route errors and navigation errors
   */
  handleRouteError(error: Error): void {
    if (error.message.includes('Not Found')) {
      this.navigate('/404');
    } else {
      console.error('Route Error:', error);
      this.navigate('/500');
    }
  }
}
