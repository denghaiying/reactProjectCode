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
import PbuttonService from "../../services/ksh/PbuttonService";
import bzmkService from "../../services/ksh/BzmkService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable} from 'mobx';



/**
 *kshStore
 */

 class PbuttonStore {
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
  @observable deleteid ="";
  @observable list = [];
  @observable querycs = 1;
  @observable defaultValuefgid ="";
  @observable defaultValuebjid ="";
  @observable colums =[
      { 
        title: 'e9.ksh.pbutton.pbuttonmc',
        dataIndex: "pbuttonmc",
        width: 120
      },
      {
        title: 'e9.ksh.pbutton.pbuttonimg',
        dataIndex: "pbuttonimg",
        width: 120
      },
      {
        title: 'e9.ksh.pbutton.pbuttonfs',
        dataIndex: "pbuttonfs",
        width: 300
      },
      {
         title: 'e9.ksh.pbutton.pbuttonurl',
        dataIndex: "pbuttonurl",
        width: 300
      },
       {
         title: 'e9.ksh.pbutton.pbuttonxh',
        dataIndex: "pbuttonxh",
        width: 90
      },
      {
         title: 'e9.ksh.pbutton.pbuttonzsmkbjid',
        dataIndex: "pbuttonzsmkbjid",
        width: 300
      }];
  @observable editFieldValues = {};
  @observable fsTypeData =[{value: 0, label: 'js脚本'},{value: 1, label: '跳转链接'}];
  @observable bzmkData =[];
  @observable fgId = '';

  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }

 @action setfgid = async (value) => {
    this.fgId=value;
    this.defaultValuefgid=value;
  }

  @action setPageNo = async (pageno) => {
     this.pageno = pageno;
     this.loading = true;
    try {
        var bzbjdata = await bzmkService.findList({});
        var bzzsmkDatas=[];
        this.bzmkData=[];
        this.list=[];
          for(var j=0;j<bzbjdata.length;j++){
              var b=bzbjdata[j];
              const zsmkd={};
              zsmkd.label=b.bzmkmc;
              zsmkd.value=b.id;
            bzzsmkDatas.push(zsmkd);
          }
        this.bzmkData=bzzsmkDatas;
        if(this.querycs==1){
            if(bzzsmkDatas.length>0){
              this.defaultValuebjid=bzzsmkDatas[0].value;
              this.params.pbuttonzsmkbjid=this.defaultValuebjid;
            }
            
        }
        this.list=bzzsmkDatas; 
        this.querycs=this.querycs+1;
     //   this.zsmkbjData=zsmkbDatas;
       var xdataS = await PbuttonService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.pbuttonzsmkbjid!=""){
                for(var j=0;j<bzbjdata.length;j++){
                  var b=bzbjdata[j];
                  if(a.pbuttonzsmkbjid==b.id){
                    a.pbuttonzsmkbjid=b.bzmkmc;
                  }
                }
            }
            if(a.pbuttonfs!=""){
              for(var j=0;j<this.fsTypeData.length;j++){
                  var b=this.fsTypeData[j];
                  if(a.pbuttonfs==b.value){
                    a.pbuttonfs=b.label
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
       var bzbjdata = await bzmkService.findList({});
        var bzzsmkDatas=[];
        this.bzmkData=[];
        this.list=[];
          for(var j=0;j<bzbjdata.length;j++){
              var b=bzbjdata[j];
              const zsmkd={};
              zsmkd.label=b.bzmkmc;
              zsmkd.value=b.id;
            bzzsmkDatas.push(zsmkd);
          }
        this.bzmkData=bzzsmkDatas;
        if(this.querycs==1){
            if(bzzsmkDatas.length>0){
              this.defaultValuebjid=bzzsmkDatas[0].value;
              this.params.pbuttonzsmkbjid=this.defaultValuebjid;
            }
            
        }
        this.list=bzzsmkDatas; 
        this.querycs=this.querycs+1;
       var xdataS = await PbuttonService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.pbuttonzsmkbjid!=""){
                for(var j=0;j<zsbjdata.length;j++){
                  var b=zsbjdata[j];
                  if(a.pbuttonzsmkbjid==b.id){
                    a.pbuttonzsmkbjid=b.bzmkmc;
                  }
                }
            }
            if(a.pbuttonfs!=""){
              for(var j=0;j<this.fsTypeData.length;j++){
                  var b=this.fsTypeData[j];
                  if(a.pbuttonfs==b.value){
                    a.pbuttonfs=b.label
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
      if(this.editRecord.pbuttonfs!="null"){
         for(var j=0;j<this.fsTypeData.length;j++){
              var b=this.fsTypeData[j];
              if(this.editRecord.pbuttonfs==b.label){
                this.editRecord.pbuttonfs=b.value
            }
        }
    }
    if(this.editRecord.pbuttonzsmkbjid!="null"){
        for(var j=0;j<this.bzmkData.length;j++){
           var b=this.bzmkData[j];
          if(this.editRecord.pbuttonzsmkbjid==b.label){
            this.editRecord.pbuttonzsmkbjid=b.value
            }
        }
    }
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


  @action changemkbj = async (value) => {
    this.fgId=value;
     var zsbjdata = await ZsmkbjService.findList({fgid:this.fgId});
        var zsmkbDatas=[];
          for(var j=0;j<zsbjdata.length;j++){
              var b=zsbjdata[j];
              const zsmkd={};
              zsmkd.label=b.zsmkbjmc;
              zsmkd.value=b.id;
            zsmkbDatas.push(zsmkd);
          }
    this.zsmkbjData=zsmkbDatas;
  }

  @action setParams = async (params, nosearch) => {
    this.params = params;

    if(params.pbuttonzsmkbjid!=null){
        this.defaultValuebjid=params.pbuttonzsmkbjid;
    }
    if (!nosearch) {
      await this.queryData();
    }
  }

 @action queryData  = async () => {
      this.loading = true;
      try {

        var bzbjdata = await bzmkService.findList({});
        var bzzsmkDatas=[];
         this.bzmkData=[];
        this.list=[];
          for(var j=0;j<bzbjdata.length;j++){
              var b=bzbjdata[j];
              const zsmkd={};
              zsmkd.label=b.bzmkmc;
              zsmkd.value=b.id;
            bzzsmkDatas.push(zsmkd);
          }
        this.bzmkData=bzzsmkDatas;
        if(this.querycs==1){
            if(bzzsmkDatas.length>0){
              this.defaultValuebjid=bzzsmkDatas[0].value;
              this.params.pbuttonzsmkbjid=this.defaultValuebjid;
            }
            
        }
            this.list=bzzsmkDatas; 
           this.querycs=this.querycs+1;
       
        var xdataS = await PbuttonService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        this.listdata=[];
        if(xdataS.list.length>0){
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.pbuttonzsmkbjid!=""){
                  for(var j=0;j<bzbjdata.length;j++){
                    var b=bzbjdata[j];
                    if(a.pbuttonzsmkbjid==b.id){
                      a.pbuttonzsmkbjid=b.bzmkmc;
                    }
                  }
              }
              if(a.pbuttonfs!=""){
                for(var j=0;j<this.fsTypeData.length;j++){
                    var b=this.fsTypeData[j];
                    if(a.pbuttonfs==b.value){
                      a.pbuttonfs=b.label
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
    // this.deletevisible = false;
      await PbuttonService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
       var bzbjdata = await bzmkService.findList({});
        var bzzsmkDatas=[];
         this.bzmkData=[];
          for(var j=0;j<bzbjdata.length;j++){
              var b=bzbjdata[j];
              const zsmkd={};
              zsmkd.label=b.bzmkmc;
              zsmkd.value=b.id;
            bzzsmkDatas.push(zsmkd);
          }
        this.bzmkData=bzzsmkDatas;
       var xdataS = await PbuttonService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.pbuttonzsmkbjid!=""){
                for(var j=0;j<bzbjdata.length;j++){
                  var b=bzbjdata[j];
                  if(a.pbuttonzsmkbjid==b.id){
                    a.pbuttonzsmkbjid=b.bzmkmc;
                  }
                }
            }
            if(a.pbuttonfs!=""){
              for(var j=0;j<this.fsTypeData.length;j++){
                  var b=this.fsTypeData[j];
                  if(a.pbuttonfs==b.value){
                    a.pbuttonfs=b.label
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
         await PbuttonService.updatesome(this.editRecord.id, values);
      } else {
        await PbuttonService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var bzbjdata = await bzmkService.findList({});
        var bzzsmkDatas=[];
          this.bzmkData=[];
          for(var j=0;j<bzbjdata.length;j++){
              var b=bzbjdata[j];
              const zsmkd={};
              zsmkd.label=b.bzmkmc;
              zsmkd.value=b.id;
            bzzsmkDatas.push(zsmkd);
          }
        this.bzmkData=bzzsmkDatas;
        var xdataS = await PbuttonService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        this.listdata=[];
        if(xdataS.list.length>0){
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.pbuttonzsmkbjid!=""){
                  for(var j=0;j<bzbjdata.length;j++){
                    var b=bzbjdata[j];
                    if(a.pbuttonzsmkbjid==b.id){
                      a.pbuttonzsmkbjid=b.bzmkmc;
                    }
                  }
              }
              if(a.pbuttonfs!=""){
                for(var j=0;j<this.fsTypeData.length;j++){
                    var b=this.fsTypeData[j];
                    if(a.pbuttonfs==b.value){
                      a.pbuttonfs=b.label
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

export default new PbuttonStore();