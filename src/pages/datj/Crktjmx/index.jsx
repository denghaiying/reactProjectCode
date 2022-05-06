import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import {
  Form,
  Input,
  Card,
  Table,
  DatePicker,
  Select,
  Col,
  Row,
  Button,
} from 'antd';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import CrktjmxStore from '@/stores/datj/CrktjmxStore';
import './index.less';
import EpsReportButton from '@/eps/components/buttons/EpsReportButton';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsTableStore from '@/eps/components/panel/EpsRecordPanel/EpsTableStore';
import CrkdjmxcxService from '@/services/datj/CrkdjmxcxService';

const Crktjmx = observer((props) => {
  const [searchForm] = Form.useForm();
  const tableService = new CrkdjmxcxService('/api/eps/datj/crktj/crktjmx');
  const ref = useRef();
  const tableColumns = [
    {
      title: '全宗号',
      code: 'qzh',
      align: 'center',
      width: 200,
      ellipsis: true,
      formType: EpsFormType.Input,
    },
    {
      title: '全宗名称',
      code: 'qzmc',
      align: 'center',
      width: 200,
      ellipsis: true,
      formType: EpsFormType.Input,
    },
    {
      title: '题名',
      code: 'tm',
      align: 'center',
      width: 200,
      ellipsis: true,
      formType: EpsFormType.Input,
    },
    {
      title: '档号',
      code: 'dh',
      align: 'center',
      width: 200,
      ellipsis: true,
      formType: EpsFormType.Input,
    },
    {
      title: '密级',
      code: 'mj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '保管期限',
      code: 'bgqx',
      align: 'center',
      width: 100,
      ellipsis: true,
      formType: EpsFormType.Input,
    },
    {
      title: '借阅人',
      code: 'jyr',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '借阅天数',
      code: 'jyts',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '申请人',
      code: 'sqr',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '申请时间',
      code: 'sqrq',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '出库人',
      code: 'ckr',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '出库时间',
      code: 'cksj',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '入库人',
      code: 'rkr',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '入库时间',
      code: 'rksj',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '领取时间',
      code: 'lqsj',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '归还时间',
      code: 'ghsj',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '备注',
      code: 'bz',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input,
    },
  ];

  const tableProp = {
    tableSearch: false,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
  };

  const onSearchClick = () => {
    searchForm.validateFields().then(() => {
      const param = searchForm.getFieldsValue();
      param['btime'] = param.crksj
        ? param.crksj[0].format('yyyy-MM-DD') + ' 00:00:00'
        : param.crksj;
      param['etime'] = param.crksj
        ? param.crksj[1].format('yyyy-MM-DD') + ' 23:59:59'
        : param.crksj;
      delete param.crksj;
      const tableStore = ref.current?.getTableStore();
      tableStore.findByKey(tableStore.key, 1, tableStore.size, param);
    });
  };
  const customAction = (store, record, rows) => {
    return (
      <div>
        <Form id="home-search-form" layout="inline" form={searchForm}>
          <Form.Item
            label="出入库日期:"
            name="crksj"
            initialValue={[
              moment(
                new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              ),
              moment(
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0,
                ),
              ),
            ]}
          >
            <DatePicker.RangePicker style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="全宗号:" name="qzh">
            <Select
              allowClear
              placeholder="请选择全宗号"
              style={{ width: 250 }}
              showArrow
              showSearch
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }}
            >
              {CrktjmxStore.qzhData.map((q) => (
                <Select.Option key={q.qzh} value={q.qzh}>
                  {q.qzh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="全宗名称:" name="qzmc">
            <Input allowClear style={{ width: 250 }} />
          </Form.Item>
          <Button type="primary" onClick={onSearchClick}>
            查询
          </Button>
          &nbsp;&nbsp;
          <EpsReportButton
            store={store}
            umid={'DATJ044'}
            reportDataSetNames={['GRID_MASTER', 'GRID_SLAVE']}
            baseQueryMethod={'/api/eps/datj/crktj/crktjmx'}
            datilQueryMethod={'/api/eps/datj/crktj/crktjmx'}
            fields={tableColumns}
            records={CrktjmxStore.tableData}
            datilfields={tableColumns}
          />
        </Form>
      </div>
    );
  };
  useEffect(() => {
    CrktjmxStore.findQzh();
  }, []);
  return (
    <EpsPanel
      title={'出入库登记明细查询'} // 组件标题，必填
      source={tableColumns} // 组件元数据，必填
      tableProp={tableProp} // 右侧表格设置属性，选填
      tableService={tableService} // 右侧表格实现类，必填
      formWidth={500}
      customAction={customAction} //自定义页面头部搜索区域
      tableAutoLoad={false} //表格自动加载
      ref={ref}
    />
  );
});

export default Crktjmx;
