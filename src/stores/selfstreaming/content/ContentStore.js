import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../../BaseStore';
import ContentService from '../../../services/selfstreaming/content/ContentService';
import diagest from '../../../utils/diagest';
import fetch from '../../../utils/fetch';
import axios from 'axios';
import loginStore from '../../../stores/system/LoginStore';




class ContentStore extends BaseStore {
 
  @observable docModalVisible = false;
  @observable fjModalVisible = false;
  @observable channelData= [];
  @observable docRecord = {};
  @observable fjdocRecord = {};
  @observable fjdata = [];
  @observable wrkTbl = 'CONTENT';
  @observable docTbl = 'CONTENT_FJ';
  @observable docGrpTbl = 'CONTENT_FJFZ';
  @observable fjdata = [];
  @observable params = {};
  @observable fjloading = false;
  @observable fjpageno = 1;
  @observable fjpagesize = 10;
  @observable fjselectRowKeys = [];
  @observable fjselectRowRecords = [];
  @observable treedata= [];
  @observable doctypelx= '所有';
  @observable doctypeList=[];
  @observable listdata =[];
  
  @observable columns =[
      {
        title: 'e9.content.content.contentfjs',
        dataIndex: 'contentfjs',
        width: 90,
      },
      {
        title:  'e9.content.content.contenttitle',
        dataIndex: 'contenttitle',
        width: 120,
      },
       {
        title:  'e9.content.content.contentfbstate',
        dataIndex: 'contentfbstate',
        width: 120,
      },
       {
        title:  'e9.content.content.contentchannelid',
        dataIndex: 'contentchannelid',
        width: 120,
      },
      {
        title:  'e9.content.content.contentauthor',
        dataIndex: 'contentauthor',
        width: 90,
      }, 
      {
        title:  'e9.pub.whsj',
        dataIndex: 'contentwhsj',
        width: 90
      }];

  @observable fjcolumns =
    [{
      title: 'e9.content.content.fjtitle',
      dataIndex: 'title',
      width: 150,
      lock: true,
    },{
      title: 'e9.content.content.filename',
      dataIndex: 'filename',
      width: 150,
      lock: true,
    },{
      title:'e9.content.content.ext',
      dataIndex: 'ext',
      width: 150,
      lock: true,
    },{
      title:'e9.content.content.size',
      dataIndex: 'size',
      width: 150,
      lock: true,
    }, {
      title:'e9.content.content.lx' ,
      dataIndex: 'lx',
      width: 200,
      cell: (value) => {
          if(this.doctypeList.length>0){
              for(var j=0;j<this.doctypeList.length;j++){
              var b=this.doctypeList[j];
              if(value==b.code){
               return b.name;
              }
            }
          }
      },
    }, {
      title:'e9.content.content.bbh' ,
      dataIndex: 'bbh',
      width: 200,
    }, {
      title:'e9.content.content.md5code' ,
      dataIndex: 'md5code',
      width: 200,
    }];


