import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import Dzwjdjz from "./Dzwjdjz.tsx";
import Dzwjdjmx from "./Dzwjdjmx.tsx";
import EpsFormType from '@/eps/commons/EpsFormType';
import { Form, Input, message, Radio, DatePicker, Select, Tabs, Table, Row, Col } from 'antd';
import { observer } from 'mobx-react';

const Dzwjdj = observer((props) => {
  const [checkrow, setCheckRow] = useState();
  const [curTabKey,setCurTabKey] = useState('1');
  const [checklength,setChecklength] = useState(0);
  const [dzwjdjid, setDzwjdjid]= useState<string>('1111');
  const [childTabname,setChildTabname] = useState('电子文件登记续表');

  const changeTabs = (activeKey)=>{
   if(activeKey === '2'){
      if(checkrow && checkrow.length>0){
        setDzwjdjid(checkrow[0].id);
      }else{
        setDzwjdjid("1111");
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
          setDzwjdjid(checkrow[0].id);
          setChildTabname(checkrow[0].dzwjinfoztbh+'-电子文件登记续表');
          setChecklength(checkrow.length);

       }
     }
    //YhStore.queryForPage();
  }, [checkrow]);

  return (
    <>
     <div style={{ height: '100%' ,margin: "10px"}}>
        <Tabs defaultActiveKey="1" onChange={changeTabs}>
        <Tabs.TabPane tab="电子文件登记" key="1"  style={{height: window.innerHeight - 150}}>
        <Dzwjdjz checkrow={setCheckRow}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab={childTabname}  disabled={checklength !== 1} key="2"   style={{height: window.innerHeight - 150}}>
          {curTabKey ==='2' ?
            <Dzwjdjmx dzwjdjinfoid={dzwjdjid}/>
          : <div></div> }

      </Tabs.TabPane>
    </Tabs>
    </div>
    </>
  );
})

export default Dzwjdj;
