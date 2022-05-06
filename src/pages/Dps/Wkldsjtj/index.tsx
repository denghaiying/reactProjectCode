import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import * as echarts from 'echarts';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import ProjectService from './Service/ProjectService';
import SysStore from '@/stores/system/SysStore';
import option from './Charts/ChartsOne';
import './index.less';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import OptrightStore from '@/stores/user/OptrightStore';
import header from '@/components/header';

/**
 * @author tyq
 * @description 工作量统计
 */
const Wkldsjtj = observer(() => {
  //权限按钮
  const umid = 'DPS016';
  OptrightStore.getFuncRight(umid);
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中输入框项目名称
  const [xmmcData, setXmmcData] = useState('');
  //控制时间维度类型
  const [dateType, setDateType] = useState('month');
  //获取主页面搜索表单实例
  const [homeForm] = Form.useForm();
  const WkldsjtjStore = useLocalObservable(() => ({
    // 获取图表数据
    async findChartData(params) {
      params['date'] =
        params.flag === 'year'
          ? params.date.format('YYYY')
          : params.date.format('YYYY-MM');
      return await fetch.get('/api/eps/dps/workload/chartData/', {
        params: params,
      });
    },
  }));

  //定义table表格字段 ---项目信息
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];
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
  //主页的项目查询按钮
  const onxmSearch = () => {
    setxmvisible(true);
  };
  //双击项目选择确认
  const onxm = (record) => {
    homeForm.setFieldsValue({
      xmmc: record.xmmc,
      xmid: record.xmid,
      projectId: record.id,
    });
    setxmvisible(false);
  };
  const wkldsjtjtb = () => {
    const myChart = echarts.init(document.getElementById('wkldsjtj-id'));
    myChart.setOption(option, true);
  };
  //统计点击事件
  const tjOnClick = () => {
    homeForm.validateFields().then((values) => {
      WkldsjtjStore.findChartData(values).then((response) => {
        // x轴
        option.series = [];
        option.xAxis.name =
          homeForm.getFieldValue('flag') === 'year' ? '月份' : '日期';
        option.xAxis.data = response.data.x;
        const data = response.data.data;
        const y = response.data.y;
        if (data.length > 0) {
          for (let a = 0; a < data.length; a++) {
            option.series.push({
              name: y[a],
              type: 'line',
              data: data[a],
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' },
                ],
              },
              markLine: {
                precision: 0,
                data: [{ type: 'average', name: 'Avg' }],
              },
            });
          }
        } else {
          message.success('暂无工作量信息');
        }
        wkldsjtjtb();
      });
    });
  };
  //页面初始化
  useEffect(() => {
    wkldsjtjtb();
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);
  //弹窗搜索表单
  const customAction = ( //弹窗搜索区域
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

  return (
    <>
      <Card id={'max-card'}>
        <Card id={'header-card'}>
          <div>
            <Form id={'home-from'} form={homeForm}>
              <Row>
                <Form.Item hidden label="项目表关键字" name="projectId">
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginRight: 5 }}
                  label="项目名称"
                  name="xmmc"
                  required
                  rules={[{ required: true, message: '请选择项目' }]}
                >
                  <Input.Search
                    readOnly
                    placeholder="请选择项目"
                    onSearch={onxmSearch}
                    style={{ width: 300 }}
                  />
                </Form.Item>
                <Form.Item hidden label="项目编号" name="xmid" required>
                  <Input
                    disabled
                    placeholder="项目编号"
                    style={{ width: 300 }}
                  />
                </Form.Item>

                <Form.Item
                  label="时间"
                  name="flag"
                  required
                  initialValue={dateType}
                >
                  <Select value={dateType} onChange={setDateType}>
                    <Select.Option value="year">年度</Select.Option>
                    <Select.Option value="month">月度</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="date"
                  required
                  initialValue={moment()}
                  rules={[{ required: true, message: '请选择时间' }]}
                >
                  <DatePicker picker={dateType} />
                </Form.Item>
                <Form.Item>
                  {OptrightStore.hasRight(umid, 'SYS101') && (
                    <Button
                      type="primary"
                      style={{ marginLeft: 10 }}
                      onClick={tjOnClick}
                    >
                      统计
                    </Button>
                  )}
                </Form.Item>
              </Row>
            </Form>
          </div>
        </Card>
        <Card>
          <div
            id="wkldsjtj-id"
            style={{ height: window.innerHeight - 236 }}
          ></div>
        </Card>
      </Card>

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
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onxm(record),
            };
          }}
        />
      </Modal>
    </>
  );
});
export default Wkldsjtj;
