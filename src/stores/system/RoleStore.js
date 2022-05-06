import { observable, action, runInAction } from "mobx";
import BaseStore from "../BaseStore";
import SysStore from '../system/SysStore';
import fetch from "../../utils/fetch";
import LoginStore from '../system/LoginStore';
import moment from 'moment';

class RoleStore  {


    url="";
    wfenable=false;
    oldver=true;
    constructor(url, wfenable, oldver = true) {
      this.url = url;
      this.wfenable = wfenable;
      this.oldver = oldver;

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

    @observable roleCode=SysStore.getCurrentUser().golbalrole


    /**
     * 不查询的dwid
     */
    @observable notid = "";




    /**
     * 获取当前时间
     */
    @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    /**
     * 查看窗口
     */
    @observable visible = false;
    /**
     * 审核窗口
     */
    @observable add_visible = false;

    @observable cancel_add_visible = false;
    /**
     * 接收返回的结果状态
     */
    @observable returnRepones = 0;

    /**
     * 是否停用
     */
    @observable tybz = 'N';
    /**
    * 是否默认角色
    */
    @observable sfmryh = 'N';


    /**
   * 审核窗口
   */
    @observable selectId = "";

   // @observable dwData = [];

    @observable dwTreeData=[];

    @observable dwTotal = 0;


    /**
     * 复制角色到单位
     */
    @observable roleIds = [];

    @observable dwIds = [];


    @observable page_No = 1;
    @observable page_Size = 10;

    @observable dwbh = "";
    @observable dwmc = "";


    @action queryTreeDwList = async () => {
        // if (!this.dwTreeData || this.dwTreeData.length === 0) {
        //     this.loading = true
        //     const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
        //     if (response.status === 200) {
        //        runInAction(() => {
        //             var sjData = [];
        //             if (response.data.length > 0) {
        //                 for (var i = 0; i < response.data.length; i++) {
        //                     let newKey = {};
        //                     newKey = response.data[i];
        //                     newKey.key = newKey.id
        //                     newKey.title = newKey.mc
        //                     sjData.push(newKey)
        //                 }
        //                 this.dwTreeData = sjData;
        //                 this.dwTotal = sjData.length;
        //             }
        //             this.loading = false
        //             return;
        //        });
        //     }
        // }

        if (!this.dwTreeData || this.dwTreeData.length === 0) {

            if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
              const response = await fetch.get(`/api/eps/control/main/dw/queryForList_e9_superUser`);
              if (response.status === 200) {
                runInAction(() => {
                  var sjData = [];
                  if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                      let newKey = {};
                      newKey = response.data[i];
                      newKey.key = newKey.id;
                      newKey.title = newKey.mc;
                      sjData.push(newKey);
                    }
                    this.dwTreeData = sjData;
                    this.dwTotal = sjData.length;
                  }
                  return;
                });
              }
            } else {
              const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
              if (response.status === 200) {
                runInAction(() => {
                  var sjData = [];
                  if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                      let newKey = {};
                      newKey = response.data[i];
                      newKey.key = newKey.id;
                      newKey.title = newKey.mc;
                      sjData.push(newKey);
                    }
                    this.dwTreeData = sjData;
                    this.dwTotal = sjData.length;
                  }
                  return;
                });
              }
            }
          }


    }
}

export default new RoleStore("/api/eps/control/main/role");
