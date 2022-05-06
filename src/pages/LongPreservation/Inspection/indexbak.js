import React, { useEffect } from "react";
import {
  Table,
  Input,
  Icon,
  Pagination,
  Button,
  Field,
  Select
} from "@alifd/next";
import { FormattedMessage, injectIntl } from "react-intl";
import IceNotification from "@icedesign/notification";
import moment from "moment";
import { observer } from "mobx-react";
import LoginStore from '../../../stores/system/LoginStore';
import ContainerTitle from "../../../components/ContainerTitle";
import Store from "../../../stores/longpreservation/InspectionStore";
import TaskStore from "../../../stores/longpreservation/TaskStore";
import E9Config from "../../../utils/e9config";


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
const User = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const { data, columns, loading, pageno, pagesize } = Store;
  const { userinfo } = LoginStore;
  const field = Field.useField({
    onChange: (name, value) => {
      
      if (name === 'dwid') {
        const v = value;
        if (v) {
         
        } 
      }
      Store.setParams(values);
    },
  });
  
  useEffect(() => {
    Store.setColumns([
      {
        title: formatMessage({ id: 'e9.longpriservation.inspection.taskName' }),
        dataIndex: 'taskName',
        width: 100,
      }, {
      title: formatMessage({ id: 'e9.longpriservation.inspection.batch' }),
      dataIndex: 'batch',
      width: 130,
    }, {
      title: formatMessage({ id: 'e9.longpriservation.inspection.tm' }),
      dataIndex: 'tm',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.longpriservation.inspection.nd' }),
      dataIndex: 'nd',
      width: 80,
    }, {
      title: formatMessage({ id: 'e9.longpriservation.inspection.bgqx' }),
      dataIndex: 'bgqx',
      width: 100,
    },{
      title: formatMessage({ id: 'e9.longpriservation.inspection.uploaddate' }),
      dataIndex: 'uploaddate',
      width: 120,
    }, {
      title: formatMessage({ id: 'e9.longpriservation.inspection.status' }),
      dataIndex: 'status',
      width: 60,
      cell: (value) => {
        switch (value) {
          case 0:
            return "未检测" ;
          case 1:
            return "检测完成";
          case 2:
            return "检测中";
          default:
            return '未检测';
        }
      }
    }, {
      title: formatMessage({ id: 'e9.longpriservation.inspection.result' }),
      dataIndex: 'result',
      width: 300
    }
    ]);
    Store.queryForPage();
    TaskStore.queryDw();
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (values, errors) => {
    field.validate((errors, values) => {
      if (!errors) {
        Store.setParams(values);
      }
    });
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = (current) => {
    Store.setPageNo(current);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = (pageSize) => {
    Store.setPageSize(pageSize);
  };

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}>
          <FormattedMessage id="e9.btn.edit" />
        </a>
        <a
          href="javascript:;"
          style={{ marginLeft: "5px" }}
          onClick={() => onDeleteAction(record.id)}
        >
          <FormattedMessage id="e9.btn.delete" />
        </a>
      </div>
    );
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    Store.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = () => {
    const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
    Store.showEditForm("add", json);
  };

  /**
   * 点击修改密码按钮事件响应
   */
  const onChangePswBtnAction = () => {
    if (
      !Store.selectRowRecords ||
      Store.selectRowRecords.length < 1
    ) {
      IceNotification.info({
        message: formatMessage({ id: "e9.info.info" }),
        description: formatMessage({ id: "e9.info.selectNone" }),
      });
      return;
    }
    if (Store.selectRowRecords.length > 1) {
      IceNotification.info({
        message: formatMessage({ id: "e9.info.info" }),
        description: formatMessage({ id: "e9.info.selectOneOnly" }),
      });
      return;
    }
    const record = Store.selectRowRecords[0];
    const json = { id: record.id, userName: record.userName };
    Store.setPasswordValues(json);
    Store.showPasswordDailog(true);
  };

  /**
   * 点击角色设置按钮事件响应
   */
  const onSetRoleAction = () => {
    if (
      !Store.selectRowRecords ||
      Store.selectRowRecords.length < 1
    ) {
      IceNotification.info({
        message: formatMessage({ id: "e9.info.info" }),
        description: formatMessage({ id: "e9.info.selectNone" }),
      });
      return;
    }
    if (Store.selectRowRecords.length > 1) {
      IceNotification.info({
        message: formatMessage({ id: "e9.info.info" }),
        description: formatMessage({ id: "e9.info.selectOneOnly" }),
      });
      return;
    }
    Store.showRsDailog(true);
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
    Store.delete(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = (record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });

    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
    json.whsj = moment();
    Store.showEditForm("edit", json);
  };

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: "e9.longpriservation.inspection.title" })}
        mainroute="/sysuser"
        umid="usermrg001"
        extra={
          <span>
            <Button.Group>
              <Button type="primary">
                <Icon className="iconfont iconprint" />
                <FormattedMessage id="e9.btn.print" />
              </Button>
              <Button type="primary">
                <Icon className="iconfont iconset" />
                <FormattedMessage id="e9.btn.reportset" />
              </Button>
            </Button.Group>

            <Button.Group style={{ marginLeft: "10px" }}>
              <Button type="secondary" onClick={onAddAction}>
                <Icon type="view" />
                <FormattedMessage id="e9.longpriservation.inspection.detail" />
              </Button>
            </Button.Group>
          </span>
        }
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
         
          <Input
              {...field.init('taskName', {})}
              maxLength={50}
              style={{ width: 200 }}
              placeholder={formatMessage({ id: 'e9.longpriservation.inspection.taskName' })}
              hasClear
              value={field.getValue('taskName')}
              onChange={taskName => field.setValue('taskName', taskName)}
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
            // addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
            />
          </div>
          <div className="workspace">
            <Table
              tableLayout="fixed"
              // $work-context-heigth-41px, 41px为表头高度
              maxBodyHeight="calc(100vh - 259px)"
              dataSource={data.list}
              fixedHeader
              loading={loading}
              rowSelection={{
                onChange: onTableRowChange,
                selectedRowKeys: Store.selectRowKeys,
              }}
            >
              {columns.map((col) => (
                <Table.Column
                  alignHeader="center"
                  key={col.dataIndex}
                  {...col}
                />
              ))}

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
              totalRender={(total) => (
                <span className="pagination-total">
                  {" "}
                  {`${formatMessage({ id: "e9.pub.total" })}：${total}`}
                </span>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default injectIntl(User);
