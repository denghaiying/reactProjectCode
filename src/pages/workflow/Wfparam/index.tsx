import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Table, Button, Tooltip } from 'antd';
import { useIntl, history } from 'umi';
import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import '@/eps/components/panel/EpsPanel3/index.less';
import EditDailog from './EditDailog';
import SysStore from '../../../stores/system/SysStore';
import WfparamStore from '../../../stores/workflow/WfparamStore';
import SvgIcon from '@/components/SvgIcon';

const Wfparam = observer((props) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const { formatMessage } = useIntl();
  const { data, columns, loading, pageno, pagesize } = WfparamStore;
  const userinfo = SysStore.getCurrentUser();
  const ParamType = {
    U: '自定义',
    S: '系统',
  };
  const umid = 'WFLW001';

  useEffect(() => {
    console.log(id);
    OptrightStore.getFuncRight(umid);
    WfparamStore.setColumns([
      {
        title: 'e9.wflw.wfparam.code',
        dataIndex: 'code',
        width: 200,
      },
      {
        title: 'e9.wflw.wfparam.name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'e9.wflw.wfparam.lx',
        dataIndex: 'lx',
        width: 200,
        render: (value) => ParamType[value],
      },
      {
        title: 'e9.pub.whr',
        dataIndex: 'whr',
        width: 200,
      },
      {
        title: 'e9.pub.whsj',
        dataIndex: 'whsj',
      },
    ]);
    WfparamStore.setWfsrvId(id);
  }, []);

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = (page: any, size: any) => {
    WfparamStore.setPageSizeAndNo(page, size);
  };

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (text, record) => {
    return (
      <>
        <a
          style={{ fontSize: '12px', color: '#08c' }}
          onClick={() => onEditAction(record)}
        >
          修改
        </a>
        <a
          style={{ fontSize: '12px', marginLeft: 5, color: '#d93026' }}
          onClick={() => onDeleteAction(record.id)}
        >
          删除
        </a>
      </>
    );
  };
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    WfparamStore.setSelectRows(selectedRowKeys, records);
  };
  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    edit(record);
  };

  /**
   *  响应新增事件
   */
  const onAddAction = () => {
    const json = {
      lx: 'U',
      whrid: userinfo.id,
      whr: userinfo.yhmc,
      whsj: moment(),
      wfvid: id,
    };
    WfparamStore.showEditForm('add', json);
  };

  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (recid) => {
    deleteData(recid);
  };

  // end ********************

  // begin *************以下是自定义函数区域

  const edit = (record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.whrid = userinfo.id;
    json.whr = userinfo.yhmc;
    json.whsj = moment();
    WfparamStore.showEditForm('edit', json);
    WfparamStore.setWfsrvId(id);
  };

  const deleteData = (recid) => {
    WfparamStore.delete(recid);
    WfparamStore.setWfsrvId(id);
  };

  // end **************

  return (
    <div className="eps-table">
      <div className={'content hideExpand'}>
        <div className={'right'}>
          <div className={'control'} style={{ marginLeft: 'auto' }}>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              disabled={props.disabled}
              onClick={() => {
                onAddAction();
              }}
            >
              <FileAddOutlined />
              新建
            </Button>
            <Tooltip title="返回">
              <Button
                onClick={() => {
                  history.goBack();
                }}
                icon={<SvgIcon type={`iconreturn`} />}
                style={{ float: 'right' }}
              >
                {' '}
                返回
              </Button>
            </Tooltip>
            {/* <Button.Group>
              {OptrightStore.hasRight(umid, 'a202') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
              {OptrightStore.hasRight(umid, 'a201') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
            </Button.Group> */}
            {/* <Button.Group style={{ marginLeft: '10px' }}>
              <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
            </Button.Group>
            <Button.Group style={{ marginLeft: '10px' }}>
              <Button type="primary" onClick={toSrv}><Icon type="arrow-left" /><FormattedMessage id="e9.btn.return" /></Button>
            </Button.Group> */}
          </div>
          <Table
            bordered
            scroll={{ x: 'max-content', y: 'calc(100% - 40px)' }}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent: pageno,
              defaultPageSize: pagesize,
              pageSize: pagesize,
              current: pageno,
              showTotal: (total, range) => `共 ${total} 条数据`,
              onChange: onPageSizeChange,
              total: data.total || 0,
            }}
            dataSource={data.results}
            className="my-table"
            loading={loading}
            // rowKey="wfvid"
            rowSelection={{ onChange: onTableRowChange }}
          >
            <Table.Column
              title="操作"
              render={renderTableCell}
              width="100px"
              fixed="left"
            />
            {columns.map((col) => (
              <Table.Column
                alignHeader="center"
                key={col.dataIndex}
                {...col}
                title={formatMessage({ id: `${col.title}` })}
              />
            ))}
          </Table>
        </div>
      </div>
      <EditDailog />
    </div>
  );
});

export default Wfparam;
