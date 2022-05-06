import { useEffect } from 'react';
import './index.less';
import {
  Button,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Divider,
  TreeSelect,
  message,
} from 'antd';
const { TextArea } = Input;
import { observer, Observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import detailService from './detailService';
import update from 'immutability-helper';
import moment from 'moment';
import EpsUpload from '@/eps/components/upload/EpsUpload/index.tsx';
import TableService from '../TableService';
import wdglAttachdocService from '../WdglAttachdocService';

import { ITable } from '@/eps/commons/declare';
import SysStore from '@/stores/system/SysStore';

const currentCmp: CmpInfoType = SysStore.getCurrentCmp();
const currentUser: UserInfoType = SysStore.getCurrentUser();

const EpsRecordForm = observer((props: any) => {
  const [form] = Form.useForm();

  const store = useLocalObservable(() => ({
    dwid: currentCmp?.id,
    // add edit view
    opt: 'add',
    mbid: props.mbid,
    bjkj: [],
    stflzd: [],
    cacheCombox: {},
    // 表单可见字段
    formFileds: [],
    // 下拉选项缓存
    cacheOptions: {},
    // record
    record: {},
    //grid
    sjgrpid: '',
    //上传按钮控制
    xUpPloadprop: {},
    //上传参数
    Uploadparam: {},
    // 缓存日期字段格式化
    dateFiledFomrmat: [],
    // 表名称
    bmc: props.bmc,
    // 缓存下拉关联的字段
    changezd: {},

    talbeparam: {},
    getDefaultParamValue: function (aKey = '') {
      switch (aKey.replace(/(^\s*)|(\s*$)/g, '').toLowerCase()) {
        case 'usrname':
          return currentUser.yhmc;
        case 'usrbh':
          return currentUser.bh;
        case 'curdate':
          return moment().format('YYYY-MM-DD');
        case 'curdatetime':
          return moment().format('YYYY-MM-DD HH:mm:ss');
        case 'curdatestr':
          return moment().format('YYYY-MM-DD HH');
        case 'curyearmonth':
          return moment().format('YYYY-MM');
        case 'curdatetimestr':
          return moment().format('YYYY-MM-DD HH:mm:ss');
        case 'usrid':
          return currentUser.id;
        case 'userid':
          return currentUser.id;
        case 'userbmid':
          return currentUser.bmid;
        case 'userbmmc':
          return currentUser.orgmc;
        case 'curyear':
          return moment(new Date()).format('YYYY');
        case 'curmonth':
          return moment(new Date()).format('MM');
        case 'curday':
          return moment(new Date()).format('DD');
        case 'curdakdwid':
          return currentCmp.id;
        case 'curdakdwbh':
          return currentCmp.dwbh;
        case 'curdakdwmc':
          return currentCmp.mc;
        case 'curdakqzh':
          return currentCmp.qzh;
        case 'curdwid':
          return currentCmp.id;
        case 'curdwbh':
          return currentCmp.dwbh;
        case 'curdwmc':
          return currentCmp.mc;
        case 'curdwqzh':
          return currentCmp.qzh;
        case 'curuserdwid':
          return currentCmp.id;
        case 'curuserdwbh':
          return currentCmp.dwbh;
        case 'curuserdwmc':
          return currentCmp.dwname;
        case 'curuserdwqzh':
          return currentCmp.qzh;
        default:
          return aKey;
      }
    },
    async loadOptions(name, url, czlx, params) {
      detailService.getOptions(url, params).then((options) => {
        if (Array.isArray(options)) {
          const optionArr = options.map((item) => {
            return {
              id: item.bh,
              title: item.mc,
              pid: '0',
              key: item.bh,
              isLeaf: true,
            };
          });
          // runInAction(() => {
          //   this.cacheCombox = update(this.cacheCombox, {
          //     $push: optionArr, //一定要 []号的形式哦，不可以 "a";
          //   });
          // })
          runInAction(() => {
            this.cacheCombox = update(this.cacheCombox, {
              [name]: {
                $set: optionArr, //一定要 []号的形式哦，不可以 "a";
              },
            });
          });
        }
      });
      // return [];
    },
    /**
     * 对动态kfields进行处理
     * @param kfields 动字段集合 Kfield.java
     * @returns {*}
     */
    async initFormKfileds(kfields, ktable) {
      var me = this;
      me.bjkj = [];
      me.stflzd = [];
      const formKfields = kfields
        .filter(function (o) {
          return o.kpkj == 'Y';
        })
        .sort(function (a, b) {
          return (a['kpsxh'] - b['kpsxh']) * 1000 + (a['kpsxl'] - b['kpsxl']);
        })
        .map(function (kfield) {
          let rules = [];
          console.log('formKfield', kfield);
          var fmc = kfield['mc'].toLowerCase();
          var ctrlcfg = {};
          ctrlcfg['width'] = kfield['kpkd'];
          ctrlcfg['name'] = fmc;
          ctrlcfg['options'] = [];
          ctrlcfg['componentType'] = kfield['kjlx'] || kfield['fieldlx'];
          ctrlcfg['readonly'] = kfield['zdx'];
          if (kfield['blx'] == 'Y') {
            rules.push({
              required: true,
              message: `【${kfield['ms']}】必填`,
            });
          }
          ctrlcfg['comboxType'] = kfield['cz'];
          ctrlcfg['fieldLabel'] = kfield['ms'];
          ctrlcfg['kpsxls'] = kfield['kpsxls'];
          ctrlcfg['kpkd'] = kfield['kpkd'];
          ctrlcfg['fgms'] = kfield['fgms'];
          if (kfield['qsz']) {
            ctrlcfg['qsz'] = me.getDefaultParamValue(kfield['qsz']);
          }
          ctrlcfg['emptyText'] = kfield['yqztx'];
          if (kfield.sxid == 'SX108') {
            // me.changezd.sx108 = kfield.mc.toLowerCase();
            // ctrlcfg["componentType"] = "OB";
            // ctrlcfg["onbuttonclick"] = "selectYhList"
          }
          if (kfield['bjkj'] == 'Y') {
            var bjkjlist = { name: fmc };
            me.bjkj.push(bjkjlist);
          }
          if (kfield.sxid == 'SX07') {
            me.changezd.sx07 = kfield.mc.toLowerCase();
          }

          switch (kfield['kjlx']) {
            case 'C':
              ctrlcfg['etype'] = 'f1text';
              ctrlcfg['flcallback'] = function (obj) {
                //  ownerform.codehelpcallback(obj)
              };
              if (kfield['cd'] && kfield['cd'] > 1) {
                if (kfield['sfxzcd'] == 'Y') {
                  rules.push({
                    required: true,
                    message: `${kfield['ms']}必填`,
                  });
                  rules.push({
                    len: kfield['xzcdws'],
                    message:
                      kfield['ms'] + '：请输入' + kfield['xzcdws'] + '个字符',
                  });
                  ctrlcfg['vtype'] =
                    'rangeLength:' + kfield['xzcdws'] + ',' + kfield['xzcdws'];
                  ctrlcfg['rangeLengthErrorText'] =
                    kfield['ms'] + '：请输入' + kfield['xzcdws'] + '个字符';
                } else {
                  ctrlcfg['vtype'] = 'maxLength:' + kfield['cd'];
                  rules.push({
                    max: kfield['cd'],
                    message:
                      kfield['ms'] + '：请输入' + kfield['xzcdws'] + '个字符',
                  });
                  ctrlcfg['errtext'] =
                    kfield['ms'] + '：不能超过' + kfield['cd'] + '个字符';
                }
              }
              break;
            case 'L':
              ctrlcfg['czlx'] = kfield['czlx'];
              if (kfield['xlkksr'] == 'Y') {
                ctrlcfg['allowInput'] = 'true';
              } else {
                ctrlcfg['allowInput'] = 'false';
              }
              if (kfield['cz'] == 'Y') {
                if (kfield['czlx'] == '2') {
                  //实体分类
                  //ctrlcfg["etype"] = "treecombo";
                  var stlfTemp = {};

                  if (kfield['stflyyfs'] == '1') {
                    ctrlcfg['valueField'] = 'id';
                    ctrlcfg['textField'] = 'text';
                    stlfTemp['textField'] = 'bh';
                  } else {
                    ctrlcfg['valueField'] = 'id';
                    ctrlcfg['textField'] = 'text';
                    stlfTemp['textField'] = 'mc';
                  }
                  //ctrlcfg["rootVisible"] = false;
                  if (kfield.gl == 'Y') {
                    var vc = 'id';
                    if (kfield.stflyyfs == '1') {
                      vc = 'bh';
                    } else {
                      vc = 'mc';
                    }
                    ctrlcfg['onvaluechanged'] =
                      "onstflvaluechanged('" +
                      kfield.mc +
                      "','" +
                      kfield.glzlx +
                      "')";
                  }
                  // stlfTemp.name = fmc;
                  // me.stflzd.push(stlfTemp);
                  // ctrlcfg["parentField"] = "fid";

                  ctrlcfg['url'] =
                    '/api/eps/control/main/stflmx/queryForPage?flid=' +
                    kfield['czstfl'] +
                    '&mbid=' +
                    ktable.mbid +
                    '&dw=' +
                    me.dwid +
                    '&mbzlxmc=' +
                    kfield['mc'];
                  //  ctrlcfg["options"] = store.getOptions(kfield["czlx"], []);
                  //ctrlcfg["params"]=[]
                  me.loadOptions(fmc, ctrlcfg['url'], '', {});
                } else if (kfield['czlx'] == '3') {
                  //组织机构
                  //ctrlcfg["etype"] = "treecombo";
                  var zzjgTemp = {};
                  // if (kfield["zzjgyyfs"] == "1") {
                  //   ctrlcfg["valueField"] = "id";
                  //   ctrlcfg["textField"] = "code";
                  //   zzjgTemp["textField"] = "code";
                  // } else if (kfield["zzjgyyfs"] == "2") {
                  //   ctrlcfg["valueField"] = "id";
                  //   ctrlcfg["textField"] = "name";
                  //   zzjgTemp["textField"] = "name";
                  // } else {
                  //   ctrlcfg["valueField"] = "node";
                  //   ctrlcfg["textField"] = "code";
                  //   zzjgTemp["textField"] = "code";
                  // }
                  // me.zzjgzd = [];
                  // zzjgTemp.name = fmc;
                  // me.zzjgzd.push(zzjgTemp);
                  // ctrlcfg["rootVisible"] = false;
                  // ctrlcfg["parentField"] = "fid";
                  ctrlcfg['url'] =
                    '/api/eps/control/main/org/queryDwOrgTree?dwid=' + me.dwid;
                  me.loadOptions(fmc, ctrlcfg['url'], '', {});
                  // me.loadOptions(ctrlcfg["url"],"",{});
                  // me.treeBox.push(fmc);
                } else if (kfield['czlx'] == '5' && kfield['sxid'] == 'SX02') {
                  ctrlcfg['etype'] = 'combo';
                  if (!me.cacheCombox[fmc]) {
                    //   me.cacheCombox[fmc] = mini.JSON.encode(me.getFieldInfo(kfield));
                  }
                  var qzh = kfields.filter(function (o) {
                    return o.sxid == 'SX01';
                  });
                  ctrlcfg['onvaluechanged'] =
                    "onYhdwchange('" + kfield.mc + "','" + qzh[0].mc + "')";
                  ctrlcfg['componentType'] = 'S';
                  ctrlcfg['textField'] = kfield['sjzdyyfs'] = 'dwname';
                  ctrlcfg['valueField'] = 'dwname';
                  ctrlcfg['onvalidation'] = 'onvalidation';
                } else {
                  // ctrlcfg["etype"] = "combo";
                  // if (!me.cacheCombox[fmc]) {
                  //   me.cacheCombox[fmc] = mini.JSON.encode(me.getFieldInfo(kfield));
                  // }
                  // if (kfield.gl == "Y") {
                  //   var vc = "id";
                  //   if (kfield.sjzdyyfs == "1") {
                  //     vc = "bh";
                  //   } else {
                  //     vc = "mc";
                  //   }
                  //   ctrlcfg["onvaluechanged"] = "onvaluechanged('" + kfield.mc + "','" + kfield.glzlx + "','" + vc + "','" + kfield.czsjzd + "')"
                  // }
                  // ctrlcfg["componentType"] = "S";
                  // ctrlcfg["textField"] = kfield["sjzdyyfs"] = "item";
                  // ctrlcfg["valueField"] = "value";
                  // ctrlcfg["onvalidation"] = "onvalidation";
                  ctrlcfg['url'] = '/api/eps/control/main//sjzdmx/queryForList';
                  me.loadOptions(fmc, ctrlcfg['url'], kfield['czlx'], {
                    fid: kfield['czsjzd'],
                  });
                }
              } else {
                // ctrlcfg["etype"] = "f1text";
                // ctrlcfg["flcallback"] = function (obj) {
                //   ownerform.codehelpcallback(obj)
                // };
              }
              break;
            case 'N':
              debugger;
              ctrlcfg['etype'] = 'number';
              break;
            case 'D':
              if (kfield.sxid == 'SX105') {
                // me.changezd.sx105 = kfield.mc.toLowerCase();
              }
              ctrlcfg['etype'] = 'date';
              ctrlcfg['format'] = 'YYYY-MM-DD';
              if (kfield['gsh']) {
                ctrlcfg['format'] = kfield['gsh'];
                switch (kfield['gsh']) {
                  case 'YYYY':
                    ctrlcfg['format'] = 'YYYY';
                    break;
                  case 'YYYYMM':
                    ctrlcfg['format'] = 'YYYYMM';
                    break;
                  case 'YYYYMMDD':
                    ctrlcfg['format'] = 'YYYYMMDD';
                    break;
                }
              }
              me.dateFiledFomrmat.push(kfield);
              if (kfield['dqzhrq'] == 'Y') {
                ctrlcfg['ondrawdate'] = 'onDrawDate';
              }
              break;
            case 'T':
              ctrlcfg['etype'] = 'datetime';
              ctrlcfg['format'] = 'YYYY-MM-DD H:mm';
              ctrlcfg['timeFormat'] = 'H:mm';
              if (kfield['gsh']) {
                switch (kfield['gsh']) {
                  case 'YYYY':
                    ctrlcfg['format'] = 'yyyy';
                    break;
                  case 'YYYYMM':
                    ctrlcfg['format'] = 'yyyy-MM';
                    break;
                  case 'YYYYMMDD':
                    ctrlcfg['format'] = 'yyyy-MM-dd';
                    break;
                  default:
                    ctrlcfg['format'] = 'yyyy-MM-dd H:mm';
                    break;
                }
              }
              me.dateFiledFomrmat.push(kfield);
              if (kfield['dqzhrq'] == 'Y') {
                ctrlcfg['ondrawdate'] = 'onDrawDate';
              }
              break;
            case 'CB':
              ctrlcfg['etype'] = 'f1text';
              if (kfield.sxid == 'SX104') {
                var sxrqzd = kfields.filter(function (o) {
                  return o.sxid == 'SX105';
                });
                ctrlcfg['onvaluechanged'] =
                  "onSxrqchanged('" +
                  kfield.mc +
                  "','" +
                  sxrqzd[0].mc +
                  "','" +
                  ctrlcfg['valueField'] +
                  "')";
                // me.changezd.sx104 = kfield.mc.toLowerCase();
              }
              break;
            case 'O':
            // ctrlcfg["etype"] = "f1text";
            // if (!me.cacheCombox[fmc]) {
            //   me.cacheCombox[fmc] = mini.JSON.encode(me.getFieldInfo(kfield));
            // }
            // ctrlcfg["textField"] = kfield["sjzdyyfs"] = "value";
            // ctrlcfg["valueField"] = kfield["sjzdyyfs"] == "1" ? "bh" : "mc";
            // break;
            case 'M':
            // ctrlcfg["etype"] = "f1text";
            // if (!me.cacheCombox[fmc]) {
            //   me.cacheCombox[fmc] = mini.JSON.encode(me.getFieldInfo(kfield));
            // }
            // ctrlcfg["textField"] = kfield["sjzdyyfs"] = "value";
            // ctrlcfg["valueField"] = kfield["sjzdyyfs"] == "1" ? "bh" : "mc";
            // me.btnEdit.push(fmc);
            // break;
            default:
            // ctrlcfg["etype"] = "f1text";
            // ctrlcfg["flcallback"] = function (obj) {
            //   ownerform.codehelpcallback(obj)
            // };
            // if (kfield["cd"] && kfield["cd"] > 1) {
            //   if (kfield["sfxzcd"] == "Y") {
            //     ctrlcfg["vtype"] = "maxLength:6:" + kfield["xzcdws"];
            //     ctrlcfg["errtext"] = kfield["ms"] + "：不能超过" + kfield["xzcdws"] + "个字符";
            //   } else {
            //     ctrlcfg["vtype"] = "maxLength:" + kfield["cd"];
            //     ctrlcfg["errtext"] = kfield["ms"] + "：不能超过" + kfield["cd"] + "个字符";
            //   }

            // }
          }
          if (kfield['xdx'] == 'Y') {
            ctrlcfg['canreset'] = false;
            //me.xdx.push(fmc)
          }
          if (rules.length > 0) {
            ctrlcfg.rules = rules;
          }
          return ctrlcfg;
          // return genEpsVcl(ctrlcfg)
        });
      runInAction(() => {
        console.log('formFileds', formKfields);
        this.formFileds = formKfields;
      });
    },
    async inittableParam(ktable) {
      this.talbeparam = {
        wrkTbl: props.bmc,
        doctbl: props.bmc + '_FJ',
        grptbl: props.bmc + '_FJFZ',
        grpid: '',
      };
    },
    async getfjGuid() {
      const guid = await TableService.getGuid();
      this.sjgrpid = guid.message;
    },
  }));

  /**
   * 上传组件prop
   */

  //附件列表信息
  const uploadtableProp: ITable = {
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    labelColSpan: 8,
    tableSearch: false,
    rowSelection: {
      type: 'radio',
    },
    searchCode: 'title',
  };

  useEffect(() => {
    if (props.detailVisible && store.formFileds.length < 1) {
      form.resetFields();
      console.log('edit-open');
      store.initFormKfileds(props.kfields, props.ktable);
      store.xUpPloadprop = props.uploadprop;
      store.inittableParam(props.ktable);
    }
    if (props.modalType === 'add') {
      form.resetFields();
      runInAction(() => {
        props.uploadprop.disableUpload = true;
        props.uploadprop.disableBigUpload = true;
        store.sjgrpid = props.grpid;
        store.xUpPloadprop = props.uploadprop;
        store.talbeparam = {
          wrkTbl: props.bmc,
          doctbl: props.bmc + '_FJ',
          grptbl: props.bmc + '_FJFZ',
          grpid: '111',
        };
        // store.Uploadparam={'wrkTbl': props.ktable.bmc, 'docTbl': props.ktable.bmc + "_FJ", 'docGrpTbl': props.ktable.bmc + "_FJFZ", 'daktmid': props.saveData?.id, 'tmzt': props.tmzt, 'dakid': props.ktable.id, 'atdw': currentCmp?.id, 'idvs': JSON.stringify({ id: props.saveData?.id }), 'mj': props.saveData?.mj };
      });
    }
  }, [props.detailVisible, store.formFileds]);
  useEffect(() => {}, [props.modalType, props.grpid]);
  useEffect(() => {
    if (props.detailVisible) {
      runInAction(() => {
        props.uploadprop.disableUpload = false;
        props.uploadprop.disableBigUpload = false;
        store.xUpPloadprop = props.uploadprop;
        if (props.saveData?.filegrpid != undefined) {
          store.sjgrpid = props.editRecord.filegrpid;
        } else {
          store.getfjGuid();
        }
        store.Uploadparam = {
          wrkTbl: props.bmc,
          docTbl: props.bmc + '_FJ',
          docGrpTbl: props.bmc + '_FJFZ',
          grpid: store.sjgrpid,
          daktmid: props.saveData?.id,
          tmzt: props.tmzt,
          dakid: props.ktable.id,
          atdw: currentCmp?.id,
          idvs: JSON.stringify({ id: props.saveData?.id }),
          mj: props.saveData?.mj,
        };
        store.talbeparam = {
          wrkTbl: props.bmc,
          doctbl: props.bmc + '_FJ',
          grptbl: props.bmc + '_FJFZ',
          grpid: store.sjgrpid,
        };
      });
    }
  }, [props.saveData]);
  const validFormat = function (inputFormat) {
    //var validation = moment(moment('2017-06-17').format(inputFormat)).inspect();
    var validation = moment(inputFormat).format('YYYY-MM-DD');
    if (validation.indexOf('invalid') < 0) return true;
    else return false;
  };
  useEffect(() => {
    if (props.detailVisible) {
      let record = update(props.editRecord, {
        $set: props.editRecord,
      });
      store.dateFiledFomrmat.forEach((kfield) => {
        if (props.editRecord[kfield.mc.toLowerCase()]) {
          if (!validFormat(props.editRecord[kfield.mc.toLowerCase()])) {
            record[kfield.mc.toLowerCase()] = undefined;
          } else {
            const dateValue = moment(
              props.editRecord[kfield.mc.toLowerCase()],
              kfield.gsh,
            );
            record[kfield.mc.toLowerCase()] = dateValue;
          }
        }
      });
      // const record=store.dateFiledFomrmat()
      form.setFieldsValue(record);
      //处理日期
      if (record?.id) {
        runInAction(() => {
          props.uploadprop.disableUpload = false;
          if (record?.filegrpid != undefined) {
            store.sjgrpid = record.filegrpid;
          } else {
            store.getfjGuid();
          }
          store.xUpPloadprop = props.uploadprop;
          store.Uploadparam = {
            wrkTbl: props.bmc,
            docTbl: props.bmc + '_FJ',
            docGrpTbl: props.bmc + '_FJFZ',
            grpid: store.sjgrpid,
            daktmid: record?.id,
            tmzt: props.tmzt,
            dakid: props.ktable.id,
            atdw: currentCmp?.id,
            idvs: JSON.stringify({ id: record?.id }),
            mj: record?.mj,
          };
          store.talbeparam = {
            wrkTbl: props.bmc,
            doctbl: props.bmc + '_FJ',
            grptbl: props.bmc + '_FJFZ',
            grpid: store.sjgrpid,
          };
          console.log('w22', store.Uploadparam);
        });
      }
    }
  }, [props.editRecord?.id, props.detailVisible]);

  const formItemLayout = {
    colon: false,
    labelCol: {
      span: 8,
    },
  };

  const data = [];
  for (let i = 0; i < 50; i++) {
    let obj = {
      key: i + 1,
      order: i + 1,
      title: '测试标题' + i + 1,
      f_name: '文件一',
      f_type: 'pdf',
      f_size: '1.37M',
      trans: '',
    };
    i % 3 === 0 ? (obj.trans = '转换失败') : (obj.trans = '未转换');
    data.push(obj);
  }

  /**
   *
   * @param item
allowInput: "false"
comboxType: "Y"
componentType: "L"
emptyText: undefined
fgms: " "
fieldLabel: "机构(问题)"
kpkd: 200
kpsxls: 1
name: "jgwt"
readonly: "N"
require: "N"
textField: "text"
valueField: "id"
 this.miniType = {
            L: "mini-treeselect",
            S: "mini-combobox",
            C: "mini-textbox",
            D: "mini-datepicker",
            N: "mini-spinner",
            T: "mini-datepicker",
            B: "mini-textarea",
            O: "mini-checkboxlist",
            CB: "mini-checkbox",
            OB: "mini-buttonedit",
            M: "mini-buttonedit",
            H: "mini-hidden"
        };
   * @returns
   */

  const getInitialValue = (item) => {
    return props.modalType == 'edit' ? undefined : item.qsz;
  };
  const createFormItem = (item) => {
    // console.log("store.cacheCombox", store.cacheCombox)
    console.log('items-formfield', item.url, item);

    if (item.componentType == 'C') {
      return (
        <Col span={6}>
          <Form.Item
            initialValue={getInitialValue(item)}
            label={item.fieldLabel}
            name={item.name}
            rules={item.rules}
            disabled={item.readonly == 'Y' ? true : false}
          >
            <Input placeholder={item.fieldLabel} />
          </Form.Item>
        </Col>
      );
    } else if (item.comboxType == 'Y') {
      return (
        <Col span={6}>
          <Form.Item
            initialValue={getInitialValue(item)}
            label={item.fieldLabel}
            name={item.name}
            rules={item.rules}
            disabled={item.readonly == 'Y' ? true : false}
          >
            <TreeSelect
              placeholder={item.fieldLabel}
              treeData={store.cacheCombox[item.name]}
              loadData={store.loadOptions}
            />
          </Form.Item>
        </Col>
      );
    } else if (item.componentType == 'D') {
      return (
        <Col span={6}>
          <Form.Item
            initialValue={undefined}
            label={item.fieldLabel}
            name={item.name}
            rules={item.rules}
          >
            <DatePicker format={item.format} />
          </Form.Item>
        </Col>
      );
    } else if (item.componentType == 'B') {
      return (
        <Col span={6}>
          <Form.Item
            initialValue={getInitialValue(item)}
            required
            label={item.fieldLabel}
            name={item.name}
            rules={item.rules}
          >
            <TextArea />
          </Form.Item>
        </Col>
      );
    } else if (item.componentType == 'N') {
      return (
        <Col span={6}>
          <Form.Item
            initialValue={getInitialValue(item)}
            required
            label={item.fieldLabel}
            name={item.name}
            rules={item.rules}
          >
            <InputNumber />
          </Form.Item>
        </Col>
      );
    }
    {
      /* <ProFormText width="md" name={item.name} label={item.fieldLabel}/> */
    }
  };

  const onSave = () => {
    form
      .validateFields()
      .then((values) => {
        debugger;
        store.dateFiledFomrmat.forEach((kfield) => {
          if (values[kfield.mc.toLowerCase()]) {
            values[kfield.mc.toLowerCase()] = values[
              kfield.mc.toLowerCase()
            ].format('YYYY-MM-DD hh:mm:ss');
          }
        });
        if (props.modalType === 'add' && !props?.editRecord?.id) {
          props.onSave(values, props.modalType);
        } else {
          const filter = { ...values, id: props.editRecord.id };
          props.onSave(filter, props.modalType);
        }
      })
      .catch((info) => {
        console.log(info);
        message.error(`操作失败,请检查数据!`);
      });
  };

  return (
    <div className="detail-oa">
      <Drawer
        visible={props.detailVisible}
        placement="top"
        closable={false}
        destroyOnClose={true}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <p className="title">编辑</p>
        <div className="detail-content">
          <div className="sec-title">
            <span className="title-icon"></span>著录项
            <div className="control-btns">
              <Button
                type="primary"
                onClick={onSave}
                style={{ marginRight: 20 }}
              >
                保存
              </Button>
              <Button
                onClick={() => {
                  props.handleClose();
                }}
              >
                关闭
              </Button>
            </div>
          </div>
          <div className="form-content">
            <Form form={form} {...formItemLayout}>
              <Row gutter={20}>
                {store.formFileds.map((item) => createFormItem(item))}
              </Row>
            </Form>
          </div>
          <div className="sec-title">
            <span className="title-icon"></span>附件
          </div>
          <div style={{ height: '300px' }}>
            <EpsUpload
              title={'附件信息'}
              uploadProp={store.xUpPloadprop} //附件上传prop
              width={props.width}
              source={props.fjsource}
              tableProp={uploadtableProp} //附件列表prop
              tableService={wdglAttachdocService} //附件列表server
              grpid={store.sjgrpid} //附件列表参数
              tmzt={props.tmzt} //附件列表参数
              params={store.Uploadparam} //附件上传参数
              tableparams={store.talbeparam} //附件列表参数
            ></EpsUpload>
          </div>
        </div>
      </Drawer>
    </div>
  );
});

export default EpsRecordForm;
