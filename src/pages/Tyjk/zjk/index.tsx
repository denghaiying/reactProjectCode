import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import zjkService from './service/ZjkService';
import { Form, Input, message, Select, FormInstance } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [{value: "1", label: "数据同步"},{value: "2", label: "用户同步"}, {value: "3", label: "组织机构同步"}, {value: "4", label: "数据导入到表"}, {value: "5", label: "AD域数据同步"},{value: "6", label: "温湿度远程数据同步"} ,{value: "7", label: "档案库到编研库同步"},{value: "8", label: "ASIP包更新"},{value: "9", label: "EEP包更新"},{value: "10", label: "ASIP包数据同步"}];
const dbData =[{value: "ORACLE", label: "ORACLE"},{value: "SQLSERVER", label: "SQLSERVER"}, {value: "MYSQL", label: "MYSQL"},
                                {value: "H2", label: "H2"},{value: "KINGBASE8", label: "人大金仓"},{value: "DM", label: "达梦"} ];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const Zjk = observer((props) => {

const [form, setForm] = useState();

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'name',
  onAddClick: (form) => {
    setForm(form)
  },
  onEditClick: (form) => {
    setForm(form)
  }
}

const ref = useRef();

const _width = 380

const handleChange = async(value) => {
  switch (value) {
    case "ORACLE":
    {
       form.setFieldsValue({drive: "jdbc:oracle:thin:@127.0.0.1:1521:ZJK", url:"oracle.jdbc.driver.OracleDriver"});
      break;
    }
    case "SQLSERVER":
    {
       form.setFieldsValue({ drive: "jdbc:jtds:sqlserver://127.0.0.1:1433/ZJK",url:"net.sourceforge.jtds.jdbc.Driver"});
      break;
    }
    case "MYSQL":
    {
       form.setFieldsValue({ drive: "jdbc:mysql://localhost:3306/ZJK?useOldAliasMetadataBehavior=true",url:"com.mysql.jdbc.Driver"});
      break;
    }
    case "H2":
    {
       form.setFieldsValue({ drive: "jdbc:h2:mem:testdb;MODE=MYSQL;DB_CLOSE_DELAY=-1",url:"org.h2.Driver"});
      break;
    }
    case "KINGBASE8":
    {
       form.setFieldsValue({ drive: "jdbc:kingbase8://192.168.3.7:54321/EPS?useUnicode=true&characterEncoding=utf8&currentSchema=EPS&stringtype=unspecified",url:"com.kingbase8.Driver"});
      break;
    }
     case "DM":
    {
       form.setFieldsValue({ drive: "jdbc:dm://192.168.1.133/DMSERVER", url:"dm.jdbc.driver.DmDriver"});
      break;
    }
  }
  

}

const customForm = (form: FormInstance) => {

  return (
    <>

      <Form.Item label="名称:" name="name" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="接口类型:" name="lx" required rules={[{ required: true, message: '请选择接口类型' }]}>
         <Select   placeholder="接口类型"   options={lxData} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="数据库:" name="db" required rules={[{ required: true, message: '请选择数据库' }]}>
        <Select   placeholder="数据库"   options={dbData} style={{width:  _width}} onChange={(value) => handleChange(value)}/>
      </Form.Item>
      <Form.Item label="连接驱动:" name="drive"  required rules={[{ required: true, message: '请输入连接驱动' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="连接字符串:" name="url"  required rules={[{ required: true, message: '请输入连接字符串' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="连接用户名:" name="conname" required rules={[{ required: true, message: '请输入连接用户名' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="连接密码:" name="conpass"  required rules={[{ required: true, message: '请输入连接密码' }]}>
        <Input.Password allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>

      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zjkService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }
  useEffect(() => {

    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [ {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '接口类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist=lxData;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '数据库',
      code: 'db',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let sjklist=dbData;
        let aa = sjklist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      }
    },{
      title: '连接驱动',
      code: 'drive',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '连接字符串',
      code: 'url',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '连接用户名',
      code: 'conname',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input
    }]
  const title: ITitle = {
    name: '中间库配置'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="名称" className="form-item" name="name"><Input placeholder="请输入名称" /></Form.Item >
        <Form.Item label="接口类型" className="form-item" name="lx"> <Select   placeholder="接口类型"   options={lxData} /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={zjkService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={600}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default Zjk;
