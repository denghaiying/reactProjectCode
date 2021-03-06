import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import TableService from './TableService';
import dakoptService from './dakoptService';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import SysStore from '@/stores/system/SysStore';
import fetch from '../../../../utils/fetch';
import {
  ITable,
  ITitle,
  ITree,
  IUpload,
  EpsSource,
} from '@/eps/commons/declare';
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Modal,
  Tooltip,
  Upload,
  Badge,
  Affix,
  Space,
} from 'antd';
import EpsFilesView from '@/eps/components/file/EpsFilesView';
import EpsUploadButton from '@/eps/components/buttons/EpsUploadButton';
import util from '@/utils/util';
import { observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import EpsFormType from '@/eps/commons/EpsFormType';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";

import ArchMenuAction from './ArchMenuAction';
import ArchCommon from './ArchCommon';
import treeService from './treeService';
import qs from 'qs';
import Detail from './Detail';
import GroupSelect from '@/eps/business/DakLayout/components/GroupSelect';
import {
  FileAddOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  ConsoleSqlOutlined,
  UploadOutlined,
  AuditOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import Sys from '@/pages/sys';
import { resolveOnChange } from 'antd/es/input/Input';
const { confirm } = Modal;
const umid = 'DAGL';
const httpRequest = new HttpRequest('/api/api/eps/control/main');
import wdglAttachdocService from './WdglAttachdocService';
import ConditionSearch from '@/eps/components/search/ConditionSearch';
import EpsReportPrintButton from '@/eps/components/buttons/EpsReportPrintButton';
import cookie from 'react-cookies';
import { Message } from '@alifd/next';
import { debounce } from '@umijs/deps/compiled/lodash';
import OptrightStore from '@/stores/user/OptrightStore';
import RightStore from '@/components/RightContent/RightStore';
import moment from 'moment';
import { Item } from 'gg-editor';
import './index.less';
import { ArchParams } from '@/stores/appraisa/AppraisaManageStore';
import DrawerAction from './DrawerAction';
import Ywzhgz from '@/pages/daly/ywzd/ywzdgz';
import YwzdOne from '@/pages/daly/ywzd/ywzdone';
import Dazdcl from '@/pages/daly/dazd/dazdcl';
import DakcartService from '@/eps/components/list/articles/DakcartService';

// ???????????????
const customForm = () => {
  return <>{/*  */}</>;
};

const ArchManage = observer((props) => {
  // eslint-disable-next-line prefer-destructuring

  const archParams: ArchParams = props.archParams;

  const ref = useRef();
  //const [sjdata, setSjdata] = useState();
  const archStore: ArchStoreType = useLocalObservable(() => ({
    // ??????
    archParams,
    columns: [],
    // ?????????????????????
    ktable: {},
    // ??????????????????
    kfields: [],
    // ???????????????
    advSearchColumns: [],
    // ???????????????action
    menuActionItem: {},
    // ?????????opt
    dakopt: [],
    // tmzt
    tmzt: archParams.tmzt,
    //
    optcode: '',
    //
    useIframe: true,
    //
    menuProp: [],
    // ????????????
    menuButton: [],
    // ????????????
    menuTable: [],
    // ????????????????????????
    modalVisit: false,
    // ??????????????????
    drawVisit: false,
    // ?????????id
    dakid: archParams.dakid,
    // ??????id
    dwid: '',
    // ????????????
    selectRecords: [],
    // ???????????????
    modalHeight: 800,
    // ???????????????
    modalWidth: 1280,
    // ???????????????
    sfdyw: false,
    // ????????????id
    stflid: null,
    // iframeUrl
    iframeUrl: '',
    // ???????????????????????????
    showFoot: false,
    //
    archModalInfo: {},
    //
    modalTitle: null,
    //
    modalUrl: '',
    // ??????????????????drawer??????
    isDrawer: false,
    //
    currentUser: util.getLStorage('currentUser'),
    //????????????
    checkPermission() {
      return true;
    },
    detailVisible: false,
    // ????????????
    setDetailVisible(visible: boolean) {
      this.detailVisible = visible;
    },
    //
    isAdd: true,
    //
    editRecord: {},

    isModalVisible: false,
    // ??????????????????
    setIsModalVisible(visible: boolean) {
      this.isModalVisible = visible;
    },
    selectRows: [],
    // add edit view
    opt: 'add',
    //uploadprop
    //up
    upbmc: '',
    //
    fjgrid: '',
    // ???????????????
    daqx: '',

    // eep??????????????????
    eepjc: false,
    // ???????????????
    extendParams: {},
    // ?????????extra??????
    extra: {},
    //
    drawUrl: '',
    drawTitle: '',
    drawExtendParams: {},
    drawWidth: 400,
    dakCartCount: '0',

    eepjc135: false,
    doctypelist: [],
    uploadProp: {
      disableUpload: true,
      disableBigUpload: true,
      disableConvertFiles: true,
      disableMediaTwo:true,
      disableMediaSpilit:true,
      disableMediaConcat:true,
      uploadUrl: '/api/eps/wdgl/attachdoc/upload', //??????url??????
      dw: SysStore.getCurrentUser().dwid, //????????????ID
      umId: 'DAGL003',
      aprint: '', //??????????????????
      adown: '', //???????????? ??????
    },
    uploadtableProp: {
      disableAdd: true,
      disableCopy: true,
      labelColSpan: 8,
      tableSearch: false,
      rowSelection: {
        //type: 'radio',
        type: 'checkbox',
      },
      searchCode: 'title',
    },

    /**
     * ???????????? ??????source
     */
    fjsource: [
      {
        title: '??????',
        code: 'title',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150,
      },
      {
        title: '?????????',
        code: 'filename',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150,
      },
      {
        title: '????????????',
        code: 'ext',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '????????????',
        code: 'size',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '????????????',
        code: 'lx',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          let xfglist = archStore.doctypelist;
          let aa = xfglist.filter((item) => {
            return item.value === text;
          });
          return aa[0]?.label;
        },
      },
      {
        title: '????????????',
        code: 'mj',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '?????????',
        code: 'bbh',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '?????????',
        code: 'md5code',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '????????????',
        code: 'wjzh',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record) => {
          // if (text == "undefined") {
          //   return "?????????";
          // } else if (text == 0) {
          //   return "?????????";
          // } else if (text == 1) {
          //   return "????????????";
          // } else if (text == 13) {
          //   return "????????????";
          // }
          if (text === '1') {
            return '????????????';
          } else {
            return '?????????';
          }
        },
      },
    ],
    //??????????????????
    enablAdd: false,
    //??????????????????
    enablEdit: false,
    //??????????????????
    enablDelete: false,
    // ????????????
    //psql: archParams.psql,
    psql: '((1=1))',
    tableProp: {
      tableSearch: true,
      disableDelete: true,
      disableEdit: true,
      disableCopy: true,
      disableAdd: true,
      initSearchValue: archParams.key,
      actionColumnNum: 2,
      rowSelection: {
        type: 'checkbox',
      },
    },

    getMenProps(dakopt) {
      return dakopt.map((item) => {
        return {
          title: item.name,
          icon: 'icon_import_white',
          onClick: (ids, store, records) => {
            if (
              ArchCommon[item.optcode] &&
              ArchCommon[item.optcode].showPopconfirm
            ) {
              confirm({
                title: ArchCommon[item.optcode].popTitle || '??????????',
                icon: <ExclamationCircleOutlined />,
                content: ArchCommon[item.optcode].popContentText,
                okText: ArchCommon[item.optcode].okText || '??????',
                okType: 'danger',
                cancelText: ArchCommon[item.optcode].cancelText || '??????',
                onOk: () =>
                  archStore.doArchAction(
                    item,
                    ids,
                    store,
                    records,
                    this.ktable,
                  ),
                onCancel: () => console.log('cancel'),
              });
            } else {
              this.doArchAction(item, ids, store, records, this.ktable);
            }
          },
          params: {
            tmzt: this.tmzt,
            daklx: this.ktable.daklx,
            optcode: item.optcode,
            dakid: this.dakid,
            fid: 1,
          },
          color: '#CFA32A',
          toolbarShow: false,
        };
      });
    },

    getMenuButton(dakyhOpt) {
      return dakyhOpt.map((item) => {
        let params = {
          optcode: item.optcode,
          daklx: item.daklx,
          dakid: this.dakid,
          optlx: '1',
          wzlk: archParams.wzlk ? archParams.wzlk : undefined,
          isadd: item.isadd,
          fid: item.fid,
          tmzt: item.tmzt,
        };
        if (archParams.wzlk == 'Y') {
          params['wzlk'] = 'Y';
        }
        return {
          title: item.name,
          params,
          onClick: (ids, store, records) => {
            this.doArchAction(item, ids, store, records, ktable);
          },
        };
      });
    },

    getMenuTable(dakTableOpt) {
      return dakTableOpt.map((item) => {
        let params = {
          optcode: item.optcode,
          daklx: item.daklx,
          dakid: this.dakid,
          optlx: '1',
          wzlk: archParams.wzlk ? archParams.wzlk : undefined,
          isadd: item.isadd,
          fid: item.fid,
          tmzt: item.tmzt,
        };
        if (archParams.wzlk == 'Y') {
          params['wzlk'] = 'Y';
        }
        return {
          title: item.name,
          params,
          onClick: (ids, store, records) => {
            this.doArchAction(item, ids, store, records, ktable);
          },
        };
      });
    },

    initSysOpertion(archParams: ArchParams, bmc: string, dakqx) {
      this.uploadProp.doctbl = bmc + '_FJ'; //????????????
      this.uploadProp.grptbl = bmc + '_FJFZ'; //??????????????????
      this.uploadProp.wrkTbl = bmc; //????????????
      this.uploadProp.dakid = archParams.dakid;
      if (dakqx != undefined && dakqx != null && dakqx != '') {
        if (dakqx.indexOf(',SYS101,') > 0) {
          this.enablAdd = true;
        }
        if (dakqx.indexOf(',SYS102,') > 0) {
          this.enablEdit = true;
        }
        if (dakqx.indexOf(',SYS103,') > 0) {
          this.enablDelete = true;
        }
        /**???????????? */
        if (dakqx.indexOf(',SYS302,') > 0) {
          this.uploadProp['disableViewDoc'] = false;
        }
        if (dakqx.indexOf(',SYS309,') > 0) {
          this.uploadProp['disableYwViewDoc'] = false;
        }
        if (dakqx.indexOf(',SYS310,') > 0) {
          this.uploadProp['disableYwDown'] = false;
        }
        if (dakqx.indexOf(',SYS303,') > 0) {
          this.uploadProp['disableDown'] = false;
        }
        if (dakqx.indexOf(',SYS304,') > 0) {
          this.uploadProp['fjdyViewODC'] = false;
        }
        if (dakqx.indexOf(',SYS305,') > 0) {
          this.uploadProp['disableUpload'] = false;
          this.uploadProp['disableBigUpload'] = false;
        } else {
          this.uploadProp['disableUpload'] = true;
          this.uploadProp['disableBigUpload'] = true;
        }
        if (dakqx.indexOf(',SYS308,') > 0) {
          this.uploadProp['disableScanner'] = false;
        }
        if (dakqx.indexOf(',MEDIA001,') > 0) {
          this.uploadProp['disableMediaTwo'] = false;
        } else {
          this.uploadProp['disableMediaTwo'] = true;
        }

        if (dakqx.indexOf(',MEDIA002,') > 0) {
          this.uploadProp['disableMediaSpilit'] = false;
        } else {
          this.uploadProp['disableMediaSpilit'] = true;
        }

        if (dakqx.indexOf(',MEDIA003,') > 0) {
          this.uploadProp['disableMediaConcat'] = false;
        } else {
          this.uploadProp['disableMediaConcat'] = true;
        }

        if (dakqx === 'all') {
          this.eepjc = true;
          this.eepjc135 = true;
        } else {
          const b = dakqx.indexOf(',DAK0045,') >= 0;
          this.eepjc = b;
          const a = dakqx.indexOf(',DAK0135,') >= 0;
          this.eepjc135 = a;
        }
        this.uploadProp['disableConvertFiles'] = false;
      }
    },

    async initArchInfo(archParams: ArchParams, ktable) {
      if (!ktable.bmc) {
        return;
      }
      const { dakid, tmzt } = archParams;
      const kfields = await TableService.getKField({
        dakid,
        lx: tmzt,
        pg: 'list',
      });
      let dakOptAll = await dakoptService.findAll({
        tmzt,
        wzlk: archParams.wzlk ? archParams.wzlk : undefined,
        dakid: archParams.dakid,
        daklx: archParams.lx,
      });
      // ???????????????
      let dakopt =
        dakOptAll &&
        dakOptAll.filter(
          (item) =>
            item.isadd == 'N' &&
            item.optlx == '1' &&
            item.fid == '1' &&
            item.fz != 'DAKFZ001',
        );
      // dakopt = dakopt?.filter((item) => !item.fz!= && item.fid == '1');

      let dakyhOpt =
        dakOptAll &&
        dakOptAll.filter(
          (item) =>
            item.isadd == 'Y' &&
            item.optlx == '1' &&
            item.fid == '1' &&
            item.fz != 'DAKFZ001',
        );
      // ?????????????????????

      if (archParams.wzlk == 'Y') {
        dakopt['wzlk'] = 'Y';
        dakyhOpt['wzlk'] = 'Y';
      }
      // ?????????????????? DAKBTN001
      let dakTableOpt =
        dakOptAll &&
        dakOptAll.filter(
          (item) =>
            item.isadd == 'N' &&
            item.optlx == '1' &&
            item.fz == 'DAKBTN' &&
            item.fid == '1',
        );
      // dakopt = dakopt?.filter((item) => );
      console.log('dakTableOpt', dakTableOpt);

      // ??????
      const mbcx = await TableService.getSearchColumns({
        lx: tmzt,
        mbid: ktable.mbid,
        tmzt: this.tmzt,
        dakid: this.dakid,
      });
      const psql = await TableService.getSjqxSql({
        pcode: 'A',
        dakid: this.dakid,
        tmzt: this.tmzt,
        yhid: SysStore.getCurrentUser().id,
      });
      const dakqx = await dakoptService.findqx({
        tmzt: tmzt,
        yhid: dakoptService.yhid,
        dakid: archParams.dakid,
      });
      const doctype = await TableService.getDoctype();
      this.doctypelist = doctype;
      this.daqx = dakqx;
      //todo ???????????????????????? ???????????? ???????????????????????????????????????
      let dakCartCount = 0;
      if (tmzt == '8') {
        const res = await DakcartService.findDakcartsCount({
          tmzt,
          dakid: archParams.dakid,
          whr: SysStore.getCurrentUser().id,
        });
        debugger;
        if (res.success) {
          dakCartCount = res.results;
        }
      }
      runInAction(() => {
        this.psql = getParamSql(psql, ktable.bmc);
        // archParams.psql = psql;
        //  this.archParams = archParams;
        // this.daqx = dakqx;
        if (tmzt === '4' || tmzt === 4) {
          this.uploadtableProp['disableEdit'] = true;
          this.uploadtableProp['disableDelete'] = true;
        }
        if (tmzt === '12' || tmzt === 12) {
          if (archParams.umid === 'DALY025') {
            this.tableProp['disableEdit'] = false;
          }
        }

        archParams.psql = getParamSql(psql, ktable.bmc);
        console.log('psql', this.psql);
        this.ktable = ktable;
        this.kfields = kfields;
        this.dakopt = dakOptAll;
        this.advSearchColumns = mbcx || [];

        // ??????
        this.menuProp = this.getMenProps(dakopt);
        // ????????????
        this.menuButton = this.getMenuButton(dakyhOpt);

        // ??????????????????
        // ????????????
        this.menuTable = dakTableOpt; //this.getMenuTable(dakTableOpt);
        console.log('menuTable', this.menuTable);
        // ??????????????????
        this.initSysOpertion(archParams, archParams.bmc, dakqx);
        if (tmzt == '8') {
          this.dakCartCount = dakCartCount;
        }
        this.columns = kfields
          .filter((kfield) => kfield['lbkj'] == 'Y')
          .map((kfield) => ({
            width: kfield['mlkd'] * 1.2,
            code: kfield['mc'].toLowerCase(),
            title: kfield['ms'],
            ellipsis: true,
          }));
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (props.tableAutoLoad || props.tableAutoLoad === undefined) &&
          this.refresh(archParams);
      });
    },

    async menuLoad() {
      const archParams = this.archParams;
      const ktable = this.ktable;

      const { dakid, tmzt } = archParams;
      if (tmzt && tmzt > 0) {
        const dakopt = await dakoptService.findAll({
          tmzt,
          isadd: 'N',
          optlx: '1',
          dakid: archParams.dakid,
          daklx: archParams.lx,
          fid: '1',
        });

        const dakyhOpt = await dakoptService.findAll({
          isadd: 'Y',
          daklx: archParams.lx,
          optlx: '1',
          wzlk: archParams.wzlk ? archParams.wzlk : undefined,
          dakid: archParams.dakid,
          tmzt: archParams.tmzt,
          fid: '1',
        });
        if (archParams.wzlk === 'Y') {
          dakopt['wzlk'] = 'Y';
          dakyhOpt['wzlk'] = 'Y';
        }

        runInAction(() => {
          //   // this.archParams = archParams;
          //   // this.ktable = ktable;

          if (Array.isArray(dakopt) && dakopt.length > 0) {
            const opt = dakopt.filter((item) => item.fz !== 'DAKFZ001');
            archStore.menuProp = opt.map((item) => {
              return {
                title: item.name,
                icon: 'icon_import_white',
                onClick: (ids, store, records) => {
                  this.doArchAction(item, ids, store, records, ktable);
                },
                params: {
                  tmzt: archStore.tmzt,
                  daklx: archStore.ktable.daklx,
                  optcode: item.optcode,
                  dakid: archStore.dakid,
                  fid: 1,
                },
                color: '#CFA32A',
                toolbarShow: false,
              };
            });
          }
          if (Array.isArray(dakyhOpt)) {
            const yhOpt = dakyhOpt.filter((item) => item.fz !== 'DAKFZ001');

            archStore.menuButton = yhOpt.map((item) => {
              const params = {
                optcode: item.optcode,
                daklx: item.daklx,
                dakid: this.dakid,
                optlx: '1',
                isadd: item.isadd,
                fid: item.fid,
                tmzt: item.tmzt,
                wzlk: archParams.wzlk ? archParams.wzlk : undefined,
              };
              if (archParams.wzlk === 'Y') {
                params['wzlk'] = 'Y';
              }
              return {
                title: item.name,
                params,
                onClick: (ids, store, records) => {
                  this.doArchAction(item, ids, store, records, ktable);
                },
              };
            });
          }
        });
      }
    },
    setModalVisit(visit: boolean) {
      this.modalVisit = visit;
    },
    async getfjGuid() {
      const guid = await TableService.getGuid();
      this.uploadProp['grpid'] = guid.message; //????????????
      this.fjgrid = guid.message;
    },
    setFjGuid(val) {
      this.fjgrid = val;
    },

    doArchAction: async (
      opt: OptType,
      ids: any,
      store: any,
      records: any,
      ktable: KtableType,
    ) => {
      //  ArchAction[item.optcode](item,ids,store,records);
      //  const ids=records?.map(=>record.id)
      //       archModalInfo=archStore[opt.optcode](opt.optcode,props.params,ids);
      //  alert(opt.optcode)
      //this.selectRecords = records;

      if (opt && opt.optcode) {
        if (!archStore[opt.optcode]) {
          message.warning({
            type: 'warning',
            content: '?????????????????????????????????????????????',
          });
          return;
        }
        if (opt.optcode == 'AFFIX02') {
          debugger;
          archStore.AFFIX02(opt, ids, store, records, ktable);
          return;
        }
        const archModalInfo = await archStore[opt.optcode](
          opt.optcode,
          archStore.archParams,
          { ...archStore, ktable: ktable, selectRecords: records },
          ids,
          ktable,
        );
        window._paramCache = archModalInfo?.params;
        runInAction(() => {
          archStore.optcode = '';
          archStore.modalHeight = archModalInfo.height;
          archStore.modalWidth = archModalInfo.width;
          archStore.selectRecords = records;
          archStore.ids = ids;
          if (archModalInfo.showFoot == true) {
            archStore.showFoot = true;
          } else {
            archStore.showFoot = false;
          }
          // ??????ifame
          if (archModalInfo.useIframe == false) {
            archStore.useIframe = false;
          } else {
            archStore.useIframe = true;
          }
          // ??????drawer
          if (archModalInfo.isDrawer) {
            archStore.isDrawer = true;
          } else {
            archStore.isDrawer = false;
          }
          // ??????????????????
          if (archModalInfo.extendParams) {
            archStore.extendParams = archModalInfo.extendParams;
          }
          // header extra??????
          if (archModalInfo.extra) {
            archStore.extra = archModalInfo.extra;
          }
          archStore.modalTitle = archModalInfo.title;
          archStore.modalVisit = !archModalInfo.disableModal;
          debugger;
          if (archModalInfo.drawerVisit == true) {
            archStore.drawerVisit = archModalInfo.drawerVisit;
          }

          archStore.optcode = opt.optcode || '';
          archStore.menuActionItem = opt;
          archStore.modalUrl = archModalInfo.url;
          archStore.archModalInfo = archModalInfo;
          // ??????????????????
          if (archModalInfo.modalType) {
            archStore.modalType = archModalInfo.modalType;
            archStore.detailVisible = archModalInfo.detailVisible;
            archStore.editRecord = archModalInfo.record;
          }
        });
      }
    },

    refresh: (archParams) => {
      let storeTable = ref.current?.getTableStore();
      if (storeTable && storeTable.findByKey) {
        ref.current?.clearTableRowClick();
        storeTable.findByKey('', 1, storeTable.size, { ...archParams });
      }
    },

    /**
     * ????????????demo
     * @param optcode ?????????????????????DAK0005f
     * @param params ????????????
     * @param store ?????????store
     * @param ids ??????id??????
     * @returns
     *
     */
    //????????????
    async DAK0005(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      let filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        mbid: archStore.ktable?.mbid,
        dakid: params.dakid,
        lx: params.lx,
        ids: ids.join(','),
      };
      const res = await dakoptService.genDh(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '??????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },
    /**
     * ?????????demo
     * @param optcode ?????????????????????DAK0005f
     * @param params ????????????
     * @param store ?????????store
     * @param ids ??????id??????
     * @returns
     *
     */
    //????????????
    async DAK0011(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      return {
        useIframe: false,
        width: 1024,
        height: 640,
        showFoot: true,
        url: '/sys/params/systemConf',
        title: '????????????',
      };
    },

    //??????
    async DAK0041(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '??????????????????!' });
        return { disableModal: true };
      } else if (ids.length != 1) {
        message.warning({ type: 'warning', content: '????????????????????????!' });
        return { disableModal: true };
      }
      let record = archStore.selectRecords;
      record[0].chajianid = archStore.selectRecords[0].id;
      //??? id ??????
      delete record[0].id;
      return {
        disableModal: true,
        modalType: 'add',
        detailVisible: true,
        editRecord: record[0],
      };
    },

    //???????????????
    async DAK0087(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1400,
          height: 550,
          showFoot: true,
          url: '/sys/dagl/addXcd',
          title: '???????????????',
        };
      }
    },
    //?????????????????????
    async DAK0085(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1400,
          height: 550,
          showFoot: true,
          url: '/sys/dagl/addStjyd',
          title: '?????????????????????',
        };
      }
    },

    //??????????????????
    async DAK0088(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      } else if (ids.length > 1) {
        message.warning({ type: 'warning', content: '????????????????????????' });
        return { disableModal: true };
      }
      const dakGrid = {
        dakid: params.dakid,
        tmid: ids[0],
        yhid: dakoptService.yhid,
      };

      const res = await dakoptService.addLydt(dakGrid);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '????????????????????????!' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };

      // return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/addLydjd", title: "?????????????????????" };
    },

    // ?????????
    async DAK0025(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      return {
        useIframe: false,
        width: 1400,
        height: 550,
        showFoot: false,
        url: '/sys/dagl/RecycleBin',
        title: '?????????',
      };
    },

    // ????????????
    async DAK0049(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1400,
          height: 550,
          showFoot: false,
          url: '/sys/dagl/Dazl',
          title: '????????????',
        };
      }
    },
    // ???????????????
    async DAK0134(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '?????????????????????' })
      //   return { disableModal: true };
      // } else {
      //   return { useIframe: false, width: "100%", height: "100%", showFoot: false, url: "/sys/dagl/Jgyj", title: "????????????" }
      // }

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        var dk = 0;
        for (var i = 0; i < archStore.selectRecords.length; i++) {
          var yjjgbz = archStore.selectRecords[i].yjjgbz;
          if (yjjgbz === undefined) {
            dk = 1;
          } else if (yjjgbz === 0) {
            dk = 1;
          } else {
            dk = 0;
            message.warning({
              type: 'warning',
              content: '?????????????????????????????????,??????????????????!',
            });
            return { disableModal: true };
          }
        }
        if (dk === 1) {
          return {
            useIframe: false,
            width: '650px',
            height: '580px',
            showFoot: false,
            url: '/eps/business/Approve/SelectJgyjDailog',
            title: '????????????',
            extendParams: {
              ids: ids.join(','),
              spUrl: 'gsyjsqd',
              spName: '????????????',
              spCode: 'gsyj',
            },
          };
        } else {
          message.warning({
            type: 'warning',
            content: '?????????????????????????????????,??????????????????!',
          });
          return { disableModal: true };
        }
      }
    },

    // demo
    /**
       *

       * @param optcode ?????????????????????DAK0010
       * @param params ????????????
       * @param store ?????????store
       * @ids ???????????????id??????
       * @returns
       *    dakid: dakGrid.dakid,
         *  tmzt: dakGrid.tmzt,
          * toolbarId: "toolbar",
          * mbid: dakGrid.mbid,
         *  lx: dakGrid.daklx,
           * ly: dakGrid.tmzt,
           * daklx: me.daklx,
          *  bmc: dakGrid.bmc,
          * dakGrid: dakGrid,
          * pldrjc: me.canPldrjc,
          * fid: dafid
       *
       */
    DAK0010: (
      optcode: string,
      params: ArchParams,
      store: ArchStoreType,
      ids: string[],
    ) => {
      // ???????????????dakgrid????????????
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '?????????????????????' })
      //   return { disableModal: true };
      // }
      //alert("111mbid"+store.ktable.mbid)
      const dakGrid = {
        sfdyw: archStore.ktable?.sfdyw,
        stflid: archStore.ktable?.dywstfl,
      };
      // archStore.refresh(params)
      const filter = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        lx: params.lx,
        ly: params.tmzt,
        daklx: archStore.ktable?.daklx,
        bmc: params.bmc,
        dakGrid,
        toolbarId: 'toolbar',
        pldrjc: true,
        // fid: dafid
      };
      return {
        url: `/api/eps/control/main/dagl/pldr?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 1280,
        height: 680,
      };
    },

    //??????AIP??????
    async DAK0016(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      var con = {};
      con['ids'] = ids.toString();
      let par = {
        pcode: 'EEPNEW',
      };
      var filter = {};
      await dakoptService.queryParamsValueById(par).then((res) => {
        if (res.value == 'Y') {
          filter = {
            typelx: 1,
            yhid: dakoptService.yhid,
            yhbh: dakoptService.yhbh,
            yhmc: dakoptService.yhmc,
            cjdw: dakoptService.dwid,
            con: con,
            dakid: params.dakid,
            tmzt: params.tmzt,
            mbid: archStore.ktable?.mbid,
            bmc: params.bmc,
            sjid: ids[0].toString(),
          };
        } else {
          filter = {
            yhid: dakoptService.yhid,
            yhbh: dakoptService.yhbh,
            yhmc: dakoptService.yhmc,
            cjdw: dakoptService.dwid,
            con: con,
            dakid: params.dakid,
            tmzt: params.tmzt,
            mbid: archStore.ktable?.mbid,
            bmc: params.bmc,
            sjid: ids[0].toString(),
          };
        }
      });

      const res = await dakoptService.addEepinfo(filter);
      if (res.success) {
        message.success({
          type: 'success',
          content: '?????????????????????EEP??????????????????????????????????????????',
        });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //??????AIP??????
    async DAK0133(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      var con = {};
      con['ids'] = ids.toString();
      let newpar = { pcode: 'EEPNEW' };
      const eepnres = await dakoptService.queryParamsValueById(newpar);
      if (eepnres.value == 'Y') {
        window.open(
          '/api/eps/control/main/eepgl/xSsExport?dakid=' +
            params.dakid +
            '&yhmc= ' +
            dakoptService.yhmc +
            '&dwmc=' +
            SysStore.getCurrentCmp().mc +
            '&ids=' +
            ids +
            '&mbid=' +
            archStore.ktable?.mbid +
            '&xxtmc=' +
            util.getLStorage('sysname'),
        );
      } else {
        var filter = {
          yhid: dakoptService.yhid,
          yhbh: dakoptService.yhbh,
          yhmc: dakoptService.yhmc,
          cjdw: dakoptService.dwid,
          con: con,
          dakid: params.dakid,
          tmzt: params.tmzt,
          mbid: archStore.ktable?.mbid,
          bmc: params.bmc,
          sjid: ids[0].toString(),
        };
        const res = await dakoptService.addEepinfo(filter);
        message.info('?????????????????????,?????????...');
        if (res.success) {
          var par = {
            id: res.results.id,
          };
          const rr = await dakoptService.SsExportAIP(par);
          if (rr.success) {
            window.open(
              '/api/eps/control/main/eepgl/downloadPakage?ftpid=' +
                rr.results.ftpid +
                '&id=' +
                rr.results.id,
            );
            message.success('????????????!');
          } else {
            message.error('???????????????', rr.message);
          }
        } else {
          message.error('???????????????', rr.message);
        }
      }

      return { disableModal: true };
    },

    // SIP??????
    DAK0023: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      //   const dakqx=archStore.daqx;
      //   const opt='DAK0045';
      //   debugger;
      //   let eep = false;

      //   if (dakqx == "all") {
      //     eep = true;
      // } else {
      //     var b = ("," + dakqx + ",").indexOf("," + opt + ",") >= 0;
      //     eep = b;
      // }
      //   let filter = {
      //     dakid: params.dakid,
      //     tmzt: params.tmzt,
      //     yhid: dakoptService.yhid,
      //     yhbh: dakoptService.yhbh,
      //     yhmc: dakoptService.yhmc,
      //     cjdw: dakoptService.dwid,
      //     eepjc: eep

      //   }
      return {
        useIframe: false,
        width: 600,
        height: 100,
        showFoot: false,
        url: '/sys/dagl/importSIP',
        title: 'SIP??????',
      };

      // console.log("filter,filter",filter)
      // return { url: `/api/eps/control/main/dagl/importSIP?${qs.stringify(filter)}`, params: filter, title: "SIP??????", filter, width: 800, height: 100 };
    },

    //  ??????EEP
    DAK0045: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      // let filter = {
      //   dakid: params.dakid,
      //   tmzt: params.tmzt,
      //   yhid: dakoptService.yhid,
      //   yhbh: dakoptService.yhbh,
      //   yhmc: dakoptService.yhmc,
      //   cjdw: dakoptService.dwid,
      //   //daklx: archStore.ktable?.daklx,
      //   eepjc: archStore.checkPermission()

      // }
      // return { url: `/api/eps/control/main/dagl/importSIP?${qs.stringify(filter)}`, params: filter, title: "??????EEP?????????", filter, width: 800, height: 100 };
      return {
        useIframe: false,
        width: 600,
        height: 100,
        showFoot: false,
        url: '/sys/dagl/importSIP',
        title: '??????EEP',
      };
    },

    //??????EEP
    DAK0135: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      let filter = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        yhid: dakoptService.yhid,
        yhbh: dakoptService.yhbh,
        yhmc: dakoptService.yhmc,
        cjdw: dakoptService.dwid,
        daklx: archStore.ktable?.daklx,
        eepjc: archStore.checkPermission(),
      };
      debugger
      return {
          useIframe: false,
          width: '450px',
          height: '380px',
          showFoot: false,
          url: '/eps/dagl/Dagl/EepLxdr',
          title: '????????????EEP',
          extendParams: filter,
      };

      // setEepvisible(true);
      // setEepparams(filter);
      // return { disableModal: true };
      //  return { url: `/api/eps/control/main/gszxyjcx/importEEP?${qs.stringify(filter)}`, params: filter, title: "??????EEP", filter, width: 800, height: 100 };
      // return { useIframe: false, width: 600, height: 100, showFoot: false, url: "/sys/dagl/importEEP", title: "??????EEP?????????" };
    },

    DAK0052: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
    ) => {
      // ???????????????dakgrid????????????
      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
      };
      const filter = {
        dakGrid,
      };
      return {
        url: `/api/eps/control/main/dagl/zdyfz?${qs.stringify(filter)}`,
        params: filter,
        title: '?????????????????????',
        filter,
        width: 900,
        height: 535,
      };
    },
    DAK0009: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      // ???????????????dakgrid????????????

      const dakGrid = {
        sfdyw: false,
        zdlx: 'C',
        stflid: '',
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
      };
      const filter = {
        dakGrid,
        tmzt: params.tmzt,
        toolbarId: 'toolbar',
        ids: ids.toString(),
        mbid: archStore.ktable?.mbid,
        bmc: params.bmc,
      };
      return {
        url: `/api/eps/control/main/dagl/plxg?${qs.stringify(filter)}`,
        showFoot: false,
        params: filter,
        title: '????????????',
        filter,
        width: 600,
        height: 400,
      };
    },

    // 0080 ????????????????????????  ??????????????? ??????

    // ????????????
    DAK0014: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      // ???????????????dakgrid????????????

      // dakid: "DAK201907261356280060"
      // daklx: "02"
      // dayh: "YH201904132026100005"
      // dwid: "DW201408191440170001"
      // sfdyw: false
      // stflid: ""
      // tmzt: 1
      // wzlk: undefined
      // zdyfzparams: ""

      const dakGrid = {
        stflid: '',
        sfdyw: false,
        zdyfzparams: '',
        lx: params.lx,
        ktable: archStore.ktable,

        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        grid: archStore.selectRecords,
        ids: ids.toString(),
        dayh: dakoptService.yhid,
        dwid: dakoptService.dwid,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
        editFormId: 'editForm',
      };

      return {
        url: `/api/eps/control/main/dagl/dakhj?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 700,
        height: 500,
      };
    },

    //??????
    async DAK0015(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const dakGrid = {
        bmc: params.bmc,
        fids: ids.toString(),
      };
      const res = await dakoptService.chaiJuan(dakGrid);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //????????????
    async DAK0020(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const dakGrid = {
        mbid: archStore.ktable?.mbid,
        dakid: params.dakid,
        daklx: archStore.ktable?.daklx,
        ids: ids.toString(),
        tmzt: params.tmzt,
        kind: 'choose',
      };
      const res = await dakoptService.formulaCalculate(dakGrid);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '????????????' });
      } else {
        refreshPage();
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    DAK0021: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        bmc: params.bmc,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakDakcc?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 1200,
        height: 550,
      };
    },
    DAK0022: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakDhDhcx?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 1300,
        height: 550,
      };
    },

    //????????????
    async DAK0058(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) {
      const filter = {
        bmc: params.bmc,
        dwid: dakoptService.dwid,
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        dayh: dakoptService.yhid,
        hszbz: 'N',
        tmid: 'dakGrid',
        pageSize: 1000,
        //psql: "$S$KCgxPTEpKQ==",
        pageIndex: 0,
        page: 0,
        limit: 1000,
        pxfs: 'Z',
      };
      archStore.refresh(filter);
      refreshPage();
      message.success({ type: 'success', content: '????????????' });
      return { disableModal: true };
    },

    //????????????
    async DAK0059(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      let filter = {
        mbid: archStore.ktable?.mbid,
        bmc: params.bmc,
        lx: 'G',
        tmzt: params.tmzt,
        fid: '',
        mblx: archStore.ktable?.daklx,
        yhid: dakoptService.yhid,
      };
      // const res = await dakoptService.doRefreshLsh(filter);
      // if (res.success) {
      //
      //   message.error("????????????????????????\r\n" + res.message);
      // }

      archStore.refresh(filter);
      refreshPage();
      message.success({ type: 'success', content: '????????????' });
      // } else {
      return { disableModal: true };
    },
    //??????????????????
    async DAK0060(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      let filter = {
        mbid: archStore.ktable?.mbid,
        bmc: params.bmc,
        lx: 'Z',
        tmzt: params.tmzt,
        fid: '',
        mblx: archStore.ktable?.daklx,
        yhid: dakoptService.yhid,
      };

      // const res = await dakoptService.doRefreshLsh(filter);

      // if (res.success) {
      //   message.success({ type: 'success', content: '????????????' });
      // } else {
      //   message.error("????????????????????????\r\n" + res.message);
      // }
      await archStore.refresh(filter);
      refreshPage();
      message.success({ type: 'success', content: '????????????' });
      return { disableModal: true };
    },

    //??????????????????
    DAK0063: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const dakGrid = {
        mbid: archStore.ktable?.mbid,
        bmc: params.bmc,
      };
      const filter = {
        dakGrid: dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakzhpx?${qs.stringify(filter)}`,
        params: filter,
        title: '??????????????????',
        filter,
        width: 900,
        height: 534,
      };
    },

    //????????????
    async DAK0067(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const dakGrid = {
        bmc: params.bmc,
        ids: ids.toString(),
        mbid: archStore.ktable?.mbid,
        dakid: params.dakid,
        tmzt: params.tmzt,
        yhid: dakoptService.yhid,
        dwid: dakoptService.dwid,
        dwmc: dakoptService.dwid,
        dwqzh: dakoptService.dwid,
        yhbh: dakoptService.yhid,
        dwbh: dakoptService.dwid,
        yhmc: dakoptService.yhmc,
      };
      const res = await dakoptService.doPlzj(dakGrid);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ??????????????????
    DAK0068: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const dakGrid = {
        mbid: archStore.ktable?.mbid,
        dakid: params.dakid,
        bmc: params.bmc,
      };
      const filter = {
        dakGrid: dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakplzj?${qs.stringify(filter)}`,
        params: filter,
        title: '??????????????????',
        filter,
        width: 900,
        height: 532,
      };
    },
    // ??????
    DAK0053: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      const dakinfo = {
        mbid: archStore.ktable?.mbid,
        dakid: params.dakid,
        bmc: params.bmc,
        dwid: dakoptService.dwid,
      };
      const keyvalues = {
        dakinfo,
        tmids: ids.toString(),
        zh: true,
      };

      const filter = {
        dakinfo,
        tmids: ids.toString(),
        zh: true,
      };
      return {
        url: `/api/eps/control/main/hgl/hgl_da?${qs.stringify(filter)}`,
        params: filter,
        title: '??????',
        filter,
        width: 985,
        height: 550,
      };
    },
    // ????????????
    async DAK0054(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmids: ids.join(','),
        dwid: dakoptService.dwid,
        mbid: archStore.ktable?.mbid,
      };

      const res = await dakoptService.doQxzhAction(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '????????????' });
      } else {
        refreshPage();
        message.warning('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ?????????
    DAK0150: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const filter = {
        path: 'hgl_dak',
        dakid: params.dakid,
        mbid: archStore.ktable?.mbid,
        bmc: params.bmc,
        tmzt: params.tmzt,
      };

      const title = params.mc + '???????????????';
      return {
        url: `/api/eps/control/main/hgl/openDak?${qs.stringify(filter)}`,
        params: filter,
        title,
        filter,
        width: 1200,
        height: 700,
      };
    },

    // ????????????
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
        dwid: dakoptService.dwid,
      };
      tmids['tmids'] = ids.join(',');
      var iddt = await fetch.post(
        '/api/eps/control/main/dagl/saveChecked?dakid=' +
          params.dakid +
          '&bmc=' +
          params.bmc +
          '&dwid=' +
          dakoptService.dwid,
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
      localStorage.setItem('mbid', params.mbid);
      localStorage.setItem('ip', window.location.host);
      localStorage.setItem('yhmc', dakoptService.yhmc);
      var defaultv = await fetch.post(
        '/api/eps/control/main/params/getUserOption?code=DAGLF012&yhid=' +
          dakoptService.yhid,
      );
      if (defaultv.data.message === 'N') {
        return {
          url: `/api/eps/xplgj/plgjgjE9?`,
          title: '????????????',
          width: 1450,
          height: 565,
        };
      } else {
        return {
          url: `/api/eps/xplgjgch/plgjgchE9?`,
          title: '????????????',
          width: 1450,
          height: 565,
        };
      }
    },

    // ???????????????
    DAK0011: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
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
      tmids['tmzt'] = params.tmzt;
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
          params.tmzt +
          '&' +
          dakoptService.yhid +
          '&' +
          dakoptService.yhmc +
          '&' +
          '';
        const system = dakoptService.getCurrentOS();
        if (system === 'Windows') {
          window.location.href = url + epsurl;
        } else if (system === 'Linux') {
          window.location.href = Linuxurl + epsurl;
        }
      }
      return { disableModal: true };
    },

    DAK0055: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      const grid = {
        pageSize: 10000000,
        pageIndex: 1,
      };

      const dakGrid = {
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        dakid: params.dakid,
        bmc: params.bmc,
        stflid: '',
        grid,
        ids: archStore.selectRecords,
      };

      const formData = new FormData();
      // formData.append('dw', SysStore.getCurrentUser().dwid);
      // formData.append('yhid', SysStore.getCurrentUser().id);
      // formData.append('yhbh', SysStore.getCurrentUser().bh);
      // formData.append('yhmc', SysStore.getCurrentUser().yhmc);
      //  formData.append('tmzt', params.tmzt);
      // formData.append('dakid', params.dakid);
      //  formData.append('bmc', params.bmc);
      //  formData.append('dcfw', "B");
      // formData.append('pldclx', "B");
      // formData.append('dcyw', "N");
      // formData.append('dcywlx', "");
      // formData.append('ywcm', null);
      //
      formData.append('toolbarId', 'toolbar');
      formData.append('dakGrid', dakGrid);

      // ??????????????????

      const filter = {
        dakGrid: dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/pldcgl?${qs.stringify(formData)}`,
        params: filter,
        title: '??????????????????',
        filter,
        width: 600,
        height: 465,
      };
    },

    // ??????????????????
    DAK0051: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      var dakid = params.dakid;
      var grptbl = params.bmc + '_FJFZ';
      var doctbl = params.bmc + '_FJ';
      var atdw = dakoptService.dwid;
      var filegrpids = '';
      for (var i = 0; i < archStore.selectRecords.length; i++) {
        filegrpids += ',' + archStore.selectRecords[i].filegrpid;
      }
      filegrpids = filegrpids.substring(1);
      window.open(
        '/api/eps/control/main/dagl/downloadZip?downlx=02&dakid' +
          dakid +
          '&grptbl=' +
          grptbl +
          '&doctbl=' +
          doctbl +
          '&atdw=' +
          atdw +
          '&filegrpids=' +
          filegrpids,
      );
      message.success('?????????????????????...');
      return { disableModal: true };
    },

    //??????????????????
    DAK0056: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      window.open(
        '/api/eps/control/main/pldcgl/batchExportExcel1?page=1&start=0&limit=100&tmzt=' +
          params.tmzt +
          '&mbid=' +
          archStore.ktable?.mbid +
          '&dakid=' +
          params.dakid +
          '&bmc=' +
          params.bmc +
          '&stflid=&whrid=' +
          dakoptService.yhid +
          '&whr=' +
          dakoptService.yhmc +
          '&whrbh=' +
          dakoptService.yhbh +
          '&ids=' +
          ids.toString(),
      );
      message.success('?????????????????????...');
      return { disableModal: true };
    },

    // RFID??????
    async DAK0126(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const res = await dakoptService.doSXRFID(archStore.ktable?.mbid);

      if (res) {
      } else {
        message.warning({
          type: 'warning',
          content: '????????????????????????RFID????????????????????????RFID????????????????????????',
        });
        return { disableModal: true };
      }

      const dakGrid = {
        tmzt: params.tmzt,
        dakid: params.dakid,
        bmc: params.bmc,

        ids: archStore.selectRecords,
      };

      const formData = new FormData();
      formData.append('dakGrid', dakGrid);
      formData.append('toolbarId', 'toolbar');
      formData.append('grid', {});

      const filter = {
        dakGrid: dakGrid,
        toolbarId: 'toolbar',
        tmzt: params.tmzt,
        dakid: params.dakid,
        ids: archStore.selectRecords,
      };
      return {
        url: `/api/eps/control/main/dagl/dakSetRfid?${filter}`,
        params: filter,
        title: 'RFID??????',
        filter,
        width: 1000,
        height: 465,
      };
    },

    // RFID??????
    async DAK0127(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????

      const res = await dakoptService.doSXRFID(archStore.ktable?.mbid);
      if (res) {
      } else {
        message.warning({
          type: 'warning',
          content: '????????????????????????RFID????????????????????????RFID????????????????????????',
        });
        return { disableModal: true };
      }
      const ress = await dakoptService.dorfidsb();

      if (ress.success) {
        const rfid = ress.results;
        refreshPage;
        //    dakGrid.reload({rfid: rfid});
      } else {
        message.error('' + ress.message + '');
      }
      return { disableModal: true };
    },

    //  ??????????????????
    async DAK0030(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        const res = await dakoptService.doguidan(archStore.ktable?.mbid);

        if (res) {
          return {
            useIframe: false,
            width: 1400,
            height: 680,
            showFoot: false,
            url: '/sys/dagl/ResetDagsbm',
            title: '??????????????????',
          };
        } else {
          message.warning({ type: 'warning', content: '???????????????????????????' });
          refreshPage();
          return { disableModal: true };
        }
      }
      let storeTable = ref.current?.getTableStore();
      storeTable.findByKey('', 1, storeTable.size, {
        fid: props.fid,
        ...props.archParams,
      });

      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "??????????????????" };
    },

    // DAK0030: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {

    //   // ???????????????dakgrid????????????
    //   if (ids.length <= 0) {
    //     message.warning({ type: 'warning', content: '?????????????????????' })
    //     return { disableModal: true };
    //   }
    //   httpRequest.get({
    //     url: `/api/eps/control/main/mbzlx/queryByKey?mbid=${archStore.ktable?.mbid}&sxid=SX100`
    //   }).then(res => {
    //     if (!res.data) {
    //       message.warning({ type: 'warning', content: '???????????????????????????' })
    //       return { disableModal: true };
    //     }
    //   }).catch(err => {

    //   });
    //   const dakGrid = {
    //     tmzt: params.tmzt,
    //     mbid: archStore.ktable?.mbid,
    //     dakid: params.dakid,
    //     bmc: params.bmc,
    //     daklx: archStore.ktable?.daklx,
    //     ids: archStore.selectRecords,

    //   }

    //   const formData = new FormData();
    //   formData.append('dakGrid', dakGrid);
    //   formData.append('toolbarId', "toolbar");
    //   formData.append('grid', {});

    //   const filter = {
    //     dakGrid: dakGrid,
    //     toolbarId: "toolbar",
    //     grid: {}
    //   }
    //   return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(formData)}`, params: filter, title: "??????????????????", filter, width: 520, height: 465 };

    // },

    //??????????????????
    DAK0032: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //???????????? plsql ?????????????????????
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "??????????????????", filter, width: 520, height: 465 };
    },

    //????????????
    DAK0033: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //???????????? plsql ?????????????????????
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "??????????????????", filter, width: 520, height: 465 };
    },
    //????????????
    DAK0034: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //???????????? plsql ?????????????????????
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "??????????????????", filter, width: 520, height: 465 };
    },

    //????????????
    DAK0036: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //???????????? plsql ?????????????????????
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "??????????????????", filter, width: 520, height: 465 };
    },

    //???????????????
    async DAK0038(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        opt: 1,
      };
      const res = await dakoptService.yszyc(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '?????????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //???????????????
    async DAK0039(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        opt: 2,
      };
      const res = await dakoptService.yszyc(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '?????????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //????????????
    DAK0008: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //???????????? plsql ?????????????????????
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "??????????????????", filter, width: 520, height: 465 };
    },

    //??????
    DAK0001: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      //????????????????????????
      const filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        dakid: params.dakid,
        ids: ids.toString(),
        tmzt: params.tmzt,
        needWorkflow: 'N',
        mbid: archStore.ktable?.mbid,
      };

      const res = await dakoptService.submitTmzt(filter);
      if (res != null) {
        message.success({ type: 'success', content: '????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //????????????
    DAK0002: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      //????????????????????????
      const filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        dakid: params.dakid,
        ids: ids.toString(),
        tmzt: params.tmzt,
        needWorkflow: 'N',
        mbid: archStore.ktable?.mbid,
      };

      const res = await dakoptService.submitTmzt(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'warning', content: '??????????????????' });
      } else {
        refreshPage();
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },
    //????????????
    DAK0003: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        ids: ids.toString(),
        tmzt: params.tmzt,
      };

      const res = await dakoptService.returnTmzt(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'warning', content: '??????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //????????????
    DAK0004: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        ids: ids.toString(),
        tmzt: params.tmzt,
      };

      const res = await dakoptService.returnTmzt(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'warning', content: '??????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }

      return { disableModal: true };
    },

    //???????????????
    async DAK0113(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) {
      const filter = {
        ckwyw: 'Y',
        bmc: params.bmc,
        dwid: dakoptService.dwid,
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        dayh: dakoptService.yhid,
        hszbz: 'N',
        tmid: 'dakGrid',
        pageSize: 1000,
        // psql: "$S$KCgxPTEpKQ==",
        pageIndex: 0,
        page: 0,
        limit: 1000,
        wfjsql:
          'not exists(select * from ' +
          params.bmc +
          '_FJFZ where ' +
          params.bmc +
          '_FILEGRPID=' +
          params.bmc +
          '_FJFZ_FILEGRPID)',
      };
      archStore.refresh(filter);
      message.success({ type: 'success', content: '????????????' });
      return { disableModal: true };
    },
    //????????????
    DAK0040: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      var tmztlx = params.tmzt == 1 ? '1' : params.tmzt === 2 ? '2' : '3';
      var sxjcly = params.tmzt == 1 ? '02' : params.tmzt === 2 ? '03' : '05';
      const filter = {
        dakid: params.dakid,
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        tmzt: tmztlx,
        mbid: archStore.ktable?.mbid,
        dakmc: archStore.ktable?.mc,
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
        ids: ids.toString(),
        lx: tmztlx,
        ly: sxjcly,
        sxjcly: sxjcly,
        dwmc: SysStore.getCurrentUser().dwmc,
        cont: archStore.selectRecords.length,
        code: archStore.ktable?.mbid,
        sxjchj: sxjcly,
      };

      localStorage.setItem('jcdata', JSON.stringify(filter));

      /**
       *
       * ????????????????????????miniui??????
       */
      return {
        url: `/api/eps/api/xsxjc/jcindexE9?`,
        title: '????????????',
        width: 1450,
        height: 565,
      };
    },

    //????????????(??????????????????????????????????????? bug,?????????????????????)
    DAK0048: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      const dakGrid = {
        tmzt: params.tmzt,
        dakid: params.dakid,
        hszbz: 'N',
        bmc: params.bmc,
        ids: ids.toString(),
        grid: archStore.selectRecords,
        daklx: archStore.ktable?.daklx,
        dayh: dakoptService.yhid,
        mbid: archStore.ktable?.mbid,
      };
      const filter = {
        dakGrid: dakGrid,
        ydak: dakGrid.dakid,
        tmzt: dakGrid.tmzt,
        ydakbmc: dakGrid.bmc,
        lx: dakGrid.tmzt,
        ydaid: ids[0].toString(),
      };
      return {
        url: `/api/eps/control/main/dagl/cjcakck?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 800,
        height: 400,
      };
    },

    // //????????????(?????????,???????????????)
    // DAK0049: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
    //   // ???????????????dakgrid????????????
    //   if (ids.length <= 0) {
    //     message.warning({ type: 'warning', content: '?????????????????????' })
    //     return { disableModal: true };
    //   }
    //   const dakGrid = {
    //     tmzt: params.tmzt,
    //     dakid: params.dakid,
    //     hszbz: "N",
    //     bmc: params.bmc,
    //     ids: ids.toString(),
    //     grid: archStore.selectRecords,
    //     daklx: archStore.ktable?.daklx,
    //     dayh: dakoptService.yhid,
    //     mbid: archStore.ktable?.mbid
    //   }
    //   const filter = {
    //     dakGrid: dakGrid,
    //     toolbarId: "toolbar"

    //   }
    //   return { url: `/api/eps/control/main/dagl/dakZl?${qs.stringify(filter)}`, params: filter, title: "????????????", filter, width: 800, height: 400 };

    // },

    DAK0006: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
      let filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        mbid: archStore.ktable?.mbid,
        ids: ids.join(','),
      };

      const res = await dakoptService.clearDh(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'warning', content: '??????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }

      return { disableModal: true };
    },

    //?????????????????????     (???????????????,??????????????????)
    DAK0111: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      var sr = archStore.selectRecords;
      for (var i = 0; i < sr.length; i++) {
        if (sr[i].ffbmc == null || sr[i].ffbmc == '') {
          message.warning({
            type: 'warning',
            content: '?????????????????????????????????????????????',
          });
          return { disableModal: true };
        }
      }
      const dakGrid = {
        tmzt: params.tmzt,
        dakid: params.dakid,
        hszbz: 'N',
        bmc: params.bmc,
        ids: ids.toString(),
      };
      const filter = {
        bmc: params.bmc,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        dakmc: '',
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
        ids: ids.toString(),
      };
      return {
        url: `/api/eps/control/main/dagl/dakZl?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 800,
        height: 400,
      };
    },

    //??????????????????
    DAK0130: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      var lcfzzt1 = archStore.selectRecords[0].lcfzzt;
      for (var i = 1; i < archStore.selectRecords.length; i++) {
        if (lcfzzt1 != archStore.selectRecords[i].lcfzzt) {
          message.warning({
            type: 'warning',
            content: '?????????????????????????????????????????????????????????????????????!',
          });
          return { disableModal: true };
        }
      }
      let filter = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        ids: ids.toString(),
        lcfzzt: lcfzzt1,
      };
      const res = await dakoptService.returnLcfzzt(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'warning', content: '????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //???????????? (?????????????????????,????????????)
    DAK0131: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      var idss = [];
      var sr = archStore.selectRecords;
      for (var i = 0; i < sr.length; i++) {
        let insp = sr[i].insp;
        if (!insp) {
          idss.push(sr[i].id);
        }
      }

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      const filter = {
        dakid: params.dakid,
        bmc: params.bmc,
        dakmc: '',
        dwid: dakoptService.dwid,
        bmid: dakoptService.bmid,
        bmmc: '',
        daklx: archStore.ktable?.daklx,
        mbid: archStore.ktable?.mbid,
        ids: ids,
      };
      debugger;
      console.log('SysStore.getCurrentUser()', SysStore.getCurrentUser());
      return {
        url: `/api/eps/control/main/dagl/Yjsp/SelectDailog`,
        params: filter,
        title: '????????????',
        filter,
        width: 650,
        height: 550,
      };
    },

    // ????????????
    async(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }
    },

    //?????????????????????
    DAK0017: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        yhid: dakoptService.yhid,
        dayh: dakoptService.yhid,
        selectIds: ids.toString(),
      };
      const filter = {
        dakGrid: dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/daksaveas?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????????????????',
        filter,
        width: 950,
        height: 550,
      };
    },
    // // ?????????
    // DAK0025: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
    //   const dakGrid = {
    //     dakid: params.dakid,
    //     ktable: archStore.ktable,
    //     mbid: archStore.ktable?.mbid,
    //     bmc: params.bmc,
    //     tmzt: params.tmzt,
    //     dayh: dakoptService.yhid,
    //     dwid: dakoptService.dwid,
    //     daklx: archStore.ktable?.daklx,
    //     hszbz: "Y",
    //     orderwhsj: 1
    //   }
    //   const filter = {
    //     dakGrid: dakGrid,
    //     toolbarId: "toolbar",
    //     gridRecycleId: "gridRecycleId"
    //   }
    //   debugger;
    //   return { url: `/api/eps/control/main/dagl/recycleBin?${qs.stringify(filter)}`, params: filter, title: "?????????", filter, width: 1280, height: 550 };
    // },

    //???????????????
    DAK0029: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //var formData = new FormData();
      // formData.append('dakid', params.dakid);
      // formData.append('tmzt', params.tmzt);
      // formData.append('dakmc', "");
      // formData.append('yhid', dakoptService.yhid);
      // formData.append('yhmc', dakoptService.yhmc);
      // formData.append('yhbh', dakoptService.yhbh);
      // formData.append('dw', dakoptService.dwid);
      // formData.append('cs', archStore.selectRecords);
      //formData.append('pg', "list");
      // formData.append('lx', params.tmzt);
      console.log('filarchStore.selectRecordster', archStore.selectRecords);
      const filter = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        dakmc: '',
        yhid: dakoptService.yhid,
        yhmc: dakoptService.yhmc,
        yhbh: dakoptService.yhbh,
        dw: dakoptService.dwid,
        cs: archStore.selectRecords?.map((item) => {
          return { id: item.id };
        }) || [{ id: '' }],
        pg: 'list',
        lx: params.tmzt,
      };
      console.log('filter', filter);
      return {
        url: `/api/eps/control/main/dagl/ywcmm?${qs.stringify(filter)}`,
        params: filter,
        title: '???????????????',
        filter,
        width: 900,
        height: 610,
      };
    },

    // ??????
    async DAK0064(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: String[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      } else if (ids.length > 1) {
        message.warning({ type: 'warning', content: '????????????????????????' });
        return { disableModal: true };
      }

      const map = {
        mbid: archStore.ktable?.mbid,
        sxid: 'SX04',
        selectRecords: archStore.selectRecords,
      };

      const res = await dakoptService.queryMbzlxByKey(map);

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        lx: params.lx,
        ly: params.tmzt,
        daklx: archStore.ktable?.daklx,
        bmc: params.bmc,
      };
      const filter = res;
      filter['dakGrid'] = dakGrid;
      filter['toolbarId'] = toolbar;

      /**
       *
       * ????????????????????????miniui??????
       */
      return {
        url: `/api/eps/control/main/dagl/logLine?${qs.stringify(filter)}`,
        params: filter,
        title: '??????',
        filter,
        width: 1280,
        height: 550,
      };
    },

    //????????????
    DAK0065: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'yjsp',
            spName: '????????????',
            spCode: 'yjsp',
          },
        };
      }
      const filter = {
        dakid: params.dakid,
        bmc: params.bmc,
        ids: ids.toString(),
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
      };
      const res = await dakoptService.updateDaztShsj(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'warning', content: '??????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ?????????????????????-???????????????
    DAK0103: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const tmids = ids[0];

      const filter = {
        dakid: params.dakid,
        bmc: params.bmc,
        tmzt: params.tmzt,
        ids: ids.toString(),
        tmid: tmids,
      };

      /**
       *
       * ????????????????????????miniui??????
       */
      return {
        url: `/api/eps/control/main/dagl/bykhbyytm?${qs.stringify(filter)}`,
        params: filter,
        title: '?????????????????????',
        filter,
        width: 1280,
        height: 550,
      };
    },

    // ?????????????????????-????????????
    DAK0136: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const tmids = ids[0];

      const filter = {
        dakid: params.dakid,
        bmc: params.bmc,
        tmzt: params.tmzt,
        ids: ids.toString(),
        tmid: tmids,
      };

      /**
       *
       * ????????????????????????miniui??????
       */
      return {
        url: `/api/eps/control/main/dagl/bykhbyytm?${qs.stringify(filter)}`,
        params: filter,
        title: '?????????????????????',
        filter,
        width: 1280,
        height: 550,
      };
    },

    // ????????????
    DAK0115: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      const grid = {
        pageIndex: 0,
        pageSize: 100,
      };
      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        lx: params.lx,
        daklx: archStore.ktable?.daklx,
        bmc: params.bmc,
        mc: params.mc,
        selectIds: ids.toString(),
        grid,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
        // srs: archStore.selectRecords,
        srs: [],
        tmzt: params.tmzt,
        dakid: params.dakid,
        dwid: dakoptService.dwid,
      };

      return {
        url: `/api/eps/control/main/dagl/Dakgpdb?${qs.stringify(filter)}`,
        params: filter,
        title: '?????????????????????',
        filter,
        width: 500,
        height: 310,
      };
    },

    // ????????????
    DAK0122: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        // tmzt: params.tmzt,
        // daklx: archStore.ktable?.daklx,
        // lx: params.lx,
        //     grid: archStore.selectRecords,
        ids: ids.toString(),
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakhyyj?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 1300,
        height: 600,
      };
    },

    // ????????????
    DAK0078: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
        lx: params.lx,
        yhid: dakoptService.yhid,
        ids,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/daglDayj?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????????????????',
        filter,
        width: 950,
        height: 560,
      };
    },

    // ????????????????????????
    DAK0080: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
        lx: params.lx,
        yhid: dakoptService.yhid,
        ids,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakbysaveas?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????????????????',
        filter,
        width: 950,
        height: 560,
      };
    },

    // ??????????????????
    DAK0082: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '??????????????????!' });
        return { disableModal: true };
      }

      const filter = {
        ids: ids.toString(),
        dakid: params.dakid,
        bmc: params.bmc,
        whr: dakoptService.yhmc,
        whrid: dakoptService.yhid,
      };
      const res = await dakoptService.addteamp(filter);
      if (res.success) {
        message.success({ type: 'warning', content: '???????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ???????????????
    DAK0084: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '??????????????????!' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
        bmc: params.bmc,
      };
      const filter = {
        dakGrid,
        SelectedRecord: archStore.selectRecords,
        toolbarId: 'toolbar',
        ids,
      };
      const res = await dakoptService.addJyc(filter);
      if (res.success) {
        RightStore.queryAllCartCount();
        message.success({ type: 'warning', content: '????????????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ????????????
    DAK0071: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '??????????????????!' });
        return { disableModal: true };
      }

      const grid = {
        pageIndex: 0,
        pageSize: 100,
      };
      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
        lx: params.lx,
        yhid: dakoptService.yhid,
        grid,
      };

      const filter = {
        toolbarId: 'toolbar',
        dakid: params.dakid,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        lx: archStore.ktable?.daklx,
        bmc: params.bmc,
        dakGrid,
        fid: params.fid,
      };
      return {
        url: `/api/eps/control/main/daly/plcx?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 1100,
        height: 340,
      };
    },

    // ??????????????????
    DAK0086: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
        bmc: params.bmc,
      };
      const filter = {
        dakGrid,
        SelectedRecord: archStore.selectRecords,
        toolbarId: 'toolbar',
        ids,
      };
      const res = await dakoptService.addWdsc(filter);

      if (res.success) {
        message.success({ type: 'warning', content: '???????????????????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ??????????????????????????????
    DAK0026: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        bmc: params.bmc,
        dayh: dakoptService.yhid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
        pg: 'list',
        ids: ids.toString(),
      };
      return {
        url: `/api/eps/control/main/dagl/dakPlgl?${qs.stringify(filter)}`,
        params: filter,
        title: '??????????????????????????????',
        filter,
        width: 960,
        height: 550,
      };
    },

    // ????????????
    DAK0013: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        ids,
        fid: params.fid,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/dakzyyj?${qs.stringify(filter)}`,
        params: filter,
        title: '????????????',
        filter,
        width: 900,
        height: 460,
      };
    },

    // ?????????
    DAK0012: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        ids,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
        editFormId: 'editForm',
      };
      return {
        useIframe: false,
        width: 1000,
        height: 400,
        showFoot: false,
        url: '/sys/dagl/zxj',
        title: '?????????',
      };
    },

    // ??????
    DAK0037: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        ids,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
        editFormId: 'editForm',
      };
      return {
        url: `/api/eps/control/main/dagl/dakyj?${qs.stringify(filter)}`,
        params: filter,
        title: '??????',
        filter,
        width: 800,
        height: 440,
      };
    },

    // ??????
    DAK0027: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const dakGrid = {
        dakid: params.dakid,
        tmzt: params.tmzt,
        daklx: archStore.ktable?.daklx,
        bmc: params.bmc,
      };
      const filter = {
        dakGrid,
        toolbarId: 'toolbar',
        ids,
      };
      const res = await dakoptService.doCheJian(filter);

      if (res.success) {
        message.success({ type: 'warning', content: '???????????????' });
      } else {
        message.error('????????????????????????\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // ????????????
    DAJD0005: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {},
    // ????????????
    DAJD0006: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //    alert(ids);

      return { disableModal: true };
    },

    // ????????????ofd
    DAK0200: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const tmzt = params.tmzt;
      const lx = tmzt === '1' ? '1' : tmzt === '2' ? '2' : '3';
      const obmc = params.bmc;
      let bb = '';
      const aa = archStore.selectRecords;
      for (let j = 0; j < aa.length; j++) {
        bb += ',' + aa[j]['filegrpid'];
      }
      const filter = {
        dakid: params.dakid,
        bmc: obmc,
        daklx: archStore.ktable?.daklx,
        tmzt: lx,
        mbid: archStore.ktable?.mbid,
        dakmc: archStore.ktable?.mc,
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
        ids: ids.toString(),
        ly: 5,
        cont: archStore.selectRecords.length,
        grpids: bb.substring(1),
        doctbl: obmc + '_FJ',
        grptbl: obmc + '_FJFZ',
      };

      localStorage.setItem('ofdzhdata', JSON.stringify(filter));

      /**
       *
       * ????????????????????????miniui??????
       */
      return {
        url: `/api/eps/wdgl/attachdoc/ofd/plzhofdE9?`,
        title: 'ofd????????????',
        width: 1450,
        height: 565,
      };
    },

    //  ?????????????????????
    async DAK0081(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 880,
          height: 600,
          showFoot: false,
          url: '/sys/daby/Bykfdbmh',
          title: '???????????????',
        };
      }

      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "??????????????????" };
    },
    //  ????????????
    async DAK0083(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '?????????????????????' })
      //   return { disableModal: true };
      // } else {
      return {
        useIframe: false,
        width: 880,
        height: 600,
        showFoot: false,
        url: '/sys/daly/Dazd',
        title: '????????????',
      };
      // }
      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "??????????????????" };
    },

    //  ????????????
    async DAK00830(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '?????????????????????' })
      //   return { disableModal: true };
      // } else {
      return {
        useIframe: false,
        width: 880,
        height: 600,
        showFoot: false,
        url: '/sys/daly/Dazd12',
        title: '????????????',
      };
      //   return { useIframe: false, width: 1400, height: 600, showFoot: false, url: "/sys/dagl/ResetDagsbm", title: "??????????????????" };

      // }
    },

    // ??????????????????
    DAK0121: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const filter = {
        id: ids[0].toString(),
      };

      return {
        url: `/api/eps/control/main/dazdtemp/ckzdmxnr?${qs.stringify(filter)}`,
        params: filter,
        title: '??????????????????',
        filter,
        width: 780,
        height: 600,
      };
    },

    // ????????????
    async DAK00105(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1100,
          height: 720,
          showFoot: false,
          url: '/sys/daby/ByContentDoc',
          title: '??????',
        };
      }

      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "??????????????????" };
    },

    //  ??????????????????????????????
    async DAK00104(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid????????????
      if (ids.length < 2) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }

      const filter = {
        dakid: params.dakid,
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        dakmc: archStore.ktable?.mc,
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
        ids: ids.toString(),
      };

      console.log('hbdxtmfilter', filter);

      const res = await dakoptService.hbDxtm(filter);
      if (res.success) {
        message.success({ type: 'warning', content: '???????????????' });
        refreshPage();
      } else {
        message.error('????????????????????????\r\n' + res.message);
        refreshPage();
      }
      return { disableModal: true };
    },
    // ????????????
    async DAK0137(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'kfjdsp',
            spName: '????????????',
            spCode: 'kfjd',
          },
        };
      }
    },
    // ??????????????????
    async DAK0138(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '180px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialogDiv',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'kfjdsp',
            spName: '????????????',
            spCode: 'kfjd',
          },
        };
      }
    },
    // ????????????
    async DAK0140(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'hkjd',
            spName: '????????????',
            spCode: 'hkjd',
          },
        };
      }
    },

    // ????????????
    async DAK0143(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'xhjdsp',
            spName: '????????????',
            spCode: 'xhjd',
          },
        };
      }
    },

    // ????????????
    async DAK0145(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'mjjd',
            spName: '????????????',
            spCode: 'mjjd',
          },
        };
      }
    },

    // ????????????
    async setDrawVisit(visit: boolean) {
      // ???????????????dakgrid?????? ??????
      runInAction(() => {
        this.drawVisit = visit;
      });
    },
    // todo ???????????? ????????????
    async doDraw() {
      // ???????????????dakgrid?????? ??????
      var me = this;
      runInAction(() => {
        this.useIframe = false;
        this.drawUrl = 'eps/components/list/articles';
        this.drawTitle = '????????????';
        this.drawExtendParams = {
          dakid: me.ktable.id,
          mc: this.ktable.mc,
          tmzt: me.tmzt,
          spUrl: 'kfjdsp',
          spName: '????????????',
          lx: this.ktable.daklx,
          bmc: this.ktable.bmc,
          spCode: 'kfjd',
          whr: SysStore.getCurrentUser().id,
        };
      });
    },

    // ??????
    async DAKBTN01(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
      ktable,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      if (archStore.selectRecords.kfjd) {
        message.warning({ type: 'warning', content: '?????????????????????????????????' });
        return { disableModal: true };
      }
      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmids: ids.join(','),
        dwid: dakoptService.dwid,
        mbid: archStore.ktable?.mbid,
        tmzt: archStore.tmzt,
        jdzt: '?????????',
      };

      const res = await dakoptService.doOpenFilesAction(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '???????????????' });
      } else {
        refreshPage();
        message.warning('????????????????????????\r\n' + res.message);
      }
      this.setDrawVisit(false);
      this.setDrawVisit(true);
      return { disableModal: true };
    },

    // ????????????
    async DAKBTN03(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
      ktable,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      const recordIds = archStore.selectRecords
        .filter((item) => {
          if (!item.kfjd) {
            return true;
          } else {
            return false;
          }
        })
        .map((o) => {
          return o.id;
        });

      if (recordIds.length < 1) {
        message.warning({ type: 'warning', content: '?????????????????????????????????' });
        return { disableModal: true };
      }

      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmids: recordIds.join(','),
        dwid: dakoptService.dwid,
        mbid: archStore.ktable?.mbid,
        tmzt: archStore.tmzt,
        jdzt: '?????????',
      };

      const res = await dakoptService.doOpenFilesAction(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '???????????????' });
      } else {
        refreshPage();
        message.warning('????????????????????????\r\n' + res.message);
      }
      this.setDrawVisit(false);
      this.setDrawVisit(true);
      return { disableModal: true };
    },
    // ??????
    async DAKBTN02(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
      ktable,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      }

      if (archStore.selectRecords.kfjd) {
        message.warning({ type: 'warning', content: '?????????????????????????????????' });
        return { disableModal: true };
      }
      console.log('archstore', archStore);
      debugger;
      let keys = {
        bmc: archParams.bmc,
        dakid: archParams.dakid,
        tmids: ids.join(','),
        dwid: SysStore.getCurrentCmp().id,
        mbid: ktable?.mbid,
        tmzt: archParams.tmzt,
        zjjd: 'Y',
      };

      // keys["remark"] = SelectDialStore.saveParams.remark || '';
      keys['autosubmit'] = true;
      keys['dwid'] = SysStore.getCurrentCmp().id;
      keys['bmid'] = SysStore.getCurrentUser().bmid;
      keys['title'] = `${ktable.mc}?????????`;

      keys['dakid'] = ktable.id;
      keys['tmzt'] = ktable.tmzt;
      keys['lx'] = archParams.lx;
      keys['bmc'] = ktable.bmc;

      keys['ids'] = ids.join(',');
      keys['kfjd'] = '??????';

      const res = await dakoptService.doRangeAction(keys);
      if (res.success) {
        refreshPage();
        message.success({
          type: 'success',
          content: '????????????????????????????????????',
        });
      } else {
      }
      // refreshPage();
      //     message.warning('????????????????????????\r\n' + res.message);
      //    }
      return { disableModal: true };
    },
    //?????????????????????????????????
    async CQBC0001(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '???????????????????????????' });
        return { disableModal: true };
      }
      const param = {
        bmc: params.bmc,
        daklx: archStore.ktable?.daklx,
        ids: ids.toString(),
        tmzt: params.tmzt,
        mbid: archStore.ktable?.mbid,
        dakid: archParams.dakid,
      };
      confirm({
        title: '??????????????????????',
        icon: <ExclamationCircleOutlined />,
        content: '??????????????????????????????????????????????????????',
        okText: '??????',
        okType: 'danger',
        cancelText: '??????',
        onOk: () => Cqbcrefresh(param),
        onCancel: () => console.log('cancel'),
      });
      return { disableModal: true };
    },
    // ????????????
    async DAKBTN05(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // ???????????????dakgrid?????? ??????
      // ????????????????????????????????????/components/arch??????

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '?????????????????????' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDailogPublish',
          title: '????????????',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'dakf',
            spName: '????????????',
            spCode: 'dakf',
          },
        };
      }
    },
    // archAction end
    doEdit: (modalType, record, index, store) => {
      runInAction(() => {
        // ??????????????????record????????????????????????????????????
        if (modalType == 'add') {
          archStore.getfjGuid();
          archStore.editRecord = {};
          archStore.modalType = '';
        } else {
          archStore.editRecord = record;
          archStore.setFjGuid(record.filegrpid);
        }
        archStore.modalType = modalType;
        archStore.detailVisible = true;
      });
    },
    // doArchMenuAction(item: OptType,ids: any, store: any, records: any){
    //   setMenuActionItem
    // }
  }));
  const [eepvisible, setEepvisible] = useState(false);

  const [ywzdvisible, setYwzdvisible] = useState(false);
  //?????????????????????????????????
  var Cqbcrefresh = async (param) => {
    const cqbcrepson = await TableService.cqbcDataRecovery(param);
    if (!cqbcrepson.success) {
      message.warning({
        type: 'warning',
        content: '??????????????????' + cqbcrepson.message,
      });
    } else {
      message.success('??????????????????');
    }
    //  return { disableModal: true };
  };

  var getParamValue = function (key, bmc) {
    var json = { table: bmc };
    return getParamValues(key, json);
  };

  var quotedStr = function (str) {
    return "'" + str + "'";
  };
  var getParamValues = function (aKey, jn) {
    switch (aKey.replace(/(^\s*)|(\s*$)/g, '').toLowerCase()) {
      case 'usrname':
        return quotedStr(dakoptService.yhmc);
      case 'usrbh':
        return quotedStr(dakoptService.yhbh);
      case 'curdate':
        return moment().format('yyyy-MM-dd');
      case 'curdatetime':
        return moment().format('yyyy-MM-dd HH:mm:ss');
      case 'curdatestr':
        return moment().format('yyyy-MM-dd HH');
      case 'curyearmonth':
        return moment().format('yyyy-MM');
      case 'curdatetimestr':
        return moment().format('yyyy-MM-dd HH:mm:ss');
      case 'usrid':
        return quotedStr(dakoptService.yhid);
      case 'curyear':
        return moment().format('YYYY');
      case 'curmonth':
        return moment().format('MM');
      case 'curday':
        return moment().format('DD');
      case 'curdakdwid':
        return quotedStr(dakoptService.dwid);
      case 'curdwid':
        return quotedStr(dakoptService.dwid);
      case 'curuserdwid':
        return quotedStr(dakoptService.dwid);
      case 'table':
        return jn['table'];
      default:
        if (jn && aKey in jn) {
          return jn[aKey];
        } else {
          return aKey;
        }
    }
  };

  var getParamSql = function (asql, bmc) {
    var sql = asql;
    var re = new RegExp('#[0-9a-zA-Z]+#', 'gm');
    var r = asql.match(re);
    if (r) {
      for (var i = 0; i < r.length; i++) {
        var key = r[i];
        var reg = new RegExp(key, 'gm'); // ????????????RegExp??????
        sql = sql.replace(
          reg,
          getParamValue(key.substring(1, key.length - 1), bmc),
        );
      }
    }
    return sql;
  };
  //????????????
  const searchFrom = () => {
    if (archStore.advSearchColumns.length > 0) {
      return (
        <>
          {archStore.advSearchColumns.map((item) => {
            return (
              <Form.Item
                label={item.kjmc}
                className="form-item"
                key={item.zlxid}
                name={item.zlxmc}
              >
                <Input placeholder={item.kjmc} />
              </Form.Item>
            );
          })}
        </>
      );
    }
    return <></>;
  };
  const refreshPage = async () => {
    debugger;
    if (archParams.tmzt == '8') {
      const res = await DakcartService.findDakcartsCount({
        tmzt: archParams.tmzt,
        dakid: archParams.dakid,
        whr: SysStore.getCurrentUser().id,
      });
      if (res.success) {
        runInAction(() => {
          debugger;
          archStore.dakCartCount = res.results;
          let storeTable = ref.current?.getTableStore();
          if (storeTable) {
            ref.current?.clearTableRowClick();
          }
        });
      }
    }
    let storeTable = ref.current?.getTableStore();
    if (storeTable) {
      ref.current?.clearTableRowClick();
    }

    storeTable.findByKey('', 1, storeTable.size, {
      fid: props.fid,
      ...props.archParams,
    });
  };

  const onuploadChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      if (!res.success) {
        message.error(`${res.message} `);
        return;
      }
      message.success(`${info.file.name} ??????????????????.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ??????????????????.`);
    }
  };

  function beforeUpload(file) {
    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf('.') + 1);
    if (extName != 'eep') {
      isJpgOrPng = false;
      message.error('????????????eep??????!');
    }
    return isJpgOrPng;
  }

  const handleCanceleep = () => {
    setEepvisible(false);
    refreshPage();
  };

  const handleOkeep = () => {
    setEepvisible(false);
    refreshPage();
  };

  const deleteToHsz = (ids, store) => {
    let idss = [];
    if (ids.length > 0) {
      for (var i = 0; i < ids.length; i++) {
        idss.push(ids[i].id);
      }
    } else {
      message.warning('????????????,???????????????????????????!');
      return;
    }

    /**
     * ????????????????????????
     */
    const RestoreFunc = async () => {
      var whrid = dakoptService.yhid;
      var existsOwnerData = false;
      var existsOtherData = false;

      for (var i = 0; i < ids.length; i++) {
        var r = ids[i];
        if (whrid != r['cjrid']) {
          existsOtherData = true;
        } else {
          existsOwnerData = true;
        }
      }

      if (existsOwnerData && existsOtherData) {
        message.warning('????????????????????????????????????????????????????????????????????????');
        return;
      }

      let params = {
        bmc: archStore.ktable?.bmc,
        daklx: archStore.ktable?.daklx,
        dakid: archParams.dakid,
        tmzt: archParams.tmzt,
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
        stflid: '',
        ids: idss.toString(),
      };

      const isSuccess = await dakoptService.deleteToHsz(params);
      if (isSuccess.success) {
        message.success('????????????!');

        let storeTable = ref.current?.getTableStore();
        storeTable.findByKey('', 1, storeTable.size, {
          fid: props.fid,
          ...props.archParams,
        });
        //storeTable.clearTableRowClick();
      } else {
        message.error('????????????!');
      }
    };
    /**
     * ????????????
     */
    const handleCancel = () => {
      console.log('Clicked cancel button');
    };

    confirm({
      title: '??????????????????????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      // content: '????????????????????????????????????????????????',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
      onOk: () => RestoreFunc(),
      onCancel: handleCancel,
    });
  };

  // ?????????????????????
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        {archStore.enablAdd && (
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              archStore.doEdit('add', {});
            }}
          >
            {' '}
            <FileAddOutlined />
            ??????
          </Button>
        )}
        {archStore.enablDelete && (
          <Button
            type="danger"
            style={{ marginRight: 10 }}
            onClick={() => deleteToHsz(ids, store)}
          >
            {' '}
            <DeleteOutlined />
            ??????
          </Button>
        )}
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={() => refreshPage()}
        >
          {' '}
          <SyncOutlined />
          ??????
        </Button>
        <ConditionSearch
          store={store}
          dakid={archParams.dakid}
          source={archStore.kfields}
          info={archStore.ktable}
        ></ConditionSearch>
        <EpsReportPrintButton
          store={store}
          dakid={archParams.dakid}
          ids={ids}
          reportDataSetNames={['GRID']}
          umid={umid}
          //queryparams ={""} fields={getColumsetslist()
        ></EpsReportPrintButton>
      </>,
    ];
  };

  //??????????????????
  const upcustomForm = () => {
    return (
      <>
        <Form.Item label="??????:" name="title">
          <Input style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="????????????:" name="lx">
          <Select
            style={{ width: 180 }}
            placeholder="????????????"
            allowClear
            options={archStore.doctypelist}
          />
        </Form.Item>
        <Form.Item label="????????????:" name="mj">
          <Input style={{ width: 180 }} />
        </Form.Item>
        <Form.Item
          label="xxx:"
          name="doctbl"
          hidden
          initialValue={archStore.ktable?.bmc + '_FJ'}
        >
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="xx:" name="fileid" hidden>
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
      </>
    );
  };

  const showlog = (record) => {
    // DazdStore.loadHistory(record);
    // DazdStore.loadHistoryCount(record);
    // setZdVisible(true);

    return {
      useIframe: false,
      width: 1400,
      height: 680,
      showFoot: false,
      url: '/sys/dagl/ResetDagsbm',
      title: '??????????????????',
    };
  };

  const getCustomTableAction = (text, record, index, store) => {
    if (store.params.tmzt === '12' || store.params.tmzt === 12) {
      if (store.params.umid === 'DALY025') {
        return (
          <>
            <Dazdcl store={store} record={record} />
            <EpsUploadButton
              title={'????????????'} // ?????????????????????
              uploadProp={archStore.uploadProp} //????????????prop
              width={1500}
              source={archStore.fjsource}
              height={800}
              refesdata={refreshPage}
              grpid={record.filegrpid}
              mj={record.mj}
              fjs={record.fjs}
              tmzt={record.tmzt}
              customForm={upcustomForm}
              daktmid={record.id}
              onUploadClick={() => {
                console.log('abcef', record);
                return Promise.resolve({
                  wrkTbl: archStore.ktable?.bmc,
                  docTbl: archStore.ktable?.bmc + '_FJ',
                  docGrpTbl: archStore.ktable?.bmc + '_FJFZ',
                  grpid: record.filegrpid,
                  daktmid: record.id,
                  tmzt: record.tmzt,
                  dakid: archStore.dakid,
                  atdw: SysStore.getCurrentUser().dwid,
                  idvs: JSON.stringify({ id: record.id }),
                  mj: '?????????',
                });
              }}
              params={{
                wrkTbl: archStore.ktable?.bmc,
                docTbl: archStore.ktable?.bmc + '_FJ',
                docGrpTbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
                tmzt: record.tmzt,
                dakid: archStore.dakid,
                atdw: SysStore.getCurrentUser().dwid,
                idvs: JSON.stringify({ id: record.id }),
                mj: '?????????',
              }} //??????????????????
              tableProp={archStore.uploadtableProp} //????????????prop
              tableService={wdglAttachdocService} //????????????server
              tableparams={{
                wrkTbl: archStore.ktable?.bmc,
                doctbl: archStore.ktable?.bmc + '_FJ',
                grptbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
              }} //??????????????????
            />
          </>
        );
      } else {
        return (
          <>
            <YwzdOne store={store} record={record} />
            <Ywzhgz store={store} record={record} />
            <EpsUploadButton
              title={'????????????'} // ?????????????????????
              uploadProp={archStore.uploadProp} //????????????prop
              width={1500}
              source={archStore.fjsource}
              height={800}
              refesdata={refreshPage}
              grpid={record.filegrpid}
              mj={record.mj}
              fjs={record.fjs}
              tmzt={record.tmzt}
              customForm={upcustomForm}
              daktmid={record.id}
              onUploadClick={() => {
                console.log('abcef', record);
                return Promise.resolve({
                  wrkTbl: archStore.ktable?.bmc,
                  docTbl: archStore.ktable?.bmc + '_FJ',
                  docGrpTbl: archStore.ktable?.bmc + '_FJFZ',
                  grpid: record.filegrpid,
                  daktmid: record.id,
                  tmzt: record.tmzt,
                  dakid: archStore.dakid,
                  atdw: SysStore.getCurrentUser().dwid,
                  idvs: JSON.stringify({ id: record.id }),
                  mj: '?????????',
                });
              }}
              params={{
                wrkTbl: archStore.ktable?.bmc,
                docTbl: archStore.ktable?.bmc + '_FJ',
                docGrpTbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
                tmzt: record.tmzt,
                dakid: archStore.dakid,
                atdw: SysStore.getCurrentUser().dwid,
                idvs: JSON.stringify({ id: record.id }),
                mj: '?????????',
              }} //??????????????????
              tableProp={archStore.uploadtableProp} //????????????prop
              tableService={wdglAttachdocService} //????????????server
              tableparams={{
                wrkTbl: archStore.ktable?.bmc,
                doctbl: archStore.ktable?.bmc + '_FJ',
                grptbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
              }} //??????????????????
            />
          </>
        );
      }
    } else {
      return (
        <>
          {archStore.menuTable.map((item) => (
            <Tooltip title={item.name}>
              <Button
                size="small"
                style={{
                  fontSize: '12px',
                  color: '#08c',
                }}
                shape="circle"
                icon={ArchCommon[item.optcode].icon}
                onClick={() =>
                  archStore.doArchAction(
                    item,
                    [record.id],
                    store,
                    record,
                    props.ktable,
                  )
                }
              />
            </Tooltip>
          ))}
          <Tooltip title="??????">
            <Button
              size="small"
              style={{
                fontSize: '12px',
                color: '#08c',
                display: archStore.enablEdit ? 'block' : 'none',
              }}
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => archStore.doEdit('edit', record, index, store)}
            />
          </Tooltip>
          <EpsUploadButton
            title={'????????????'} // ?????????????????????
            uploadProp={archStore.uploadProp} //????????????prop
            width={1500}
            source={archStore.fjsource}
            height={800}
            refesdata={refreshPage}
            grpid={record.filegrpid}
            mj={record.mj}
            fjs={record.fjs}
            tmzt={record.tmzt}
            customForm={upcustomForm}
            daktmid={record.id}
            onUploadClick={() => {
              console.log('abcef', record);
              return Promise.resolve({
                wrkTbl: archStore.ktable?.bmc,
                docTbl: archStore.ktable?.bmc + '_FJ',
                docGrpTbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
                tmzt: record.tmzt,
                dakid: archStore.dakid,
                atdw: SysStore.getCurrentUser().dwid,
                idvs: JSON.stringify({ id: record.id }),
                mj: '?????????',
              });
            }}
            params={{
              wrkTbl: archStore.ktable?.bmc,
              docTbl: archStore.ktable?.bmc + '_FJ',
              docGrpTbl: archStore.ktable?.bmc + '_FJFZ',
              grpid: record.filegrpid,
              daktmid: record.id,
              tmzt: record.tmzt,
              dakid: archStore.dakid,
              atdw: SysStore.getCurrentUser().dwid,
              idvs: JSON.stringify({ id: record.id }),
              mj: '?????????',
            }} //??????????????????
            tableProp={archStore.uploadtableProp} //????????????prop
            tableService={wdglAttachdocService} //????????????server
            tableparams={{
              wrkTbl: archStore.ktable?.bmc,
              doctbl: archStore.ktable?.bmc + '_FJ',
              grptbl: archStore.ktable?.bmc + '_FJFZ',
              grpid: record.filegrpid,
              daktmid: record.id,
            }} //??????????????????
          />
        </>
      );
    }
  };

  // ????????????
  const customTableAction = (text, record, index, store) => {
    return getCustomTableAction(text, record, index, store);
  };

  useEffect(() => {
    if ((props.fid && props.fdakid) || !props.fid) {
      if (archParams.bmc) {
        archStore.initArchInfo(archParams, props.ktable);
      }
    }
  }, [props.ktable]);

  useEffect(() => {
    if (props.fid && props.fdakid) {
      let storeTable = ref.current?.getTableStore();
      if (storeTable && props.fid && storeTable.findByKey) {
        storeTable.findByKey('', 1, storeTable.size, {
          fid: props.fid,
          ...props.archParams,
        });
      }
    }
  }, [props.fid, props.fdakid]);

  useEffect(() => {
    if (archStore.drawVisit == true) {
      archStore.doDraw();
    }
  }, [archStore.drawVisit]);

  /**
   * ??????tableStreo save????????????
   * @param values
   * @returns
   */
  const onSave = (values, modalType) => {
    if (modalType == 'add') {
      const params = {
        dakid: archStore.dakid,
        mbid: props.ktable.mbid,
        tmzt: archStore.tmzt,
        ...values,
      };
      let storeTable = ref.current?.getTableStore();
      storeTable.save(params).then((res) => {
        archStore.editRecord = res.results;
        storeTable.findByKey('', 1, storeTable.size, {
          fid: props.fid,
          ...props.archParams,
        });
      });
    } else if (modalType == 'edit') {
      const params = {
        dakid: archStore.dakid,
        mbid: props.ktable.mbid,
        tmzt: archStore.tmzt,
        ...values,
      };
      let storeTable = ref.current?.getTableStore();
      storeTable.update(params).then((res) => {
        storeTable.findByKey('', 1, storeTable.size, {
          fid: props.fid,
          ...props.archParams,
        });
      });
    }
  };

  const title: ITitle = {
    name: '?????????',
  };

  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false,
    isAsync: true,
    extend:
      localStorage.getItem(
        `dak-appraisal-manage-${window.btoa(archParams.dakid)}`,
      ) === 'true',
    onExtendChange: (value: boolean) => {
      localStorage.setItem(
        `dak-appraisal-manage-${window.btoa(archParams.dakid)}`,
        value,
      );
    },
    treeExpand: () => (
      <GroupSelect
        archParams={archStore.archParams}
        archStore={archStore}
        loadData={async (val) => {
          const treeStore = ref.current?.getTreeStore();
          treeStore.treeList = [{ key: `root`, title: '??????', isLeaf: true }];
          await treeStore.findTree('', val);
          await treeStore.loadAsyncData({ key: val._key });
        }}
        ktable={archStore.ktable}
        yhid={dakoptService.yhid}
      />
    ),
  };

  return (
    <div style={{ height: '100%' }}>
      <EpsPanel
        initParams={archStore.archParams}
        title={title} // ?????????????????????
        source={archStore.columns} // ????????????????????????
        treeProp={treeProp} // ????????? ????????????,?????????io
        treeService={treeService} // ????????? ??????????????????
        treeAutoLoad={props.treeAutoLoad}
        // tableAutoLoad={props.tableAutoLoad === undefined ? true : props.tableAutoLoad}
        tableAutoLoad={false}
        //   tableRowClick={tableRowClick}
        zIndex={props.zIndex}
        //   afterTreeSelectAction={afterTreeSelectAction}
        tableProp={archStore.tableProp} // ?????????????????????????????????
        tableService={TableService} // ??????????????????????????????
        ref={ref} // ???????????????????????????
        tableRowClick={props.tableRowClick}
        menuProp={archStore.menuProp} // ???????????? ?????????????????????
        menuButton={archStore.menuButton}
        menuLoad={() => archStore.menuLoad()}
        customAction={customAction}
        customTableAction={customTableAction}
        searchForm={searchFrom} // ???????????????????????????
        customForm={customForm} // ?????????????????????(????????????????????????????????????????????????????????????????????????????????????????????????)?????????
        //     customTableAction={customTableAction} // ????????????????????????(?????????+ToolTip????????????????????????)?????????
        // ????????????????????????????????????????????????????????????????????????
      ></EpsPanel>
      <ArchMenuAction
        params={archStore.archParams}
        modalVisit={archStore.modalVisit}
        drawerVisit={archStore.drawerVisit}
        archStore={archStore}
        extendParams={archStore.extendParams}
        opt={archStore.menuActionItem}
      />

      {archParams.tmzt == 8 && (
        <DrawerAction
          //   params={archStore.archParams}
          count={archStore.dakCartCount}
          archStore={archStore}
          drawUrl={archStore.drawUrl}
          drawWidth={archStore.drawWidth}
          setDrawVisit={archStore.setDrawVisit}
          drawTitle={archStore.drawTitle}
          drawVisit={archStore.drawVisit}
          colseDraw={() => (archStore.drawVisit = false)}
          drawExtendParams={archStore.drawExtendParams}
          doSubmit={archStore.drawSubmit}
          refreshPage={refreshPage}
          drawUseIframe={false}
        />
      )}

      <Detail
        bmc={archStore.ktable?.bmc}
        grpid={archStore.fjgrid}
        fjsource={archStore.fjsource}
        uploadprop={archStore.uploadProp}
        detailVisible={archStore.detailVisible}
        tmzt={archStore.tmzt}
        saveData={archStore.editRecord}
        modalType={archStore.modalType}
        editRecord={archStore.editRecord}
        onSave={onSave}
        ktable={props.ktable}
        handleClose={() => {
          archStore.setDetailVisible(false);
        }}
        kfields={archStore.kfields}
      ></Detail>


    </div>
  );
});

export default ArchManage;
