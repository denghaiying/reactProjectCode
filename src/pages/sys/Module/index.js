import React, { useEffect } from 'react';
import { Table, Select, Icon, Pagination, Button, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import ModuleStore from '../../../stores/system/ModuleStore';
import E9Config from '../../../utils/e9config';

/**
 * 模块管理页面
 * @Date: 2020/05/28 15:45
 * 替换新样式
 * @Version: 1.0
 */
const Module = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize, sysList } = ModuleStore;
  const field = Field.useField();
  const umid = 'sysmrg003';

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    ModuleStore.setColumns([{
      title: formatMessage({ id: 'e9.sys.module.moduleName' }),
      dataIndex: 'moduleName',
      width: 250,
      lock: true,
    }, {
      title: formatMessage({ id: 'e9.sys.module.moduleEname' }),
      dataIndex: 'moduleEname',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.sys.module.sysId' }),
      dataIndex: 'systemName',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.module.moduleType' }),
      dataIndex: 'moduleType',
      width: 100,
      cell: (value) => {
        if (value === 'A') {
          return '平台';
        } else if (value === 'B') {
          return '业务';
        }
      },
    }, {
      title: formatMessage({ id: 'e9.sys.module.moduleUrl' }),
      dataIndex: 'moduleUrl',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.sys.module.moduleIndex' }),
      dataIndex: 'moduleIndex',
      width: 200,
    },
    ]);
    ModuleStore.setParams({ sysId: '' }, true);
    ModuleStore.findSysAll();
    ModuleStore.queryForPage();
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((value) => {
    field.setValue('sysId', value);
    field.validate((errors, values) => {
      if (!errors) {
        ModuleStore.queryData(values);
      }
    });
  });
  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    ModuleStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    ModuleStore.setPageSize(pageSize);
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
    ModuleStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = {};
    ModuleStore.showEditForm('add', json);
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
    ModuleStore.delete(id);
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
    ModuleStore.showEditForm('edit', json);
  });

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.module.title' })}
        mainroute="/sysuser"
        umid="sysmrg003"
        // subTitle="南京项目"
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
          <div className="toolbar">
            <Select
              {...field.init('sysId', {})}
              name="sysId"
              style={{ width: 200 }}
              placeholder={formatMessage({ id: 'e9.sys.func.sysId' })}
              hasClear
              onChange={(value) => doSearchAction(value)}
            >
              {sysList.map(item => <Select.Option key={item.id} value={item.id}>{item.systemName}</Select.Option>)}
            </Select>
          </div>
          <div className="workspace">
            <Table
              tableLayout="fixed"
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
    </div>
  );
});

export default injectIntl(Module);
