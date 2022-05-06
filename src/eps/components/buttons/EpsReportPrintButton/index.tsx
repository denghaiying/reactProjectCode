import { Button, Dropdown, Menu, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel3';
//import EpsReportStore from "@/eps/components/buttons/EpsReportButton/store/EpsReportStore";
import { observer, useLocalObservable } from 'mobx-react';

import { PrinterOutlined } from '@ant-design/icons';
import './index.less';
import cookie from 'react-cookies';
import SysStore from '@/stores/system/SysStore';
import axios from 'axios';
import fetch from '@/utils/fetch';
import Eps from '@/utils/eps';
import { base64encode, sqlencode, utf16to8 } from '@/utils/EpsUtils';

interface IProp {
  store: EpsTableStore;
  ids: any[];
  umid: string;
  dakid: string;
}

const EpsReportPrintButton = observer((props: IProp) => {
  const ref = useRef();

  const [initKey, setInitKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(1000);
  const [defaultChecked, SetDefaultChecked] = useState(false);
  const [publicChecked, SetPublicChecked] = useState(false);
  const [store] = useState(props.store);
  // const [storeparams] = useState(props.store.params);
  const [prinstvisible, setPrintVisible] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);
  const [menuList, setMenuList] = useState([]);

  const { Option } = Select;
  // 创建Store实例
  /**
   * childStore
   */
  const EpsReportPrintStore = useLocalObservable(() => ({
    menuData: [],
    epsReportEntity: {},
    fields: {},
    printUrl: '',
    param: {},
    fileData: '',

    // async findMenu (umid)  {
    //   debugger
    //   let dakid=props.dakid;
    //   let mbid='';
    //   const aaa=(dakid !== '');

    //   if(aaa){
    //     const res = await fetch.get(`/api/eps/control/main/epsreport/queryForKey?id=` + dakid);
    //     debugger
    //     console.log('menudak==',res);
    //     if (res && res.status === 200) {
    //       mbid = res.data;
    //     }

    //   }
    //     const response = await fetch.post(`/api/eps/control/main/epsreport/queryForList?mbid=` + mbid+`&umid=`+umid);
    //       console.log('menu==',response);
    //     if (response && response.status === 200) {
    //       this.menuData = response.data;
    //     }

    //   },

    async findMBid(umids, dakids) {
      let mbid = '';
      const res = await fetch.get(
        `/api/eps/control/main/dak/queryForKey?id=` + dakids,
      );
      const aaa = res.data;
      if (aaa) {
        mbid = aaa.mbid;
      }

      const response = await fetch.post(
        `/api/eps/control/main/epsreport/queryForList?mbid=` +
          mbid +
          `&umid=` +
          umids,
      );
      console.log('menu==', response);
      if (response && response.status === 200) {
        this.menuData = response.data;
      }
    },

    existsReportPlugin() {
      return true;
    },

    async queryForId(id) {
      if (id != '') {
        const response = await fetch.post(
          `/api/eps/control/main/epsreport/queryForId?id=` + id,
        );
        if (response && response.status === 200) {
          this.epsReportEntity = response.data;
          return response.data;
        } else {
          this.loading = true;
        }
      }
    },
    async queryForDakId(id) {
      if (id != '') {
        const response = await fetch.post(
          `/api/eps/control/main/dak/queryForId?fid=` + id,
        );
        if (response && response.status === 200) {
          this.epsReportEntity = response.data;
        }
      }
    },
    async queryFields() {
      let names = ['GRID'];
      if (this.epsReportEntity.type == '全引报表') {
        names = ['GRID_MASTER', 'GRID_SLAVE'];
      } else if (this.epsReportEntity.type == '多业务全引报表') {
        names = ['GRID_MASTER'];
        /* let mb = Eps.asyncAjax(getMkUrl("jc") + "/mb/queryForId", {fid: mbid}, true)
               let stfllist = Eps.asyncAjax("/eps/control/main/stflmx/queryStflmxList", {flid: mb.dywstfl}, true);
               for (let i = 0; i < stfllist.length; i++) {
                 let stfl = stfllist[i];
                 let stflid = stfl.id;
                 let stflbh = stfl.bh;
                 let value = "GRID_" + stflbh + "_" + stflid;
                 names.push(value);
               }*/
      }
      for (let i = 0; i < names.length; i++) {
        Promise.all([this.getReportDBFieldsByName(names[i])]).then((res) => {
          console.log(res);
          const data = res[0];
          this.fields[names[i]] = JSON.stringify(res[0]).replace(
            /\u005C\u005C/g,
            '\u005C',
          );
          console.log(this.fields);
        });
      }
      console.log(this.fields);
    },
    // async getParamDev  (pcode, mdid) {
    //   const response = await fetch
    //   .post(`/api/eps/control/main/epsreport/queryReportData`, this.params, {
    //       params: {
    //         yhid: SysStore.getCurrentUser().id,
    //         code: pcode,
    //         gnid:mdid,
    //       ...this.params,
    //       },
    //   });
    //       debugger
    // //    const response = await fetch.post(`/api/eps/control/main/params/getParamsDevOption?yhid=`+SysStore.getCurrentUser().id`&code=` + code + `&gnid=`+mdid);
    //     if (response && response.status === 200) {
    //         this.epsReportEntity = response.data;
    //     } else {
    //         this.loading = true;
    //     }
    // },

    async reportPrint(reportinfo, id) {
      // const sjData = props.store.selectedRowKeys;
      // let ids = sjData.toString();
      let ids = '';
      debugger;
      if (id && id.ids.length > 0) {
        const sjData = id.ids;
        for (let i = 0; i < sjData.length; i++) {
          ids += ',' + sjData[i].id;
        }
        ids.substring(1);
      }

      if (reportinfo.designType === '1') {
        debugger;
        const pm = {
          ids: ids,
        };
        const bmc = props.store.params.bmc;
        const tmzt = props.store.params.tmzt;
        const param =
          reportinfo.reportid +
          '?bmc=' +
          bmc +
          '&tmzt=' +
          tmzt +
          '&yhid=' +
          SysStore.getCurrentUser().id +
          '&ssotoken=' +
          cookie.load('ssotoken') +
          '&epsParam=' +
          encodeURIComponent(JSON.stringify(pm));
        // const ipvaule = this.getParamDev("REPORT0001", "");
        // const pathvaule = this.getParamDev("REPORT0012", "");

        const ipvaule = await fetch.post(
          '/api/eps/control/main/params/getParamsDevOption',
          this.params,
          {
            params: {
              code: 'REPORT0001',
              gnid: '',
              yhid: SysStore.getCurrentUser().id,
              ...this.params,
            },
          },
        );
        const pathvaule = await fetch.post(
          '/api/eps/control/main/params/getParamsDevOption',
          this.params,
          {
            params: {
              code: 'REPORT0012',
              gnid: '',
              yhid: SysStore.getCurrentUser().id,
              ...this.params,
            },
          },
        );

        this.printUrl =
          'http://' + ipvaule.data + pathvaule.data + '/view/' + param;

        // window.open(url);
      } else if (reportinfo.designType === '3') {
        const pp = store.params;
        pp.con = '';
        debugger;
        //  pp['ids']= ids;
        if (ids !== '') {
          pp.ids = ids;
        }
        const response = await fetch.post(
          `/api/eps/control/main/epsreport/queryReportData`,
          this.params,
          {
            params: {
              id: reportinfo.id,
              storeParams: pp,
              ...this.params,
            },
          },
        );
        if (response && response.status === 200) {
          let data1 = response.data.results;
          this.param = data1;
          let reportName1 = data1.reportName;
          this.param['data'] = data1.data;
          this.param['paramter'] = data1.paramter;

          const jasperPathVaule = await fetch.post(
            '/api/eps/control/main/params/getParamsDevOption',
            this.params,
            {
              params: {
                code: 'REPORT0002',
                gnid: '',
                yhid: SysStore.getCurrentUser().id,
                ...this.params,
              },
            },
          );

          if (!jasperPathVaule) {
            return;
          }

          axios({
            // 用axios发送post请求
            method: 'post',
            url:
              'http://' +
              jasperPathVaule.data +
              '/offline/report/apiMap/print/' +
              reportName1, // 请求地址
            data: this.param, // 参数
            //    responseType: 'blob' // 表明返回服务器返回的数据类型
          })
            .then((response) => {
              if (response.status === 200) {
                this.fileData = response.data;
                //      this.printshow=true;
                const pdfurl = encodeURIComponent(
                  '/api/eps/offline/report/loadpdf?file=' + this.fileData,
                );
                this.printUrl =
                  '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' +
                  pdfurl +
                  '&printfile=1&downfile=1?ran=' +
                  Math.random();
                window.open(
                  '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' +
                    pdfurl +
                    '&printfile=1&downfile=1',
                );
              } else {
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
    },

    async doPrintOrPreview(opt, repid, ids) {
      if (!repid) {
        return;
      }
      if (!this.existsReportPlugin()) {
        return;
      }
      let qurl = Eps.getRootUrl() + '/api/eps/control/main/epsreport';
      if (1 == 1) {
        Promise.all([this.queryForId(repid), this.queryFields()]).then(() => {
          let reportinfo = this.epsReportEntity;
          if (reportinfo.designType != '2') {
            this.reportPrint(reportinfo, ids);
          } else {
            let names = ['GRID'];
            if (reportinfo.type == '全引报表') {
              names = ['GRID_MASTER', 'GRID_SLAVE'];
            } else if (reportinfo.type == '多业务全引报表') {
              names = ['GRID_MASTER'];
              /* let mb = Eps.asyncAjax(getMkUrl("jc") + "/mb/queryForId", {fid: mbid}, true)
                 let stfllist = Eps.asyncAjax("/eps/control/main/stflmx/queryStflmxList", {flid: mb.dywstfl}, true);
                 for (let i = 0; i < stfllist.length; i++) {
                   let stfl = stfllist[i];
                   let stflid = stfl.id;
                   let stflbh = stfl.bh;
                   let value = "GRID_" + stflbh + "_" + stflid;
                   names.push(value);
                 }*/
            }
            console.log(props.store.params.bmc);
            if (names && names.length > 0) {
              let pms = {};
              let tknifo = 'token=' + Eps.getCookie('token');
              if (opt == 'design') {
                pms['opt'] = '0';
              } else if (opt == 'print') {
                pms['opt'] = '2';
              } else {
                pms['opt'] = '1';
              }
              pms['id'] = repid;
              pms['queryUrl'] = qurl + '/queryForId?' + tknifo;
              let datainfo = [];
              for (let i = 0; i < names.length; i++) {
                let di = {};
                di['name'] = names[i];
                di['fields'] = this.fields[names[i]];
                di['indexfieldnames'] = this.getReportDataIndexFieldNames(
                  names[i],
                );
                di['masterdataname'] = this.getReportDataMasterData(names[i]);
                di['masterfields'] = this.getReportDataMasterFields(names[i]);
                let rdi = this.doGetReportDataInfo(names[i]);
                for (let key in rdi) {
                  di[key] = rdi[key];
                }
                datainfo.push(di);
              }
              pms['datainfo'] = JSON.stringify(datainfo);
              pms['saveurl'] = qurl + '/updatexml?' + tknifo;
              pms['rsqlparams'] = JSON.stringify(this.doGetReportSqlParams());
              pms['rsqlurl'] = qurl + '/runsql?' + tknifo;
              pms['queryparams'] = JSON.stringify(
                this.getJsonQueryParams({}),
              ).replace(/\u005C\u005C/g, '\u005C');
              console.log(pms);
              let vd = base64encode(utf16to8(JSON.stringify(pms)));
              let url = '/api/eps/control/main/epsreport/genVReport';
              const fd = new FormData();
              fd.append('data', vd);
              fetch
                .post(url, fd, {
                  headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                  },
                })
                .then((response) => {
                  if (response.status === 200) {
                    let url = 'epssoft:@EpsReport@?';
                    url +=
                      'id=' +
                      response.data +
                      '&url=' +
                      qurl +
                      '/queryVReport?' +
                      tknifo;
                    window.location.href = url;
                  }
                });
            }
          }
        });
      }
    },
    doGetReportSqlParams() {
      let pm = {};
      pm = {
        dakid: props.store.params.dakid,
        userid: SysStore.getCurrentUser().id,
        bmc: props.store.params.bmc,
        mbid: this.epsReportEntity.mbid,
        tmzt: props.store.params.tmzt,
      };
      return pm;
    },
    getJsonQueryParams(queryparams) {
      let p = {};
      if (queryparams) {
        for (let key in queryparams) {
          let val = queryparams[key];
          let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
          if (reg.test(val)) {
            p[key] = this.encodeUnicode(val);
          } else {
            p[key] = val;
          }
        }
      }
      return p;
    },
    getReportDataIndexFieldNames(dataSetName) {
      if (dataSetName == 'GRID_SLAVE') {
        return 'FID';
      }
      return '';
    },
    getReportDataMasterData(dataSetName) {
      if (dataSetName == 'GRID_SLAVE') {
        return 'GRID_MASTER';
      }
      return '';
    },
    getReportDataMasterFields(dataSetName) {
      if (dataSetName == 'GRID_SLAVE') {
        return 'ID';
      }
      return '';
    },
    doGetReportDataInfo(name) {
      let rdi = {};
      rdi['url'] = this.doGetDataUrl(name);
      rdi['par'] = this.getReportDataParamByName(name);

      return rdi;
    },
    getReportDataParamByName(dataSetName) {
      /* let  me = this;
        let  sr = this.grid.getSelecteds();*/
      if (this.epsReportEntity && this.epsReportEntity.type == 'SQL报表') {
        let pm = {
          bmc: props.store.params.bmc,
        };
        const sjData = props.store.selectedRowKeys;
        let ids = sjData.toString();

        pm['sql'] = sqlencode(this.epsReportEntity.sql);
        pm['ids'] = ids.substring(1);
        return JSON.stringify(pm);
      }
      if ('GRID' == dataSetName) {
        let par = {};
        const sjData = props.store.selectedRowKeys;
        let ids = sjData.toString();
        par.dakid = props.store.params.dakid;
        par.bmc = props.store.params.bmc;
        par.dayh = SysStore.currentUser.id;
        par.dwid = props.store.params.dwid;
        par.hszbz = props.store.params.hszbz;
        par.limit = props.store.params.limit;
        par.page = props.store.params.page;
        par.tmzt = props.store.params.tmzt;
        par.key =
          (props.store.params.key &&
            this.newencodeUnicode(props.store.params.key)) ||
          '';
        par.psql = props.store.params.psql;
        par.con = '';
        par.telesql =
          (props.store.params.telesql &&
            this.newencodeUnicode(props.store.params.telesql)) ||
          '';
        par['ids'] = ids;
        return JSON.stringify(par);
      } else if ('GRID_MASTER' == dataSetName) {
        let pm = {
          start: 0,
          limit: props.store.params.limit,
          page: 1,
          bmc: props.store.params.bmc,
          mbid: this.epsReportEntity.mbid,
          tmzt: props.store.params.tmzt,
        };
        const sjData = props.store.selectedRowKeys;
        let ids = sjData.toString();
        pm['ids'] = ids;
        return JSON.stringify(pm);
      } else if ('GRID_SLAVE' == dataSetName) {
        /*let  filter = mini.clone(props.store.params);
          Promise.all([this.queryForDakId(props.store.params.dakid)]).then((res)=> {
            console.log(res);
            const data = res[0];
            this.fields[names[i]] = JSON.stringify(res[0]).replace(/\u005C\u005C/g, '\u005C');
            console.log(this.fields);
          });
          let  mbdak = Eps.asyncAjax("/eps/control/main/dak/queryForId", {
            fid: me.dakid
          }, true);
          filter.mbid = mbdak.mbid;
          let  pm = {
            start: 0,
            limit: filter.limit,
            page: 1,
            bmc: mbdak.mbc,
            mbid: mbdak.mbid,
            tmzt: filter.tmzt
          };
          let  ids = "";
          for (let  i = 0; i < sr.length; i++) {
            ids += "," + sr[i].id;
          }
          pm["fids"] = ids.substring(1);
          return JSON.stringify(pm);*/
      } else {
        /*let  data = dataSetName.split("_");
          let  stflmx = Eps.asyncAjax("/eps/control/main/stflmx/queryForId", {
            id: data[2]
          }, true);
          let  filter = mini.clone(props.store.params);
          let  mbdak = Eps.asyncAjax("/eps/control/main/dak/queryForId", {
            fid: me.dakid
          }, true);
          filter.mbid = mbdak.mbid;
          let  pm = {
            start: 0,
            limit: filter.limit,
            page: 1,
            bmc: mbdak.mbc,
            mbid: mbdak.mbid,
            tmzt: filter.tmzt,
            stflid :stflmx.id
          };
          let  ids = "";
          for (let  i = 0; i < sr.length; i++) {
            ids += "," + sr[i].id;
          }
          pm["fids"] = ids.substring(1);
          return JSON.stringify(pm);*/
      }
    },
    doGetDataUrl(name) {
      let str = this.getReportDataUrlByName(name);
      return str ? str + '?token=' + Eps.getCookie('token') : '';
    },
    getReportDataUrlByName(dataSetName) {
      if (this.epsReportEntity && this.epsReportEntity.type == 'SQL报表') {
        return '/api/eps/control/main/jc/dak/querySqlData';
      } else if (
        this.epsReportEntity &&
        (this.epsReportEntity.type == '全引报表' ||
          this.epsReportEntity.type == '多业务全引报表')
      ) {
        return (
          Eps.getRootUrl() + '/api/eps/control/main/dagl/queryForReportListData'
        );
      } else {
        return Eps.getRootUrl() + '/api/eps/control/main/dagl/queryForPage';
      }
    },
    async getReportDBFields(dakid) {
      let repson = await fetch.post(
        `/api/eps/control/main/dagl/queryFormKFields?dakid=` +
          dakid +
          '&lx=' +
          props.store.params.tmzt +
          '&pg=list',
      );
      let fields = repson.data;
      if (fields.length > 0) {
        let re = [];
        for (let i = 0; i < fields.length; i++) {
          re.push({
            name: fields[i].mc.toUpperCase(),
            type: 'string',
            width: 1000,
            text: this.encodeUnicode(fields[i].ms),
          });
        }
        return re;
      } else {
        return null;
      }
    },
    encodeUnicode(str) {
      let newstr = str.replace(/(^\s*)|(\s*$)/g, '');
      let res = [];
      for (let i = 0; i < newstr.length; i++) {
        res[i] = ('00' + newstr.charCodeAt(i).toString(16)).slice(-4);
      }
      return '\\u' + res.join('\\u');
    },
    newencodeUnicode(str) {
      let newstr = str.replace(/(^\s*)|(\s*$)/g, '');
      let res = [];
      for (let i = 0; i < newstr.length; i++) {
        res[i] = ('00' + newstr.charCodeAt(i).toString(16)).slice(-4);
      }
      return '\\u' + res.join('\\u');
    },
    async getReportDBFieldsByName(name, reportInfo) {
      let data = [];
      if (reportInfo && reportInfo.type == 'SQL报表') {
        let columns = await fetch.post(
          `/api/eps/control/main/jc/dak/getFieldsBySql?mbid=` +
            reportInfo.mbid +
            '&sql=' +
            sqlencode(reportInfo.sql),
        );
        for (let i = 0; i < columns.data.length; i++) {
          data.push({
            name: columns[i].name,
            type: 'string',
            width: 100,
            text: columns[i].name,
          });
        }
        return data;
      } else if ('GRID' == name) {
        data = this.getReportDBFields(props.store.params.dakid);
      } else if ('GRID_MASTER' == name) {
        data = this.getReportDBFields(props.store.params.dakid);
      } else if ('GRID_SLAVE' == name) {
        let mbdak = Eps.asyncAjax(
          '/eps/control/main/dak/queryForId',
          {
            fid: props.store.params.dakid,
          },
          true,
        );
        data = this.getReportDBFields(mbdak.id);
      } else {
        /* let data = name.split("_");
           let mb = Eps.asyncAjax(getMkUrl("jc") + "/mb/queryForId", {fid: this.mbid}, true)
           let zlx = Eps.asyncAjax("/eps/control/main/dywmbzlx/queryForList", {
             mbid: mb.id,
             lx: 1,
             stflid: data[2]
           }, true);
           data= this.getReportDywDBFields(zlx);*/
      }
      return data;
    },
  }));

  useEffect(() => {
    setModalHeight(window.innerHeight - 300);
  }, []);

  const [umid, setUmid] = useState({});
  const [mbid, setMbid] = useState({});
  const [dakid, setDakid] = useState({});
  const [ids, setIds] = useState({});
  //   const [store , setStore] = useState({})

  useEffect(() => {
    setUmid({ umid: props.umid });
    setMbid({ mbid: props.mbid });
    setDakid({ dakid: props.dakid });
    setIds({ ids: props.ids });
    //    setStore({'store': props.store});
    // EpsReportPrintStore.findMenu(props.umid);
    EpsReportPrintStore.findMBid(props.umid, props.dakid);
  }, [props.umid, props.mbid, props.dakid, props.ids, props.store]);

  const menuShow = () => {
    const uo = EpsReportPrintStore.menuData;
    setMenuList(uo);
  };

  useEffect(() => {
    menuShow();
    console.log('aaaaaaa==', menuList);
  }, [EpsReportPrintStore.menuData]);

  // 创建右侧表格Store实例
  //  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(EpsReportService));

  const loop = (
    data, //创建菜单
  ) =>
    data.map((item) => {
      return (
        <Menu.Item
          key={item.id}
          title={item.name}
          onClick={() => {
            EpsReportPrintStore.doPrintOrPreview('yl', item.id, ids);
            console.log('sfsdfdsf store', props.store);
          }}
        >
          <span>{item.name}</span>
        </Menu.Item>
      );
    });
  // 打印的菜单,

  // 创建菜单
  //   const loop = data =>
  //     data.map(item => {
  //       return  <Menu.Item key={item.id} title={item.name}
  //       onClick={() => {EpsReportPrintStore.doPrintOrPreview("print",item.id);console.log('sfsdfdsf store', props.store); setPrintVisible(true)}}>
  //         <span>{item.name}</span>
  //       </Menu.Item>;
  //     });
  // 打印的菜单,
  const menu = <Menu mode="vertical">{loop(menuList)}</Menu>;

  const bsreporturl = EpsReportPrintStore.printUrl;

  return (
    <>
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          // icon={<PrinterOutlined />}
        >
          打印
        </Button>
      </Dropdown>

      <Modal
        title="报表"
        centered
        visible={prinstvisible}
        footer={null}
        width={1200}
        bodyStyle={{ height: 700 }}
        onCancel={() => setPrintVisible(false)}
      >
        {/*<iframe*/}
        {/*  name="bsframe"*/}
        {/*  frameBorder="false"*/}
        {/*  width="100%"*/}
        {/*  scrolling="auto"*/}
        {/*  height="100%"*/}
        {/*  src={bsreporturl}*/}
        {/*/>*/}
        {/*window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=1&downfile=1");*/}
      </Modal>
    </>
  );
});

export default EpsReportPrintButton;
