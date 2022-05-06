import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Icon, Pagination, Button } from '@alifd/next';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import SysStore from '../../../stores/system/SysStore';
import LoginStore from '../../../stores/system/LoginStore';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import E9Config from '../../../utils/e9config';

const System = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = SysStore;
  const { userinfo } = LoginStore;
  const showType = {
    0: `${formatMessage({ id: 'e9.sys.system.showType.S0' })}`,
    1: `${formatMessage({ id: 'e9.sys.system.showType.S1' })}`,
    2: `${formatMessage({ id: 'e9.sys.system.showType.S2' })}`,
  };

  const type = {
    0: `${formatMessage({ id: 'e9.sys.system.type.T0' })}`,
    1: `${formatMessage({ id: 'e9.sys.system.type.T1' })}`,
    2: `${formatMessage({ id: 'e9.sys.system.type.T2' })}`,
    9: `${formatMessage({ id: 'e9.sys.system.type.T9' })}`,
  };
  const umid = 'sysmrg002';

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    SysStore.setColumns([{
      title: formatMessage({ id: 'e9.sys.system.systemName' }),
      dataIndex: 'systemName',
      width: 200,
      lock: true,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemEnname' }),
      dataIndex: 'systemEnname',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemType' }),
      dataIndex: 'systemType',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemInfo' }),
      dataIndex: 'systemInfo',
      width: 350,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemUrl' }),
      dataIndex: 'systemUrl',
      width: 400,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemShowtype' }),
      dataIndex: 'systemShowtype',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemVer' }),
      dataIndex: 'systemVer',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.system.systemDbver' }),
      dataIndex: 'systemDbver',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.pub.whr' }),
      dataIndex: 'whr',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.pub.whsj' }),
      dataIndex: 'whsj',
      width: 200,
    }]);

    SysStore.queryForPage({});
  }, []);

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    SysStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    SysStore.setPageSize(pageSize);
  });

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} dataIndex null表示最后一列
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (dataIndex, value, index, record) => {
    if (!dataIndex) {
      return (
        <div>
          <div>
            {OptrightStore.hasRight(umid, 'a102') && <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
            {record.systemType === 9 && OptrightStore.hasRight(umid, 'a103') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>
            }
          </div>
        </div>);
    }
    if (dataIndex === 'systemType') {
      return type[value];
    } else if (dataIndex === 'systemShowtype') {
      return showType[value];
    }
    return value;
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    SysStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { systemType: 9, systemShowtype: 1, whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
    SysStore.showEditForm('add', json);
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
    SysStore.delete(id);
  };

  /**
   *  修改记录
   * @param {* System} record
   */
  const edit = ((record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
    json.whsj = moment();
    SysStore.showEditForm('edit', json);
  });

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.system.title' })}
        mainroute="/sysuser"
        umid="sysmrg002"
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
                (<Table.Column
                  alignHeader="center"
                  key={col.dataIndex}
                  {...col}
                  cell={(value, index, record) => renderTableCell(col.dataIndex, value, index, record)}
                />)
              )}
              <Table.Column cell={(value, index, record) => renderTableCell(null, value, index, record)} width="100px" lock="right" />
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
    </div>
  );
});

export default injectIntl((System));
