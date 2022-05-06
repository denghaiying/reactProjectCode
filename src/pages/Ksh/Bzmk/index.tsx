import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import bzmkService from './service/BzmkService';
import { Form, Input, message,InputNumber, Radio, Select, Row, Col, Tooltip} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const btTypeData =[{value: 0, label: '单系列饼图'},{value: 1, label: '多系列饼图'},{value: 2, label: '多系列百分比饼图'},{value: 3, label: '单系列横向柱形图'},{value: 4, label: '单系列纵向柱形图'},{value: 5, label: '多系列横向柱形图'},{value: 6, label: '多系列纵向柱形图'},{value: 7, label: '折线图'},{value: 8, label: '数据面积图'},{value: 9, label: '柱形折线混合图'},{value: 10, label: '雷达图'}
  ,{value: 11, label: '漏斗图'},{value: 12, label: '仪表盘图'},{value: 13, label: '树图'},{value: 14, label: '矩形树图'},{value: 15, label: '旭日图'},{value: 16, label: '散点图'},{value: 17, label: '气泡图'},{value: 18, label: '主题河流图'},{value: 19, label: '日历坐标系'},{value: 20, label: '表格'},{value: 21, label: '统计表'},{value: 22, label: '设备管理图表'},{value: 23, label: 'iframe内嵌网页'},{value: 24, label: 'video视频'},{value: 25, label: '按钮组图表'},{value: 26, label: '滚动图表'}];
const mulitpleData = [{value: 0, label: '单系列'},{value: 1, label: '多系列'}];
const sizeData = [{value: 0, label: '小尺寸'},{value: 1, label: '较大尺寸'}];
const qzfsData= [{value: 'URL', label: 'URL'},{value: 'SQL', label: 'SQL'}];
const sqlsmValue="由于图表需要特定名称,因此SQL需重命名为name(名称),vaule(数值),max(最大数值),x(X轴数值<散点图/气泡图>),y(y轴数值 <散点图/气泡图>),sjdate(日期<主题河流图/日历坐标>),type(开关)属性，因此sql语句的格式，需要将查询的数值 as 成所需要的属性,如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; 多个语句时 ,语句必须‘;’结尾,语句间 必须用$charildsql$ 连接如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; $charildsql$ select B.name as name, COUNT(*) as value  from  B  group  by B.name;";
const sqlzsmValue="由于多系列,需要外层数据和内数据,因此外层SQL和SQL是需关联的,外层需要必须值id,name,zid 如select A.id as id,A.name as name,A.id as zid from  A,而且内sql,必须和外层id关联条件,条件时值必须为$charildid$ ,如 外层SQL为：select A.id as id,A.name as name,A.id as zid  from  A; 那么下面的SQL为 select C.name as name COUNT(*) as value  from  C where C.zid=$charildid$; SQL多个时必须用$charildsql$ 连接";

const span = 8;
const _width = 200
const color ='red';
const _span = 12;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  labelColSpan: 8,
  searchCode: 'bzmkmc'
}

const Bzmk = observer((props) => {

const ref = useRef();


const customForm = () => {
  return (
    <>
    <Row gutter={24}>
      <Col span={span}>
        <Form.Item label="模块编号"  name="bzmkbh" required  rules={[{ required: true, message: '请输入模块编号' }]}>
              <Input allowClear style={{ width:  _width }} />
          </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="模块标题:" name="bzmkmc" required  rules={[{ required: true, message: '请输入模块标题' }]}>
          <Input allowClear style={{ width:  _width }} />
        </Form.Item>
      </Col>
       <Col span={span}>
        <Form.Item label="图表标题:" name="bzmkqtmc" required  rules={[{ required: true, message: '请输入图表标题' }]}>
          <Input allowClear style={{ width:  _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="图表尺寸大小"  name="bzmksize" required  rules={[{ required: true, message: '请选择图表尺寸大小' }]}>
               <Select   placeholder="图表尺寸大小"   options={sizeData} style={{width:  _width}}/>
            </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="图表类型"  name="bzmktype" required  rules={[{ required: true, message: '请选择图表类型' }]}>
               <Select   placeholder="图表类型"   options={btTypeData} style={{width:  _width}}/>
            </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="系列"  name="bzmkmultiple" required  rules={[{ required: true, message: '请选择系列' }]}>
               <Select   placeholder="系列"   options={mulitpleData} style={{width:  _width}}/>
            </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="图表宽度:" name="bzmkwidth" tooltip="取值范围1-36，表示图表宽度的单元格数" required  rules={[{ required: true, message: '请输入图表宽度' }]}>
           <Input allowClear style={{ width:  _width }} />
        </Form.Item>
       
      </Col>
        <Col span={span}>
        <Form.Item label="图表高度:" name="bzmkheight" tooltip="取值范围1-36，表示图表高度的单元格数" required  rules={[{ required: true, message: '请输入图表高度' }]}>
                <Input allowClear style={{ width: _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="URL:" name="bzmkurl">
          <Input allowClear style={{ width: _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="刷新时间:" name="bzmkrefresh">
           <InputNumber  type="inline" step={1}  name="zsmkxh"  min={0}  max={2000}  defaultValue={0} style={{ width:  _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="取值方式"  name="bzmkqzfs" required  rules={[{ required: true, message: '请选择取值方式' }]}>
               <Select   placeholder="取值方式"   options={qzfsData} style={{width:  _width}}/>
            </Form.Item>
      </Col>
       <Col span={span}>
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
          <Input disabled  style={{ width: _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="外层SQL：" name="bzmksqlz" tooltip={sqlzsmValue}>
           <Input.TextArea  autoSize={{ minRows: 8, maxRows: 12 }}
              style={{width: _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="SQL：" name="bzmksql"  tooltip={sqlsmValue}>
           <Input.TextArea  autoSize={{ minRows: 8, maxRows: 12 }}
              style={{width: _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: _width }} />
      </Form.Item>
      </Col>

    </Row>
    </>
  )
}
  // 全局功能按钮
const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
      </>
    ])
}

  // 创建右侧表格Store实例
const [tableStore] = useState<EpsTableStore>(new EpsTableStore(bzmkService));

  // 自定义表格行按钮detail
const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
}

useEffect(() => {

}, []);

const source: EpsSource[] = [ {
      title: '模块编号',
      code: 'bzmkbh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '模块标题',
      code: 'bzmkmc',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '图表标题',
      code: 'bzmkqtmc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表尺寸大小',
      code: 'bzmksize',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let sizelist=sizeData;
        let aa = sizelist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '图表宽度',
      code: 'bzmkwidth',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表高度',
      code: 'bzmkheight',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '图表类型',
      code: 'bzmktype',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let typelist=btTypeData;
        let aa = typelist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '系列',
      code: 'bzmkmultiple',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let mtplist=mulitpleData;
        let aa = mtplist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '取值方式',
      code: 'bzmkqzfs',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '刷新时间',
      code: 'bzmkrefresh',
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
    name: '标准模块'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="模块编号" className="form-item" name="bzmkbh"><Input placeholder="请输入模块编号" /></Form.Item >
        <Form.Item label="模块标题" className="form-item" name="bzmkmc"><Input placeholder="请输入模块标题" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={bzmkService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={1100}
        tableRowClick={(record) => console.log('abcef', record)}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default Bzmk;
