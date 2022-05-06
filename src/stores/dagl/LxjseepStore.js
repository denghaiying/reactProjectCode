import React from 'react';
import { action, observable, runInAction,makeObservable } from 'mobx';
import {Message} from '@alifd/next';
import BaseStore from '../BaseStore';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import LoginStore from '@/stores/system/LoginStore';
class LxjseepStore extends BaseStore {
    //带参上传
    @observable uploadparams = {};
    @action setUploadparams = (params) => {
        this.uploadparams=params
    }


  constructor(url, wfenable, oldver = true) {
    super(url,wfenable,oldver);
    makeObservable(this);
  }

    @action importEepInfo = (option) => {
        const param = new FormData();
        if (option.data) {
            Object.keys(option.data).forEach(k => {
                param.append(k, option.data[k]);
            });
        }
        param.append("file", option.file);
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (option && option.onProgress) {
            config.onUploadProgress = ((e) => {
                if (e.lengthComputable) {
                    if (e.total > 0) {
                        e.percent = (e.loaded / e.total) * 100;
                    }
                } else {
                    e.percent = 100;
                }
                option.onProgress(e);
            });
        }
        fetch.post("/api/eps/control/main/gszxyjcx/importEepInfo", param, config).then(res => {
            if (res.status === 200) {
                const d = res.data;

                return Message.success("上传成功！", 1.5);
            }else{
                return Message.error("上传失败！", 1.5);
            }
        });
    }
}


export default new LxjseepStore('/api/eps/control/main/gszxyjcx', true, true);
