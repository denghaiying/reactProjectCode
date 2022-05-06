import { useEffect, useState } from "react";
import {  Tree} from "antd";
import { Observer } from "mobx-react";
import { history } from 'umi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import MainChart from '../Components/MainChart/index.tsx';
import "./index.less";
import fetch from "../../../utils/fetch";

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
const Tyjk = (props) => {

  const {jdname = "通用接口数据情况" } = props;
  const [expand, setExpand] = useState(true);
  const [jkpzlist, setJkpzlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [jkpzid, setJkpzid]= useState<string>('');

  useEffect(() => {
      const querysjjkList =  async (params) =>{
        let url="/api/eps/tyjk/jkpz/findList";
        const response =await fetch.get(url,params);
        if (response.status === 200) {
          if (response.data.length > 0) {
            let  mbData = response.data.map(item => ({ 'id': item.id, 'title': item.name, 'key': item.id }));
            setJkpzlist(mbData);
          }else{
            setJkpzlist(response.data);
          }
        }
      }
    querysjjkList({});
  }, []);

  const onTreeeSelect  =  e => {
    setJkpzid(e[0]);
  }

  // end **************
  return (
    <Observer>{() =>
      <div className="oa-manage">
        <div className="title">{jdname}</div>
        <div className={expand ? 'content' : 'content hideExpand'}>
          <div className="tree">
            <Tree
                showIcon defaultExpandAll
                onSelect={onTreeeSelect}
                treeData={jkpzlist}
              />
            <div className="collapse-icon">
              <LeftOutlined size={12} className="icon left-arrow" onClick={() => { setExpand(false) }} />
              <RightOutlined size={12} className="icon right-arrow" onClick={() => { setExpand(true) }} />
            </div>
          </div>
          <div className="right">
            <MainChart  jkpzid={jkpzid}/>
          </div>
        </div>
      </div>
    }</Observer>
  );
};

export default Tyjk;
