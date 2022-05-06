import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import { observer } from 'mobx-react';
import { useEffect, useState, useRef } from 'react';
import {
  Steps,
  Input,
  Table,
  Button,
  Form,
  Row,
  Col,
  message,
  Select,
  Card,
  Checkbox,
  Tree,
  Modal,
  DatePicker,
  InputNumber,
  Upload,
  notification,
} from 'antd';
import XtzcStore from '../../../stores/Ngbl/XtzcStore';
import {
  FileAddOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  LeftOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import WldwService from '../Wldw/WldwService';
import ProjectService from '../Project/ProjectService';
import moment from 'moment';
import SysStore from '../../../stores/system/SysStore';
import './index.less';
import ModuleAddDailog from './ModuleAddDailog';
import fetch from '../../../utils/fetch';
import { set } from 'lodash';

const Addxtzc = observer((props) => {
  const { formData } = props;
  const [step, setStep] = useState(0);
  const [firstForm] = Form.useForm();
  const [secondForm] = Form.useForm();
  const [thirdForm] = Form.useForm();
  const formItemLayout = {
    colon: false,
    labelCol: {
      span: 8,
    },
  };
  //控制客户信息弹框是否可见
  const [khVisible, setKhvisible] = useState(false);
  //控制项目信息弹框是否可见
  const [xmVisible, setXmvisible] = useState(false);
  //客户表格数据
  const [khTableData, setKhTableData] = useState([]);
  //项目表格数据
  const [projectTableData, setProjectTableData] = useState([]);

  // 第三步 右侧表单
  const [rightForm] = Form.useForm();
  // 获取当前用户名称和维护时间
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  const sqrid = SysStore.getCurrentUser().id;
  const sqr = SysStore.getCurrentUser().yhmc;
  const sqrbh = SysStore.getCurrentUser().bh;
  const [isWlChecked, setIsWlChecked] = useState(false);

  const [projectReadOnly, setProjectReadOnly] = useState(false);

  // 刷新右侧模块数据即功能数据
  const refreshRightData = () => {
    const treeData = [...XtzcStore.modelTreeData];
    const moduleSelectData = [...XtzcStore.moduleSelectData];
    if (moduleSelectData.length > 0) {
      rightForm.setFieldsValue({ moduleName: moduleSelectData[0].label });
      XtzcStore.findFuncData(moduleSelectData[0].value).then(() => {
        const funcData = [...XtzcStore.funcData];
        if (treeData.length > 0 && treeData[0].children.length > 0) {
          treeData[0].children.forEach((t) => {
            // 获取右侧最新模块下的功能数据
            if (t.children.length > 0 && funcData.length > 0) {
              t.children.forEach((gn) => {
                for (let i = 0; i < funcData.length; i++) {
                  if (funcData[i].funcCode === gn.key) {
                    funcData.splice(i, 1);
                  }
                }
              });
            }
          });
        } else {
          XtzcStore.isShow = true;
        }
        XtzcStore.setFuncData(funcData);
      });
    }
  };
  useEffect(() => {
    firstForm.setFieldsValue(formData);
    secondForm.setFieldsValue(formData);
    thirdForm.setFieldsValue(formData);
    setIsArrowClick(formData.xtzcTuning);
  }, []);

  const steps = [
    {
      title: '选择客户项目信息',
    },
    {
      title: '填写注册信息',
    },
    {
      title: '查看和选择注册模块信息',
    },
  ];
  // 上一步
  const doPrev = () => {
    if (step > 0) {
      setStep(step - 1);
      setIsWlChecked(false);
      XtzcStore.xtzcData = [];
    }
  };

  // 下一步
  const doNext = () => {
    switch (step) {
      case 0:
        const values = firstForm.getFieldsValue();
        // 新增时根据客户id/项目id/网络判断是否是多次注册
        if (
          XtzcStore.opt === 'add' ||
          formData['khId'] !== values['khId'] ||
          formData['projectId'] !== values['projectId'] ||
          formData['xtzcWl'] !== values['xtzcWl']
        ) {
          XtzcStore.findXtzcData({
            params: {
              khId: values['khId'],
              projectId: values['projectId'],
              xtzcWl: values['xtzcWl'],
            },
          }).then(() => {
            if (XtzcStore.xtzcData.length > 0) {
              secondForm.setFieldsValue({ xtzcMuti: true });
              setIsWlChecked(true);
            } else {
              setIsWlChecked(false);
            }
          });
        }
        if (XtzcStore.opt === 'add') {
          values['xtzcSqrid'] = sqrid;
          values['xtzcSqrbh'] = sqrbh;
          values['xtzcSqr'] = sqr;
          values['xtzcSqbm'] = XtzcStore.sqrbm;
          values['xtzcSsgs'] = XtzcStore.sqrdw;
          values['xtzcSqrq'] = moment().format('YYYY-MM-DD');
        } else {
          values['xtzcSqrq'] = moment(values['xtzcSqrq']);
        }

        if (values.hasOwnProperty('xtzcTrail')) {
          values['xtzcTrail'] = values['xtzcTrail'] === true ? '1' : '0';
        }
        if (values.hasOwnProperty('xtzcGrzc')) {
          values['xtzcGrzc'] = values['xtzcGrzc'] === true ? '1' : '0';
        }
        const entity = {};
        const { entries } = Object;
        entries(values).forEach(([key, value]) => {
          if (value) {
            entity[key] = value;
          }
        });
        XtzcStore.saveFormData(entity);
        // 查询产品数据
        XtzcStore.findProductData();
        break;
      case 1:
        secondForm.validateFields().then((values) => {
          if (XtzcStore.opt === 'add') {
            // 注册日期
            values['xtzcZcrq'] = moment().format('YYYY-MM-DD');
          } else {
            values['xtzcZcrq'] = moment(values['xtzcZcrq']);
            values['xtzcDqrq'] = moment(values['xtzcDqrq']);
          }

          if (values.hasOwnProperty('xtzcMuti')) {
            values['xtzcMuti'] = values['xtzcMuti'] === true ? '1' : '0';
          }
          const entity = {};
          const { entries } = Object;
          entries(values).forEach(([key, value]) => {
            if (value) {
              entity[key] = value;
            }
          });
          XtzcStore.saveFormData(entity);
          // 第三步的注册产品赋值
          if (XtzcStore.productSelectData.length > 0) {
            XtzcStore.productSelectData.forEach((p) => {
              if (values['productId'] === p.value) {
                thirdForm.setFieldsValue({ productName: p.label });
              }
            });
          }
          // 第三步的注册产品模型赋值
          if (XtzcStore.modelinfoSelectData.length > 0) {
            XtzcStore.modelinfoSelectData.forEach((m) => {
              if (values['modelinfoId'] === m.value) {
                thirdForm.setFieldsValue({ modelinfoName: m.label });
              }
            });
          }
          // 新增时根据产品id和模型id查询模型维护表nbgl_modelinfo和nbgl_model中的默认模型数据
          if (XtzcStore.opt === 'add') {
            // 查询左侧结构数据
            XtzcStore.findModelTreeData({
              id: values['modelinfoId'],
              productId: values['productId'],
            }).then(() => {
              // 查询右侧模块及功能数据
              XtzcStore.findModuleData(values['productId']).then(() => {
                // 左侧树形数据中有的模块,右侧不再出现
                refreshRightData();
              });
            });
          } else {
            // 修改和浏览根据系统注册id查询nbgl_xtzcmx表中的模型数据
            XtzcStore.findXtzcmxTree({
              modelinfoId: values['modelinfoId'],
              productId: values['productId'],
              xtzcId: XtzcStore.xtzcId,
            }).then(() => {
              // 查询右侧模块及功能数据
              XtzcStore.findModuleData(values['productId']).then(() => {
                // 左侧树形数据中有的模块,右侧不再出现
                refreshRightData();
              });
            });
          }
        });
        break;
      case 2:
        thirdForm.validateFields().then((values) => {
          if (values.hasOwnProperty('xtzcTuning')) {
            values['xtzcTuning'] = values['xtzcTuning'] === true ? '1' : '0';
          }
          const entity = {};

          const { entries } = Object;
          entries(values).forEach(([key, value]) => {
            if (value) {
              entity[key] = value;
            }
          });

          // 新增数据
          XtzcStore.saveFormData(entity).then(() => {
            if (XtzcStore.opt === 'add') {
              XtzcStore.saveXtzc(XtzcStore.formTempData).then((response) => {
                if (response && response.status === 201) {
                  saveXtzcmx();
                }
              });
            } else if (XtzcStore.opt === 'edit') {
              // 修改数据
              XtzcStore.updateXtzc(
                XtzcStore.formTempData,
                XtzcStore.xtzcId,
              ).then((response) => {
                if (response && response.status === 200) {
                  saveXtzcmx();
                }
              });
            }
          });
        });
        break;
    }
  };
  // 新增保存系统注册明细数据到数据库
  const saveXtzcmx = () => {
    const treeData = [...XtzcStore.modelTreeData];
    const modelList = [];
    let mkIndex = 1;
    let gnIndex = 1;
    // 原有的树形结构数据
    if (treeData.length > 0) {
      const mkData = treeData[0].children;
      if (mkData.length > 0) {
        mkData.forEach((m) => {
          // 模块数据 ( 导入的模块类型为V,则保存数据库为V)
          if (m.modelType === 'V') {
            modelList.push({
              xtzcId: XtzcStore.formTempData['id'],
              xtzcmxUmid: m.key,
              xtzcmxName: m.title,
              xtzcmxIndex: mkIndex++,
              xtzcmxType: 'V',
              whrid: sqrid,
              whr: sqr,
              whsj: whsj,
            });
          } else {
            modelList.push({
              xtzcId: XtzcStore.formTempData['id'],
              xtzcmxUmid: m.key,
              xtzcmxName: m.title,
              xtzcmxIndex: mkIndex++,
              xtzcmxType: 'D',
              whrid: sqrid,
              whr: sqr,
              whsj: whsj,
            });
          }

          const gnData = m.children;
          if (gnData.length > 0) {
            gnData.forEach((g) => {
              modelList.push({
                xtzcId: XtzcStore.formTempData['id'],
                xtzcmxUmid: g.key,
                xtzcmxName: g.title,
                xtzcmxPumid: m.key,
                xtzcmxIndex: gnIndex++,
                xtzcmxType: g.modelType,
                whrid: sqrid,
                whr: sqr,
                whsj: whsj,
              });
            });
          }
        });
      }

      XtzcStore.insertBatch(modelList).then((response) => {
        if (response && response.status === 200) {
          XtzcStore.findForPage(
            XtzcStore.page,
            XtzcStore.size,
            XtzcStore.params,
          );
          if (XtzcStore.opt === 'add') {
            message.success('系统注册数据添加成功!');
          } else {
            message.success('系统注册数据修改成功!');
          }
          XtzcStore.setIsvisible(false);
          XtzcStore.formData = {};
        } else {
          if (XtzcStore.opt === 'add') {
            message.success('系统注册数据添加失败!');
          } else {
            message.success('系统注册数据修改失败!');
          }
          XtzcStore.setIsvisible(false);
          XtzcStore.formData = {};
        }
      });
    }
  };

  const onFinish = () => {
    setStep(step + 1);
  };

  //定义客户弹窗table表格字段 --- 客户信息
  const khModalTableColumns = [
    {
      title: '客户编码',
      dataIndex: 'wldwcode',
      align: 'center',
      width: 80,
    },
    {
      title: '客户名称',
      dataIndex: 'wldwname',
      align: 'center',
      width: 120,
    },
  ];

  //客户信息弹框中的双击确认
  const onkhDoubleClickConfirm = (record) => {
    setKhvisible(false);
    firstForm.setFieldsValue({
      khId: record.id,
      wldwcode: record.wldwcode,
      wldwname: record.wldwname,
      projectId: null,
      projectCode: null,
      projectName: null,
    });
  };

  // 客户的查询按钮
  const onKhSearch = (value) => {
    XtzcStore.findKhData({ wldwkh: '1'}).then((response)=>{
      if(response&&response.status===200){
        if(response.data.length>0){
          setKhTableData(response.data);
        }
      }
    });
    setKhvisible(true);
   

  };
  //客户弹窗中模糊搜索
  const khModalSearch = (val) => {
    XtzcStore.findKhData({ wldwkh: '1', wldwname: val }).then((response) => {
      if (response.status === 200) {
        if (response.data.length > 0) {
          setKhTableData(response.data);
        } else {
          setKhTableData([]);
        }
      }
    });
  };

  const projectModalTableColumns = [
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      align: 'center',
      width: 80,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      align: 'center',
      width: 120,
    },
  ];
  // 项目的查询按钮
  const onXmSearch = (value) => {
    if(firstForm.getFieldValue('wldwcode')===undefined||firstForm.getFieldValue('khId')===''){
        return message.warn('请先选择客户');
    }
    //只获取该单位下的项目
    XtzcStore.findProjectData({ khId: firstForm.getFieldValue('khId') }).then(
      (response) => {
        if(response&&response.status===200){
           if(response.data.length>0){
              setProjectTableData(response.data);
              setXmvisible(true);
           }else{
              setProjectTableData([]);
              return message.success("查询成功,所选客户中没有项目存在");
           } 
        }
      },
    );
    
  };
  //项目弹窗中搜索
  const porjectModalSearch =(val)=>{
    //只获取该单位下的项目
    XtzcStore.findProjectData({ khId: firstForm.getFieldValue('khId'),projectName:val }).then(
      (response) => {
        if(response&&response.status===200){
           if(response.data.length>0){
              setProjectTableData(response.data);
           }else{
              setProjectTableData([]);
           } 
        }
      },
    );

  }
  //项目双击确认选择
  const onProjectDoubleClickConfirm = (record) => {
    setXmvisible(false);
    firstForm.setFieldsValue({ projectId: record.id });
    firstForm.setFieldsValue({ projectCode: record.projectCode });
    firstForm.setFieldsValue({ projectName: record.projectName });
  };


  // 关闭弹框
  const doExit = () => {
    if (XtzcStore.opt === 'view') {
      XtzcStore.isFormEdit = false;
      XtzcStore.setIsvisible(false);
    } else if (XtzcStore.opt === 'add' || XtzcStore.opt === 'edit') {
      Modal.confirm({
        type: 'warning',
        title: `确认关闭？`,
        content: '页面数据暂未保存，确定关闭？',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          XtzcStore.setIsvisible(false);
        },
      });
    }
    XtzcStore.findForPage(XtzcStore.page, XtzcStore.size, XtzcStore.params);
  };

  // 第一步：选择客户项目信息
  const firstContent = () => (
    <Card
      title="客户项目信息"
      type="inner"
      style={{ margin: '20px 165px 0px 165px' }}
    >
      <Form
        form={firstForm}
        {...formItemLayout}
        style={{ marginLeft: '-100px' }}
        onFinish={onFinish}
      >
        <Row>
          <Form.Item label="客户id:" name="khId" hidden />
          <Col span={12}>
            <Form.Item
              label="客户编号:"
              name="wldwcode"
              validateFirst
              rules={[
                { required: true, message: '请输入客户编号' },
                //输入的客户编号校验
                {
                  async validator(_, value, callback) {
                    const param = {
                      //类型为1的表示客户
                      params: { wldwKh: '1', wldwcode: value, source: 'add' },
                    };
                    return new Promise(async (resolve, reject) => {
                      await fetch
                        .get('/api/eps/nbgl/wldw/list/', { params: param })
                        .then((res) => {
                          if (res.data.length === 0) {
                            reject('客户不存在,请点击搜索选择客户');
                          } else {
                            //存在的情况下,项目id和名称
                            firstForm.setFieldsValue({
                              khId: res.data[0].id,
                              wldwname: res.data[0].wldwname,
                            });
                            return resolve(value);
                          }
                        });
                    });
                  },
                },
              ]}
            >
              <Input.Search
                onChange={() => {
                  firstForm.setFieldsValue({
                    projectId: null,
                    projectCode: null,
                    projectName: null,
                  });
                }}
                allowClear
                onSearch={(val) => onKhSearch(val)}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="客户名称:" name="wldwname">
              <Input allowClear disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="项目id:" name="projectId" hidden />
            <Form.Item
              label="项目编号:"
              name="projectCode"
              validateFirst
              rules={[
                { required: true, message: '请输入项目编号' },
                {
                  //输入的项目编号校验
                  validator(_, value, callback) {
                    const param = {
                      params: {
                        projectCode: value,
                        khId: firstForm.getFieldValue('khId'),
                        source: 'add',
                      },
                    };
                    return new Promise(async (resolve, reject) => {
                      await fetch
                        .get('/api/eps/nbgl/project/list/', { params: param })
                        .then((res) => {
                          if (res.data.length === 0) {
                            reject('项目不存在,请点击搜索选择项目');
                          } else {
                            //存在的情况下,项目id和名称
                            firstForm.setFieldsValue({
                              projectId: res.data[0].id,
                              projectName: res.data[0].projectName,
                            });
                            resolve(value);
                          }
                        });
                    });
                  },
                },
              ]}
            >
              <Input.Search
                allowClear
                onSearch={(val) => onXmSearch(val)}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="项目名称:" name="projectName">
              <Input allowClear disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="申请人id:" name="xtzcSqrid" hidden />
            <Form.Item label="申请人编号:" name="xtzcSqrbh" hidden />
            <Form.Item label="申请人:" name="xtzcSqr">
              <Input allowClear defaultValue={sqr} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="申请日期:" name="xtzcSqrq">
              <DatePicker
                defaultValue={moment(moment(), 'YYYY-MM-DD')}
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="申请人部门:" name="xtzcSqbm">
              <Input allowClear disabled defaultValue={XtzcStore.sqrbm} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="申请人单位:" name="xtzcSsgs">
              <Input allowClear disabled defaultValue={XtzcStore.sqrdw} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="试用版:" name="xtzcTrail" valuePropName="checked">
              <Checkbox disabled={XtzcStore.isFormEdit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="个人注册:"
              name="xtzcGrzc"
              valuePropName="checked"
            >
              <Checkbox disabled={XtzcStore.isFormEdit} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="网络:"
              name="xtzcWl"
              rules={[{ required: true, message: '请选择网络!' }]}
            >
              <Select style={{ width: '100%' }} disabled={XtzcStore.isFormEdit}>
                <Select.Option key="1" value="1">
                  政务网
                </Select.Option>
                <Select.Option key="2" value="2">
                  内网
                </Select.Option>
                <Select.Option key="3" value="3">
                  互联网
                </Select.Option>
                <Select.Option key="4" value="4">
                  其他网络
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="备注:" name="xtzcbz" labelCol={{ span: 4 }}>
              <Input.TextArea disabled={XtzcStore.isFormEdit} />
            </Form.Item>
          </Col>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={doNext}>
                下一步
              </Button>
              <Button
                type="primary"
                danger
                onClick={doExit}
                style={{ marginLeft: 10, borderLeft: 0 }}
              >
                关闭
              </Button>
            </Form.Item>
          </Button.Group>
        </div>
      </Form>
    </Card>
  );

  // 切换产品时,过滤模型数据
  const onProductChange = (value) => {
    XtzcStore.productId = value;
    // 根据产品id查询模型数据
    XtzcStore.findModelinfoData(value).then(() => {
      if (XtzcStore.modelinfoSelectData.length > 0) {
        XtzcStore.modelinfoId = XtzcStore.modelinfoSelectData[0]['value'];
        secondForm.setFieldsValue({
          modelinfoId: XtzcStore.modelinfoSelectData[0]['value'],
        });
        secondForm.setFieldsValue({
          modelinfoName: XtzcStore.modelinfoSelectData[0]['label'],
        });
      } else {
        secondForm.setFieldsValue({ modelinfoName: null });
      }
    });
  };

  // 切换模型时
  const onModelinfoChange = (value) => {
    XtzcStore.modelinfoId = value;
    if (XtzcStore.modelinfoSelectData.length > 0) {
      XtzcStore.modelinfoSelectData.forEach((m) => {
        if (value === m.value) {
          secondForm.setFieldsValue({ modelinfoName: m['label'] });
          secondForm.setFieldsValue({ modelinfoId: m['value'] });
        }
      });
    }
  };

  //按下键盘时触发,控制InputNumber整数框输入的值
  const keyPress = (event) => {
    //只要输入的内容是'+-eE'  ，就阻止元素发生默认的行为
    const invalidChars = ['-', '+', 'e', 'E', '.'];
    if (invalidChars.indexOf(event.key) !== -1) {
      event.preventDefault();
    }
  };

  //  有效期改变时,带出到期日期
  const onYxqChange = (value) => {
    var temp = new Date(moment().format('YYYY-MM-DD'));
    temp.setMonth(temp.getMonth() + value);
    var xtzcDqrq =
      temp.getFullYear() +
      '-' +
      ((temp.getMonth() < 9 ? '0' : '') + (temp.getMonth() + 1)) +
      '-' +
      (temp.getDate() < 10 ? '0' : '') +
      temp.getDate();
    secondForm.setFieldsValue({ xtzcDqrq: xtzcDqrq });
  };

  // 第二步：填写注册信息
  const secondContent = () => (
    <Card
      title="注册信息"
      type="inner"
      style={{ margin: '20px 165px 0px 165px' }}
    >
      <Form
        form={secondForm}
        {...formItemLayout}
        style={{ marginLeft: '-100px' }}
        onFinish={onFinish}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="注册单位名称:"
              name="xtzcZcdwmc"
              rules={[{ required: true, message: '请输入注册单位名称' }]}
            >
              <Input allowClear disabled={XtzcStore.isFormEdit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="注册系统名称:"
              name="xtzcZcxtmc"
              rules={[{ required: true, message: '请输入注册单位名称' }]}
            >
              <Input allowClear disabled={XtzcStore.isFormEdit} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="注册产品:"
              name="productId"
              rules={[{ required: true, message: '请选择注册产品!' }]}
            >
              <Select
                allowClear
                style={{ width: '100%' }}
                options={XtzcStore.productSelectData}
                onChange={onProductChange}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册产品模型id:" name="modelinfoId" hidden>
              <Select
                style={{ width: '100%' }}
                allowClear
                options={XtzcStore.modelinfoSelectData}
              />
            </Form.Item>
            <Form.Item
              label="注册产品模型:"
              name="modelinfoName"
              rules={[{ required: true, message: '请选择注册产品模型!' }]}
            >
              <Select
                style={{ width: '100%' }}
                allowClear
                options={XtzcStore.modelinfoSelectData}
                onChange={onModelinfoChange}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="注册日期:" name="xtzcZcrq">
              <DatePicker
                defaultValue={moment(moment(), 'YYYY-MM-DD')}
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="有效期(月):"
              name="xtzcYxq"
              rules={[{ required: true, message: '请输入有效期!' }]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: '100%' }}
                onKeyPress={keyPress}
                onChange={onYxqChange}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="到期日期:" name="xtzcDqrq">
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="用户数量:"
              name="xtzcZcyhs"
              rules={[{ required: true, message: '请输入用户数量!' }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                onKeyPress={keyPress}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="单位数量:"
              name="xtzcDws"
              rules={[{ required: true, message: '请输入单位数量!' }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                onKeyPress={keyPress}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="档案库数量:"
              name="xtzcDaks"
              rules={[{ required: true, message: '请输入档案库数量!' }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                onKeyPress={keyPress}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="数据库类型:"
              name="xtzcDbtype"
              rules={[{ required: true, message: '请选择数据库类型!' }]}
            >
              <Select style={{ width: '100%' }} disabled={XtzcStore.isFormEdit}>
                <Select.Option key="1" value="1">
                  MSSQL
                </Select.Option>
                <Select.Option key="2" value="2">
                  ORACLE
                </Select.Option>
                <Select.Option key="3" value="3">
                  MYSQL
                </Select.Option>
                <Select.Option key="4" value="4">
                  KINGBASE
                </Select.Option>
                <Select.Option key="5" value="5">
                  DM
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="多次注册:"
              name="xtzcMuti"
              valuePropName="checked"
              hidden={!isWlChecked}
            >
              <Checkbox disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="多次注册原因:"
              name="xtzcMutirsn"
              labelCol={{ span: 4 }}
              rules={[
                { required: isWlChecked, message: '请输入多次注册原因!' },
              ]}
              hidden={!isWlChecked}
            >
              <Input.TextArea disabled={!isWlChecked} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item hidden label="附件数量" name="xtzcFjs">
              <Input />
            </Form.Item>
            <Form.Item
              label="导入注册信息:"
              name="xtzcFilegrpid"
              labelCol={{ span: 4 }}
            >
              <Upload
                name="importRegisterFile"
                action={'/api/eps/nbgl/xtzc/uploadregister'}
                onChange={(info) => {
                  if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                  }
                  if (info.file.status === 'done') {
                    XtzcStore.getFileGrpid()
                      .then((r) => {
                        secondForm.setFieldsValue({
                          xtzcFilegrpid: XtzcStore.xtzcFilegrpid,
                          xtzcFjs: info.fileList.length,
                        });
                      })
                      .then(() => {
                        message.success(`${info.file.name} 文件上传成功.`);
                      });
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                  }
                }}
                accept=".rgt"
                multiple
                listType={'text'}
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={XtzcStore.isFormEdit}
                >
                  上传文件
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={doPrev}>
              {' '}
              上一步{' '}
            </Button>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 10 }}
                onClick={doNext}
              >
                下一步
              </Button>
              <Button
                type="primary"
                danger
                onClick={doExit}
                style={{ marginLeft: 10, borderLeft: 0 }}
              >
                关闭
              </Button>
            </Form.Item>
          </Button.Group>
        </div>
      </Form>
    </Card>
  );

  //控制左右箭头是否可以点击
  const [isArrowClick, setIsArrowClick] = useState(false);
  // 允许扩展选择框改变
  const onTuningChange = (value) => {
    setIsArrowClick(value.target.checked);
  };

  // 控制新增模块文件夹弹框是否可见
  const [moduleVisible, setModulevisible] = useState(false);
  // 新增模块文件夹数据
  const onAddModule = () => {
    const treeData = [...XtzcStore.modelTreeData];
    const moduleSelectImportData = [...XtzcStore.moduleSelectImportData];
    if (moduleSelectImportData.length > 0) {
      if (treeData.length > 0 && treeData[0].children.length > 0) {
        treeData[0].children.forEach((t) => {
          for (let i = 0; i < moduleSelectImportData.length; i++) {
            if (t.key === moduleSelectImportData[i].code) {
              moduleSelectImportData.splice(i, 1);
            }
          }
        });
      }
    }
    XtzcStore.setModuleSelectImportData(moduleSelectImportData).then(() => {
      setModulevisible(true);
    });
  };
  // 右侧功能table表格的onChange事件
  const onTableRowChange = (selectedRowKeys, records) => {
    XtzcStore.setSelectRows(selectedRowKeys, records);
  };

  // 切换右侧模块数据
  const onModuleChange = (value) => {
    const treeData = [...XtzcStore.modelTreeData];
    // 根据当前产品id和模型id查询树形结构数据
    XtzcStore.findFuncData(value).then(() => {
      const funcData = [...XtzcStore.funcData];
      if (treeData.length > 0 && treeData[0].children.length > 0) {
        treeData[0].children.forEach((mk) => {
          if (mk.children.length > 0 && funcData.length > 0) {
            mk.children.forEach((gn) => {
              for (let i = 0; i < funcData.length; i++) {
                if (funcData[i].funcCode === gn.key) {
                  funcData.splice(i, 1);
                }
              }
            });
          }
        });
        XtzcStore.setFuncData(funcData);
      }
    });
  };
  // 树形选中事件
  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      XtzcStore.isSelect = true;
      XtzcStore.treeMxId = '';
      XtzcStore.treeMkId = '';
      XtzcStore.treeGnId = '';
      // 删除文件夹的判断
      if (info.node.nodeType === 'model') {
        XtzcStore.treeMxId = selectedKeys[0];
      } else if (info.node.nodeType === 'module') {
        XtzcStore.treeMkId = selectedKeys[0];
      } else if (info.node.nodeType === 'func') {
        XtzcStore.treeGnId = selectedKeys[0];
      }
    } else {
      XtzcStore.isSelect = false;
    }
  };

  // 删除模块文件夹的提示弹框的确定按钮
  const handleMkDeleteOk = async () => {
    if (XtzcStore.treeMkId) {
      const treeData = [...XtzcStore.modelTreeData];
      treeData[0].children = treeData[0].children.filter(
        (f) => f.key !== XtzcStore.treeMkId,
      );
      XtzcStore.setModelTreeData(treeData);

      // 刷新右侧模块及功能数据
      XtzcStore.findModuleData(XtzcStore.productId).then(() => {
        // 左侧树形数据中有的模块,右侧不再出现
        refreshRightData();
      });
    }
    XtzcStore.isSelect = false;
  };
  // 删除模块文件夹的提示弹框
  const showMkDeleteconfirm = () => {
    Modal.confirm({
      title: '确定要删除该模块数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleMkDeleteOk,
      onCancel: handleCancel,
    });
  };

  // 删除模块文件夹功能
  const onMkDetele = () => {
    if (XtzcStore.isSelect) {
      if (XtzcStore.treeGnId) {
        message.warn('此为功能,不可删除!');
      }
      if (XtzcStore.treeMxId) {
        message.warn('此为模型,不可删除!');
      }
      if (XtzcStore.treeMkId) {
        showMkDeleteconfirm();
      }
    } else {
      message.warn('请先选择文件夹!');
    }
  };

  // 删除功能的提示弹框的确定按钮
  const handleGnDeleteOk = async () => {
    if (XtzcStore.treeGnId) {
      const treeData = [...XtzcStore.modelTreeData];
      if (treeData.length > 0 && treeData[0].children.length > 0) {
        treeData[0].children.forEach((m) => {
          if (m.children.length > 0) {
            m.children = m.children.filter((f) => f.key !== XtzcStore.treeGnId);
          }
        });
        XtzcStore.setModelTreeData(treeData);
      }
      //  刷新右侧模块数据即功能数据
      XtzcStore.findModuleData(XtzcStore.productId).then(() => {
        // 左侧树形数据中有的模块,右侧不再出现
        refreshRightData();
      });
    }
    XtzcStore.isSelect = false;
  };
  const handleCancel = () => {
    Modal.destroyAll();
  };
  // 删除功能的提示弹框
  const showGnDeleteconfirm = () => {
    Modal.confirm({
      title: '确定要删除该功能数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleGnDeleteOk,
      onCancel: handleCancel,
    });
  };
  // 删除功能
  const onGnDetele = () => {
    if (XtzcStore.isSelect) {
      if (XtzcStore.treeGnId) {
        showGnDeleteconfirm();
      }
      if (XtzcStore.treeMxId) {
        message.warn('此为模型,不可删除!');
      }
      if (XtzcStore.treeMkId) {
        message.warn('此为模块,不可删除!');
      }
    } else {
      message.warn('请先选择功能!');
    }
  };
  // 拖拽节点，实现上下移动
  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...XtzcStore.modelTreeData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        if (dropKey === item.key && item.nodeType === 'func') {
          message.warn('不可拖动至功能下!');
          if (dragObj.nodeType === 'module') {
            if (data.length > 0) {
              data[0].children.push(dragObj);
            }
          } else if (data.length > 0 && data[0].children.length > 0) {
            data[0].children.forEach((mk) => {
              if (mk.key === dragObj.modelPumid) {
                mk.children.push(dragObj);
              }
            });
          }
        } else if (
          dropKey === item.key &&
          dragObj.nodeType === 'module' &&
          item.nodeType === 'module'
        ) {
          message.warn('模块不可拖动至模块下!');
          if (data.length > 0) {
            data[0].children.push(dragObj);
          }
        } else {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        }
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      info.node.props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        if (dropKey === item.key && item.nodeType === 'func') {
          message.warn('不可拖动至功能下!');
          if (dragObj.nodeType === 'module') {
            if (data.length > 0) {
              data[0].children.push(dragObj);
            }
          } else if (data.length > 0 && data[0].children.length > 0) {
            data[0].children.forEach((mk) => {
              if (mk.key === dragObj.modelPumid) {
                mk.children.push(dragObj);
              }
            });
          }
        } else if (
          dropKey === item.key &&
          dragObj.nodeType === 'module' &&
          item.nodeType === 'module'
        ) {
          message.warn('模块不可拖动至模块下!');
          if (data.length > 0) {
            data[0].children.push(dragObj);
          }
        } else if (dropKey === item.key && item.nodeType === 'model') {
          message.warn('不可拖动为模型!');
          if (data.length > 0) {
            data[0].children.push(dragObj);
          }
        } else {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        }
      });
    } else {
      let ar;
      let i;
      let it;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
        it = item;
      });
      if (dropPosition === -1) {
        if (it.nodeType === 'model') {
          message.warn('不可拖动为模型!');
          if (dragObj.nodeType === 'module') {
            if (data.length > 0) {
              data[0].children.push(dragObj);
            }
          } else if (data.length > 0 && data[0].children.length > 0) {
            data[0].children.forEach((mk) => {
              if (mk.key === dragObj.modelPumid) {
                mk.children.push(dragObj);
              }
            });
          }
        } else {
          ar.splice(i, 0, dragObj);
        }
      } else if (it.nodeType === 'func' && dragObj.nodeType === 'module') {
        message.warn('模块不可拖动至模块下!');
        data[0].children.push(dragObj);
      } else if (it.nodeType === 'model') {
        message.warn('不可拖动为模型!');
        data[0].children.push(dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    XtzcStore.setModelTreeData(data);
  };
  const onLeftMove = () => {
    const treeData = [...XtzcStore.modelTreeData];
    if (!XtzcStore.selectRowRecords || XtzcStore.selectRowRecords.length < 1) {
      return message.warning('请在右侧至少选择一条数据!');
    }
    if (XtzcStore.isSelect) {
      if (XtzcStore.treeMkId) {
        if (XtzcStore.selectRowRecords.length > 0) {
          XtzcStore.selectRowRecords.forEach((gn) => {
            if (treeData.length > 0 && treeData[0].children.length > 0) {
              treeData[0].children.forEach((t) => {
                if (XtzcStore.treeMkId === t.key) {
                  t.children.push({
                    key: gn.funcCode,
                    title: gn.funcName,
                    modelinfoId: treeData[0].modelinfoId,
                    productId: treeData[0].productId,
                    nodeType: 'func',
                    modelType: gn.funcType,
                    modelPumid: XtzcStore.treeMkId,
                    children: [],
                  });
                }
              });
            }
          });
          XtzcStore.setSelectRows([], []);
          XtzcStore.setModelTreeData(treeData).then(() => {
            // 查询右侧模块及功能数据
            XtzcStore.findModuleData(XtzcStore.productId).then(() => {
              // 左侧树形数据中有的模块,右侧不再出现
              refreshRightData();
            });
          });
        }
      } else {
        message.warn('不是模块文件夹,不能添加功能!');
      }
    } else {
      message.warn('请选择左侧模块文件夹!');
    }
  };

  // 往右移动功能数据
  const onRightMove = () => {
    if (XtzcStore.isSelect) {
      if (XtzcStore.treeGnId) {
        const treeData = [...XtzcStore.modelTreeData];
        if (treeData.length > 0 && treeData[0].children.length > 0) {
          treeData[0].children.forEach((m) => {
            if (m.children.length > 0) {
              m.children = m.children.filter(
                (f) => f.key !== XtzcStore.treeGnId,
              );
            }
          });
          XtzcStore.setModelTreeData(treeData);
        }

        //  刷新右侧模块数据即功能数据
        XtzcStore.findModuleData(XtzcStore.productId).then(() => {
          // 左侧树形数据中有的模块,右侧不再出现
          refreshRightData();
        });
        XtzcStore.isSelect = false;
      }
      if (XtzcStore.treeMxId) {
        message.warn('此为模型,不可右移!');
      }
      if (XtzcStore.treeMkId) {
        message.warn('此为模块,不可右移!');
      }
    } else {
      message.warn('请先选择左侧功能!');
    }
  };

  // 第三步：查看和选择注册模块信息
  const thirdContent = () => (
    <Card
      title="注册模块信息"
      type="inner"
      style={{ margin: '20px 165px 0px 165px' }}
    >
      <Form
        form={thirdForm}
        {...formItemLayout}
        style={{ marginLeft: '-100px' }}
        onFinish={() => {
          onFinish;
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="注册产品:" name="productName">
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册产品模型:" name="modelinfoName">
              <Input allowClear disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="允许扩展:"
              name="xtzcTuning"
              valuePropName="checked"
            >
              <Checkbox
                onChange={onTuningChange}
                disabled={XtzcStore.isFormEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="thirdContext">
              <Button
                onClick={onAddModule}
                disabled={XtzcStore.isFormEdit}
                type="primary"
                className="thirdBtn"
                icon={<FileAddOutlined />}
              >
                新增模块文件夹
              </Button>
              <Button
                onClick={onMkDetele}
                disabled={XtzcStore.isFormEdit}
                type="primary"
                danger
                className="thirdBtn"
                icon={<DeleteOutlined />}
              >
                删除模块文件夹
              </Button>
              <Button
                onClick={onGnDetele}
                disabled={XtzcStore.isFormEdit}
                type="primary"
                danger
                className="thirdBtn"
                icon={<DeleteOutlined />}
              >
                删除功能
              </Button>
            </div>
            <div className="thirdBottom">
              <Row>
                <Col offset={1} span={10}>
                  <Tree
                    disabled={XtzcStore.isFormEdit}
                    showLine
                    defaultExpandAll
                    onSelect={onSelect}
                    treeData={XtzcStore.modelTreeData}
                    draggable
                    onDrop={onDrop}
                    height={430}
                  />
                </Col>
                <Col>
                  <div className="leftLine" />
                </Col>
                <Col>
                  <Row style={{ marginTop: '155px' }}>
                    <Button
                      icon={<RightOutlined />}
                      onClick={onRightMove}
                      disabled={!isArrowClick}
                      style={{ width: '30px', height: '30px' }}
                    />
                  </Row>
                  <Row style={{ marginTop: '20px' }}>
                    <Button
                      icon={<LeftOutlined />}
                      onClick={onLeftMove}
                      disabled={!isArrowClick}
                      style={{ width: '30px', height: '30px' }}
                    />
                  </Row>
                </Col>
                <Col>
                  <div className="rightLine" />
                </Col>
                <Col offset={1} span={10}>
                  <Form form={rightForm} {...formItemLayout}>
                    <Form.Item name="moduleName">
                      <Select
                        style={{ width: 200 }}
                        options={XtzcStore.moduleSelectData}
                        onChange={onModuleChange}
                        disabled={XtzcStore.isFormEdit}
                      />
                    </Form.Item>
                  </Form>
                  <Table
                    columns={columns}
                    rowKey="id"
                    dataSource={
                      XtzcStore.isShow === true ? XtzcStore.funcData : ''
                    }
                    bordered
                    scroll={{ x: 'max-content', y: 330 }}
                    style={{ marginTop: '2%' }}
                    pagination={false}
                    rowSelection={{
                      onChange: onTableRowChange,
                      selectedRowKeys: XtzcStore.selectedRowKeys,
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={doPrev}>
              {' '}
              上一步{' '}
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={doNext}
              hidden={XtzcStore.isFormEdit}
            >
              {' '}
              提交审批{' '}
            </Button>
            <Button
              type="primary"
              danger
              onClick={doExit}
              style={{ marginLeft: 10, borderLeft: 0 }}
            >
              关闭
            </Button>
          </Button.Group>
        </div>
      </Form>
    </Card>
  );

  // 第三步右侧的功能表格
  const columns = [
    {
      title: '功能编号',
      dataIndex: 'funcCode',
      width: 150,
      align: 'center',
    },
    {
      title: '功能名称',
      dataIndex: 'funcName',
      width: 250,
      align: 'center',
    },
  ];
  //项目弹窗自定义搜索
  const customAction = (store, row) => {
    return (
      <Input.Search
        style={{ width: 300 }}
        onSearch={(record) => {
          const tableStore = refXm.current.getTableStore();
          tableStore.findByKey(
            tableStore.key,
            tableStore.page,
            tableStore.size,
            {
              khId: firstForm.getFieldValue('khId'),
              projectName: record,
            },
          );
        }}
      />
    );
  };
  return (
    <>
      <div className="hallRegist">
        <div className="editForm">
          <Steps current={step}>
            {steps.map((item) => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
        <div className="editContext">
          {step === 0 && firstContent()}
          {step === 1 && secondContent()}
          {step === 2 && thirdContent()}
        </div>
      </div>


      <Modal
        title="客户信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={khVisible}
        onCancel={() => setKhvisible(false)}
        width={1000}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        <Form id="kh-modal-table-seach-form">
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => khModalSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入客户名称"
            />
          </Form.Item>
        </Form>
        <Table
          id={'kh-modal-table'}
          dataSource={khTableData}
          scroll={{ y: 400 }}
          columns={khModalTableColumns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onkhDoubleClickConfirm(record),
            };
          }}
        />
      </Modal>

      <Modal
        title="项目信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={xmVisible}
        onCancel={() => setXmvisible(false)}
        width={1000}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        <Form id="project-modal-table-seach-form">
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => porjectModalSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入项目名称"
            />
          </Form.Item>
        </Form>
        <Table
          id={'project-modal-table'}
          dataSource={projectTableData}
          scroll={{ y: 400 }}
          columns={projectModalTableColumns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onProjectDoubleClickConfirm(record),
            };
          }}
        />
      </Modal>

      {/* 新增模块文件夹弹框 */}
      <ModuleAddDailog
        moduleVisible={moduleVisible}
        setModulevisible={setModulevisible}
        rightForm={rightForm}
      />
    </>
  );
});

export default Addxtzc;
