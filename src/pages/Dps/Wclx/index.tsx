import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef } from 'react';
import { observer, useLocalObservable, } from 'mobx-react';
import { Form, FormInstance, Input, message, Select } from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import WclxService from '../Wclx/Service/WclxService';
import WcglService from '../Wcgl/Service/WcglService';
import OptrightStore from '@/stores/user/OptrightStore';
import fetch from '../../../utils/fetch';

/**
 * 外出类型
 */
const Wclx = observer((props) => {
  //权限按钮
  const umid = 'DPS009';
  OptrightStore.getFuncRight(umid);
  const ref = useRef();
  useEffect(() => {
  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    searchCode: 'name',
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    onAddClick: (form: FormInstance) => {
      Wclxtore.codeData = false;
      Wclxtore.wclxDatacode = [];
      Wclxtore.wclxDataname = [];
    },
    onEditClick: (form, data) => {
      Wclxtore.wclxDatacode = data.code;
      Wclxtore.wclxDataname = data.name;
      const tableStore = ref.current?.getTableStore();
      WcglService.findByKey(tableStore.key, 1, tableStore.size, { code: data.code }).then(res => {
        if (res.total !== 0) {
          Wclxtore.codeData = true;
        } else {
          Wclxtore.codeData = false;
        }
      })
    },
    onDeleteClick: async (data) => {
      const tableStore = ref.current?.getTableStore();
      const res = await WcglService.findByKey(tableStore.key, 1, tableStore.size, { code: data.code })
      if (res.total !== 0) {
        return Promise.reject('该条数据已使用，不允许删除！')
      }
      return Promise.resolve();
    },
  }

  //外出管理store
  const Wclxtore = useLocalObservable(() => (
    {
      codeData: false,
      data: [],
      wclxDatacode: [],
      wclxDataname: [],

    }));
  // 表单名称
  const title: ITitle = {
    name: '外出类型'
  }

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '编号',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '符号',
      code: 'sign',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '是否请假',
      code: 'sfqj',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string, record: any, index: any) => {
        if (text) {
          return text == 'N' ? '工作' : '请假';
        } else {
          return text = "未知";
        }
      }
    },
  ]

  //按下键盘时触发,控制InputNumber整数框输入的值
  const keyPress = (event) => {
    //只要输入的内容是'/'  ，就阻止元素发生默认的行为
    const invalidChars = ['/']
    if (invalidChars.indexOf(event.key) !== -1) {
      event.preventDefault()
    }
  }

  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        <Form.Item label="编号:" name="code" required
          validateFirst
          rules={[
            { required: true, message: '请输入编号' },
            { max: 4, message: '编号长度不能大于4个字符' },
            {
              async validator(_, value) {
                if (Wclxtore.wclxDatacode === value) {
                  return Promise.resolve();
                }
                const param = { params: { code: value, source: 'jq' } };
                await fetch.get('/api/eps/dps/outtype/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('此编号已存在，请重新命名'),
                      );
                    }
                  });
              },
            },
          ]}>
          <Input allowClear style={{ width: 300 }} disabled={Wclxtore.codeData} />
        </Form.Item>
        <Form.Item label="名称:" name="name" required
          validateFirst
          rules={[
            { required: true, message: '请输入名称' },
            { max: 10, message: '名称度不能大于10个字符' },
            {
              async validator(_, value) {
                if (Wclxtore.wclxDataname === value) {
                  return Promise.resolve();
                }
                const param = { params: { name: value, source: 'jq' } };
                await fetch
                  .get('/api/eps/dps/outtype/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('此名称已存在，请重新命名'),
                      );
                    }
                  });
              },
            },
          ]}>
          <Input allowClear style={{ width: 300 }} disabled={Wclxtore.codeData} />
        </Form.Item>
        <Form.Item label="符号:" name="sign" >
          <Input allowClear style={{ width: 300 }} onKeyPress={keyPress} disabled={Wclxtore.codeData} />
        </Form.Item>
        <Form.Item label="是否请假:" name="sfqj" >
          <Select style={{ width: 300 }} placeholder="请选择是否请假" disabled={Wclxtore.codeData}>
            <option value="Y">请假</option>
            <option value="N">工作</option>
          </Select>
        </Form.Item>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={WclxService}           // 右侧表格实现类，必填
        formWidth={500}
        ref={ref}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      >
      </EpsPanel>
    </>
  );
})

export default Wclx;
