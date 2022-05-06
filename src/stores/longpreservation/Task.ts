import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '@/utils/fetch';
import SysStore from "@/stores/system/SysStore";
import TaskService from '../../services/longpreservation/TaskService';
import diagest from '@/utils/diagest';
const dwurl="/api/api/arch/dw";
const dakurl="/api/api/arch/dak";
class Task {
    url = "";
    wfenable = false;
    oldver = true;
    constructor(url, wfenable, oldver = true) {
      this.url = url;
      this.wfenable = wfenable;
      this.oldver = oldver;
      makeAutoObservable(this)
    }
    @observable data = [];
    @observable record = {};
    @observable params = {};
    @observable loading = false;
    @observable pageno = 1;
    @observable pagesize = 20;
    @observable opt = "view";
    @observable editVisible = false;
    @observable editRecord = {};
    @observable selectRowKeys = [];
    @observable selectRowRecords = [];
    @observable columns = [];
    @observable signcomment = "";
    @observable procOpt = {};
    @observable dataSource=[];

    @observable paramValue = "";
    @observable passwordValues = {};
    @observable pswModalVisible = false;
    @observable rsModalVisible = false;
    @observable dakDataSource = [];
    @observable dwDataSource = [];
    @observable dakValue = '';
    @observable typeData =[];
    @observable listdata =[];

    beforeSetEditRecord (value) {
      value.uenable = value.TaskEnable === 1;
      return value;
    }

    beforeSaveData (values) {
      const d = values;
      d.TaskEnable = d.uenable ? 1 : 0;
      return values;
    }
    setColumns = (columns) => {
      this.columns = columns;
    };

    setSigncomment = (comment) => {
      this.signcomment = comment;
    };

    setDataSource = (dataSource) => {
      this.dataSource = dataSource;
    };

    setSelectRows = async (selectRowKeys, selectRowRecords) => {
      this.selectRowKeys = selectRowKeys;
      this.selectRowRecords = selectRowRecords;
    };

    closeEditForm = () => {
      this.editVisible = false;
    };
    showEditForm = (opt, editRecord) => {
      this.opt = opt;
      this.editVisible = true;
      this.editRecord = this.beforeSetEditRecord(editRecord);
    };

    @action queryDw = async () => {
      this.loading = true;
      const response = await fetch
        .post(dwurl);
      if (response && response.status === 200) {
        this.dwDataSource=response.data.map(o=>({'label':o.dwmc,'value':o.dwid}));
      } else {
        this.loading = true;
      }
    }

    @action dwChange = async (dwid) => {
      const response=await fetch.post(dakurl+"/"+dwid,{})
      this.editRecord.taskDakid='';
      if (response && response.status === 200) {
        this.dakDataSource=response.data.map(o=>({'label':o.mc,'value':o.id}));
      }

    }

    @action dakChange = async (value) => {
        this.editRecord.taskDakid=value;
    }

    @action start = async (value) => {
      this.loading=true;
      TaskService.runTask()
      this.loading=false;
    }

    @action stop = async () => {
      this.editRecord.taskDakid=value;
    }
    @action rule = async () => {
       return await TaskService.rule(this.selectRowRecords[0]);
    }
    @action reset = async (value) => {
      return await  TaskService.reset(value);
      this.loading=false;
    }
    @action setParams = async (params, nosearch) => {
      this.params = params;
      if (!nosearch) {
          await this.queryData();
      }
    }
    @action queryData  = async () => {
      this.loading = true;
      try {
              var xdataS = await TaskService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=xdataS;
              this.loading = false;
        } catch (err) {
              this.loading = true;
              throw err;
      }
    }
    @action setPageNo = async (pageno) => {
             this.pageno = pageno;
             this.loading = true;
            try {
               var xdataS = await TaskService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=[];
              this.data=xdataS;
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
                var xdataS = await TaskService.findForPage(this.params, this.pageno, this.pagesize);
                this.data=[];
                this.listdata=[];
                this.data=xdataS;
                this.loading = false;
              } catch (err) {
                this.loading = false;
                throw err;
              }
    }
    @action saveData = async (values) => {
            //   values = this.beforeSaveData(values);
              let response;
              if (this.opt === 'edit') {
                response = await fetch
                  .put(`${this.url}/${encodeURIComponent(this.editRecord.channelid)}`, values);
                this.queryData();
              } else {
                response = await fetch.post(this.url, values);
              }
              if (response && response.status === 201) {
                this.editVisible = false;
                this.queryData();
              }
    }
    @action delete = async (id) => {
            try {
            // this.deletevisible = false;
              await TaskService.delete(id);
              this.editVisible = false;
              this.loading = true;
              var xdataS = await TaskService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=[];
              this.listdata=[];
              this.data=xdataS;
              this.loading = false;
            } catch (err) {
              this.loading = false;
              throw err;
            }
    }

  }

export default new Task('/api/task');
