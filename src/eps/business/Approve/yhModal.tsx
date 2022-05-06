import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';

import YhService from '@/services/system/yh/YhService';

import {
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Select,
  TreeSelect,
  Button,
} from 'antd';
import {
  EpsSource,
  ITable,
  ITitle,
  ITree,
  MenuData,
} from '@/eps/commons/declare';
import { observer } from 'mobx-react';

import YhStore from '@/stores/system/YhStore';

import yhUpPwd from '@/pages/sys/yh/yhUpPwd';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { ImportOutlined } from '@ant-design/icons';
import RoleYh from '@/pages/sys/yh/RoleYh';
import UnLock from '@/pages/sys/yh/UnLock';
import RestPwd from '@/pages/sys/yh/RestPwd';
import DwTableLayout from '@/eps/business/DwTableLayout';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import InspectionService from './ApplyDetailService';
import { showMessage } from '@/eps/components/message';

const inspectionService = new InspectionService('/api/eps/control/main/kfjdsp');
const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: false,
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,

  disableCopy: true,

  /* disableAdd: true,
   disableEdit: false,*/
  rowSelection: {
    type: 'radio',
  },
};

const span = 12;
const _width = 240;

const treeProp: ITree = {
  treeSearch: true,
  treeCheckAble: false,
};

