import React, { useEffect, useState, useRef } from "react";
import { EpsPanel } from "@/eps/components/panel/EpsPanel2";
import TableService from "./TableService";
import dakoptService from "./dakoptService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../../utils/fetch";
import {
  ITable,
  ITitle,
  ITree, IUpload, EpsSource
} from "@/eps/commons/declare";
import { Button, Form, Input, message, Select, Modal, Tooltip } from 'antd';
import EpsFilesView from "@/eps/components/file/EpsFilesView";
import EpsUploadButton from '@/eps/components/buttons/EpsUploadButton';
import util from "@/utils/util";
import { observer, useLocalObservable } from "mobx-react";
import { runInAction } from 'mobx';
import EpsFormType from '@/eps/commons/EpsFormType';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";

import ArchMenuAction from './ArchMenuAction';
import ArchCommon from './ArchCommon'
import treeService from './treeService';
import qs from "qs";
import Detail from "./Detail";
import GroupSelect from "@/eps/business/DakLayout/components/GroupSelect";
import { FileAddOutlined, ExclamationCircleOutlined, EditOutlined, DeleteOutlined, SyncOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import Sys from "@/pages/sys";
import { resolveOnChange } from "antd/es/input/Input";
const { confirm } = Modal;
const umid = "DAGL";
const httpRequest = new HttpRequest("/api/api/eps/control/main");
import wdglAttachdocService from "./WdglAttachdocService"
import ConditionSearch from "@/eps/components/search/ConditionSearch";
import EpsReportPrintButton from "@/eps/components/buttons/EpsReportPrintButton";
import cookie from 'react-cookies';
import { Message } from '@alifd/next';
import { debounce } from "@umijs/deps/compiled/lodash";
import OptrightStore from "@/stores/user/OptrightStore";
import RightStore from "@/components/RightContent/RightStore";

// 自定义表单
const customForm = () => {
  return <>{/*  */}</>;
};

const ArchManageHgl = observer((props) => {
  // eslint-disable-next-line prefer-destructuring

  const archParams: ArchParams = props.archParams;

  const ref = useRef();
  const [sjdata, setSjdata] = useState();
  const archStore: ArchStoreType = useLocalObservable(() => (
    {
      // 参数
      archParams,
      columns: [],
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
      optcode: "",
      //
      useIframe: true,
      //
      menuProp: [],
      // 菜单按钮
      menuButton: [],
      // 获取档案按钮权限
      modalVisit: false,
      // 档案库id
      dakid: archParams.dakid,
      // 单位id
      dwid: "",
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
      iframeUrl: "",
      // 是否显示弹出框页脚
      showFoot: false,
      //
      archModalInfo: {},
      //
      modalTitle: null,
      //
      modalUrl: "",
      //
      currentUser: util.getLStorage("currentUser"),
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
      editRecord: null,

      isModalVisible: false,
      // 拆卷确认界面
      setIsModalVisible(visible: boolean) {
        this.isModalVisible = visible;
      },
      selectRows: [],
      // add edit view
      opt: "add",
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

      eepjc135: false,
      doctypelist: [],
      uploadProp: {
        disableUpload: true,
        disableBigUpload: true,
        uploadUrl: '/api/eps/wdgl/attachdoc/upload', //上传url地址
        dw: SysStore.getCurrentUser().dwid,//用户单位ID
        umId: 'DAGL003',
        aprint: '',//水印打印次数
        adown: '', //水印下载 次数
      },
      uploadtableProp: {
        disableAdd: true,
        disableCopy: true,
        labelColSpan: 8,
        tableSearch: false,
        rowSelection: {
          type: 'radio'
        },
        searchCode: 'title',
      },

      /**
       * 附件列表 表格source
       */
      fjsource: [{
        title: '标题',
        code: 'title',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150
      }, {
        title: '文件名',
        code: 'filename',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150
      }, {
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
      }, {
        title: '文件分类',
        code: 'lx',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          let xfglist = archStore.doctypelist;
          let aa = xfglist.filter(item => {
            return item.value === text
          })
          return aa[0]?.label
        },
      }, {
        title: '文件密级',
        code: 'mj',
        align: 'center',
        formType: EpsFormType.Input,
      }, {
        title: '版本号',
        code: 'bbh',
        align: 'center',
        formType: EpsFormType.Input,
      }, {
        title: '校验码',
        code: 'md5code',
        align: 'center',
        formType: EpsFormType.Input,
      }, {
        title: '文件转换',
        code: 'wjzh',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record) => {
          if (text == "undefined") {
            return "未转换";
          } else if (text == 0) {
            return "未转换";
          } else if (text == 1) {
            return "转换成功";
          } else if (text == 13) {
            return "转换失败";
          }
        }
      }
      ],
      //新增按钮权限
      enablAdd: false,
      //修改按钮权限
      enablEdit: false,
      //删除按钮权限
      enablDelete: false,
      // 数据权限
      psql: "((1=1))",
      tableProp: {
        tableSearch: true,
        disableDelete: true,
        disableEdit: true,
        disableCopy: true,
        disableAdd: true,
        initSearchValue: archParams.key,
        actionColumnNum: 2,
        rowSelection: {
          type: "checkbox"

        },
      },

      getMenProps(dakopt) {
        return dakopt.map(item => {
          return {
            title: item.name,
            icon: "icon_import_white",
            onClick: (ids, store, records) => {
              if (ArchCommon[item.optcode] && ArchCommon[item.optcode].showPopconfirm) {
                confirm({
                  title: ArchCommon[item.optcode].popTitle || '请确认?',
                  icon: <ExclamationCircleOutlined />,
                  content: ArchCommon[item.optcode].popContentText,
                  okText: ArchCommon[item.optcode].okText || '确认',
                  okType: 'danger',
                  cancelText: ArchCommon[item.optcode].cancelText || '取消',
                  onOk: () => archStore.doArchAction(item, ids, store, records, this.ktable),
                  onCancel: () => console.log("cancel"),
                });
              } else {
                this.doArchAction(item, ids, store, records, this.ktable);
              }

            },
            params: { tmzt: this.tmzt, daklx: this.ktable.daklx, optcode: item.optcode, dakid: this.dakid, fid: 1 },
            color: "#CFA32A",
            toolbarShow: false,
          };
        })
      },

      getMenuButton(dakyhOpt) {
        return dakyhOpt.map(item => {
          let params = {

            optcode: item.optcode,
            daklx: item.daklx,
            dakid: this.dakid,
            optlx: "1",
            wzlk: archParams.wzlk ? archParams.wzlk : undefined,
            isadd: item.isadd,
            fid: item.fid,
            tmzt: item.tmzt,

          }
          if (archParams.wzlk == "Y") {
            params["wzlk"] = "Y";
          }
          return {
            title: item.name,
            params,
            onClick: (ids, store, records) => {
              this.doArchAction(item, ids, store, records, ktable);
            },
          }
        })
      },




      initSysOpertion(archParams: ArchParams, bmc: string, dakqx) {
        this.uploadProp.doctbl = bmc + "_FJ"; //附件表名
        this.uploadProp.grptbl = bmc + "_FJFZ";//附件分组表名
        this.uploadProp.wrkTbl = bmc;//数据表名
        this.uploadProp.dakid = archParams.dakid;
        if (dakqx != undefined && dakqx != null && dakqx != "") {
          if (dakqx.indexOf(",SYS101,") > 0) {
            this.enablAdd = true;
          }
          if (dakqx.indexOf(",SYS102,") > 0) {
            this.enablEdit = true;
          }
          if (dakqx.indexOf(",SYS103,") > 0) {
            this.enablDelete = true;
          }
          /**附件权限 */
          if (dakqx.indexOf(",SYS302,") > 0) {
            this.uploadProp["disableViewDoc"] = false;
          }
          if (dakqx.indexOf(",SYS309,") > 0) {
            this.uploadProp["disableYwViewDoc"] = false;
          }
          if (dakqx.indexOf(",SYS310,") > 0) {
            this.uploadProp["disableYwDown"] = false;
          }
          if (dakqx.indexOf(",SYS303,") > 0) {
            this.uploadProp["disableDown"] = false;
          }
          if (dakqx.indexOf(",SYS305,") > 0) {
            this.uploadProp["disableUpload"] = false;
            this.uploadProp["disableBigUpload"] = false;
          } else {
            this.uploadProp["disableUpload"] = true;
            this.uploadProp["disableBigUpload"] = true;
          }
          if (dakqx.indexOf(",SYS308,") > 0) {
            this.uploadProp["disableScanner"] = false;
          }

        if (dakqx.indexOf(',SYS311,') > 0) {
          this.uploadProp['disableConvertViewDoc'] = false;
        } else {
          this.uploadProp['disableConvertViewDoc'] = true;
        }


        if (dakqx.indexOf(',SYS312,') > 0) {
          this.uploadProp['disableConvertDown'] = false;
        } else {
          this.uploadProp['disableConvertDown'] = true;
        }



          if (dakqx === "all") {
            this.eepjc = true;
            this.eepjc135 = true;
          } else {
            const b = dakqx.indexOf(",DAK0045,") >= 0;
            this.eepjc = b;
            const a = dakqx.indexOf(",DAK0135,") >= 0;
            this.eepjc135 = a;
          }

        }
      },

      async initArchInfo(archParams: ArchParams, ktable) {
        if (!ktable.bmc) {
          return;
        }
        const { dakid, tmzt } = archParams;
        const kfields = await TableService.getKField({ dakid, lx: tmzt, pg: "list" });
        let dakOptAll = await dakoptService.findAll({
          tmzt,
          wzlk: archParams.wzlk ? archParams.wzlk : undefined,
          dakid: archParams.dakid,
          daklx: archParams.lx,
          fid: '1',
        });
        let dakopt = dakOptAll && dakOptAll.filter(item =>
          item.isadd === 'N' && item.optlx === "1"
        );
        dakopt = dakopt?.filter(item =>
          item.fz !== "DAKFZ001"
        );

        let dakyhOpt = dakOptAll && dakOptAll.filter(item =>
          item.isadd === 'Y' && item.oplx === "1"
        );

        dakyhOpt = dakyhOpt && dakyhOpt.filter(item =>
          item.fz !== "DAKFZ001"
        )
        if (archParams.wzlk == "Y") {
          dakopt["wzlk"] = "Y";
          dakyhOpt["wzlk"] = "Y";
        }

        // 查询
        const mbcx = await TableService.getSearchColumns({ lx: 1, mbid: ktable.mbid, tmzt: this.tmzt, dakid: this.dakid });
        const psql = await TableService.getSjqxSql({ pcode: "A", dakid: this.dakid, tmzt: this.tmzt, yhid: SysStore.getCurrentUser().id });
        const dakqx = await dakoptService.findqx({ tmzt: tmzt, yhid: dakoptService.yhid, dakid: archParams.dakid, });
        const doctype = await TableService.getDoctype();
        this.doctypelist = doctype;


        this.daqx = dakqx;

        runInAction(() => {
          this.psql = psql;
          // archParams.psql = psql;
          //  this.archParams = archParams;
          // this.daqx = dakqx;
          if (tmzt === "4" || tmzt === 4) {
            this.uploadtableProp["disableEdit"] = true
            this.uploadtableProp["disableDelete"] = true
          }
          this.ktable = ktable;
          this.kfields = kfields;
          this.dakopt = dakOptAll;
          this.advSearchColumns = mbcx || [];
          this.columns = kfields.filter(kfield => kfield["lbkj"] === "Y").map(kfield => ({
            width: kfield["mlkd"] * 1.3,
            code: kfield["mc"].toLowerCase(),
            title: kfield["ms"],
            ellipsis: true
          }));
          // 菜单
          this.menuProp = this.getMenProps(dakopt)
          // 菜单按钮
          this.menuButton = this.getMenuButton(dakyhOpt);
          // 系统按钮权限
          this.initSysOpertion(archParams, archParams.bmc, dakqx);
          props.tableAutoLoad && this.refresh(archParams);
        })
      },

      async menuLoad() {

        const archParams = this.archParams;
        const ktable = this.ktable;

        const { dakid, tmzt } = archParams;
        if (tmzt && tmzt > 0) {
          const dakopt = await dakoptService.findAll({
            tmzt,
            isadd: 'N',
            optlx: "1",
            dakid: archParams.dakid,
            daklx: archParams.lx,
            fid: '1',
          });

          const dakyhOpt = await dakoptService.findAll({
            isadd: 'Y',
            daklx: archParams.lx,
            optlx: "1",
            wzlk: archParams.wzlk ? archParams.wzlk : undefined,
            dakid: archParams.dakid,
            tmzt: archParams.tmzt,
            fid: '1',
          })
          if (archParams.wzlk === "Y") {
            dakopt["wzlk"] = "Y";
            dakyhOpt["wzlk"] = "Y";
          }

          runInAction(() => {
            //   // this.archParams = archParams;
            //   // this.ktable = ktable;

            if (Array.isArray(dakopt) && dakopt.length > 0) {
              const opt = dakopt.filter(item => item.fz !== "DAKFZ001")
              archStore.menuProp = opt.map(item => {
                return {
                  title: item.name,
                  icon: "icon_import_white",
                  onClick: (ids, store, records) => {
                    this.doArchAction(item, ids, store, records, ktable);
                  },
                  params: { tmzt: archStore.tmzt, daklx: archStore.ktable.daklx, optcode: item.optcode, dakid: archStore.dakid, fid: 1 },
                  color: "#CFA32A",
                  toolbarShow: false,
                };
              });
            }
            if (Array.isArray(dakyhOpt)) {
              const yhOpt = dakyhOpt.filter(item => item.fz !== "DAKFZ001")

              archStore.menuButton = yhOpt.map(item => {
                const params = {
                  optcode: item.optcode,
                  daklx: item.daklx,
                  dakid: this.dakid,
                  optlx: "1",
                  isadd: item.isadd,
                  fid: item.fid,
                  tmzt: item.tmzt,
                  wzlk: archParams.wzlk ? archParams.wzlk : undefined,
                }
                if (archParams.wzlk === "Y") {
                  params["wzlk"] = "Y";
                }
                return {
                  title: item.name,
                  params,
                  onClick: (ids, store, records) => {
                    this.doArchAction(item, ids, store, records, ktable);
                  },
                }
              })
            }
          })
        }
      },
      setModalVisit(visit: boolean) {
        this.modalVisit = visit;
      },
      async getfjGuid() {
        const guid = await TableService.getGuid();
        console.log("11", guid.message);
        this.uploadProp["grpid"] = guid.message; //附件表名
        this.fjgrid = guid.message;
      },
      setFjGuid(val) {
        this.fjgrid = val;
      },

      doArchAction: async (opt: OptType, ids: any, store: any, records: any, ktable: KtableType) => {
        //  ArchAction[item.optcode](item,ids,store,records);
        //  const ids=records?.map(=>record.id)
        //       archModalInfo=archStore[opt.optcode](opt.optcode,props.params,ids);
        //  alert(opt.optcode)
        //this.selectRecords = records;
        if (opt && opt.optcode) {
          if (!archStore[opt.optcode]) {
            message.warning({ type: 'warning', content: '调用功能失败，请联系系统管理员' })
            return;
          }
          const archModalInfo = await archStore[opt.optcode](opt.optcode, archStore.archParams, { ...archStore, ktable: ktable, selectRecords: records }, ids);
          window._paramCache = archModalInfo?.params;
          runInAction(() => {
            archStore.optcode = "";
            archStore.modalHeight = archModalInfo.height;
            archStore.modalWidth = archModalInfo.width;
            archStore.selectRecords = records;
            archStore.ids = ids;
            if (archModalInfo.showFoot == true) {
              archStore.showFoot = true;
            } else {
              archStore.showFoot = false;
            }
            if (archModalInfo.useIframe == false) {
              archStore.useIframe = false;
            } else {
              archStore.useIframe = true;
            }
            // 弹出扩展参数
            if (archModalInfo.extendParams) {
              archStore.extendParams = archModalInfo.extendParams
            }
            archStore.modalTitle = archModalInfo.title;
            archStore.modalVisit = !archModalInfo.disableModal;
            archStore.optcode = opt.optcode || "";
            archStore.menuActionItem = opt;
            archStore.modalUrl = archModalInfo.url;
            archStore.archModalInfo = archModalInfo;
            // 调用编辑界面
            if (archModalInfo.modalType) {
              archStore.modalType = archModalInfo.modalType;
              archStore.detailVisible = archModalInfo.detailVisible;
              archStore.editRecord = archModalInfo.record;
            }
          })
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



      doEdit: (modalType, record, index, store) => {
        runInAction(() => {
          // 新增时候变更record的值使界面编辑界面初始化
          if (modalType == "add") {
            archStore.getfjGuid();
            archStore.modalType = "";

          } else {
            archStore.editRecord = record;
            archStore.setFjGuid(record.filegrpid);
          }
          archStore.modalType = modalType;
          archStore.detailVisible = true;

        })
      }


    }
  ));



  //高级查询
  const searchFrom = () => {
    if (archStore.advSearchColumns.length > 0) {
      return (
        <>
          {archStore.advSearchColumns.map(item => {
            return (
              <Form.Item label={item.kjmc} className="form-item" key={item.zlxid} name={item.zlxmc}>
                <Input placeholder={item.kjmc} />
              </Form.Item>
            )
          })}
        </>
      )
    }
    return <></>
  }
  const refreshPage = async () => {
    let storeTable = ref.current?.getTableStore();
    if (storeTable) {
      ref.current?.clearTableRowClick();
    }
    await storeTable.findByKey('', 1, storeTable.size, { fid: props.fid, ...props.archParams });

  }

  const deleteToHsz = (ids, store) => {

    let idss = [];
    if (ids.length > 0) {
      for (var i = 0; i < ids.length; i++) {
        idss.push(ids[i].id);
      }

    } else {
      message.warning("操作失败,请至少选择一行数据!")
      return
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
        if (whrid != r["cjrid"]) {
          existsOtherData = true;
        } else {
          existsOwnerData = true;
        }
      }

      if (existsOwnerData && existsOtherData) {
        message.warning("同时存在自己维护和非自己维护的数据，不允许删除！");
        return;
      }

      let params = {
        bmc: archStore.ktable?.bmc,
        daklx: archStore.ktable?.daklx,
        dakid: archParams.dakid,
        tmzt: archParams.tmzt,
        whrid: dakoptService.yhid,
        whr: dakoptService.yhmc,
        stflid: "",
        ids: idss.toString()
      }

      const isSuccess = await dakoptService.deleteToHsz(params);
      if (isSuccess.success) {
        message.success("删除成功!");

        let storeTable = ref.current?.getTableStore();
        storeTable.findByKey('', 1, storeTable.size, { fid: props.fid, ...props.archParams });
        //storeTable.clearTableRowClick();
      } else {
        message.error("删除失败!");
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
  }



  // 自定义功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
        {archStore.enablAdd &&
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => { archStore.doEdit("add", {}) }}> <FileAddOutlined />新建</Button>
        }
        {archStore.enablDelete &&
          <Button type="danger" style={{ marginRight: 10 }} onClick={() => deleteToHsz(ids, store)}> <DeleteOutlined />删除</Button>
        }
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => refreshPage()}> <SyncOutlined />刷新</Button>
        <ConditionSearch store={store} dakid={archParams.dakid} source={archStore.kfields} info={archStore.ktable}></ConditionSearch>
        <EpsReportPrintButton store={store} dakid={archParams.dakid} ids={ids} reportDataSetNames={["GRID"]} umid={umid}
        //queryparams ={""} fields={getColumsetslist()
        ></EpsReportPrintButton>
      </>
    ])
  }

  //附件修改表单
  const upcustomForm = () => {
    return (
      <>
        <Form.Item label="标题:" name="title" >
          <Input style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="文件分类:" name="lx" >
          <Select style={{ width: 180 }} placeholder="文件类型" allowClear options={archStore.doctypelist} />
        </Form.Item>
        <Form.Item label="文件密级:" name="mj" >
          <Input style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="xxx:" name="doctbl" hidden initialValue={archStore.ktable?.bmc + "_FJ"} >
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="xx:" name="fileid" hidden>
          <Input disabled style={{ width: 180 }} />
        </Form.Item>

      </>
    )
  }

  // 表格按钮
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        <Tooltip title="修改" >
          <Button size="small" style={{ fontSize: '12px', color: '#08c', display: archStore.enablEdit ? 'block' : 'none' }} shape="circle" icon={<EditOutlined />} onClick={() => archStore.doEdit("edit", record, index, store)} />
        </Tooltip>
        <EpsUploadButton title={"附件信息"}                    // 组件标题，必填
          uploadProp={archStore.uploadProp}       //附件上传prop
          width={1200}
          source={archStore.fjsource}
          height={800}
          refesdata={refreshPage}
          grpid={record.filegrpid}
          mj={record.mj}
          fjs={record.fjs}
          tmzt={record.tmzt}
          customForm={upcustomForm}
          daktmid={record.id}
          onUploadClick={() => { console.log('abcef', record); return Promise.resolve({ 'wrkTbl': archStore.ktable?.bmc, 'docTbl': archStore.ktable?.bmc + "_FJ", 'docGrpTbl': archStore.ktable?.bmc + "_FJFZ", 'grpid': record.filegrpid, 'daktmid': record.id, 'tmzt': record.tmzt, 'dakid': archStore.dakid, 'atdw': SysStore.getCurrentUser().dwid, 'idvs': JSON.stringify({ id: record.id }), 'mj': '无密级' }); }}
          params={{ 'wrkTbl': archStore.ktable?.bmc, 'docTbl': archStore.ktable?.bmc + "_FJ", 'docGrpTbl': archStore.ktable?.bmc + "_FJFZ", 'grpid': record.filegrpid, 'daktmid': record.id, 'tmzt': record.tmzt, 'dakid': archStore.dakid, 'atdw': SysStore.getCurrentUser().dwid, 'idvs': JSON.stringify({ id: record.id }), 'mj': '无密级' }} //附件上传参数
          tableProp={archStore.uploadtableProp}     //附件列表prop
          tableService={wdglAttachdocService}  //附件列表server
          tableparams={{ 'wrkTbl': archStore.ktable?.bmc, 'doctbl': archStore.ktable?.bmc + "_FJ", 'grptbl': archStore.ktable?.bmc + "_FJFZ", 'grpid': record.filegrpid, 'daktmid': record.id }} //附件列表参数
        />
      </>
    );
  };




  // const customTableAction = (text, record, index, store) => {
  //   return (
  //     <>
  //       {[
  //         ActionOne(text, record, index, store),
  //         //   ActionTwo(text, record, index, store),
  //       ]}
  //     </>
  //   );
  // };


  useEffect(() => {

    if (archParams.bmc) {
      archStore.initArchInfo(archParams, props.ktable);
    }
  }, [props.ktable]);


  useEffect(() => {
    let storeTable = ref.current?.getTableStore();
    if (storeTable && props.fid && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, { fid: props.fid, ...props.archParams });
    }
  }, [props.fid]);


  useEffect(() => {
    let storeTable = ref.current?.getTableStore();
    if (!archStore.modalVisit) {
      refreshPage();
    }
  }, [archStore.modalVisit]);


  /**
   * 调用tableStreo save进行保存
   * @param values
   * @returns
   */
  const onSave = (values, modalType) => {
    if (modalType == "add") {
      const params = { dakid: archStore.dakid, mbid: props.ktable.mbid, tmzt: archStore.tmzt, ...values }
      let storeTable = ref.current?.getTableStore();
      return storeTable.save(params).then(res => {
        setSjdata(res.results);
        storeTable.findByKey('', 1, storeTable.size, { fid: props.fid, ...props.archParams });
      });
    } else if (modalType == "edit") {
      const params = { dakid: archStore.dakid, mbid: props.ktable.mbid, tmzt: archStore.tmzt, ...values }
      let storeTable = ref.current?.getTableStore();
      return storeTable.update(params).then(res => {
        storeTable.findByKey('', 1, storeTable.size, { fid: props.fid, ...props.archParams });
      });
    }
  }

  const title: ITitle = {
    name: "盒管理",
  };



  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false,
    isAsync: true,
    extend: localStorage.getItem(`dak-appraisal-manage-${window.btoa(archParams.dakid)}`) === 'true',
    onExtendChange: (value: boolean) => {
      localStorage.setItem(`dak-appraisal-manage-${window.btoa(archParams.dakid)}`, value)
    },
    treeExpand: () => (<GroupSelect archParams={archStore.archParams} archStore={archStore} loadData={async (val) => {
      const treeStore = ref.current?.getTreeStore();
      treeStore.treeList = [{ key: `root`, title: "全部", isLeaf: true }]
      await treeStore.findTree('', val)
      await treeStore.loadAsyncData({ key: val._key })
    }} ktable={archStore.ktable} yhid={dakoptService.yhid} />)
  };

  // const tableProp: ITable = {
  //   tableSearch: true,
  //   disableDelete: true,
  //   disableEdit: true,
  //   disableCopy: true,
  //   disableAdd: true,
  //   initSearchValue: '',
  //   actionColumnNum: 2,
  //   rowSelection: {
  //     type: "checkbox"

  //   },
  // };
  const urlhgl="/api/eps/control/main/hgl/openDak?path=hgl_dak&dakid="+archParams.dakid+"&mbid="+store.ktable?.mbid+"&bmc="+archParams.bmc+"&tmzt="+archParams.tmzt;

  return (
    <div style={{ height: '100%' }}>
    <iframe id="auxLcsp1" name="auxLcsp1"
             src={urlhgl} ></iframe>

    </div>
  );
});

export default ArchManageHgl;
