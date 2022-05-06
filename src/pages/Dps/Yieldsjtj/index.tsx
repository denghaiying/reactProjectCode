import {
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
  Table,
  Button,
  Row,
  Col,
  message,
  DatePicker,
  Space,
  Select,
  Option,
} from 'antd';
import * as echarts from 'echarts';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect, useState } from 'react';
import ProjectService from './Service/ProjectService';
import SysStore from '@/stores/system/SysStore';
import option from './Charts/ChartsOne';
import './index.less';
import fetch from '../../../utils/fetch';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * @description 产量统计
 */
const Yieldsjtj = observer((props) => {
  //权限按钮
  const umid = 'DPS016';
  OptrightStore.getFuncRight(umid);
  const WkldsjtjStore = useLocalObservable(() => ({
    // 获取图表数据
    async findChartData(params) {
      params['date'] =
        params.flag === 'year'
          ? params.date.format('YYYY')
          : params.date.format('YYYY-MM');
      return await fetch.get('/api/eps/dps/yield/chartData/', {
        params: params,
      });
    },
  }));
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');

  //控制时间维度类型
  const [dateType, setDateType] = useState('month');

  //图表的数据
  const [chartData, setChartData] = useState([]);
  //获取主页面搜索表单实例
  const [homeForm] = Form.useForm();
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
  //项目双击选择
  const onxm = (record) => {
    homeForm.setFieldsValue({
      xmmc: record.xmmc,
      xmid: record.xmid,
      projectId: record.id,
    });

    setxmvisible(false);
  };
  const cltjtb = () => {
    const myChart = echarts.init(document.getElementById('cltj-id'));
    myChart.setOption(option, true);
  };
  //统计点击事件
  const tjOnClick = () => {
    homeForm.validateFields().then((values) => {
      WkldsjtjStore.findChartData(values).then((response) => {
        // x轴
        if (!(response.data.date.length > 0)) {
          message.success('暂无产量信息');
        }
        option.xAxis.data = response.data.date;
        option.xAxis.name =
          homeForm.getFieldValue('flag') === 'year' ? '月份' : '日期';
        option.series[0].name = '盒';
        option.series[0].data = response.data.box;
        option.series[1].name = '卷';
        option.series[1].data = response.data.volume;
        option.series[2].name = '件';
        option.series[2].data = response.data.piece;
        option.series[3].name = '页';
        option.series[3].data = response.data.page;
        option.series[4].name = '条';
        option.series[4].data = response.data.record;
        cltjtb();
      });
    });
  };

  useEffect(() => {
    cltjtb();
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);

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
                    placeholder="请选择项目"
                    onSearch={onxmSearch}
                    style={{ width: 300 }}
                    readOnly
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
          <div id="cltj-id" style={{ height: window.innerHeight - 236 }}></div>
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
          bordered
          rowKey={'id'}
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
export default Yieldsjtj;
