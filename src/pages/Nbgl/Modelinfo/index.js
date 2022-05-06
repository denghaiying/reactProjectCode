import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Tree,
  message,
  Select,
  Modal,
} from 'antd';
import {
  FileAddOutlined,
  DeleteOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import ModelinfoStore from '../../../stores/Ngbl/ModelinfoStore';
import './index.less';
import ModelAddDailog from './ModelAddDailog';
import ModuleAddDailog from './ModuleAddDailog';
import moment from 'moment';
import SysStore from '../../../stores/system/SysStore';

const Modelinfo = observer((props) => {
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
  };
  // 左侧查询表单
  const [treeForm] = Form.useForm();
  // 右侧表单
  const [rightForm] = Form.useForm();
  // 获取当前用户名称和维护时间
  const whrid = SysStore.getCurrentUser().id;
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');

  // 刷新右侧模块数据即功能数据
  const refreshRightData = () => {
    const treeData = [...ModelinfoStore.modelTreeData];
    const moduleSelectData = [...ModelinfoStore.moduleSelectData];
    if (moduleSelectData.length > 0) {
      rightForm.setFieldsValue({ moduleName: moduleSelectData[0].label });
      ModelinfoStore.findFuncData(moduleSelectData[0].value).then(() => {
        const funcData = [...ModelinfoStore.funcData];
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
          ModelinfoStore.isShow = true;
        }
        ModelinfoStore.setFuncData(funcData);
      });
    }
  };

  useEffect(() => {
    ModelinfoStore.findProductData().then(() => {
      treeForm.setFieldsValue({ productId: ModelinfoStore.defalutProductname });
      // 查询模型数据、左侧树形数据
      ModelinfoStore.findModelinfoData(ModelinfoStore.productId).then(() => {
        treeForm.setFieldsValue({
          modelinfoName: ModelinfoStore.defaluModelinfoname,
        });
        // 查询左侧结构数据
        ModelinfoStore.findModelTreeData({
          id: ModelinfoStore.modelinfoId,
          productId: ModelinfoStore.productId,
        }).then(() => {
          // 查询右侧模块及功能数据
          ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
            // 左侧树形数据中有的模块,右侧不再出现
            refreshRightData();
          });
        });
      });
    });
  }, []);

  const columns = [
    {
      title: '功能编号',
      dataIndex: 'funcCode',
      width: 250,
    },
    {
      title: '功能名称',
      dataIndex: 'funcName',
      width: 250,
    },
  ];

  // 控制新增模型弹框是否可见
  const [modelVisible, setModelvisible] = useState(false);
  // 新增模型数据
  const onAddModel = () => {
    setModelvisible(true);
  };

  // 切换产品时,过滤模型数据
  const onProductChange = (value) => {
    ModelinfoStore.productId = value;
    // 根据产品id查询模型数据
    ModelinfoStore.findModelinfoData(value).then(() => {
      if (ModelinfoStore.modelinfoSelectData.length > 0) {
        //产品切换自动显示第一个模型
        treeForm.setFieldsValue({
          modelinfoName: ModelinfoStore.modelinfoSelectData[0]['label'],
        });
        ModelinfoStore.modelinfoId =
          ModelinfoStore.modelinfoSelectData[0]['value'];
        // 根据当前产品id和模型id查询树形结构数据
        ModelinfoStore.findModelTreeData({
          id: ModelinfoStore.modelinfoSelectData[0]['value'],
          productId: value,
        }).then(() => {});
      } else {

        treeForm.setFieldsValue({ modelinfoName: null });
        ModelinfoStore.setModelTreeData([]);
      }

    }).then(()=>{
            // 根据产品id查询右侧模块数据及功能数据
            ModelinfoStore.findModuleData(value).then(() => {
              // 左侧树形数据中有的模块,右侧不再出现
              debugger
              refreshRightData();
            });
    });

    ModelinfoStore.isSelect = false;
  };

  // 切换模型数据
  const onModelinfoChange = (value) => {
    ModelinfoStore.modelinfoId = value;
    // 根据当前产品id和模型id查询树形结构数据
    ModelinfoStore.findModelTreeData({
      id: value,
      productId: ModelinfoStore.productId,
    }).then(() => {
      // 根据产品id查询右侧模块数据及功能数据
      ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
        // 左侧树形数据中有的模块,右侧不再出现
        refreshRightData();
      });
    });
    ModelinfoStore.isSelect = false;
  };

  // 删除模型的提示弹框的确定按钮
  const handleModelDeleteOk = async () => {
    ModelinfoStore.deleteModel(ModelinfoStore.modelinfoId).then((response) => {
      if (response) {
        message.success('模型数据删除成功!');
        ModelinfoStore.findModelinfoData(ModelinfoStore.productId).then(() => {
          if (ModelinfoStore.modelinfoSelectData.length > 0) {
            treeForm.setFieldsValue({
              modelinfoName: ModelinfoStore.modelinfoSelectData[0].label,
            });
            // 根据当前产品id和模型id查询树形结构数据
            ModelinfoStore.findModelTreeData({
              id: ModelinfoStore.modelinfoSelectData[0].value,
              productId: ModelinfoStore.productId,
            }).then(() => {});
          } else {
            treeForm.setFieldsValue({ modelinfoName: null });
            ModelinfoStore.setModelTreeData([]);
          }
          ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
            // 左侧树形数据中有的模块,右侧不再出现
            refreshRightData();
          });
        });
      } else {
        message.error('模型数据删除失败!');
      }
    });
  };
  const handleCancel = () => {
    Modal.destroyAll();
  };
  // 删除模型的提示弹框
  const showModelDeleteconfirm = () => {
    Modal.confirm({
      title: '确定要删除该模型数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleModelDeleteOk,
      onCancel: handleCancel,
    });
  };
  // 删除模型功能
  const onModelDelete = () => {
    showModelDeleteconfirm();
  };

  // 树形选中事件
  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      ModelinfoStore.isSelect = true;
      ModelinfoStore.treeMxId = '';
      ModelinfoStore.treeMkId = '';
      ModelinfoStore.treeGnId = '';
      // 删除文件夹的判断
      if (info.node.nodeType === 'model') {
        ModelinfoStore.treeMxId = selectedKeys[0];
      } else if (info.node.nodeType === 'module') {
        ModelinfoStore.treeMkId = selectedKeys[0];
      } else if (info.node.nodeType === 'func') {
        ModelinfoStore.treeGnId = selectedKeys[0];
      }
    } else {
      ModelinfoStore.isSelect = false;
    }
  };

  // 删除模块文件夹的提示弹框的确定按钮
  const handleMkDeleteOk = async () => {
    if (ModelinfoStore.treeMkId) {
      const treeData = [...ModelinfoStore.modelTreeData];
      treeData[0].children = treeData[0].children.filter(
        (f) => f.key !== ModelinfoStore.treeMkId,
      );
      ModelinfoStore.setModelTreeData(treeData);

      // 刷新右侧模块及功能数据
      ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
        // 左侧树形数据中有的模块,右侧不再出现
        refreshRightData();
      });
    }
    ModelinfoStore.isSelect = false;
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
    if (ModelinfoStore.isSelect) {
      if (ModelinfoStore.treeGnId) {
        message.warn('此为功能,不可删除!');
      }
      if (ModelinfoStore.treeMxId) {
        message.warn('此为模型,不可删除!');
      }
      if (ModelinfoStore.treeMkId) {
        showMkDeleteconfirm();
      }
    } else {
      message.warn('请先选择文件夹!');
    }
  };

  // 控制新增模块文件夹弹框是否可见
  const [moduleVisible, setModulevisible] = useState(false);
  // 新增模块文件夹数据
  const onAddModule = () => {
    const treeData = [...ModelinfoStore.modelTreeData];
    const moduleSelectImportData = [...ModelinfoStore.moduleSelectImportData];
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
    ModelinfoStore.setModuleSelectImportData(moduleSelectImportData).then(
      () => {
        setModulevisible(true);
      },
    );
  };

  // 切换右侧模块数据
  const onModuleChange = (value) => {
    const treeData = [...ModelinfoStore.modelTreeData];
    let moduleCode = '';
    // 获取当前模块的code值
    const moduleSelectData = [...ModelinfoStore.moduleSelectData];
    if (moduleSelectData.length > 0) {
      moduleSelectData.forEach((m) => {
        if (value === m.value) {
          moduleCode = m.code;
        }
      });
    }
    // 根据当前产品id和模型id查询树形结构数据
    ModelinfoStore.findFuncData(value).then(() => {
      debugger
      const funcData = [...ModelinfoStore.funcData];
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
        ModelinfoStore.setFuncData(funcData);
      }
    });
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
    const data = [...ModelinfoStore.modelTreeData];
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
    ModelinfoStore.setModelTreeData(data);
  };

  // 保存页面数据
  const onSaveData = () => {
    const treeData = [...ModelinfoStore.modelTreeData];
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
              modelinfoId: m.modelinfoId,
              modelUmid: m.key,
              modelName: m.title,
              modelIndex: mkIndex++,
              modelType: 'V',
              whrid: whrid,
              whr: whr,
              whsj: whsj,
            });
          } else {
            modelList.push({
              modelinfoId: m.modelinfoId,
              modelUmid: m.key,
              modelName: m.title,
              modelIndex: mkIndex++,
              modelType: 'D',
              whrid: whrid,
              whr: whr,
              whsj: whsj,
            });
          }

          const gnData = m.children;
          if (gnData.length > 0) {
            gnData.forEach((g) => {
              modelList.push({
                modelinfoId: g.modelinfoId,
                modelUmid: g.key,
                modelName: g.title,
                modelPumid: m.key,
                modelIndex: gnIndex++,
                modelType: g.modelType,
                whrid: whrid,
                whr: whr,
                whsj: whsj,
              });
            });
          }
        });
      }
      ModelinfoStore.deleteMkAndGn(ModelinfoStore.modelinfoId).then(() => {
        ModelinfoStore.insertBatch(modelList).then(() => {
          ModelinfoStore.findModelTreeData({
            id: ModelinfoStore.modelinfoId,
            productId: ModelinfoStore.productId,
          }).then(() => {
            // 查询右侧模块及功能数据
            ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
              // 左侧树形数据中有的模块,右侧不再出现
              refreshRightData();
            });
          });
          message.success('数据保存成功!');
        });
      });
    }
  };

  // 删除功能的提示弹框的确定按钮
  const handleGnDeleteOk = async () => {
    if (ModelinfoStore.treeGnId) {
      const treeData = [...ModelinfoStore.modelTreeData];
      if (treeData.length > 0 && treeData[0].children.length > 0) {
        treeData[0].children.forEach((m) => {
          if (m.children.length > 0) {
            m.children = m.children.filter(
              (f) => f.key !== ModelinfoStore.treeGnId,
            );
          }
        });
        ModelinfoStore.setModelTreeData(treeData);
      }

      //  刷新右侧模块数据即功能数据
      ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
        // 左侧树形数据中有的模块,右侧不再出现
        refreshRightData();
      });
    }
    ModelinfoStore.isSelect = false;
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
    if (ModelinfoStore.isSelect) {
      if (ModelinfoStore.treeGnId) {
        showGnDeleteconfirm();
      }
      if (ModelinfoStore.treeMxId) {
        message.warn('此为模型,不可删除!');
      }
      if (ModelinfoStore.treeMkId) {
        message.warn('此为模块,不可删除!');
      }
    } else {
      message.warn('请先选择功能!');
    }
  };

  // table表格的onChange事件
  const onTableRowChange = (selectedRowKeys, records) => {
    ModelinfoStore.setSelectRows(selectedRowKeys, records);
  };

  // 往左移动功能数据
  const onLeftMove = () => {
    const treeData = [...ModelinfoStore.modelTreeData];
    if (
      !ModelinfoStore.selectRowRecords ||
      ModelinfoStore.selectRowRecords.length < 1
    ) {
      return message.warning('请在右侧至少选择一条数据!');
    }
    if (ModelinfoStore.isSelect) {
      if (ModelinfoStore.treeMkId) {
        if (ModelinfoStore.selectRowRecords.length > 0) {
          ModelinfoStore.selectRowRecords.forEach((gn) => {
            if (treeData.length > 0 && treeData[0].children.length > 0) {
              treeData[0].children.forEach((t) => {
                if (ModelinfoStore.treeMkId === t.key) {
                  t.children.push({
                    key: gn.funcCode,
                    title: gn.funcName,
                    modelinfoId: treeData[0].modelinfoId,
                    productId: treeData[0].productId,
                    nodeType: 'func',
                    modelType: gn.funcType,
                    modelPumid: ModelinfoStore.treeMkId,
                    children: [],
                  });
                }
              });
            }
          });
          ModelinfoStore.setSelectRows([], []);
          ModelinfoStore.setModelTreeData(treeData).then(() => {
            // 查询右侧模块及功能数据
            ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
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
    if (ModelinfoStore.isSelect) {
      if (ModelinfoStore.treeGnId) {
        const treeData = [...ModelinfoStore.modelTreeData];
        if (treeData.length > 0 && treeData[0].children.length > 0) {
          treeData[0].children.forEach((m) => {
            if (m.children.length > 0) {
              m.children = m.children.filter(
                (f) => f.key !== ModelinfoStore.treeGnId,
              );
            }
          });
          ModelinfoStore.setModelTreeData(treeData);
        }

        //  刷新右侧模块数据即功能数据
        ModelinfoStore.findModuleData(ModelinfoStore.productId).then(() => {
          // 左侧树形数据中有的模块,右侧不再出现
          refreshRightData();
        });
        ModelinfoStore.isSelect = false;
      }
      if (ModelinfoStore.treeMxId) {
        message.warn('此为模型,不可右移!');
      }
      if (ModelinfoStore.treeMkId) {
        message.warn('此为模块,不可右移!');
      }
    } else {
      message.warn('请先选择左侧功能!');
    }
  };

  return (
    <>
      <div>
        <div style={{ height: '8%' }}>
          <Form form={treeForm} {...formItemLayout}>
            <Row>
              <Col span={6} style={{ marginTop: '1%' }}>
                <Form.Item
                  label="产品:"
                  className="form-item"
                  name="productId"
                  rules={[{ required: true, message: '请选择产品!' }]}
                >
                  <Select
                    placeholder="请选择产品"
                    allowClear
                    style={{ width: 200 }}
                    options={ModelinfoStore.productSelectData}
                    onChange={onProductChange}
                  />
                </Form.Item>
              </Col>
              <Col span={6} style={{ marginTop: '1%' }}>
                <Form.Item
                  label="模型:"
                  className="form-item"
                  name="modelinfoName"
                  rules={[{ required: true, message: '请选择模型!' }]}
                >
                  <Select
                    placeholder="请选择模型"
                    style={{ width: 200 }}
                    allowClear
                    options={ModelinfoStore.modelinfoSelectData}
                    onChange={onModelinfoChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ borderTop: ' 1px solid #E5E5E5', height: '50px' }}>
          <Button
            type="primary"
            onClick={onAddModel}
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<FileAddOutlined />}
          >
            新增模型
          </Button>
          <Button
            type="primary"
            onClick={onModelDelete}
            danger
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<DeleteOutlined />}
          >
            删除模型
          </Button>
          <Button
            type="primary"
            onClick={onAddModule}
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<FileAddOutlined />}
          >
            新增模块文件夹
          </Button>
          <Button
            type="primary"
            onClick={onMkDetele}
            danger
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<DeleteOutlined />}
          >
            删除模块文件夹
          </Button>
          <Button
            type="primary"
            onClick={onGnDetele}
            danger
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<DeleteOutlined />}
          >
            删除功能
          </Button>
          <Button
            type="primary"
            onClick={onSaveData}
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<SaveOutlined />}
          >
            保存
          </Button>
        </div>
        <div style={{ height: '640px', marginTop: '0.5%' }}>
          <Row>
            <Col offset={1} span={10}>
              <Tree
                showLine
                defaultExpandAll
                onSelect={onSelect}
                treeData={ModelinfoStore.modelTreeData}
                draggable
                onDrop={onDrop}
              />
            </Col>
            <Col>
              <div
                style={{
                  borderRight: ' 1px solid #E5E5E5',
                  height: '600px',
                  width: '8px',
                  marginRight: '6px',
                }}
              />
            </Col>
            <Col>
              <Row style={{ marginTop: '210px' }}>
                <Button
                  icon={<RightOutlined />}
                  onClick={onRightMove}
                  style={{ width: '30px', height: '30px' }}
                />
              </Row>
              <Row style={{ marginTop: '20px' }}>
                <Button
                  icon={<LeftOutlined />}
                  onClick={onLeftMove}
                  style={{ width: '30px', height: '30px' }}
                />
              </Row>
            </Col>
            <Col>
              <div
                style={{
                  borderLeft: ' 1px solid #E5E5E5',
                  height: '600px',
                  width: '8px',
                  marginLeft: '6px',
                }}
              />
            </Col>
            <Col offset={1} span={10}>
              <Form form={rightForm} {...formItemLayout}>
                <Form.Item className="form-item" name="moduleName">
                  <Select
                    style={{ width: 200 }}
                    options={ModelinfoStore.moduleSelectData}
                    onChange={onModuleChange}
                  />
                </Form.Item>
              </Form>
              <Table
                columns={columns}
                rowKey="id"
                dataSource={
                  ModelinfoStore.isShow === true ? ModelinfoStore.funcData : ''
                }
                bordered
                scroll={{ x: 'max-content' }}
                style={{ marginTop: '2%' }}
                pagination={false}
                rowSelection={{
                  onChange: onTableRowChange,
                  selectedRowKeys: ModelinfoStore.selectedRowKeys,
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
      {/* 新增模型弹框 */}
      <ModelAddDailog
        modelVisible={modelVisible}
        setModelvisible={setModelvisible}
        treeForm={treeForm}
      />
      {/* 新增模块文件夹弹框 */}
      <ModuleAddDailog
        moduleVisible={moduleVisible}
        setModulevisible={setModulevisible}
        rightForm={rightForm}
      />
    </>
  );
});

export default Modelinfo;
