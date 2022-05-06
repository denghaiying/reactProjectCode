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
const Zbhttz = observer(props => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { zbhttzdata, zbhttzloading, zbhttzcolumns } = HttjStore;
  const { userinfo } = LoginStore;
  const [field] = Form.useForm();
  const [searchparams, setSearchparams] = useState([]);
  const umid = 'DATJ052';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    const curdate = moment();
    HttjStore.findZbhttz();
    HttjStore.setZbhttzColumns([
      {
        title: '序号',
        align: 'center',
        fixed: 'left',
        width: 50,
        render: (_, __, index) => index + 1,
      },
      {
        title: '部门代码',
        dataIndex: 'bmdm',
        width: 100,
      },
      {
        title: '部门名称',
        dataIndex: 'bmmc',
        width: 200,
      },
      {
        title: '应移交数',
        dataIndex: 'ygyjs',
        width: 100,
      },
      {
        title: '已移交数',
        dataIndex: 'yjyjs',
        width: 100,
      },
      {
        title: '逾期移交数',
        dataIndex: 'yqyyjs',
        width: 100,
      },
      {
        title: '未移交数',
        dataIndex: 'wyyjs',
        width: 100,
      },
      {
        title: '逾期未移交数',
        dataIndex: 'yqwyyjs',
        width: 100,
      },
      {
        title: '长期未完成签署数',
        dataIndex: 'cqwwcqss',
        width: 100,
      },
      {
        title: '生效数',
        dataIndex: 'sxs',
        width: 100,
      },
      {
        title: '作废数',
        dataIndex: 'zfs',
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
      debugger
      if (qcrq) {
        p.qcstatedate = qcrq[0].format('YYYYMMDD');
        p.qcenddate = qcrq[1].format('YYYYMMDD');
      }
      if (dqrq) {
        p.dqstatedate = dqrq[0].format('YYYYMMDD');
        p.dqenddate = dqrq[1].format('YYYYMMDD');
      }
      HttjStore.findZbhttz(p);
      setSearchparams(p)
    });
  });
  const downloadExcel = () => {
    HttjStore.downloadExcel(zbhttzdata,searchparams,"01");
  };
  return (
    <div className="hall-regist-zbhttz">
      <div className="control">
        <Form
          form={field}
          layout="inline"
          colon={false}
        >
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
            dataSource={zbhttzdata}
            pagination={false}
            bordered
            fixedHeader
            loading={zbhttzloading}
            className="record-table"
            emptyContent={<EmptyData />}
          >
            {zbhttzcolumns.map((col) => (
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            ))}
          </Table>
        </div>
      </div>
    </div >
  );
});

export default Zbhttz;
