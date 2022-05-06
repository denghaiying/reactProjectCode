/* eslint-disable comma-dangle */
/**
 * etl任务
 */
import ArchiveTaskService from "../../services/etl/ArchiveTaskService";
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
  uploadNames: [],
  url: "http://localhost:8810/archivetask",
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
  async onUploadSuccess(file, arr) {
    this.uploadNames.push(file.name);
    
    console.log("onSuccess callback : ", file, arr);
  },

  async onUploadError(file) {
    console.log("onError callback : ", file);
  },
  async onUploadRemove(file) {
    const filename=file.name;
    this.uploadNames.splice(this.uploadNames.findIndex(item => item === filename), 1);
    console.log("onError callback : ", this.uploadNames);
    await ArchiveTaskService.removeFile(file)
  },
  /**
   * 刷新、查询数据
   */
  async didMount() {
    // await查询，await查询简化了then的方式，更符合编码习惯
    this.colums = [
      {
        title: "编号",
        dataIndex: "archivetaskCode",
        width: 100,
        lock: true
      },
      {
        title: "名称",
        dataIndex: "archivetaskName",
        width: 200
      },
      {
        title: "文件",
        dataIndex: "archivetaskFile",
        width: 200
      },
      {
        title: "运行周期",
        dataIndex: "archivetaskCron",
        width: 200
      }
    ];
    this.dataSource = await ArchiveTaskService.findAll();

    // EtlService.queryForPage({}, 1, 5).then(data => {
    //   this.dataSource = data;
    // });
  },
  /**
   * 删除操作
   * @param {*} id
   */
  async remove(id, file) {
    const data = await ArchiveTaskService.delete(id, file);
    if (data) {
      Message.success("删除成功");
      this.dataSource = await ArchiveTaskService.findAll();
    }
  },
  async runTask(id,cron) {
    try {
      await ArchiveTaskService.runTask(id,cron);
      Message.success("任务正已经在后台运行");
    } catch (e) {
      Message.error(e);
    }
  },
  async stopTask(id) {
    try {
      await ArchiveTaskService.stopTask(id);
      Message.success("任务已经停止运行");
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
    if (this.uploadNames.length==0 && this.opt=="add") {
      Message.warning("请选择文件");
      return;
    }
    data.archivetaskFile = this.uploadNames.join(",");
    const { whsj } = data;
    if (isMoment(whsj)) {
      data.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
    } else {
      //data.whsj=moment();
    }
    if (this.opt === "edit") {
      try {
        await ArchiveTaskService.updatesome(data.id, data);
      } catch (e) {
        Message.error(e.message);
        return;
      }

    } else {
      try {
        await ArchiveTaskService.add(data);
      } catch (e) {
        Message.error(e.message);
        return;
      }
    }
    this.dataSource = await ArchiveTaskService.findAll();
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
