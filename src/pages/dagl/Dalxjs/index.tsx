import React, { useEffect, useState } from 'react';
import './index.less';
import {
  Button,
  Table,
  Tree,
  Spin,
  Row,
  Col,
  Form,
  Modal,
  Upload,
  Tooltip,
  Steps,
  Divider,
  message,
  Input,
  DatePicker,
  TreeSelect,
  Select,
  Tabs,
  Layout,
} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { UploadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import qs from 'qs';
import cookie from 'react-cookies';
import update from 'immutability-helper';
import { runInAction } from 'mobx';
import moment from 'moment';
import SysStore from '@/stores/system/SysStore';
import ArchMenuAction from '../Dagl/AppraisaManage/ArchMenuAction';
import dakoptService from '../Dagl/AppraisaManage/dakoptService';
import TableService from '../Dagl/AppraisaManage/TableService';
import fetch from '../../../utils/fetch';
import { runFunc } from '@/utils/menuUtils';
import DakTree from './DakTree/DakTree';
//import './search.less';
const tmzt = 2;
const jdumid = 'DAGL026';
const jdname = '离线接收';
const { Step } = Steps;
const formItemLayout = {
  colon: false,
  labelCol: {
    span: 8,
  },
};
const { TabPane } = Tabs;
const { Header, Footer, Sider, Content } = Layout;

const Dalxjs = observer((props) => {
  const [form] = Form.useForm();
  const [currentstep, setCurrentstep] = useState(0);
  const [currenteepstep, setCurrenteepstep] = useState(0);
  const [currentdak, setCurrentDak] = useState('');
  const [currentyjdw, setCurrentyjdw] = useState('');
  const [eepvisible, setEepvisible] = useState(false);
  const [eepparams, setEepparams] = useState({});
  const { RangePicker, MonthPicker, YearPicker } = DatePicker;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 表格选中行时， 设置行属性
  const [checkedRows, setCheckedRows] = useState<any>([]);
  const DalxjsStore = useLocalObservable(() => ({
    dalxjsdata: [],
    loading: true,
    daktreeData1: [],
    daktreeData: [],
    jscsdata: { pldrs: 0, plgjs: 0, sjbdrs: 0 },
    sjdrlsdata: [],
    treespinning: true,
    selectOthers: {},
    // //档案库
    isRecords: false,
    ktable: {},
    childKtable: {},
    childDakid: '',
    childParams: {},
    sjzdData: {},
    yjdwbh: '',
    yjdwmc: '',
    dwdata: [],
    selectRowKeys: [],
    selectRowRecords: [],
    currentpcdatas: [],
    currentdak: '',
    drlxsql: "('1' , '2')",
    async setSelectRows(selectRowKeys, selectRowRecords) {
      this.selectRowKeys = selectRowKeys;
      this.selectRowRecords = selectRowRecords;
    },
    async getWjzlDakTree() {
      const params = {
        params: {
          tmzt: 2,
          noshowdw: 'Y',
          dayh: SysStore.getCurrentUser().id,
          dw: SysStore.getCurrentCmp().id,
          node: 'root',
        },
      };
      const response = await fetch.get(
        '/api/eps/control/main/dak/queryTreeNew',
        params,
      );
      if (response.status == 200) {
        this.daktreeData1 = response.data;
        this.treespinning = false;
      }
    },
    async getcurrentpcdatas(data) {
      const response = await fetch.post(
        '/api/eps/control/main/dagl/queryListByPch?tmzt=2' +
          '&bmc=' +
          data.dakbmc +
          '&mbid=' +
          data.mbid +
          '&key=' +
          data.drpc,
      );
      if (response.status == 200) {
        this.currentpcdatas = response.data;
      }
    },
    async getJscsData(params) {
      const res = await fetch.get(
        '/api/eps/control/main/dagl/queryJscs',
        params,
      );
      if (res.status == 200) {
        this.jscsdata = res.data;
      }
    },
    async getSjdrlsData(params) {
      const res = await fetch.get(
        '/api/eps/control/main/dagl/querySjdrls',
        params,
      );
      if (res.status == 200) {
        let list = [];
        res.data.map((sjdrls) => {
          this.dwdata.map((dw) => {
            if (dw.id == sjdrls.dwid) {
              sjdrls['dwmc'] = dw.dwname;
            }
          });
          list.push(sjdrls);
        });
        this.sjdrlsdata = list;
        this.loading = false;
      }
    },
    async initKtable() {
      const ktable: KtableType = await TableService.queryKTable(
        DakoptStore.archParams,
      );
      let childKtable: KtableType;
      if (DalxjsStore.isRecords) {
        childKtable = await TableService.queryKTable({
          fid: DakoptStore.archParams.dakid,
        });
      }
      runInAction(() => {
        DakoptStore.ktable = update(DakoptStore.ktable, {
          $set: ktable,
        });
        if (DalxjsStore.isRecords) {
          DalxjsStore.childKtable = childKtable;
          DalxjsStore.childDakid = childKtable.id;
          DalxjsStore.childParams = {
            bmc: childKtable.bmc,
            lx: childKtable.daklx,
            tmzt: DakoptStore.archParams.tmzt,
            dakid: childKtable.id,
          };
        }
      });
    },
    //
    async doArchAction(
      opt: OptType,
      ids: any,
      store: any,
      records: any,
      ktable: KtableType,
    ) {
      if (opt && opt.optcode) {
        if (!DakoptStore[opt.optcode]) {
          message.warning({
            type: 'warning',
            content: '调用功能失败，请联系系统管理员',
          });
          return;
        }
        const archModalInfo = await DakoptStore[opt.optcode](
          opt.optcode,
          DakoptStore.archParams,
          { ...DakoptStore, ktable: ktable, selectRecords: records },
          ids,
        );
        window._paramCache = archModalInfo?.params;
        runInAction(() => {
          DakoptStore.optcode = '';
          DakoptStore.modalHeight = archModalInfo.height;
          DakoptStore.modalWidth = archModalInfo.width;
          DakoptStore.selectRecords = records;
          DakoptStore.ids = ids;
          if (archModalInfo.showFoot == true) {
            DakoptStore.showFoot = true;
          } else {
            DakoptStore.showFoot = false;
          }
          if (archModalInfo.useIframe == false) {
            DakoptStore.useIframe = false;
          } else {
            DakoptStore.useIframe = true;
          }
          // 弹出扩展参数
          if (archModalInfo.extendParams) {
            DakoptStore.extendParams = archModalInfo.extendParams;
          }
          DakoptStore.modalTitle = archModalInfo.title;
          DakoptStore.modalVisit = !archModalInfo.disableModal;
          DakoptStore.optcode = opt.optcode || '';
          DakoptStore.menuActionItem = opt;
          DakoptStore.modalUrl = archModalInfo.url;
          DakoptStore.archModalInfo = archModalInfo;
          // 调用编辑界面
          if (archModalInfo.modalType) {
            DakoptStore.modalType = archModalInfo.modalType;
            DakoptStore.detailVisible = archModalInfo.detailVisible;
            DakoptStore.editRecord = archModalInfo.record;
          }
        });
      }
    },
    //action
    async getDakTree() {
      const params = { isby: 'N', noshowdw: 'Y', node: 'root', tmzt: '2' };
      params['dayh'] = SysStore.getCurrentUser().id;
      params['dw'] = SysStore.getCurrentCmp().id;
      const res = await fetch.get('/api/eps/control/main/dak/queryTree', {
        params,
      });
      if (res.status == 200) {
        debugger;
        // this.daktreeData = res.data;
        this.daktreeData = getTreeNodeData(res.data);
        console.log(this.daktreeData);
      }
    },
    async getSjzdData(zdmc) {
      const fd = new FormData();
      fd.append('zdx', zdmc);
      const res = await fetch.post(
        '/api/eps/control/main/dalydj/querySjzd',
        fd,
      );
      if (res && res.data && res.data.success) {
        runInAction(() => {
          this.sjzdData[zdmc] = res.data.results;
        });
      }
    },
    async queryDw() {
      const response = await fetch.post(
        '/api/eps/control/main/dw/queryForListByYhid',
      );
      if (response && response.status === 200) {
        this.dwdata = response.data;
        console.log('dwdata', this.dwdata);
      } else {
        this.loading = true;
      }
    },
  }));
  const getTreeNodeData = (treeNodes) => {
    let nodes = treeNodes.map((node) => {
      node.disabled = node.lx == 'F';
      node.key = node.id;
      node.value = node.id;
      node.title = node.text;
      if (node.children && node.children.length > 0) {
        node.children = getTreeNodeData(node.children);
      }
      return node;
    });
    return nodes;
  };
  const DakoptStore: ArchStoreType = useLocalObservable(() => ({
    //导入EEP
    async DAK0135(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      let filter = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        yhid: dakoptService.yhid,
        yhbh: dakoptService.yhbh,
        yhmc: dakoptService.yhmc,
        cjdw: dakoptService.dwid,
        dwmc: DalxjsStore.yjdwmc,
        daklx: DakoptStore.ktable?.daklx,
        eepjc: '',
        dakbmc: params.bmc,
        dakmc: params.mc,
        yjdwbh: DalxjsStore.yjdwbh,
        // yjdwmc: DalxjsStore.yjdwmc,
        mbid: DakoptStore.ktable?.mbid,
        mkxx: '档案管理/离线接收/[' + params.mc + ']',
        lxjsbz: 'Y',
      };
      setEepvisible(true);
      setEepparams(filter);
      return { disableModal: true };
    },
    // 批量挂接
    async DAK0201(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      const tmids = {};
      const keyvalues = {
        dakid: params.dakid,
        bmc: params.bmc,
        dwid: SysStore.getCurrentCmp().id,
      };
      tmids['tmids'] = ids.join(',');
      var iddt = await fetch.post(
        '/api/eps/control/main/dagl/saveChecked?dakid=' +
          params.dakid +
          '&bmc=' +
          params.bmc +
          '&dwid=' +
          SysStore.getCurrentCmp().id,
      );
      console.log('DAK0201', iddt.data);
      tmids['id'] = iddt.data;
      tmids['tmzt'] = params.tmzt;
      tmids['bmc'] = params.bmc;

      localStorage.setItem('token', cookie.load('ssotoken'));
      if (ids.length < 1) {
        localStorage.setItem('id', params.dakid);
      } else {
        dakoptService.saveTmid(tmids);
        localStorage.setItem('id', iddt.data);
      }
      localStorage.setItem('dakid', params.dakid);
      localStorage.setItem('daklx', params.tmzt);
      localStorage.setItem('jclx', status);
      localStorage.setItem('mbid', DakoptStore.ktable?.mbid);
      localStorage.setItem('ip', window.location.host);
      var defaultv = await fetch.post(
        '/api/eps/control/main/params/getUserOption?code=DAGLF012&yhid=' +
          dakoptService.yhid,
      );
      if (defaultv.data.message === 'Y') {
        return {
          url: `/api/eps/xplgj/plgjgjE9?`,
          title: '批量挂接',
          width: 1450,
          height: 565,
        };
      } else {
        return {
          url: `/api/eps/xplgjgch/plgjgchE9?`,
          title: '批量挂接',
          width: 1450,
          height: 565,
        };
      }
    },
    // 老批量挂接
    async DAK0011(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      debugger;
      console.log(optcode);
      console.log(params);
      console.log(archStore);
      console.log(dakoptService.dwid);
      var tmids = {};
      tmids['tmids'] = ids.join(',');
      var iddt = await fetch.post(
        '/api/eps/control/main/dagl/saveChecked?dakid=' +
          params.dakid +
          '&bmc=' +
          params.bmc +
          '&dwid=' +
          dakoptService.dwid,
      );
      tmids['id'] = iddt.data;
      tmids['tmzt'] = '2';
      tmids['bmc'] = params.bmc;
      dakoptService.saveTmid(tmids);
      if (iddt.data) {
        var url = 'epssoft:@BatchLink@?';
        const Linuxurl = 'BatchLink:';
        var epsurl =
          iddt.data +
          '&' +
          cookie.load('ssotoken') +
          '&http://' +
          location.hostname +
          ':' +
          location.port +
          '&' +
          2 +
          '&' +
          dakoptService.yhid +
          '&' +
          dakoptService.yhmc +
          '&' +
          '';
        const system = dakoptService.getCurrentOS();
        debugger;
        if (system === 'Windows') {
          window.location.href = url + epsurl;
        } else if (system === 'Linux') {
          window.location.href = Linuxurl + epsurl;
        }
      }
      return { disableModal: true };
    },

    // 批量导入
    async DAK0010(
      optcode: string,
      params: ArchParams,
      store: ArchStoreType,
      ids: string[],
    ) {
      const dakGrid = {
        sfdyw: DakoptStore.ktable?.sfdyw,
        stflid: DakoptStore.ktable?.dywstfl,
      };
      const filter = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: DakoptStore.ktable?.mbid,
        lx: params.lx,
        ly: params.tmzt,
        daklx: DakoptStore.ktable?.daklx,
        bmc: params.bmc,
        dakGrid,
        dakmc: params.mc,
        toolbarId: 'toolbar',
        pldrjc: true,
        yjdwbh: DalxjsStore.yjdwbh,
        yjdwmc: DalxjsStore.yjdwmc,
        lxjsbz: 'Y',
      };
      return {
        url: `/api/eps/control/main/dagl/pldr?${qs.stringify(filter)}`,
        params: filter,
        title: '批量导入',
        filter,
        width: 1280,
        height: 680,
        fullModal: true,
        modalStyles: {
          /// top:15
        },
      };
    },
    setModalVisit(visit: boolean) {
      DakoptStore.modalVisit = visit;
    },
  }));
  useEffect(() => {
    DalxjsStore.getDakTree();
    DalxjsStore.queryDw().then(() => {
      const params = {
        params: {
          dwid: SysStore.getCurrentCmp().id,
          lxjsbz: 'Y',
          drlxsql: DalxjsStore.drlxsql,
        },
      };
      DalxjsStore.getSjdrlsData(params);
      DalxjsStore.getSjzdData('移交单位');
    });
  }, []);
  const dalxjscolumns = [
    {
      title: '操作',
      align: 'center',
      key: 'action',
      fixed: true,
      width: '30px',
      render: (text, record, index) => {
        return (
          <>
            <Tooltip title="查看详情">
              <Button
                size="small"
                style={{ fontSize: '12px' }}
                type="link"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={(event) => {
                  event.nativeEvent.stopImmediatePropagation();
                  event.stopPropagation();
                  // if (top.mainStore) {
                  //   //9.0
                  //   const params: ArchParams = {
                  //     umid: 'DAGL002',
                  //     umname: record.dakmc + '【档案整理】',
                  //     bmc: record.dakbmc,
                  //     dakid: record.dakid,
                  //     mbid: record.mbid,
                  //     wzlk: 'N',
                  //     type: 'K',
                  //     lx: '01',
                  //     path: `/runRfunc/archManage/${record.dakid}/2`,
                  //     tmzt: 2,
                  //     key: record.drpc,
                  //   };
                  //   top.mainStore.addTab(
                  //     { name: params.umname, path: params.path, key: params.path },
                  //     params.path,
                  //     params,
                  //   );
                  //   return;
                  // } else {
                  //   //8.8嵌套
                  //   const params = {
                  //     dakid: record.dakid,
                  //     mbid: record.mbid,
                  //     bmc: record.dakbmc,
                  //     tmzt: 2,
                  //     key: record.drpc,
                  //     lx: 'K',
                  //   };
                  //   top.runFunc(
                  //     'DAGL002',
                  //     params,
                  //     '' + record.dakmc + '【整理】',
                  //   );
                  // }
                  if (record.drpc) {
                    const params: ArchParams = {
                      umid: 'DAGL002',
                      umname: record.dakmc + '【档案整理】',
                      bmc: record.dakbmc,
                      dakid: record.dakid,
                      mbid: record.mbid,
                      wzlk: 'N',
                      type: 'K',
                      lx: record.daklx || '01',
                      path: `/runRfunc/archManage/${record.dakid}/${record.daktmzt}`,
                      tmzt: record.daktmzt || '2',
                      key: record.drpc,
                    };
                    debugger;
                    runFunc(params);
                  } else {
                    message.warning(
                      '当前记录无批次号，无法查看当前导入批次数据！',
                    );
                    return;
                  }

                  //直接根据档案库ID，状态，档案库名称
                  // top.runFuncDak('DAGL002','' + record.dakid + '',2,'' + record.dakmc + '【整理】')
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      title: '接收批次号',
      dataIndex: 'drpc',
      width: '120px',
      key: 'drpc',
    },
    {
      title: '移交单位',
      dataIndex: 'yjdw',
      width: '120px',
      key: 'yjdw',
      render: (text, record, index) => {
        return record.yjdwbh + ' ' + record.yjdwmc;
      },
    },
    {
      title: '接收类型',
      dataIndex: 'drlx',
      width: '100px',
      key: 'drlx',
      render: (text, record, index) => {
        if (text === '1') {
          return '条目接收';
        }
        if (text === '2') {
          return '原文接收';
        }
        if (text === '3') {
          return '数据包接收';
        }
      },
    },
    {
      title: '接收人',
      dataIndex: 'drr',
      width: '100px',
      key: 'drr',
    },
    {
      title: '接收数量',
      dataIndex: 'drzs',
      width: '100px',
      key: 'drzs',
    },
    {
      title: '接收成功数量',
      dataIndex: 'drzjs',
      width: '100px',
      key: 'drzjs',
    },
    {
      title: '接收失败数量',
      dataIndex: 'drsbs',
      width: '100px',
      key: 'drsbs',
    },
    {
      title: '接收时间',
      dataIndex: 'drsj',
      width: '100px',
      key: 'drsj',
      render: (text, record, index) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '接收单位',
      dataIndex: 'dwmc',
      width: '120px',
      key: 'dwmc',
    },
  ];
  // end **************
  const onSelect = (value, node, extra) => {
    const { children, ...others } = node;
    DalxjsStore.selectOthers = others;
    debugger;
    const params: ArchParams = {
      umid: jdumid,
      umname: `${node.mc}【${jdname}】`,
      bmc: others.mbc,
      dakid: others.id,
      lx: others.lx,
      wzlk: 'N',
      type: others.type,
      mc: others.mc,
      title: others.title,
      tmzt: tmzt,
    };
    DakoptStore.archParams = params;
    // 是否案卷
    DalxjsStore.isRecords = params.lx != '01' && params.lx != '0201';
    //初始化
    DalxjsStore.initKtable();
  };
  //批量导入
  const onPldr = () => {
    if (DalxjsStore.currentdak === '' || DalxjsStore.currentdak === undefined) {
      message.warning('请先选择一个档案库，再进行条目接收！');
      return;
    }
    if (DalxjsStore.yjdwmc === '' || DalxjsStore.yjdwmc === undefined) {
      message.warning('请先选择一个移交单位，再进行条目接收！');
      return;
    }
    // setPldrvisible(true);
    const opt = {
      name: '条目接收',
      optcode: 'DAK0010',
    };
    const ids = [];
    const store = [];
    const records = [];
    DalxjsStore.doArchAction(opt, ids, store, records, DakoptStore.ktable);
    setCurrentstep(3);
  };
  //批量挂接
  const onPlgj = () => {
    if (checkedRows.length < 1) {
      message.warning('请先选择一条批量导入记录，再进行原文接收！');
      return;
    }
    if (checkedRows[0].drlx === '3') {
      message.warning('数据包接收导入记录不可再次进行原文接收！');
      return;
    }
    // onRunFuncDak(checkedRows[0]);
    const opt = {
      name: '原文接收',
      optcode: 'DAK0011',
    };
    DalxjsStore.getcurrentpcdatas(checkedRows[0]).then(() => {
      debugger;
      let iddata = [];
      DalxjsStore.currentpcdatas.forEach((currentpcdata) => {
        const key = checkedRows[0].dakbmc + '_ID';
        iddata.push(currentpcdata[key]);
      });
      const ids = iddata;
      const store = [];
      const params: ArchParams = {
        bmc: checkedRows[0].dakbmc,
        dakid: checkedRows[0].dakid,
      };
      DakoptStore.archParams = params;
      DalxjsStore.doArchAction(
        opt,
        ids,
        store,
        checkedRows[0],
        DakoptStore.ktable,
      );
    });
  };
  //EEP导入
  const onEepdr = () => {
    if (DalxjsStore.currentdak === '' || DalxjsStore.currentdak === undefined) {
      message.warning('请先选择一个档案库，再进行数据包接收！');
      return;
    }
    if (DalxjsStore.yjdwmc === '' || DalxjsStore.yjdwmc === undefined) {
      message.warning('请先选择一个移交单位，再进行数据包接收！');
      return;
    }
    const opt = {
      name: '数据包接收',
      optcode: 'DAK0135',
    };
    const ids = [];
    const store = [];
    const records = [];
    console.log(DakoptStore.ktable);
    DalxjsStore.doArchAction(opt, ids, store, records, DakoptStore.ktable);
  };

  const onuploadChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      if (!res.success) {
        message.error(`${res.message} `);
        return;
      }
      message.success(`${info.file.name} 接收成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 接收失败.`);
    }
  };

  function beforeUpload(file) {
    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf('.') + 1);
    if (extName != 'eep') {
      isJpgOrPng = false;
      message.error('只能接收eep文件!');
    }
    return isJpgOrPng;
  }
  const refreshPage = async () => {
    const drparams = {
      params: {
        lxjsbz: 'Y',
        dwid: SysStore.getCurrentCmp().id,
        dakid: DalxjsStore.selectOthers.id,
      },
    };
    DalxjsStore.getSjdrlsData(drparams);
    DalxjsStore.getJscsData(drparams);
  };
  const handleEepCancel = () => {
    setEepvisible(false);
    refreshPage();
  };
  //搜索事件
  const handleSearch = () => {
    form.validateFields().then((values) => {
      const entity = {};
      const { entries } = Object;
      let ks = '';
      let js = '';
      entries(values).forEach(([key, value]) => {
        if (value) {
          if (key === 'jsrq') {
            ks = value[0];
            js = value[1];
            if (js == undefined) {
              js = '';
            } else {
              const jsyear = js.format('YYYY');
              const jsmonth = js.format('MM');
              js =
                "'" +
                js.format('YYYY-MM') +
                '-' +
                mGetDate(jsyear, jsmonth) +
                "'";
            }
            if (ks == undefined) {
              ks = '';
            } else {
              ks = "'" + ks.format('YYYY-MM') + "-01'";
            }
          }
        } else {
          entity[key] = value;
        }
      });
      let params = {};
      params['drlxsql'] = DalxjsStore.drlxsql;
      params['lxjsbz'] = 'Y';
      params['jsksrq'] = ks;
      params['jsjsrq'] = js;
      params['dakid'] = DalxjsStore.currentdak;
      debugger;
      params['yjdwmc'] = DalxjsStore.yjdwmc;
      params['dwid'] = SysStore.getCurrentCmp().id;
      const drparams = { params };
      DalxjsStore.getSjdrlsData(drparams);
    });
  };
  const mGetDate = (year, month) => {
    var d = new Date(year, month, 0);
    return d.getDate();
  };
  const onDakChange = (value, label, extra) => {
    debugger;
    // setCurrentDak(value);
    DalxjsStore.currentdak = value;
    setCurrentstep(1);
    handleSearch();
  };
  const onYjdwChange = (value, label, extra) => {
    DalxjsStore.yjdwmc = value;
    DalxjsStore.yjdwbh = label.children[0];
    form.setFieldsValue({ yjdwmc: value });
    setCurrentstep(2);
    setCurrenteepstep(2);
    handleSearch();
  };
  const onCxYjdwChange = (value, label, extra) => {
    DalxjsStore.yjdwmc = value;
    DalxjsStore.yjdwbh = label.children[0];
    handleSearch();
  };
  const onTabsChange = (key) => {
    console.log(key);
    debugger;
    if (key == '1') {
      DalxjsStore.drlxsql = "('1' , '2')";
      const params = {
        params: {
          dwid: SysStore.getCurrentCmp().id,
          lxjsbz: 'Y',
          drlxsql: DalxjsStore.drlxsql,
        },
      };
      DalxjsStore.getSjdrlsData(params);
    }
    if (key == '2') {
      DalxjsStore.drlxsql = "( '3')";
      const params = {
        params: {
          dwid: SysStore.getCurrentCmp().id,
          lxjsbz: 'Y',
          drlxsql: DalxjsStore.drlxsql,
        },
      };
      DalxjsStore.getSjdrlsData(params);
    }
  };
  // const onTableRowChange = (selectedRowKeys, records) => {
  //   debugger
  //   DalxjsStore.setSelectRows(selectedRowKeys, records);
  // };
  // const onRunFuncDak = (record) => {
  //   const params = {
  //     dakid: record.dakid,
  //     mbid: record.mbid,
  //     bmc: record.dakbmc,
  //     tmzt: 2,
  //     key: record.drpc,
  //     lx: 'K',
  //   };
  //   top.runFunc('DAGL002', params, '' + record.dakmc + '【整理】');
  // };
  return (
    <div className="home-page">
      <Tabs
        defaultActiveKey="1"
        onChange={onTabsChange}
        type="card"
        style={{ width: '100%', height: '100%' }}
      >
        <TabPane
          tab="数字化副本接收"
          key="1"
          style={{ width: '100%', height: '100%' }}
        >
          <Layout style={{ width: '100%', height: '100%' }}>
            <Row style={{ height: '100%' }}>
              <Col span={4}>
                <div className="left">
                  <div className="part part1">
                    <Steps
                      current={currentstep}
                      direction="vertical"
                      style={{ padding: 10 }}
                    >
                      <Step
                        title="档案库"
                        description={
                          <div style={{ paddingTop: '10px' }}>
                            <TreeSelect
                              showSearch
                              placeholder="请选择档案库"
                              value={DalxjsStore.currentdak}
                              treeData={DalxjsStore.daktreeData}
                              style={{ width: '100%' }}
                              treeDefaultExpandAll
                              onChange={onDakChange}
                              onSelect={onSelect}
                              notFoundContent="未找到数据"
                            />
                          </div>
                        }
                      />
                      <Step
                        title="移交单位"
                        description={
                          <div style={{ paddingTop: '10px' }}>
                            <Select
                              style={{ width: '100%' }}
                              value={DalxjsStore.yjdwmc}
                              placeholder="请选择移交单位"
                              onChange={onYjdwChange}
                            >
                              {(DalxjsStore.sjzdData['移交单位'] || []).map(
                                (o) => (
                                  <Select.Option value={o.mc} key={o.id}>
                                    {o.bh} {o.mc}
                                  </Select.Option>
                                ),
                              )}
                            </Select>
                          </div>
                        }
                      />
                      <Step
                        title="条目接收"
                        description={
                          <div className="innerCardOne">
                            <div className="subTitle">条目接收</div>
                            <div className="button" onClick={() => onPldr()}>
                              导入
                            </div>
                          </div>
                        }
                      />
                      <Step
                        title="原文接收"
                        description={
                          <div className="innerCardTwo">
                            <div className="subTitle">原文接收</div>
                            <div className="button" onClick={() => onPlgj()}>
                              挂接
                            </div>
                          </div>
                        }
                      />
                    </Steps>
                    {/* <Divider />
                    <Steps
                      initial={2}
                      current={currenteepstep}
                      direction="vertical"
                      style={{ padding: 10 }}
                    >
                      <Step
                        title="数据包接收"
                        description={
                          <div className="innerCardThree">
                            <div className="subTitle">数据包接收</div>
                            <div className="button" onClick={() => onEepdr()}>
                              上传
                            </div>
                          </div>
                        }
                      />
                    </Steps> */}
                  </div>
                </div>
              </Col>
              <Col span={20}>
                <div
                  className="center"
                  style={{
                    backgroundColor: '#fff',
                  }}
                >
                  <div className="part part3">
                    <Row style={{ paddingTop: '20px' }}>
                      <Col span={20}>
                        <div className="search">
                          <Form
                            name="searchForm"
                            form={form}
                            {...formItemLayout}
                          >
                            <Row className="form-row">
                              <Col span={10}>
                                <Form.Item label="移交单位:" name="yjdwmc">
                                  <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择移交单位"
                                    onChange={onCxYjdwChange}
                                  >
                                    {(
                                      DalxjsStore.sjzdData['移交单位'] || []
                                    ).map((o) => (
                                      <Select.Option value={o.mc} key={o.id}>
                                        {o.bh} {o.mc}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item label="接收日期:" name="jsrq">
                                  <RangePicker
                                    allowClear
                                    style={{ width: '100%' }}
                                    format="YYYY-MM"
                                    picker="month"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </Col>
                      <Col span={3}>
                        <div className="btns">
                          {' '}
                          <Button
                            type="primary"
                            style={{ fontSize: '12px' }}
                            onClick={handleSearch}
                            icon={<SearchOutlined />}
                          >
                            查询
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <div className="content">
                      <Table
                        dataSource={DalxjsStore.sjdrlsdata}
                        bordered
                        rowKey="id"
                        className="my-table"
                        loading={DalxjsStore.loading}
                        expandable={{ defaultExpandAllRows: true }}
                        onRow={(record) => {
                          return {
                            onClick: (event) => {
                              event.nativeEvent.stopImmediatePropagation();
                              event.stopPropagation();
                              console.log(record);
                            },
                          };
                        }}
                        rowSelection={{
                          selections: [
                            Table.SELECTION_ALL,
                            Table.SELECTION_INVERT,
                            Table.SELECTION_NONE,
                          ],
                          type: 'radio',
                          onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setCheckedRows(selectedRows);
                            // setCurrentDak(selectedRows[0].dakid);
                            DalxjsStore.currentdak = selectedRows[0].dakid;
                            debugger;
                            DalxjsStore.yjdwmc = selectedRows[0].yjdwmc;
                            form.setFieldsValue({
                              yjdwmc: selectedRows[0].yjdwmc,
                            });
                            setCurrentstep(3);
                          },
                          selectedRowKeys: selectedRowKeys,
                        }}
                      >
                        {dalxjscolumns.map((col) => (
                          <Table.Column align="center" {...col} />
                        ))}
                      </Table>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Layout>
        </TabPane>
        <TabPane
          tab="ASIP包接收"
          key="2"
          style={{ width: '100%', height: '100%' }}
        >
          <Layout style={{ width: '100%', height: '100%' }}>
            <Row style={{ height: '100%' }}>
              <Col span={4}>
                <div className="left">
                  <div className="part part1">
                    <Steps
                      current={currentstep}
                      direction="vertical"
                      style={{ padding: 10 }}
                    >
                      <Step
                        title="档案库"
                        description={
                          <div style={{ paddingTop: '10px' }}>
                            <TreeSelect
                              showSearch
                              placeholder="请选择档案库"
                              value={DalxjsStore.currentdak}
                              treeData={DalxjsStore.daktreeData}
                              style={{ width: '100%' }}
                              treeDefaultExpandAll
                              onChange={onDakChange}
                              onSelect={onSelect}
                              notFoundContent="未找到数据"
                            />
                          </div>
                        }
                      />
                      <Step
                        title="移交单位"
                        description={
                          <div style={{ paddingTop: '10px' }}>
                            <Select
                              style={{ width: '100%' }}
                              value={DalxjsStore.yjdwmc}
                              placeholder="请选择移交单位"
                              onChange={onYjdwChange}
                            >
                              {(DalxjsStore.sjzdData['移交单位'] || []).map(
                                (o) => (
                                  <Select.Option value={o.mc} key={o.id}>
                                    {o.bh} {o.mc}
                                  </Select.Option>
                                ),
                              )}
                            </Select>
                          </div>
                        }
                      />
                      {/* <Step
                        title="条目接收"
                        description={
                          <div className="innerCardOne">
                            <div className="subTitle">条目接收</div>
                            <div className="button" onClick={() => onPldr()}>
                              导入
                            </div>
                          </div>
                        }
                      />
                      <Step
                        title="原文接收"
                        description={
                          <div className="innerCardTwo">
                            <div className="subTitle">原文接收</div>
                            <div className="button" onClick={() => onPlgj()}>
                              挂接
                            </div>
                          </div>
                        }
                      /> */}
                    </Steps>
                    <Divider />
                    <Steps
                      initial={2}
                      current={currenteepstep}
                      direction="vertical"
                      style={{ padding: 10 }}
                    >
                      <Step
                        title="数据包接收"
                        description={
                          <div className="innerCardThree">
                            <div className="subTitle">数据包接收</div>
                            <div className="button" onClick={() => onEepdr()}>
                              上传
                            </div>
                          </div>
                        }
                      />
                    </Steps>
                  </div>
                </div>
              </Col>
              <Col span={20}>
                <div
                  className="center"
                  style={{
                    backgroundColor: '#fff',
                  }}
                >
                  <div className="part part3">
                    <Row style={{ paddingTop: '20px' }}>
                      <Col span={20}>
                        <div className="search">
                          <Form
                            name="searchForm"
                            form={form}
                            {...formItemLayout}
                          >
                            <Row className="form-row">
                              <Col span={10}>
                                <Form.Item label="移交单位:" name="yjdwmc">
                                  <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择移交单位"
                                    onChange={onCxYjdwChange}
                                  >
                                    {(
                                      DalxjsStore.sjzdData['移交单位'] || []
                                    ).map((o) => (
                                      <Select.Option value={o.mc} key={o.id}>
                                        {o.bh} {o.mc}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item label="接收日期:" name="jsrq">
                                  <RangePicker
                                    allowClear
                                    style={{ width: '100%' }}
                                    format="YYYY-MM"
                                    picker="month"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </Col>
                      <Col span={3}>
                        <div className="btns">
                          {' '}
                          <Button
                            type="primary"
                            style={{ fontSize: '12px' }}
                            onClick={handleSearch}
                            icon={<SearchOutlined />}
                          >
                            查询
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <div className="content">
                      <Table
                        dataSource={DalxjsStore.sjdrlsdata}
                        bordered
                        rowKey="id"
                        className="my-table"
                        loading={DalxjsStore.loading}
                        expandable={{ defaultExpandAllRows: true }}
                        onRow={(record) => {
                          return {
                            onClick: (event) => {
                              event.nativeEvent.stopImmediatePropagation();
                              event.stopPropagation();
                              console.log(record);
                            },
                          };
                        }}
                        rowSelection={{
                          selections: [
                            Table.SELECTION_ALL,
                            Table.SELECTION_INVERT,
                            Table.SELECTION_NONE,
                          ],
                          type: 'radio',
                          onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setCheckedRows(selectedRows);
                            // setCurrentDak(selectedRows[0].dakid);
                            DalxjsStore.currentdak = selectedRows[0].dakid;
                            debugger;
                            DalxjsStore.yjdwmc = selectedRows[0].yjdwmc;
                            form.setFieldsValue({
                              yjdwmc: selectedRows[0].yjdwmc,
                            });
                            setCurrentstep(3);
                          },
                          selectedRowKeys: selectedRowKeys,
                        }}
                      >
                        {dalxjscolumns.map((col) => (
                          <Table.Column align="center" {...col} />
                        ))}
                      </Table>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Layout>
        </TabPane>
      </Tabs>
      <ArchMenuAction
        params={DakoptStore.archParams}
        modalVisit={DakoptStore.modalVisit}
        archStore={DakoptStore}
        extendParams={DakoptStore.extendParams}
        opt={DakoptStore.menuActionItem}
      />
      <Modal
        title="数据包接收"
        visible={eepvisible}
        footer={null}
        onCancel={handleEepCancel}
        width="400px"
        bodyStyle={{ textAlign: 'center' }}
      >
        <Upload
          action="/api/eps/control/main/gszxyjcx/importEepInfonew"
          onChange={onuploadChange}
          beforeUpload={beforeUpload}
          name="Fdata"
          data={eepparams}
        >
          <br />
          <Button
            icon={<UploadOutlined />}
            type="primary"
            style={{ margin: '0 0 10px' }}
          >
            选择导入EEP
          </Button>
        </Upload>
      </Modal>
    </div>
  );
});
export default Dalxjs;
