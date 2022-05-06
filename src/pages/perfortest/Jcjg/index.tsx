import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import Jcjgz from "./Jcjgz.tsx";
import Jcjgmx from "./Jcjgmx.tsx";
import EpsFormType from '@/eps/commons/EpsFormType';
import { Form, Input, message, Radio, Switch, Tabs, Table } from 'antd';
import { observer } from 'mobx-react';
import './index.less'

const Jcjg = observer((props) => {
  const [checkrow, setCheckRow] = useState();
  const [curTabKey,setCurTabKey] = useState('1');
  const [checklength,setChecklength] = useState(0);
  const [jgzid, setJgzid]= useState<string>('1111');
  const [childTabname,setChildTabname] = useState('检测详情');

  const changeTabs = (activeKey)=>{
   if(activeKey === '2'){
      if(checkrow && checkrow.length>0){
        setJgzid(checkrow[0].id);
      }else{
        setJgzid("1111");
      }
    }else{
       if(checkrow && checkrow.length>0){
          setChecklength(checkrow.length);
      }else{
          setChecklength(0);
      }

    }
     setCurTabKey(activeKey)
  }

  useEffect(() => {
     if(checkrow){
       if(checkrow.length>0){
          setJgzid(checkrow[0].id);
          setChildTabname(checkrow[0].xsxjcjgzjcbc+'-检测结果详情');
          setChecklength(checkrow.length);

       }
     }
    //YhStore.queryForPage();
  }, [checkrow]);

  return (
    <>
        <Tabs defaultActiveKey="1" onChange={changeTabs}  style={{height: window.innerHeight-120, margin: "10px"}}>
        <Tabs.TabPane tab="检测结果" key="1">
            <Jcjgz checkrow={setCheckRow}/>
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab={childTabname}  disabled={checklength !== 1} key="2"  style={{height: '98%'}}>
          {curTabKey ==='2' ?
            <Jcjgmx jgzid={jgzid}/>
          : <div></div> }

      </Tabs.TabPane> */}
    </Tabs>
    </>
  );
})

export default Jcjg;
