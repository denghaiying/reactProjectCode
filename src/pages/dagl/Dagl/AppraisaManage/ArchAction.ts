import { message } from 'antd';
import qs from 'qs';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import dakoptService from './dakoptService';
const httpRequest = new HttpRequest("/api/eps/control/main");


const ArchRun = {
    /**
     * 数据更新demo
     * @param optcode 档案库按钮编号DAK0005
     * @param params 普通参数
     * @param store 档案库store
     * @param ids 选种id数据
     * @returns
     *
     */
    DAK0005: async (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: string[]) => {
        // 拼装该功能dakgrid所需参数
        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' })
            return { disableModal: false };
        }

        let filter = {
            bmc: params.bmc,
            daklx: archStore.ktable?.daklx,
            mbid: archStore.ktable?.mbid,
            dakid: params.dakid,
            lx: params.lx,
            ids: ids.join(",")
        }

        const res = await dakoptService.genDh(filter);
        if (res.success) {
            message.warning({ type: 'warning', content: '生成成功' });
        } else {
            message.error("操作失败！原因：\r\n" + res.message);
        }
        return { disableModal: true };
    },
    // demo
    /**
     *

     * @param optcode 档案库按钮编号DAK0010
     * @param params 普通参数
     * @param store 档案库store
     * @ids 所选行的行id数据
     * @returns
     *    dakid: dakGrid.dakid,
        tmzt: dakGrid.tmzt,
        toolbarId: "toolbar",
        mbid: dakGrid.mbid,
        lx: dakGrid.daklx,
        ly: dakGrid.tmzt,
        daklx: me.daklx,
        bmc: dakGrid.bmc,
        dakGrid: dakGrid,
        pldrjc: me.canPldrjc,
        fid: dafid
     *
     */
    DAK0010: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        // 拼装该功能dakgrid所需参数
        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' })
            return { disableModal: true };
        }
        console.log("dak0010", ids);
        const dakGrid = {
            sfdyw: archStore.ktable?.sfdyw,
            stflid: archStore.ktable?.dywstfl
        }

        const filter = {
            dakid: params.dakid,
            tmzt: params.tmzt,
            mbid: archStore.ktable?.mbid,
            lx: params.lx,
            ly: params.tmzt,
            daklx: archStore.ktable?.daklx,
            bmc: params.bmc,
            dakGrid,
            toolbarId: "toolbar",
            pldrjc: true,
            // fid: dafid
        }
        return { url: `/api/eps/control/main/dagl/pldr?${qs.stringify(filter)}`, params: filter, title: "批量导入", filter, width: 1280, height: 680 };

    },

    DAK0052: (optcode: string, params: ArchParams, archStore: ArchStoreType) => {
        // 拼装该功能dakgrid所需参数
        const dakGrid = {
            dakid: params.dakid,
            tmzt: params.tmzt,

        }
        const filter = {
            dakGrid
        }
        return { url: `/api/eps/control/main/dagl/zdyfz?${qs.stringify(filter)}`, params: filter, title: "自定义分组设置", filter, width: 900, height: 535 };

    },
    DAK0009: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {

        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' })
            return { disableModal: true };
        }
        // 拼装该功能dakgrid所需参数

        const dakGrid = {
            sfdyw: false,
            zdlx: "C",
            stflid: "",
            tmzt: params.tmzt,
            mbid: archStore.ktable?.mbid,
        }
        const filter = {
            dakGrid,
            tmzt: params.tmzt,
            toolbarId: "toolbar",
            ids: ids.toString(),
            mbid: archStore.ktable?.mbid,
            bmc: params.bmc,

        }
        return { url: `/api/eps/control/main/dagl/plxg?${qs.stringify(filter)}`, params: filter, title: "批量修改", filter, width: 600, height: 400 };

    },
    DAK0021: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        const dakGrid = {
            dakid: params.dakid,
            tmzt: params.tmzt,
            bmc: params.bmc,
        }
        const filter = {
            dakGrid,
            toolbarId: "toolbar"
        }
        return { url: `/api/eps/control/main/dagl/dakDakcc?${qs.stringify(filter)}`, params: filter, title: "档案查重", filter, width: 1500, height: 800 };

    },
    DAK0022: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        const dakGrid = {
            dakid: params.dakid,
            tmzt: params.tmzt,
        }
        const filter = {
            dakGrid,
            toolbarId: "toolbar"
        }
        return { url: `/api/eps/control/main/dagl/dakDhDhcx?${qs.stringify(filter)}`, params: filter, title: "断号查找", filter, width: 1300, height: 550 };

    },
    DAK0063: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        const dakGrid = {
            mbid: archStore.ktable?.mbid,
            bmc: params.bmc,
        }
        const filter = {
            dakGrid: dakGrid,
            toolbarId: "toolbar"
        }
        return { url: `/api/eps/control/main/dagl/dakzhpx?${qs.stringify(filter)}`, params: filter, title: "综合排序设置", filter, width: 900, height: 534 };

    },
    DAK0053: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        debugger;
        const dakinfo = {
            mbid: archStore.ktable?.mbid,
            dakid: params.dakid,
            bmc: params.bmc,

        }
        const keyvalues = {
            dakinfo,
            ids: ids,
        }
        //这个需要前置判断
        const filter = {

            keyvalues
            // mbid:archStore.ktable?.mbid,
            // dakid : params.dakid,
            // bmc : params.bmc,


        }
        return { url: `/api/eps/control/main/hgl/hgl_da?${qs.stringify(filter)}`, params: filter, title: "装盒", filter, width: 985, height: 500 };

    },


    DAK0055: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        // 拼装该功能dakgrid所需参数
        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' })
            return { disableModal: true };
        }

        const grid = {
            pageSize: 10000000,
            pageIndex: 1,
        }

        const dakGrid = {
            tmzt: params.tmzt,
            mbid: archStore.ktable?.mbid,
            dakid: params.dakid,
            bmc: params.bmc,
            stflid: "",
            grid,
            ids: archStore.selectRecords,
        }
        const filter = {
            dakGrid: dakGrid,
            toolbarId: "toolbar",


        }
        return { url: `/api/eps/control/main/dagl/pldcgl?${qs.stringify(filter)}`, params: filter, title: "定时批量导出", filter, width: 520, height: 465 };

    },

     DAK0056: async (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
            // 拼装该功能dakgrid所需参数
            if (ids.length <= 0) {
                message.warning({ type: 'warning', content: '请选择条目信息' })
                return { disableModal: true };
            }
            const filter = {
                toolbarId: "toolbar",
                page: 10000000,
                start: 1,
                limit:1,
                tmzt: params.tmzt,
                mbid: archStore.ktable?.mbid,
                dakid: params.dakid,
                bmc: params.bmc,
                stflid: "",
                ids: archStore.selectRecords,
                // whrid ： Eps.top().getUserId();
                // whr = Eps.top().getUserName();
                // whrbh  = Eps.top().getUserBh();


            }
            const res = await dakoptService.submitTmzt(filter);
            if (res.success) {
                message.success({ type: 'warning', content: '归入整编成功' });
            } else {
                message.error("操作失败！原因：\r\n" + res.message);
            }
            return { disableModal: true };
        },



    DAK0030: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {

        // 拼装该功能dakgrid所需参数
        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' })
            return { disableModal: true };
        }
        debugger;
        httpRequest.get({
            url: `/api/eps/control/main/mbzlx/queryByKey?mbid=${archStore.ktable?.mbid}&sxid=SX100`
        }).then(res => {
            if (!res.data) {
                message.warning({ type: 'warning', content: '请设置归档部门属性' })
                return { disableModal: true };
            }
        }).catch(err => {

        });
        const dakGrid = {
            tmzt: params.tmzt,
            mbid: archStore.ktable?.mbid,
            dakid: params.dakid,
            bmc: params.bmc,
            daklx: archStore.ktable?.daklx,
            ids: archStore.selectRecords,

        }
        const filter = {
            dakGrid: dakGrid,
            toolbarId: "toolbar",
            grid: {}
        }
        return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };

    },


    DAK0002: async (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        //这个需要前置判断
        const filter = {
            bmc: params.bmc,
            daklx: archStore.ktable?.daklx,
            dakid: params.dakid,
            ids: ids.join(","),
            tmzt: params.tmzt,
            needWorkflow: "N",
            mbid: archStore.ktable?.mbid,
        }

        const res = await dakoptService.submitTmzt(filter);
        if (res.success) {
            message.success({ type: 'warning', content: '归入整编成功' });
        } else {
            message.error("操作失败！原因：\r\n" + res.message);
        }
        return { disableModal: true };
    },

    DAK0003: async (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        //这个需要前置判断
        const filter = {
            bmc: params.bmc,
            daklx: archStore.ktable?.daklx,
            ids: ids.join(","),
            tmzt: params.tmzt,

        }

        const res = await dakoptService.returnTmzt(filter);
        if (res.success) {
            message.success({ type: 'warning', content: '取消归档成功' });
        } else {
            message.error("操作失败！原因：\r\n" + res.message);
        }
        return { disableModal: true };
    },


    DAK0049: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        //这个需要前置判断
        const filter = {

            //keyvalues
            // mbid:archStore.ktable?.mbid,
            // dakid : params.dakid,
            // bmc : params.bmc,
        }
        return { url: `/api/eps/control/main/dagl/dakZl?${qs.stringify(filter)}`, params: filter, title: "档案整理", filter, width: 985, height: 500 };

    },

    DAK0006: async (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: string[]) => {
        // 拼装该功能dakgrid所需参数
        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' })
            return { disableModal: false };
        }
        let filter = {
            bmc: params.bmc,
            daklx: archStore.ktable?.daklx,
            mbid: archStore.ktable?.mbid,
            ids: ids.join(",")
        }

        const res = await dakoptService.clearDh(filter);
        if (res.success) {
            message.success({ type: 'warning', content: '清除档号成功' });
        } else {
            message.error("操作失败！原因：\r\n" + res.message);
        }
        return { disableModal: true };
    },






    DAK0017: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
        const dakGrid = {
            dakid: params.dakid,
            tmzt: params.tmzt,
            yhid: "YH201904132026100005"
        }
        const filter = {
            dakGrid: dakGrid,

            toolbarId: "toolbar"

        }
        return { url: `/api/eps/control/main/dagl/daksaveas?${qs.stringify(filter)}`, params: filter, title: "另存到其它档案库", filter, width: 900, height: 565 };

    },
    DAK0025: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids) => {
        const dakGrid = {
            dakid: params.dakid,
            tmzt: params.tmzt,
            yhid: "YH201904132026100005"
        }
        const filter = {
            dakGrid: dakGrid,
            toolbarId: "toolbar"
        }
        return { url: `/api/eps/control/main/dagl/recycleBin?${qs.stringify(filter)}`, params: filter, title: "回收站", filter, width: 1280, height: 700 };
    },
