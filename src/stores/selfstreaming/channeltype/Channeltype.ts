import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '@/utils/fetch';
import SysStore from "@/stores/system/SysStore";
import ChanneltypeService from '@/services/selfstreaming/channeltype/ChanneltypeService';
import diagest from '@/utils/diagest';
class Content {


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
   // @observable columns = [];
    @observable procOpt = {};
    @observable dataSource=[];

    @observable paramValue = "";



    openNotification = (a, type) => {
        Notification.open({ title: a, type });
      };

      setSigncomment = (comment) => {
        this.signcomment = comment;
      };

    //   setColumns = (columns) => {
    //     this.columns = columns;
    //   };

    //   setPageNo = async (pageno) => {
    //     this.pageno = pageno;
    //     await this.queryForPage();
    //   };

    //   setPageSize = async (pageSize) => {
    //     this.pagesize = pageSize;
    //     await this.queryForPage();
    //   };

    //   setParams = async (params, nosearch) => {
    //     this.params = { ...params };
    //     if (!nosearch) {
    //       await this.queryForPage();
    //     }
    //   };

      closeEditForm = () => {
        this.editVisible = false;
      };

      setDataSource = (dataSource) => {
        this.dataSource = dataSource;
      };

      showEditForm = (opt, editRecord) => {
        this.opt = opt;
        this.editVisible = true;
        this.editRecord = this.beforeSetEditRecord(editRecord);
        if (this.wfenable) {
          this.getProcOpt(this.editRecord);
        }
      };

      beforeSetEditRecord(value) {
        return value;
      }

      setSelectRows = async (selectRowKeys, selectRowRecords) => {

        this.selectRowKeys = selectRowKeys;
        this.selectRowRecords = selectRowRecords;
      };

      getProcOpt = async (record) => {
        if (
          record &&
          record.wfid &&
          record.wpid & !this.procOpt[`${record.wfid}-${record.wpid}`]
        ) {
          const res = await fetch.get(
            `/api/eps/workflow/wf/procopt/${record.wfid}/${record.wpid}`
          );
          if (res.status === 200) {
            runInAction( () => {
              this.procOpt[`${record.wfid}-${record.wpid}`] = res.data;
            });
          }
        }
      };

      afterQueryData(data) {
        return data;
      }

      @observable columns =[
        {
          title: 'e9.channeltype.channeltype.channeltypebh',
          dataIndex: 'channeltypebh',
          width: 90,
        },
        {
          title:  'e9.channeltype.channeltype.channeltypename',
          dataIndex: 'channeltypename',
          width: 120,
        },
        {
          title:  'e9.pub.whr',
          dataIndex: 'whr',
          width: 90,
        },
        {
          title:  'e9.pub.whsj',
          dataIndex: 'whsj',
          width: 90
        },
      ];

    @action setParams = async (params, nosearch) => {
      this.params = params;
      if (!nosearch) {
        await this.queryData();
      }
    }


    @action queryData  = async () => {
      this.loading = true;
      try {
        var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
        this.data=[];
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
           var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
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
         var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
        this.data=[];
        this.data=xdataS;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }

    @action saveData = async (values) => {
      try {
        if (this.opt === 'edit') {
           await ChanneltypeService.updatesome(this.editRecord.id, values);
        } else {
          await ChanneltypeService.add(values);
        }
        this.editVisible = false;
        this.loading = true;
        var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
        this.data=[];
        this.data=xdataS;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }

     /**
     * 删除操作
     */
    @action delete = async (id) => {
      try {
      // this.deletevisible = false;
        await ChanneltypeService.delete(id);
        this.editVisible = false;
        this.loading = true;
         var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
        this.data=[];
        this.data=xdataS;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }
}



export default new Content('/api/streamingapi/channeltype');
