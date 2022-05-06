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
import EtlService from "../../services/etl/EtlService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
/**
 *etlStore
 */

export default {
  dataSource: [],
  selectedKeys: [],
  selectedRecords: [],
  inited: false,
  colums: [],
  visible: false,
  archiveTypeList: [],
  opt: "add",
  editFieldValues: {},
  url: "http://localhost:8810/archiveinfo",
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  onTableRowChange(selectedRowKeys, records) {
    this.selectedKeys = selectedRowKeys;
    this.selectedRecords = records;
    console.log("etlstore");
    console.log(this.selectedRecords);
  },
    onTabSelect(selectedRowKeys) {
    
    this.selectedKeys = selectedRowKeys;
    this.selectedRecords =selectedRowKeys;
    this.queryKey = { jclx: selectedRowKeys};
    console.log(this.queryKey);
  },
  onChange(...args) {
    console.log(...args);
  },
  /**
   * 刷新、查询数据
   */
  async didMount() {
    this.colums = [
      {
        title: "编号",
        dataIndex: "archiveinfoCode",
        width: 200,
        lock: true
      },
      {
        title: "名称",
        dataIndex: "archiveinfoName",
        width: 250
      },
      {
        title: "存储路径",
        dataIndex: "archiveinfoPath",
        width: 250
      },
      {
        title: "类型",
        dataIndex: "archiveinfoType",
        width: 100
      },
  
    ];
    this.archiveTypeList = await EtlService.findArchiveInfoType();
    this.dataSource = await EtlService.findAll();

    // EtlService.queryForPage({}, 1, 5).then(data => {
    //   this.dataSource = data;
    // });
  },setCellProps(rowIndex, colIndex, dataIndex, record){
    if (rowIndex === 0 && colIndex === 0) {
      console.log(record);
      return "1234";
    }
  },

  /**
   * 删除操作
   * @param {*} id
   */
  async remove(id) {
    const data = await EtlService.delete(id);
    if (data) {
      Message.success("删除成功");
      this.dataSource = await EtlService.findAll();
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
        await EtlService.updatesome(data.id, data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    } else {
      try {
        await EtlService.add(data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    }
    this.dataSource = await EtlService.findAll();
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

  async save(data) {
    const { userQyrq, userTyrq, whsj } = data;
    if (isMoment(userQyrq)) {
      data.userQyrq = userQyrq.format("YYYY-MM-DD");
    }
    if (isMoment(userTyrq)) {
      data.userTyrq = userTyrq.format("YYYY-MM-DD");
    }
    if (isMoment(whsj)) {
      data.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
    }
    if (this.opt === "edit") {
      EtlService.update(data.id, data).then(() => {
        this.setState({ visible: false });
        this.queryData();
      });
    } else {
      EtlService.add(data).then(() => {
        this.setState({ visible: false });
        this.queryData();
      });
    }
  }
};
