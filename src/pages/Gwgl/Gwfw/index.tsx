import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Button } from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import FwService from './Service/FwService';
import moment from 'moment';
import { FileAddOutlined } from '@ant-design/icons';
import WflwButtons from '@/components/Wflw';

/**
 * 发文
 */
const Fw = observer((props) => {
  useEffect(() => {}, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
    searchCode: 'name',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: 'Id',
      code: 'id',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden: true,
    },
    {
      title: '紧急程度',
      code: 'jjcd',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '标题',
      code: 'title',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
      render:(text,record,index)=>{
        debugger
        return (<Button type="text">{text}</Button>);
      }
    },
    {
      title: '发文号',
      code: 'fwh',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '拟稿部门',
      code: 'ngbm',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '拟稿部门ID',
      code: '拟稿部门ID',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden: true,
    },
    {
      title: '拟稿人',
      code: 'ngr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '拟稿人ID',
      code: '拟稿人ID',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden: true,
    },
    {
      title: '公文种类ID',
      code: 'doctypeId',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden: true,
    },
    {
      title: '公文种类',
      code: 'doctypename',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '校对人',
      code: 'jdr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
    },
    {
      title: '校对人ID',
      code: 'jdrID',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden: true,
    },
    {
      title: '发文日期',
      code: 'fwrq',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '秘密等级',
      code: 'mj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '主题词',
      code: 'ztc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '拟稿意见',
      code: 'ngyj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '分发',
      code: 'fenfa',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '主送',
      code: 'zhusong',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '主送ID',
      code: 'zhusongbmid',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden: true,
    },
    {
      title: '抄送',
      code: 'chaosong',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '抄送ID',
      code: 'CHAOSONGBMID',
      align: 'center',
      formType: EpsFormType.Input,
      hidden:true,
    },
    {
      title: '正文文件',
      code: 'zwwj',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden:true,
    },
    {
      title: '附件ID',
      code: 'filegrpid',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden:true,
    },
    {
      title: '维护人ID',
      code: 'whrid',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden:true,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      tableHidden:true,
    },
    {
      title: 'whsj',
      code: '维护时间',
      align: 'center',
      formType: EpsFormType.Input,
      hidden: true,
      tableHidden:true,
    },
    {
      title: '创建时间',
      code: 'createtime',
      align: 'center',
      formType: EpsFormType.Input,
      // tableHidden:true,
    },
  ];


  const onSFWClick = (value: any) => {
    let mywindow = window.open(
      `/runRfunc/${value === 1 ? 'gwfw/form' : 'gwsw/form'}`,
    );
    // if (mywindow) {
    //   mywindow.onload = () => {
    //     if (mywindow) {
    //       mywindow.document.title =
    //         value === 1 ? '新增-发文拟稿' : '新增-收文登记';
    //       mywindow.onunload = () => {
    //         console.log('onunload');
    //         // initDatas();
    //       };
    //     }
    //   };
    // }
  };
  //搜索区域自定义
  const customAction = (text, record, index, store) => {
    return (
      <>
        <Button type="primary" onClick={() => onSFWClick(1)}>
          <FileAddOutlined /> 新建
        </Button>
      </>
    );
  };
  //table表格内自定义
  const customTableAction = (text, record, index, store) => {
    return <>
                  {/* <WflwButtons
              offset={[18, 0]}
              type={['submit', 'return', 'reject']}
              wfid={getWfid()}
              wfinst={getWfinst()}
              onBeforeAction={onBeforeAction}
              onAfterAction={onAfterAction}
            /> */}

    </>;
  };

  return (
    <>
      <EpsPanel
        title={'发文'} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={FwService} // 右侧表格实现类，必填
        customAction={customAction}
        customTableAction={customTableAction}
      ></EpsPanel>
    </>
  );
});

export default Fw;
