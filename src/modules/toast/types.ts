export type ToastLink = {
  title?: string;
  url?: string;
};

export type ToastEventType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'sentry';
