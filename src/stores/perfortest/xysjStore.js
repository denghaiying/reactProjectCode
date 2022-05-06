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
  import { observable, action, makeObservable } from 'mobx';
  import XysjService from "../../services/perfortest/XysjService";
  import XysjlxService from "../../services/perfortest/XysjlxService";
  import XysjsxService from "../../services/perfortest/XysjsxService";
  import moment, { isMoment } from "moment";
  import { Message } from "@alifd/next";
  /**
   *etlStore
  */

  class xysjStore {
    @observable dataSource = [];
    @observable record = {};
    @observable params = {};
    @observable loading = false;
    @observable pageno = 1;
    @observable pagesize = 10;
    @observable opt = 'view';
    @observable delvisible = false;
    @observable modalVisible = false;
    @observable editRecord = {};
    @observable selectRowKeys = [];
    @observable selectRowRecords = [];
    @observable listdata = [];
    @observable deleteid = "";
    @observable colums = [{
      title: 'e9.perfortest.xysj.xysjzdmc',
      dataIndex: 'xysjzdmc',
      width: 150
    },
    {
      title: 'e9.perfortest.xysj.xysjzdms',
      dataIndex: 'xysjzdms',
      width: 200
    },
    {
      title: 'e9.perfortest.xysj.xysjzdywms',
      dataIndex: 'xysjzdywms',
      width: 200
    },
    {
      title: 'e9.perfortest.xysj.xysjzdcd',
      dataIndex: 'xysjzdcd',
      width: 200
    },
    {
      title: 'e9.perfortest.xysj.xysjzdsx',
      dataIndex: 'xysjzdsx',
      width: 200
    },
    {
      title: 'e9.perfortest.xysj.xysjzdlx',
      dataIndex: 'xysjzdlx',
      width: 200
    },
    {
      title:'e9.perfortest.xysj.xysjpx',
      dataIndex: 'xysjpx',
      width: 200
    }];
    @observable whsjValue = "";
    @observable editFieldValues = {};
    @observable xysjsxData = [];
    @observable xysjlxData = [];

  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }

    @action setParams = async (params, nosearch) => {
      this.params = params;
      if (!nosearch) {
        await this.queryData();
      }
    }

    @action setPageNo = async (pageno) => {
      this.pageno = pageno;
      this.loading = true;
      try {
        var lxdata = await XysjlxService.findAll();
        var sxdata = await XysjsxService.findAll();
        const xdataS = await XysjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource = [];
        this.listdata = [];
        if (xdataS.list.length > 0) {
          var xdata = xdataS.list;
          for (var i = 0; i < xdata.length; i++) {
            var a = xdata[i];
            if (a.xysjzdsx != "") {
              for (var j = 0; j < sxdata.length; j++) {
                var b = sxdata[j];
                if (a.xysjzdsx == b.id) {
                  a.xysjzdsx = b.xysjsxmc
                }
              }
            }
            if (a.xysjzdlx != "") {
              for (var j = 0; j < lxdata.length; j++) {
                var b = lxdata[j];
                if (a.xysjzdlx == b.id) {
                  a.xysjzdlx = b.xysjlxmc
                }
              }
            }
            this.listdata.push(a);
          }
          xdataS.list = this.listdata;
        }
        this.dataSource = xdataS;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }

    @action setPageSize = async (pageSize) => {
      this.pagesize = pageSize;
      this.loading = true;
      try {
        var lxdata = await XysjlxService.findAll();
        var sxdata = await XysjsxService.findAll();
        const xdataS = await XysjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource = [];
        this.listdata = [];
        if (xdataS.list.length > 0) {
          var xdata = xdataS.list;
          for (var i = 0; i < xdata.length; i++) {
            var a = xdata[i];
            if (a.xysjzdsx != "") {
              for (var j = 0; j < sxdata.length; j++) {
                var b = sxdata[j];
                if (a.xysjzdsx == b.id) {
                  a.xysjzdsx = b.xysjsxmc
                }
              }
            }
            if (a.xysjzdlx != "") {
              for (var j = 0; j < lxdata.length; j++) {
                var b = lxdata[j];
                if (a.xysjzdlx == b.id) {
                  a.xysjzdlx = b.xysjlxmc
                }
              }
            }
            this.listdata.push(a);
          }
          xdataS.list = this.listdata;
        }
        this.dataSource = xdataS;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }

    @action showEditForm = (opt, editRecord) => {
      this.opt = opt;
      this.modalVisible = true;
      this.editRecord = editRecord;
    }

    @action showDelete = (editRecord) => {
      this.delvisible = true;
      this.deleteid = editRecord;
    }

    @action closeDeleteForm = () => {
      this.delvisible = false;
    }

    @action closeEditForm = () => {
      this.modalVisible = false;
    }

    @action resetEditRecord = (value) => {
      this.editRecord = value;
    }


    @action queryData = async () => {
      this.loading = true;
      try {
        
        var lxdata = await XysjlxService.findAll();
        var sxdata = await XysjsxService.findAll();
        this.xysjlxData = [];
        var xlxistdata = [];
        var data = await XysjlxService.findAll();
        for (var i = 0; i < data.length; i++) {
          const a = {};
          a.label = data[i].xysjlxmc;
          a.value = data[i].id;
          xlxistdata.push(a);
        }
        this.xysjlxData = xlxistdata;

        this.xysjsxData = [];
        var xsxdata = [];
        var data = await XysjsxService.findAll();
        for (var i = 0; i < data.length; i++) {
          const a = {};
          a.label = data[i].xysjsxmc;
          a.value = data[i].id;
          xsxdata.push(a);
        }
        this.xysjsxData = xsxdata;
        const xdataS = await XysjService.findForPage(this.params, this.pageno, this.pagesize);
          this.listdata = [];
          if (xdataS.list.length > 0) {
            var xdata = xdataS.list;
            for (var i = 0; i < xdata.length; i++) {
              var a = xdata[i];
              if (a.xysjzdsx != "") {
                for (var j = 0; j < sxdata.length; j++) {
                  var b = sxdata[j];
                  if (a.xysjzdsx == b.id) {
                    a.xysjzdsx = b.xysjsxmc
                  }
                }
              }
              if (a.xysjzdlx != "") {
                for (var j = 0; j < lxdata.length; j++) {
                  var b = lxdata[j];
                  if (a.xysjzdlx == b.id) {
                    a.xysjzdlx = b.xysjlxmc
                  }
                }
              }
              this.listdata.push(a);
            }
            xdataS.list = this.listdata;
          }
          this.dataSource = xdataS;
          this.loading = false;
      } catch (err) {
        this.loading = true;
        throw err;
      }
    }

    @action delete = async (id) => {
      try {
        await XysjService.delete(id);
        this.modalVisible = false;
        this.delvisible = false;
        this.loading = true;
        var lxdata = await XysjlxService.findAll();
        var sxdata = await XysjsxService.findAll();
        var xdataS = await XysjService.findForPage(this.params, this.pageNo, this.pageSize);
          this.dataSource = [];
          this.listdata = [];
          if (xdataS.list.length > 0) {
            var xdata = xdataS.list;
            for (var i = 0; i < xdata.length; i++) {
              var a = xdata[i];
              if (a.xysjzdsx != "") {
                for (var j = 0; j < sxdata.length; j++) {
                  var b = sxdata[j];
                  if (a.xysjzdsx == b.id) {
                    a.xysjzdsx = b.xysjsxmc
                  }
                }
              }
              if (a.xysjzdlx != "") {
                for (var j = 0; j < lxdata.length; j++) {
                  var b = lxdata[j];
                  if (a.xysjzdlx == b.id) {
                    a.xysjzdlx = b.xysjlxmc
                  }
                }
              }
              this.listdata.push(a);
            }
            xdataS.list = this.listdata;
          }
          this.dataSource = xdataS;
          this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }

    @action setSelectRows = (selectRowKeys, selectRowRecords) => {
      this.selectRowKeys = selectRowKeys;
      this.selectRowRecords = selectRowRecords;
    }

    @action saveData = async (values) => {
      try {
        if (this.opt === 'edit') {
          await XysjService.updatesome(this.editRecord.id, values);
        } else {
          await XysjService.add(values);
        }
        this.modalVisible = false;
        this.loading = true;
        var lxdata = await XysjlxService.findAll();
        var sxdata = await XysjsxService.findAll();
        var xdataS = await XysjService.findForPage(this.params, this.pageNo, this.pageSize);
          this.dataSource = [];
          this.listdata = [];
          if (xdataS.list.length > 0) {
            var xdata = xdataS.list;
            for (var i = 0; i < xdata.length; i++) {
              var a = xdata[i];
              if (a.xysjzdsx != "") {
                for (var j = 0; j < sxdata.length; j++) {
                  var b = sxdata[j];
                  if (a.xysjzdsx == b.id) {
                    a.xysjzdsx = b.xysjsxmc
                  }
                }
              }
              if (a.xysjzdlx != "") {
                for (var j = 0; j < lxdata.length; j++) {
                  var b = lxdata[j];
                  if (a.xysjzdlx == b.id) {
                    a.xysjzdlx = b.xysjlxmc
                  }
                }
              }
              this.listdata.push(a);
            }
            xdataS.list = this.listdata;
          }
          this.dataSource = xdataS;
          this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }
  }

  export default new xysjStore();
