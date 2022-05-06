import React, { useEffect, useState } from 'react';
import { Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LoginStore from '../../../stores/system/LoginStore';
import AjfltjStore from '../../../stores/datj/AjfltjStore';
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
  TreeSelect,
  message ,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

/**
 * @Author: dfw
 * @Date: 2022/1/3
 * @Version: 9.0
 */
const Crktj = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, loading } = AjfltjStore;
  const { userinfo } = LoginStore;
  const [field] = Form.useForm();
  const [flds, setFlds] = useState([]);

  const umid = 'DATJ043';
  useEffect(() => {
    AjfltjStore.dakData = [];
    AjfltjStore.findDak();
    AjfltjStore.findAllDak();
  }, []);
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = () => {
    AjfltjStore.fieldData = [];
    field.validateFields().then((values) => {
      AjfltjStore.columnData = values.fields;
      if (AjfltjStore.lxData[0].lx == '02') {
        AjfltjStore.daklxData = true;
        values['lx'] = AjfltjStore.lxData[0].lx;
      } else {
        AjfltjStore.daklxData = false;
      }
      values.fields.forEach((f) => {
        AjfltjStore.fieldData.push(f.value);
      });
      AjfltjStore.mbzlxMC.forEach((f) => {
        if (f == 'YS') {
          values['ys'] = f;
        }
      });
      values['fields'] = AjfltjStore.fieldData;
      values['bmc'] = AjfltjStore.lxData[0].mbc;
      values['hj'] = AjfltjStore.fieldData[AjfltjStore.fieldData.length - 1];

      const { fields, ...p } = values;
      if (fields && fields.length > 0) {
        setFlds(fields);
        p.fields = fields.join(',');
      } else {
        setFlds([]);
      }
      AjfltjStore.findAjfltj(p);
    });
  };
  const findMbzlx = (value) => {
    AjfltjStore.mbzlxMC = [];
    field.setFieldsValue({ fields: [] });
    AjfltjStore.lxData = AjfltjStore.dakData.filter((o) => o.id == value);
    if (AjfltjStore.lxData.length === 0) {
      AjfltjStore.mbzlxData = [];
      return message.warn('请选择档案库名称');
    }
    if (
      AjfltjStore.lxData[0].lx === '02' ||
      AjfltjStore.lxData[0].lx === '01'
    ) {
      AjfltjStore.findMbzlx(value);
    } else {
      return message.warn('请选择档案库名称');
    }
  };
  const selectOnchange = (value) => {
    if (value.length > 3) {
      value.shift();
    }
  };
  return (
    <div className="hall-regist-crktj">
      <div className="control">
        <Form form={field} layout="inline" colon={false}>
          <Form.Item label="档案库">
            <TreeSelect
            treeNodeFilterProp='title'
            showSearch
              placeholder={'请选择档案库'}
              hasClear
              style={{width:250}}
              className="input"
              onChange={findMbzlx}
              tagInline
              treeData={AjfltjStore.zsdakData}
            />
          </Form.Item>

          <Form.Item
            label="统计显示"
            name="fields"
            validateFirst
            rules={[{ required: true, message: '最少选择一个' }]}
          >
            <Select
              placeholder="统计显示"
              allowClear
              mode="multiple"
              style={{ width: 260, marginRight: 20 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              labelInValue
              onChange={selectOnchange}
            >
              {(AjfltjStore.mbzlxData || []).map((o) => (
                <Select.Option value={o.MBZLX_MC} key={o.MBZLX_ID}>
                  {o.MBZLX_MS}
                </Select.Option>
              ))}
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
            dataSource={data}
            loading={loading}
            pagination={false}
            scroll={{ x: '100%', y: 'calc(100vh - 180px)' }}
            rowClassName={(rec) =>
              (rec[AjfltjStore.fieldData[AjfltjStore.fieldData.length - 1]] ===
                '合计' &&
                'hjrow') ||
              ''
            }
          >
            {flds &&
              AjfltjStore.columnData.map((col) => (
                <Table.Column
                  alignHeader="center"
                  dataIndex={`${col.value}`}
                  title={`${col.label}`}
                  width={90}
                  ellipsis={true}
                />
              ))}
            {AjfltjStore.daklxData && (
              <Table.Column
                alignHeader="center"
                width={90}
                title="案卷数"
                dataIndex="ajs"
              />
            )}
            <Table.Column
              alignHeader="center"
              width={90}
              title="条目数"
              dataIndex="tms"
            />
            <Table.Column
              alignHeader="center"
              width={90}
              title="原文数"
              dataIndex="yws"
            />
            <Table.Column
              alignHeader="center"
              width={90}
              title="文件大小"
              dataIndex="wjdx"
              ellipsis={true}
            />
            <Table.Column
              alignHeader="center"
              width={90}
              title="载体数量（页数）"
              dataIndex="ztsl"
            />
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Crktj;
