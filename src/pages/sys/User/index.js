import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Switch, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import PswDailog from './PswDailog';
import RoleSetDailog from './RolesetDailog';
import LoginStore from '../../../stores/system/LoginStore';
import UserStore from '../../../stores/user/UserStore';
import E9Config from '../../../utils/e9config';

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
const User = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = UserStore;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const umid = 'usermrg001';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    UserStore.setColumns([{
      title: formatMessage({ id: 'e9.sys.user.userLoginname' }),
      dataIndex: 'userLoginname',
      width: 150,
      lock: true,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userName' }),
      dataIndex: 'userName',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userEnname' }),
      dataIndex: 'userEnname',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.orgId' }),
      dataIndex: 'orgName',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userPost' }),
      dataIndex: 'userPost',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userTel' }),
      dataIndex: 'userTel',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userTax' }),
      dataIndex: 'userTax',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userMail' }),
      dataIndex: 'userMail',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userType' }),
      dataIndex: 'userType',
      width: 200,
      cell: (value) => {
        switch (value) {
          case 4:
            return <FormattedMessage id="e9.sys.user.type.v0" />;
          case 1:
            return <FormattedMessage id="e9.sys.user.type.v1" />;
          case 2:
            return <FormattedMessage id="e9.sys.user.type.v2" />;
          case 3:
            return <FormattedMessage id="e9.sys.user.type.v3" />;
          default:
            return '';
        }
      },
    }, {
      title: formatMessage({ id: 'e9.sys.user.userEnable' }),
      dataIndex: 'userEnable',
      width: 120,
      cell: (value) =>
        (<Switch
          size="small"
          checked={value === 1}
          style={{ width: 70 }}
          checkedChildren={formatMessage({ id: 'e9.pub.enable' })}
          unCheckedChildren={formatMessage({ id: 'e9.pub.disable' })}
        />),
    },
    {
      title: formatMessage({ id: 'e9.sys.user.userQyrq' }),
      dataIndex: 'userQyrq',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.user.userTyrq' }),
      dataIndex: 'userTyrq',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.pub.whr' }),
      dataIndex: 'whr',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.pub.whsj' }),
      dataIndex: 'whsj',
      width: 200,
    }]);
    UserStore.setParams({ username: '' }, true);
    UserStore.findOrgAll().then(() => { UserStore.queryForPage(); });
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
        UserStore.setParams(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    UserStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    UserStore.setPageSize(pageSize);
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
    UserStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment(), userType: 4, userEnable: 1, userQyrq: moment(), userTyrq: null };
    UserStore.showEditForm('add', json);
  });

  /**
   * 点击修改密码按钮事件响应
   */
  const onChangePswBtnAction = () => {
    if (!UserStore.selectRowRecords || UserStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (UserStore.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    const record = UserStore.selectRowRecords[0];
    const json = { id: record.id, userName: record.userName };
    UserStore.setPasswordValues(json);
    UserStore.showPasswordDailog(true);
  };

  /**
   * 点击角色设置按钮事件响应
   */
  const onSetRoleAction = () => {
    if (!UserStore.selectRowRecords || UserStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (UserStore.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    UserStore.showRsDailog(true);
  };

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
    UserStore.delete(id);
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
    if (record.userEnable === 0) {
      json.userEnable = 0;
    }
    if (record.userQyrq === null) {
      json.userQyrq = null;
    }
    if (record.userTyrq === null) {
      json.userTyrq = null;
    }

    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
    json.whsj = moment();
    UserStore.showEditForm('edit', json);
  });

  // end **************

  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.user.title' })}
        mainroute="/sysuser"
        umid="usermrg001"
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
            <Button.Group style={{ marginLeft: '10px' }}>
              {OptrightStore.hasRight(umid, 'u001') && <Button type="primary" onClick={onChangePswBtnAction}><Icon className="iconfont iconreset_password" /><FormattedMessage id="e9.sys.user.btn.changepassword" /></Button>}
            </Button.Group>
            <Button.Group style={{ marginLeft: '10px' }}>
              {OptrightStore.hasRight(umid, 'u002') && <Button type="primary" onClick={onSetRoleAction}><Icon className="iconfont iconuser_role" /><FormattedMessage id="e9.sys.user.btn.setrole" /></Button>}
            </Button.Group>
          </span>
        }
      />
      <div className="workcontain">
        {/* 如果需要左边区域，则把这段放开，并去除下面div的样式的rightmax部分，仅保留right
        <div className="left">左边区域按实际布局</div> */}
        <div className="right rightmax">
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
            // addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
            />

          </div>
          <div className="workspace">
            <Table
              // tableLayout="fixed"
              // $work-context-heigth-41px, 41px为表头高度
              maxBodyHeight="calc(100vh - 259px)"
              dataSource={data.list}
              fixedHeader
              loading={loading}
              rowSelection={{ onChange: onTableRowChange, selectedRowKeys: UserStore.selectRowKeys }}
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
      <PswDailog />
      <RoleSetDailog />
    </div>
  );
});

export default injectIntl(User);
