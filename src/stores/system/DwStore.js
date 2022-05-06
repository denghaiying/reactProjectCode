import { observable, action, runInAction } from "mobx";
import BaseStore from "../BaseStore";
import SysStore from '../system/SysStore';
import fetch from "../../utils/fetch";
import moment from 'moment';
import { ConsoleSqlOutlined } from "@ant-design/icons";

class DwStore{

    url="";
    wfenable=false;
    oldver=true;
    constructor(url, wfenable, oldver = true) {
      this.url = url;
      this.wfenable = wfenable;
      this.oldver = oldver;
    //   makeObservable(this);
    }


    /**
     * 获取当前用户名称
     */
    @observable yhmc = SysStore.getCurrentUser().yhmc

    /**
     * 获取当前用户ID
     */
    @observable yhid = SysStore.getCurrentUser().id

    /**
     * 获取当前用户所在单位ID
     */
    @observable dw_id = SysStore.getCurrentCmp().id

    /**
     * 获取当前用户所在单位名称
     */
    @observable dw_mc = SysStore.getCurrentCmp().dwname


    /**
     * 不查询的dwid
     */
    @observable notid = "";


    /**
     * 获取当前时间
     */
    @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    /**
     * 接收返回的结果状态
     */
    @observable returnRepones = 0;




    @observable page_No = 1;
    @observable page_Size = 20;

    @observable dwbh = "";
    @observable dwmc = "";
    @observable dwList="";


    /**
     * 重写父类方法
     * @param {*} pageSize
     */
     setPageSize = (pageSize) => {
        this.pagesize = pageSize;
        this.queryDwList();
    }
    /**
     * 重写父类方法
     * @param {*} pageno
     */
     setPageNo = (pageno) => {
        this.pageno = pageno;
        this.queryDwList();
    }

     queryTreeDwList = async () => {
        if (!this.dwData || this.dwData.length === 0) {
            this.loading = true
            const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
            if (response.status === 200) {
               /* runInAction(() => {*/
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.title = newKey.mc
                            sjData.push(newKey)
                        }
                        this.dwTreeData = sjData;
                    }
                    //this.dwTreeData=response.data;
                    this.loading = false
                    return;
                /*});*/
            }
        }
    }


    queryForList = async (dwid) => {
        if (!this.dwData || this.dwData.length === 0) {
            const response = await fetch.get(`/api/eps/control/main/dw/queryForList`);
            if (response.status === 200) {
              //  runInAction(() => {

                    this.dwList=response.data;
                    return;
             //   });
            }
        }
    }



    @action queryDwList = async () => {
       // if (!this.dwData || this.dwData.length === 0) {
            this.loading = true
            const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid?yhid=${this.yhid}&notid=${this.notid}&dwbh=${this.dwbh}&dwmc=${this.dwmc}&pageIndex=${this.page_No - 1}&pageSize=${this.page_Size}&page=${this.page_No - 1}&limit=${this.page_Size}`);
            if (response.status === 200) {
               // runInAction(() => {
                    var sjData = [];
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            let newKey = {};
                            newKey = response.data[i];
                            newKey.key = newKey.id
                            newKey.title = newKey.mc
                            sjData.push(newKey)
                        }
                        this.dwData = sjData;
                        this.dwTotal = sjData.length;
                    }
                    this.loading = false
                    return;
               // });
            }
        //}
    }


}

export default new DwStore("/api/eps/control/main/dw");
