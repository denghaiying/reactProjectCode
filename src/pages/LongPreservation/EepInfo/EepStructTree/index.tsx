import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message, InputNumber, Select, Tree} from 'antd';
import {observer, useLocalObservable} from "mobx-react";
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


const EepStructTree = observer((props) => {
const ref = useRef();

 const EepStructTreeStore = useLocalObservable(() => (
        {
            params: {},
            treeDataSource : [],
            async queryEepTree(value) {
                let url="/api/api/eepinfo/queryEepStructTree/"+value;
                const response=await fetch.get(url);
                if (response.status === 200) {
                      this.treeDataSource=response.data;
                    }else{
                        return;
                    }
            }
        }

    ));
useEffect(() => {
 EepStructTreeStore.queryEepTree(props.aipid);
}, [props.aipid]);


 const title: ITitle = {
    name: '封包结构'
  }


  return (
    <>
      <div style={{ overflow: 'auto',height: '95%'}}>
      <Tree
          treeData={EepStructTreeStore.treeDataSource}
          showLine
          defaultExpandAll={true}
          />
      </div>
    </>
  );
})

export default EepStructTree;
