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
import ArchiveTableService from "../../services/etl/ArchiveTableService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import {ajaxUrl} from "../../utils/fetch";
/**
 *etlStore
 */

export default {
  dataSource: [],
  selectedKeys: [],
  inited: false,
  colums: [],
  visible: false,
  opt: "add",
  ownerRecord: {},
  editFieldValues: {},
  queryKey: {},
  dataSourceMetadata:[],
  url: "http://localhost:8810/archivecolumn",
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  onTableRowChange(selectedRowKeys, records) {
    this.selectedKeys = selectedRowKeys;
    this.selectedRecords = records;
  },
  onChange(...args) {
    console.log(...args);
  },
  async onUploadSuccess(res, file) {
    this.uploadName = res.name;
    console.log("onSuccess callback : ", res, file);
  },

  async onUploadError(file) {
    console.log("onError callback : ", file);
  },

  /**
   * 刷新、查询数据
   */
  async didMount(ownerSelectedRecords) {
    if (ownerSelectedRecords && ownerSelectedRecords[0]) {
      this.ownerRecord = ownerSelectedRecords[0];
    }
    this.colums = [
      {
        title: "编号",
        dataIndex: "archivecolumnCode",
        width: 100,
        lock: true
      },
      {
        title: "名称",
        dataIndex: "archivecolumnName",
        width: 200
      },
      {
        title: "类型",
        dataIndex: "archivecolumnType",
        width: 200
      },
      {
        title: "长度",
        dataIndex: "archivecolumnLength",
        width: 200
      }
    ];
    if (this.ownerRecord && this.ownerRecord.id) {
      this.queryKey = { pid: this.ownerRecord.id };
    }
    this.dataSource = await ArchiveTableService.findAll(this.queryKey);
    this.dataSourceMetadata  = await ArchiveTableService.findMetadata();

    // EtlService.queryForPage({}, 1, 5).then(data => {
    //   this.dataSource = data;
    // });
  },
  /**
   * 删除操作
   * @param {*} id
   */
  async remove(id) {
    const data = await ArchiveTableService.delete(id);
    if (data) {
      Message.success("删除成功");
      this.dataSource = await ArchiveTableService.findAll(this.queryKey);
    }
  },
  async runTask(id) {
    try {
      await ArchiveTableService.runTask(id);
      Message.success("任务正已经在后台运行");
    } catch (e) {
      Message.error(e);
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
    data.archiveinfoId = this.ownerRecord.id;
    data.archiveinfoCode = this.ownerRecord.archiveinfoCode;

    if (this.opt === "edit") {
      try {
        await ArchiveTableService.updatesome(data.id, data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    } else {
      try {
        await ArchiveTableService.add(data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    }
    this.dataSource = await ArchiveTableService.findAll(this.queryKey);
    //todo 国际化
    Message.success("修改成功");
    this.visible = false;
  },
  async doCreateTemplateString() {
    
    window.open(ajaxUrl+"example/"+this.ownerRecord.archiveinfoType+"/"+this.ownerRecord.id)
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
  }
};
