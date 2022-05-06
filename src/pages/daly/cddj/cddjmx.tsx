import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable, ITree } from '@/eps/commons/declare';
import { Col, Form, Input, Row, Select, Badge, Checkbox } from 'antd';
import { PaperClipOutlined, SettingOutlined } from '@ant-design/icons';
import { observer, useLocalObservable } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
import CddjService from './CddjService';
import LydjStore from '@/stores/dadt/LydjStore';
import moment from 'moment';
import fetch from '@/utils/fetch'
import FileView from './fileView';
import './index.less';

const cddjmx = observer((props) => {
  const tableProp: ITable = {
    tableSearch: false,
    disableAdd: true,
    disableEdit: true,
    disableCopy: true,

  }

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


  //const { TextArea } = Input;
  const ref = useRef();
  const umid = "JC061";
  /**
   * childStore
   */
  const cddjStore = useLocalObservable(() => (
    {

      ischeck: false,
      params: {},
      rolerenderlist: [],
      qwtmgzlstA: [],
      qwywgzlstB: [],
      roleData: [],
      qwgzlst: [],
      MkReg: false,
      dakRoleList: [],
      async getMkReg() {
        const response = await fetch.get(`/api/eps/control/main/getMkReg?mkbh=DMZSGN`);
        if (response && response.status === 200) {
          if (response.data && response.data.success && "Y" == response.data.message) {
            this.MkReg = true;
          } else {
            return;
          }
        }
      },
    }
  ));

  const showLymxFile = (record) => {
    if (record.fjs > 0) {
      LydjStore.showFiles('L', { ...record });
    }
  };

  const customTableAction = (text, record, index, store) => {
    return (<>
      <a
        href="javascript:void(0)"
        style={{ marginLeft: 10 }}
        onClick={() => {
          showLymxFile(record);
        }}
      >
        <Badge count={record.fjs ? record.fjs : 0} size="small">
          <PaperClipOutlined />
        </Badge>
      </a>


    </>)
  }

  useEffect(() => {


  }, []);

  const setCheck = async (text, record) => {
    debugger;
    if (text !== undefined && text === 'Y') {
      return true;
    } else {
      return false;
    }
  };


  const source: EpsSource[] = [
    {
      title: '实体借阅',
      code: 'stjy',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index,rowIndex) => {
        const [switchValue, setSwitchValue] = useState(text === 'Y');
        useEffect(() => {
          setSwitchValue(text === 'Y');
        }, [text]);
        return (
          <Checkbox
            defaultChecked={switchValue}
            onChange={(checked) => { LydjStore.checkLymxRecord(index, checked) }}
          />);

      }
    },

    {
      title: '题名',
      code: 'tm',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '档号',
      code: 'dh',
      align: 'center',
      width: 160,
      formType: EpsFormType.Input
    },
    {
      title: '年度',
      code: 'nd',
      align: 'center',
      width: 160,
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '利用明细'
  }

  return (
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={100}
      customTableAction={customTableAction}
      tableService={CddjService}
    >
    </EpsPanel>



  );
  <FileView />
})

export default cddjmx;
