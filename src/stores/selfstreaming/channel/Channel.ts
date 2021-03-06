import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '@/utils/fetch';
import SysStore from "@/stores/system/SysStore";
import ChannelService from '@/services/selfstreaming/channel/ChannelService';
import diagest from '@/utils/diagest';

class Channel {


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
  //  @observable columns = [];
    @observable signcomment = "";
    @observable procOpt = {};
    @observable dataSource=[];

    @observable paramValue = "";



    openNotification = (a, type) => {
        Notification.open({ title: a, type });
      };

      setSigncomment = (comment) => {
        this.signcomment = comment;
      };

      // setColumns = (columns) => {
      //   this.columns = columns;
      // };

      // setPageNo = async (pageno) => {
      //   this.pageno = pageno;
      //   await this.queryForPage();
      // };

      // setPageSize = async (pageSize) => {
      //   this.pagesize = pageSize;
      //   await this.queryForPage();
      // };

      // setParams = async (params, nosearch) => {
      //   this.params = { ...params };
      //   if (!nosearch) {
      //     await this.queryForPage();
      //   }
      // };

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
        if (this.wfenable) {
          this.getProcOpt(this.editRecord);
        }
      };

      beforeSetEditRecord(value) {
        return value;
      }

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

      @observable colums =[
        {
          title: 'e9.channel.channel.channelbh',
          dataIndex: 'channelbh',
          width: 90,
        },
        {
          title:  'e9.channel.channel.channelname',
          dataIndex: 'channelname',
          width: 120,
        },
         {
          title:  'e9.channel.channel.channelzslx',
          dataIndex: 'channelzslx',
          width: 120,
        },
        {
          title:  'e9.channel.channel.channeltype',
          dataIndex: 'channeltype',
          width: 80,
          
        },
        {
          title:  'e9.pub.whr',
          dataIndex: 'channelwhr',
          width: 90,
        }, 
        {
          title:  'e9.pub.whsj',
          dataIndex: 'channelwhsj',
          width: 90
        },
      ];
     //@observable typeData = [{value: 'Content', label: '????????????'},{value: 'Photo', label: '??????'},{value: 'Video', label: '??????'},{value: 'jmlx', label: '????????????'},{value: 'dwxc', label: '????????????'},{value: 'lyll', label: '????????????'},{value: 'dlcx', label: '????????????'}];
        @observable typeData =[];
        @observable sylmData = [{value: 'tzgg', label: '????????????'},{value: 'flgf', label: '????????????'},{value: 'jgda', label: '????????????'},{value: 'xwdt', label: '????????????'},{value: 'dwxc', label: '????????????'},{value: 'tpda', label: '????????????'},{value: 'ztda', label: '????????????'}
        ,{value: 'gzzd', label: '????????????'},{value: 'jjfa', label: '????????????'},{value: 'cgal', label: '????????????'},{value: 'yqlj', label: '????????????'},{value: 'banner', label: '??????Banner'}];
        @observable channelList= [];
        @observable zslxData = [{value: 'mlfl', label: '??????????????????'},{value: 'mllb', label: '??????????????????'},{value: 'mlnr', label: '??????????????????'},{value: 'tpfl', label: '??????????????????'},{value: 'tplb', label: '??????????????????'},{value: 'tpnr', label: '??????????????????'},{value: 'spfl', label: '??????????????????'}
        ,{value: 'splb', label: '??????????????????'},{value: 'spnr', label: '??????????????????'}];
        @observable listdata =[];
    
        @action setParams = async (params, nosearch) => {
        this.params = params;
        if (!nosearch) {
            await this.queryData();
        }
        }
  


        @action queryData  = async () => {
            this.loading = true;
            try {
               var xdataS = await ChannelService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=[];
              this.listdata=[];
              if(xdataS.list.length>0){
                var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                  var a=xdata[i];
                 if(a.channeltype!=""){
                    for(var j=0;j<this.typeData.length;j++){
                      var b=this.typeData[j];
                      if(a.channeltype==b.channeltypebh){
                       a.channeltype=b.channeltypename;
                      }
                    }
                 }
                  if(a.channelzslx!=""){
                      for(var j=0;j<this.zslxData.length;j++){
                        var b=this.zslxData[j];
                        if(a.channelzslx==b.value){
                        a.channelzslx=b.label;
                        }
                      }
                    }
                    
                    this.listdata.push(a);
                  }
                  xdataS.list=this.listdata;
                }
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
               var xdataS = await ChannelService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=[];
              this.listdata=[];
              if(xdataS.list.length>0){
                var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                  var a=xdata[i];
                 if(a.channeltype!=""){
                    for(var j=0;j<this.typeData.length;j++){
                      var b=this.typeData[j];
                      if(a.channeltype==b.channeltypebh){
                       a.channeltype=b.channeltypename;
                      }
                    }
                 }
                  if(a.channelzslx!=""){
                      for(var j=0;j<this.zslxData.length;j++){
                        var b=this.zslxData[j];
                        if(a.channelzslx==b.value){
                        a.channelzslx=b.label;
                        }
                      }
                    }
                    
                    this.listdata.push(a);
                  }
                  xdataS.list=this.listdata;
                }
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
               var xdataS = await ChannelService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=[];
              this.listdata=[];
              if(xdataS.list.length>0){
                var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                  var a=xdata[i];
                 if(a.channeltype!=""){
                    for(var j=0;j<this.typeData.length;j++){
                      var b=this.typeData[j];
                      if(a.channeltype==b.channeltypebh){
                       a.channeltype=b.channeltypename;
                      }
                    }
                 }
                  if(a.channelzslx!=""){
                      for(var j=0;j<this.zslxData.length;j++){
                        var b=this.zslxData[j];
                        if(a.channelzslx==b.value){
                        a.channelzslx=b.label;
                        }
                      }
                    }
                    
                    this.listdata.push(a);
                  }
                  xdataS.list=this.listdata;
                }
              this.data=xdataS;
              this.loading = false;
            } catch (err) {
              this.loading = false;
              throw err;
            }
          }
        
          @action findchannelAll = async () => {
            const response = await fetch
              .post('/streamingapi/channel/findList', { params: {} });
            if (response && response.status === 200) {
              runInAction(() => {
                this.channelList = response.data;
              });
            }
          }
        
          @action findchanneltypeAll = async () => {
            const response = await fetch
              .post('/streamingapi/channeltype/findList', { params: {} });
            if (response && response.status === 200) {
              runInAction(() => {
                this.typeData = response.data;
              });
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
        
        
        
           /**
           * ????????????
           */
          @action delete = async (id) => {
            try {
            // this.deletevisible = false;
              await ChannelService.delete(id);
              this.editVisible = false;
              this.loading = true;
              var xdataS = await ChannelService.findForPage(this.params, this.pageno, this.pagesize);
              this.data=[];
              this.listdata=[];
              if(xdataS.list.length>0){
                var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                  var a=xdata[i];
                 if(a.channeltype!=""){
                    for(var j=0;j<this.typeData.length;j++){
                      var b=this.typeData[j];
                      if(a.channeltype==b.channeltypebh){
                       a.channeltype=b.channeltypename;
                      }
                    }
                 }
                  if(a.channelzslx!=""){
                      for(var j=0;j<this.zslxData.length;j++){
                        var b=this.zslxData[j];
                        if(a.channelzslx==b.value){
                        a.channelzslx=b.label;
                        }
                      }
                    }
                    
                    this.listdata.push(a);
                  }
                  xdataS.list=this.listdata;
                }
              this.data=xdataS;
              this.loading = false;
            } catch (err) {
              this.loading = false;
              throw err;
            }
          }
        
        }
        
export default new Channel('/api/streamingapi/channel');
