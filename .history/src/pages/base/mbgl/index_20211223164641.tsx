import React, {useEffect, useRef, useState} from 'react';
import {EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable} from '@/eps/commons/declare';
import {Form, Input, Select, TreeSelect,Modal,message, Checkbox} from 'antd';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import {observer, useLocalObservable} from 'mobx-react';
import mbglService from "@/services/base/mbgl/MbglService";
import DwTableLayout from '@/eps/business/DwTableLayout';
import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import {ControlTwoTone, SelectOutlined, UploadOutlined} from "@ant-design/icons";
import { runInAction } from 'mobx';
import qs from "qs";
import ArchMenuAction from "@/pages/dagl/Dagl/AppraisaManage/ArchMenuAction";


const FormItem = Form.Item;


const Mbgl = observer((props) => {
  const [visible, setMbzlxvisible] =useState(false);
  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const LxList = [{value: "01", item: "一文一件"},
    {
      value: "02",
      item: "传统立卷"
    },
    {
      value: "0201",
      item: "卷内"
    },
    {
      value: "03",
      item: "工程一文一件"
    },
    {
      value: "0301",
      item: "工程一文一件"
    },
    {
      value: "04",
      item: "工程传统立卷"
    }, {
      value: "0401",
      item: "工程案卷"
    },
    {
      value: "040101",
      item: "工程卷内"
    }];

    const eepmblxList = [{value: 0, label: "一文一件"},
    {
      value: 1,
      label: "传统立卷"
    },
    {
      value: 2,
      label: "党政机关一文一件"
    },
    {
      value: 3,
      label: "会计档案一文一件"
    },
    {
      value: 4,
      label: "财务档案传统立卷"
    },
    {
      value: 5,
      label: "苏州地铁传统立卷"
    },{
      value: 6,
      label: " 中交二公局一文一件"
    }];

    const eepmbtypeList = [{value: 0, label: "标准版(T48)"},
    {
      value: 1,
      label: "档案库版"
    }];


  const handleSfdywChange = value => {
    if (value == 'Y') {
      mbglStore.ywftstate = false;
    }
  };

  /**
   * childStore
   */
  const archParams: ArchParams = props.archParams;
  const mbglStore = useLocalObservable(() => (
    {
      params: {},
      dwTreeData: [],
      dwData: [],
      lbData: [],
      dywstflData: [],
      ywftstate: true,
      // 参数
      archParams,
      // 点击的菜单action
      menuActionItem: {},
      // 档案库opt
      dakopt: [],
      // tmzt
      //
      optcode: "",
      //
      useIframe: true,
      //
      menuProp:[{
        title: '著录项管理',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbzlx/mbzlxgl?${qs.stringify(filter)}`, params: filter, title: "模板著录项",filter, width: 1300, height: 550 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '多业务著录项',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/dywmbzlx/mbzlxgl?${qs.stringify(filter)}`, params: filter, title: "多业务模板著录项",filter, width: 1300, height: 550 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '固定分组管理',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mb/gdfzgl?${qs.stringify(filter)}`, params: filter, title: "固定分组", filter,width: 1000, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '档号规则设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbgz/dhgzsz?${qs.stringify(filter)}`, params:filter, title: "档号规则设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '归档分组设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbfz/gdfzsz?${qs.stringify(filter)}`, params:filter, title: "归档分组设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '盒号规则设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbgz/hhgzsz?${qs.stringify(filter)}`, params:filter, title: "盒号规则设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '盒号分组设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbfz/hhfzsz?${qs.stringify(filter)}`, params:filter, title: "盒号分组设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '排序设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbpx/pxsz?${qs.stringify(filter)}`, params:filter, title: "排序设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '查询条件',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbcx/cxtj?${qs.stringify(filter)}`, params:filter, title: "查询条件",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '流程分组管理',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/lcfz/lcfzgl?${qs.stringify(filter)}`, params:filter, title: "流程分组管理",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '唯一性设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbwyx/wyxsz?${qs.stringify(filter)}`, params:filter, title: "唯一性设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '报表设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mb/bb?${qs.stringify(filter)}`, params:filter, title: "报表设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '页数转页次',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/sxjcsz/sxjcsz?${qs.stringify(filter)}`, params:filter, title: "页数转页次",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '公式计算',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/mbgsjs/gsjs?${qs.stringify(filter)}`, params:filter, title: "公式计算",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }, {
        title: '四性检测规则设置',
        icon: "icon_import_white",
        onClick: (ids, store, records) => {
          if (records.length <= 0) {
            message.warning({ type: 'warning', content: '请选择条目信息' });
            return ;
          }
          const filter =  {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
          mbglStore.doArchAction(records,{ url: `/api/eps/control/main/sxjcsz/sxjcsz?${qs.stringify(filter)}`, params:filter, title: "四性检测规则设置",filter, width: 1200, height: 520 })
        },
        params: {},
        color: "#CFA32A",
        toolbarShow: false,
      }],
      // 菜单按钮
      menuButton: [],
      // 获取档案按钮权限
      modalVisit: false,
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

      async queryTreeDwList() {
        // if (!this.dwData || this.dwData.length === 0) {
        const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
        if (response.status === 200) {
          var sjData = [];
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id
              newKey.title = newKey.mc
              sjData.push(newKey)
            }
            this.dwTreeData = sjData;
          }
          return;
        }
        // }
      },

      async queryLbList() {
        // if (!this.dwData || this.dwData.length === 0) {
        const response = await fetch.get(`/api/eps/control/main/sjzdmx/queryForList?fid=SJZD020`);
        if (response.status === 200) {
          var sjData = [];
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id
              newKey.value = newKey.id
              newKey.label = newKey.bh + "|" + newKey.mc
              newKey.mc = newKey.mc
              sjData.push(newKey)
            }
            this.lbData = sjData;
          }
          return;
        }
        // }
      },
      async queryDwList() {
        // if (!this.dwData || this.dwData.length === 0) {
        const response = await fetch.get(`/api/eps/control/main/dw/queryForList`);
        if (response.status === 200) {
          var sjData = [];
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id
              newKey.value = newKey.id
              newKey.label = newKey.mc
              sjData.push(newKey)
            }
            this.dwData = sjData;
          }
          return;
        }
        // }
      },
      async queryDywstflList() {
        // if (!this.dwData || this.dwData.length === 0) {
        const response = await fetch.get(`/api/eps/control/main/stflwh/queryForList`);
        if (response.status === 200) {
          var sjData = [];
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id
              newKey.value = newKey.id
              newKey.label = newKey.mc
              sjData.push(newKey)
            }
            this.dywstflData = sjData;
          }
          return;
        }
        // }
      },
      setModalVisit(visit: boolean) {
        this.modalVisit = visit;
      },
      async doArchAction(records,gnInfo)  {
        window._paramCache = {dwid:records[0].dwid,mbid:records[0].id,E9:"1"};
        const archModalInfo =gnInfo;
        runInAction(() => {
          mbglStore.optcode = "";
          mbglStore.modalHeight = archModalInfo.height;
          mbglStore.modalWidth = archModalInfo.width;
          mbglStore.selectRecords = records;
          mbglStore.ids = "";
          if (archModalInfo.showFoot == true) {
            mbglStore.showFoot = true;
          } else {
            mbglStore.showFoot = false;
          }
          if (archModalInfo.useIframe == false) {
            mbglStore.useIframe = false;
          } else {
            mbglStore.useIframe = true;
          }
          mbglStore.modalTitle = archModalInfo.title;
          mbglStore.modalVisit = !archModalInfo.disableModal;
          mbglStore.optcode =  "";
          mbglStore.menuActionItem = "";
          mbglStore.modalUrl = archModalInfo.url;
          mbglStore.archModalInfo = archModalInfo;
        })
      },
    }
  ));


  const tableProp: ITable = {
    tableSearch: false,
    disableIndex: true,
    onEditClick:(form, record) =>{
      if(record.by=="Y"){
        record.by= true;
      }else{
        record.by= false;
      }
      if(record.sfdyw=="Y"){
        record.sfdyw= true;
      }else{
        record.sfdyw= false;
      }
      form.setFieldsValue(record);
    },
  }



  // 自定义表单


  const customForm = () => {

    return (
      <>

        <Form.Item label="单位:" name="dw" required>

          <TreeSelect style={{width: 300}}
                      treeData={mbglStore.dwData}
                      placeholder="请选择单位"
                      treeDefaultExpandAll
                      allowClear
          />


        </Form.Item>
        <Form.Item label="编号:" name="bh" required rules={[{required: true, message: '请输入编号'}]}>
          <Input allowClear style={{width: 300}}/>
        </Form.Item>
        <Form.Item label="名称:" name="mc" required rules={[{required: true, message: '请输入名称'}]}>
          <Input allowClear style={{width: 300}}/>
        </Form.Item>
        <Form.Item label="类别:" name="lb" required>
          <Select
            style={{width: 300}}
            placeholder="请选择"
          >
            {
              mbglStore.lbData && mbglStore.lbData.map(item => (
                <Option key={item.value} title={item.label}>{item.label}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="类型:" name="lx" required>
          <Select
            style={{width: 300}}
            placeholder="请选择"

          >
            {
              LxList && LxList.map(item => (
                <Option key={item.value} title={item.item}>{item.item}</Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item label="对应数据包模板类型:" name="eepmbtype" required>
          <Select placeholder="请选择" options={eepmbtypeList} style={{ width: 300}} />
          {/* <Select
            style={{width: 300}}
            placeholder="请选择"

          >
            {
              eepmbtypeList && eepmbtypeList.map(item => (
                <Option key={item.value} title={item.item}>{item.item}</Option>
              ))
            }
          </Select> */}
        </Form.Item>
        <Form.Item label="对应数据包模版结构:" name="eepmblx" required>
        <Select placeholder="请选择" options={eepmblxList} style={{ width: 300}} />
          {/* <Select
            style={{width: 300}}
            placeholder="请选择"

          >
            {
              eepmblxList && eepmblxList.map(item => (
                <Option key={item.value} title={item.item}>{item.item}</Option>
              ))
            }
          </Select> */}
        </Form.Item>
        <Form.Item label="编研:" valuePropName="checked" name="by">
            <Checkbox  style={{width:  300}}/>
        </Form.Item>

        <Form.Item label="启用多业务模式:" valuePropName="checked" name="sfdyw">
            <Checkbox  style={{width:  300}}/>
        </Form.Item>
        <Form.Item label="业务分组:" name="dywstfl">
          <Select
            style={{width: 300}}
            placeholder="请选择"
            disabled={mbglStore.ywftstate}
          >
            {
              mbglStore.dywstflData && mbglStore.dywstflData.map(item => (
                <Option key={item.value} title={item.mc}>{item.mc}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="维护人:" name="whr">
          <Input disabled defaultValue={yhmc} style={{width: 300}}/>
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj">
          <Input disabled defaultValue={getDate} style={{width: 300}}/>
        </Form.Item>

        {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
      </>
    )
  }


  const [initParams, setInitParams] = useState({})
  const ref = useRef();

  useEffect(() => {
    mbglStore.queryDwList();
    mbglStore.queryLbList();
    mbglStore.queryDywstflList();
  }, []);

  const source: EpsSource[] = [

    {
      title: '编号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '名称',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '类别',
      code: 'lb',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < mbglStore.lbData.length; i++) {
          var lb = mbglStore.lbData[i];
          if (lb.value === text) {
            return lb.mc;
          }
        }
      }
    },
    {
      title: '类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < LxList.length; i++) {
          var lx = LxList[i];
          console.log("lx", lx);
          if (lx.value === text) {
            return lx.item;
          }
        }
      }
    },
    {
      title: '对应数据包模板类型',
      code: 'eepmbtype',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < eepmbtypeList.length; i++) {
          var lx = eepmbtypeList[i];
          if (lx.value === text) {
            return lx.label;
          }
        }
      }
    },
    {
      title: '对应数据包模版结构',
      code: 'eepmblx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < eepmblxList.length; i++) {
          var lx = eepmblxList[i];
          if (lx.value === text) {
            return lx.label;
          }
        }
      }
    },
    {
      title: '编研',
      code: 'by',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        if (text) {
          return text == 'Y' ? '是' : '否';
        }

      }
    },

    {
      title: '启用多业务模式',
      code: 'sfdyw',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        if (text) {
          return text == 'Y' ? '是' : '否';
        }

      }
    },
    {
      title: '业务分组',
      code: 'dywstfl',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '模板管理'
  }

  const umid = "JC012";

  const searchFrom = () => {
    return (
      <>
        <FormItem label="名称" className="form-item" name="mc">
          <Input placeholder="请输入名称" className="ant-input"/>
        </FormItem>

      </>
    )
  }


  /**
   * 查询
   * @param {*} current
   */
  /*    const OnSearch = (values: any, store: EpsTableStore) => {
          store && store.findByKey(store.key, 1, store.size, values);
      };*/

  // 自定义查询按钮
  const customAction = (store: EpsTableStore) => {
    return ([
     // <EpsModalButton name="跳转到设置" title="跳转到设置" width={1200} useIframe={true} icon={<ControlTwoTone/>}/>

    ])
  }
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {[
          <EpsModalButton key={record.id} isIcon={true} title="导出" width={1150} height={400} name="导出"
                          beforeOpen={(value) => {
                            var rowJn;
                            if (record.children != null) {
                              rowJn = record.children[0];
                            }
                            if (rowJn != null) {
                              window.location.href = "/api/eps/control/main/mbsz/exportFile?id=" + record.id + "&mc=" + record.mc + "&jnId=" + rowJn.id + "&jnMc=" + rowJn.mc;
                            } else {
                              window.location.href = "/api/eps/control/main/mbsz/exportFile?id=" + record.id + "&mc=" + record.mc;
                            }
                          }}
                          icon={<UploadOutlined/>}>
          </EpsModalButton>,
          <EpsModalButton key={record.id} isIcon={true} title="导入" width={1150} height={400} name="导入"
                          beforeOpen={(value) => {
                            var rowJn;
                            if (record.children != null) {
                              rowJn = record.children[0];
                            }

                            /*
                            const response = await fetch.get(`/api/eps/control/main/mbsz/existMb?id=`+ record.id);
                          if (data == "1") {
                                 message.warning('模版正在使用不允许导入');
                              return false;
                          }
                          */
                          }}
                          icon={<SelectOutlined/>}>
          </EpsModalButton>
          //
        ]}
      </>
    );
  }


  return (
    <>
      <DwTableLayout
        title={title}
        source={source}
        //   treeService={DwService}
        tableProp={tableProp}
        //   customTableAction={customTableAction}                  // 高级搜索组件，选填
        formWidth={800}
        tableService={mbglService}
        customForm={customForm}
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        searchForm={searchFrom}
        initParams={initParams}
        customTableAction={customTableAction}
        menuProp={mbglStore.menuProp} // 右侧菜单 设置属性，选填
      >
      </DwTableLayout>
      <ArchMenuAction params={mbglStore.archParams} modalVisit={mbglStore.modalVisit} archStore={mbglStore}
                      opt={mbglStore.menuActionItem}

      />
    </>
  );
})

export default Mbgl;
