import React, { useEffect, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import OrgLxService from './YhpxxxService';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Col, Form, Input, Row, DatePicker, Select } from 'antd';
import EpsReportButton from '@/eps/components/buttons/EpsReportButton/index';
import { observer } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: true,
};

const Yhpxxx = observer((props) => {
  const [umid, setUmid] = useState('');

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(OrgLxService));
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {
          [
            //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
          ]
        }
      </>
    );
  };

  useEffect(() => {
    // SearchStore.queryDw();
    setUmid('CONTROL0018');
  }, []);

  const customAction = (store: EpsTableStore) => {
    return [
      <>
        {/* <EpsReportButton store={store} umid={umid} /> */}
        <EpsReportButton store={store} umid={umid} />
      </>,
    ];
  };

  const span = 24;
  const _width = 240;

  // 自定义表单

  const customForm = () => {
    // 自定义表单校验

    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="公司内外培训" name="gsnwpx">
              <Select style={{ width: _width }} className="ant-select">
                <option value="内">内</option>
                <option value="外">外</option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="培训日期" name="pxrq">
              <DatePicker placeholder="培训日期" style={{ width: _width }} />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="培训机构" name="pxjg">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="是否获得证书" name="sfhdzs">
              <Select style={{ width: _width }} className="ant-select">
                <option value="是">是</option>
                <option value="否">否</option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="证书名称" name="zsmc">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const source: EpsSource[] = [
    {
      title: '参加公司内还是外的培训',
      code: 'gsnwpx',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '培训日期',
      code: 'pxrq',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '培训机构',
      code: 'pxjg',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '是否获得证书',
      code: 'sfhdzs',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '证书名称',
      code: 'zzmc',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];
  const title = {
    name: '档案管理工作培训',
  };

  return (
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={500}
      tableService={OrgLxService}
      customForm={customForm}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    ></EpsPanel>
  );
});

export default Yhpxxx;
