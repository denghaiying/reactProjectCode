import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Input, Grid, Select, Table, Form } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import EditForm from '../../../components/EditForm';
import JcjgStore from '../../../stores/inspect/JcjgStore';
import TmDailog from './TmDailog';
import YwDailog from './YwDailog';

const { Row, Col } = Grid;
const formItemLayout = {
  labelCol: {
    fixedSpan: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { jcsqmxList, loading } = JcjgStore;
  const FormItem = Form.Item;
  const [field, setField] = useState(null);

  const columns = [{
    title: formatMessage({ id: 'e9.inspect.jcjg.jcbm' }),
    dataIndex: 'cfgcode',
    width: 100,
    lock: true,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.jcmc' }),
    dataIndex: 'cfgname',
    width: 200,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.jclx' }),
    dataIndex: 'cfgtype',
    width: 150,
    cell: (value) => {
      if (value === '101') {
        return '条目著录项';
      } else if (value === '201') {
        return '原文类型';
      } else if (value === '202') {
        return '原文DPI';
      } else if (value === '203') {
        return '原文内容';
      } else if (value === '204') {
        return '原文EXIF';
      } else if (value === '301') {
        return '条目原文匹配';
      } else if (value === '302') {
        return '原文条目匹配';
      } else if (value === '303') {
        return '条目原文内容匹配';
      }
    },
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.jcdx' }),
    dataIndex: 'jcsqmxZlx',
    width: 200,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.bhgsl' }),
    dataIndex: 'jcsqmxBhgsl',
    width: 130,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.sm' }),
    dataIndex: 'jcsqmxSm',
    width: 200,
  }];

  useEffect(() => {
    JcjgStore.setColumns(columns);
  }, []);


  /**
   * 最后一列操作列绘制详情按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      record.jcsqmxBhgsl > 0 ?
        <div align="center">
          <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDetailAction(record)}><FormattedMessage id="e9.inspect.jcjg.xq" /></a>
        </div>
        : ''
    );
  };


  // 查看数据
  const onDetailAction = (record) => {
    JcjgStore.findErrorResult(record);
  };

  return (
    <div>
      <EditForm
        title={formatMessage({ id: 'e9.inspect.jcjg.title' })}
        visible={JcjgStore.editVisible}
        footer={false}
        onClose={() => JcjgStore.closeEditForm()}
        opt={JcjgStore.opt}
        style={{ width: '1300px' }}
        closeable
      >
        <Form value={JcjgStore.editRecord} saveField={(f) => { setField(f); }}   >
          <Row >
            <Col span={8} >
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.sqdw' })}：`} {...formItemLayout}>
                <Input
                  name="jcsqSqdw"
                  disabled
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.sqdw' })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.sqrq' })}：`} {...formItemLayout}>
                <Input
                  name="jcsqSqrq"
                  disabled
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.sqrq' })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.jcfw' })}：`} {...formItemLayout}>
                <Select
                  name="jcsqJcfw"
                  disabled
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.sqdw' })}
                  dataSource={JcjgStore.jcsqJcfw}
                />
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col span={8}>
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.ppgz' })}：`} {...formItemLayout}>
                <Input
                  name="jcsqPpgz"
                  disabled
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.ppgz' })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.tms' })}：`} {...formItemLayout}>
                <Input
                  name="jcsqTms"
                  disabled
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.tms' })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.yws' })}：`} {...formItemLayout}>
                <Input
                  name="jcsqYws"
                  disabled
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.yws' })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col span={8}>
              <FormItem label={`${formatMessage({ id: 'e9.inspect.jcjg.sqsm' })}：`} {...formItemLayout}>
                <Input
                  style={{ width: '300%' }}
                  name="jcsqSqsm"
                  disabled
                  placeholder={formatMessage({ id: 'e9.inspect.jcjg.sqsm' })}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div style={{ width: '1100px', marginLeft: '8%' }}>
          <Table
            dataSource={jcsqmxList}
            loading={loading}
          >
            {columns.map(col =>
              <Table.Column alignHeader="center" align="left" key={col.dataIndex} {...col} />
            )}
            <Table.Column cell={renderTableCell} width="100px" lock="right" />
          </Table>
        </div>
      </EditForm >
      <TmDailog />
      <YwDailog />
    </div>

  );
});

export default injectIntl(EditDialog);
