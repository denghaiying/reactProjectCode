import React, { useEffect } from 'react';
import { Table, Select, Icon, Pagination, Button, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import FuncStore from '../../../stores/system/FuncStore';
import E9Config from '../../../utils/e9config';

const Module = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = FuncStore;
  const field = Field.useField();
  const umid = 'sysmrg004';

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    FuncStore.setColumns([{
      title: formatMessage({ id: 'e9.sys.func.funcName' }),
      dataIndex: 'funcName',
      width: 250,
      lock: true,
    }, {
      title: formatMessage({ id: 'e9.sys.func.funcEname' }),
      dataIndex: 'funcEname',
      width: 250,
    },
    {
      title: formatMessage({ id: 'e9.sys.func.moduleId' }),
      dataIndex: 'moduleName',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.module.sysId' }),
      dataIndex: 'systemName',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.func.funcUrl' }),
      dataIndex: 'funcUrl',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.sys.func.funcType' }),
      dataIndex: 'funcType',
      width: 100,
      cell: (value) => {
        if (value == 'F') {
          return '普通';
        }
      },
    }, {
      title: formatMessage({ id: 'e9.sys.func.funcIndex' }),
      dataIndex: 'funcIndex',
      width: 200,
    },
    ]);
    FuncStore.setParams({ sysId: '', moduleId: '' }, true);
    FuncStore.initData().then(() => { FuncStore.queryForPage(); });
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  /** 根据系统查询数据 */
  const doSearchAction = ((value) => {
    field.setValue('sysId', value);
    FuncStore.findModuleAll(value);
    field.validate((errors, values) => {
      if (!errors) {
        FuncStore.queryData(values);
      }
    });
  });
  /** 根据模块查询数据 */
  const doSearchActions = ((value) => {
    field.setValue('moduleId', value);
    field.validate((errors, values) => {
      if (!errors) {
        FuncStore.queryData(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    FuncStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    FuncStore.setPageSize(pageSize);
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
        {/* {OptrightStore.hasRight(umid, 'a103') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>} */}
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    FuncStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    // const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
    const json = {};
    FuncStore.showEditForm('add', json);
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
    FuncStore.delete(id);
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
    // json.whrid = userinfo.id;
    // json.whr = userinfo.userName;
    // json.whsj = moment();
    FuncStore.showEditForm('edit', json);
  });

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.func.title' })}
        mainroute="/sysuser"
        umid="sysmrg004"
      // extra={
      //   <span>
      //     <Button.Group>
      //       {OptrightStore.hasRight(umid, 'a202') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
      //       {OptrightStore.hasRight(umid, 'a201') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
      //     </Button.Group>
      //     <Button.Group style={{ marginLeft: '10px' }} >
      //       {OptrightStore.hasRight(umid, 'a101') && <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>}
      //     </Button.Group>
      //   </span>
      // }
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
            <Select
              {...field.init('sysId', {})}
              name="sysId"
              style={{ width: 200, marginRight: '20px' }}
              placeholder={formatMessage({ id: 'e9.sys.func.sysId' })}
              hasClear
              onChange={(value) => doSearchAction(value)}
              dataSource={FuncStore.sysSelect}
            />
            <Select
              {...field.init('moduleId', {})}
              name="moduleId"
              style={{ width: 200 }}
              placeholder={formatMessage({ id: 'e9.sys.func.moduleId' })}
              hasClear
              onChange={(value) => doSearchActions(value)}
              dataSource={FuncStore.moduleSelect}
            />
          </div>
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
              <Table.Column cell={renderTableCell} width="100px" lock="right" />
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

export default injectIntl(Module);
