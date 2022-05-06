import React, { useEffect } from 'react';
import { Table, Icon, Pagination, Button } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import LoginStore from '../../../stores/system/LoginStore';
import TestSetStore from '../../../stores/inspect/TestSetStore';
import '../styles/index.scss';
import E9Config from '../../../utils/e9config';
import Text from './textDailog'
/**
 * 检测设置
 * @author tyq
 * @date 20200412
 */
const TestSet = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = TestSetStore;
  const { userinfo } = LoginStore;

  // 定义表格表头参数
  const columnssource = [
    {
      title: formatMessage({ id: 'e9.testset.iptcfgType' }),
      dataIndex: 'iptcfgType',
      width: 200,
      cell: (value) => {
        if (value === '101') {
          return '条目著录项';
        } else if (value === '201') {
          return '原文类型';
        } else if (value === '202') {
          return '原文DPI';
        } else if (value === '203') {
          return '原文内容';
        } else if (value === '204') {
          return '原文EXIF';
        } else if (value === '301') {
          return '条目原文匹配';
        } else if (value === '302') {
          return '原文条目匹配';
        } else if (value === '303') {
          return '条目原文内容匹配';
        }
      },
    },
    {
      title: formatMessage({ id: 'e9.testset.iptcfgCode' }),
      dataIndex: 'iptcfgCode',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.testset.iptcfgName' }),
      dataIndex: 'iptcfgName',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.testset.iptcfgExpr' }),
      dataIndex: 'iptcfgExpr',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.pub.whr' }),
      dataIndex: 'iptcfgWhr',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.pub.whsj' }),
      dataIndex: 'iptcfgWhsj',
      width: 200,
      cell: (value) => {
        return (
          <span>{value != null ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
        );
      },
    },
  ];
  // 页面初始化
  useEffect(() => {
    TestSetStore.setParams({});
    TestSetStore.setColumns(columnssource);
  }, []);

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    TestSetStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    TestSetStore.setPageSize(pageSize);
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
        <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:void(0)" onClick={() => onDeleteAction(record.iptcfgId)} style={{ marginLeft: '5px' }}><FormattedMessage id="e9.btn.delete" /></a>
        <a href="javascript:void(0)" onClick={() => ondDetailAction(record)} style={{ marginLeft: '5px' }}><FormattedMessage id="e9.btn.view" /></a>
      </div>
    );
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    TestSetStore.dataView = false;
    const json = { iptcfgWhrid: userinfo.id, iptcfgWhr: userinfo.whr, iptcfgWhsj: moment() };
    TestSetStore.showEditForm('add', json);
  });


  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (iptcfgId) => {
    deleteData(iptcfgId);
  };

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    edit(record);
  };
  /**
  * 响应查看详情事件
  * @param {*} record
  */
  const ondDetailAction = (record) => {
    view(record);
  };
  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    TestSetStore.delete(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    TestSetStore.dataView = false;
    const json = {};
    const user = userinfo;
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.iptcfgWhrid = user.id;
    json.iptcfgWhr = user.whr;
    json.iptcfgWhsj = moment();
    TestSetStore.showEditForm('edit', json);
  });

  const view = ((record) => {
    TestSetStore.dataView = true;
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    TestSetStore.showEditForm('view', json);
  });
  const onChange = ((selectRowKeys, selectRowRecords) => {
    TestSetStore.selectRowKeys(selectRowKeys, selectRowRecords);
  });

  const opentext = (() => {
    TestSetStore.createfile();
    TestSetStore.textlog();
  });
  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.testset.title' })}
        mainroute="/inspect"
        extra={
          <span>
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={opentext} ><Icon type="add" />保存文件</Button>
              <Button type="primary" onClick={onAddAction} style={{ marginLeft: '10px' }}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
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
              dataSource={data.list}
              rowSelection={onChange}
              loading={loading}
              primaryKey="iptcfgId"
            >
              {columns.map(col =>
                <Table.Column align="left" alignHeader="center" key={col.dataIndex} {...col} />
              )}
              <Table.Column cell={renderTableCell} align="center" width="140px" lock="right" />
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
      <Text />
    </div >
  );
});

export default injectIntl(TestSet);
