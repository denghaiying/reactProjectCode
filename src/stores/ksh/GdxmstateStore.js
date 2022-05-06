/* eslint-disable comma-dangle */
/**
 * 不建议将REST API请求的函数放在stores里面，因为这样以来这些请求代码很难测试。你可以尝试把这些请求函数放在一个类里面，
 * 把这个类的代码和store放在一起，在store创建时，这个类也相应创建。然后当你测试时，你也可以优雅的把数据从这些类里面mock上去。
 * 业务类提到store中，ui中建议不要放业务操作代码
 * 所有数据变更在store中进行变更，不允许在其它地方进行变更。即界面即使关闭了，再次打开，store中数据相同，界面也应该相同
 */

/**
 * ksh请求API
 */
import GdxmstateService from "../../services/ksh/GdxmstateService";
import GdxmService from "../../services/ksh/GdxmService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable } from 'mobx';
/**
 *kshStore
 */


 class GdxmstateStore {
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
  @observable whsjValue ="";
  @observable colums =[
      { 
        title: 'e9.ksh.gdxmstate.gdxmstateListbh',
        dataIndex: "gdxmstateListbh",
        width: 180,
      },
      {
        title: 'e9.ksh.gdxmstate.gdxmstateListmc',
        dataIndex: "gdxmstateListmc",
        width: 180
      },
      {
        title: 'e9.ksh.gdxmstate.gdxmstateListxmid',
        dataIndex: "gdxmstateListxmid",
        width: 180
      },
      {
         title: 'e9.ksh.gdxmstate.gdxmstateListxh',
        dataIndex: "gdxmstateListxh",
        width: 180
      }];
  @observable editFieldValues = {};
  @observable xmData=[];

  
  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }

   @action setPageNo = async (pageno) => {
     this.pageno = pageno;
     this.loading = true;
      try {
        var xmList = await GdxmService.findList({});
        var xlxistdata=[];
        for(var i=0;i<xmList.length;i++){
                const a={};
                a.label=xmList[i].gdxmmc;
                a.value=xmList[i].id;
                xlxistdata.push(a);
        }
      this.xmData=xlxistdata; 
      var xdataS = await GdxmstateService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            for(var j=0;j<xmdata.length;j++){
                var b=xmdata[j];
                if(a.gdxmstateListxmid==b.id){
                  a.gdxmstateListxmid=b.gdxmmc;
                }
              }
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
      }
      this.dataSource=xdataS;
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
     var xmList = await GdxmService.findList({});
        var xlxistdata=[];
        for(var i=0;i<xmList.length;i++){
                const a={};
                a.label=xmList[i].gdxmmc;
                a.value=xmList[i].id;
                xlxistdata.push(a);
        }
      this.xmData=xlxistdata; 
      var xdataS = await GdxmstateService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            for(var j=0;j<xmList.length;j++){
                var b=xmList[j];
                if(a.gdxmstateListxmid==b.id){
                  a.gdxmstateListxmid=b.gdxmmc;
                }
              }
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
      }
      this.dataSource=xdataS;
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
    if(this.editRecord.gdxmstateListxmid!="null"){
         for(var j=0;j<this.xmData.length;j++){
              var b=this.xmData[j];
              if(this.editRecord.gdxmstateListxmid==b.label){
                this.editRecord.gdxmstateListxmid=b.value
            }
        }
    }
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

  @action setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryData();
    }
  }

 @action queryData  = async () =>{
    this.loading = true;
    try {
      var xmList = await GdxmService.findList({});
      var xlxistdata=[];
      for(var i=0;i<xmList.length;i++){
                const a={};
                a.label=xmList[i].gdxmmc;
                a.value=xmList[i].id;
                xlxistdata.push(a);
        }
      this.xmData=xlxistdata; 
      var xdataS = await GdxmstateService.findForPage(this.params, this.pageno, this.pagesize);
          this.dataSource=[];
          this.listdata=[];
          if(xdataS.list.length>0){
            var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                var a=xdata[i];
                for(var j=0;j<xmList.length;j++){
                    var b=xmList[j];
                    if(a.gdxmstateListxmid==b.id){
                      a.gdxmstateListxmid=b.gdxmmc;
                    }
                  }
                this.listdata.push(a);
              }
              xdataS.list=this.listdata;
          }
        this.dataSource=xdataS;
        this.loading = false;
    } catch (err) {
      this.loading = true;
      throw err;
    }
  }
  /**
   * 删除操作
   */
  @action delete = async (id) => {
    try {
      await GdxmstateService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
       var xmList = await GdxmService.findList({});
        var xlxistdata=[];
        for(var i=0;i<xmList.length;i++){
                const a={};
                a.label=xmList[i].gdxmmc;
                a.value=xmList[i].id;
                xlxistdata.push(a);
        }
      this.xmData=xlxistdata; 
      var xdataS = await GdxmstateService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
          this.listdata=[];
          if(xdataS.list.length>0){
            var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                var a=xdata[i];
                for(var j=0;j<xmList.length;j++){
                    var b=xmList[j];
                    if(a.gdxmstateListxmid==b.id){
                      a.gdxmstateListxmid=b.gdxmmc;
                    }
                  }
                this.listdata.push(a);
              }
              xdataS.list=this.listdata;
          }
        this.dataSource=xdataS;
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
         await GdxmstateService.updatesome(this.editRecord.id, values);
      } else {
        await GdxmstateService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
       var xmList = await GdxmService.findList({});
        var xlxistdata=[];
        for(var i=0;i<xmList.length;i++){
                const a={};
                a.label=xmList[i].gdxmmc;
                a.value=xmList[i].id;
                xlxistdata.push(a);
        }
      this.xmData=xlxistdata; 
      var xdataS = await GdxmstateService.findForPage(this.params, this.pageno, this.pagesize);
          this.dataSource=[];
          this.listdata=[];
          if(xdataS.list.length>0){
            var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                var a=xdata[i];
                for(var j=0;j<xmList.length;j++){
                    var b=xmList[j];
                    if(a.gdxmstateListxmid==b.id){
                      a.gdxmstateListxmid=b.gdxmmc;
                    }
                  }
                this.listdata.push(a);
              }
              xdataS.list=this.listdata;
          }
        this.dataSource=xdataS;
        this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
}

export default new GdxmstateStore();