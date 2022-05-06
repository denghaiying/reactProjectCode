import React, { useEffect, useState } from 'react';
import { Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LoginStore from '../../../stores/system/LoginStore';
import CrktjStore from '../../../stores/datj/CrktjStore';
import './index.less';
import { useIntl, FormattedMessage } from 'umi';
import {
  InputNumber,
  Input,
  Form,
  Select,
  Table,
  Button,
  DatePicker,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

/**
 * @Author: dfw
 * @Date: 2021/12/24
 * @Version: 9.0
 */
const Crktj = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, loading } = CrktjStore;
  const { userinfo } = LoginStore;
  const [field] = Form.useForm();
  const [flds, setFlds] = useState([]);

  const umid = 'DATJ051';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    const curdate = moment();
    doSearchAction();
  }, []);
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = () => {
    field.validateFields().then((values) => {
      const { fields, jsnd, ...p } = values;
      if (jsnd) {
        p.startTime = jsnd[0].year();
        p.endTime = jsnd[1].year();
      }

      //startTime endTime
      if (fields && fields.length > 0) {
        setFlds(fields);
        p.fields = fields.join(',');
      } else {
        setFlds([]);
      }
      CrktjStore.findCrktj(p);
    });
  };
  return (
    <div className="hall-regist-crktj">
      <div className="control">
        <Form form={field} layout="inline" colon={false}>
          <Form.Item label="年度" name="jsnd">
            <DatePicker.RangePicker picker="year" />
          </Form.Item>
          <Form.Item label="统计显示" name="fields">
            <Select
              placeholder="统计显示"
              hasClear
              mode="multiple"
              style={{ width: 260, marginRight: 20 }}
            >
              <Select.Option value="JYDMX_BGQX">保管期限</Select.Option>
              <Select.Option value="HOLDINGGROUP_NAME">
                档案类型
              </Select.Option>
            </Select>
          </Form.Item>
          <Button
            type="primary"
            style={{ paddingLeft: 10 }}
            onClick={doSearchAction}
          >
            <SearchOutlined />
            查询
          </Button>
        </Form>
      </div>
      <div className="main-content">
        <div className="table-container">
          <Table
            tableLayout="fixed"
            isZebra={true}
            bordered={true}
            size="small"
            // $work-context-heigth-41px, 41px为表头高度
            dataSource={data}
            fixedHeader
            loading={loading}
            pagination={false}
            scroll={{ y: 'calc(100vh - 259px)' }}
            rowClassName={(rec) => rec.px2 === 2 && (rec.px1 === 1 && 'xjrow' || 'hjrow') || ''}
          >
            <Table.Column
              alignHeader="center"
              width={120}
              title="类型"
              dataIndex="lx"
              render={(text, rec) => {
                let v = text;
                if (text == '1') {
                  v = '档案借阅';
                } else if (text == '2') {
                  v = '档案协查';
                } else if (text == '3') {
                  v = '实体出库单';
                } else if (text == '4') {
                  v = '查档审批';
                } else if (text == '5') {
                  v = '查档调卷';
                }
                if (rec.px2 === 2 && rec.px1 === 1) {
                  v = `${v} 小计`;
                }
                return v;
              }}
            />
            {flds && flds.includes('ND') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="年度"
                dataIndex="ND"
              />
            )}
            {flds && flds.includes('JYDMX_BGQX') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="保管期限"
                dataIndex="jydmx_bgqx"
              />
            )}
            {flds && flds.includes('HOLDINGGROUP_NAME') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="档案类型"
                dataIndex="holdinggroup_name"
              />
            )}
            <Table.ColumnGroup title="出入状态" alignHeader="center">
              <Table.Column
                alignHeader="center"
                width={110}
                title="待出库"
                dataIndex="dck"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="待领取"
                dataIndex="dlq"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="待归还"
                dataIndex="dgh"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="待入库"
                dataIndex="drk"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="已入库"
                dataIndex="yrk"
              />
            </Table.ColumnGroup>
            <Table.Column
              alignHeader="center"
              width={120}
              title="总数"
              dataIndex="zs"
            />
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Crktj;
