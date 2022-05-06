import { observer } from 'mobx-react';
import React from 'react';
import { Form, Input, Select, Modal, message, Radio, Row, Col, Space } from 'antd';
import ModelinfoStore from '../../../stores/Ngbl/ModelinfoStore';

/**
 * 新增模块文件夹的弹框
 */
const formItemLayout = {
  labelCol: {
    span: 8,
  },
};

const ModuleAddDailog = observer(props => {
  const { moduleVisible, setModulevisible, rightForm } = props;
  const [addForm] = Form.useForm();

  // 新增模块文件夹时生成编号
  const creatMkcode = () => {
    let code = '';
    // 设置长度，这里看需求，我这里设置了4
    const codeLength = 4;
    // 设置随机字符
    const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 循环codeLength 我设置的4就是循环4次
    for (let i = 0; i < codeLength; i++) {
      // 设置随机数范围,这设置为0 ~ 36
      const index = Math.floor(Math.random() * 9);
      // 字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    }
    return `V${code}`;
  }

  const onModuleOk = () => {
    const treeData = [...ModelinfoStore.modelTreeData];
    const treeFuncData = [];
    // 导入模块部分
    if (ModelinfoStore.radioChecked === 'import') {
      // 获取当前选中的模块id
      const moduleId = addForm.getFieldValue('moduleId');
      if (moduleId !== undefined) {
        ModelinfoStore.findFuncData(moduleId).then(() => {
          ModelinfoStore.isShow = false;
          if (ModelinfoStore.moduleData.length > 0) {
            ModelinfoStore.moduleData.forEach((m) => {
              if (m.id === moduleId) {
                if (treeData.length > 0) {
                  if (ModelinfoStore.funcData.length > 0) {
                    ModelinfoStore.funcData.forEach((f) => {
                      treeFuncData.push({
                        'key': f.funcCode, 'title': f.funcName, 'modelinfoId': treeData[0].modelinfoId,
                        'productId': treeData[0].productId, 'nodeType': 'func', 'modelPumid': m.moduleCode, 'modelType': f.funcType, 'children': []

                      });
                    });
                  }
                  treeData[0].children.push({
                    'key': m.moduleCode, 'title': m.moduleName, 'modelinfoId': treeData[0].modelinfoId,
                    'productId': treeData[0].productId, 'nodeType': 'module', 'children': treeFuncData, 'modelType': m.moduleType
                  });
                }
              }
            });
            // 刷新左侧树形数据
            ModelinfoStore.setModelTreeData(treeData);
            // 刷新右侧模块数据及功能数据
            let moduleSelectData = [...ModelinfoStore.moduleSelectData];
            if (moduleSelectData.length > 0) {
              moduleSelectData = moduleSelectData.filter(f => f.value !== moduleId);
              ModelinfoStore.setModuleSelectData(moduleSelectData);
              rightForm.setFieldsValue({ "moduleName": moduleSelectData[0].label });
              ModelinfoStore.findFuncData(moduleSelectData[0].value).then(() => {
                const funcData = [...ModelinfoStore.funcData];
                for (let i = 0; i < moduleSelectData.length; i++) {
                  if (treeData.length > 0 && treeData[0].children.length > 0) {
                    treeData[0].children.forEach((t) => {
                      // 获取右侧最新模块下的功能数据
                      if (t.key === moduleSelectData[i].code && t.children.length > 0 && funcData.length > 0) {
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
                    ModelinfoStore.isShow = true;
                  }
                }
                ModelinfoStore.setFuncData(funcData);
              });
            }

            // 刷新弹框导入模块数据
            let moduleSelectImportData = [...ModelinfoStore.moduleSelectImportData];
            if (moduleSelectImportData.length > 0) {
              moduleSelectImportData = moduleSelectImportData.filter(f => f.value !== moduleId);
              ModelinfoStore.setModuleSelectImportData(moduleSelectImportData);
            }
            // 关闭新增模块文件夹弹框
            addForm.setFieldsValue({ "moduleId": null });
            setModulevisible(false);
          }
        });
      } else {
        message.warn('请选择导入模块!');
      }
    } else if (ModelinfoStore.radioChecked === 'define') {
      const mkmc = addForm.getFieldValue('mkmc');
      if (mkmc !== undefined) {
        if (treeData.length > 0) {
          treeData[0].children.push({
            'key': creatMkcode(), title: mkmc, 'modelinfoId': treeData[0].modelinfoId,
            'productId': treeData[0].productId, 'nodeType': 'module', 'children': [], 'modelType': 'D'
          });
          // 刷新左侧树形数据
          ModelinfoStore.setModelTreeData(treeData);
          // 关闭新增模块文件夹弹框
          addForm.setFieldsValue({ "mkmc": null });
          setModulevisible(false);
        } else {
          message.warn('请输入模块名称!');
        }
      } else {
        message.warn('请选择模块或者输入模块名称!');
      }
    }
  }
  const onRadioChange = (value) => {
    ModelinfoStore.radioChecked = value.target.value;
  }

  return (
    <Modal
      title="模块信息"
      centered
      forceRender={true}          //  强制渲染modal
      visible={moduleVisible}
      onOk={() => { onModuleOk() }}
      onCancel={() => setModulevisible(false)}
      width={400}
    >
      <Form form={addForm} {...formItemLayout}>
        <Row>
          <Col>
            <Radio.Group onChange={onRadioChange} value={ModelinfoStore.radioChecked}>
              <Space direction="vertical">
                <Row style={{ marginTop: '5px' }}>
                  <Radio value="import">导入模块:</Radio>
                </Row>
                <Row style={{ marginTop: '25px' }}>
                  <Radio value="define">模块名称:</Radio>
                </Row>
              </Space>
            </Radio.Group>
          </Col>
          <Col>
            <Row>
              <Form.Item name="moduleId">
                <Select style={{ width: 250 }} allowClear options={ModelinfoStore.moduleSelectImportData} />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item name="mkmc">
                <Input style={{ width: 250 }} allowClear />
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Form>

    </Modal >
  );
});

export default ModuleAddDailog;
