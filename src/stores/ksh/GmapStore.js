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
import gmapService from "../../services/ksh/GmapService";
import ZsmkService from "../../services/ksh/ZsmkService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable } from 'mobx';
/**
 *kshStore
 */

 class GmapStore {
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
        title: 'e9.ksh.gmap.gmapmc',
        dataIndex: "gmapmc",
        width: 180,
      },
      {
        title: 'e9.ksh.gmap.gmapmenuid',
        dataIndex: "gmapmenuid",
        width: 180
      },
      {
        title: 'e9.ksh.gmap.gmapwidth',
        dataIndex: "gmapwidth",
        width: 180
      },
      {
         title: 'e9.ksh.gmap.gmapheight',
        dataIndex: "gmapheight",
        width: 180
      },
      {
        title: 'e9.ksh.gmap.gmappositionX',
        dataIndex: "gmappositionX",
        width: 180
      },
      {
         title: 'e9.ksh.gmap.gmappositionY',
        dataIndex: "gmappositionY",
        width: 180
      },
      {
         title: 'e9.ksh.gmap.gmapzsmkid',
        dataIndex: "gmapzsmkid",
        width: 180
      }];
  @observable editFieldValues = {};
  @observable xsData =[{value: 0, label: '不显示'},{value: 1, label: '显示'}];
  @observable zsmkData=[];

  
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
      var zsdata = await ZsmkService.findList({});
      var setzsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          setzsmkData.push(zsmkda);
        }
      this.zsmkData=setzsmkData;
      var xdataS = await gmapService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
              if(a.gmapmenuid!="null"){
              for(var j=0;j<this.xsData.length;j++){
                    var b=this.xsData[j];
                  if(a.gmapmenuid==b.value){
                      a.gmapmenuid=b.label
                    }
              }
            }
            if(a.gmapzsmkid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gmapzsmkid==b.id){
                      a.gmapzsmkid=b.zsmkmc;
                    }
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
      var zsdata = await ZsmkService.findList({});
      var setzsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          setzsmkData.push(zsmkda);
        }
      this.zsmkData=setzsmkData;
     var xdataS = await gmapService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
           if(a.gmapmenuid!="null"){
              for(var j=0;j<this.xsData.length;j++){
                    var b=this.xsData[j];
                  if(a.gmapmenuid==b.value){
                      a.gmapmenuid=b.label
                    }
              }
            }
            if(a.gmapzsmkid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gmapzsmkid==b.id){
                      a.gmapzsmkid=b.zsmkmc;
                    }
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
    if(this.editRecord.gmapmenuid!="null"){
         for(var j=0;j<this.xsData.length;j++){
              var b=this.xsData[j];
              if(this.editRecord.gmapmenuid==b.label){
                this.editRecord.gmapmenuid=b.value
            }
        }
    }
    if(this.editRecord.gmapzsmkid!="null"){
         for(var j=0;j<this.zsmkData.length;j++){
              var b=this.zsmkData[j];
              if(this.editRecord.gmapzsmkid==b.label){
                this.editRecord.gmapzsmkid=b.value
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
      var zsdata = await ZsmkService.findList({});
      var setzsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          setzsmkData.push(zsmkda);
        }

      this.zsmkData=setzsmkData;
       var xdataS = await gmapService.findForPage(this.params, this.pageno, this.pagesize);
          this.dataSource=[];
          this.listdata=[];
          if(xdataS.list.length>0){
            var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                var a=xdata[i];
                if(a.gmapmenuid!="null"){
                for(var j=0;j<this.xsData.length;j++){
                      var b=this.xsData[j];
                    if(a.gmapmenuid==b.value){
                        a.gmapmenuid=b.label
                      }
                }
              }
              if(a.gmapzsmkid!=""){
                  for(var j=0;j<zsdata.length;j++){
                    var b=zsdata[j];
                     if(a.gmapzsmkid==b.id){
                      a.gmapzsmkid=b.zsmkmc;
                    }
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
      await gmapService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var zsdata = await ZsmkService.findList({});
      var setzsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          setzsmkData.push(zsmkda);
      }
      this.zsmkData=setzsmkData;
      var xdataS = await gmapService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
        if(a.gmapmenuid!="null"){
              for(var j=0;j<this.xsData.length;j++){
                    var b=this.xsData[j];
                  if(a.gmapmenuid==b.value){
                      a.gmapmenuid=b.label
                    }
              }
            }
            if(a.gmapzsmkid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                  if(a.gmapzsmkid==b.id){
                      a.gmapzsmkid=b.zsmkmc;
                    }
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
         await gmapService.updatesome(this.editRecord.id, values);
      } else {
        await gmapService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var zsdata = await ZsmkService.findList({});
      var setzsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          setzsmkData.push(zsmkda);
      }
      this.zsmkData=setzsmkData;
       var xdataS = await gmapService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
              if(a.gmapmenuid!="null"){
              for(var j=0;j<this.xsData.length;j++){
                    var b=this.xsData[j];
                  if(a.gmapmenuid==b.value){
                      a.gmapmenuid=b.label
                    }
              }
            }
            if(a.gmapzsmkid!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                   if(a.gmapzsmkid==b.id){
                      a.gmapzsmkid=b.zsmkmc;
                    }
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

export default new GmapStore();