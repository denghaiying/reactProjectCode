import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import jcjgmxService from './service/JcjgmxService';
import { Form, Input, message, Radio, Switch, Select } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { ContainerOutlined } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";


import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const tableProp: ITable = {
  disableCopy: true,
  disableEdit: true,
  disableAdd: true,
  disableDelete: true,
  searchCode: 'xsxjcjgjcbc',
  rowSelection:{
    type:'radio'
    }
  }

const Jcjgmx = observer((props) => {

  const ref = useRef();

  


  const customForm = () => {

    return (
      <>
      </>
    )
  }
    // 全局功能按钮
    const customAction = (store: EpsTableStore) => {
      return ([
        <></>
      ])
    }

    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(jcjgmxService));
    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
      return (
        <>
          {[
            //角色功能配置
            <EpsModalButton key={'sxjcjgLog' + index} isIcon={true} store={store} params={{jgmxid: record.id}} url='/perfortest/jcjg/sxjcjgLog' title="详情" width={1200} height={400} name="详情"
              icon={<ContainerOutlined />}></EpsModalButton>,
          ]}
        </>
      );
    }
    useEffect(() => {
    }, []);

    const source: EpsSource[] = [ {
        title: '检测批次',
        code: 'xsxjcjgjcbc',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '检测类型',
        code: 'xsxjcjgjclx',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '真实性检测',
        code: 'xsxjcjgzsjg',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '安全性检测',
        code: 'xsxjcjgkkjg',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '完整性检测',
        code: 'xsxjcjgwzjg',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '可用性检测',
        code: 'xsxjcjgkyjg',
        align: 'center',
        formType: EpsFormType.Input
      }]
    const title: ITitle = {
      name: '检测详情'
    }


    const searchFrom = () => {
      return (
        <>
          <Form.Item label="编号" className="form-item" name="archiveinfoCode"><Input placeholder="请输入业务号" /></Form.Item >
        </>
      )
    }

    return (
      <>
       
          <EpsPanel title={title}                    // 组件标题，必填
            source={source}                          // 组件元数据，必填
            tableProp={tableProp}                    // 右侧表格设置属性，选填
            tableService={jcjgmxService}             // 右侧表格实现类，必填
            ref={ref}                                // 获取组件实例，选填
            formWidth={1100}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            initParams={{'jgzid':props.jgzid}}
            customTableAction={customTableAction}
          > 
        </EpsPanel>
      </>
    );
  })

export default Jcjgmx;
