import  {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row} from 'antd';
import { observer } from 'mobx-react';
import ChannelTypeService from './channelTypeService';
import moment from "moment";
const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: true,
  disableEdit: true,
  disableDelete:true,
  disableAdd:true,
  disableCopy:true
}

const ChannelType = observer((props) =>{

  const [umid, setUmid] = useState('');

  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');



  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(ChannelTypeService));
  // const customTableAction = (text, record, index, store) => {
  //
  //   return (<>
  //     {[
  //       //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
  //     ]}
  //   </>)}

  useEffect(() => {
    // SearchStore.queryDw();
    setUmid('SELF001');
  }, []);

  // const customAction = (store: EpsTableStore) => {
  //   return ([<>
  //     {/* <EpsReportButton store={store} umid={umid} /> */}
  //     {/*        <EpsReportButton store={store} umid={umid} />*/}
  //   </>])
  // }

  const span = 24;
  const _width = 240


// 自定义表单

  const customForm = () => {
    //自定义表单校验


    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="栏目类型编号" name="channeltypebh" >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="栏目类型名称" name="channeltypename" >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护时间" name="whsj" initialValue={getDate}>
              <Input disabled style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
        </Row>
      </>
    )
  }

  const source: EpsSource[] = [{
    title: '编号',
    code: 'channeltypebh',
    align: 'center',
    formType: EpsFormType.Input
  },
    {
      title: '名称',
      code: 'channeltypename',
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
    }
  ]
  const title = {
    name: '栏目类型管理'
  }

  return (
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={500}
      //customTableAction={customTableAction}                  // 高级搜索组件，选填
      tableService={ChannelTypeService}
      customForm={customForm}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
})

export default ChannelType;
