import React, { useEffect } from 'react';
import { Table, Icon, Pagination, Button, Message } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceContainer from '@icedesign/container';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import WordsStore from '../../../stores/inspect/WordsStore';
import AddDailog from './AddDailog';
import E9Config from '../../../utils/e9config';

const Words = observer(props => {
  const { intl: { formatMessage } } = props;
  const { dataW, columns, loading, pageno, pagesize, pageSizeList, data } = WordsStore;
  // 定义表格表头参数
  const columnssource = [
    {
      title: formatMessage({ id: 'e9.inspect.words.wordname' }),
      dataIndex: 'wordName1',
      width: 200,
    },
    {
      dataIndex: 'wordName2',
      width: 200,
    },
    {
      dataIndex: 'wordName3',
      width: 200,
    },
    {
      dataIndex: 'wordName4',
      width: 200,
    },
    {
      dataIndex: 'wordName5',
      width: 200,
    },
    {
      dataIndex: 'wordName6',
      width: 200,
    },
    {
      dataIndex: 'wordName7',
      width: 200,
    },
  ];

  // 页面初始化
  useEffect(() => {
    WordsStore.setColumns(columnssource);
    WordsStore.queryForPage();
  }, []);

  // begin ******************** 以下是事件响应

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    WordsStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    WordsStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    WordsStore.setPageSize(pageSize);
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
        <a href="javascript:;" onClick={() => onDeleteAction(record)} style={{ marginLeft: '10px' }}><FormattedMessage id="e9.btn.delete" /></a>
      </div>
    );
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = {};
    WordsStore.showEditForms('add', json);
  });

  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (record) => {
    deleteData(record);
    Message.success({ title: '本行数据删除成功！', duration: 1500 });
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
  const deleteData = (record) => {
    WordsStore.delete(record);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    const id = 'id';
    const disabled = 'disabled';
    for (let i = 2; i <= 7; i++) {
      const mp = id + i;
      if (record.hasOwnProperty(mp)) {
        WordsStore[disabled + i] = false;
      } else {
        WordsStore[disabled + i] = true;
      }
    }
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    WordsStore.showEditForm('edit', json);
  });


  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.inspect.words.title' })}
        mainroute="/inspect"
        extra={
          <span>
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
            </Button.Group>
          </span>
        }
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar" />
          <div className="workspace">
            <Table
              maxBodyHeight="calc(100vh - 259px)"
              fixedHeader
              dataSource={dataW}
              loading={loading}
              rowSelection={{ onChange: onTableRowChange }}
            >
              {columns.map(col =>
                <Table.Column align="left" alignHeader="center" key={col.dataIndex} {...col} />
              )}
              <Table.Column cell={renderTableCell} align="left" alignHeader="center" width="120px" lock="right" />
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
      <AddDailog />
      <EditDailog />
    </div >
  );
});

export default injectIntl(Words);
