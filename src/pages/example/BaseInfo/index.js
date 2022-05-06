import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import evariables from '@/styles/variables.scss';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import ExampleStore from '../../../stores/example/ExampleStore';
import E9Config from '../../../utils/e9config';
import EditDailog from './EditDailog';
import { WflwButtons } from '../../../components/Wflw';

/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const BaseInfo = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = ExampleStore;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const umid = 'UCAS999';
  // OptrightStore.hasRight(umid, 'a202')判断功能有没有某个按钮权限
  // OptrightStore.hasRight(umid) 判断有没有打开功能的权限

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    OptrightStore.getFuncRight("eapmrg002");
    OptrightStore.hasRight("eapmrg002")
    ExampleStore.setColumns([{
      title: formatMessage({ id: 'e9.wflw.pub.wpname' }),
      dataIndex: 'wpname',
      width: 200,
    }, {
      title: '示例',
      dataIndex: 'extableName',
      width: 200,
    }, {
      title: 'State',
      dataIndex: 'extableState',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      dataIndex: 'wfawaiter',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.wflw.pub.wfahandler' }),
      dataIndex: 'wfahandler',
      width: 200,
    }]);
    ExampleStore.queryForPage();
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        ExampleStore.setParams(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    ExampleStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    ExampleStore.setPageSize(pageSize);
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
        {OptrightStore.hasRight(umid, 'SYS102') && <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
        {OptrightStore.hasRight(umid, 'SYS102') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>}
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    ExampleStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { whrid: userinfo.id, whr: userinfo.yhmc, whsj: moment() };
    ExampleStore.showEditForm('add', json);
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
    ExampleStore.delete(id);
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
    ExampleStore.showEditForm('edit', json);
  });

  const onBeforeWfAction = async (action) => {
    if (!ExampleStore.selectRowRecords || ExampleStore.selectRowRecords.length !== 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return false;
    }
    return true;
  };

  const onAfterWfAction = (data) => {
    ExampleStore.queryForPage();
  };

  const getWfid = () => {
    if (ExampleStore.selectRowRecords && ExampleStore.selectRowRecords.length > 0) {
      return ExampleStore.selectRowRecords[0].wfid;
    }
    return '';
  };

  const getWfinst = () => {
    if (ExampleStore.selectRowRecords && ExampleStore.selectRowRecords.length > 0) { return ExampleStore.selectRowRecords[0].wfinst; }
    return '';
  };

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title="Example"
        mainroute="/example"
        umid={umid}
        subTitle="测试项目标题"
        extra={
          <span>
            <Button.Group>
              {OptrightStore.hasRight(umid, 'SYS201') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
              {OptrightStore.hasRight(umid, 'SYS202') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
            </Button.Group>
            <Button.Group style={{ marginLeft: '10px' }} >
              {OptrightStore.hasRight(umid, 'SYS101') && <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>}
            </Button.Group>
            {/* 暂时不支持批量提交,下面两种Button二选一即可 */}
            {/* <WflwButtons style={{ marginLeft: '10px' }} type={['batchsubmit']} /> */}
            <WflwButtons
              style={{ marginLeft: '10px' }}
              type={['submit', 'return']}
              wfid={getWfid()}
              wfinst={getWfinst()}
              onBeforeAction={onBeforeWfAction}
              onAfterAction={onAfterWfAction}
            />
            <WflwButtons
              style={{ marginLeft: '10px' }}
              showmode="dropdown"
              type={['submit', 'return']}
              wfid={getWfid()}
              wfinst={getWfinst()}
              onBeforeAction={onBeforeWfAction}
              onAfterAction={onAfterWfAction}
            />
          </span>
        }
      />
      <div className="workcontain" >
        {/* 如果需要左边区域，则把这段放开，并去除下面div的样式的rightmax部分，仅保留right
        <div className="left">左边区域按实际布局</div> */}
        <div className="right rightmax" >
          <div className="toolbar">
            <Input
              {...field.init('username', {})}
              maxLength={50}
              style={{ width: 200 }}
              placeholder={formatMessage({ id: 'e9.sys.user.con.username' })}
              hasClear
              value={field.getValue('username')}
              onChange={username => field.setValue('username', username)}
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
              addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
            />

          </div>
          <div className="workspace">
            <Table
              // 对于没有分页器的使用worktable-nofoot
              className="worktable"
              // tableLayout="fixed"
              // workTableHeigth-41px, 41px为表头高度,对于没有分页器的使用workspaceHeigth变量
              maxBodyHeight={`calc(${evariables.workTableHeigth} - 41px)`}
              dataSource={data.list}
              fixedHeader
              loading={loading}
              rowSelection={{ onChange: onTableRowChange, selectedRowKeys: ExampleStore.selectRowKeys }}
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
        </div >
      </div >
      <EditDailog />
    </div >
  );
});

export default injectIntl(BaseInfo);
