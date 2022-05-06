import GdxmService from "../../services/ksh/GdxmService";
import gmapService from "../../services/ksh/GmapService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable } from 'mobx';
/**
 *kshStore
 */

 class GdxmStore {
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
        title: 'e9.ksh.gdxm.gdxmbh',
        dataIndex: "gdxmbh",
        width: 180,
      },
      {
        title: 'e9.ksh.gdxm.gdxmmc',
        dataIndex: "gdxmmc",
        width: 180
      },
      {
        title: 'e9.ksh.gdxm.gdxmlx',
        dataIndex: "gdxmlx",
        width: 180
      },
      {
         title: 'e9.ksh.gdxm.gdxmjlr',
        dataIndex: "gdxmjlr",
        width: 180
      },
      {
        title: 'e9.ksh.gdxm.gdxmdw',
        dataIndex: "gdxmdw",
        width: 200
      },
      {
         title: 'e9.ksh.gdxm.gdxmjs',
        dataIndex: "gdxmjs",
        width: 300
      },
      {
        title: 'e9.ksh.gdxm.gdxmgmapid',
        dataIndex: "gdxmgmapid",
        width: 180
      }];
  @observable editFieldValues = {};
  @observable mapData=[];

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
      var zsdata = await gmapService.findList({});
      var setmapData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const mapda={};
            mapda.label=b.gmapmc;
            mapda.value=b.id;
          setmapData.push(mapda);
        }
      this.mapData=setmapData;
      var xdataS = await GdxmService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.gdxmgmapid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gdxmgmapid==b.id){
                      a.gdxmgmapid=b.gmapmc;
                    }
                }
            }
            
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
        }
      this.dataSource=xdataS
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
      var zsdata = await gmapService.findList({});
      var setmapData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const mapda={};
            mapda.label=b.gmapmc;
            mapda.value=b.id;
          setmapData.push(mapda);
        }
      this.mapData=setmapData;
      var xdataS = await GdxmService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.gdxmgmapid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gdxmgmapid==b.id){
                      a.gdxmgmapid=b.gmapmc;
                    }
                }
            }
            
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
        }
      this.dataSource=xdataS
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
    if(this.editRecord.gdxmgmapid!="null"){
         for(var j=0;j<this.mapData.length;j++){
              var b=this.mapData[j];
              if(this.editRecord.gdxmgmapid==b.label){
                this.editRecord.gdxmgmapid=b.value
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
      var zsdata = await gmapService.findList({});
      var setmapData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const mapda={};
            mapda.label=b.gmapmc;
            mapda.value=b.id;
          setmapData.push(mapda);
        }
      this.mapData=setmapData;
      var xdataS = await GdxmService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.gdxmgmapid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gdxmgmapid==b.id){
                      a.gdxmgmapid=b.gmapmc;
                    }
                }
            }
            
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
        }
      this.dataSource=xdataS
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
      await GdxmService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var zsdata = await gmapService.findList({});
      var setmapData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const mapda={};
            mapda.label=b.gmapmc;
            mapda.value=b.id;
          setmapData.push(mapda);
        }
      this.mapData=setmapData;
       var xdataS = await GdxmService.findForPage(this.params, this.pageno, this.pagesize);
       this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.gdxmgmapid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gdxmgmapid==b.id){
                      a.gdxmgmapid=b.gmapmc;
                    }
                }
            }
            
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
        }
      this.dataSource=xdataS
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
         await GdxmService.updatesome(this.editRecord.id, values);
      } else {
        await GdxmService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var zsdata = await gmapService.findList({});
      var setmapData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const mapda={};
            mapda.label=b.gmapmc;
            mapda.value=b.id;
          setmapData.push(mapda);
        }
      this.mapData=setmapData;
       var xdataS = await GdxmService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.gdxmgmapid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gdxmgmapid==b.id){
                      a.gdxmgmapid=b.gmapmc;
                    }
                }
            }
            
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
        }
      this.dataSource=xdataS
        this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }
}

export default new GdxmStore();