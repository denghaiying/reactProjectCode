import { observer } from 'mobx-react';
import { useIntl } from 'umi';
import Kkjs from './kkjs';

import './index.less';
import DakDashboard from './DakDashboard';
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
const tmzt = 8;
const jdumid = 'DAJD001';
const jdname = '开放鉴定';
const ArchiveInfo = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();

  // end **************
  return (
    <DakDashboard tmzt={tmzt} jdumid={jdumid} jdname={jdname} {...props} />
  );
});

export default ArchiveInfo;
