import  { useEffect} from "react";
import TableService from "./TableService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from "mobx-react";
import { useIntl } from 'umi';
import Kkjs from './kkjs';


import "./index.less";
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
const tmzt=-100
const jdumid = "EPS9TYJK005"
const jdname = "电子中心文件档案(整理)"
const ArchiveInfo = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();

  // end **************
  return (
    <Kkjs  tmzt={tmzt} jdumid={jdumid} jdname={jdname} {...props}/>
  );
});

export default ArchiveInfo;
