import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Select, Message, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import JcjgStore from '../../../stores/inspect/JcjgStore';
import JcsqjgStore from '../../../stores/inspect/JcsqjgStore';
import E9Config from '../../../utils/e9config';
import './index.scss';

const jcjg = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, loading, pageno, pagesize } = JcsqjgStore;
  const field = Field.useField();


  const dataSource = [
    { value: 'C', label: '待检测' },
    { value: 'W', label: '检测中' },
    { value: 'Z', label: '检测完成' },
    { value: 'E', label: '检测出错' },
  ];

  const columns = [{
    title: formatMessage({ id: 'e9.inspect.jcjg.sqdw' }),
    dataIndex: 'jcsqSqdw',
    width: 200,
    lock: true,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.zt' }),
    dataIndex: 'jcsqSpzt',
    width: 200,
    cell: (value) => {
      if (value === 'C') {
        return '待检测';
      } else if (value === 'W') {
        return '检测中';
      } else if (value === 'Z') {
        return '检测完成';
      } else if (value === 'E') {
        return '检测出错';
      }
    },
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.sqrq' }),
    dataIndex: 'jcsqSqrq',
    width: 200,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.jcfw' }),
    dataIndex: 'jcsqJcfw',
    width: 200,
    cell: (value) => {
      if (value === 'A') {
        return '条目和原文';
      } else if (value === 'B') {
        return '仅条目';
      } else if (value === 'C') {
        return '仅原文';
      }
    },

  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.sqsm' }),
    dataIndex: 'jcsqSqsm',
    width: 300,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.ppgz' }),
    dataIndex: 'jcsqPpgz',
    width: 400,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.tms' }),
    dataIndex: 'jcsqTms',
    width: 150,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.yws' }),
    dataIndex: 'jcsqYws',
    width: 150,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.ywdir' }),
    dataIndex: 'jcsqYwdir',
    width: 400,
  }, {
    title: formatMessage({ id: 'e9.pub.whr' }),
    dataIndex: 'jcsqWhr',
    width: 200,
  }, {
    title: formatMessage({ id: 'e9.pub.whsj' }),
    dataIndex: 'jcsqWhsj',
    width: 200,
  }];


  const form = React.createRef();
  useEffect(() => {
    JcsqjgStore.setColumns(columns);
    JcsqjgStore.setParams(JcjgStore.searchData);
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (() => {
    const conjn = {};
    field.validate((errors, values) => {
      if (!errors) {
        const ztarr = values;
        if (!ztarr.zts || ztarr.zts.length > 0) {
          conjn['zts'] = ['C', 'W', 'Z', 'E'];
        } else {
          values = {};
        }
      }
      JcsqjgStore.setParams(values);
    });
  });

  const doSearchActions = ((values) => {
    field.setValue('zts', values);
    const conjn = {};
    field.validate((errors, values) => {
      if (!errors) {
        const ztarr = values;
        if (!ztarr.zts || ztarr.zts.length > 0) {
          conjn['zts'] = ['C', 'W', 'Z', 'E'];
        } else {
          values = {};
        }
      }
      JcsqjgStore.setParams(values);
    });
  });
  /**
    * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
    * @param {*} selectedRowKeys
    * @param {*} records
    */
  const onTableRowChange = (selectedRowKeys, records) => {
    JcjgStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    JcsqjgStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    JcsqjgStore.setPageSize(pageSize);
  });

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div align="center">
        <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onViewAction(record)}><FormattedMessage id="e9.btn.view" /></a>
      </div>);
  };


  // 导出pdf
  const onOutPdf = (() => {
    if (!JcjgStore.selectRowRecords || JcjgStore.selectRowRecords.length < 1) {
      return Message.warning({ title: formatMessage({ id: 'e9.info.selectNone' }), duration: 1500 });
    }
    JcjgStore.outToPdf();
    JcjgStore.setSelectRows([], []);
  });
  // 查看数据
  const onViewAction = (record) => {
    view(record);
  };

  const view = ((record) => {
    JcjgStore.ChangeRecord(record);
    JcjgStore.findJcsqmx({ sqid: record.jcsqId }, record);
    JcjgStore.findZlx(record);
  });

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.inspect.jcjg.title' })}
        mainroute="/inspect"
        extra={
          <span>
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={onOutPdf}><Icon type="download" /><FormattedMessage id="e9.inspect.jcjg.import" /></Button>
            </Button.Group>
          </span>
        }
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
            <Select
              {...field.init('zts', { initValue: dataSource[2] })}
              name="zts"
              style={{ width: 350 }}
              dataSource={dataSource}
              onChange={(value) => doSearchActions(value)}
              mode="multiple"
            />
            <Input
              {...field.init('sqdw', {})}
              maxLength={50}
              style={{ width: 200, marginLeft: 10 }}
              placeholder={formatMessage({ id: 'e9.inspect.jcjg.sqdw' })}
              hasClear
              value={field.getValue('sqdw')}
              onChange={sqdw => field.setValue('sqdw', sqdw)}
              innerAfter={<Icon type="search" size="xs" onClick={(value, errors) => doSearchAction(value, errors)} style={{ margin: 4 }} />}
            />
          </div>
          <div className="workspace">
            <Table
              primaryKey="jcsqId"
              tableLayout="fixed"
              maxBodyHeight="calc(100vh - 259px)"
              dataSource={data.list}
              fixedHeader
              loading={loading}
              rowSelection={{ onChange: onTableRowChange, selectedRowKeys: JcjgStore.selectRowKeys }}
            >

              {columns.map(col =>
                <Table.Column alignHeader="center" align="left" key={col.dataIndex} {...col} />
              )}
              <Table.Column cell={renderTableCell} width="100px" lock="right" />
            </Table>
            <Pagination
              className="footer"
              size={E9Config.Pagination.size}
              current={pageno}
              pageSize={pagesize}
              total={data.total ? data.total : 0}
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

export default injectIntl(jcjg);
