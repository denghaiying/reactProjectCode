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
   * ??????????????????????????????
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (value: any) => {
    WfdefStore.setParams(value && { wfvid: value });
  };

  /**
   * Table????????????????????????????????????????????????: ??????records??????????????????dataSource??????????????????????????????selectedRowKeys????????????
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    WfdefStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * ?????????????????????????????????????????????
   * @param {*} pageSize
   */
  const onPageSizeChange = (page: any, size: any) => {
    WfdefStore.setPageSizeAndNo(page, size);
  };

  /**
   * ????????????????????????????????? ????????????
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */

  /**
   *  ??????????????????
   */
  const onAddAction = () => {
    history.push({
      pathname: `/wflw/flwedit`,
      query: { umname: '???????????????' },
    });
  };

  /**
   * ??????????????????
   * @param {*} id
   */
  const onDeleteAction = (recid) => {
    deleteData(recid);
  };

  // end ********************

  // begin *************??????????????????????????????

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
                query: { umname: `???????????????` },
              });
            }}
          >
            ??????
          </a>
        )}
        {OptrightStore.hasRight(umid, 'SYS103') && (
          <a
            style={{ fontSize: '12px', marginLeft: 5, color: '#d93026' }}
            type={'primary'}
            onClick={() => onDeleteAction(record.id)}
          >
            ??????
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
              ??????
            </Button>
            {id && (
              <Tooltip title="??????">
                <Button
                  onClick={() => {
                    history.goBack();
                  }}
                  icon={<SvgIcon type={`iconreturn`} />}
                  style={{ float: 'right' }}
                >
                  {' '}
                  ??????
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
              showTotal: (total) => `??? ${total} ?????????`,
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
              title="??????"
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
