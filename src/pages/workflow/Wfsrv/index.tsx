import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Input, Table, Button, Tooltip } from 'antd';
import {
  EditOutlined,
  SettingTwoTone,
  CalculatorTwoTone,
} from '@ant-design/icons';
import { useIntl, history } from 'umi';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import SysStore from '../../../stores/system/SysStore';
import WfsrvStore from '../../../stores/workflow/WfsrvStore';
import '@/eps/components/panel/EpsPanel3/index.less';
import EditDailog from './EditDailog';

const Wfsrv = observer(() => {
  const { formatMessage } = useIntl();
  const { data, columns, loading, pageno, pagesize } = WfsrvStore;
  const userinfo = SysStore.getCurrentUser();
  const umid = 'WFLW001';

  useEffect(() => {
    // LoginStore.checktoken();
    OptrightStore.getFuncRight(umid);
    WfsrvStore.setColumns([
      {
        title: 'e9.wflw.wfsrv.wfvid',
        dataIndex: 'wfvid',
        width: 220,
      },
      {
        title: 'e9.wflw.wfsrv.name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'e9.wflw.wfsrv.wftitle',
        dataIndex: 'title',
        width: 200,
      },
      {
        title: 'e9.wflw.wfsrv.wktable',
        dataIndex: 'wktable',
        width: 200,
        // }, {
        //   title: 'e9.wflw.wfsrv.cspz',
        //   dataIndex: 'cspz',
        //   width: 200,
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

    WfsrvStore.queryForPage();
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (value: string) => {
    WfsrvStore.setParams({ title: value });
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */

  const onPageSizeChange = (page, size) => {
    WfsrvStore.setPageSizeAndNo(page, size);
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
        {OptrightStore.hasRight(umid, 'SYS102') && (
          <a
            style={{ fontSize: '12px', color: '#08c' }}
            onClick={() => onEditAction(record)}
          >
            修改
          </a>
        )}
        {OptrightStore.hasRight(umid, 'WFLW001') && (
          <a
            style={{ fontSize: '12px', color: '#08c', marginLeft: 5 }}
            onClick={() =>
              history.push({
                pathname: `/wflw/wfparam/${record.wfvid}`,
                query: { umname: '参数配置' },
              })
            }
          >
            参数配置
          </a>
        )}
        <a
          style={{ fontSize: '12px', color: '#08c', marginLeft: 5 }}
          onClick={() =>
            history.push({ pathname: `/wflw/wfdef/${record.wfvid}` })
          }
        >
          流程配置
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
    WfsrvStore.setSelectRows(selectedRowKeys, records);
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
    WfsrvStore.showEditForm('edit', json);
  };

  // end **************

  return (
    <div className="eps-table">
      <div className={'content hideExpand'}>
        <div className={'right'}>
          <div className={'control'} style={{ marginLeft: 'auto' }}>
            <Input.Search
              placeholder="请输入搜索的标题"
              style={{ width: 300, marginRight: 10 }}
              onSearch={(val: string) => doSearchAction(val)}
            />
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
            rowKey="wfvid"
            rowSelection={{ onChange: onTableRowChange }}
          >
            <Table.Column
              title="操作"
              render={renderTableCell}
              width="150px"
              fixed="left"
            />
            {columns.map((col) => (
              <Table.Column
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

export default Wfsrv;
