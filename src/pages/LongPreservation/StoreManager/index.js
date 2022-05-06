import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button,Form } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceContainer from '@icedesign/container';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import ContainerTitle from '../../../../src/components/ContainerTitle';
import SearchPanel from '../../../components/SearchPanel';
import EditDailog from './EditDailog';
import Store from "../../../stores/longpreservation/StoreManagerStore";

const { Item: FormItem } = Form;

const StoreManger = props => {
  const store = Stores.useStore('storeManager_store');
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = store;


  const form = React.createRef();

  useEffect(() => {
    store.queryData({});
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
        store.queryData(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    store.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    store.setPageSize(pageSize);
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
    store.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { whrid: "admin", whr: "admin", whsj: moment() };
    store.showEditForm('add', json);
  });

  /**
   * 点击角色设置按钮事件响应
   */
  const onSetUserAction = () => {
    if (!store.selectRowRecords || store.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (store.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    store.showUsDailog(true);
  };

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
    store.delete(id);
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
  //  json.whrid = userinfo.id;
  //  json.whr = userinfo.userName;
    json.whsj = moment();
    store.showEditForm('edit', json);
  });

  // end **************
  return (
    <div className="workpage" >
    <ContainerTitle
      title={formatMessage({ id: 'e9.longpriservation.storemanager.title' })}
    />
    <div className="workcontain"  style={{height:300}}>
        <div className="toolbar">
          <SearchPanel>
            <Form size="small" inline labelAlign="left" labelTextAlign="right" >
              <FormItem label={`${formatMessage({ id: 'e9.longpriservation.storemanager.name' })}：`}>
                <Input name="name" maxLength={50} placeholder={formatMessage({ id: 'e9.longpriservation.storemanager.name' })} hasClear />
              </FormItem>
              <FormItem label=" ">
                <Form.Submit type="primary" onClick={(value, errors) => doSearchAction(value, errors)}><Icon type="search" />{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
              </FormItem>
            </Form>
          </SearchPanel>
          <Button.Group size="small">
            <Button type="secondary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>
            <Button type="secondary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>
          </Button.Group>
          <Button.Group size="small" style={{ marginLeft: '10px' }} >
            <Button type="secondary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
          </Button.Group>

        </div>
        <div className="workspace">
        <Table
          dataSource={data.list}
          fixedHeader
          loading={loading}
          rowSelection={{ onChange: onTableRowChange }}
        >
          {columns.map(col =>
            <Table.Column alignHeader="center" key={col.dataIndex} {...col} title={formatMessage({ id: `${col.title}` })} />
          )}
          <Table.Column cell={renderTableCell} width="100px" lock="right" />
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
      </div>
      <EditDailog />

    </div>
  );
};

export default injectIntl(StoreManger);
