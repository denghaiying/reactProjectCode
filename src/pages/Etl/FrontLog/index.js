 import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Form,DatePicker  } from '@alifd/next';
const { RangePicker} = DatePicker;
import { FormattedMessage, injectIntl } from 'react-intl';
import IceContainer from '@icedesign/container';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import SearchPanel from '../../../components/SearchPanel';
import EditDailog from './EditDailog';

import FrontIntStore from '../../../stores/etl/FronLogStore';


const FrontLog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize,editVisible } = FrontIntStore;
  const { Item: FormItem } = Form;

  const form = React.createRef();
  useEffect(() => {
    FrontIntStore.setColumns([ {
      title: formatMessage({ id: 'e9.etl.frontlog.code' }),
      dataIndex: 'code',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.etl.frontlog.field' }),
      dataIndex: 'field',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.etl.frontlog.tb' }),
      dataIndex: 'tb',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.etl.frontlog.search' }),
      dataIndex: 'search',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.etl.frontlog.page' }),
      dataIndex: 'page',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.etl.frontinf.size' }),
      dataIndex: 'size',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.etl.frontlog.querydate' }),
      dataIndex: 'whsj',
      width: 200,
    }
  
  ]);
    FrontIntStore.queryForPage({});
  }, []);


  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (() => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        FrontIntStore.queryData(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    FrontIntStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    FrontIntStore.setPageSize(pageSize);
  });

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    FrontIntStore.setSelectRows(selectedRowKeys, records);
  };

  
  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { taskDakid: 0, userEnable: 0, whrid: 'admin', whr:'管理员', whsj: moment() };
    FrontIntStore.showEditForm('add', json);
  });
  /**
   * 点击启用按钮事件响应
   */
  const onStartAction = (() => {
    FrontIntStore.start();
  });
  /**
   * 点击停止按钮事件响应
   */
  const onStopAction = (() => {
    FrontIntStore.stop();
  });
  /**
   * 点击新增按钮事件响应
   */
  const onRuleAction = (() => {
    if (!FrontIntStore.selectRowRecords || FrontIntStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (FrontIntStore.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
 
    FrontIntStore.rule();
  });
  /**
   * 点击新增按钮事件响应
   */
  const onResetAction = (() => {
    FrontIntStore.reset();
  });
  /**
   * 点击修改密码按钮事件响应
   */




  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (id) => {
    deleteData(id);
  };

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    edit(record);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    FrontIntStore.delete(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.whrid = "admin";
    json.whr = "管理员";
    json.whsj = moment();
    FrontIntStore.showEditForm('edit', json);
  });
  const height=document.body.clientHeight-200;
  const width=document.body.clientWidth-220;
  // end **************
  return (
    <IceContainer style={{ padding: '0', height: height, width: width, marginBottom: '0' }}>
      <ContainerTitle
        title={formatMessage({ id: 'e9.etl.frontlog.title' })}
      />
      <div style={{ padding: '20px' }}>
      <SearchPanel>
          <Form size="small" inline labelAlign="left" labelTextAlign="right" >
            <FormItem label={`${formatMessage({ id: 'e9.etl.frontlog.code' })}：`}>
              <Input name="code" maxLength={50} placeholder={formatMessage({ id: 'e9.etl.frontlog.code' })} hasClear />
            </FormItem>
            <FormItem label={`${formatMessage({ id: 'e9.etl.frontlog.search.datetime' })}：`}>
                <RangePicker name='datetime' size={"small"} />
            </FormItem>
            <FormItem label=" ">
              <Form.Submit type="primary" onClick={(value, errors) => doSearchAction(value, errors)}><Icon type="search" />{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
            </FormItem>
          </Form>
        </SearchPanel>
        
        <div style={{ marginBottom: '10px' }}>
          <Button.Group size="small">
            <Button type="secondary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>
            <Button type="secondary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>
          </Button.Group>
      
  
        </div>
        <Table
          size="small"
          dataSource={data.list}
          fixedHeader
          loading={loading}
          rowSelection={{ onChange: onTableRowChange }}
        >
          {columns.map(col =>
            <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
          )}
       
        </Table>
        <Pagination
          current={pageno}
          pageSize={pagesize}
          total={data.total}
          onChange={onPaginationChange}
          style={{ marginTop: '10px' }}
          shape="arrow-prev-only"
          pageSizeSelector="dropdown"
          pageSizePosition="end"
          onPageSizeChange={onPageSizeChange}
        />
      </div>
      <EditDailog />
    </IceContainer >
  );
});

export default injectIntl(FrontLog);         
