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
import BzmkService from "../../services/ksh/BzmkService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action , makeObservable } from 'mobx';
/**
 *kshStore
 */
class BzmkStore {
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
        title: 'e9.ksh.bzmk.bzmkbh',
        dataIndex: 'bzmkbh',
        width: 90,
      },
      {
        title:  'e9.ksh.bzmk.bzmkmc',
        dataIndex: 'bzmkmc',
        width: 120,
      },
       {
        title:  'e9.ksh.bzmk.bzmkqtmc',
        dataIndex: 'bzmkqtmc',
        width: 120,
      },
      {
        title:  'e9.ksh.bzmk.bzmksize',
        dataIndex: 'bzmksize',
        width: 80,
        
      },
      {
        title:  'e9.ksh.bzmk.bzmkwidth',
        dataIndex: 'bzmkwidth',
        width: 90,
      }, 
      {
        title:  'e9.ksh.bzmk.bzmkheight',
        dataIndex: 'bzmkheight',
        width: 90
      },
      {
        title:  'e9.ksh.bzmk.bzmktype',
        dataIndex: 'bzmktype',
        width: 90
      },
      {
        title: 'e9.ksh.bzmk.bzmkmultiple',
        dataIndex: 'bzmkmultiple',
        width: 80
      },
       {
        title: 'e9.ksh.bzmk.bzmkqzfs',
        dataIndex: 'bzmkqzfs',
        width: 90
      },
      {
        title:  'e9.ksh.bzmk.bzmkrefresh',
        dataIndex: 'bzmkrefresh',
        width: 90
      }
    ];
    
  @observable editFieldValues = {};
  @observable btTypeData =[{value: 0, label: '单系列饼图'},{value: 1, label: '多系列饼图'},{value: 2, label: '多系列百分比饼图'},{value: 3, label: '单系列横向柱形图'},{value: 4, label: '单系列纵向柱形图'},{value: 5, label: '多系列横向柱形图'},{value: 6, label: '多系列纵向柱形图'},{value: 7, label: '折线图'},{value: 8, label: '数据面积图'},{value: 9, label: '柱形折线混合图'},{value: 10, label: '雷达图'}
  ,{value: 11, label: '漏斗图'},{value: 12, label: '仪表盘图'},{value: 13, label: '树图'},{value: 14, label: '矩形树图'},{value: 15, label: '旭日图'},{value: 16, label: '散点图'},{value: 17, label: '气泡图'},{value: 18, label: '主题河流图'},{value: 19, label: '日历坐标系'},{value: 20, label: '表格'},{value: 21, label: '统计表'},{value: 22, label: '设备管理图表'},{value: 23, label: 'iframe内嵌网页'},{value: 24, label: 'video视频'},{value: 25, label: '按钮组图表'},{value: 26, label: '滚动图表'}];
  @observable mulitpleData = [{value: 0, label: '单系列'},{value: 1, label: '多系列'}];
  @observable sizeData = [{value: 0, label: '小尺寸'},{value: 1, label: '较大尺寸'}];
  @observable setzsmkData = [];
  @observable qzfsData= [{value: 'URL', label: 'URL'},{value: 'SQL', label: 'SQL'}];
  @observable sqlsmValue="由于图表需要特定名称,因此SQL需重命名为name(名称),vaule(数值),max(最大数值),x(X轴数值<散点图/气泡图>),y(y轴数值 <散点图/气泡图>),sjdate(日期<主题河流图/日历坐标>),type(开关)属性，因此sql语句的格式，需要将查询的数值 as 成所需要的属性,如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; 多个语句时 ,语句必须‘;’结尾,语句间 必须用$charildsql$ 连接如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; $charildsql$ select B.name as name, COUNT(*) as value  from  B  group  by B.name;";
  @observable sqlzsmValue="由于多系列,需要外层数据和内数据,因此外层SQL和SQL是需关联的,外层需要必须值id,name,zid 如select A.id as id,A.name as name,A.id as zid from  A,而且内sql,必须和外层id关联条件,条件时值必须为$charildid$ ,如 外层SQL为：select A.id as id,A.name as name,A.id as zid  from  A; 那么下面的SQL为 select C.name as name COUNT(*) as value  from  C where C.zid=$charildid$; SQL多个时必须用$charildsql$ 连接";
  @observable zsdata = [];

  
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
        var xdataS = await BzmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.bzmksize==0||a.bzmksize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.bzmksize==b.value){
                    a.bzmksize=b.label;
                  }
                }
              }
              if(a.bzmktype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.bzmktype==b.value){
                    a.bzmktype=b.label;
                  }
                }
              }
              if(a.bzmkmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.bzmkmultiple==b.value){
                    a.bzmkmultiple=b.label;
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
      var xdataS = await BzmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.bzmksize==0||a.bzmksize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.bzmksize==b.value){
                    a.bzmksize=b.label;
                  }
                }
              }
              if(a.bzmktype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.bzmktype==b.value){
                    a.bzmktype=b.label;
                  }
                }
              }
              if(a.bzmkmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.bzmkmultiple==b.value){
                    a.bzmkmultiple=b.label;
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
    if(opt!="add"){
        if(this.editRecord.bzmksize!="null"){
              for(var j=0;j<this.sizeData.length;j++){
                var b=this.sizeData[j];
                  if(this.editRecord.bzmksize==b.label){
                    this.editRecord.bzmksize=b.value
                  }
              }
          }
          
          if(this.editRecord.bzmktype!="null"){
              for(var j=0;j<this.btTypeData.length;j++){
                var b=this.btTypeData[j];
                  if(this.editRecord.bzmktype==b.label){
                    this.editRecord.bzmktype=b.value
                  }
              }
          }
              
          if(this.editRecord.bzmkmultiple!="null"){
              for(var j=0;j<this.mulitpleData.length;j++){
                var b=this.mulitpleData[j];
                  if(this.editRecord.bzmkmultiple==b.label){
                    this.editRecord.bzmkmultiple=b.value
                  }
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
     var xdataS = await BzmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.bzmksize==0||a.bzmksize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.bzmksize==b.value){
                    a.bzmksize=b.label;
                  }
                }
              }
              if(a.bzmktype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.bzmktype==b.value){
                    a.bzmktype=b.label;
                  }
                }
              }
              if(a.bzmkmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.bzmkmultiple==b.value){
                    a.bzmkmultiple=b.label;
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
      await BzmkService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
      var xdataS = await BzmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.bzmksize==0||a.bzmksize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.bzmksize==b.value){
                    a.bzmksize=b.label;
                  }
                }
              }
              if(a.bzmktype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.bzmktype==b.value){
                    a.bzmktype=b.label;
                  }
                }
              }
              if(a.bzmkmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.bzmkmultiple==b.value){
                    a.bzmkmultiple=b.label;
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
         await BzmkService.updatesome(this.editRecord.id, values);
      } else {
        await BzmkService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
      var xdataS = await BzmkService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.bzmksize==0||a.bzmksize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.bzmksize==b.value){
                    a.bzmksize=b.label;
                  }
                }
              }
              if(a.bzmktype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.bzmktype==b.value){
                    a.bzmktype=b.label;
                  }
                }
              }
              if(a.bzmkmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.bzmkmultiple==b.value){
                    a.bzmkmultiple=b.label;
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

export default new BzmkStore();