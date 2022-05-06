import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {
  Input,
  Table,
  Button,
  Form,
  Row,
  Col,
  message,
  Select,
  Tooltip,
  Modal,
  Checkbox,
  notification,
} from 'antd';
import {
  SearchOutlined,
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Addxtzc from './Addxtzc';
import './index.less';
import XtzcStore from '../../../stores/Ngbl/XtzcStore';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import WflwButtons from '@/components/Wflw';
const formItemLayout = {
  colon: false,
  labelCol: {
    span: 8,
  },
};

const Xtzc = observer((props: any) => {
  const [form] = Form.useForm();
  const columns = [
    {
      title: '序号',
      fixed: 'left',
      align: 'center',
      width: 60,
      render: (text, record, index) => {
        return (XtzcStore.page - 1) * XtzcStore.size + 1 + index;
      },
    },
    {
      title: '申请编号',
      dataIndex: 'xtzcCode',
      align: 'center',
      width: 100,
    },
    {
      title: '客户',
      dataIndex: 'khId',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        const result = XtzcStore.khData?.filter((item) => item.id === text);
        return result[0] ? result[0].wldwname : '';
      },
    },
    {
      title: '所属项目',
      dataIndex: 'projectId',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        const result = XtzcStore.xmData?.filter((item) => item.id === text);
        return result[0] ? result[0].projectName : '';
      },
    },
    {
      title: '所属产品',
      dataIndex: 'productId',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        const result = XtzcStore.productData?.filter((item) => item.id === text);
        return result[0] ? result[0].productName : '';
      },
    },
    {
      title: '所属模型',
      dataIndex: 'modelinfoName',
      align: 'center',
      width: 200,
    },
    {
      title: '注册单位名称',
      dataIndex: 'xtzcZcdwmc',
      align: 'center',
      width: 200,
    },
    {
      title: '注册系统名称',
      dataIndex: 'xtzcZcxtmc',
      align: 'center',
      width: 200,
    },
    {
      title: '试用版',
      dataIndex: 'xtzcTrail',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        return <Checkbox checked={text === '1' ? true : false} />;
      },
    },
    {
      title: '个人注册',
      dataIndex: 'xtzcGrzc',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        return <Checkbox checked={text === '1' ? true : false} />;
      },
    },
    {
      title: '注册日期',
      dataIndex: 'xtzcZcrq',
      align: 'center',
      width: 200,
    },
    {
      title: '到期日期',
      dataIndex: 'xtzcDqrq',
      align: 'center',
      width: 200,
    },
    {
      title: '有效期',
      dataIndex: 'xtzcYxq',
      align: 'center',
      width: 100,
    },
    {
      title: '用户数',
      dataIndex: 'xtzcZcyhs',
      align: 'center',
      width: 100,
    },
    {
      title: '单位数',
      dataIndex: 'xtzcDws',
      align: 'center',
      width: 100,
    },
    {
      title: '档案库数',
      dataIndex: 'xtzcDaks',
      align: 'center',
      width: 100,
    },
    {
      title: '数据库类型',
      dataIndex: 'xtzcDbtype',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        if (text === '1') {
          return 'MSSQL';
        } else if (text === '2') {
          return 'ORACLE';
        } else if (text === '3') {
          return 'MYSQL';
        } else if (text === '4') {
          return 'KINGBASE';
        } else if (text === '5') {
          return 'DM';
        }
      },
    },
    {
      title: '网络',
      dataIndex: 'xtzcWl',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        if (text === '1') {
          return '政务网';
        } else if (text === '2') {
          return '内网';
        } else if (text === '3') {
          return '互联网';
        } else if (text === '4') {
          return '其他网络';
        }
      },
    },
    {
      title: '申请日期',
      dataIndex: 'xtzcSqrq',
      align: 'center',
      width: 200,
    },
    {
      title: '申请人',
      dataIndex: 'xtzcSqr',
      align: 'center',
      width: 140,
    },
    {
      title: '申请部门',
      dataIndex: 'xtzcSqbm',
      align: 'center',
      width: 160,
    },
    {
      title: '所属公司',
      dataIndex: 'xtzcSsgs',
      align: 'center',
      width: 200,
    },
    {
      title: '多次注册',
      dataIndex: 'xtzcMuti',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        return <Checkbox checked={text === '1' ? true : false} />;
      },
    },
    {
      title: '多次注册原因',
      dataIndex: 'xtzcMutirsn',
      align: 'center',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'xtzcRemark',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <span>
            <Tooltip title="修改">
              <Button
                size="small"
                onClick={() => {
                  onEditXtzc(record, 'edit');
                }}
                style={{ fontSize: '12px', color: '#08c' }}
                shape="circle"
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="浏览">
              <Button
                size="small"
                onClick={() => {
                  onEditXtzc(record, 'view');
                }}
                style={{ fontSize: '12px', color: '#08c' }}
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button
                size="small"
                onClick={() => {
                  onDeleteXtzc(record.id);
                }}
                danger={true}
                style={{ fontSize: '12px' }}
                type={'primary'}
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </span>
        );
      },
    },
  ];

  // tmzt
  const tmzt = 3;
  // 鉴定编号
  const jdlx = 'da_yjsp';
  // 流程编号
  const wfcode = 'dagl_yjsp';

  const spurl = 'yjsp';

  useEffect(() => {
    XtzcStore.findKhData().then((response)=>{
      if(response&&response.status===200){
        if(response.status>0){
          XtzcStore.khData=response.data
        }
      }
    });
    XtzcStore.findProjectData().then((response)=>{
      if(response&&response.status===200){
        if(response.data.length>0){
          XtzcStore.xmData=response.data
        }
      }
    });
    XtzcStore.findBm();
    XtzcStore.findDw();
    XtzcStore.findProductData();
    XtzcStore.findModelinfoData();
    XtzcStore.findForPage(XtzcStore.page, XtzcStore.size, XtzcStore.params);
  }, []);

  // 新增系统注册页面
  const onAddClick = () => {
    XtzcStore.formData = {};
    XtzcStore.opt = 'add';
    if (XtzcStore.bmData.length > 0) {
      XtzcStore.bmData.forEach((bm) => {
        if (bm.id === SysStore.getCurrentUser().bmid) {
          XtzcStore.sqrbm = bm.name;
        }
      });
    }
    if (XtzcStore.dwData.length > 0) {
      XtzcStore.dwData.forEach((dw) => {
        if (dw.id === SysStore.getCurrentUser().dwid) {
          XtzcStore.sqrdw = dw.mc;
        }
      });
    }
    XtzcStore.setIsvisible(true);
  };

  // 修改系统注册数据/浏览数据
  const onEditXtzc = (value, opt) => {
    XtzcStore.xtzcId = value.id;
    if (opt === 'edit') {
      XtzcStore.opt = 'edit';
    } else {
      XtzcStore.opt = 'view';
      XtzcStore.isFormEdit = true;
    }
    value['xtzcSqrq'] = moment(value['xtzcSqrq']);
    value['xtzcZcrq'] = moment(value['xtzcZcrq']);

    //试用版
    if (value.hasOwnProperty('xtzcTrail')) {
      value['xtzcTrail'] = value['xtzcTrail'] === '0' ? false : true;
    }
    // 个人注册
    if (value.hasOwnProperty('xtzcGrzc')) {
      value['xtzcGrzc'] = value['xtzcGrzc'] === '0' ? false : true;
    }
    // 允许扩展
    if (value.hasOwnProperty('xtzcTuning')) {
      value['xtzcTuning'] = value['xtzcTuning'] === '0' ? false : true;
    }
    // 多次注册
    if (value.hasOwnProperty('xtzctMuti')) {
      value['xtzcMuti'] = value['xtzctMuti'] === '0' ? false : true;
    }

    if (XtzcStore.khData.length > 0) {
      XtzcStore.khData.forEach((kh) => {
        if (kh.id === value['khId']) {
          value['wldwcode'] = kh.wldwcode;
          value['wldwname'] = kh.wldwname;
        }
      });
    }
    if (XtzcStore.xmData.length > 0) {
      XtzcStore.xmData.forEach((xm) => {
        if (xm.id === value['projectId']) {
          value['projectCode'] = xm.projectCode;
          value['projectName'] = xm.projectName;
        }
      });
    }

    if (XtzcStore.modelinfoData.length > 0) {
      XtzcStore.modelinfoData.forEach((modelinfo) => {
        if (modelinfo.id === value['modelinfoId']) {
          value['modelinfoName'] = modelinfo.modelinfoName;
        }
      });
    }
    XtzcStore.formData = value;
    XtzcStore.setIsvisible(true);
  };

  // 主页面切换分页
  const onPageSizeChange = (page, size) => {
    XtzcStore.setPagesizeChage(page, size);
  };

  // 删除系统注册的确认框
  const handleDeleteXtzcOk = async () => {

    XtzcStore.deleteXtzc(XtzcStore.xtzcId).then((response) => {
      if (response) {
        XtzcStore.findForPage(XtzcStore.page, XtzcStore.size, XtzcStore.params);
        message.success('系统注册数据删除成功!');
      } else {
        message.error('系统注册数据删除失败!');
      }
    });
  };

  const handleCancel = () => {
    Modal.destroyAll();
  };
  // 删除系统注册的提示弹框
  const showDeleteXtzcconfirm = () => {
    Modal.confirm({
      title: '确定要删除该系统注册数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleDeleteXtzcOk,
      onCancel: handleCancel,
    });
  };
  // 删除系统注册数据
  const onDeleteXtzc = async (value) => {
    XtzcStore.xtzcId = value;
    showDeleteXtzcconfirm();
  };

  //行选择属性配置
  const rowSelectProp = {
    type: 'radio',
    onSelect: (row, isChecked, rows) => {
      XtzcStore.wfinst = rows
      XtzcStore.setTableCheckedRow(rows);
    },
  };

  const getWfinst = () => {
    if (XtzcStore.wfinst && XtzcStore.wfinst.length > 0) {
      return XtzcStore.wfinst[0].wfinst;
    }
    return '';
  };
  const getWfid = () => {
    return 'nbgl_xtzc';
  };
  const onBeforeAction = (action) => {
    if (!XtzcStore.tableCheckedRow || XtzcStore.tableCheckedRow.length === 0) {
      notification.open({
        message: '提示',
        description: '请选择一条数据',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    return true;
  };
  const onAfterAction = () => {
    return message.success('操作成功');
  };

  // 查询功能
  const onSearch = async () => {
    const params = {};
    params['xtzcZcdwmc'] =
      form.getFieldValue('xtzcZcdwmc') === undefined ? null : form.getFieldValue('xtzcZcdwmc');
    params['xtzcZcxtmc'] =
      form.getFieldValue('xtzcZcxtmc') === undefined ? null : form.getFieldValue('xtzcZcxtmc');
    params['xtzcSqr'] =
      form.getFieldValue('xtzcSqr') === undefined ? null : form.getFieldValue('xtzcSqr');
    XtzcStore.findForPage(XtzcStore.page, XtzcStore.size, { params: params });
  };
  return !XtzcStore.isVisible ? (
    <div style={{ height: '100%' }}>
      {/* <Row>
          <Col span={20}> */}
      <div className="search">
        <Form form={form} {...formItemLayout}>
          <Row className="form-row">
            <Col span={6}>
              <Form.Item label="注册单位名称:" name="xtzcZcdwmc">
                <Input allowClear placeholder="请输入注册单位名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="注册系统名称:" name="xtzcZcxtmc">
                <Input allowClear placeholder="请输入注册系统名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="申请人:" name="xtzcSqr">
                <Input allowClear placeholder="请输入申请人" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <div className="btns">
                {' '}
                <Button onClick={onSearch} type="primary" icon={<SearchOutlined />}>
                  查询
                </Button>
              </div>
            </Col>
            <Col></Col>
          </Row>
        </Form>
      </div>
      {/* </Col> */}
      {/* <Col span={4}>
          <div className="btns"> <Button onClick={onSearch} type="primary" icon={<SearchOutlined />}>查询</Button></div>
        </Col> */}
      {/* </Row> */}
      <div className="btns-group">
        <Button.Group>
          <Button
            onClick={onAddClick}
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<FileAddOutlined />}
          >
            新增
          </Button>
          <WflwButtons
            class={'wflwbuttons'}
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            offset={[18, 0]}
            type={['submit', 'return', 'reject']}
            wfid={getWfid()}
            wfinst={getWfinst()}
            onBeforeAction={onBeforeAction}
            onAfterAction={onAfterAction}
          />
        </Button.Group>
      </div>
      <div className="tabs">
        <Table
          columns={columns}
          dataSource={XtzcStore.tableList}
          bordered
          className="group-table"
          scroll={{ x: 1500 }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultCurrent: XtzcStore.page,
            defaultPageSize: XtzcStore.size,
            pageSize: XtzcStore.size,
            current: XtzcStore.page,
            showTotal: (total, range) => `共 ${total}  条数据`,
            onChange: onPageSizeChange,
            total: XtzcStore.total,
          }}
          expandable={{
            expandIconColumnIndex: 1,
            defaultExpandAllRows: true,
          }}
          rowSelection={rowSelectProp}
        />
      </div>
    </div>
  ) : (
    <Addxtzc formData={XtzcStore.formData} />
  );
});
export default Xtzc;
