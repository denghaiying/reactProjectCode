import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import mtypeService from './mtypeService'
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import './index.less';
import fetch from "../../../utils/fetch";
/**
 * 内部管理---物料类别
 */

const Mtype = observer((props) => {
  const ref = useRef();

  useEffect(() => {
  }, []);

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');


  const MtypeStore = useLocalObservable(() => (
    {
      //表单物料类别编号验证
      codeData: [],
      //表单物料类别名称验证
      nameData: [],

    }
  )
  );


  //按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    searchCode: 'mtypename',
    disableCopy: true,
    onAddClick: (form) => {
      MtypeStore.nameData = [];
      MtypeStore.codeData = [];
    },
    onEditClick: (form, record) => {
      MtypeStore.nameData = record.mtypename;
      MtypeStore.codeData = record.mtypecode;
    },
  }

  //表单名称
  const title: ITitle = {
    name: '物料类别维护',
  }

  //定义table表格字段
  const source: EpsSource[] = [
    {
      title: '物料类别编码',
      code: 'mtypecode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160
    },
    {
      title: '物料类别名称',
      code: 'mtypename',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300
    },
    {
      title: '增值税率%',
      code: 'mtyperate',
      align: 'center',
      formType: EpsFormType.InputNumber,
      render: (text, record, index) => {
        if (record.hasOwnProperty('mtyperate')) {
          return text + '%';
        } else {
          return "";
        }
      },
      width: 120
    },
    {
      title: '计量单位',
      code: 'mtypejldw',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80
    },
    {
      title: '末级',
      code: 'mtypemj',
      align: 'center',
      formType: EpsFormType.Checkbox,
      render: (text, record, index) => {
        return <Checkbox checked={text === '1' ? true : false} />
      },
      width: 80
    },
    {
      title: '停用',
      code: 'mtypesfty',
      align: 'center',
      formType: EpsFormType.Checkbox,
      render: (text, record, index) => {
        return <Checkbox checked={text} />
      },
      width: 80
    },
    {
      title: '停用时间',
      code: 'mtypetyrq',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160
    },
    {
      title: '备注',
      code: 'mtypebz',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160
    },
  ]

  //按下键盘时触发,控制InputNumber整数框输入的值
  const keyPress = (event) => {
    //只要输入的内容是'+-eE'  ，就阻止元素发生默认的行为
    const invalidChars = ['-', '+', 'e', 'E', '.']
    if (invalidChars.indexOf(event.key) !== -1) {
      event.preventDefault()
    }
  }

  // 自定义弹框表单
  const customForm = (text) => {

    //点击取消，清空onSftyChange赋的值
    const tyrqValue = text.getFieldValue('mtypesfty');
    if (tyrqValue === false) {
      text.setFieldsValue({ 'mtypetyrq': null });
    }

    //停用时间判断
    const onSftyChange = (value) => {
      if (value.target.checked === true) {
        text.setFieldsValue({ 'mtypesfty': true });
        text.setFieldsValue({ 'mtypetyrq': moment().format('YYYY-MM-DD HH:mm:ss') });
      } else {
        text.setFieldsValue({ 'mtypesfty': false });
        text.setFieldsValue({ 'mtypetyrq': null });
      }
    }

    return (
      <>
        <Form.Item label="物料类别编码:" name="mtypecode"
          validateFirst
          rules={[
            { required: true, message: '请输入物料类别编码' },
            { max: 20, message: '编码长度不能大于20个字符' },
            {
              async validator(_, value) {
                if (MtypeStore.codeData === value) {
                  return Promise.resolve();
                }
                const param = { params: { mtypecode: value } }
                await fetch.get("/api/eps/nbgl/mtype/list/", { params: param }).then(res => {
                  if (res.data.length === 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('此物料类别编号已存在，请重新输入!'));
                  }
                })
              },
            }
          ]}

        >
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="物料类别名称:" name="mtypename"
          validateFirst
          rules={[{ required: true, message: '请输入物料类别名称' },
          {
            async validator(_, value) {
              if (MtypeStore.nameData === value) {
                return Promise.resolve();
              }
              const param = { params: { mtypename: value, source: 'add' } }
              await fetch.get("/api/eps/nbgl/mtype/list/", { params: param }).then(res => {
                if (res.data.length === 0) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error('此物料类别名称已存在，请重新输入!'));
                }
              })
            },
          }]}>
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="增值税率:" >
          <Form.Item name="mtyperate" noStyle>
            <InputNumber min={1} max={100} onKeyPress={keyPress} style={{ width: '200px' }} />
          </Form.Item>
          <Input defaultValue="%" allowClear readOnly style={{ width: '50px' }} />
        </Form.Item>
        <Form.Item label="计量单位:" name="mtypejldw"  >
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="停用:" name="mtypesfty" valuePropName="checked">
          <Checkbox style={{ width: 250 }} onChange={onSftyChange} />
        </Form.Item>
        <Form.Item label="停用时间:" name="mtypetyrq">
          <Input allowClear style={{ width: 250 }} disabled />
        </Form.Item>
        <Form.Item label="备注:" name="bz" >
          <Input.TextArea allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr" >
          <Input allowClear disabled defaultValue={whr} style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" >
          <Input allowClear defaultValue={whsj} disabled style={{ width: 250 }} />
        </Form.Item>
      </>
    )
  }
  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={mtypeService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={500}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      >
      </EpsPanel>
    </>
  );
})

export default Mtype;

