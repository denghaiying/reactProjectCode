import React, { useEffect } from 'react';
import DwTableLayout from '@/eps/business/DwTableLayout'
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable} from '@/eps/commons/declare';
import RoleService from '@/services/system/RoleService';
import { Form, Input, Select, TreeSelect, Button, message, Modal } from 'antd';
import RoleStore from '../../../stores/system/RoleStore';
import SearchStore from '../../../stores/datj/SearchStore';
const Option = Select.Option;
const FormItem = Form.Item;
import { observer,useLocalObservable } from 'mobx-react';
import copyRole from './copyRole'
import RoleUser from './roleUser'
import DwStore from '@/stores/system/DwStore';
import SysStore from '../../../stores/system/SysStore';
import fetch from "../../../utils/fetch";
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { SettingOutlined } from '@ant-design/icons';
import Xsjqx from '@/pages/base/sjqx/Xsjqx';
import Xqwjsqx from '@/pages/base/qwjsqx/Xqwjsqx';



const Role = observer((props) => {


  const childStore = useLocalObservable(() => ({
        //获取当前默认用户的角色
        roleCode: SysStore.getCurrentUser().golbalrole,
        dwTreeData: [],
        dwTotal:0,
        modalVisit:false,
        qwjsmodalVisit:false,
        roleid:'',
        async queryTreeDwList  ()  {

      if (!this.dwTreeData || this.dwTreeData.length === 0) {

          if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
            const response = await fetch.get(`/api/eps/control/main/dw/queryForList_e9_superUser`);
            if (response.status === 200) {
              //runInAction(() => {
                var sjData = [];
                if (response.data.length > 0) {
                  for (var i = 0; i < response.data.length; i++) {
                    let newKey = {};
                    newKey = response.data[i];
                    newKey.key = newKey.id;
                    newKey.title = newKey.mc;
                    sjData.push(newKey);
                  }
                  this.dwTreeData = sjData;
                  this.dwTotal = sjData.length;
                }
                return;
             // });
            }
          } else {
            const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
            if (response.status === 200) {
              //runInAction(() => {
                var sjData = [];
                if (response.data.length > 0) {
                  for (var i = 0; i < response.data.length; i++) {
                    let newKey = {};
                    newKey = response.data[i];
                    newKey.key = newKey.id;
                    newKey.title = newKey.mc;
                    sjData.push(newKey);
                  }
                  this.dwTreeData = sjData;
                  this.dwTotal = sjData.length;
                }
                return;
              //});
            }
          }
        }
  }

   }));


  const tableProp: ITable = {
    searchCode: 'name',
    tableSearch: false,
    disableCopy: true,
    rowSelection: {
      type: 'radio',
    },
    onAddClick:async (form)=> await childStore.queryTreeDwList(),
    onEditClick:async (form)=> await childStore.queryTreeDwList(),
    //onSearchClick:(form)=>RoleStore.queryTreeDwList(),
  }

  // 自定义表格行按钮
  const customTableAction = (text, record, index, store) => {
    return (<>
      {[
        copyRole(text, record, index, store),

        <RoleUser record={record} key={'roleUser' + index} />

      ]}
    </>)
  }

  const handleChange = (value) => {
    RoleStore.dw_id = value;
    SearchStore.dwChange(value);
  }

  const onButtonClick = (val) => {
    if (val.length != 1) {
      debugger
      message.error('操作失败,请选择一行数据');
    } else {
      childStore.roleid=val[0].id;
      childStore.modalVisit=true;
    }
  }

  const onywqxchange = async (val) => {
    if (val.length != 1) {
      debugger
      message.error('操作失败,请选择一行数据');
    } else {
      childStore.roleid=val[0].id;
      return true;
    }

  };

  const setModalVisit = (val) => {
    childStore.modalVisit=val;
  };

  const setQwjsModalVisit = (val) => {
    childStore.qwjsmodalVisit=val;
  };

  // 自定义表单

  const customForm = () => {
    //自定义表单校验
    const dwConfig = {
      rules: [{ required: true, message: '请选择角色单位!' }],
    };

    const lxConfig = {
      rules: [{ required: true, message: '请选择!' }],
    };
    return (
      <>
        <Form.Item label="单位:" name="dwid" required {...dwConfig}>
          <TreeSelect style={{ width: 322 }}
            treeData={childStore.dwTreeData}
            placeholder="请选择单位"
            treeDefaultExpandAll
            allowClear
            onChange={handleChange}
          />

        </Form.Item>
        <Form.Item label="编号:" name="code" required rules={[{ required: true, message: '请输入编号' }]}>
          <Input allowClear />
        </Form.Item>

        <Form.Item label="名称:" name="name" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear />
        </Form.Item>


        <Form.Item label="是否停用:" name="tybz"  initialValue="N">
          <Select style={{ width: 180, height: 30 }} id="tybz"  >
            <Option value="N">否</Option>
            <Option value="Y">是</Option>
          </Select>
        </Form.Item>

        <Form.Item label="是否默认角色:" name="sfmryh"  initialValue="N">
          <Select style={{ width: 180, height: 30 }} id="sfmryh"  >
            <Option value="N">否</Option>
            <Option value="Y">是</Option>
          </Select>
        </Form.Item>

        <Form.Item label="角色类型:" name="lx" required {...lxConfig}>
          <Select style={{ width: 180, height: 30 }} id="lx" placeholder="请选择">
            <Option value="系统角色">系统角色</Option>
            <Option value="游客角色">游客角色</Option>
          </Select>
        </Form.Item>


        <Form.Item label="维护人:" name="whr" >
          <Input disabled defaultValue={RoleStore.yhmc} />
        </Form.Item>

        <Form.Item label="维护时间:" name="whsj" >
          <Input defaultValue={RoleStore.getDate} disabled />
        </Form.Item>

        <Form.Item name="whrid" >
          <Input defaultValue={RoleStore.yhid} hidden />
        </Form.Item>


      </>
    )
  }


  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
         <EpsModalButton name="业务权限" title="业务权限" width={1200}   useIframe={true}  url={'/api/eps/control/main/dakqx/ywqxszMainx'}   beforeOpen={() => onywqxchange(ids)}   params={{code:ids[0]?.code,dwid:ids[0]?.dwid,edittype:ids[0]?.edittype,
                             fjs:ids[0]?.fjs,fl:ids[0]?.fl,id:ids[0]?.id,lx:ids[0]?.lx,name:ids[0]?.name,
                             sfmryh:ids[0]?.sfmryh, tybz:ids[0]?.tybz, whrid:ids[0]?.whrid,dwid:RoleStore.dw_id}} icon={<SettingOutlined />}/>
        <Button type="primary" onClick={() => onButtonClick(ids)}>数据权限</Button>
      </>
    ])
  }



  const source: EpsSource[] = [{
    title: '编号',
    code: 'code',
    align: 'center',
    formType: EpsFormType.Input
  }, {
    title: '名称',
    code: 'name',
    align: 'center',
    formType: EpsFormType.Input
  }, {
    title: '单位',
    align: 'center',
    code: 'dwid',
    formType: EpsFormType.Select,
    render: (text) => {
      for (var i = 0; i < DwStore.dwList.length; i++) {
        var dw = DwStore.dwList[i];
        if (dw.id === text) {
          return dw.mc;
        }
      }
    }
  },
  {
    title: '停用',
    align: 'center',
    code: 'tybz',
    width: 80,
    formType: EpsFormType.Select,
    render: (text, record, index) => {
      return record.tybz == 'N' ? '否' : '是';
    }
  },
  {
    title: '默认角色',
    align: 'center',
    code: 'sfmryh',
    width: 80,
    formType: EpsFormType.Select,
    render: (text, record, index) => {
      return text == 'N' ? '否' : '是';
    }
  }, {
    title: '类型',
    code: 'lx',
    align: 'center',
    formType: EpsFormType.Input
  },

  {
    title: '停用日期',
    code: 'tyrq',
    align: 'center',
    formType: EpsFormType.Input
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
    name: '角色管理'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="角色编号" className="form-item" name="code"><Input placeholder="请输入编号" /></FormItem >
        <FormItem label="角色名称" className="form-item" name="name"><Input placeholder="请输入名称" /></FormItem >
      </>
    )
  }


  return (
    <>
      <DwTableLayout
          title={title}                            // 组件标题，必填
          // ref={ref}
          source={source}                          // 组件元数据，必填
       //   treeService={DwService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={RoleService}                 // 右侧表格实现类，必填
          formWidth={500}
          searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
       >
      </DwTableLayout>

      <Modal
            title= "数据权限"
            visible={childStore.modalVisit}
            width='1200'
            style={{height: (window.innerHeight - 300) + 'px'}}
        //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
            footer={null}
            onCancel={() => setModalVisit(false)}
            onOk={() => setModalVisit(false)}
        >
        <Xsjqx dwid={RoleStore.dw_id} roleid={childStore.roleid}/>
      </Modal>

      <Modal
            title= "全文检索权限"
            visible={childStore.qwjsmodalVisit}
            width='1200'
            style={{height: (window.innerHeight - 300) + 'px'}}
        //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
            footer={null}
            onCancel={() => setQwjsModalVisit(false)}
            onOk={() => setQwjsModalVisit(false)}
        >
        <Xqwjsqx dwid={RoleStore.dw_id} roleid={childStore.roleid}/>
      </Modal>
    </>
  );
})

export default Role;