const Yh = observer((props) => {
  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [umid, setUmid] = useState('');

  const mxid = props.params.mxid;

  const addSpr = () => {};

  useEffect(() => {
    YhStore.queryDw();
    YhStore.queryYhLx();
    YhStore.queryGw();
    YhStore.queryYhMj();
    YhStore.queryYhZj();
    YhStore.queryDwTree();
    YhStore.queryTreeDwList();

    YhStore.queryForPage();
    setUmid('CONTROL0003');
    // const getUser = async () => {
    //     let result = await YhService.findByKey('DW201408191440170001');
    //     setYh(result.results[0])
    // }
    // getUser()
    YhStore.getUserOption16();
    YhStore.getUserOption17();
    YhStore.getUserOption18();

    setTableStore(ref.current?.getTableStore());
  }, []);

  // useEffect(() => {
  //     YhStore.queryOrg(tableStore?.key);
  //     console.log('左侧菜单值: ', tableStore?.key)
  // }, [tableStore?.key])

  const [orglist, setOrglist] = useState<
    Array<{ id: string; label: string; value: string }>
  >([]);

  const qqShow = () => {
    const uo = YhStore.userOption16;
    if (uo == 'Y') {
      return false;
    } else {
      return true;
    }
  };

  const mailShow: () => boolean = () => {
    const uo = YhStore.userOption17;
    if (uo == 'Y') {
      return false;
    } else {
      return true;
    }
  };

  const kfhjurlShow = () => {
    const uo = YhStore.userOption18;
    if (uo == 'Y') {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const queryOrgList = async () => {
      if (tableStore) {
        let url = '/api/eps/control/main/org/queryForList';

        if (tableStore.key && tableStore.key != '') {
          url = url + '?dwid=' + tableStore.key;
        }
        const response = await fetch.post(url);
        if (response.status === 200) {
          if (response.data.length > 0) {
            let SjzdData = response.data.map((o) => ({
              id: o.id,
              label: o.name,
              value: o.id,
            }));
            console.log('qjjslist===', SjzdData);
            setOrglist(SjzdData);
          } else {
            setOrglist(response.data);
          }
        }
      }
    };

    queryOrgList();
  }, [tableStore?.key]);

  const dwChange = (value) => {
    if (value) {
      fetch
        .get(`/api/eps/control/main/org/queryForList?dwid=` + value)
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data.length > 0) {
              let sdata = res.data.map((o) => ({
                id: o.id,
                label: o.name,
                value: o.id,
              }));
              setOrglist(sdata);
            }
          }
        });
    }
  };

  // 自定义表单
  const customForm = () => {
    return <></>;
  };

  const ref = useRef();
  // const FChild = forwardRef(EpsPanel);

  const getCustomAction = (store: EpsTableStore, checkedRows) => {
    return [<Button onClick={props.onClose}>关闭</Button>];
  };

  // 自定义功能按钮
  const customAction = (store: EpsTableStore, checkedRows) => {
    return getCustomAction(store, checkedRows);
  };

  const [tableStore, setTableStore] = useState<EpsTableStore>(
    new EpsTableStore(YhService),
  );

  // 创建右侧表格Store实例
  //   const [tableStore] = useState<EpsTableStore>(new EpsTableStore(YhService));

  const tableRowClick = async (rowKey, records) => {
    const record = records[0];
    const sprid = record.id;
    const sprname = record.yhmc;
    const response = await inspectionService.updDetail({
      bmc: 'kfjd',
      sprid,
      sprname,
      ids: mxid,
    });
    debugger;
    if (response.success) {
      showMessage('选择鉴定人员成功', 'success');
      if (props.callback) {
        props.callback(response);
      }
    } else {
      showMessage(`更新失败：${response.message}`, 'error');
    }
  };
  // // 自定义表格行按钮detail
  // const customTableAction = (text, record, index, store) => {
  //   return getCustomTableAction(text, record, index, store);

  //   //         return (<>
  //   //             {[
  //   //      //         <CopyYh title="复制" column={source} data={record} store={tableStore} customForm={customForm} />,
  //   //                 UnLock(text,record,index,store),
  //   //                 RestPwd(text,record,index,store),
  //   // /*
  //   //           <EpsModalButton noFoot={true} name="修改密码" title="修改密码"  url="/yhuppwd" isIcon={true}   width={500} />,
  //   // */
  //   //                 yhUpPwd(text,record,index,store),
  //   //           //      <EpsModalButton icon={<AuditOutlined />}  noFoot={true} name="角色" title="角色"  url="/yhuppwd" isIcon={true}   width={500} />,

  //   //                       RoleYh(text,record,index,store),

  //   //             ]}
  //   //         </>);
  // };

  let columsetslist: EpsSource[] = [];

  const getColumsetslist = () => {
    columsetslist = [
      {
        title: '单位',
        code: 'dwmc',
        align: 'center',
        ellipsis: true, // 字段过长自动东隐藏
        fixed: 'left',
        width: 200,
        formType: EpsFormType.Input,
      },
      {
        title: '登录号',
        code: 'bh',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input,
      },
      {
        title: '用户名称',
        align: 'center',
        code: 'yhmc',
        width: 120,
        ellipsis: true,
        formType: EpsFormType.Select,
      },
      {
        title: '性别',
        code: 'xb',
        align: 'center',
        width: 60,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          if (text) {
            return text == '1' ? '男' : '女';
          } else {
            return (text = '未知');
          }
        },
      },
      {
        title: '任职部门',
        code: 'orgmc',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
      },
      {
        title: '用户类型',
        code: 'lx',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          let lxlist = YhStore.lxDataSource;
          let aa = lxlist.filter((item) => {
            return item.value === text;
          });
          return aa[0]?.label;
        },
      },
      {
        title: '用户密级',
        code: 'yhmj',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (value) => {
          let lxlist = YhStore.mjDataSource;
          let mc = lxlist.filter((ite) => {
            return ite.value === value;
          });
          return mc[0]?.label;
        },
      },
      {
        title: '岗位',
        code: 'gw',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: function (value) {
          let lxlist = YhStore.gwDataSource;
          let mc = lxlist.filter((ite) => {
            return ite.value === value;
          });
          return <>{mc[0]?.label}</>;
        },
      },
      {
        title: '手机号码',
        code: 'sjh',
        align: 'center',

        width: 100,
        formType: EpsFormType.Input,
      },
      {
        title: '固定电话',
        code: 'dh',
        align: 'center',

        width: 100,
        formType: EpsFormType.Input,
      },
      {
        title: '部职别',
        code: 'bzb',
        width: 100,
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '启用日期',
        code: 'qyrq',
        align: 'center',
        width: 160,
        formType: EpsFormType.Input,
      },
      {
        title: '停用',
        code: 'ty',
        width: 60,
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          if (text == 'N') {
            return '启用';
          } else if (text == 'Y') {
            return '停用';
          } else {
            return '启用';
          }
        },
      },
      {
        title: '停用日期',
        code: 'tyrq',
        width: 160,
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '维护人',
        code: 'whr',
        width: 100,
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '维护时间',
        code: 'whsj',
        width: 160,
        align: 'center',
        formType: EpsFormType.None,
      },
    ];

    const uo16 = YhStore.userOption16;
    if (uo16 == 'Y') {
      columsetslist.push({
        title: 'QQ',
        code: 'qq',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
      });
    }

    const uo17 = YhStore.userOption17;
    if (uo17 == 'Y') {
      columsetslist.push({
        title: '电子邮件',
        code: 'mail',
        align: 'center',
        formType: EpsFormType.Input,
        width: 140,
      });
    }
    return columsetslist;
  };

  console.log('columsetlist', columsetslist);

  const source: EpsSource[] = columsetslist;
  // const source:EpsSource[] = [{
  //     title: '单位',
  //     code: 'dwmc',
  //     align: 'center',
  //     ellipsis: true,         // 字段过长自动东隐藏
  //     fixed: 'left',
  //     width: 200,
  //     formType: EpsFormType.Input
  // }, {
  //     title: '登录号',
  //     code: 'bh',
  //     align: 'center',
  //     width: 120,
  //     formType: EpsFormType.Input
  // }, {
  //     title: '用户名称',
  //     align: 'center',
  //     code: 'yhmc',
  //     width: 120,
  //     ellipsis: true,
  //     formType: EpsFormType.Select,

  // }, {
  //     title: '性别',
  //     code: 'xb',
  //     align: 'center',
  //     width: 60,
  //     formType: EpsFormType.Input,
  //     render: (text, record, index) => {
  //         if(text) {
  //             return text == '1' ? '男' : '女';
  //         }else{
  //             return text = "未知";
  //         }

  //     }

  // }, {
  //     title: '任职部门',
  //     code: 'orgmc',
  //     align: 'center',
  //     width: 100,
  //     formType: EpsFormType.Input
  // }, {
  //     title: "用户类型",
  //     code: 'lx',
  //     align: 'center',
  //     width: 100,
  //     formType: EpsFormType.Input,
  //     render: (text, record, index) => {
  //         let lxlist=YhStore.lxDataSource;
  //         let aa = lxlist.filter(item => {
  //             return item.value === text
  //         })
  //         return aa[0]?.label
  //     },

  // }, {
  //     title: "用户密级",
  //     code: "yhmj",
  //     align: 'center',
  //     width: 100,
  //     formType: EpsFormType.Input,
  //     render:(value) =>{
  //         let lxlist=YhStore.mjDataSource;
  //         let mc = lxlist.filter(ite => {

  //             return ite.value === value
  //         })
  //         return mc[0]?.label
  //     },
  // }, {
  //     title: "岗位",
  //     code: 'gw',
  //     align: 'center',
  //     width: 100,
  //     formType: EpsFormType.Input,
  //     render:function(value){
  //         let lxlist=YhStore.gwDataSource;
  //         let mc = lxlist.filter(ite => {

  //             return ite.value === value
  //         })
  //         return (<>{mc[0]?.label}</>)
  //     },
  // }, {
  //     title: "电子邮件",
  //     code: 'mail',
  //     align: 'center',
  //     formType: EpsFormType.Input,
  //     width: 140,
  //     /* defaultSortOrder: 'descend',
  //      sorter: (a, b) => a.bz - b.bz,*/
  // }, {
  //     title: "QQ",
  //     code: 'qq',
  //     align: 'center',
  //     width: 100,
  //     formType: EpsFormType.Input,
  //     /*  defaultSortOrder: 'descend',
  //       sorter: (a, b) => a.mc - b.mc,*/
  // }, {
  //         title: "手机号码",
  //         code: "sjh",
  //         align: 'center',

  //         width: 100,
  //         formType: EpsFormType.Input,
  //         /*defaultSortOrder: 'descend',
  //         sorter: (a, b) => a.lx - b.lx,*/
  // }, {
  //         title: "固定电话",
  //         code: 'dh',
  //         align: 'center',

  //         width: 100,
  //         formType: EpsFormType.Input,
  //         /*defaultSortOrder: 'descend',
  //         sorter: (a, b) => a.url - b.url,*/
  // }, {
  //         title: "部职别",
  //         code: 'bzb',
  //         width: 100,
  //         align: 'center',
  //         formType: EpsFormType.Input,
  //         /* defaultSortOrder: 'descend',
  //          sorter: (a, b) => a.bz - b.bz,*/
  // }, {
  //         title: "启用日期",
  //         code: 'qyrq',
  //         align: 'center',
  //         width: 160,
  //         formType: EpsFormType.Input,
  //     //   format:"YYYY-MM-DD"
  // }, {
  //         title: "停用",
  //         code: "tymc",
  //         width: 60,
  //         align: 'center',
  //         formType: EpsFormType.Input,
  //         render: (text, record, index) => {
  //             return text == 'N' ? '启用' : '停用';
  //         }
  // }, {
  //         title: "停用日期",
  //         code: 'tyrq',
  //         width: 160,
  //         align: 'center',
  //         formType: EpsFormType.Input,
  //         /*defaultSortOrder: 'descend',
  //         sorter: (a, b) => a.url - b.url,*/
  // }, {
  //         title: "维护人",
  //         code: 'whr',
  //         width: 100,
  //         align: 'center',
  //         formType: EpsFormType.Input,
  //         /* defaultSortOrder: 'descend',
  //          sorter: (a, b) => a.whr - b.whr,*/
  // },{
  //     title: '维护时间',
  //     code: 'whsj',
  //     width: 160,
  //     align: 'center',
  //     formType: EpsFormType.None
  // }]

  const title: ITitle = {
    name: '用户',
  };

  const menuProp: MenuData[] = [
    {
      title: '导入',
      icon: 'file-transfer/icon_edit',
      onClick: (record, store, rows) =>
        console.log('这是导入按钮', record, rows),
      color: '#CCCCFF',
    },
    {
      title: '打印',
      icon: 'file-transfer/icon_book',
      onClick: (record, store, rows) =>
        console.log('这是打印按钮', record, rows),
      color: '#FFCCFF',
    },
  ];

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="登录号" className="form-item" name="bh">
          <Input placeholder="请输入用户登录号" className="ant-input" />
        </Form.Item>
        <Form.Item label="用户名" className="form-item" name="yhmc">
          <Input placeholder="请输入用户名称" className="ant-input" />
        </Form.Item>
        <Form.Item label="部门名称" className="form-item" name="bmid">
          <input placeholder="请输入用户部门名称" className="ant-input" />
        </Form.Item>
        <Form.Item name="lx" className="form-item" label="用户类型">
          <Select
            className="ant-select"
            placeholder="请选择用户类型"
            options={YhStore.lxDataSource}
          ></Select>
        </Form.Item>
      </>
    );
  };

  return (
    <EpsPanel
      title={title} // 组件标题，必填
      source={getColumsetslist()} // 组件元数据，必填
      treeProp={treeProp} // 左侧树 设置属性,可选填
      //      treeService={DwService}                  // 左侧树 实现类，必填
      tableProp={tableProp} // 右侧表格设置属性，选填
      tableService={YhService} // 右侧表格实现类，必填
      ref={ref} // 获取组件实例，选填
      formWidth={850}
      onRowSelectChange={tableRowClick}
      //     menuProp={menuProp}                      // 右侧菜单 设置属性，选填
      // tableRowClick={(record) => console.log('abcef', record)}
      // searchForm={searchFrom}
      customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      //  customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
      customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
    ></EpsPanel>
  );
});

export default Yh;
