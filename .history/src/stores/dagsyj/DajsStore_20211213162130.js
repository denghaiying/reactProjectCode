import React from 'react';
import {action, makeObservable, observable, runInAction} from 'mobx';
import BaseStore from '../BaseStore';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import LoginStore from '@/stores/system/LoginStore';
import IceNotification from '@icedesign/notification';

class DajsStore extends BaseStore {
    // querySjzd 查询数据字典 zdx: 证件名称

    @observable progressValue = 0;
    @observable percentage = 0;
    @observable sxjcresult = {};
    @observable zsxresult = false;
    @observable wzxresult = false;
    @observable kyxresult = false;
    @observable aqxresult = false;
    @observable jczt = false;
    @observable jcjg ="";
    @observable formdata ={};
    constructor(url, wfenable, oldver = true) {
        super(url,wfenable,oldver);
        makeObservable(this);
    }

    @action xduoJc = async (paramid) => {
        const fd = new FormData();
        fd.append('id', paramid);
        fd.append('whrid', SysStore.getCurrentUser().id);
        fd.append('whr', SysStore.getCurrentUser().yhmc);
        fd.append('sqdbmc', "GSYJSQD");
        fetch.post(`/api/eps/control/main/gsyjsqd/duoJc`, fd, {responseType: 'json'}).then(resp => {
            if (resp.status === 200) {
                this.progressValue = 40;
                let timer = null;
                if (timer == null) {
                    timer = setInterval(() => {
                    const params = {id: paramid};
                    fetch.get(`/api/eps/control/main/gsyjsqd/queryForId`, {params}).then(gszxyjsqd => {
                       if (gszxyjsqd.data.jczt === "Y") {
                                        this.jczt = true;
                                        this.progressValue = 100;
                                        this.opt = "edit";
                                        clearInterval(timer);
                                        fetch.get(`/api/api/sxjcjgz/sxjcjgxq?jcbc=`+paramid, {}).then(sxjcjgxq => {
                                            const fd = new FormData();
                                            fd.append('id', paramid);
                                            fd.append('zsx', sxjcjgxq.data.zsx == undefined ? "" : sxjcjgxq.data.zsx);
                                            fd.append('qzx', sxjcjgxq.data.wzx == undefined ? "" : sxjcjgxq.data.wzx);
                                            fd.append('kyx', sxjcjgxq.data.kyx == undefined ? "" : sxjcjgxq.data.kyx);
                                            fd.append('aqx', sxjcjgxq.data.kkx == undefined ? "" : sxjcjgxq.data.kkx);
                                            fetch.post(`/api/eps/control/main/gsyjsqd/uploadjg`, fd, {responseType: 'json'}).then(resp => {
                                            });
                                          //  this.editRecord = {...v, ...ywresult};
                                        });
                                    }else if (gszxyjsqd.data.jczt === "N"){
                                       this.jcjg=gszxyjsqd.data.jcjg;
                                    }
                                });

                }, 10000);
                }
            }
        });
    }




    @action setTmmer = (a) => {
        this.progressValue = a;
    };

}


export default new DajsStore('/api/eps/control/main/gsyjsqd', true, true);
