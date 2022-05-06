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
     //@observable typeData = [{value: 'Content', label: '普通文章'},{value: 'Photo', label: '图片'},{value: 'Video', label: '视频'},{value: 'jmlx', label: '警民联系'},{value: 'dwxc', label: '对外宣传'},{value: 'lyll', label: '旅游浏览'},{value: 'dlcx', label: '道路查询'}];
        @observable typeData =[];
        @observable sylmData = [{value: 'tzgg', label: '通知公告'},{value: 'flgf', label: '法律规范'},{value: 'jgda', label: '局馆档案'},{value: 'xwdt', label: '新闻动态'},{value: 'dwxc', label: '视频档案'},{value: 'tpda', label: '图片档案'},{value: 'ztda', label: '专题档案'}
        ,{value: 'gzzd', label: '规章制度'},{value: 'jjfa', label: '解决方案'},{value: 'cgal', label: '成功案例'},{value: 'yqlj', label: '友情链接'},{value: 'banner', label: '首页Banner'}];
        @observable channelList= [];
        @observable zslxData = [{value: 'mlfl', label: '目录分类展示'},{value: 'mllb', label: '目录列表展示'},{value: 'mlnr', label: '目录内容展示'},{value: 'tpfl', label: '图片分类展示'},{value: 'tplb', label: '图片列表展示'},{value: 'tpnr', label: '图片内容展示'},{value: 'spfl', label: '视频分类展示'}
        ,{value: 'splb', label: '视频列表展示'},{value: 'spnr', label: '视频内容展示'}];
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
           * 删除操作
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
