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
import Loadable from '@loadable/component';
import { ArrowUpOutlined, SaveOutlined, ArrowDownOutlined, UnorderedListOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
const Hkjdtj = Loadable(() => import('@/pages/datj/Hkjdtj'));
import DakTree from '@/eps/components/trees/DakTree/DakTree'
import MainChart from '../../Components/MainChart/index'
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
  const { jdumid = "DAJD016", jdname = "销毁鉴定" } = props;
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
            onSelect={onSelect}
            store={Store}
            treeData={Store.treeData}
          />
          {/* <div className="collapse-icon">
            <LeftOutlined size={12} className="icon left-arrow" onClick={() => { setExpand(false) }} />
            <RightOutlined size={12} className="icon right-arrow" onClick={() => { setExpand(true) }} />
          </div> */}
        </div>
        <div className="right">
          <MainChart />
        </div>
      </div>

    </div>
  );
});

export default injectIntl(ArchiveInfo);
