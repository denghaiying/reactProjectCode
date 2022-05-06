import util from './util';
/**
 * 设置当前语言
 * @param {String} lang
 */
function setLocale (lang) {
  if (lang !== undefined && !/^([a-z]{2})-([A-Z]{2})$/.test(lang)) {
    throw new Error('setLocale lang format error');
  }

  if (getLocale() !== lang) {
    util.setLStorage('lang', lang);
    window.location.reload();
  }
}

/**
 * 获取当前语言
 */
function getLocale () {
  if (!util.getLStorage('lang')) {
    util.setLStorage('lang', navigator.language);
  }
  return util.getLStorage('lang');
}

export { setLocale, getLocale };
