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
import ZsmkService from "../../services/ksh/ZsmkService";
import FgService from "../../services/ksh/FgService";
import kshflService from "../../services/ksh/KshflService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable } from 'mobx';
/**
 *kshStore
 */

  class ZsmkStore {
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
  @observable fgflId = '';
  @observable list = [];
  @observable querycs = 1;
  @observable defaultValuekshflid ="";
  @observable defaultValuefgid ="";
  @observable queryfgcs = 1;
  @observable fglist ="";
  @observable colums =[
      {
        title: 'e9.ksh.zsmk.zsmkbh',
        dataIndex: 'zsmkbh',
        width: 80,
        lock: true
      },
      {
        title:  'e9.ksh.zsmk.zsmkmc',
        dataIndex: 'zsmkmc',
        width: 80,
        lock: true
      },
      {
        title:  'e9.ksh.zsmk.zsmkxh',
        dataIndex: 'zsmkxh',
        width: 120,
        lock: true
      },
      {
        title: 'e9.ksh.zsmk.zsmkfgid',
        dataIndex: 'zsmkfgid',
        width: 300,
        lock: true
      }
    ];
  @observable editFieldValues = {};
  @observable fgdata=[];
  @observable seltfgData=[];

  
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
      this.fgflId = this.params.flid;
      var fdata = await FgService.findList({fgflId:this.fgflId});
      var xlxistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].fgmc;
                a.value=fdata[i].id;
                xlxistdata.push(a);
        }
      this.seltfgData=xlxistdata;  
        var xdataS = await ZsmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkfgid!=""){
                for(var j=0;j<fdata.length;j++){
                  var b=fdata[j];
                  if(a.zsmkfgid==b.id){
                    a.zsmkfgid=b.fgmc;
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
      this.fgflId = this.params.flid;
      var fdata = await FgService.findList({fgflId:this.fgflId});
      var xlxistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].fgmc;
                a.value=fdata[i].id;
                xlxistdata.push(a);
        }
      this.seltfgData=xlxistdata;  
        var xdataS = await ZsmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkfgid!=""){
                for(var j=0;j<fdata.length;j++){
                  var b=fdata[j];
                  if(a.zsmkfgid==b.id){
                    a.zsmkfgid=b.fgmc;
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
      if(this.editRecord.zsmkfgid!=""){
              for(var j=0;j<this.seltfgData.length;j++){
                var b=this.seltfgData[j];
                if(this.editRecord.zsmkfgid==b.label){
                  this.editRecord.zsmkfgid=b.value
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
     if(params.zsmkfgid!=null){
        this.defaultValuefgid=params.zsmkfgid;
    }
    if (!nosearch) {
      await this.queryData();
    }
  }

  @action setKshfl = async (value) => {
    this.fgflId=value;
    this.defaultValuekshflid=value;
  }


 @action queryData  = async () =>{
    this.loading = true;
    try {
      var kshfldataS = await kshflService.findList({});
       this.list=[];
      var fllisttdata=[];
        for(var i=0;i<kshfldataS.length;i++){
                const a={};
                a.label=kshfldataS[i].kshflmc;
                a.value=kshfldataS[i].id;
                fllisttdata.push(a);
        }
      this.list=fllisttdata; 
      if(this.querycs==1){
        if(fllisttdata.length>0){
        this.defaultValuekshflid=fllisttdata[0].value;
        this.setKshfl(fllisttdata[0].value);
        this.params.flid=this.defaultValuekshflid;
        }
       this.querycs=this.querycs+1;
      }
      var fdata = await FgService.findList({fgflId:this.fgflId});
      var xlxistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].fgmc;
                a.value=fdata[i].id;
                xlxistdata.push(a);
          }
      this.seltfgData=xlxistdata;  
      if(this.queryfgcs==1){
        if(xlxistdata.length>0){
        this.defaultValuefgid=xlxistdata[0].value;
        this.params.zsmkfgid=this.defaultValuefgid;
        }
        this.queryfgcs=this.queryfgcs+1;
      }
      var xdataS = await ZsmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkfgid!=""){
                for(var j=0;j<fdata.length;j++){
                  var b=fdata[j];
                  if(a.zsmkfgid==b.id){
                    a.zsmkfgid=b.fgmc;
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
  //   this.deletevisible = false;
      await ZsmkService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      this.fgflId = this.params.flid;
      var fdata = await FgService.findList({fgflId:this.fgflId});
      var xlxistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].fgmc;
                a.value=fdata[i].id;
                xlxistdata.push(a);
          }
      this.seltfgData=xlxistdata; 
      var xdataS = await ZsmkService.findForPage(this.params, this.pageno, this.pagesize);
          this.dataSource=[];
          if(xdataS.list.length>0){
              this.listdata=[];
            var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                var a=xdata[i];
                if(a.zsmkfgid!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.zsmkfgid==b.id){
                      a.zsmkfgid=b.fgmc;
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
         await ZsmkService.updatesome(this.editRecord.id, values);
      } else {
        await ZsmkService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      this.fgflId = this.params.flid;
      var fdata = await FgService.findList({fgflId:this.fgflId});
      var xlxistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].fgmc;
                a.value=fdata[i].id;
                xlxistdata.push(a);
          }
      this.seltfgData=xlxistdata; 
      var xdataS = await ZsmkService.findForPage(this.params, this.pageno, this.pagesize);
           this.dataSource=[];    
          this.dataSource=[];
          if(xdataS.list.length>0){
              this.listdata=[];
            var xdata=xdataS.list;
                for(var i=0;i<xdata.length;i++){
                var a=xdata[i];
                if(a.zsmkfgid!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.zsmkfgid==b.id){
                      a.zsmkfgid=b.fgmc;
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

export default new ZsmkStore();
