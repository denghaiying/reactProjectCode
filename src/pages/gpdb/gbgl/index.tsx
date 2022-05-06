import { useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import GbglService from '@/services/gpdb/gbgl/GbglService';
import fetch from "../../../utils/fetch";
import { Form, Input, message, Select } from 'antd';
const FormItem = Form.Item;

function gbgl() {
  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: '包管理'
  }

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableAdd: true,
    disableDelete: true,
    disableEdit: true,
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="打包人" className="form-item" name="yhmc"><Input placeholder="请输入打包人" /></FormItem >
        <FormItem label="用户编号" className="form-item" name="yhbh"><Input placeholder="请输入用户编号" /></FormItem >
        <Form.Item label="打包状态:" name="state" >
          <Select className="ant-select"  placeholder="请选择打包状态">
              <option value="">全部</option>
              <option value="0">等待打包中</option>
              <option value="2">打包完成</option>
          </Select>
        </Form.Item>
      </>
    )
  }

  const doDownloadAction = (async (record: any) => {
    if (record.state!="C") {
      return message.warning('只有打包完成状态的包才能下载！');
    }
    const response = await fetch.get("/eps/control/main/gpkl/download" + "?ftpid=" + record.ftpid + "&id=" + record.id);
    debugger
    if (response && response.status === 200) {
      
    }
  });

  const source: EpsSource[] = [
    {
      title: '#',
      code: 'action',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: any, record: any, index: string) => {
        return (
          <div>
            <a href="javascript:void(0)" onClick={() => doDownloadAction(record)}>下载</a>
          </div>
        );
      }
    },
    {
      title: '状态',
      code: 'state',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string) => {
        const zt = [
          {value:"0",item:"等待打包中"},
          {value:"1",item:"正在打包中"},
          {value:"2",item:"打包出错"},
          {value:"C",item:"打包完成"}
        ];
        for (var i = 0, l = zt.length; i < l; i++) {
          const state:any = zt[i];
          if (state.value == text) {
            return state.item;
          }
        }
      }
    },
    {
      title: '打包类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string) => {
        if (text=="0"){
            return "全盘打包";
        } else if (text=="1"){
            return "增量打包";
        } else {
            return "全盘打包";
        }
      }
    },
    {
      title: '打包时间',
      code: 'dbsj',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '打包人',
      code: 'yhmc',
      align: 'center',
      formType: EpsFormType.Input
    }, 
    {
      title: '用户编号',
      code: 'yhbh',
      align: 'center',
      formType: EpsFormType.Input
    }, 
    {
      title: '错误信息',
      code: 'msg',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]

  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={GbglService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default gbgl;