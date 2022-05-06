const util = {};
util.getMessage = (code) => {
  const {
    intl: { formatMessage },
  } = this.props;
  switch (code) {
    case 400:
      return formatMessage({ id: 'e9.exception.400' });
    case 404:
      return formatMessage({ id: 'e9.exception.404' });
    case 500:
      return formatMessage({ id: 'e9.exception.500' });
    case 501:
      return formatMessage({ id: 'e9.exception.501' });
    case 502:
      return formatMessage({ id: 'e9.exception.502' });
    case 503:
      return formatMessage({ id: 'e9.exception.503' });
    default:
      return formatMessage({ id: 'e9.exception.default' });
  }
};

util.bussinessException = (errcode, errmessage) => ({
  code: errcode,
  message: errmessage || this.getMessage(errcode),
});
util.setSStorage = function (item, value) {
  const v = JSON.stringify(value);
  sessionStorage.setItem(item, v);
};

util.getSStorage = function (item) {
  const v = sessionStorage.getItem(item);
  if (v) {
    return JSON.parse(v);
  }
  return null;
};

util.clearSStorage = function (item) {
  sessionStorage.removeItem(item);
};

util.setLStorage = function (item, value) {
  const v = JSON.stringify(value);
  localStorage.setItem(item, v);
};

util.getLStorage = function (item) {
  const v = localStorage.getItem(item);
  if (v) {
    return JSON.parse(v);
  }
  return null;
};

util.clearLStorage = function (item) {
  localStorage.removeItem(item);
};

/* eslint-disable no-bitwise */
util.uuid = () => {
  const id = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .toLowerCase();
  return id;
};

util.addUrlParam = (url, parjson) => {
  let nurl = url;
  const idx = nurl.indexOf('?');
  if (idx < 0) {
    nurl = `${nurl}?`;
  } else {
    nurl = `${nurl}&`;
  }
  Object.keys(parjson).forEach((k) => {
    nurl = `${nurl}${k}=${parjson[k]}&`;
  });
  if (nurl.endsWith('&')) {
    nurl = nurl.substring(0, nurl.length - 1);
  }
  return nurl;
};

util.getCurrentTime = () => {
  const date = new Date();
  const datestring = date.getTime();
  return datestring;
};

util.showError = (err) => {
  Notification.open({
    title: '出错',
    content: err.message,
    type: 'error',
  });
};

util.num2arr = (count) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(i);
  }
  return arr;
};

export default util;
