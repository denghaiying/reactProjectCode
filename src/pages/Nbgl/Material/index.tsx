import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, InputNumber, Row, Col, Select } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import materialService from './materialService';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import fetch from "../../../utils/fetch";
import './index.less';
/**
 * 内部管理---物料维护
 */
const Material = observer((props) => {
  const ref = useRef();

  // 物料维护的本地store
  const MaterialStore = useLocalObservable(() => (
    {
      //表单物料编号验证
      codeData: [],
      //表单物料名称验证
      nameData: [],
      //物料类型数据源
      mtypeData: [],
      //物料类型下拉内容
      mtypeSelectData: [],
      //计量单位数据源
      mtypeJldw: "",
      //增值税率数据源
      mtypeRate: "",
      //查询物料类型数据
      async findMytpe() {
        const response = await fetch.get("/api/eps/nbgl/mtype/list/");
        if (response.status === 200) {
          if (response.data.length > 0) {
            this.mtypeData = response.data;
            this.mtypeSelectData = response.data.map((item: { id: any; mtypename: any; }) => ({ 'value': item.id, 'label': item.mtypename }));
          }
        }
      },
      async findById(data) {
        const response = await fetch.get(`/api/eps/nbgl/mtype/${data.id}`);
        if (response.status === 200) {
          if (response.data.hasOwnProperty('id')) {
            this.mtypeRate = response.data.mtyperate;
            this.mtypeJldw = response.data.mtypejldw;
          }
        }
      }
    }
  ));

  useEffect(() => {
    MaterialStore.findMytpe();
  }, []);

  //高级搜索框
  const searchFrom = () => {
    return (
      <>
        <Form.Item label="物料名称" className="form-item" name="materialname">
          <Input placeholder="请输入物料名称" />
        </Form.Item >
        <Form.Item label="物料类别" className="form-item" name="mtypeid">
          <Select placeholder="请选择物料类别" options={MaterialStore.mtypeSelectData} showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
        </Form.Item>
      </>
    )
  }
  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  //按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    searchCode: 'materialname',
    disableCopy: true,
    onEditClick: (form, record) => {
      MaterialStore.codeData = record.materialcode;
      MaterialStore.nameData = record.materialname;
    },
    onAddClick: (form) => {
      MaterialStore.codeData = [];
      MaterialStore.nameData = [];
    },
  }

  //表单名称
  const title: ITitle = {
    name: '物料维护'
  }

  //定义table表格字段
  const source: EpsSource[] = [
    {
      title: '物料编码',
      code: 'materialcode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160
    },
    {
      title: '物料名称',
      code: 'materialname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300
    },
    {
      title: '规格型号',
      code: 'materialggxh',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80
    },
    {
      title: '物料类别',
      code: 'mtypeid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        const result = MaterialStore.mtypeData?.filter(item => item.id === text)
        return result[0] ? result[0].mtypename : '';
      },
      width: 160
    },
    {
      title: '增值税率%',
      code: 'materialrate',
      align: 'center',
      formType: EpsFormType.InputNumber,
      render: (text, record, index) => {
        if (record.hasOwnProperty('materialrate')) {
          return text + '%';
        } else {
          return "";
        }
      },
      width: 120
    },
    {
      title: '计量单位',
      code: 'materialjldw',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80
    },
    {
      title: '停用',
      code: 'materialsfty',
      align: 'center',
      formType: EpsFormType.Checkbox,
      render: (text, record, index) => {
        return <Checkbox checked={text} />
      },
      width: 80
    },
    {
      title: '停用时间',
      code: 'materialtyrq',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160
    },
    {
      title: '备注',
      code: 'materialbz',
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
    //只要输入的内容是'+-eE'  ，就阻止元素发生默认的行为
    const invalidChars = ['-', '+', 'e', 'E', '.']
    if (invalidChars.indexOf(event.key) !== -1) {
      event.preventDefault()
    }
  }

  // 自定义弹框表单
  const customForm = (text, form) => {
    //点击取消，清空onSftyChange赋的值
    const tyrqValue = text.getFieldValue('materialsfty');
    if (tyrqValue === false) {
      text.setFieldsValue({ 'materialtyrq': null });
    }
    //停用时间判断
    const onSftyChange = (value) => {
      if (value.target.checked === true) {
        text.setFieldsValue({ 'materialsfty': true });
        text.setFieldsValue({ 'materialtyrq': moment().format('YYYY-MM-DD HH:mm:ss') });
      } else {
        text.setFieldsValue({ 'materialsfty': false });
        text.setFieldsValue({ 'materialtyrq': null });
      }
    }
    const jldwValue = text.getFieldValue('materialjldw');
    const rateValue = text.getFieldValue('materialrate');
    const mtypeidValue = text.getFieldValue('mtypeid');
    //类型下拉onChange事件
    const onTypeChange = (value, record) => {
      MaterialStore.findById({ id: value }).then(() => {
        //下拉框带值处理
        if (mtypeidValue === record.value) {
          text.setFieldsValue({ 'materialjldw': jldwValue });
          text.setFieldsValue({ 'materialrate': rateValue });
        } else {
          text.setFieldsValue({ 'materialjldw': MaterialStore.mtypeJldw });
          text.setFieldsValue({ 'materialrate': MaterialStore.mtypeRate });
        }
      });
    }

    //自定义表单校验
    return (
      <>
        <Row>
          <Col span={12}>
            <Form.Item label="物料编码:" name="materialcode"
              validateFirst
              rules={[
                { required: true, message: '请输入物料编码' },
                { max: 20, message: '编号长度不能大于20个字符' },
                {
                  async validator(_, value) {
                    if (MaterialStore.codeData === value) {
                      return Promise.resolve();
                    }
                    const param = { params: { materialcode: value, source: 'add' } }
                    await fetch.get("/api/eps/nbgl/material/list/", { params: param }).then(res => {
                      if (res.data.length === 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(new Error('此物料编号已存在，请重新输入!'));
                      }
                    })
                  },
                }
              ]}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="物料名称:" name="materialname"
              validateFirst
              rules={[{ required: true, message: '请输入物料名称' },
              {
                async validator(_, value) {
                  if (MaterialStore.nameData === value) {
                    return Promise.resolve();
                  }
                  const param = { params: { materialname: value, source: 'add' } }
                  await fetch.get("/api/eps/nbgl/material/list/", { params: param }).then(res => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('此物料名称已存在，请重新输入!'));
                    }
                  })
                },
              }]}>
              <Input allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="物料类别:" name="mtypeid" required rules={[{ required: true, message: '请选择物料类别' }]} >
              <Select options={MaterialStore.mtypeSelectData} onChange={onTypeChange}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="规格型号:" name="materialggxh" >
              <Input allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="计量单位:" name="materialjldw" required rules={[{ required: true, message: '请输入计量单位' }]}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="增值税率:">
              <Form.Item name="materialrate" noStyle >
                <InputNumber min={1} max={100} style={{ width: '224px' }} onKeyPress={keyPress} />
              </Form.Item>
              <Input defaultValue="%" allowClear readOnly style={{ width: '50px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="停用:" name="materialsfty" valuePropName="checked" >
              <Checkbox onChange={onSftyChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="停用时间:" name="materialtyrq">
              <Input disabled allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="备注:" name="materialbz" labelCol={{ span: 3 }} >
              <Input.TextArea allowClear />
            </Form.Item>
          </Col>

        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="维护人:" name="whr" >
              <Input disabled defaultValue={whr} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="维护时间:" name="whsj" >
              <Input defaultValue={whsj} disabled allowClear />
            </Form.Item>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={materialService}           // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={800}
        searchForm={searchFrom}                   //高级搜索查询框
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      >
      </EpsPanel>
    </>
  );
})

export default Material;
