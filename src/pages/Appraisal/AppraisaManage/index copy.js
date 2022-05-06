import React from 'react';
import './index.less'
import { Input, Icon, Table, Pagination, Tab, Search, Button, Dropdown, Menu } from '@alifd/next'
import CollapseTree from "@/components/collapseTree";
import OfficeChild from './officeChild'
import AdvancedSearch from '@/components/advancedSearch'

export default class archiveManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      isExpand: true,       // 左侧树是否是展开状态
      drawVisible: false,
    }
  }
  getExpand = (data) => {       // 展开收起树
    this.setState({isExpand: data})
  }
  onSelectChange = (ids, records) => {
    this.setState({ selectedRowKeys: records});
  };
  render() {
    return (
      <div className="office-manage">
        <Tab defaultActiveKey="1">
          <Tab.Item title="列表" key="1"></Tab.Item>
          <Tab.Item title="盒列表" key="2"></Tab.Item>
        </Tab>
        <div className={this.state.isExpand ? 'isExpand main-content' : 'main-content'}>
          <div className='left-tree'>
            <CollapseTree getExpand={this.getExpand}></CollapseTree>
          </div>
          <div className="file-content">
            <OfficeChild showAdvance={() => {this.setState({drawVisible: true})}}/>
            <hr style={{marginBottom: 15}}></hr>
            <OfficeChild showAdvance={() => {this.setState({drawVisible: true})}}/>
          </div>
        </div>
        <AdvancedSearch drawVisible={this.state.drawVisible} changeVisible={() => {this.setState({drawVisible: false})}}></AdvancedSearch>
      </div>
    )
  }
}