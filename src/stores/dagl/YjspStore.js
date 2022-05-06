import { observable, action, runInAction } from 'mobx';
import BaseStore from '../BaseStore';
import fetch from "@/utils/fetch";
import axios from "axios";
import * as qs from "qs";

class YjspStore extends BaseStore {
  @observable fileshow = false;
  @observable fileparams = {};
  @observable printshow = false;
  @observable fileData = "";
 // @observable reportName="Blank_A4_1";
  @observable reportName="yjsq";
  @observable dataJson="";
  @observable param={};
  @observable  Umid = "DAGL023";
  @observable uploadVisible = false;
  @observable yprintUrl="";
  @observable printVisible = false;

  @action setFileData = async (fileData) => {
    this.fileData = fileData;
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


      axios({ // 用axios发送post请求
        method: 'post',
        url: 'http://localhost:8180/offline/report/apiMap/print/'+reportName1, // 请求地址
        data: this.param // 参数
    //    responseType: 'blob' // 表明返回服务器返回的数据类型
      })
           .then(response => {

             if(response.status == 200) {

               this.fileData = response.data;
        //      this.printshow=true;
               const pdfurl = encodeURIComponent(
                   "/eps/offline/report/loadpdf?file="
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


}

export default new YjspStore('/api/eps/control/main/yjsp', true, true);
