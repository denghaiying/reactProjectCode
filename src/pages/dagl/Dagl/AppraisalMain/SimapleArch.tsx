import { useEffect } from 'react';
import TableService from './TableService';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from 'mobx-react';
import { useIntl } from 'umi';
import FullTreeArch from './fullTreeArch';

import './index.less';
/**
 * @Author: caijc
 * @Date: 2021/8/1
 * @Version: 9.0
 * @Content:
 *    2021/08/10 蔡锦春
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const tmzt = 1;
const jdumid = 'DAGL001';
const jdname = '档案收集';
const ArchiveInfo = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();

  // end **************
  return (
    <FullTreeArch tmzt={tmzt} jdumid={jdumid} jdname={jdname} {...props} />
  );
});

export default ArchiveInfo;
