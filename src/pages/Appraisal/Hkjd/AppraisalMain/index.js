import React, { useEffect, useState } from "react";
import { Grid, Form, Tree, Button, Table } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import IceNotification from "@icedesign/notification";
import moment from "moment";
import { observer } from "mobx-react";
import LoginStore from "@/stores/system/LoginStore";
import Store from "@/stores/appraisa/AppraisaStore.ts";
import UserMenuStore from "@/stores/system/UserMenuStore";
import E9Config from "@/utils/e9config";
import "./index.less";
import CollapseTree from "@/components/collapseTree";
import util from "@/utils/util";
import { Line, Column } from "@ant-design/charts";
import Loadable from '@loadable/component';
import { ArrowUpOutlined, SaveOutlined, ArrowDownOutlined, UnorderedListOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
const Hkjdtj = Loadable(() => import('@/pages/datj/Hkjdtj'));
import DakTree from '@/eps/components/trees/DakTree/DakTree'
const { Row, Col } = Grid;
const FormItem = Form.Item;


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
const ArchiveInfo = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const { treeData, columns, loading, pageno, pagesize, isExpand } = Store;
  const { jdumid = "DAJD013", jdname = "划控鉴定" } = props;
  const [expand, setExpand] = useState(true)

  const { userinfo } = LoginStore;
  var data = [
    {
      type: "未鉴定",
      sales: 38,
    },
    {
      type: "已鉴定",
      sales: 52,
    },
  ];

  var config = {
    data: data,
    xField: "type",
    yField: "sales",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    meta: {
      type: { alias: "类别" },
      sales: { alias: "鉴定" },
    },
  };

  useEffect(() => {
    Store.setColumns([
      {
        title: "编号",
        dataIndex: "code",
        width: 200,
        lock: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 250,
      },
      {
        title: formatMessage({ id: "e9.pub.whsj" }),
        dataIndex: "whsj",
        width: 200,
      },
    ]);
    // Store.queryForPage();
    Store.queryTree();
  }, []);

  const onSelect = (selectedKeys, info) => {
    //点击顶部WS|文active: false
// bh: "WS"
// checked: false
// children: Proxy {0: Proxy, Symbol(mobx administration): ObservableArrayAdministration}
// dqzq: 0
// dragOver: false
// dragOverGapBottom: false
// dragOverGapTop: false
// dw: "DW201408191440170001"
// edittype: 0
// expanded: false
// fid: "DAKFZ201805151539100003"
// fjs: 0
// halfChecked: false
// icon: Proxy {…}
// id: "DAK201907261356280060"
// key: "DAK201907261356280060"
// label: "WS|文书档案传统立卷库"
// leaf: false
// loaded: false
// loading: false
// lx: "02"
// mbc: "DAKQ1030001"
// mc: "文书档案传统立卷库"
// pos: "0-0-1"
// selected: false
// sl: 0
// text: "WS|文书档案传统立卷库"
// title: "WS|文书档案传统立卷库"
// tms: 0
// type: "K"
// whsj: "2021-06-06 01:40:32"
// xh: 20
    
    const {icon ,children,...params}  = info.node;
    info.node.icon="";
    if (info.node.type == "F") {
      return;
    }

    util.setSStorage("arch_param", params);
    window.top.Eps.top().runFunc(
      jdumid,
      {},
      `${info.node.mc}【${jdname}】`
    );
  };




  // end **************
  return (
    <div className="oa-manage">
      <div className="title">{jdname}</div>
      <div className={expand ? 'content' : 'content hideExpand'}>
        <div className="tree">
          <DakTree
            store={Store}
            onSelect={onSelect}
            treeData={Store.treeData}
          />
          {/* <div className="collapse-icon">
            <LeftOutlined size={12} className="icon left-arrow" onClick={() => { setExpand(false) }} />
            <RightOutlined size={12} className="icon right-arrow" onClick={() => { setExpand(true) }} />
          </div> */}
        </div>
        <div className="right">
          <Hkjdtj />
        </div>
      </div>

    </div>
  );
});

export default injectIntl(ArchiveInfo);
