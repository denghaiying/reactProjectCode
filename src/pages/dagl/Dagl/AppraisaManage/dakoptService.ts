import BaseService from '@/eps/commons/v2/BaseService';
import SysStore from '@/stores/system/SysStore';
import { message } from 'antd';
import { reject } from 'lodash';

class DakoptService extends BaseService {
  // 用户 id
  yhid = SysStore.getCurrentUser().id;
  // 用户 bh
  yhbh = SysStore.getCurrentUser().bh;
  // 用户 mc
  yhmc = SysStore.getCurrentUser().yhmc;
  // 获取当前默认单位id
  dwid = SysStore.getCurrentUser().dwid;
  // 获取当前默认部门id
  bmid = SysStore.getCurrentUser().bmid;

  // 获取菜单
  // @ts-ignore
  findAll(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dakqx/queryYhDakopts', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 获取菜单
  // @ts-ignore
  findqx(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dakqx/getDakopts', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  // DAK0005生成档案
  // @ts-ignore
  genDh(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: `${this.url}/genDh`, params })
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  // DAK0038 页数转页次
  // Dak0039 页次转页数
  yszyc(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: `${this.url}/yszyc`, params })
        .then((res) => {
          if (res) {
            return resolve(res.data);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0002 归入整编 提交
  submitTmzt(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: `/api/eps/control/main/dagl/submitTmzt`, params })
        .then((res) => {
          if (res) {
            return resolve(res.data);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0006 清除档号
  // @ts-ignore
  clearDh(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: '/api/eps/control/main/dagl/clearDh', params })
        .then((res) => {
          if (res) {
            return resolve(res.data);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0003 取消归档
  // @ts-ignore
  returnTmzt(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: `/api/eps/control/main/dagl/returnTmzt`, params })
        .then((res) => {
          if (res) {
            return resolve(res.data);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0015 拆卷
  chaiJuan(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/chaiJuan', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0088 加入利用大厅
  // @ts-ignore
  addLydt(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dalydj/add2lydt', data: params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 全文检索 加入利用大厅
  // @ts-ignore
  epssearchAddLydt(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dalydj/add3lydt', data: params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0020 公式计算
  // @ts-ignore
  formulaCalculate(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/formulaCalculate', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0064 日志
  // @ts-ignore
  queryMbzlxByKey(filters) {
    return new Promise((resolve, reject) => {
      return super
        .post({
          url:
            '/api/eps/control/main/mbzlx/queryByKey?sxid=SX04&mbid=' +
            filters.mbid,
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          const tm = res.data;
          let jnid = '';
          let jntm = '';

          const sr = filters.selectRecords;
          for (let i = 0; i < sr.length; i++) {
            jnid += ',' + sr[i].id;
            const mc = tm.mc.toString();
            jntm = sr[i][mc.toLowerCase()];
          }

          const param = {
            id: jnid.substring(1),
            tm: jntm,
          };

          return resolve(param);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  // DAK0065 档案审核
  // @ts-ignore
  updateDaztShsj(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/updateDaztShsj', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0054 取消装盒
  // @ts-ignore
  doQxzhAction(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: '/api/eps/control/main/hgl/qxzh', params })
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0130 流程状态退回
  returnLcfzzt(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: '/api/eps/control/main/dagl/returnLcfzzt', params })
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 统一刷新方法
  // @ts-ignore
  doRefreshLsh(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/refreshDakPx', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 根据 code 查询
  queryParamsValueById(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({
          url: '/api/eps/control/main/params/queryParamsValueById',
          params,
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 删除到回收站
  deleteToHsz(params) {
    debugger;
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: `/api/eps/control/main/dagl/deleteToHsz`, params })
        .then((res) => {
          if (res) {
            return resolve(res.data);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0011 DAK0201 批量挂接saveTmid
  saveTmid(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: '/api/eps/control/main/dagl/saveTmid', params })
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 0016 AIP导出
  // @ts-ignore
  addEepinfo(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: '/api/eps/control/main/dagl/addEepinfo', params })
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 00133 实时IP导出方法
  // @ts-ignore
  SsExportAIP(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/eepgl/SsExportAIP', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 0067 批量组卷
  doPlzj(params) {
    return new Promise((resolve, reject) => {
      return super
        .postForm({ url: '/api/eps/control/main/dagl/doPlzj', params })
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 0058 综合排序
  zhpx(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/queryForPage', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          console.log('综合排序res.data', res);
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAK0113 查看无原文
  ckwyw(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/queryForPage', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 加入借阅车

  // @ts-ignore
  async addJyc(filters) {
    const yh = SysStore.getCurrentUser();
    //      var grid = mini.get(mainGridId);
    //  const row = filters.SelectedRecord;
    const map = {
      code: 'WDS011',
      gnid: '',
      yhid: this.yhid,
    };
    const mjkq = await super.get({
      url: `/api/eps/control/main/params/getUserOption`,
      map,
    });
    console.log('mjkq==', mjkq.data.success);

    if (mjkq.data.success) {
      const date = filters.SelectedRecord[0];
      if (yh.yhmj === '' || yh.yhmj === null) {
        message.error('用户密级为空，不能借阅');
        //               return false;
      }
      if (yh.yhmj === '重要') {
        if (date.mj === '绝密') {
          message.error(
            `用户密级与数据密级不符合！用户密级为：${yh.yhmj},数据密级为：${date.mj}`,
          );
          //                return false;
        }
      }
      if (yh.yhmj === '一般') {
        if (date.mj === '绝密' || date.mj === '机密') {
          message.error(
            `用户密级与数据密级不符合！用户密级为：${yh.yhmj},数据密级为：${date.mj}`,
          );

          //                return false;
        }
      }
      if (yh.yhmj === '非密') {
        if (
          date.mj === '机密' ||
          date.mj === '秘密' ||
          date.mj === '绝密' ||
          date.mj === '核心商密' ||
          date.mj === '普通商密'
        ) {
          message.error(
            `用户密级与数据密级不符合！用户密级为：${yh.yhmj},数据密级为：${date.mj}`,
          );

          //           return false;
        }
      }
    }

    const params = {
      bmc: filters.dakGrid.bmc,
      yhid: this.yhid,
      dakid: filters.dakGrid.dakid,
      daklx: filters.dakGrid.daklx,
      ids: filters.ids.toString(),
      tmzt: filters.dakGrid.tmzt,
    };

    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/daly/toPutCart', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 加入我的收藏
  // @ts-ignore
  addWdsc(filters) {
    const row = filters.SelectedRecord;

    const params = {
      bmc: filters.dakGrid.bmc,
      yhid: this.yhid,
      dakid: filters.dakGrid.dakid,
      daklx: filters.dakGrid.daklx,
      ids: filters.ids.toString(),
      tmzt: filters.dakGrid.tmzt,
    };

    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/daly/addWdsc', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 档案指导标识
  // @ts-ignore
  addteamp(params) {
    // const row = filters.SelectedRecord;

    // const params = {
    //     bmc: filters.dakGrid.bmc,
    //     yhid: this.yhid,
    //     dakid: filters.dakGrid.dakid,
    //     daklx: filters.dakGrid.daklx,
    //     ids: filters.ids.toString(),
    //     tmzt: filters.dakGrid.tmzt,
    // }

    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dazdtemp/addteamp', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 二次编研合并到新条目
  // DAK00104
  // @ts-ignore
  hbDxtm(filters) {
    const params = {
      dakid: filters.dakid,
      bmc: filters.bmc,
      daklx: filters.daklx,
      tmzt: filters.tmzt,
      mbid: filters.mbid,
      dakmc: filters.dakmc,
      whrid: filters.whrid,
      whr: filters.whr,
      ids: filters.ids,
    };

    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/daby/hbDxtm', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 撤件
  // @ts-ignore
  doCheJian(filters) {
    const params = {
      bmc: filters.dakGrid.bmc,
      dakid: filters.dakGrid.dakid,
      daklx: filters.dakGrid.daklx,
      ids: filters.ids.toString(),
      tmzt: filters.dakGrid.tmzt,
      whrid: this.yhid,
      whr: this.yhmc,
    };
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/doCheJian', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 加入利用登记单 DAK0088
  async toaddLydt(filters) {
    // const params={
    //   bmc:filters.dakGrid.bmc,
    //   yhid: this.yhid,
    //   dakid:filters.dakGrid.dakid,
    //   daklx:filters.dakGrid.daklx ,
    //   ids:filters.ids.toString(),
    //   tmzt:filters.dakGrid.tmzt,
    //   djdid:filters.dakGrid.djdid,
    //   dwid:this.dwid,
    // }
    // const row=filters.ids;
    // let isExsist = true;
    // for (let j = 0; j < row.length; j++) {
    //     const map = {
    //         djdid: filters.dakGrid.djdid,
    //         tmid: row[j].id
    //     }
    //     const data = await super.get({ url: `/api/eps/control/main/dalydj/queryForLydjtmmx`, map });
    //     console.log('data==', data);
    //     if (data.length > 0) {
    //         isExsist = false;
    //         break;
    //     }
    // }
    // if (isExsist) {
    // return new Promise((resolve, reject) => {
    //     return super.post({ url: '/api/eps/control/main/daly/addLydts', params }).then(res => {
    //       if (res.status > 300) {
    //         return reject(res)
    //       }
    //       return resolve(res.data)
    //     }).catch(err => {
    //       return reject(err)
    //     })
    //   })
    // } else {
    //     message.error(`所选条目存在已加入过该利用登记单，请确认后在添加！`);
    //     return ;
    // }
  }

  // 提取盒号
  // @ts-ignore
  async tqhh(filters) {
    const mbzlxHhmap = {
      mbid: filters.dakGrid.mbid,
      sxid: 'SX08',
    };
    const hhzlxs = await super.get({
      url: `/api/eps/control/main/mbzlx/getMbzlxBySx`,
      mbzlxHhmap,
    });

    if (!hhzlxs || hhzlxs.length == 0) {
      message.error('该档案库没有盒号著录项');
    }

    const mbzlxTmmap = {
      mbid: filters.dakGrid.mbid,
      sxid: 'SX04',
    };
    const tmzlxs = await super.get({
      url: `/api/eps/control/main/mbzlx/getMbzlxBySx`,
      mbzlxTmmap,
    });
    if (!tmzlxs || tmzlxs.length == 0) {
      message.error('该档案库没有题名著录项');
    }

    const hhzlx = hhzlxs[0];
    const tmzlx = tmzlxs[0];
    const hgldas = filters.ids
      .map(function (o) {
        let tm = o[tmzlx.mc.toLowerCase()];
        tm = tm == null ? '' : o[hhzlx.mc.toLowerCase()];
        return { tm: tm, tmid: o['id'], hh: o[hhzlx.mc.toLowerCase()] };
      })
      .filter(function (h) {
        if (!h['hh'] || h['hh'] == null) {
          return false;
        }
        return true;
      });
    if (hgldas.length === 0) {
      message.error('盒号为空');
    }
    const params = {
      hgldas: hgldas,
      dakid: filters.dakGrid.dakid,
      mbid: filters.dakGrid.mbid,
      bmc: filters.dakGrid.bmc,
      dwid: this.dwid,
    };
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/hgl/tqhh', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 暂未使用 DAK0056 实时导出 改为 window.open打开方式,
  // batchExport(params, ids) {
  //     return new Promise((resolve, reject) => {
  //         debugger;
  //         return super.post({
  //             url: '/api/eps/control/main/pldcgl/batchExportExcel?' + qs.stringify(params), data: ids, headers: {
  //                 'Content-Type': 'application/json;charset=utf-8'
  //             }
  //         }).then(res => {
  //             if (res.status > 300) {
  //                 return reject(res)
  //             }
  //             return resolve(res.data)
  //         }).catch(err => {
  //             return reject(err)
  //         })
  //     }
  //     )
  // }
  // 归档调整
  doguidan(mbid) {
    return new Promise((resolve, reject) => {
      var data = {};
      data['mbid'] = mbid;
      data['sxid'] = 'SX100';
      return super
        .post({ url: `/api/eps/control/main/mbzlx/queryByKey`, data })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  doSXRFID(mbid) {
    return new Promise((resolve, reject) => {
      return super
        .post({
          url:
            '/api/eps/control/main/mbzlx/queryByKey?mbid=' +
            mbid +
            '&sxid=SXRFID',
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  dorfidsb() {
    return new Promise((resolve, reject) => {
      return super
        .post({
          url: '/api/eps/control/main/rfidsb/getRfidMsg?opt=01&optip=127.0.0.1',
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAKBTN01 开放
  // @ts-ignore
  doOpenFilesAction(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/kfjdsp/openFilesCart', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // DAKBTN0 划控
  // @ts-ignore
  doRangeAction(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/kfjdsp/addDetail', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 期限提升
  // @ts-ignore
  qxts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/qxts', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  //action
  getCurrentOS = () => {
    if (navigator.userAgent.indexOf('Window') > 0) {
      return 'Windows';
    } else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
      return 'Mac';
    } else if (navigator.userAgent.indexOf('Linux') > 0) {
      return 'Linux';
    } else {
      return 'NUll';
    }
  };
}

export default new DakoptService('/api/eps/control/main/dagl');
