import React, { useEffect, useState } from 'react';
import { Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LoginStore from '../../../stores/system/LoginStore';
import HttjStore from '../../../stores/datj/HttjStore';
import './index.less'
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';
import { InputNumber, Input, Form, Select, Table, Button, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';

/**
 * 申万宏源总部合同台账
 */
const Htyjwjtz = observer(props => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { htyjwjtzdata, htyjwjtzloading, htyjwjtzcolumns } = HttjStore;
  const { userinfo } = LoginStore;
  const [field] = Form.useForm();
  const [searchparams, setSearchparams] = useState([]);
  const umid = 'DATJ053';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    const curdate = moment();
    HttjStore.findHtyjwjtz();
    HttjStore.setHtyjwjtzColumns([
      {
        title: '序号',
        align: 'center',
        fixed: 'left',
        width: 40,
        render: (_, __, index) => index + 1,
      },
      {
        title: '经办人',
        dataIndex: 'jbrxm',
        width: 80,
      },
      {
        title: '合同用印日期',
        dataIndex: 'htyyrq',
        width: 100,
      },
      {
        title: '合同用印编号',
        dataIndex: 'htyybh',
        width: 140,
      },
      {
        title: '合同编号',
        dataIndex: 'htbh',
        ellipsis: true,
        width: 140,
      },
      {
        title: '合同名称',
        dataIndex: 'htmc',
        ellipsis: true,
        width: 140,
      },
      {
        title: '合同签署日期',
        dataIndex: 'htqsrq',
        width: 100,
      },
      {
        title: '签署状态',
        dataIndex: 'qszt',
        width: 70,
      },
      {
        title: '是否逾期未移交',
        dataIndex: 'yqwyj',
        width: 100,
      },
      {
        title: '逾期未移交天数',
        dataIndex: 'yqwyjts',
        width: 100,
      },
      {
        title: '是否逾期移交',
        dataIndex: 'yqyj',
        width: 90,
      },
      {
        title: '逾期移交天数',
        dataIndex: 'yqyjts',
        width: 90,
      },
      {
        title: '合同有效性',
        dataIndex: 'htyxx',
        width: 90,
      },
      {
        title: '是否长期未签署',
        dataIndex: 'cqwqs',
        width: 100,
      }
    ]);
  }, []);
  /**
     * 查询条件按钮点击事件
     * @param {*} values
     * @param {*} errors
     */
  const doSearchAction = (() => {
    field.validateFields().then((values) => {
      const { fields, qcrq, dqrq, ...p } = values;
      if (qcrq) {
        p.qcstatedate = qcrq[0].format('YYYYMMDD');
        p.qcenddate = qcrq[1].format('YYYYMMDD');
      }
      if (dqrq) {
        p.dqstatedate = dqrq[0].format('YYYYMMDD');
        p.dqenddate = dqrq[1].format('YYYYMMDD');
      }
      debugger
      HttjStore.findHtyjwjtz(p);
      setSearchparams(p)
    });
  });

  const downloadExcel = () => {
    HttjStore.downloadExcel(htyjwjtzdata,searchparams,"02");
  };
  return (
    <div className="hall-regist-zbhttz">
      <div className="control">
        <Form
          form={field}
          layout="inline"
          colon={false}
        >
          <Form.Item label="部门代码" name="bmdm">
            <Input className="input" allowClear placeholder="请输入部门代码" />
          </Form.Item>
          <Form.Item label="经办人" name="jbrxm">
            <Input className="input" allowClear placeholder="请输入经办人" />
          </Form.Item>
          <Form.Item label="起草日期" name="qcrq">
            <DatePicker.RangePicker
              name="time"
              hasClear
              format="YYYYMMDD"
            />
          </Form.Item>
          <Form.Item label="到期日期" name="dqrq">
            <DatePicker.RangePicker
              name="time"
              hasClear
              format="YYYYMMDD"
            />
          </Form.Item>
          <Button type="primary" style={{ paddingLeft: 10 }} onClick={doSearchAction} ><SearchOutlined />查询</Button>
        </Form>

      </div>
      <div className="main-content">
        <div className="btns-control">
          <Button type="primary" onClick={downloadExcel} icon={<DownloadOutlined />}>
            导出EXCEL
          </Button>
        </div>
        <div className="table-container">
          <Table
            maxBodyHeight="calc(100vh - 259px)"
            dataSource={htyjwjtzdata}
            pagination={false}
            bordered
            fixedHeader
            loading={htyjwjtzloading}
            className="record-table"
            emptyContent={<EmptyData />}
          >
            {htyjwjtzcolumns.map((col) => (
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            ))}
          </Table>
        </div>
      </div>
    </div >
  );
});

export default Htyjwjtz;
