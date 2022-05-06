import React, { useEffect } from "react";
import { Table, Input, Icon, Pagination, Button, Form } from "@alifd/next";
import { FormattedMessage, injectIntl } from "react-intl";
import IceNotification from "@icedesign/notification";
import moment from "moment";
import { observer } from "mobx-react";
import ContainerTitle from "../../../components/ContainerTitle";
import SearchPanel from "../../../components/SearchPanel";
import EditDailog from "./StepDailog";

import FrontIntStore from "../../../stores/etl/FrontIntStore";

const Inspection = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const {
    data,
    columns,
    loading,
    pageno,
    pagesize,
    editVisible,
  } = FrontIntStore;
  const { Item: FormItem } = Form;

  const form = React.createRef();
  useEffect(() => {
    FrontIntStore.setColumns([
      {
        title: formatMessage({ id: "e9.etl.frontinf.code" }),
        dataIndex: "code",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.etl.frontinf.name" }),
        dataIndex: "name",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.etl.frontinf.field" }),
        dataIndex: "field",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.etl.frontinf.tb" }),
        dataIndex: "tb",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.etl.frontinf.search" }),
        dataIndex: "search",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.etl.frontinf.page" }),
        dataIndex: "page",
        width: 100,
      },
      {
        title: formatMessage({ id: "e9.etl.frontinf.size" }),
        dataIndex: "size",
        width: 100,
      },
      {
        title: formatMessage({ id: "e9.pub.whsj" }),
        dataIndex: "whsj",
        width: 200,
      },
    ]);
    FrontIntStore.queryForPage({});
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        FrontIntStore.queryData(values);
      }
    });
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = (current) => {
    FrontIntStore.setPageNo(current);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = (pageSize) => {
    FrontIntStore.setPageSize(pageSize);
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
    FrontIntStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = () => {
    const json = {
      taskDakid: 0,
      userEnable: 0,
      whrid: "admin",
      whr: "管理员",
      whsj: moment(),
    };
    FrontIntStore.showEditForm("add", json);
  };
  /**
   * 点击启用按钮事件响应
   */
  const onStartAction = () => {
    FrontIntStore.start();
  };
  /**
   * 点击停止按钮事件响应
   */
  const onStopAction = () => {
    FrontIntStore.stop();
  };
  /**
   * 点击新增按钮事件响应
   */
  const onRuleAction = () => {
    if (
      !FrontIntStore.selectRowRecords ||
      FrontIntStore.selectRowRecords.length < 1
    ) {
      IceNotification.info({
        message: formatMessage({ id: "e9.info.info" }),
        description: formatMessage({ id: "e9.info.selectNone" }),
      });
      return;
    }
    if (FrontIntStore.selectRowRecords.length > 1) {
      IceNotification.info({
        message: formatMessage({ id: "e9.info.info" }),
        description: formatMessage({ id: "e9.info.selectOneOnly" }),
      });
      return;
    }

    FrontIntStore.rule();
  };
  /**
   * 点击新增按钮事件响应
   */
  const onResetAction = () => {
    FrontIntStore.reset();
  };
  /**
   * 点击修改密码按钮事件响应
   */

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
    FrontIntStore.delete(id);
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
    json.whrid = "admin";
    json.whr = "管理员";
    json.whsj = moment();
    FrontIntStore.showEditForm("edit", json);
  };
  const height = document.body.clientHeight - 200;
  const width = document.body.clientWidth - 260;
  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: "e9.etl.frontinf.title" })}
        mainroute="/etl"
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
              <Button type="primary" onClick={onAddAction}>
                <Icon type="add" />
                <FormattedMessage id="e9.btn.add" />
              </Button>
            </Button.Group>
          </span>
        }
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
            <Input
              name="username"
              maxLength={50}
              style={{ width: 200 }}
              placeholder={formatMessage({ id: "e9.sys.user.con.username" })}
              hasClear
              innerAfter={
                <Icon
                  type="search"
                  size="xs"
                  onClick={doSearchAction}
                  style={{ margin: 4 }}
                />
              }
              // addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
            />
          </div>
          <div className="workspace">
            <Table
              size="small"
              dataSource={data.list}
              fixedHeader
              loading={loading}
              rowSelection={{ onChange: onTableRowChange }}
            >
              {columns.map((col) => (
                <Table.Column
                  alignHeader="center"
                  key={col.dataIndex}
                  {...col}
                />
              ))}
              <Table.Column cell={renderTableCell} width="100px" lock="right" />
            </Table>
            <Pagination
              current={pageno}
              pageSize={pagesize}
              total={data.total}
              onChange={onPaginationChange}
              style={{ marginTop: "10px" }}
              pageSizeSelector="dropdown"
              pageSizePosition="end"
              onPageSizeChange={onPageSizeChange}
              totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
          
            />
          </div>
        </div>
      </div>
      <EditDailog />
    </div>
  );
});

export default injectIntl(Inspection);
