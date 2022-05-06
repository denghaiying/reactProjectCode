import React from 'react';
import style from './index.less';
import * as echarts from 'echarts';
import { Table, Button, Modal, message } from 'antd';
class chartsSecond extends React.Component {
  constructor() {
    super();
    this.charts1 = React.createRef();
    this.charts2 = React.createRef();
    this.state = {
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
        },
        {
          title: '责任部门',
          dataIndex: 'dep',
        },
        {
          title: '责任人',
          dataIndex: 'person',
        },
        {
          title: '当前状态',
          dataIndex: 'status',
        },
        {
          title: '创建时间',
          dataIndex: 'time',
        },
        {
          title: '操作',
          dataIndex: 'opt',
          width: 200,
          render: (key, item, index) => {
            return (
              <div className={`${style['opts-area']}`}>
                <div className={`${style['guidang']} ${style['common']}`}>
                  归档
                </div>
                <div className={`${style['fenxiang']} ${style['common']}`}>
                  分享
                </div>
                <div
                  className={`${style['shangchu']} ${style['common']}`}
                  onClick={this.handleOpt.bind(this, 'delete', item)}
                >
                  删除
                </div>
                <div className={`${style['chakan']} ${style['common']}`}>
                  查看
                </div>
              </div>
            );
          },
        },
      ],
      dataSource: [
        {
          key: 1,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 2,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 3,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 4,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 5,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 6,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 7,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
        {
          key: 8,
          name: '测试1',
          dep: '信息',
          person: '张三',
          status: '正常',
          time: '2021-09-10',
        },
      ],
    };
  }

  componentDidMount() {
    this.init();
    window.addEventListener('resize', this.resizeOpt);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeOpt);
  }

  init = () => {
    this.renderCharts1();
    this.renderCharts2();
  };

  resizeOpt = () => {
    this.current1.resize();
    this.current2.resize();
  };

  handleOpt = (type, item) => {
    if (type === 'delete') {
      Modal.confirm({
        type: 'warning',
        title: `确定删除吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          message.success('删除成功');
        },
      });
    }
  };

  renderCharts1 = () => {
    this.current1 = echarts.init(this.charts1.current);
    let option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        icon: 'circle',
        right: '10%',
        top: 'center',
        orient: 'vertical',
        itemGap: 15,
        formatter: function (name) {
          let arr = ['{a|' + name + '}' + '{b|' + 30 + '%}'];
          return arr.join('\n');
        },
      },
      textStyle: {
        rich: {
          a: {
            fontSize: 14,
            padding: [0, 0, 0, 0],
          },
          b: {
            fontSize: 14,
            padding: [0, 0, 0, 40],
          },
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['30%', '50%'],
          data: [
            { value: 1048, name: '测试1' },
            { value: 735, name: '测试2' },
            { value: 580, name: '测试3' },
            { value: 484, name: '测试4' },
            { value: 300, name: '测试5' },
          ],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      ],
    };
    this.current1.setOption(option);
  };

  renderCharts2 = () => {
    this.current2 = echarts.init(this.charts2.current);
    let option = {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['product', '测试1'],
        source: [
          { product: '数据1', 测试1: 43.3 },
          { product: '数据2', 测试1: 83.1 },
          { product: '数据3', 测试1: 86.4 },
          { product: '数据4', 测试1: 72.4 },
          { product: '数据5', 测试1: 72.4 },
          { product: '数据6', 测试1: 72.4 },
          { product: '数据7', 测试1: 72.4 },
          { product: '数据8', 测试1: 72.4 },
          { product: '数据9', 测试1: 72.4 },
        ],
      },
      xAxis: { type: 'category' },
      yAxis: {},
      grid: {
        bottom: '16%',
      },
      series: [
        {
          type: 'bar',
          barWidth: 30,
        },
      ],
    };
    this.current2.setOption(option);
  };

  render() {
    const { columns, dataSource } = this.state;
    return (
      <div className={`${style['chartsSecond-content']}`}>
        <div className={`${style['tabs-list']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>标题1</div>
          <div className={`${style['tabs-det']} ${style['common-content']}`}>
            <div className={`${style['cards']} ${style['cards-img-2']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>数据元</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-3']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>管理</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-1']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>占掘路</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-1']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>占掘路</div>
            </div>
          </div>
        </div>
        <div className={`${style['charts-area']}`}>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>标题3</div>
            <div className={`${style['common-content']}`}>
              <div ref={this.charts2} className={`${style['common-charts']}`} />
            </div>
          </div>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>标题2</div>
            <div className={`${style['common-content']}`}>
              <div ref={this.charts1} className={`${style['common-charts']}`} />
            </div>
          </div>
        </div>
        <div className={`${style['table-area']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>标题4</div>
          <div className={`${style['common-content']}`}>
            <div className={`${style['btns-area']}`}>
              <Button type="primary" className={`${style['btns']}`}>
                创建项目
              </Button>
              <Button type="primary" className={`${style['btns']}`}>
                项目类型
              </Button>
              <Button type="primary" className={`${style['btns-type']}`}>
                按类型排序
              </Button>
              <Button type="primary" className={`${style['btns-time']}`}>
                按时间排序
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
              className={`${style['table']}`}
              pagination={{ pageSize: 8 }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default chartsSecond;
