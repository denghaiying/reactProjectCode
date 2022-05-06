import React from 'react';
import './index.less'
import { Search, Tab, Input, Button, Select, DatePicker, Checkbox, Table, Pagination, Icon } from '@alifd/next';
import AdvancedSearch from '@/components/advancedSearch'
import AddSchedule from './addSchedule'
import EmptyPng from '@/styles/assets/img/icon_empty.png'
import icon_accessory from '../../../styles/assets/img/file-transfer/icon_accessory.png'
const { Option } = Select;

export default class schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResult: [],       // 左侧搜索结果
      drawVisible: false,
      selectedRowKeys: [],
      addModalVisible: false,
    }
  }
  onSearch = () => {
    this.setState({drawVisible: true})
  }
  onSelectChange = (ids, records) => {
    this.setState({ selectedRowKeys: records});
  };
  render() {
    const columns = [{title: '附件', dataIndex: '', key: 'x', align: 'center',  render: () => <img src={'icon_accessory.png'} alt="" style={{width: 22}}/>},
                      {title: '申请单号', dataIndex: 'order', align: 'center' },
                      {title: '申请人编号', dataIndex: 'num', align: 'center' },
                      {title: '申请人', dataIndex: 'person', align: 'center' },
                      {title: '申请时间', dataIndex: 'time', align: 'center' },
                      {title: '手机号', dataIndex: 'mobile', align: 'center' },
                      {title: '电话号码', dataIndex: 'phone', align: 'center' },
                      {title: '邮箱', dataIndex: 'email', align: 'center' },
                      {title: '所属单位', dataIndex: 'company', align: 'center' },
                      {title: '操作', dataIndex: '', align: 'center', render: (text, record) => <div><img src={require('../../../styles/assets/img/file-transfer/icon_edit.png')} alt="" style={{width: 22}}/>
                        <img src={require('../../../styles/assets/img/file-transfer/icon_book.png')} alt="" style={{width: 22, margin: '0 7px'}}/>
                        <img src={require('../../../styles/assets/img/file-transfer/icon_view2.png')} alt="" style={{width: 22}}/></div>
    }];
    const rowSelection = {
      onChange: this.onSelectChange.bind(this),
    };
    const data = []
    for (let i = 0; i < 12; i++) {
      data.push({key: i, id: i, order: '12345678', num: '12345678', person: '张雨', time: '2020年1月20日', mobile: '18136498836', phone: '025-26897293', email: '1046866458@qq.com', company: '科技局'});
    }
    return (
      <div className="my-schedule">
        <div className="banner">
          <div className="left">
            <span className="banner-title"><img src={require('../../../styles/assets/img/icon_rili.png')} alt=""/><span>我的日程</span></span>
          </div>
          <div>
            <Button type="primary" style={{marginRight: 10}} onClick={() => {this.setState({addModalVisible: true})}}>
              <Icon type="add" />新建日程
            </Button>
            <Button type="primary">
              <Icon type="download" />导入日程
            </Button>
          </div>
        </div>
        <div className="container">
          <div className="left">
            <Tab defaultActiveKey="1">
              <Tab.Item tab="我的关注" key="1"></Tab.Item>
              <Tab.Item tab="人员组织" key="2"></Tab.Item>
            </Tab>
            <div className="tab-content">
              <Search placeholder="search" type="normal" onSearch={() => {this.setState({searchResult: [1]})}} style={{ width: '100%', marginBottom: 30 }} />
              <div className="search-content">
                {
                  !this.state.searchResult.length ? <div className="empty"><img src={EmptyPng}/><p>暂无数据</p></div> : <div>
                    <p className="label-p">直接参与的工作</p>
                    <li className="item">
                      <Checkbox onChange={() => {}} />
                      <span className="item-text">蔡3月20号之前的研发工作</span>
                      <img src={require('../../../styles/assets/img/icon_star.png')} style={{width: 25}}/>
                    </li>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="right">
            <div className="condition">
              <Select style={{ width: '10vw', marginRight: 10 }} placeholder="日程类型">
                <Option value="1">日程类型1</Option>
                <Option value="2">日程类型2</Option>
              </Select>
              <DatePicker style={{ width: '10vw', marginRight: 10 }}/>
              <Search placeholder="请输入搜索内容" onSearch={this.onSearch} searchText={<span style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, lineHeight: 2}}>高级搜索</span>} style={{ width: 380, marginRight: 10 }} />
            </div>
            <Table bordered="true" rowSelection={rowSelection} columns={columns} dataSource={data} className="common-table" onRowClick={this.clickRow}/>
            <Pagination shape="arrow-only" defaultCurrent={2} total={50} onChange={this.pageChange} className="paginate"/>
          </div>
        </div>
        <AdvancedSearch drawVisible={this.state.drawVisible} changeVisible={() => {this.setState({drawVisible: false})}}/>
        <AddSchedule addModalVisible={this.state.addModalVisible} closeModal={() => {this.setState({addModalVisible: false})}} />
      </div>
    )
  }
}
