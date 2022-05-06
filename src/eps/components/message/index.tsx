export const showMessage = (
  msg: string,
  type: 'warn' | 'info' | 'error' | 'success' = 'info',
) => {
  if (top.mainStore) {
    top.message[type](msg);
  } else {
    window.top.Eps.showTip(msg);
  }
};
