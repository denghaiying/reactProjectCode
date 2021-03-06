import { observable, action, runInAction, makeObservable } from 'mobx';
import BaseStore from '@/stores/BaseStore';
import fetch from "@/utils/fetch";
import axios from "axios";
import * as qs from "qs";

class ApplyStore extends BaseStore {
  fileshow = false;
  fileparams = {};
  printshow = false;
  fileData = "";
 // reportName="Blank_A4_1";
  reportName="yjsq";
  dataJson="";
  param={};
   Umid = "DAGL023";
  uploadVisible = false;
  yprintUrl="";
  printVisible = false;
  detailParams={};
  fid="";
  detailSelectRowKeys:string[]=[];
  detailSelectRows:any[]=[];

  

  constructor(url, wfenable, oldver = true) {
    super(url,wfenable,oldver);
    makeObservable(this);
  }


  @action setFileData = async (fileData) => {
    this.fileData = fileData;
  }
  
  setDetailParams=(detailParams)=>{
    runInAction(()=>{
      this.fid=detailParams.fid;
      this.detailParams=detailParams
    })
   
  }

  setDetailSelectRowKeys=(selectRowKeys,selectRows)=>{
    runInAction(()=>{
      this.detailSelectRowKeys=selectRowKeys;
      this.detailSelectRows=selectRows;
    })
   
  }

  setFid=(id)=>{
    runInAction(()=>{
      this.fid=id;
    })
   
  }


  @action showFile = async (fileshow, params) => {
    this.fileshow = fileshow;
    if (fileshow) {
      this.fileparams = params;
    }
  }

  @action reportPrint = async (id) => {


    let urls = "/api/eps/control/main/yjsp/queryReport?id=" + id+"&umid="+this.Umid;
    const response = await fetch.get(urls);
    if (response && response.status === 200) {

      //  this.yjsqdate = response.data.results;
  //    let data1 = response.data.message;
      let data1=response.data.results;
      this.param=data1;
      let reportName1=data1.reportName;
      this.param["data"] = data1.data;
      this.param["paramter"]=data1.paramter;

   //   let param = {};
    /*  this.param["yjdw"] = data1.yjdw;
      this.param["jsdw"] = data1.jsdw;
      this.param["yjr"] = data1.yjr;
      this.param["jsr"] = data1.jsr;
      this.param["data"] = data1.data;*/


      axios({ // ???axios??????post??????
        method: 'post',
        url: 'http://localhost:8180/offline/report/apiMap/print/'+reportName1, // ????????????
        data: this.param // ??????
    //    responseType: 'blob' // ??????????????????????????????????????????
      })
           .then(response => {

             if(response.status == 200) {

               this.fileData = response.data;
        //      this.printshow=true;
               const pdfurl = encodeURIComponent(
                   "/api/eps/offline/report/loadpdf?file="
                   + this.fileData);

               this.yprintUrl=  '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + '&printfile=1&downfile=1';
               //  window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=1&downfile=1");
             }else {
               return false;
             }
           })
           .catch(function (error) {
             console.log(error);
           });
     } else {
       this.loading = true;
     }

  }

  queryForPageUrl = "/queryDetailForPage";
  // queryByIdUrl = "/queryYjspmxForId";
  addUrl = "/addDetail";
  updateUrl = "/updDetail";




  @action reSetData = async (record) => {
    const { results } = this.data;
    if (results) {
      this.data.results = results.map(m => m.id == record.id ? record : m);
    }
    const fd = new FormData();
    for (const key in record) {
      fd.append(key, record[key]);
    }
    await fetch
      .put(`${this.url}${this.updateUrl}`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
  }


}

export default new ApplyStore('/api/eps/control/main/kfjdsp', true, true);
