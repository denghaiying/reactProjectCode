import { useState, useRef, useEffect } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import MjjgzService from '@/services/kfgl/mjjgz/MjjgzService';
import { Form, Input, message, Select } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
const FormItem = Form.Item;

const mjjgz = observer( () => {
  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: '层架标签设置'
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
        <Form.Item label="库房:" name="kfmc" >
            <Select className="ant-select" placeholder="请选择" options={mjjgzStore.kflist} style={{ width: 300 }}/>
        </Form.Item>
        <Form.Item label="组号:" name="zh" >
            <Select className="ant-select" placeholder="请选择" options={mjjgzStore.zhlist} style={{ width: 300 }}/>
        </Form.Item>
        <Form.Item label="列号:" name="lh" >
            <Select className="ant-select" placeholder="请选择" options={mjjgzStore.lhlist} style={{ width: 300 }}/>
        </Form.Item>
        <FormItem label="RFID" name="rfid" ><Input style={{ width: 300 }}/></FormItem>
      </>
    )
  }

  useEffect(() => {
    mjjgzStore.queryZhList();
    mjjgzStore.queryLhList();
    mjjgzStore.querKfList();
  }, []);

  const mjjgzStore = useLocalObservable(() => ({

    ip: "",
    zhlist: [],
    lhlist: [],
    kflist: [],

    async queryLhList() {
      const response = await fetch.get("/eps/control/main/mjjgz/queryFz?fzlx=LH");
      if (response && response.status === 200) {
        this.lhlist = response.data.map((item: { KFMJJ_LH: any;}) => ({label: item.KFMJJ_LH, value: item.KFMJJ_LH}));
      }
    },
    async queryZhList() {
      const response = await fetch.get("/eps/control/main/mjjgz/queryFz?fzlx=ZH");
      if (response && response.status === 200) {
        this.zhlist = response.data.map((item: { KFMJJ_ZH: any;}) => ({label: item.KFMJJ_ZH, value: item.KFMJJ_ZH}));
      }
    },
    async querKfList() {
      const response = await fetch.get("/eps/control/main/mjjz/kf");
      if (response && response.status === 200) {
        this.kflist = response.data.map((item: { kfmc: any; id: any; }) => ({label: item.kfmc, value: item.id}));
      }
    },
  }));

  const source: EpsSource[] = [
    {
      title: '读写RFID',
      code: 'action',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
      render: (text: any, record: any, index: string) => {
        return (
          <div>
            <a href="javascript:void(0)" onClick={() => WriteRFID(record)}>读写</a>
          </div>
        );
      }
    },
    {
      title: '库位码',
      code: 'kwm',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '组号',
      code: 'zh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '列号',
      code: 'lh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '节宽',
      code: 'jk',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '层高',
      code: 'cg',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '区号',
      code: 'qh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '库房名称',
      code: 'kfmc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: 'RFID',
      code: 'rfid',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]

  const WriteRFID = async (record: { [x: string]: any; }) => {
    const response1 = await fetch.get("/eps/control/main/rfidsb/getRfidMsg?opt=01&optip=" + mjjgzStore.ip);
    if (response1 && response1.data.success) {
      //返回的参数待调试
      record["rfid"] = response1.data.resultmsg;
    } else {
      //返回的参数待调试
      return message.warning(response1.data.message);
    }
    const response2 = await fetch.get("/eps/control/main/mjjgz/update", { params: record }); //发送的参数待调试
    if (response2 && response2.status === 200) {
      return message.success("RFID更新成功");
    } else {
      return message.warning("RFID更新失败");
    }
  };

  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={MjjgzService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
})

export default mjjgz;
