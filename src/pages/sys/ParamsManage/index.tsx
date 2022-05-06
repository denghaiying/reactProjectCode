import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import paramsService from '@/services/system/ParamsManageService';
import { Form, Input, message } from 'antd';
import { observer } from 'mobx-react';
import YhStore from "@/stores/system/YhStore";
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';


const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name'
}

const ParamsManage = observer((props) => {

  const ref = useRef();

  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <></>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(paramsService));



  const findByDataLx = (record, index, store) => {
    //使用 hidden 判断是否显示
    return  ([
      <EpsModalButton key={'systemConf' + index} isIcon={true} store={store} params={{ code: record.code, pzfs: "1", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/systemConf' title="系统配置" width={1200} height={400} name="系统配置" icon={<InteractionTwoTone />}></EpsModalButton>,
      <EpsModalButton key={'roleConf' + index} hidden={record.lx !== 'F'} isIcon={true} store={store} params={{ code: record.code, pzfs: "2", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/roleConf' title="角色配置" width={1200} height={400} name="角色配置" icon={<ContactsTwoTone />}></EpsModalButton>,
      <EpsModalButton key={'functionConf' + index} hidden={record.lx !== 'F'} isIcon={true} store={store} params={{ code: record.code, pzfs: "4", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/functionConf' title="功能配置" width={1200} height={400} name="功能配置" icon={<ControlTwoTone />}></EpsModalButton>,
      <EpsModalButton key={'roleFuntionConf' + index} hidden={record.lx !== 'F'} isIcon={true} store={store} params={{ code: record.code, pzfs: "5", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/roleFuntionConf' title="角色功能配置" width={1200} height={400} name="角色功能配置" icon={<GoldTwoTone />}></EpsModalButton>,
     ])
    

  }

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {

    return findByDataLx(record, index, store)

  //  return (
      // <>
      //   {[
      //     //系统配置
      //     <EpsModalButton key={'systemConf' + index} isIcon={true} store={store} params={{ code: record.code, pzfs: "1", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/systemConf' title="系统配置" width={1200} height={400} name="系统配置" icon={<InteractionTwoTone />} beforeOpen={(value) => {
      //       console.log('before open, ', value, record)
      //       return true;
      //     }}></EpsModalButton>,
      //     //角色配置
      //     <EpsModalButton key={'roleConf' + index} isIcon={true} store={store} params={{ code: record.code, pzfs: "2", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/roleConf' title="角色配置" width={1200} height={400} name="角色配置"
      //       beforeOpen={(value) => {
      //         if (record.lx === 'F') { return true } else { message.warning('系统参数仅允许按照系统配置'); return false }
      //       }}
      //       icon={<ContactsTwoTone />}></EpsModalButton>,
      //     //功能配置
      //     <EpsModalButton key={'functionConf' + index} isIcon={true} store={store} params={{ code: record.code, pzfs: "4", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/functionConf' title="功能配置" width={1200} height={400} name="功能配置"
      //       beforeOpen={(value) => {
      //         if (record.lx === 'F') { return true } else { message.warning('系统参数仅允许按照系统配置'); return false }
      //       }}
      //       icon={<ControlTwoTone />}></EpsModalButton>,
      //     //角色功能配置
      //     <EpsModalButton key={'roleFuntionConf' + index} isIcon={true} store={store} params={{ code: record.code, pzfs: "5", ypz: "Y", dwid: "", qslx: record.qslx, lx: record.lx, zy: record.zy }} url='/sys/params/roleFuntionConf' title="角色功能配置" width={1200} height={400} name="角色功能配置"
      //       beforeOpen={(value) => {
      //         if (record.lx === 'F') { return true } else { message.warning('系统参数仅允许按照系统配置'); return false }
      //       }}
      //       icon={<GoldTwoTone />}></EpsModalButton>,
      //   ]}
      // </>

   // );
  }
  useEffect(() => {
    // YhStore.queryDwTree();
    // YhStore.queryYhLx();
    // YhStore.queryGw();
    // YhStore.queryYhMj();
    // YhStore.queryYhZj();
    // YhStore.queryOrg();
    // YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [{
    title: '编码',
    code: 'code',
    align: 'center',
    ellipsis: true,         // 字段过长自动东隐藏
    fixed: 'left',
    width: 200,
    formType: EpsFormType.Input
  }, {
    title: '名称',
    code: 'name',
    align: 'center',
    width: 120,
    formType: EpsFormType.Input
  }, {
    title: '类型',
    align: 'center',
    code: 'lx',
    width: 120,
    ellipsis: true,
    formType: EpsFormType.Input,
    render: (text, record, index) => {
      if (text) {
        return text == 'F' ? '功能参数' : '系统参数';
      } else {
        return text = "无";
      }
    }
  },
  {
    title: '取数类型',
    code: 'qslx',
    align: 'center',
    width: 100,
    formType: EpsFormType.Input,
    render: (text, record, index) => {
      switch (text) {
        case "S":
          text = '单选';
          break
        case "N":
          text = '数值';
          break
        case "C":
          text = '字符';
          break
        default:
          text = '无';
          break
      }
      return text;
    }
  },
  {
    title: "值域",
    code: 'zy',
    align: 'center',
    formType: EpsFormType.Input,
    width: 140,

  }, {
    title: "缺省值",
    code: 'defaultv',
    align: 'center',
    width: 100,
    formType: EpsFormType.Input,

  }, {
    title: "说明",
    code: "sm",
    align: 'center',

    width: 100,
    formType: EpsFormType.Input,

  }, {
    title: "维护人",
    code: 'whr',
    width: 100,
    align: 'center',
    formType: EpsFormType.Input,

  }, {
    title: '维护时间',
    code: 'whsj',
    width: 160,
    align: 'center',
    formType: EpsFormType.None
  }]

  const title: ITitle = {
    name: '参数管理'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编码" className="form-item" name="code">
          <Input placeholder="请输入编码" />
        </Form.Item >
        <Form.Item label="名称" className="form-item" name="name">
          <Input placeholder="请输入名称" />
        </Form.Item>

      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={paramsService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={1100}
       
        searchForm={searchFrom}
        //  customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default ParamsManage;
