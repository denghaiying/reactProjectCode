import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Table, Button, Select, Switch, Tooltip } from 'antd';
import OptrightStore from '@/stores/user/OptrightStore';
import { useIntl, history } from 'umi';
import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import WfdefStore from '../../../stores/workflow/WfdefStore';
import WfsrvStore from '../../../stores/workflow/WfsrvStore';
import '@/eps/components/panel/EpsPanel3/index.less';
import SvgIcon from '@/components/SvgIcon';

const { Option } = Select;
const Wfdef = observer((props: any) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const { formatMessage } = useIntl();
  const { columns, data, loading, pageno, pagesize } = WfdefStore;
  const umid = 'WFLW002';

  const getWfsrvName = (value: string): string => {
    const { list } = WfsrvStore;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < list.length; i++) {
      const s = list[i];
      if (s.wfvid === value) {
        return `${s.wfvid}|${s.name}`;
      }
    }
    return '';
  };

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    WfdefStore.setColumns([
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.wfvid' }),
        dataIndex: 'wfvid',
        width: 200,
        lock: true,
        render: (value: string) => getWfsrvName(value),
      },
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.wfid' }),
        dataIndex: 'wfid',
        width: 140,
      },
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.name' }),
        dataIndex: 'name',
        width: 200,
      },
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.wftitle' }),
        dataIndex: 'title',
        width: 200,
      },
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.bdms' }),
        dataIndex: 'bdms',
        width: 100,
        render: (value) => (
          <Switch size="small" checked={value === 'Y'} style={{ width: 50 }} />
        ),
      },
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.wktable' }),
        dataIndex: 'wktable',
        width: 120,
      },
      {
        title: formatMessage({ id: 'e9.wflw.wfdef.zxtj' }),
        dataIndex: 'zxtj',
        width: 250,
      },
      {
        title: formatMessage({ id: 'e9.pub.whr' }),
        dataIndex: 'whr',
        width: 120,
      },
      {
        title: formatMessage({ id: 'e9.pub.whsj' }),
        dataIndex: 'whsj',
      },
    ]);
    WfdefStore.setParams({ wfvid: id === '0' ? '' : id || '' });
    WfsrvStore.queryForList();
  }, []);

  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (value: any) => {
    WfdefStore.setParams(value && { wfvid: value });
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    WfdefStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = (page: any, size: any) => {
    WfdefStore.setPageSizeAndNo(page, size);
  };

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */

  /**
   *  响应新增事件
   */
  const onAddAction = () => {
    history.push({
      pathname: `/wflw/flwedit`,
      query: { umname: '图形化配置' },
    });
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

  const deleteData = (recid) => {
    WfdefStore.delete({ id: recid });
  };

  // end **************

  const renderTableCell = (text, record) => {
    return (
      <div>
        {OptrightStore.hasRight(umid, 'SYS102') && (
          <a
            style={{ fontSize: '12px', color: '#08c' }}
            onClick={() => {
              history.push({
                pathname: `/wflw/flwedit/${record.id}`,
                query: { umname: `图形化配置` },
              });
            }}
          >
            修改
          </a>
        )}
        {OptrightStore.hasRight(umid, 'SYS103') && (
          <a
            style={{ fontSize: '12px', marginLeft: 5, color: '#d93026' }}
            type={'primary'}
            onClick={() => onDeleteAction(record.id)}
          >
            删除
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="eps-table">
      <div className={'content hideExpand'}>
        <div className={'right'}>
          <div className={'control'} style={{ marginLeft: 'auto' }}>
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder={formatMessage({ id: 'e9.wflw.wfdef.con.wfsrv' })}
              onChange={(value) => doSearchAction(value)}
              value={WfdefStore.params.wfvid || ''}
            >
              {WfsrvStore.list.map((item) => (
                <Option key={item.wfvid} value={item.wfvid}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              style={{ marginLeft: 20 }}
              disabled={props.disabled}
              onClick={() => {
                onAddAction();
              }}
            >
              <FileAddOutlined />
              新建
            </Button>
            {id && (
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
            )}
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
              showTotal: (total) => `共 ${total} 条数据`,
              onChange: onPageSizeChange,
              total: data.total || 0,
            }}
            dataSource={data.results}
            className="my-table"
            loading={loading}
            rowKey="wfid"
            rowSelection={{ onChange: onTableRowChange }}
          >
            <Table.Column
              render={renderTableCell}
              width="100px"
              fixed="right"
              title="操作"
            />
            {columns.map((col) => (
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Wfdef;
