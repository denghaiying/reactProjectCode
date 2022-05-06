import React, { useEffect, useState } from 'react';
import { Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LoginStore from '../../../stores/system/LoginStore';
import LxjstjStore from '../../../stores/datj/LxjstjStore';
import './index.less';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';
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
 * @Author: Mr.Wang
 * @Date: 2021/06/29 13:45
 * @Version: 9.0
 * @Content:
 *    2021/06/29 王晨阳
 *      新增代码
 */
const Lxjstj = observer((props) => {
  // const { intl: { formatMessage } } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, loading } = LxjstjStore;
  const { userinfo } = LoginStore;
  const [field] = Form.useForm();
  const [flds, setFlds] = useState([]);
  const umid = 'DATJ042';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    LxjstjStore.getSjzdData('移交单位');
    LxjstjStore.getQzhData();
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
        p.startTime = jsnd[0].format('YYYY-MM');
        p.endTime = jsnd[1].format('YYYY-MM');
      }
      //startTime endTime
      if (fields && fields.length > 0) {
        setFlds(fields);
        p.fields = fields.join(',');
      } else {
        setFlds([]);
      }
      LxjstjStore.findLxjstj(p);
    });
  };
  // const downloadExcel = (() => {

  //   LxjstjStore.downloadExcel(LxjstjStore.data);
  // });
  return (
    <div className="hall-regist-lxjstj">
      <div className="control">
        <Form form={field} layout="inline" colon={false}>
          <Form.Item label="全宗号" name="qzh">
            <Select
              className="input"
              showSearch
              placeholder="请输入全宗号"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear
            >
              {(LxjstjStore.qzhlist || []).map((o) => (
                <Select.Option value={o.qzh} key={o.qzh}>
                  {o.qzh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="全宗名称" name="qzmc">
            <Input className="input" allowClear placeholder="请输入全宗名称" />
          </Form.Item>
          <Form.Item label="接收年度" name="jsnd">
            <DatePicker.RangePicker picker="month" />
          </Form.Item>
          <Form.Item label="统计显示" name="fields">
            <Select
              placeholder="统计显示"
              allowClear
              mode="multiple"
              style={{ width: 260, marginRight: 20 }}
            >
              <Select.Option value="ND">年度</Select.Option>
              <Select.Option value="BGQX">保管期限</Select.Option>
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
        {/* <div className="btns-control">
          <Button type="primary" onClick={downloadExcel}>  <Icon type="download" />导出EXCEL</Button>
        </div> */}
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
            rowClassName={(rec) =>
              (rec.px2 === 2 && ((rec.px1 === 1 && 'xjrow') || 'hjrow')) || ''
            }
          >
            <Table.Column
              alignHeader="center"
              width={120}
              title="移交单位"
              dataIndex="qzh"
              render={(text) => {
                const list = LxjstjStore.sjzdData['移交单位'];
                if (list && list.length > 0) {
                  for (let i = 0; i < list.length; i++) {
                    if (list[i].bh === text) {
                      return list[i].mc;
                    }
                  }
                }
                return text;
              }}
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="档案类别"
              dataIndex="name"
            />
            {flds && flds.includes('ND') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="年度"
                dataIndex="nd"
              />
            )}
            {flds && flds.includes('BGQX') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="保管期限"
                dataIndex="bgqx"
              />
            )}
            <Table.ColumnGroup title="条目数" alignHeader="center">
              <Table.Column
                alignHeader="center"
                width={110}
                title="一文一件(件)"
                dataIndex="ywyjtms"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="案卷(卷)"
                dataIndex="ajtms"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="卷内(条)"
                dataIndex="jntms"
              />
            </Table.ColumnGroup>
            <Table.Column
              alignHeader="center"
              width={120}
              title="接收时间"
              dataIndex="gdrq"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="原文数量"
              dataIndex="ywsl"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="原文大小（M）"
              dataIndex="ywdx"
            />
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Lxjstj;
