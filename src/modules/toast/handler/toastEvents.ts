export default <ToastEvents>{
  success: 'toastSuccess',
  warning: 'toastWarning',
  error: 'toastError',
  info: 'toastInfo'
};

type ToastEvents = {
  [key: string]: string;
};
