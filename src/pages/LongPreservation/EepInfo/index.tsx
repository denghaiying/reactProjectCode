import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import AsipPackage from "./AsipPackage/index.tsx";
import EepMeta from "./EepMeta/index.tsx";
import EepMetaJn from "./EepMetaJn/index.tsx";
import EepStructTree from "./EepStructTree/index.tsx";
import EepData from "./EepData/index.tsx";
import EepDataJn from "./EepDataJn/index.tsx";
import EepFile from "./EepFile/index.tsx";
import EepFileJn from "./EepFileJn/index.tsx";


import EpsFormType from '@/eps/commons/EpsFormType';
import { Form, Input, message, Radio, Switch, Tabs, Table } from 'antd';
import './index.less';

import { observer } from 'mobx-react';

const EepInfo = observer((props) => {
  const [checkrow, setCheckRow] = useState();
  const [checkrowtwo, setCheckRowtwo] = useState();
  const [checkrowtwoJn, setCheckRowtwoJn] = useState();
  const [curTabKey,setCurTabKey] = useState('1');
  const [checklength,setChecklength] = useState(0);
  const [aipid, setAipid]= useState<string>('1111');
  const [checklengthtm,setChecklengthtm] = useState(0);
  const [checklengthtmJn,setChecklengthtmJn] = useState(0);
  const [tmid, setTmid]= useState<string>('1111');
  const [tmidJn, setTmidJn]= useState<string>('1111');
  const changeTabs = (activeKey)=>{
   if(activeKey === '2'){
      if(checkrow && checkrow.length>0){
        setAipid(checkrow[0].id);
      }else{
        setAipid("1111");
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
          setAipid(checkrow[0].id);
          setChecklength(checkrow.length);
          setChecklengthtm(0);
          setChecklengthtmJn(0);
          setTmid('1111');
          setTmidJn('1111');
       }
     }
    //YhStore.queryForPage();
  }, [checkrow]);
    useEffect(() => {
     if(checkrowtwo){
         if(checkrowtwo.length>0){
          setTmid(checkrowtwo[0].id);
          setChecklengthtm(checkrowtwo.length);
       }
     }
    //YhStore.queryForPage();
  }, [checkrowtwo]);
    useEffect(() => {
     if(checkrowtwoJn){
         if(checkrowtwoJn.length>0){
          setTmidJn(checkrowtwoJn[0].id);
          setChecklengthtmJn(checkrowtwoJn.length);
       }
     }
    //YhStore.queryForPage();
  }, [checkrowtwoJn]);

  return (
    <>
     
      <Tabs defaultActiveKey="1" onChange={changeTabs} style={{ height: '100%', margin: '5px' }}>
      <Tabs.TabPane tab="AIP包信息" key="1" style={{height: window.innerHeight - 150}}>
            <AsipPackage checkrow={setCheckRow} />
      </Tabs.TabPane>
      <Tabs.TabPane tab='封包结构'  disabled={checklength !== 1} key="2" style={{height: window.innerHeight - 150}}>
           <EepStructTree  aipid={aipid}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='元数据'  disabled={checklength !== 1} key="3" style={{height: window.innerHeight - 150}}>
           <EepMeta  aipid={aipid}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='卷内元数据'  disabled={checklength !== 1} key="4" style={{height: window.innerHeight - 150}}>
           <EepMetaJn  aipid={aipid}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='条目信息'  disabled={checklength !== 1} key="5" style={{height: window.innerHeight - 150}}>
           <EepData  aipid={aipid} checkrowtwo={setCheckRowtwo}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='卷内条目信息'  disabled={checklength !== 1} key="6" style={{height: window.innerHeight - 150}}>
           <EepDataJn  aipid={aipid} checkrowtwoJn={setCheckRowtwoJn}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='原文信息'  disabled={checklengthtm !== 1} key="7" style={{height: window.innerHeight - 150}}>
           <EepFile  aipid={aipid} tmid={tmid}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab='卷内原文信息'  disabled={checklengthtmJn !== 1} key="8" style={{height: window.innerHeight - 150}}>
           <EepFileJn  aipid={aipid} tmidJn={tmidJn}/>
      </Tabs.TabPane>
    </Tabs>
    </>
  );
})

export default EepInfo;
