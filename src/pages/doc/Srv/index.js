import React, { useEffect } from 'react';
import { Table, Icon, Pagination, Button, Switch } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import LoginStore from '../../../stores/system/LoginStore';
import SrvStore from '../../../stores/doc/SrvStore';
import E9Config from '../../../utils/e9config';

const Srv = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = SrvStore;
  const { userinfo } = LoginStore;
  const umid = 'docmrg001';

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    SrvStore.setColumns([{
      title: formatMessage({ id: 'e9.doc.srv.srvUrl' }),
      dataIndex: 'srvUrl',
      width: 300,
    }, {
      title: formatMessage({ id: 'e9.doc.srv.srvPort' }),
      dataIndex: 'srvPort',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.doc.srv.srvDisable' }),
      dataIndex: 'srvDisable',
      width: 100,
      cell: (value) =>
        (<Switch
          size="small"
          checked={value === 0}
          checkedChildren={formatMessage({ id: 'e9.pub.enable' })}
          unCheckedChildren={formatMessage({ id: 'e9.pub.disable' })}
        />),
    }, {
      title: formatMessage({ id: 'e9.pub.whr' }),
      dataIndex: 'whr',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.pub.whsj' }),
      dataIndex: 'whsj',
      width: 200,
    }]);
    SrvStore.queryForPage({});
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  // const doSearchAction = (() => {
  //   const { validateFields } = form.current;
  //   validateFields((errors, values) => {
  //     if (!errors) {
  //       SrvStore.queryForPage(values);
  //     }
  //   });
  // });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    SrvStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    SrvStore.setPageSize(pageSize);
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
        {OptrightStore.hasRight(umid, 'a102') && <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
        {OptrightStore.hasRight(umid, 'a103') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>}
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    SrvStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment(), srvDisable: 0 };
    SrvStore.showEditForm('add', json);
  });

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
    SrvStore.delete(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value !== undefined) {
        json[key] = value;
      }
    });
    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
    json.whsj = moment();
    SrvStore.showEditForm('edit', json);
  });

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.doc.srv.title' })}
        mainroute="/doc"
        umid="docmrg001"
        extra={
          <span>
            {/* <Button.Group>
              {OptrightStore.hasRight(umid, 'a202') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
              {OptrightStore.hasRight(umid, 'a201') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
            </Button.Group> */}
            <Button.Group style={{ marginLeft: '10px' }} >
              {OptrightStore.hasRight(umid, 'a101') && <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>}
            </Button.Group>
          </span>
        }
      />
      <div className="workcontain">
        {/* 如果需要左边区域，则把这段放开，并去除下面div的样式的rightmax部分，仅保留right
        <div className="left">左边区域按实际布局</div> */}
        <div className="right rightmax">
          <div className="workspace">
            <Table
              tableLayout="fixed"
              // $work-context-heigth-41px, 41px为表头高度
              maxBodyHeight="calc(100vh - 259px)"
              dataSource={data.list}
              fixedHeader
              loading={loading}
              rowSelection={{ onChange: onTableRowChange }}
            >
              {columns.map(col =>
                <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
              )}
              <Table.Column cell={renderTableCell} width="100px" align="center" lock="right" />
            </Table>
            <Pagination
              className="footer"
              size={E9Config.Pagination.size}
              current={pageno}
              pageSize={pagesize}
              total={data.total}
              onChange={onPaginationChange}
              shape={E9Config.Pagination.shape}
              pageSizeSelector={E9Config.Pagination.pageSizeSelector}
              pageSizePosition={E9Config.Pagination.pageSizePosition}
              onPageSizeChange={onPageSizeChange}
              popupProps={E9Config.Pagination.popupProps}
              totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
            />
          </div>
        </div>
      </div>
      <EditDailog />
    </div >
  );
});

export default injectIntl(Srv);
