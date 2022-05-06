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
import ZsmkbjService from "../../services/ksh/ZsmkbjService";
import ZsmkbjfjService from "../../services/ksh/ZsmkbjfjService";
import ZsmkService from "../../services/ksh/ZsmkService";
import FgService from "../../services/ksh/FgService";
import moment, { isMoment } from "moment";
import { Message } from "@alifd/next";
import { observable, action, makeObservable } from 'mobx';
/**
 *kshStore
 */
class ZsmkbjStore {
  @observable bzloading = false;
  @observable szdataSource = [];
  @observable dataSource = [];
  @observable record = {};
  @observable params = {};
  @observable loading = false;
  @observable fjloading= false;
  @observable pageno = 1;
  @observable pagesize = 10;
  @observable opt = 'view';
  @observable fjopt = 'view';
  @observable delvisible = false;
  @observable modalVisible = false;
  @observable modalfjVisible = false;
  @observable editfjRecord = {};
  @observable editRecord = {};
  @observable selectRowKeys = [];
  @observable selectRowRecords = [];
  @observable bzmkSelectedData =  [];
  @observable whsjValue ="";
  @observable importvisible =  false;
  @observable importFjvisible =  false;
  @observable szqueryKey = {};
  @observable fgId = '';
  @observable list = [];
  @observable querycs = 1;
  @observable defaultValuefgid ="";
  @observable queryzmkcs = 1;
  @observable defaultValuezsmkid ="";
  @observable bzmkbjid="";
  @observable colums =[
       {
        title: 'e9.ksh.zsmkbj.zsmkbjfjs',
        dataIndex: 'zsmkbjfjs',
        width: 90,
      },
      {
        title: 'e9.ksh.zsmkbj.zsmkbjbh',
        dataIndex: 'zsmkbjbh',
        width: 90,
      },
      {
        title:  'e9.ksh.zsmkbj.zsmkbjmc',
        dataIndex: 'zsmkbjmc',
        width: 120,
      },
       {
        title:  'e9.ksh.zsmkbj.zsmkbjqtmc',
        dataIndex: 'zsmkbjqtmc',
        width: 120,
      },
      {
        title:  'e9.ksh.zsmkbj.zsmkbjorder',
        dataIndex: 'zsmkbjorder',
        width: 80,
        
      },
      {
        title:  'e9.ksh.zsmkbj.zsmkbjsize',
        dataIndex: 'zsmkbjsize',
        width: 80,
      }, 
      {
        title:  'e9.ksh.zsmkbj.zsmkbjwidth',
        dataIndex: 'zsmkbjwidth',
        width: 80
      },
      {
        title:  'e9.ksh.zsmkbj.zsmkbjheight',
        dataIndex: 'zsmkbjheight',
        width: 80
      },
      {
        title: 'e9.ksh.zsmkbj.zsmkbjpositionX',
        dataIndex: 'zsmkbjpositionX',
        width: 80
      },
      {
        title: 'e9.ksh.zsmkbj.zsmkbjpositionY',
        dataIndex: 'zsmkbjpositionY',
        width: 80
      },
      {
        title: 'e9.ksh.zsmkbj.zsmkbjtype',
        dataIndex: 'zsmkbjtype',
        width: 80
      },
      {
        title:  'e9.ksh.zsmkbj.zsmkbjmultiple',
        dataIndex: 'zsmkbjmultiple',
        width: 80
      },
       {
        title:  'e9.ksh.zsmkbj.zsmkbjZsmkId',
        dataIndex: 'zsmkbjZsmkId',
        width: 80
      },
      {
        title:  'e9.ksh.zsmkbj.zsmkbjqzfs',
        dataIndex: 'zsmkbjqzfs',
        width: 90
      },
      {
        title: 'e9.ksh.zsmkbj.zsmkbjrefresh',
        dataIndex: 'zsmkbjrefresh',
        width: 80
      },{
      title:  'e9.ksh.zsmkbj.zsmkbjstate',
        dataIndex: "zsmkbjstate",
        width: 80
      }
    ];
  @observable editFieldValues = {};
  @observable btTypeData =[{value: 0, label: '单系列饼图'},{value: 1, label: '多系列饼图'},{value: 2, label: '多系列百分比饼图'},{value: 3, label: '单系列横向柱形图'},{value: 4, label: '单系列纵向柱形图'},{value: 5, label: '多系列横向柱形图'},{value: 6, label: '多系列纵向柱形图'},{value: 7, label: '折线图'},{value: 8, label: '数据面积图'},{value: 9, label: '柱形折线混合图'},{value: 10, label: '雷达图'}
  ,{value: 11, label: '漏斗图'},{value: 12, label: '仪表盘图'},{value: 13, label: '树图'},{value: 14, label: '矩形树图'},{value: 15, label: '旭日图'},{value: 16, label: '散点图'},{value: 17, label: '气泡图'},{value: 18, label: '主题河流图'},{value: 19, label: '日历坐标系'},{value: 20, label: '表格'},{value: 21, label: '统计表'},{value: 22, label: '设备管理图表'},{value: 23, label: 'iframe内嵌网页'},{value: 24, label: 'video视频'},{value: 25, label: '按钮组图表'},{value: 26, label: '滚动图表'}];
  @observable mulitpleData = [{value: 0, label: '单系列'},{value: 1, label: '多系列'}];
  @observable sizeData = [{value: 0, label: '小尺寸'},{value: 1, label: '较大尺寸'}];
  @observable setzsmkData = [];
  @observable zsmkqzfsData= [{value: 'URL', label: 'URL'},{value: 'SQL', label: 'SQL'}];
  @observable sqlsmValue="由于图表需要特定名称,因此SQL需重命名为name(名称),vaule(数值),max(最大数值),x(X轴数值<散点图/气泡图>),y(y轴数值 <散点图/气泡图>),sjdate(日期<主题河流图/日历坐标>),type(开关)属性，因此sql语句的格式，需要将查询的数值 as 成所需要的属性,如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; 多个语句时 ,语句必须‘;’结尾,语句间 必须用$charildsql$ 连接如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; $charildsql$ select B.name as name, COUNT(*) as value  from  B  group  by B.name;";
  @observable zsmkbjsqlzsmValue="由于多系列,需要外层数据和内数据,因此外层SQL和SQL是需关联的,外层需要必须值id,name,zid 如select A.id as id,A.name as name,A.id as zid from  A,而且内sql,必须和外层id关联条件,条件时值必须为$charildid$ ,如 外层SQL为：select A.id as id,A.name as name,A.id as zid  from  A; 那么下面的SQL为 select C.name as name COUNT(*) as value  from  C where C.zid=$charildid$; SQL多个时必须用$charildsql$ 连接";
  @observable zsdata = [];
  @observable colorsData =[{label:'浅粉色',value:'#FFB6C1'},{label:'粉红',value:'#FFC0CB'},{label:'猩红',value:'#DC143C'},{label:'脸红的淡紫色',value:'#FFF0F5'},{label:'苍白的紫罗兰红色',value:'#DB7093'},{label:'热情的粉红',value:'#FF69B4'},{label:'深粉色',value:'#FF1493'},{label:'适中的紫罗兰红色',value:'#C71585'},{label:'兰花的紫色',value:'#DA70D6'},{label:'蓟',value:'#D8BFD8'},{label:'李子',value:'#DDA0DD'},{label:'紫罗兰',value:'#EE82EE'},{label:'洋红',value:'#FF00FF'},{label:'灯笼海棠(紫红色)',value:'#FF00FF'},{label:'深洋红色',value:'#8B008B'},{label:'紫色',value:'#800080'},{label:'适中的兰花紫',value:'#BA55D3'},{label:'深紫罗兰色',value:'#9400D3'},{label:'深兰花紫',value:'#9932CC'},{label:'靛青',value:'#4B0082'},{label:'深紫罗兰的蓝色',value:'#8A2BE2'}
,{label:'适中的紫色',value:'#9370DB'},{label:'适中的板岩暗蓝灰色',value:'#7B68EE'},{label:'板岩暗蓝灰色',value:'#6A5ACD'},{label:'深岩暗蓝灰色',value:'#483D8B'},{label:'薰衣草花的淡紫色',value:'#E6E6FA'},{label:'幽灵的白色',value:'#F8F8FF'},{label:'纯蓝',value:'#0000FF'}
,{label:'适中的蓝色',value:'#0000CD'},{label:'午夜的蓝色',value:'#191970'},{label:'深蓝色',value:'#00008B'},{label:'海军蓝',value:'#000080'},{label:'皇军蓝',value:'#4169E1'},{label:'矢车菊的蓝色',value:'#6495ED'},{label:'淡钢蓝',value:'#B0C4DE'},{label:'浅石板灰',value:'#778899'}
,{label:'石板灰',value:'#708090'},{label:'道奇蓝',value:'#1E90FF'},{label:'爱丽丝蓝',value:'#F0F8FF'},{label:'钢蓝',value:'#4682B4'},{label:'淡蓝色',value:'#87CEFA'},{label:'天蓝色',value:'#87CEEB'},{label:'深天蓝',value:'#00BFFF'},{label:'淡蓝',value:'#ADD8E6'},{label:'火药蓝',value:'#B0E0E6'}
,{label:'军校蓝',value:'#5F9EA0'},{label:'蔚蓝色',value:'#F0FFFF'},{label:'淡青色',value:'#E1FFFF'},{label:'苍白的绿宝石',value:'#AFEEEE'},{label:'青色',value:'#00FFFF'},{label:'水绿色',value:'#00FFFF'},{label:'深绿宝石',value:'#00CED1'}
,{label:'深石板灰',value:'#2F4F4F'},{label:'深青色',value:'#008B8B'},{label:'水鸭色',value:'#008080'},{label:'适中的绿宝石',value:'#48D1CC'},{label:'浅海洋绿',value:'#20B2AA'},{label:'绿宝石',value:'#40E0D0'}
,{label:'绿玉碧绿色',value:'#7FFFAA'},{label:'适中的碧绿色',value:'#00FA9A'},{label:'适中的春天的绿色',value:'#F5FFFA'},{label:'薄荷奶油',value:'#00FF7F'},{label:'春天的绿色',value:'#3CB371'}
,{label:'海洋绿',value:'#2E8B57'},{label:'蜂蜜',value:'#F0FFF0'},{label:'淡绿色',value:'#90EE90'},{label:'苍白的绿色',value:'#98FB98'},{label:'深海洋绿',value:'#8FBC8F'},{label:'酸橙绿',value:'#32CD32'},{label:'酸橙色',value:'#00FF00'},{label:'森林绿',value:'#228B22'}
,{label:'纯绿',value:'#008000'},{label:'深绿色',value:'#006400'},{label:'查特酒绿',value:'#7FFF00'},{label:'草坪绿',value:'#7CFC00'},{label:'绿黄色',value:'#ADFF2F'},{label:'橄榄土褐色',value:'#556B2F'},{label:'米色(浅褐色)',value:'#6B8E23'}
,{label:'浅秋麒麟黄',value:'#FAFAD2'},{label:'象牙',value:'#FFFFF0'},{label:'浅黄色',value:'#FFFFE0'},{label:'纯黄',value:'#FFFF00'},{label:'橄榄',value:'#808000'},{label:'深卡其布',value:'#BDB76B'},{label:'柠檬薄纱',value:'#FFFACD'}
,{label:'灰秋麒麟',value:'#EEE8AA'},{label:'卡其布',value:'#F0E68C'},{label:'金',value:'#FFD700'},{label:'玉米色',value:'#FFF8DC'},{label:'秋麒麟',value:'#DAA520'},{label:'花的白色',value:'#FFFAF0'}
,{label:'老饰带',value:'#FDF5E6'},{label:'小麦色',value:'#F5DEB3'},{label:'鹿皮鞋',value:'#FFE4B5'},{label:'橙色',value:'#FFA500'},{label:'番木瓜',value:'#FFEFD5'},{label:'漂白的杏仁',value:'#FFEBCD'},{label:'Navajo白',value:'#FFDEAD'}
,{label:'古代的白色',value:'#FAEBD7'},{label:'晒黑',value:'#D2B48C'},{label:'结实的树',value:'#DEB887'},{label:'(浓汤)乳脂,番茄等',value:'#FFE4C4'},{label:'深橙色',value:'#FF8C00'},{label:'亚麻布',value:'#FAF0E6'}
,{label:'秘鲁',value:'#CD853F'},{label:'桃色',value:'#FFDAB9'},{label:'沙棕色',value:'#F4A460'},{label:'巧克力',value:'#D2691E'},{label:'马鞍棕色',value:'#8B4513'},{label:'海贝壳',value:'#FFF5EE'},{label:'黄土赭色',value:'#A0522D'},{label:'浅鲜肉(鲑鱼)色',value:'#FFA07A'},{label:'珊瑚',value:'#FF7F50'},{label:'橙红色',value:'#FF4500'},{label:'深鲜肉(鲑鱼)色',value:'#E9967A'},{label:'番茄',value:'#FF6347'},{label:'薄雾玫瑰',value:'#FFE4E1'},{label:'鲜肉(鲑鱼)色',value:'#FA8072'},{label:'雪',value:'#FFFAFA'}
,{label:'淡珊瑚色',value:'#F08080'},{label:'玫瑰棕色',value:'#BC8F8F'},{label:'印度红',value:'#CD5C5C'},{label:'纯红',value:'#FF0000'},{label:'棕色',value:'#A52A2A'},{label:'耐火砖',value:'#B22222'},{label:'深红色',value:'#8B0000'},{label:'栗色',value:'#800000'},{label:'纯白',value:'#FFFFFF'},{label:'白烟',value:'#F5F5F5'},{label:'Gainsboro',value:'#DCDCDC'},{label:'浅灰色',value:'#D3D3D3'},{label:'银白色',value:'#C0C0C0'},{label:'深灰色',value:'#A9A9A9'},{label:'灰色',value:'#808080'},{label:'暗淡的灰色',value:'#696969'},{label:'纯黑',value:'#000000'}];
  

  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeObservable(this);
  }

  @observable fjcolums =[
       {
        title: 'e9.ksh.zsmkbjfj.zsmkbjfjfilename',
        dataIndex: 'zsmkbjfjfilename',
        width: 90,
      },
      {
        title: 'e9.ksh.zsmkbjfj.zsmkbjfjext',
        dataIndex: 'zsmkbjfjext',
        width: 90,
      },
            {
        title: 'e9.ksh.zsmkbjfj.zsmkbjfjsize',
        dataIndex: 'zsmkbjfjsize',
        width: 90,
      },
       {
        title:  'e9.ksh.zsmkbjfj.zsmkbjfjbbh',
        dataIndex: 'zsmkbjfjbbh',
        width: 120,
      },
      {
        title:  'e9.ksh.zsmkbjfj.zsmkbjfjmd5code',
        dataIndex: 'zsmkbjfjmd5code',
        width: 80,
        
      },
      {
        title:  'e9.ksh.zsmkbjfj.zsmkbjfjbz',
        dataIndex: 'zsmkbjfjbz',
        width: 80,
      },
      {
        title:  'e9.ksh.zsmkbjfj.zsmkbjfjsj',
        dataIndex: 'zsmkbjfjsj',
        width: 80,
      }
   ];
  @observable fjdataSource = [];

  
  @action setPageNo = async (pageno) => {
    this.pageno = pageno;
    this.loading = true;
    try {
    this.fgId = this.params.fgid;
     var zsdata = await ZsmkService.findList({zsmkfgid:this.fgId});
      var zsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          zsmkData.push(zsmkda);
        }
        this.setzsmkData=zsmkData;
        var xdataS = await ZsmkbjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if (a.zsmkbjstate != "") {
                if (a.zsmkbjstate == "true") {
                  a.zsmkbjstate = "开启"
                } else {
                  a.zsmkbjstate = "关闭"
                }
              }
              if(a.zsmkbjsize==0||a.zsmkbjsize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.zsmkbjsize==b.value){
                    a.zsmkbjsize=b.label;
                  }
                }
              }
              if(a.zsmkbjtype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.zsmkbjtype==b.value){
                    a.zsmkbjtype=b.label;
                  }
                }
              }
              if(a.zsmkbjmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.zsmkbjmultiple==b.value){
                    a.zsmkbjmultiple=b.label;
                  }
                }
              }
            if(a.zsmkbjZsmkId!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                  if(a.zsmkbjZsmkId==b.id){
                    a.zsmkbjZsmkId=b.zsmkmc;
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
     this.fgId = this.params.fgid;
     var zsdata = await ZsmkService.findList({zsmkfgid:this.fgId});
      var zsmkData=[];
        for(var j=0;j<this.zsdata.length;j++){
            var b=this.zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          zsmkData.push(zsmkda);
        }
        this.setzsmkData=zsmkData;
        var xdataS = await ZsmkbjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if (a.zsmkbjstate != "") {
                if (a.zsmkbjstate == "true") {
                  a.zsmkbjstate = "开启"
                } else {
                  a.zsmkbjstate = "关闭"
                }
              }
              if(a.zsmkbjsize==0||a.zsmkbjsize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.zsmkbjsize==b.value){
                    a.zsmkbjsize=b.label;
                  }
                }
              }
              if(a.zsmkbjtype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.zsmkbjtype==b.value){
                    a.zsmkbjtype=b.label;
                  }
                }
              }
              if(a.zsmkbjmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.zsmkbjmultiple==b.value){
                    a.zsmkbjmultiple=b.label;
                  }
                }
              }
            if(a.zsmkbjZsmkId!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                  if(a.zsmkbjZsmkId==b.id){
                    a.zsmkbjZsmkId=b.zsmkmc;
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
        if(this.editRecord.zsmkbjsize!="null"){
              for(var j=0;j<this.sizeData.length;j++){
                var b=this.sizeData[j];
                  if(this.editRecord.zsmkbjsize==b.label){
                    this.editRecord.zsmkbjsize=b.value
                  }
              }
          }
          
          if(this.editRecord.zsmkbjtype!="null"){
              for(var j=0;j<this.btTypeData.length;j++){
                var b=this.btTypeData[j];
                  if(this.editRecord.zsmkbjtype==b.label){
                    this.editRecord.zsmkbjtype=b.value
                  }
              }
          }
              
          if(this.editRecord.zsmkbjmultiple!="null"){
              for(var j=0;j<this.mulitpleData.length;j++){
                var b=this.mulitpleData[j];
                  if(this.editRecord.zsmkbjmultiple==b.label){
                    this.editRecord.zsmkbjmultiple=b.value
                  }
              }
          }
          if(this.editRecord.zsmkbjZsmkId!="null"){
              for(var j=0;j<this.zsdata.length;j++){
                    var b=this.zsdata[j];
                    if(this.editRecord.zsmkbjZsmkId==b.zsmkmc){
                      this.editRecord.zsmkbjZsmkId=b.id
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

  @action closeimportEditForm = () => {
    this.importvisible = false;
  }


  @action closeimportFJForm = () => {
    this.importFjvisible = false;
  }
  @action showimportDailog = () => {
    this.importvisible = true;
    this.findAllBzmk();
  }


  @action showfjDailog = async (id) => {
    this.importFjvisible = true;
  //  this.findAllBzmk();
    this.bzmkbjid=id;
     var zsdata = await ZsmkbjService.findfjList({bzmkbjid:this.bzmkbjid});
     this.fjdataSource=zsdata;
  }


  @action resetEditRecord = (value) => {
    this.editRecord = value;
  }

  @action setParams = async (params, nosearch) => {
    this.params = params;
      if(params.zsmkbjZsmkId!=null){
        this.defaultValuezsmkid=params.zsmkbjZsmkId;
    }
    if (!nosearch) {
      await this.queryData();
    }
  }

 @action setfgid = async (value) => {
    this.fgId=value;
    this.defaultValuefgid=value;
  }

  @action queryData  = async () =>{
    this.loading = true;
    try {

      var fgdataS = await FgService.findList({});
       this.list=[];
      var fglistdata=[];
        for(var i=0;i<fgdataS.length;i++){
                const a={};
                a.label=fgdataS[i].fgmc;
                a.value=fgdataS[i].id;
                fglistdata.push(a);
        }
      this.list=fglistdata; 
      if(this.querycs==1){
        if(fglistdata.length>0){
        this.defaultValuefgid=fglistdata[0].value;
        this.setfgid(fglistdata[0].value);
        this.params.fgid=this.defaultValuefgid;
        }
       this.querycs=this.querycs+1;
      }
      var zsmkdata = await ZsmkService.findList({zsmkfgid:this.fgId});
      this.zsdata =zsmkdata;
         var zsmkData=[];
        for(var j=0;j<zsmkdata.length;j++){
            var b=zsmkdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          zsmkData.push(zsmkda);
        } 
       this.setzsmkData=zsmkData;
       if(this.queryzmkcs==1){
        if(zsmkData.length>0){
        this.defaultValuezsmkid=zsmkData[0].value;
        this.params.zsmkbjZsmkId=this.defaultValuezsmkid;
        }
        this.queryzmkcs=this.queryzmkcs+1;
      }
      var xdataS = await ZsmkbjService.findForPage(this.params, this.pageno, this.pagesize);
         this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
              var xdata=xdataS.list;  
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkbjsize==0||a.zsmkbjsize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.zsmkbjsize==b.value){
                    a.zsmkbjsize=b.label;
                  }
                }
              }
             if (a.zsmkbjstate != "") {
                if (a.zsmkbjstate == "true") {
                  a.zsmkbjstate = "开启"
                } else {
                  a.zsmkbjstate = "关闭"
                }
              }
              if(a.zsmkbjtype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.zsmkbjtype==b.value){
                    a.zsmkbjtype=b.label;
                  }
                }
              }
              if(a.zsmkbjmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.zsmkbjmultiple==b.value){
                    a.zsmkbjmultiple=b.label;
                  }
                }
              }
            if(a.zsmkbjZsmkId!=""){
                for(var j=0;j<this.zsdata.length;j++){
                  var b=this.zsdata[j];
                  if(a.zsmkbjZsmkId==b.id){
                    a.zsmkbjZsmkId=b.zsmkmc;
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
      await ZsmkbjService.delete(id);
      this.modalVisible = false;
      this.delvisible = false;
      this.loading = true;
     this.fgId = this.params.fgid;
     var zsdata = await ZsmkService.findList({zsmkfgid:this.fgId});
      var zsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          zsmkData.push(zsmkda);
        } 
     this.setzsmkData=zsmkData;
      var xdataS = await ZsmkbjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
              var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkbjsize==0||a.zsmkbjsize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.zsmkbjsize==b.value){
                    a.zsmkbjsize=b.label;
                  }
                }
              }
             if (a.zsmkbjstate != "") {
                if (a.zsmkbjstate == "true") {
                  a.zsmkbjstate = "开启"
                } else {
                  a.zsmkbjstate = "关闭"
                }
              }
              if(a.zsmkbjtype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.zsmkbjtype==b.value){
                    a.zsmkbjtype=b.label;
                  }
                }
              }
              if(a.zsmkbjmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.zsmkbjmultiple==b.value){
                    a.zsmkbjmultiple=b.label;
                  }
                }
              }
            if(a.zsmkbjZsmkId!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                  if(a.zsmkbjZsmkId==b.id){
                    a.zsmkbjZsmkId=b.zsmkmc;
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
      if(values.zsmkbjcolors!=undefined){
        var color=  values.zsmkbjcolors.toString();
         values.zsmkbjcolors=color;
      }
      if (this.opt === 'edit') {
         await ZsmkbjService.updatesome(this.editRecord.id, values);
      } else {
        await ZsmkbjService.add(values);
      }
      this.modalVisible = false;
      this.loading = true;
    this.fgId = this.params.fgid;
     var zsdata = await ZsmkService.findList({zsmkfgid:this.fgId});
      var zsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          zsmkData.push(zsmkda);
        } 
        this.setzsmkData=zsmkData;
      var xdataS = await ZsmkbjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkbjsize==0||a.zsmkbjsize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.zsmkbjsize==b.value){
                    a.zsmkbjsize=b.label;
                  }
                }
              }
              if (a.zsmkbjstate != "") {
                if (a.zsmkbjstate == "true") {
                  a.zsmkbjstate = "开启"
                } else {
                  a.zsmkbjstate = "关闭"
                }
              }
              if(a.zsmkbjtype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.zsmkbjtype==b.value){
                    a.zsmkbjtype=b.label;
                  }
                }
              }
              if(a.zsmkbjmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.zsmkbjmultiple==b.value){
                    a.zsmkbjmultiple=b.label;
                  }
                }
              }
            if(a.zsmkbjZsmkId!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                  if(a.zsmkbjZsmkId==b.id){
                    a.zsmkbjZsmkId=b.zsmkmc;
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
  
  @action saveBzmkData = async (values) => {
    try {
      let l = this.bzmkSelectedData.length;
      if (l > 0) {
        for (let i = 0; i < l; i++) {
          var zsmkbj={};
          var bzmkd=this.bzmkSelectedData[i];
          if(bzmkd.bzmksize==0||bzmkd.bzmksize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(bzmkd.bzmksize==b.value){
                    zsmkbj.zsmkbjsize=b.label;
                  }
                }
          }
          if(bzmkd.bzmktype!="null"){
            for(var k=0;k<this.btTypeData.length;k++){
              var b=this.btTypeData[k];
              if(bzmkd.bzmktype==b.value){
                zsmkbj.zsmkbjtype=b.label;
              }
            }
          }
          if(bzmkd.bzmkmultiple!="null"){
            for(var j=0;j<this.mulitpleData.length;j++){
              var b=this.mulitpleData[j];
              if(bzmkd.bzmkmultiple==b.value){
                  zsmkbj.zsmkbjmultiple=b.label;
              }
            }
          }
          zsmkbj.id = bzmkd.id;
          zsmkbj.zsmkbjbh = bzmkd.bzmkbh;
          zsmkbj.zsmkbjmc = bzmkd.bzmkmc;
          zsmkbj.zsmkbjqtmc = bzmkd.bzmkqtmc;
          zsmkbj.zsmkbjwidth = bzmkd.bzmkwidth;
          zsmkbj.zsmkbjheight = bzmkd.bzmkheight;
          zsmkbj.zsmkbjrefresh = bzmkd.bzmkrefresh;
          zsmkbj.zsmkbjurl = bzmkd.bzmkurl;
          zsmkbj.zsmkbjsqlz = bzmkd.bzmksqlz;
          zsmkbj.zsmkbjsql = bzmkd.bzmksql;
          zsmkbj.zsmkbjqzfs = bzmkd.bzmkqzfs;
          await ZsmkbjService.add(zsmkbj);
        }
      }
      this.importvisible= false;
      this.importFjvisible = false;
      this.modalVisible = false;
      this.loading = true;
     this.fgId = this.params.fgid;
     var zsdata = await ZsmkService.findList({zsmkfgid:this.fgId});
      var zsmkData=[];
        for(var j=0;j<zsdata.length;j++){
            var b=zsdata[j];
            const zsmkda={};
            zsmkda.label=b.zsmkmc;
            zsmkda.value=b.id;
          zsmkData.push(zsmkda);
        } 
        this.setzsmkData=zsmkData;
      var xdataS = await ZsmkbjService.findForPage(this.params, this.pageno, this.pagesize);
        this.dataSource=[];
        if(xdataS.list.length>0){
            this.listdata=[];
          var xdata=xdataS.list;
              for(var i=0;i<xdata.length;i++){
              var a=xdata[i];
              if(a.zsmkbjsize==0||a.zsmkbjsize==1){
                for(var j=0;j<this.sizeData.length;j++){
                  var b=this.sizeData[j];
                  if(a.zsmkbjsize==b.value){
                    a.zsmkbjsize=b.label;
                  }
                }
              }
              if (a.zsmkbjstate != "") {
                if (a.zsmkbjstate == "true") {
                  a.zsmkbjstate = "开启"
                } else {
                  a.zsmkbjstate = "关闭"
                }
              }
              if(a.zsmkbjtype!="null"){
                for(var k=0;k<this.btTypeData.length;k++){
                  var b=this.btTypeData[k];
                  if(a.zsmkbjtype==b.value){
                    a.zsmkbjtype=b.label;
                  }
                }
              }
              if(a.zsmkbjmultiple!="null"){
                for(var j=0;j<this.mulitpleData.length;j++){
                  var b=this.mulitpleData[j];
                  if(a.zsmkbjmultiple==b.value){
                    a.zsmkbjmultiple=b.label;
                  }
                }
              }
            if(a.zsmkbjZsmkId!=""){
                for(var j=0;j<zsdata.length;j++){
                  var b=zsdata[j];
                  if(a.zsmkbjZsmkId==b.id){
                    a.zsmkbjZsmkId=b.zsmkmc;
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

  @action onbzmkRowChange = (selectedRowKeys, records)=> {
    this.bzmkSelectedData = records;
  }

  @action setbzmkParams = async (params, nosearch) => {
    this.szqueryKey = params;
    await this.findAllBzmk();
  }

  @action async findAllBzmk () {
     this.bzloading = true;
    try {
     var xdataS = await BzmkService.findForKey(this.szqueryKey);
        this.szdataSource=[];
        if(xdataS.length>0){
            this.listdata=[];
              for(var i=0;i<xdataS.length;i++){
              var a = xdataS[i];
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
            xdataS=this.listdata;
          }
      this.szdataSource=xdataS;
      this.bzloading = false;
    } catch (err) {
      this.xzloading = false;
      throw err;
    }
  }

  @action uploadfile = async (values) => {

       let l = this.selectRowKeys;
      var sdata= await ZsmkbjService.uploadfile(values);
          
      this.queryfjData();
  }

  @action queryfjData  = async () =>{
    try {
      this.fjdataSource=[];
      var zsdata = await ZsmkbjService.findfjList({bzmkbjid:this.bzmkbjid});
      this.fjdataSource=zsdata;
      this.fjloading = false;
      this.modalfjVisible = false;
      
    } catch (err) {
      this.fjloading = true;
      throw err;
    }
  }

    /**
   * 删除操作
   */
  @action deletefj = async (record) => {
    try {
      this.fjdataSource=[];
      await ZsmkbjfjService.delete(this.bzmkbjid,record);
      var zsdata = await ZsmkbjService.findfjList({bzmkbjid:this.bzmkbjid});
      this.fjdataSource=zsdata;
      this.fjloading = false;
      this.modalfjVisible = false;
    } catch (err) {
      this.fjloading = false;
      throw err;
    }
  }

  @action showEditFjForm = (opt, editRecord) => {
    this.fjopt = opt;
    this.modalfjVisible = true;
    this.editfjRecord = editRecord;
  }

  @action closeEditFJForm = () => {
    this.modalfjVisible = false;
  }

  @action savefjData = async (values) => {
    try {
      await ZsmkbjfjService.update(this.editfjRecord.zsmkbjfjfileid, values);
       this.queryfjData();
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }


}

export default new ZsmkbjStore();