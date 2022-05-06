

import CommStore from '@/stores/system/CommStore';

import history from './history';
import fetch from "@/utils/fetch";

const runFunc = (item) => {

  if (item.id !== 'home' && item.id !== '/home') {
    CommStore.getFuncInfo(item).then(fi => {
      if (fi.openlx === "5") {
        history.push(`/run/${fi.sysid}/iframe/${fi.umid}`);
      }
      else {
        history.push(`/run/${fi.sysid}/${fi.url}`);
      }
    });
  } else {
    history.push('/');
  }
};


const getMkReg = async (mkbh) => {
  const data = await fetch.get(`/api/eps/control/main/getMkReg?mkbh=` + mkbh);
  if (data.status === 200) {
    return true;
  } else {
    return false;
  }

};


const getParamDev = async (code, mdid) => {
  const data = await fetch.get(`/api/eps/control/main/params/getParamsDevOption` ,{ params: { code: code,
      gnid: mdid,
      yhid: 'YH201904132026100005' } });

  if (data.status === 200) {
    return true;
  } else {
    return false;
  }

  return data;
};



export { runFunc ,getMkReg ,getParamDev};
