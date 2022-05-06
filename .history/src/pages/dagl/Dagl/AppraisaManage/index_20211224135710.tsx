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

// 自定义表单
const customForm = () => {
  return <>{/*  */}</>;
};

const ArchManage = observer((props) => {
  // eslint-disable-next-line prefer-destructuring

  const archParams: ArchParams = props.archParams;

  const ref = useRef();
  //const [sjdata, setSjdata] = useState();
  const archStore: ArchStoreType = useLocalObservable(() => ({
    // 参数
    archParams,
    columns: [{ width: 2000 }],
    // 主表档案库信息
    ktable: {},
    // 动态字段信息
    kfields: [],
    // 高级检索列
    advSearchColumns: [],
    // 点击的菜单action
    menuActionItem: {},
    // 档案库opt
    dakopt: [],
    // tmzt
    tmzt: archParams.tmzt,
    //
    optcode: '',
    //
    useIframe: true,
    //
    menuProp: [],
    // 菜单按钮
    menuButton: [],
    // 表格按钮
    menuTable: [],
    // 获取档案按钮权限
    modalVisit: false,
    // 抽屉显示隐藏
    drawVisit: false,
    // 档案库id
    dakid: archParams.dakid,
    // 单位id
    dwid: '',
    // 选中记录
    selectRecords: [],
    // 弹出框高度
    modalHeight: 800,
    // 弹出框宽度
    modalWidth: 1280,
    // 是否多业务
    sfdyw: false,
    // 实体分类id
    stflid: null,
    // iframeUrl
    iframeUrl: '',
    // 是否显示弹出框页脚
    showFoot: false,
    //
    archModalInfo: {},
    //
    modalTitle: null,
    //
    modalUrl: '',
    // 弹出是否采用drawer模式
    isDrawer: false,
    //
    currentUser: util.getLStorage('currentUser'),
    //检查权限
    checkPermission() {
      return true;
    },
    detailVisible: false,
    // 编辑界面
    setDetailVisible(visible: boolean) {
      this.detailVisible = visible;
    },
    //
    isAdd: true,
    //
    editRecord: {},

    isModalVisible: false,
    // 拆卷确认界面
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
    // 档案库权限
    daqx: '',

    // eep导入权限判断
    eepjc: false,
    // 扩展参数，
    extendParams: {},
    // 弹出的extra区域
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
      disableMediaTwo: true,
      disableMediaSpilit: true,
      disableMediaConcat: true,
      uploadUrl: '/api/eps/wdgl/attachdoc/upload', //上传url地址
      dw: SysStore.getCurrentUser().dwid, //用户单位ID
      umId: 'DAGL003',
      aprint: '', //水印打印次数
      adown: '', //水印下载 次数
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
     * 附件列表 表格source
     */
    fjsource: [
      {
        title: '标题',
        code: 'title',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150,
      },
      {
        title: '文件名',
        code: 'filename',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150,
      },
      {
        title: '文件类型',
        code: 'ext',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '文件大小',
        code: 'size',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '文件分类',
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
        title: '文件密级',
        code: 'mj',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '版本号',
        code: 'bbh',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '校验码',
        code: 'md5code',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '文件转换',
        code: 'wjzh',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record) => {
          // if (text == "undefined") {
          //   return "未转换";
          // } else if (text == 0) {
          //   return "未转换";
          // } else if (text == 1) {
          //   return "转换成功";
          // } else if (text == 13) {
          //   return "转换失败";
          // }
          if (text === '1') {
            return '转换成功';
          } else {
            return '未转换';
          }
        },
      },
    ],
    //新增按钮权限
    enablAdd: false,
    //修改按钮权限
    enablEdit: false,
    //删除按钮权限
    enablDelete: false,
    // 数据权限
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
                title: ArchCommon[item.optcode].popTitle || '请确认?',
                icon: <ExclamationCircleOutlined />,
                content: ArchCommon[item.optcode].popContentText,
                okText: ArchCommon[item.optcode].okText || '确认',
                okType: 'danger',
                cancelText: ArchCommon[item.optcode].cancelText || '取消',
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
      this.uploadProp.doctbl = bmc + '_FJ'; //附件表名
      this.uploadProp.grptbl = bmc + '_FJFZ'; //附件分组表名
      this.uploadProp.wrkTbl = bmc; //数据表名
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
        /**附件权限 */
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

    // 初始化附件，需要移出到附件组件
    async initArchInfo(archParams: ArchParams, ktable) {
      if (!ktable.bmc) {
        return;
      }
      const { dakid, tmzt } = archParams;

      // 查询
      const mbcx = await TableService.getSearchColumns({
        lx: tmzt,
        mbid: ktable.mbid,
        tmzt: this.tmzt,
        dakid: this.dakid,
      });

      this.advSearchColumns = mbcx || [];

      const doctype = await TableService.getDoctype();
      this.doctypelist = doctype;

      //todo 查询抽屉数据数量 所有根据 条目状态判断的代码全部去除
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
        if (tmzt === '4' || tmzt === 4) {
          this.uploadtableProp['disableEdit'] = true;
          this.uploadtableProp['disableDelete'] = true;
        }
        if (tmzt === '12' || tmzt === 12) {
          if (archParams.umid === 'DALY025') {
            this.tableProp['disableEdit'] = false;
          }
        }

        this.ktable = ktable;
        this.advSearchColumns = mbcx || [];

        if (tmzt == '8') {
          this.dakCartCount = dakCartCount;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      });
    },

    // 初始化列
    async initColumns(archParams: ArchParams, ktable) {
      if (!ktable.bmc) {
        return;
      }
      const { dakid, tmzt } = archParams;
      const kfields = await TableService.getKField({
        dakid,
        lx: tmzt,
        pg: 'list',
      });

      runInAction(() => {
        this.kfields = kfields;
        this.columns = kfields
          .filter((kfield) => kfield['lbkj'] == 'Y')
          .map((kfield) => ({
            width: kfield['mlkd'] * 1.2,
            code: kfield['mc'].toLowerCase(),
            title: kfield['ms'],
            ellipsis: true,
          }));
      });
    },

    // 权限初始化数据
    async initAuth(archParams: ArchParams, ktable) {
      if (!ktable.bmc) {
        return;
      }
      const { dakid, tmzt } = archParams;

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

      // 系统按钮权限

      this.daqx = dakqx;
      this.initSysOpertion(archParams, archParams.bmc, dakqx);
      //todo 查询抽屉数据数量 所有根据 条目状态判断的代码全部去除
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
        // this.dakopt = dakOptAll;

        // 系统按钮权限
        // 表格菜单
        //  this.menuTable = dakTableOpt; //this.getMenuTable(dakTableOpt);
        //   console.log('menuTable', this.menuTable);
        // 系统按钮权限

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (props.tableAutoLoad || props.tableAutoLoad === undefined) &&
          this.refresh(archParams);
      });
    },

    // 菜单加载
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
      this.uploadProp['grpid'] = guid.message; //附件表名
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
            content: '调用功能失败，请联系系统管理员',
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
          // 是否ifame
          if (archModalInfo.useIframe == false) {
            archStore.useIframe = false;
          } else {
            archStore.useIframe = true;
          }
          // 是否drawer
          if (archModalInfo.isDrawer) {
            archStore.isDrawer = true;
          } else {
            archStore.isDrawer = false;
          }
          // 弹出扩展参数
          if (archModalInfo.extendParams) {
            archStore.extendParams = archModalInfo.extendParams;
          }
          // header extra区域
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
          // 调用编辑界面
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
     * 数据更新demo
     * @param optcode 档案库按钮编号DAK0005f
     * @param params 普通参数
     * @param store 档案库store
     * @param ids 选种id数据
     * @returns
     *
     */
    //生成档号
    async DAK0005(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'success', content: '生成档号成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },
    /**
     * 新界面demo
     * @param optcode 档案库按钮编号DAK0005f
     * @param params 普通参数
     * @param store 档案库store
     * @param ids 选种id数据
     * @returns
     *
     */
    //批量导入
    async DAK0011(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      return {
        useIframe: false,
        width: 1024,
        height: 640,
        showFoot: true,
        url: '/sys/params/systemConf',
        title: '批量挂接',
      };
    },

    //插件
    async DAK0041(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请先选择条目!' });
        return { disableModal: true };
      } else if (ids.length != 1) {
        message.warning({ type: 'warning', content: '抱歉只能选择一条!' });
        return { disableModal: true };
      }
      let record = archStore.selectRecords;
      record[0].chajianid = archStore.selectRecords[0].id;
      //将 id 去除
      delete record[0].id;
      return {
        disableModal: true,
        modalType: 'add',
        detailVisible: true,
        editRecord: record[0],
      };
    },

    //加入协查单
    async DAK0087(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1400,
          height: 550,
          showFoot: true,
          url: '/sys/dagl/addXcd',
          title: '加入协查单',
        };
      }
    },
    //加入实体借阅单
    async DAK0085(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1400,
          height: 550,
          showFoot: true,
          url: '/sys/dagl/addStjyd',
          title: '加入实体借阅单',
        };
      }
    },

    //加入利用大厅
    async DAK0088(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
        return { disableModal: true };
      } else if (ids.length > 1) {
        message.warning({ type: 'warning', content: '只能选择一行数据' });
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
        message.success({ type: 'success', content: '加入利用大厅成功!' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };

      // return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/addLydjd", title: "加入利用登记单" };
    },

    // 回收站
    async DAK0025(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      return {
        useIframe: false,
        width: 1400,
        height: 550,
        showFoot: false,
        url: '/sys/dagl/RecycleBin',
        title: '回收站',
      };
    },

    // 档案整理
    async DAK0049(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1400,
          height: 550,
          showFoot: false,
          url: '/sys/dagl/Dazl',
          title: '档案整理',
        };
      }
    },
    // 进馆移交新
    async DAK0134(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '请选择条目信息' })
      //   return { disableModal: true };
      // } else {
      //   return { useIframe: false, width: "100%", height: "100%", showFoot: false, url: "/sys/dagl/Jgyj", title: "进馆移交" }
      // }

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
              content: '该条目已移交或正在移交,不能重复移交!',
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
            title: '进馆移交',
            extendParams: {
              ids: ids.join(','),
              spUrl: 'gsyjsqd',
              spName: '进馆移交',
              spCode: 'gsyj',
            },
          };
        } else {
          message.warning({
            type: 'warning',
            content: '该条目已移交或正在移交,不能重复移交!',
          });
          return { disableModal: true };
        }
      }
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
      // 拼装该功能dakgrid所需参数
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '请选择条目信息' })
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
        title: '批量导入',
        filter,
        width: 1280,
        height: 680,
      };
    },

    //定时AIP导出
    async DAK0016(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
          content: '保存数据成功，EEP打包将在开启定时任务后执行！',
        });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //实时AIP导出
    async DAK0133(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.info('正在打包下载中,请稍后...');
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
            message.success('下载成功!');
          } else {
            message.error('下载失败！', rr.message);
          }
        } else {
          message.error('操作失败！', rr.message);
        }
      }

      return { disableModal: true };
    },

    // SIP导入
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
        title: 'SIP导入',
      };

      // console.log("filter,filter",filter)
      // return { url: `/api/eps/control/main/dagl/importSIP?${qs.stringify(filter)}`, params: filter, title: "SIP导入", filter, width: 800, height: 100 };
    },

    //  导入EEP
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
      // return { url: `/api/eps/control/main/dagl/importSIP?${qs.stringify(filter)}`, params: filter, title: "导入EEP包信息", filter, width: 800, height: 100 };
      return {
        useIframe: false,
        width: 600,
        height: 100,
        showFoot: false,
        url: '/sys/dagl/importSIP',
        title: '导入EEP',
      };
    },

    //导入EEP
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
      return {
          useIframe: false,
          width: '450px',
          height: '280px',
          showFoot: false,
          url: '/eps/dagl/Dagl/EepLxdr',
          title: '离线导入EEP',
          extendParams: filter,
      };

      // setEepvisible(true);
      // setEepparams(filter);
      // return { disableModal: true };
      //  return { url: `/api/eps/control/main/gszxyjcx/importEEP?${qs.stringify(filter)}`, params: filter, title: "导入EEP", filter, width: 800, height: 100 };
      // return { useIframe: false, width: 600, height: 100, showFoot: false, url: "/sys/dagl/importEEP", title: "导入EEP包信息" };
    },

    DAK0052: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
    ) => {
      // 拼装该功能dakgrid所需参数
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
        title: '自定义分组设置',
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
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
      // 拼装该功能dakgrid所需参数

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
        title: '批量修改',
        filter,
        width: 600,
        height: 400,
      };
    },

    // 0080 保存到编研档案库  档案库管理 卷内

    // 合到新卷
    DAK0014: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
      // 拼装该功能dakgrid所需参数

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
        title: '合到新卷',
        filter,
        width: 700,
        height: 500,
      };
    },

    //拆卷
    async DAK0015(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
      const dakGrid = {
        bmc: params.bmc,
        fids: ids.toString(),
      };
      const res = await dakoptService.chaiJuan(dakGrid);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '执行成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //公式计算
    async DAK0020(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'success', content: '执行成功' });
      } else {
        refreshPage();
        message.error('操作失败！原因：\r\n' + res.message);
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
        title: '档案查重',
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
        title: '断号查找',
        filter,
        width: 1300,
        height: 550,
      };
    },

    //综合排序
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
      message.success({ type: 'success', content: '排序成功' });
      return { disableModal: true };
    },

    //模板刷新
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
      //   message.error("操作失败！原因：\r\n" + res.message);
      // }

      archStore.refresh(filter);
      refreshPage();
      message.success({ type: 'success', content: '刷新成功' });
      // } else {
      return { disableModal: true };
    },
    //综合排序刷新
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
      //   message.success({ type: 'success', content: '刷新成功' });
      // } else {
      //   message.error("操作失败！原因：\r\n" + res.message);
      // }
      await archStore.refresh(filter);
      refreshPage();
      message.success({ type: 'success', content: '刷新成功' });
      return { disableModal: true };
    },

    //综合排序设置
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
        title: '综合排序设置',
        filter,
        width: 900,
        height: 534,
      };
    },

    //批量组卷
    async DAK0067(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'success', content: '执行成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 批量组件设置
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
        title: '批量组件设置',
        filter,
        width: 900,
        height: 532,
      };
    },
    // 装盒
    DAK0053: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        title: '装盒',
        filter,
        width: 985,
        height: 550,
      };
    },
    // 取消装盒
    async DAK0054(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'success', content: '取消成功' });
      } else {
        refreshPage();
        message.warning('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 盒管理
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

      const title = params.mc + '【盒管理】';
      return {
        url: `/api/eps/control/main/hgl/openDak?${qs.stringify(filter)}`,
        params: filter,
        title,
        filter,
        width: 1200,
        height: 700,
      };
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
    DAK0011: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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

      // 归属部门调整

      const filter = {
        dakGrid: dakGrid,
        toolbarId: 'toolbar',
      };
      return {
        url: `/api/eps/control/main/dagl/pldcgl?${qs.stringify(formData)}`,
        params: filter,
        title: '定时批量导出',
        filter,
        width: 600,
        height: 465,
      };
    },

    // 原文批量导出
    DAK0051: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
      message.success('开始下载请稍候...');
      return { disableModal: true };
    },

    //实时批量导出
    DAK0056: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
      message.success('开始下载请稍候...');
      return { disableModal: true };
    },

    // RFID写入
    async DAK0126(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
      const res = await dakoptService.doSXRFID(archStore.ktable?.mbid);

      if (res) {
      } else {
        message.warning({
          type: 'warning',
          content: '档案中没有属性为RFID的著录项，无法写RFID，请在模板中设置',
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
        title: 'RFID写入',
        filter,
        width: 1000,
        height: 465,
      };
    },

    // RFID查询
    async DAK0127(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数

      const res = await dakoptService.doSXRFID(archStore.ktable?.mbid);
      if (res) {
      } else {
        message.warning({
          type: 'warning',
          content: '档案中没有属性为RFID的著录项，无法写RFID，请在模板中设置',
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

    //  归属部门调整
    async DAK0030(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
            title: '归属部门调整',
          };
        } else {
          message.warning({ type: 'warning', content: '请设置归档部门属性' });
          refreshPage();
          return { disableModal: true };
        }
      }
      let storeTable = ref.current?.getTableStore();
      storeTable.findByKey('', 1, storeTable.size, {
        fid: props.fid,
        ...props.archParams,
      });

      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "归属部门调整" };
    },

    // DAK0030: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {

    //   // 拼装该功能dakgrid所需参数
    //   if (ids.length <= 0) {
    //     message.warning({ type: 'warning', content: '请选择条目信息' })
    //     return { disableModal: true };
    //   }
    //   httpRequest.get({
    //     url: `/api/eps/control/main/mbzlx/queryByKey?mbid=${archStore.ktable?.mbid}&sxid=SX100`
    //   }).then(res => {
    //     if (!res.data) {
    //       message.warning({ type: 'warning', content: '请设置归档部门属性' })
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
    //   return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(formData)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };

    // },

    //归属部门分组
    DAK0032: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //需要传入 plsql 语句暂时未实现
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };
    },

    //实体分组
    DAK0033: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //需要传入 plsql 语句暂时未实现
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };
    },
    //盒号分组
    DAK0034: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //需要传入 plsql 语句暂时未实现
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };
    },

    //归档分组
    DAK0036: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //需要传入 plsql 语句暂时未实现
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };
    },

    //页数转页次
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
        message.success({ type: 'success', content: '页数转页次成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //页次转页数
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
        message.success({ type: 'success', content: '页次转页数成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //固定分组
    DAK0008: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //需要传入 plsql 语句暂时未实现
      //return { url: `/api/eps/control/main/dagl/resetdagsbm?${qs.stringify(filter)}`, params: filter, title: "归属部门调整", filter, width: 520, height: 465 };
    },

    //归档
    DAK0001: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
      //这个需要前置判断
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
        message.success({ type: 'success', content: '归档成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //归入整编
    DAK0002: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
      //这个需要前置判断
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
        message.success({ type: 'warning', content: '归入整编成功' });
      } else {
        refreshPage();
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },
    //取消归档
    DAK0003: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'warning', content: '取消归档成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //退回收集
    DAK0004: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'warning', content: '取消收集成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }

      return { disableModal: true };
    },

    //查看无原文
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
      message.success({ type: 'success', content: '执行成功' });
      return { disableModal: true };
    },
    //数据检测
    DAK0040: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
       * 有前置判断需查看miniui代码
       */
      return {
        url: `/api/eps/api/xsxjc/jcindexE9?`,
        title: '数据检测',
        width: 1450,
        height: 565,
      };
    },

    //参见档案(因为之前的版本就有问题出现 bug,不知道成功与否)
    DAK0048: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        title: '参见档案',
        filter,
        width: 800,
        height: 400,
      };
    },

    // //档案整理(较复杂,暂时未完成)
    // DAK0049: (optcode: string, params: ArchParams, archStore: ArchStoreType, ids: Array) => {
    //   // 拼装该功能dakgrid所需参数
    //   if (ids.length <= 0) {
    //     message.warning({ type: 'warning', content: '请选择条目信息' })
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
    //   return { url: `/api/eps/control/main/dagl/dakZl?${qs.stringify(filter)}`, params: filter, title: "档案整理", filter, width: 800, height: 400 };

    // },

    DAK0006: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.success({ type: 'warning', content: '清除档号成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }

      return { disableModal: true };
    },

    //取消收发文归档     (据说不重要,暂未实现完毕)
    DAK0111: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }

      var sr = archStore.selectRecords;
      for (var i = 0; i < sr.length; i++) {
        if (sr[i].ffbmc == null || sr[i].ffbmc == '') {
          message.warning({
            type: 'warning',
            content: '该条目不是电子文件中心分发过来',
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
        title: '档案整理',
        filter,
        width: 800,
        height: 400,
      };
    },

    //流程状态退回
    DAK0130: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }

      var lcfzzt1 = archStore.selectRecords[0].lcfzzt;
      for (var i = 1; i < archStore.selectRecords.length; i++) {
        if (lcfzzt1 != archStore.selectRecords[i].lcfzzt) {
          message.warning({
            type: 'warning',
            content: '所选条目数据存在不同流程节点，请重新核实后选择!',
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
        message.success({ type: 'warning', content: '操作成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    //文件移交 (之前套接新界面,暂未实现)
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
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        title: '移交文件',
        filter,
        width: 650,
        height: 550,
      };
    },

    // 开放鉴定
    async(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }
    },

    //另存为到其他库
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
        title: '另存到其它档案库',
        filter,
        width: 950,
        height: 550,
      };
    },
    // // 回收站
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
    //   return { url: `/api/eps/control/main/dagl/recycleBin?${qs.stringify(filter)}`, params: filter, title: "回收站", filter, width: 1280, height: 550 };
    // },

    //原文重命名
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
        title: '原文重命名',
        filter,
        width: 900,
        height: 610,
      };
    },

    // 日志
    async DAK0064(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: String[],
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
        return { disableModal: true };
      } else if (ids.length > 1) {
        message.warning({ type: 'warning', content: '只能选择一行数据' });
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
       * 有前置判断需查看miniui代码
       */
      return {
        url: `/api/eps/control/main/dagl/logLine?${qs.stringify(filter)}`,
        params: filter,
        title: '日志',
        filter,
        width: 1280,
        height: 550,
      };
    },

    //档案审核
    DAK0065: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '文件移交',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'yjsp',
            spName: '文件移交',
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
        message.success({ type: 'warning', content: '档案审核成功' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 合并到已有条目-档案库管理
    DAK0103: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
       * 有前置判断需查看miniui代码
       */
      return {
        url: `/api/eps/control/main/dagl/bykhbyytm?${qs.stringify(filter)}`,
        params: filter,
        title: '合并到已有条目',
        filter,
        width: 1280,
        height: 550,
      };
    },

    // 合并到已有条目-档案收集
    DAK0136: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
       * 有前置判断需查看miniui代码
       */
      return {
        url: `/api/eps/control/main/dagl/bykhbyytm?${qs.stringify(filter)}`,
        params: filter,
        title: '合并到已有条目',
        filter,
        width: 1280,
        height: 550,
      };
    },

    // 光盘打包
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
        title: '档案库光盘打包',
        filter,
        width: 500,
        height: 310,
      };
    },

    // 合已有卷
    DAK0122: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '合已有卷',
        filter,
        width: 1300,
        height: 600,
      };
    },

    // 档案移交
    DAK0078: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '另存到编研档案库',
        filter,
        width: 950,
        height: 560,
      };
    },

    // 保存到编研档案库
    DAK0080: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '另存到编研档案库',
        filter,
        width: 950,
        height: 560,
      };
    },

    // 档案指导标识
    DAK0082: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请先选择条目!' });
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
        message.success({ type: 'warning', content: '标识成功！' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 加入借阅车
    DAK0084: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请先选择条目!' });
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
        message.success({ type: 'warning', content: '放入借阅车成功！' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 批量查询
    DAK0071: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请先选择条目!' });
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
        title: '批量查询',
        filter,
        width: 1100,
        height: 340,
      };
    },

    // 加入我的收藏
    DAK0086: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        message.success({ type: 'warning', content: '放入我的收藏成功！' });
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 批量自动关联关系设置
    DAK0026: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '批量自动关联关系设置',
        filter,
        width: 960,
        height: 550,
      };
    },

    // 组已有卷
    DAK0013: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '组已有卷',
        filter,
        width: 900,
        height: 460,
      };
    },

    // 组新卷
    DAK0012: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '组新卷',
      };
    },

    // 移件
    DAK0037: (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '移件',
        filter,
        width: 800,
        height: 440,
      };
    },

    // 撤件
    DAK0027: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        message.success({ type: 'warning', content: '执行成功！' });
      } else {
        message.error('执行失败！原因：\r\n' + res.message);
      }
      return { disableModal: true };
    },

    // 销毁鉴定
    DAJD0005: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {},
    // 直接销毁
    DAJD0006: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      //    alert(ids);

      return { disableModal: true };
    },

    // 批量转换ofd
    DAK0200: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
       * 有前置判断需查看miniui代码
       */
      return {
        url: `/api/eps/wdgl/attachdoc/ofd/plzhofdE9?`,
        title: 'ofd批量转换',
        width: 1450,
        height: 565,
      };
    },

    //  编研发布到门户
    async DAK0081(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择一行数据' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 880,
          height: 600,
          showFoot: false,
          url: '/sys/daby/Bykfdbmh',
          title: '发布到门户',
        };
      }

      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "归属部门调整" };
    },
    //  档案指导
    async DAK0083(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '请选择一行数据' })
      //   return { disableModal: true };
      // } else {
      return {
        useIframe: false,
        width: 880,
        height: 600,
        showFoot: false,
        url: '/sys/daly/Dazd',
        title: '档案指导',
      };
      // }
      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "归属部门调整" };
    },

    //  业务指导
    async DAK00830(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      // if (ids.length <= 0) {
      //   message.warning({ type: 'warning', content: '请选择一行数据' })
      //   return { disableModal: true };
      // } else {
      return {
        useIframe: false,
        width: 880,
        height: 600,
        showFoot: false,
        url: '/sys/daly/Dazd12',
        title: '业务指导',
      };
      //   return { useIframe: false, width: 1400, height: 600, showFoot: false, url: "/sys/dagl/ResetDagsbm", title: "归属部门调整" };

      // }
    },

    // 查看指导日志
    DAK0121: async (
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) => {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
        return { disableModal: true };
      }

      const filter = {
        id: ids[0].toString(),
      };

      return {
        url: `/api/eps/control/main/dazdtemp/ckzdmxnr?${qs.stringify(filter)}`,
        params: filter,
        title: '查看指导日志',
        filter,
        width: 780,
        height: 600,
      };
    },

    // 编研文档
    async DAK00105(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: 1100,
          height: 720,
          showFoot: false,
          url: '/sys/daby/ByContentDoc',
          title: '文档',
        };
      }

      //    return { useIframe: false, width: 1400, height: 550, showFoot: true, url: "/sys/dagl/ResetDagsbm", title: "归属部门调整" };
    },

    //  二次编研合并到新条目
    async DAK00104(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需参数
      if (ids.length < 2) {
        message.warning({ type: 'warning', content: '请至少选择两条条目' });
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
        message.success({ type: 'warning', content: '合并成功！' });
        refreshPage();
      } else {
        message.error('操作失败！原因：\r\n' + res.message);
        refreshPage();
      }
      return { disableModal: true };
    },
    // 开放鉴定
    async DAK0137(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '开放鉴定',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'kfjdsp',
            spName: '开放鉴定',
            spCode: 'kfjd',
          },
        };
      }
    },
    // 直接开放鉴定
    async DAK0138(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '180px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialogDiv',
          title: '开放鉴定',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'kfjdsp',
            spName: '直接开放',
            spCode: 'kfjd',
          },
        };
      }
    },
    // 划控鉴定
    async DAK0140(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '划控鉴定',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'hkjd',
            spName: '划控鉴定',
            spCode: 'hkjd',
          },
        };
      }
    },

    // 销毁鉴定
    async DAK0143(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '销毁鉴定',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'xhjdsp',
            spName: '销毁鉴定',
            spCode: 'xhjd',
          },
        };
      }
    },

    // 密级鉴定
    async DAK0145(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDialog',
          title: '密级鉴定',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'mjjd',
            spName: '密级鉴定',
            spCode: 'mjjd',
          },
        };
      }
    },

    // 抽屉样例
    async setDrawVisit(visit: boolean) {
      // 拼装该功能dakgrid所需 参数
      runInAction(() => {
        this.drawVisit = visit;
      });
    },
    // todo 抽屉样例 做成通用
    async doDraw() {
      // 拼装该功能dakgrid所需 参数
      var me = this;
      runInAction(() => {
        this.useIframe = false;
        this.drawUrl = 'eps/components/list/articles';
        this.drawTitle = '开放鉴定';
        this.drawExtendParams = {
          dakid: me.ktable.id,
          mc: this.ktable.mc,
          tmzt: me.tmzt,
          spUrl: 'kfjdsp',
          spName: '开放鉴定',
          lx: this.ktable.daklx,
          bmc: this.ktable.bmc,
          spCode: 'kfjd',
          whr: SysStore.getCurrentUser().id,
        };
      });
    },

    // 开放
    async DAKBTN01(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
      ktable,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }

      if (archStore.selectRecords.kfjd) {
        message.warning({ type: 'warning', content: '请确认条目为未鉴定状态' });
        return { disableModal: true };
      }
      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmids: ids.join(','),
        dwid: dakoptService.dwid,
        mbid: archStore.ktable?.mbid,
        tmzt: archStore.tmzt,
        jdzt: '待鉴定',
      };

      const res = await dakoptService.doOpenFilesAction(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '装入鉴定车' });
      } else {
        refreshPage();
        message.warning('操作失败！原因：\r\n' + res.message);
      }
      this.setDrawVisit(false);
      this.setDrawVisit(true);
      return { disableModal: true };
    },

    // 批量开放
    async DAKBTN03(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
      ktable,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
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
        message.warning({ type: 'warning', content: '请确认条目为未鉴定状态' });
        return { disableModal: true };
      }

      let filter = {
        bmc: params.bmc,
        dakid: params.dakid,
        tmids: recordIds.join(','),
        dwid: dakoptService.dwid,
        mbid: archStore.ktable?.mbid,
        tmzt: archStore.tmzt,
        jdzt: '待鉴定',
      };

      const res = await dakoptService.doOpenFilesAction(filter);
      if (res.success) {
        refreshPage();
        message.success({ type: 'success', content: '装入鉴定车' });
      } else {
        refreshPage();
        message.warning('操作失败！原因：\r\n' + res.message);
      }
      this.setDrawVisit(false);
      this.setDrawVisit(true);
      return { disableModal: true };
    },
    // 控制
    async DAKBTN02(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
      ktable,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      }

      if (archStore.selectRecords.kfjd) {
        message.warning({ type: 'warning', content: '请确认条目为未鉴定状态' });
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
      keys['title'] = `${ktable.mc}申请单`;

      keys['dakid'] = ktable.id;
      keys['tmzt'] = ktable.tmzt;
      keys['lx'] = archParams.lx;
      keys['bmc'] = ktable.bmc;

      keys['ids'] = ids.join(',');
      keys['kfjd'] = '控制';

      const res = await dakoptService.doRangeAction(keys);
      if (res.success) {
        refreshPage();
        message.success({
          type: 'success',
          content: '更新成功，所选条目已控制',
        });
      } else {
      }
      // refreshPage();
      //     message.warning('操作失败！原因：\r\n' + res.message);
      //    }
      return { disableModal: true };
    },
    //长期保存档案库数据恢复
    async CQBC0001(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: Array,
    ) {
      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请至少选择一行数据' });
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
        title: '数据恢复请确认?',
        icon: <ExclamationCircleOutlined />,
        content: '数据恢复会将覆盖原数据，是否继续进行',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => Cqbcrefresh(param),
        onCancel: () => console.log('cancel'),
      });
      return { disableModal: true };
    },
    // 开放鉴定
    async DAKBTN05(
      optcode: string,
      params: ArchParams,
      archStore: ArchStoreType,
      ids: string[],
    ) {
      // 拼装该功能dakgrid所需 参数
      // 档案管理中的功能统一写到/components/arch下面

      if (ids.length <= 0) {
        message.warning({ type: 'warning', content: '请选择条目信息' });
        return { disableModal: true };
      } else {
        return {
          useIframe: false,
          width: '650px',
          height: '580px',
          showFoot: false,
          url: '/eps/business/Approve/SelectDailogPublish',
          title: '档案开放',
          extendParams: {
            ids: ids.join(','),
            spUrl: 'dakf',
            spName: '档案开放',
            spCode: 'dakf',
          },
        };
      }
    },
    // archAction end
    doEdit: (modalType, record, index, store) => {
      runInAction(() => {
        // 新增时候变更record的值使界面编辑界面初始化
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
  //长期保存档案库数据恢复
  var Cqbcrefresh = async (param) => {
    const cqbcrepson = await TableService.cqbcDataRecovery(param);
    if (!cqbcrepson.success) {
      message.warning({
        type: 'warning',
        content: '数据恢复失败' + cqbcrepson.message,
      });
    } else {
      message.success('数据恢复成功');
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
        var reg = new RegExp(key, 'gm'); // 创建正则RegExp对象
        sql = sql.replace(
          reg,
          getParamValue(key.substring(1, key.length - 1), bmc),
        );
      }
    }
    return sql;
  };
  //高级查询
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

  const deleteToHsz = (ids, store) => {
    let idss = [];
    if (ids.length > 0) {
      for (var i = 0; i < ids.length; i++) {
        idss.push(ids[i].id);
      }
    } else {
      message.warning('操作失败,请至少选择一行数据!');
      return;
    }

    /**
     * 确认删除到回收站
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
        message.warning('同时存在自己维护和非自己维护的数据，不允许删除！');
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
        message.success('删除成功!');

        let storeTable = ref.current?.getTableStore();
        storeTable.findByKey('', 1, storeTable.size, {
          fid: props.fid,
          ...props.archParams,
        });
        //storeTable.clearTableRowClick();
      } else {
        message.error('删除失败!');
      }
    };
    /**
     * 取消删除
     */
    const handleCancel = () => {
      console.log('Clicked cancel button');
    };

    confirm({
      title: '确定要删除选中的数据到回收站吗?',
      icon: <ExclamationCircleOutlined />,
      // content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => RestoreFunc(),
      onCancel: handleCancel,
    });
  };

  // 自定义功能按钮
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
            新建
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
            删除
          </Button>
        )}
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={() => refreshPage()}
        >
          {' '}
          <SyncOutlined />
          刷新
        </Button>
        {/* <ConditionSearch
          store={store}
          dakid={archParams.dakid}
          source={archStore.kfields}
          info={archStore.ktable}
        ></ConditionSearch> */}
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

  //附件修改表单
  const upcustomForm = () => {
    return (
      <>
        <Form.Item label="标题:" name="title">
          <Input style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="文件分类:" name="lx">
          <Select
            style={{ width: 180 }}
            placeholder="文件类型"
            allowClear
            options={archStore.doctypelist}
          />
        </Form.Item>
        <Form.Item label="文件密级:" name="mj">
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
      title: '归属部门调整',
    };
  };

  const getCustomTableAction = (text, record, index, store) => {
    if (store.params.tmzt === '12' || store.params.tmzt === 12) {
      if (store.params.umid === 'DALY025') {
        return (
          <>
            <Dazdcl store={store} record={record} />
            <EpsUploadButton
              title={'附件信息'} // 组件标题，必填
              uploadProp={archStore.uploadProp} //附件上传prop
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
                  mj: '无密级',
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
                mj: '无密级',
              }} //附件上传参数
              tableProp={archStore.uploadtableProp} //附件列表prop
              tableService={wdglAttachdocService} //附件列表server
              tableparams={{
                wrkTbl: archStore.ktable?.bmc,
                doctbl: archStore.ktable?.bmc + '_FJ',
                grptbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
              }} //附件列表参数
            />
          </>
        );
      } else {
        return (
          <>
            <YwzdOne store={store} record={record} />
            <Ywzhgz store={store} record={record} />
            <EpsUploadButton
              title={'附件信息'} // 组件标题，必填
              uploadProp={archStore.uploadProp} //附件上传prop
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
                  mj: '无密级',
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
                mj: '无密级',
              }} //附件上传参数
              tableProp={archStore.uploadtableProp} //附件列表prop
              tableService={wdglAttachdocService} //附件列表server
              tableparams={{
                wrkTbl: archStore.ktable?.bmc,
                doctbl: archStore.ktable?.bmc + '_FJ',
                grptbl: archStore.ktable?.bmc + '_FJFZ',
                grpid: record.filegrpid,
                daktmid: record.id,
              }} //附件列表参数
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
          <Tooltip title="修改">
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
            title={'附件信息'} // 组件标题，必填
            uploadProp={archStore.uploadProp} //附件上传prop
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
                mj: '无密级',
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
              mj: '无密级',
            }} //附件上传参数
            tableProp={archStore.uploadtableProp} //附件列表prop
            tableService={wdglAttachdocService} //附件列表server
            tableparams={{
              wrkTbl: archStore.ktable?.bmc,
              doctbl: archStore.ktable?.bmc + '_FJ',
              grptbl: archStore.ktable?.bmc + '_FJFZ',
              grpid: record.filegrpid,
              daktmid: record.id,
            }} //附件列表参数
          />
        </>
      );
    }
  };

  // 表格按钮
  const customTableAction = (text, record, index, store) => {
    return getCustomTableAction(text, record, index, store);
  };

  useEffect(() => {
    if ((props.fid && props.fdakid) || !props.fid) {
      if (archParams.bmc) {
        archStore.initAuth(archParams, props.ktable);
        archStore.initColumns(archParams, props.ktable);
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
   * 调用tableStreo save进行保存
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
    name: '档案库',
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
          treeStore.treeList = [{ key: `root`, title: '全部', isLeaf: true }];
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
        // initParams={archStore.archParams}
        title={title} // 组件标题，必填
        source={archStore.columns} // 组件元数据，必填
        treeProp={treeProp} // 左侧树 设置属性,可选填io
        treeService={treeService} // 左侧树 实现类，必填
        treeAutoLoad={props.treeAutoLoad}
        // tableAutoLoad={props.tableAutoLoad === undefined ? true : props.tableAutoLoad}
        tableAutoLoad={false}
        //   tableRowClick={tableRowClick}
        zIndex={props.zIndex}
        //   afterTreeSelectAction={afterTreeSelectAction}
        tableProp={archStore.tableProp} // 右侧表格设置属性，选填
        tableService={TableService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        tableRowClick={props.tableRowClick}
        menuProp={archStore.menuProp} // 右侧菜单 设置属性，选填
        menuButton={archStore.menuButton}
        menuLoad={() => archStore.menuLoad()}
        customAction={customAction}
        customTableAction={customTableAction}
        searchForm={searchFrom} // 高级搜索组件，选填
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        //customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        // 自定义全局按钮（如新增、导入、全局打印等），选填
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
