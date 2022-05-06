import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import Jcgzz from "./Jcgzz.tsx";
import Jcgzmx from "./Jcgzmx.tsx";
import EpsFormType from '@/eps/commons/EpsFormType';
import { Form, Input, message, Radio, Switch, Tabs, Table } from 'antd';
import { observer } from 'mobx-react';
import './TabLayout.less';

const Jcgz = observer((props) => {
  const [checkrow, setCheckRow] = useState();
  const [curTabKey,setCurTabKey] = useState('1');
  const [checklength,setChecklength] = useState(0);
  const [gzid, setGzid]= useState<string>('1111');
  const [childTabname,setChildTabname] = useState('规则详情');

  const changeTabs = (activeKey)=>{
   if(activeKey === '2'){
      if(checkrow && checkrow.length>0){
        setGzid(checkrow[0].id);
      }else{
        setGzid("1111");
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
          setGzid(checkrow[0].id);
          setChecklength(checkrow.length);
         setChildTabname(checkrow[0].sxjcjcgzname+'-规则详情');
       }
     }
    //YhStore.queryForPage();
  }, [checkrow]);

  return (
    <>
      <div style={{ height: '100%' ,margin: "10px"}}>
        <Tabs defaultActiveKey="1" onChange={changeTabs}>
        <Tabs.TabPane tab="检测规则" key="1"  style={{height: window.innerHeight - 150}}>
            <Jcgzz checkrow={setCheckRow}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab={childTabname}  disabled={checklength !== 1} key="2"   style={{height: window.innerHeight - 150}}>
          {curTabKey ==='2' ?
            <Jcgzmx gzid={gzid}/>
          : <div></div> }

      </Tabs.TabPane>
    </Tabs>
    </div>
    </>
  );
})

export default Jcgz;
