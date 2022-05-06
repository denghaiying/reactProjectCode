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
import kshflService from "../../services/ksh/KshflService";
import FgService from "../../services/ksh/FgService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable } from 'mobx';


/**
 *kshStore
 */

 class FgStore {
  @observable fjModalVisible = false;
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
  @observable newdata = [];
  @observable list = [];
  @observable defaultValuefgid ="";
  @observable querycs = 1;
  @observable colums =[
      { 
        title: 'e9.ksh.fg.fgfgbh',
        dataIndex: "fgfgbh",
        width: 120
      },
      {
        title: 'e9.ksh.fg.fgmc',
        dataIndex: "fgmc",
        width: 280
      },
      {
        title: 'e9.ksh.fg.fgType',
        dataIndex: "fgType",
        width: 120
      },
      {
         title: 'e9.ksh.fg.fgTime',
        dataIndex: "fgTime",
        width: 300
      },
      {
         title: 'e9.ksh.fg.fghideNav',
        dataIndex: "fghideNav",
        width: 300
      },
      {
         title: 'e9.ksh.fg.fgxh',
        dataIndex: "fgxh",
        width: 90
      },
      {
         title: 'e9.ksh.fg.fgflId',
        dataIndex: "fgflId",
        width: 300
      }
    ];
  @observable editFieldValues = {};
  @observable fgTypeData =[{value: 0, label: '暗色主题'},{value: 1, label: '粉色主题'},{value: 2, label: '深蓝色主题'},{value: 3, label: '蓝白色主题'}];
  @observable kshflData =[];
  @observable kshfldefaultValue = '';

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
      var fdata = await kshflService.findList({});
      var fllistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].kshflmc;
                a.value=fdata[i].id;
                fllistdata.push(a);
      }
      this.kshflData=fllistdata; 
      var xdataS = await FgService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
                for(var j=0;j<this.fgTypeData.length;j++){
                    var b=this.fgTypeData[j];
                    if(a.fgType==b.value){
                      a.fgType=b.label
                  }   
                }
            if (a.fghideNav != "") {
              if (a.fghideNav == "true") {
                a.fghideNav = "隐藏"
              } else {
                a.fghideNav = "不隐藏"
              }
            }
            if(a.fgflId!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.fgflId==b.id){
                      a.fgflId=b.kshflmc;
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
    var fdata = await kshflService.findList({});
      var fllistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].kshflmc;
                a.value=fdata[i].id;
                fllistdata.push(a);
          }
      this.kshflData=fllistdata; 
     var xdataS = await FgService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
                for(var j=0;j<this.fgTypeData.length;j++){
                    var b=this.fgTypeData[j];
                    if(a.fgType==b.value){
                      a.fgType=b.label
                  }   
                }
            if (a.fghideNav != "") {
               if (a.fghideNav == "true") {
                a.fghideNav = "隐藏"
              } else {
                a.fghideNav = "不隐藏"
              }
            }
            if(a.fgflId!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.fgflId==b.id){
                      a.fgflId=b.kshflmc;
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
      if(this.editRecord.fgType!="null"){
         for(var j=0;j<this.fgTypeData.length;j++){
              var b=this.fgTypeData[j];
              if(this.editRecord.fgType==b.label){
                this.editRecord.fgType=b.value
            }
        }
    }
     if(this.editRecord.fghideNav!="null"){
          if(this.editRecord.fghideNav=="隐藏"){
              this.editRecord.fghideNav=true;
          }else{
            this.editRecord.fghideNav=false;
          }
    }
     if(this.editRecord.fgflId!=""){
              for(var j=0;j<this.kshflData.length;j++){
                var b=this.kshflData[j];
                if(this.editRecord.fgflId==b.label){
                  this.editRecord.fgflId=b.value
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


  @action setParams = async (params, nosearch) => {
    this.params = params;
    if(params.fgflId!=null){
        this.kshfldefaultValue=params.fgflId;
    }
    if (!nosearch) {
      await this.queryData();
    }
  }

 @action queryData  = async () => {
    this.loading = true;
    try {
      var fdata = await kshflService.findList({});
      var fllistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].kshflmc;
                a.value=fdata[i].id;
                fllistdata.push(a);
          }
      this.kshflData=fllistdata; 
       if(this.querycs==1){
         if(fllistdata.length>0){
          this.kshfldefaultValue=fllistdata[0].value;
          this.params.fgflId=fllistdata[0].value;
           this.querycs=this.querycs+1;
         } 
      }
      var xdataS = await FgService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
              for(var j=0;j<this.fgTypeData.length;j++){
                  var b=this.fgTypeData[j];
                  if(a.fgType==b.value){
                    a.fgType=b.label
                }   
              }
          if (a.fghideNav != "") {
           if (a.fghideNav == "true") {
                a.fghideNav = "隐藏"
              } else {
                a.fghideNav = "不隐藏"
              }
          }
          if(a.fgflId!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.fgflId==b.id){
                      a.fgflId=b.kshflmc;
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
      await FgService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
    var fdata = await kshflService.findList({});
      var fllistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].kshflmc;
                a.value=fdata[i].id;
                fllistdata.push(a);
        }
      this.kshflData=fllistdata; 
      var xdataS = await FgService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
              for(var j=0;j<this.fgTypeData.length;j++){
                  var b=this.fgTypeData[j];
                  if(a.fgType==b.value){
                    a.fgType=b.label
                }   
              }
          if (a.fghideNav != "") {
           if (a.fghideNav == "true") {
                a.fghideNav = "隐藏"
              } else {
                a.fghideNav = "不隐藏"
              }
          }
          if(a.fgflId!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.fgflId==b.id){
                      a.fgflId=b.kshflmc;
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


  @action closeFjDailog = async (visible) => {
    this.fjModalVisible = visible;
  };
  @action showFjDailog = async (opt, docRecord) => {
    this.fjModalVisible = true;
  }

  @action importfiles= async (e) => {
    this.newdata=[];
    if(e.length>0){
      for(var i=0;i<e.length;i++){
        var dvalue=e[i];
        if(dvalue.fgType!="null"){
          for(var j=0;j<this.fgTypeData.length;j++){
                var b=this.fgTypeData[j];
                if(dvalue.fgType==b.label){
                  dvalue.fgType=b.value
              }
          }
        }
        if(dvalue.fghideNav!="null"){
              if(dvalue.fghideNav=="隐藏"){
                  dvalue.fghideNav=true;
              }else{
                dvalue.fghideNav=false;
              }
        }
        if(dvalue.fgflId!=""){
                  for(var j=0;j<this.kshflData.length;j++){
                    var b=this.kshflData[j];
                    if(dvalue.fgflId==b.label){
                      dvalue.fgflId=b.value
                    }
                  }
          }
          await FgService.add(dvalue);
          this.fjModalVisible=false;
      }
    this.queryData();
    }
      
  }

   @action uploadfile = async (values) => {
     
      var sdata= await FgService.uploadfile(values);
      
      if(sdata==1){
        
      }
       this.fjModalVisible = false;
       this.queryData();
   }

  @action saveData = async (values) => {
    try {
      if (this.opt === 'edit') {
         await FgService.updatesome(this.editRecord.id, values);
      } else {
        await FgService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var fdata = await kshflService.findList({});
      var fllistdata=[];
        for(var i=0;i<fdata.length;i++){
                const a={};
                a.label=fdata[i].kshflmc;
                a.value=fdata[i].id;
                fllistdata.push(a);
      }
      this.kshflData=fllistdata; 
       var xdataS = await FgService.findForPage(this.params, this.pageno, this.pagesize);
      this.dataSource=[];
      this.listdata=[];
      if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
                for(var j=0;j<this.fgTypeData.length;j++){
                    var b=this.fgTypeData[j];
                    if(a.fgType==b.value){
                      a.fgType=b.label
                  }   
                }
            if (a.fghideNav != "") {
             if (a.fghideNav == "true") {
                a.fghideNav = "隐藏"
              } else {
                a.fghideNav = "不隐藏"
              }
            }
            if(a.fgflId!=""){
                  for(var j=0;j<fdata.length;j++){
                    var b=fdata[j];
                    if(a.fgflId==b.id){
                      a.fgflId=b.kshflmc;
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

export default new FgStore();