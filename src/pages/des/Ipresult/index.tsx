import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  Select,
  Button,
  Progress,
  Tooltip,
  Input,
  Form,
  Row,
  Col,
  message,
} from 'antd';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import IpresultService from './Service/IpresultService';
import {
  SmileOutlined,
  FundViewOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import IpapplyStore from '../../../stores/des/IpapplyStore';
import JcsqmxDetail from './JcsqmxDetail';
import './index.scss';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const dataSource = [
  { value: 'C', label: '待检测' },
  { value: 'W', label: '检测中' },
  { value: 'Z', label: '检测完成' },
  { value: 'E', label: '检测出错' },
];
const Ipresult = observer(() => {
  const ref = useRef();
  const [form] = Form.useForm();
  const [mxvisable, SetMxVisable] = useState(false);
  const [editrecord, Seteditrecord] = useState({});
  const [queryParams, SetqueryParams] = useState({});

  useEffect(() => {
    timeWork();
    // const id = setInterval(onQueryDataClick, 2000);
    IpapplyStore.queryExprData();
    // return ()=>{
    //     clearInterval(id);
    // }
  }, []);
  const timeWork = () => {
    const tableStore = ref.current?.getTableStore();
    tableStore.findByKey(tableStore.key, 1, tableStore.size, { spzts: "'Z'" });
  };

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableDelete: false,
    disableEdit: true,
    disableAdd: true,
    rowSelection: {
      type: 'CheckBox',
    },
    onDeleteClick : (data) => {
      if("W"==data.spzt){ 
        return Promise.reject('该申请正在检测中不可以删除');
      }else{
        return Promise.resolve();
      }

     
    },
  };

  // 表单名称
  const title: ITitle = {
    name: '检测结构',
  };
  const source: EpsSource[] = [
    {
      title: '检测进度',
      code: 'progressbar',
      align: 'center',
      formType: EpsFormType.Input,
      width: 250,
      fixed: 'left',
      render: (value) => {
        return (
          <Progress
            percent={Number(value)}
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        );
      },
    },
    {
      title: '申请单位',
      code: 'sqdw',
      align: 'center',
      formType: EpsFormType.Input,
      width: 220,
    },
    {
      title: '申请人',
      code: 'sqr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '审批状态',
      code: 'spzt',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (value) => {
        switch (value) {
          case 'C':
            return '待检测';
          case 'W':
            return '检测中';
          case 'Z':
            return '检测完成';
          case 'E':
            return '检测出错';
          default:
            break;
        }
      },
    },
    {
      title: '申请日期',
      code: 'sqrq',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '检测单位',
      code: 'jcdw',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '检测人',
      code: 'jcr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '检测日期',
      code: 'jcrq',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '检测范围',
      code: 'jcfw',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (value) => {
        switch (value) {
          case 'A':
            return '条目和原文';
          case 'B':
            return '仅条目';
          case 'C':
            return '仅原文';
          default:
            break;
        }
      },
    },
    {
      title: '申请说明',
      code: 'sqsm',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '匹配规则',
      code: 'ppgz',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '文件数',
      code: 'yws',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '条目数',
      code: 'tms',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '原文目录',
      code: 'ywdir',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '检测耗时',
      code: 'jcsqtime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
  ];
  const onQueryDataClick = () => {
    const tableStore = ref.current?.getTableStore();
    form.validateFields().then((values) => {
        const sqdw = values.sqdw;
        const spzts =  values.spzt;
        //不可轻易更改values值,会影响表单的值,声明变量重新接收
        const spztstr = new Array(spzts.length);
         if(spzts.length>0){
          for(let a =0;a<spzts.length;a++){
            spztstr[a] ="'" +spzts[a]+"'"
          }
         }
        tableStore.findByKey(tableStore.key, 1, tableStore.size, {
          spzts:spztstr.length>0?spztstr.toString():undefined,
          sqdw: sqdw,
        });   
    });
  };
  const onOutPdfClick = () => {
    const checkedRows = ref.current?.getCheckedRows();
    if (checkedRows.length > 0) {
      IpresultService.OutToPdfOne(checkedRows);
      ref.current?.clearTableRowClick();
    } else {
      message.warning('请先选择一行！');
    }
  };
  //自定义布局组件（上班、下班按钮）
  const customAction = (store: EpsTableStore) => {
    return [
      <>
        <Form
          name="advanced_search"
          form={form}
          {...formItemLayout}
          className="ant-advanced-search-form"
        >
          <Row>
            <Col>
              <Form.Item
                name="sqdw"
                label="申请单位："
                className="ant-form-item"
              >
                <Input allowClear style={{ width: 150 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="spzt"
                label="状态："
                initialValue={['Z']}
                className="ant-form-item"
              >
                <Select
                  mode="multiple"
                  options={dataSource}
                  style={{ width: 360 }}
                  allowClear
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="primary"
                style={{ fontSize: '12px', marginLeft: 110 }}
                icon={<SmileOutlined />}
                onClick={onQueryDataClick}
              >
                查询
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                style={{ fontSize: '12px', marginLeft: 8 }}
                icon={<SmileOutlined />}
                onClick={onOutPdfClick}
              >
                导出pdf
              </Button>
            </Col>
          </Row>
        </Form>
      </>,
    ];
  };
  const onViewClick = (record, index, store) => {
    switch(record.spzt){
      case 'C':
            return message.error("该申请未检测不可以浏览");
          case 'W':
            return message.error("该申请正在检测中不可以浏览");
          case 'E':
            return message.error("该申请检测出错不可以浏览");
          default:
            break;
    }  
    Seteditrecord(record);
    SetMxVisable(true);
  };
  const onPdfViewClick = (record) => {
    switch(record.spzt){
      case 'C':
            return message.error("该申请未检测不可以预览PDF");
          case 'W':
            return message.error("该申请正在检测中不可以预览PDF");
          case 'E':
            return message.error("该申请检测出错不可以预览PDF");
          default:
            break;
    } 
    window.open(
      '/api/eps/des/jcsq/outpdf/' + record.id + '?sqdw=' + record.sqdw,
    );
  };
  const customTableAction = (
    text: any,
    record: any,
    index: any,
    store: any,
  ) => {
    return [
      <Tooltip title="浏览">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<FundViewOutlined />}
          onClick={() => onViewClick(record, index, store)}
        />
      </Tooltip>,
      <Tooltip title="预览pdf">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<FilePdfOutlined />}
          onClick={() => onPdfViewClick(record)}
        />
      </Tooltip>,
    ];
  };

  return (
    <div>
      <div style={{ height: 600 }}>
        <EpsPanel
          initParams={{}}
          title={title} // 组件标题，必填
          source={source} // 组件元数据，必填
          tableProp={tableProp} // 右侧表格设置属性，选填
          tableService={IpresultService} // 右侧表格实现类，必填
          formWidth={500}
          ref={ref}
          customAction={customAction} // 自定义全局按钮（如新增、导入、查询条件、全局打印 等），选填
          customTableAction={customTableAction}
          tableAutoLoad={false}
        />
      </div>
      {mxvisable && (
        <JcsqmxDetail
          mxvisable={mxvisable}
          SetMxVisable={SetMxVisable}
          editrecord={editrecord}
        />
      )}
    </div>
  );
});
export default Ipresult;