// 日志
DAK0064: (optcode: string, params: ArchParams, archStore: ArchStoreType,ids:Array) => {

    if(ids.length<=0){
      message.warning({type: 'warning', content: '请至少选择一行数据'})
      return {disableModal: true};
    }

    //   const tm=  await fetch.get(`/api/eps/control/main/mbzlx/queryByKey?sxid=SX04&mbid=`+archStore.ktable?.mbid);

    let jnid = "";
    let jntm="";
    const url64="/api/eps/control/main/mbzlx/queryByKey?mbid=${archStore.ktable?.mbid}&sxid=SX04";
    // const httpRequest = new HttpRequest("/api/eps/control/mbzlx");
    //   httpRequest.get({
    //           url: `/api/eps/control/main/mbzlx/queryByKey?mbid=${archStore.ktable?.mbid}&sxid=SX04`
    //       }).then(res => {
    //
    //              const tm=res.data;
    //              console.log('tm',tm);
    //
    //              const sr=archStore.selectRecords;
    //               for (let i = 0; i < sr.length; i++) {
    //                   jnid += "," + sr[i].id;
    //                   jntm = sr[i][tm.mc.toLowerCase()];
    //
    //               }
    //               console.log('jnid111',jnid);
    //               console.log('jntm111',jntm);
    //
    //       }).catch(err => {
    //
    //       });

    //   $.ajax({
    //     url:url64,//url路径
    //     type:'POST', //GET
    //     async:false, //或false,是否异步
    //     data:{},
    //     dataType:'json', //返回的数据格式：
    //     success:function(data){
    //       console.log('jquerydata',data);
    //     },
    //     error:function(xhr,textStatus){

    //     }
    //   });

    const dakGrid = {
      dakid: params.dakid,
      tmzt: params.tmzt,
      mbid: archStore.ktable?.mbid,
      lx: params.lx,
      ly: params.tmzt,
      daklx: archStore.ktable?.daklx,
      bmc: params.bmc,
    }
    const filter = {
      dakGrid,
      toolbarId: "toolbar",

      id:'DA202007061652570013',
      tm:'20200706'
    }
    console.log('filter', filter);
    /**
     *
     * 有前置判断需查看miniui代码
     */
    return {
      url: `/api/eps/control/main/dagl/logLine?${qs.stringify(filter)}`,
      params: filter,
      title: "合并到已有条目",
      filter,
      width: 1280,
      height: 565
    };
  },
  // 合并到已有条目
  DAK00103: (optcode: string, params: ArchParams, archStore: ArchStoreType,ids:Array) => {

    if(ids.length<=0){
      message.warning({type: 'warning', content: '请至少选择一行数据'})
      return { disableModal: true };
    }

    const tmids=ids[0];

    const filter = {
      dakid: params.dakid,
      bmc: params.bmc,
      tmzt: params.tmzt,
      ids: ids.toString(),
      tmid: tmids

    }

    /**
     *
     * 有前置判断需查看miniui代码
     */
    return { url: `/api/eps/control/main/dagl/bykhbyytm?${qs.stringify(filter)}`,params:filter, title: "合并到已有条目", filter, width: 1280, height: 565 };
  },
  // 光盘打包
  DAK0115: async (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {


    const grid={
      pageIndex:0,
      pageSize:100
    }
    const dakGrid = {
      dakid: params.dakid,
      tmzt: params.tmzt,
      mbid: archStore.ktable?.mbid,
      lx: params.lx,
      daklx: archStore.ktable?.daklx,
      bmc: params.bmc,
      mc:params.mc,
      selectIds:ids.toString(),
      grid

    }
    const filter = {
      dakGrid,
      toolbarId: "toolbar",
      // srs: archStore.selectRecords,
      srs:[],
      tmzt: params.tmzt,
      dakid: params.dakid,
      dwid: "DW201408191440170001",
    }

    console.log('filter',filter);
    return { url: `/api/eps/control/main/dagl/Dakgpdb?${qs.stringify(filter)}`, params: filter, title: "档案库光盘打包", filter, width: 500, height: 310 };
  },
};

export default ArchRun;
