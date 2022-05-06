import React from 'react';
import { observable, action, runInAction } from 'mobx';

import BaseStore from '../BaseStore';
import util from '../../utils/util';
import fetch from '../../utils/fetch';


class PtinfoStore {
  @observable theme = null;
  @observable menutype = 'M';
  @observable tbg = null;
  @observable sysinfo = {};


  @action setEditLogoImage = async (logo) => {
    this.editRecord.ptinfoLogo = logo;
  }
  @action setEditTbgImage = async (tbg) => {
    this.editRecord.ptinfoTbg = tbg;
  }
  @action setTheme = (theme) => {
    if (theme === 'orange') {
      // eslint-disable-next-line no-underscore-dangle
      window.__changeTheme__('@alifd/theme-e9-orange2');
    } else {
      // eslint-disable-next-line no-underscore-dangle
      window.__changeTheme__('@alifd/theme-e9');
    }
    this.theme = theme;
  }

  @action findEditData = async () => {
    this.editRecord = { ...this.record };
  }

  @action find = async () => {
    const response = await fetch.get('/api/sysapi/ptinfo/queryForId');
    if (response.status === 200) {
   //   runInAction(() => {
        this.sysinfo = response.data;
        console.log("xtxx",response.data);
        document.title = this.sysinfo.xtmc;
   //   });
    }


    // const record = await this.findById('0000');
    // runInAction(() => {
    //   this.record = record;
    //   this.theme = record.ptinfoTheme;
    //   if (record.ptinfoTheme === 'orange') {
    //     // eslint-disable-next-line no-underscore-dangle
    //     window.__changeTheme__('@alifd/theme-e9-orange2');
    //   } else {
    //     // eslint-disable-next-line no-underscore-dangle
    //     window.__changeTheme__('@alifd/theme-e9');
    //   }
    //   this.menutype = record.ptinfoMenutype;
    //   this.record.pwdiff = record.ptinfoPwdiff === 1;
    //   document.title = record.ptinfoName;
    //   if (record.ptinfoLogo) {
    //     const img = document.createElement('img');
    //     img.src = record.ptinfoLogo;
    //     this.fav.image(img);
    //     // this.fav.badge(1);
    //   }
    // });
  }

  @action resetRecord = (json) => {
    this.editRecord = json;
    this.editRecord.ptinfoPwdiff = json.pwdiff ? 1 : 0;
  }

  @action save = async () => {
    const res = await fetch.patch(`${this.url}/0000`, this.editRecord);
    // 保存成功后，更新信息
    if (res && res.status === 201) {
      const record = res.data;
      runInAction(() => {
        this.record = record;
        this.theme = record.ptinfoTheme;
        if (record.ptinfoTheme === 'orange') {
          // eslint-disable-next-line no-underscore-dangle
          window.__changeTheme__('@alifd/theme-e9-orange2');
        } else {
          // eslint-disable-next-line no-underscore-dangle
          window.__changeTheme__('@alifd/theme-e9');
        }
        this.menutype = record.ptinfoMenutype;
        this.record.pwdiff = record.ptinfoPwdiff === 1;
        document.title = record.ptinfoName;
        if (record.ptinfoLogo) {
          const img = document.createElement('img');
          img.src = record.ptinfoLogo;
          this.fav.image(img);
        }
      });
    }
  }

  downloadfile () {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/regfile`, { responseType: 'blob' }).then(
        response => {
          if (response.status === 200) {
            const type = response.headers['context-type'] && 'application/octet-stream';
            let filename = response.headers['content-disposition'];
            const pos = filename.indexOf('filename=');
            if (pos > 0) {
              filename = filename.substring(pos + 9);
              if (filename.indexOf('"') > -1) {
                filename = filename.substring(1, filename.length - 1);
              }
            }
            const blob = new Blob([response.data], { type });
            const url = window.URL.createObjectURL(blob);
            const aLink = document.createElement('a');
            aLink.style.display = 'none';
            aLink.href = url;
            aLink.setAttribute('download', decodeURIComponent(filename));
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        }
      ).catch(err => {
        reject(util.bussinessException(err.response.status, err.response.data));
      });
    });
  }

  @action download = async () => {
    await this.downloadfile();
  }

  @action upload = async (file) => {
    const request = await this.uploadFile(file);
    if (request.status === 200) {
      runInAction(() => {
        this.record = request.data;
      });
    }
  }
}


export default  new PtinfoStore();

