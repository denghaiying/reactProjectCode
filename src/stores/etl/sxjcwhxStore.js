/* eslint-disable comma-dangle */
/**
 * 不建议将REST API请求的函数放在stores里面，因为这样以来这些请求代码很难测试。你可以尝试把这些请求函数放在一个类里面，
 * 把这个类的代码和store放在一起，在store创建时，这个类也相应创建。然后当你测试时，你也可以优雅的把数据从这些类里面mock上去。
 * 业务类提到store中，ui中建议不要放业务操作代码
 * 所有数据变更在store中进行变更，不允许在其它地方进行变更。即界面即使关闭了，再次打开，store中数据相同，界面也应该相同
 */

/**
 * etl请求API
 */
import SxjcwhxService from "../services/etl/SxjcwhxService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
/**
 *etlStore
 */

export default{
  dataSource: [],
  selectedKeys: [],
  inited: false,
  colums: [],
  visible: false,
  opt: "add",
  editFieldValues: {},
  uploadName: "",
  url: "http://localhost:8810/sxjcwhx",
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  onTableRowChange(selectedRowKeys, records) {
    this.selectedKeys = selectedRowKeys;
    this.selectedRecords = records;
    console.log(records);
    console.log(this.selectedRecords);
  },
  onChange(...args) {
    console.log(...args);
  },
  /**
   * 刷新、查询数据
   */
  async didMount() {
    // await查询，await查询简化了then的方式，更符合编码习惯
    this.colums = [
      {
        title: "类型",
        dataIndex: "sxjcwhxlx",
        width: 100,
        lock: true
      },
      {
        title: "名称",
        dataIndex: "sxjcwhxname",
        width: 200
      },
      {
        title: "数值",
        dataIndex: "sxjcwhxjcsz",
        width: 200
      }
    ];
    this.dataSource = await SxjcwhxService.findAll();

    // EtlService.queryForPage({}, 1, 5).then(data => {
    //   this.dataSource = data;
    // });
  },
  /**
   * 删除操作
   * @param {*} id
   */
  async remove(id) {
    const data = await SxjcwhxService.delete(id);
    if (data) {
      Message.success("删除成功");
      this.dataSource = await SxjcwhxService.findAll();
    }
  },
  onAddAction() {
    this.visible = true;
    this.opt = "add";
  },
  setVisible(visible) {
    // console.log("doVisible");
    this.visible = visible;
  },
  async onSaveDataAction(data) {
    const { whsj } = data;
    if (isMoment(whsj)) {
      data.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
    } else {
      //data.whsj=moment();
    }
    if (this.opt === "edit") {
      try {
        await SxjcwhxService.updatesome(data.id, data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    
    } else {
      try {
        await SxjcwhxService.add(data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    }
    this.dataSource = await SxjcwhxService.findAll();
    Message.success("修改成功");
    this.visible = false;
  },
  async onEditAction(record) {
    // eslint-disable-next-line quotes
    this.visible = true;
    this.opt = "edit";
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });

    json.whsj = moment();
    this.editFieldValues = json;
  },

};
