import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import { Input, message, Tooltip, Modal, Table, Button, notification } from 'antd';
import RoleStore from '../../../stores/system/RoleStore';
import { CopyOutlined } from "@ant-design/icons";
import { observer, useLocalObservable } from 'mobx-react';
import EpsFormType from '@/eps/commons/EpsFormType';
import './table.less';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import fetch from "../../../utils/fetch";
import SysStore from '@/stores/system/SysStore';
import DwStore from '@/stores/system/DwStore';
import RoleService from '@/services/system/RoleService';
import { response } from '@umijs/deps/compiled/express';
import DwTableLayout from '@/eps/business/DwTableLayout'
const FormItem = Form.Item;


const copyRoleqx = observer((props) =>{

    const tableProp: ITable = {
        tableSearch: false,
        disableEdit: true,         // 是否禁用编辑
        disableDelete: true,        // 是否禁用删除
        disableIndex: true,         // 是否使用索引列
        disableAdd: true,          // 是否使用新增
        disableCopy: true,
        rowSelection: {
            type: 'check',
        },
   }

    const ref = useRef()
    /**
   * childStore
   */
    /**
         * childStore
         */
    const copyRoleStore = useLocalObservable(() => (
        {
           
            name: "",
            code: "",
           
            yhid: SysStore.getCurrentUser().id,
            //获取当前默认用户的角色
            roleCode: SysStore.getCurrentUser().golbalrole
        }
    ));
 
    const source: EpsSource[] = [

        {
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
        name: '复制角色权限'
    }

      // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
          <Button type="primary" onClick={() => OnOkSave()}>保存</Button>
      </>
    ])
  }

    const searchFrom = () => {
      return (
        <>
          <FormItem label="角色编号" className="form-item" name="code"><Input placeholder="请输入编号" /></FormItem >
          <FormItem label="角色名称" className="form-item" name="name"><Input placeholder="请输入名称" /></FormItem >
        </>
      )
    }

    const customForm = () => {
        return (
          <>
          </>
        );
      };
    //初始化
    useEffect(() => {

    }, [])


    /**
    * 获取角色编号
    * @param {*} val
    */
    const getBh = (val) => {
        copyRoleStore.code = val.target.value;
    };

    /**
    * 获取角色名称
    * @param {*} val
    */
    const getName = (val) => {
        copyRoleStore.name = val.target.value;
    };

    /**
    * 查询
    * @param {*} current
    */
    const OnSearch = () => {
        let storeTable = ref.current?.getTableStore();
        RoleService.findByKey('', 1, storeTable.size, {name: copyRoleStore.name,code:copyRoleStore.code,isnotid:props.params.roleid});
    };

    const OnOkSave = async () => {
   
        var ids = '';
        const selectRow = ref.current?.getCheckedRows();
        if (!selectRow || selectRow.length < 1) {
          return message.warning('请选择至少一条数据!');
        }
        for (var i = 0; i < selectRow.length; i++) {
            ids = selectRow[i].id + ',' + ids;
        }
        const url =
        `/api/eps/control/main/role/copyRoleqx?ids=${ids}&roleid=${props.params.roleid}`;
      const response = await fetch.post(url);
     debugger
      if (response && response.status === 200) {
        if (response.data && response.data.success) {
              return message.success('复制成功!');
          }else{
            return message.warning('失败!'+response.data.message);
          }
      }
        
    };

    

    return (
        <>
        <DwTableLayout
          title={title}                            // 组件标题，必填
          // ref={ref}
          source={source}                          // 组件元数据，必填
       //   treeService={DwService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={RoleService}                 // 右侧表格实现类，必填
          searchForm={searchFrom}
          customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
          formWidth={500}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          initParams={{dwid:props.params.dwid,isnotid:props.params.roleid}}
       >

      </DwTableLayout>
        </>
    );
})

export default copyRoleqx;
