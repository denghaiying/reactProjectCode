import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Table,
  Modal,
  Checkbox,
  message,
} from 'antd';
import ClglService from './Service/ClglService';
import { useEffect, useRef, useState } from 'react';
import SysStore from '@/stores/system/SysStore';
import ProjectService from './Service/ProjectService';
import fetch from '../../../utils/fetch';
import './index.less';
import moment from 'moment';
const Clgl = observer((props) => {
  const refClgl = useRef();
  const { RangePicker } = DatePicker;
  //查询表单
  const [searchform] = Form.useForm();
  //计算表单
  const [computeForm] = Form.useForm();
  //控制计算弹窗是否可见
  const [cljsVisible, setCljsVisible] = useState(false);
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //获取当前用户名称
  const whr = SysStore.getCurrentUser();
  //弹窗中项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');
  const ClglStore = useLocalObservable(() => ({
    async addClgl() {
      debugger;
      console.log(computeForm.getFieldsValue());
      return await fetch.get('/api/eps/dps/yield/compute/', {
        params: computeForm.getFieldsValue(),
      });
    },
  }));

  //弹窗中上方表单项目搜索
  const onxmtableSearch = (value) => {
    ProjectService.findAllProjectData({
      mgner: currentUserIsChecked ? whr.id : null,
      xmmc: value,
    }).then((data) => {
      setProjectData(data);
    });
  };
  //仅显示我负责的项目
  const fzxmOnchange = (record) => {
    if (record.target.checked) {
      setCurrentUserIsChecked(true);
      ProjectService.findAllProjectData({ mgner: whr.id, xmmc: xmmcData }).then(
        (data) => {
          setProjectData(data);
        },
      );
    } else {
      setCurrentUserIsChecked(false);
      ProjectService.findAllProjectData({ xmmc: xmmcData }).then((data) => {
        setProjectData(data);
      });
    }
  };
  //搜索输入框的点击
  const onxmSearch = () => {
    setxmvisible(true);
  };
  //项目双击选择
  const onxm = (record) => {
    computeForm.setFieldsValue({
      xmmc: record.xmmc,
      xmid: record.xmid,
      projectId: record.id,
    });
    setxmvisible(false);
  };

  //定义table表格字段 ---项目信息
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];
  const title: ITitle = { name: 'title' };
  const tableProp: ITable = {
    tableSearch: false,
    disableDelete: true,
    disableCopy: true,
    disableAdd: true,
    disableEdit: true,
    searchCode: 'xmmc',
  };

  const ClglSource: EpsSource[] = [
    {
      title: '项目名称',
      code: 'xmmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 250,
    },
    {
      title: '日期',
      code: 'date',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    //计算逻辑不完整,暂时不展示
    // {
    //   title: '盒数',
    //   code: 'box',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    // },
    // {
    //   title: '卷数',
    //   code: 'volume',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    // },
    // {
    //   title: '件数',
    //   code: 'piece',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    // },
    {
      title: '页数',
      code: 'page',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '条数',
      code: 'record',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];
  const customAction = () => {
    const onClickSearch = () => {
      const params = {};
      params['xmmc'] = searchform.getFieldValue('xmmc');
      if (searchform.getFieldValue('date') != undefined) {
        params['btime'] = searchform
          .getFieldValue('date')[0]
          .format('YYYY-MM-DD');
        params['etime'] = searchform
          .getFieldValue('date')[1]
          .format('YYYY-MM-DD');
      }

      const clgltableStore = refClgl.current?.getTableStore();
      clgltableStore.findByKey(
        clgltableStore.key,
        1,
        clgltableStore.size,
        params,
      );
    };

    return [
      <>
        <Form form={searchform}>
          <Row>
            <Col>
              <Form.Item name="xmmc" label="项目名称" style={{ margin: '5px' }}>
                <Input style={{ width: 300 }}/>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="date" label="日期" style={{ margin: '5px' }}>
                <RangePicker />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Col>
          <Button type="primary" onClick={onClickSearch}>
            查询
          </Button>
          <Button
            type="primary"
            onClick={() => {
              computeForm.resetFields();
              setCljsVisible(true);
            }}
          >
            计算
          </Button>
        </Col>
      </>,
    ];
  };
  //弹窗搜索区域
  const modalCustomAction = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => onxmtableSearch(val)}
              onChange={(record) => {
                setXmmcData(record.target.value);
              }}
              style={{ width: 300 }}
              placeholder="请输入项目名称"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Checkbox onChange={(record) => fzxmOnchange(record)}>
              仅显示我负责的项目
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
  //产量计算确定按钮
  const cljsOnOK = () => {
    computeForm.validateFields().then(() => {
      ClglStore.addClgl().then((response) => {
        if (response && response.status === 200) {
          if (response.data) {
            message.success('计算完毕');
            setCljsVisible(false);
          } else {
            message.success('暂无产量');
            setCljsVisible(false);
          }
        } else {
          message.success('暂无产量');
        }
      });
      //刷新表格
      const tableStore = refClgl.current.getTableStore();
      tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, {
        projectId: computeForm.getFieldValue('projectId'),
        year: computeForm.getFieldValue('year'),
        month: computeForm.getFieldValue('month'),
      });
    });
  };

  //页面初始化
  useEffect(() => {
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);
  return (
    <div style={{ height: window.innerHeight - 120 }}>
      <EpsPanel
        title={title} // 组件标题，必填
        source={ClglSource} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={ClglService} // 右侧表格实现类，必填
        customAction={customAction}
        ref={refClgl}
      />
      <Modal
        title="产量计算"
        visible={cljsVisible}
        onCancel={() => setCljsVisible(false)}
        onOk={cljsOnOK}
        centered
        width={500}
      >
        <Form
          labelCol={{ span: 6 }}
          id="clgl-compute-form"
          name="computeForm"
          form={computeForm}
        >
          <Col>
            <Col>
              <Form.Item hidden label="项目关键字" name="projectId">
                <Input />
              </Form.Item>
              <Form.Item hidden name="xmid" label="项目编号：">
                <Input disabled style={{ width: 300 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                rules={[{ required: true, message: '请选择项目!' }]}
                name="xmmc"
                label="项目名称："
              >
                <Input.Search
                  allowClear
                  readOnly
                  placeholder="请选择项目"
                  onSearch={onxmSearch}
                  style={{ width: 300 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                rules={[{ required: true, message: '年度不允许为空!' }]}
                name="year"
                label="年度："
              >
                <Input allowClear style={{ width: 300 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                rules={[{ required: true, message: '月份不允许为空!' }]}
                name="month"
                label="月份："
              >
                <Input allowClear style={{ width: 300 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item hidden name="whrid" initialValue={whr.id}>
                <Input />
              </Form.Item>
              <Form.Item
                hidden
                name="whr"
                label="维护人："
                initialValue={whr.yhmc}
              >
                <Input disabled style={{ width: 300 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                hidden
                name="whsj"
                label="维护时间："
                initialValue={moment()}
              >
                <DatePicker showTime disabled style={{ width: 300 }} />
              </Form.Item>
            </Col>
          </Col>
        </Form>
      </Modal>
      <Modal
        title="项目信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={xmVisible}
        onCancel={() => setxmvisible(false)}
        width={600}
        bodyStyle={{ height: 500 }}
        footer={false}
        centered
      >
        {modalCustomAction}
        <Table
          id={'modal-table'}
          dataSource={projectData}
          scroll={{ y: 400 }}
          columns={columns}
          bordered
          rowKey={'id'}
          onRow={(record) => {
            return {
              onDoubleClick: () => onxm(record),
            };
          }}
          pagination={{ pageSize: 50 }}
        />
      </Modal>
    </div>
  );
});

export default Clgl;
