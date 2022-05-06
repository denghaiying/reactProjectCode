import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import ProjectService from './Servcie/ProjectService';
import fetch from '../../../utils/fetch';
import SysStore from '@/stores/system/SysStore';
import { Link } from 'umi';
import moment from 'moment';
import './index.less';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * 工作问题登记
 */
const Gzwtdj = observer((props) => {
  //权限按钮
  const umid = 'DPS013';
  OptrightStore.getFuncRight(umid);
  useEffect(() => {
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
    GzwtdjStore.findWorkcontentData();

    GzwtdjStore.findAllQuestionData();
  }, []);

  //控制新增弹窗的条件
  const [isShowAddModal, setIsShowAddModal] = useState(false);
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //提交表单,保存到数据库
  const handleOk = () => {
    form
      .validateFields()
      .then((val) => {
        GzwtdjStore.saveQuetion(val).then((response) => {
          if (response && response.status == 201) {
            message.success('问题发表成功');
            GzwtdjStore.findAllQuestionData('');
            setIsShowAddModal(false);
            form.resetFields();
          } else {
            message.error('问题发表失败');
          }
        });
      })
      .catch((info) => {
        debugger;
        if (info.errorFields.length > 0) {
          return;
        }
        message.error('问题发表失败');
      });
  };
  const handleCancel = () => {
    setIsShowAddModal(false);
  };

  const refProject = useRef();
  let projectTableStore;

  //获取表单实例
  const [form] = Form.useForm();

  const GzwtdjStore = useLocalObservable(() => ({
    workContentSelectData: [],
    questionAllData: [],
    async findWorkcontentData() {
      const response = await fetch.get('/api/eps/dps/work/list/');
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.workContentSelectData = response.data.map(
            (item: { code: any; name: any }) => ({
              value: item.code,
              label: item.name,
            }),
          );
        }
      }
    },
    async findAllQuestionData(record: any) {
      const response = await fetch.get('/api/eps/dps/question/list/', {
        params: { params: { title: record } },
      });
      if (response.status === 200) {
        this.questionAllData = response.data;
      }
    },
    async saveQuetion(values) {
      const whr = SysStore.getCurrentUser();
      values['id'] = `${Math.random()}`;
      values['yhId'] = whr.id;
      values['mc'] = whr.yhmc;
      values['qttime'] = moment().format('YYYY-MM-DD HH:mm:ss');

      return await fetch.post('/api/eps/dps/question/', values);
    },
  }));

  //新增问题的点击事件
  const onClick_add = () => {
    setIsShowAddModal(true);
    form.resetFields();
  };

  //弹窗中项目搜索
  const onxmtableSearch = (value) => {
    ProjectService.findAllProjectData({
      mgner: currentUserIsChecked ? whrid : null,
      xmmc: value,
    }).then((data) => {
      setProjectData(data);
    });
  };
  //仅显示我负责的项目
  const fzxmOnchange = (record) => {
    if (record.target.checked) {
      setCurrentUserIsChecked(true);
      ProjectService.findAllProjectData({ mgner: whrid, xmmc: xmmcData }).then(
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
  //弹窗搜索表单
  const customAction = (
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
  //定义table表格字段 ---项目信息
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];

  //项目弹框的确认按钮
  const onxm = (record) => {
    setxmvisible(false);
    form.setFieldsValue({ projectId: record.id });
    form.setFieldsValue({ xmmc: record.xmmc });
  };
  //表单项目的查询按钮
  const onxmSearch = (value) => {
    setxmvisible(true);
  };

  return (
    <div style={{ height: window.innerHeight - 125 }}>
      <List
        style={{ height: window.innerHeight - 100, width: '100%' }}
        itemLayout="vertical"
        size="large"
        rowKey={'id'}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        header={
          <>
            <Input.Search
              onSearch={(val) => GzwtdjStore.findAllQuestionData(val)}
              style={{ width: 300 }}
            />
            {OptrightStore.hasRight(umid, 'SYS101') && (
              <Button type="primary" onClick={onClick_add}>
                发表问题
              </Button>
            )}
          </>
        }
        dataSource={GzwtdjStore.questionAllData}
        renderItem={(item) => (
          <List.Item style={{ paddingBottom: 5, paddingTop: 5 }}>
            <div>
              <div>
                <div>
                  <h3
                    style={{
                      display: 'inline-block',
                      fontWeight: 10,
                      fontSize: 20,
                    }}
                  >
                    {item.title}
                  </h3>
                  <div
                    style={{
                      display: 'inline-block',
                      marginLeft: 20,
                      float: 'right',
                    }}
                  >
                    {OptrightStore.hasRight(umid, 'SYS103') && (
                      <Link
                        to={{
                          pathname: `./Details`,
                          state: {
                            questionId: item.id,
                          },
                        }}
                      >
                        详情
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.content}
              </div>
              <div style={{ color: 'grey' }}>
                <span>项目:</span>
                <div style={{ display: 'inline-block' }}>{item.xmmc}</div>
                <span style={{ display: 'inline-block', marginLeft: 30 }}>
                  工作内容:
                </span>
                <div style={{ display: 'inline-block' }}>
                  {GzwtdjStore.workContentSelectData.map((data) => {
                    if (data['value'] === item['code']) {
                      return data['label'];
                    }
                  })}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
      <Modal
        visible={isShowAddModal}
        title={'工作问题登记'}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form form={form} style={{ width: 400, margin: '0 auto' }}>
          <Form.Item
            label="问题标题"
            name="title"
            required
            rules={[{ required: true, message: '请输入问题标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="问题内容"
            name="content"
            required
            rules={[{ required: true, message: '请输入问题内容' }]}
          >
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
          <Form.Item label="项目id" name="projectId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="项目名称"
            name="xmmc"
            required
            rules={[{ required: true, message: '请选择项目' }]}
          >
            <Input.Search onSearch={(val) => onxmSearch(val)} readOnly />
          </Form.Item>
          <Form.Item
            label="工作内容"
            name="code"
            required
            rules={[{ required: true, message: '请选择工作内容' }]}
          >
            <Select
              allowClear
              showSearch
              filterOption={(input, option) => {
                return (
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              showArrow
              options={GzwtdjStore.workContentSelectData}
              placeholder={'请选择'}
            ></Select>
          </Form.Item>
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
      >
        {customAction}
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
        />
      </Modal>
    </div>
  );
});

export default Gzwtdj;