  @action setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryData();
    }
  }


  @action queryData  = async () => {
    this.loading = true;
    try {
      var xdataS = await ContentService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.listdata=[];
        if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.contentchannelid!=""){
              for(var j=0;j<this.channelData.length;j++){
                  var b=this.channelData[j];
                  if(a.contentchannelid==b.channelid){
                    a.contentchannelid=b.channelname
                }   
              }
            }
          if (a.contentfbstate != "") {
           if (a.contentfbstate == "0") {
                a.contentfbstate = "未发布"
              } else {
                a.contentfbstate = "已发布"
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
      var xdataS = await ContentService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.listdata=[];
        if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.contentchannelid!=""){
              for(var j=0;j<this.channelData.length;j++){
                  var b=this.channelData[j];
                  if(a.contentchannelid==b.channelid){
                    a.contentchannelid=b.channelname
                }   
              }
            }
          if (a.contentfbstate != "") {
           if (a.contentfbstate == "0") {
                a.contentfbstate = "未发布"
              } else {
                a.contentfbstate = "已发布"
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
       var xdataS = await ContentService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.listdata=[];
        if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.contentchannelid!=""){
              for(var j=0;j<this.channelData.length;j++){
                  var b=this.channelData[j];
                  if(a.contentchannelid==b.channelid){
                    a.contentchannelid=b.channelname
                }   
              }
            }
          if (a.contentfbstate != "") {
           if (a.contentfbstate == "0") {
                a.contentfbstate = "未发布"
              } else {
                a.contentfbstate = "已发布"
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

  @action delete = async (id) => {
    const response = await fetch.delete(`${this.url}/${encodeURIComponent(id)}`);
    if (response && response.status === 204) {
      var xdataS = await ContentService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.listdata=[];
        if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.contentchannelid!=""){
              for(var j=0;j<this.channelData.length;j++){
                  var b=this.channelData[j];
                  if(a.contentchannelid==b.channelid){
                    a.contentchannelid=b.channelname
                }   
              }
            }
          if (a.contentfbstate != "") {
           if (a.contentfbstate == "0") {
                a.contentfbstate = "未发布"
              } else {
                a.contentfbstate = "已发布"
              }
          }
            this.listdata.push(a);
          }
          xdataS.list=this.listdata;
        }
       this.data=xdataS;
    }
  }


  @action saveData = async (values) => {
    try {
      if (this.opt === 'edit') {
         await ContentService.updatesome(this.editRecord.id, values);
      } else {
        await ContentService.add(values);
      }
      this.editVisible = false;
      this.loading = true;
       var xdataS = await ContentService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.listdata=[];
        if(xdataS.list.length>0){
        var xdata=xdataS.list;
            for(var i=0;i<xdata.length;i++){
            var a=xdata[i];
            if(a.contentchannelid!=""){
              for(var j=0;j<this.channelData.length;j++){
                  var b=this.channelData[j];
                  if(a.contentchannelid==b.channelid){
                    a.contentchannelid=b.channelname
                }   
              }
            }
          if (a.contentfbstate != "") {
           if (a.contentfbstate == "0") {
                a.contentfbstate = "未发布"
              } else {
                a.contentfbstate = "已发布"
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
    const response = await fetch.post('/streamingapi/channel/findList', { params: {} });
    if (response && response.status === 200) {
      runInAction(() => {
        this.channelData = response.data;
      });
    }
  }


  @action saveDataUse = async (values) => {
    values = this.beforeSaveData(values);
    let response;
       if (this.opt === 'edit') {
      response = await fetch
        .put(`${this.url}/${encodeURIComponent(this.editRecord.contentid)}`, values);
      this.queryData();
    } else {
      response = await fetch.post(this.url, values);
    }
    if (response && response.status === 201) {
      this.editVisible = false;
      this.queryData();
    }
  }

  @action onRDocecordChange = (value) => {
    this.docRecord = value;
  }

  @action treeSelect = (value) => {
    this.doctypelx = value;
    this.queryForFJPage();
  }

  @action updatecontentDesc = async (values) => {
    let response;
    response = await fetch .put(`${this.url}/updatecontentDesc`, values);
    if (response && response.status === 201) {
      this.docModalVisible = false;
      this.queryData();
    }

  }

    @action queryForFJPage = async () => {
    this.fjloading = true;
    this.params={};
    this.fjdata=[];
    
    if(this.docRecord.contentfilegrpid==""||this.docRecord.contentfilegrpid==undefined){
        console.log("11");
        this.params.grpid="11";
    }else{
        this.params.grpid=this.docRecord.contentfilegrpid;
    }
    this.params.daktmid=this.docRecord.contentid;
    this.params.grptbl=this.docGrpTbl;
    this.params.doctbl=this.docTbl;
    this.params.sfzxbb='1';
    if(this.doctypelx!="所有"){
      this.params.lx=this.doctypelx;
    }
    const response = await fetch.post("/streamingapi/ftpattachdoc/attachdocfindForPage", this.params, { params: { pageno: this.fjpageno, pagesize: this.fjpagesize } });
    if (response && response.status === 200) {
        this.fjdata = this.afterQueryData(response.data);
        this.fjloading = false;
    } else {
      this.fjloading = true;
    }


 
      /* */
  }

   @action querydoctypeList = async () => {
     const terrresponse = await fetch.post("/streamingapi/ftpdoctype/doctypefindList",{});
       if (terrresponse && terrresponse.status === 200) {
         this.doctypeList= terrresponse.data;
          var sjdata={};
          sjdata.label='所有';
          sjdata.key='所有';
          sjdata.children=[];
          var achildlist= terrresponse.data;
          if(achildlist.length>0){
            for (var i = 0, l = achildlist.length; i < l; i++) {
                        var dacty = achildlist[i];
                        var sjd={};
                        sjd.key=dacty.code;
                        sjd.label= dacty.code + "|" + dacty.name;
                        sjdata.children.push(sjd);
              }
            }
            const ssdf=[];
            ssdf.push(sjdata);
            this.treedata=ssdf;
      }
   }


  @action setFJPageNo = async (pageno) => {
    this.fjpageno = pageno;
    await this.queryForFJPage();
  }

  @action setFJPageSize = async (pageSize) => {
    this.fjpagesize = pageSize;
    await this.queryForFJPage();
  }

  @action closeDocDailog = async (visible) => {
    this.docModalVisible = visible;
  };

  @action showDocDailog = (opt, docRecord) => {
    this.docModalVisible = true;
    this.docRecord = this.beforeSetEditRecord(docRecord[0]);
  }

  @action setFjSelectRows = async (selectRowKeys, selectRowRecords) => {
    this.fjselectRowKeys = selectRowKeys;
    this.fjselectRowRecords = selectRowRecords;
  }

  @action closeFjDailog = async (visible) => {
    this.fjModalVisible = visible;
  };
  @action showFjDailog = async (opt, docRecord) => {
    this.fjModalVisible = true;
    this.docRecord = this.beforeSetEditRecord(docRecord[0]);
    this.querydoctypeList();
    this.queryForFJPage();
  }

  @action deleteFjData = async (id) => {
    this.params={};
    this.params.grpid=this.docRecord.contentfilegrpid;
    this.params.daktmid=this.docRecord.contentid;
    this.params.grptbl=this.docGrpTbl;
    this.params.doctbl=this.docTbl;
    this.params.wktbl=this.wrkTbl;
    this.params.fileid=id;
    this.params.sfzxbb='1';
    const response = await await fetch.post("/streamingapi/ftpattachdoc/attachdocdelete", this.params, {});
    if (response && response.status === 200) {
      this.queryForFJPage();
    }
      this.queryData();
    
  }

  @action updatecontentfb = async (docRecord) => {
    let response;
    this.docRecord = this.beforeSetEditRecord(docRecord[0]);
    this.docRecord.contentfbstate="1";
    this.docRecord.contentauthor=loginStore.userinfo.yhmc;
    response = await fetch .put(`${this.url}/updatecontentfb`, this.docRecord);
    if (response && response.status === 201) {
      this.queryData();
    }
  }
  
  @action handleFileChange= async (e) => {
       let file = e.target.files[0];
        var aa=this.docRecord;
        var filegrpid=aa.contentfilegrpid;
         if (!aa.contentfilegrpid) {
             var s = await fetch.post("/streamingapi/ftphttp/ftphttpgetGuid", {});
            filegrpid = s.data;
        }
          
        var a = {id: aa.contentid}
       let formData = new FormData();
        formData.append("wrkTbl",this.wrkTbl);
        formData.append("docTbl",this.docTbl);
        formData.append("docGrpTbl",this.docGrpTbl);
        formData.append("grpid",filegrpid);
        formData.append("daktmid",aa.contentid);
        formData.append("tybz",'N');
        formData.append("lx",this.doctypelx);
        formData.append("file", file);
        var s = await  fetch.post('/streamingapi/ftphttp/fileUpload', formData);
        this.queryForFJPage();
        this.queryData();

  }
  
   @action downFj = async (docRecord) => {
     
    this.fjdocRecord = this.beforeSetEditRecord(docRecord[0]);
    this.params={};
    this.params.fileid=this.fjdocRecord.fileid;
    this.params.daktmid=this.docRecord.contentid;
    this.params.grpid=this.docRecord.contentfilegrpid;
   
    this.params.grptbl=this.docGrpTbl;
    this.params.doctbl=this.docTbl;
    this.params.wktbl=this.wrkTbl;
   
    this.params.downlx='01';
    this.params.mkbh='';
    var fileid =this.fjdocRecord.fileid;
 

          window.location.href = '/streamingapi/ftphttp/downloadfj?fileid=' + fileid + '&daktmid=' + this.docRecord.contentid
                        + '&grpid=' + this.docRecord.contentfilegrpid + '&doctbl=' + this.docTbl
                        + '&grptbl=' + this.docGrpTbl + '&mkbh=' + null
                        + '&downlx=01';
                      
                      /*
    const response = await await fetch.post("http://localhost:8850/ftp/ftphttp/download", this.params, {});

    if (response && response.status === 200) {
      const blob = new Blob([response.data])
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url; 
        link.setAttribute('download', this.fjdocRecord.filename+"."+this.fjdocRecord.ext);
        document.body.appendChild(link);
        link.click();
    }
      */

    

  }

}
export default new ContentStore('/streamingapi/content');
