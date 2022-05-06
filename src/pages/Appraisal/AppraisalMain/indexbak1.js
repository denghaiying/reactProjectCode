import React from 'react';
import './index.less'
import { Input, Icon, Table, Pagination } from '@alifd/next'
import CollapseTree from '../../../components/collapseTree'

export default class archiveManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpand: true,       // 左侧树是否是展开状态
    }
  }
  getExpand = (data) => {       // 展开收起树
    this.setState({isExpand: data})
  }
  render() {
    return (
      <div className="archive-manage">
        <div className="top-section">
          <span className="title">档案鉴定</span>
          <Input 
            innerBefore={<Icon type="search" style={{marginLeft: 6, color: '#999'}}/>} 
            addonTextAfter="检索" 
            size="medium" 
            style={{ width: 400 }} 
            placeholder="请输入搜索内容"
          />
        </div>
        <div className={this.state.isExpand ? 'isExpand main-content' : 'main-content'}>
          <div className='left-tree'>
            <CollapseTree getExpand={this.getExpand}></CollapseTree>
          </div>
          <div className="file-content">
            <div>
              <Table.StickyLock className="my-table" emptyContent={<div><img src={require('../../../styles/assets/img/table-empty.png')} style={{width: 360}}/><p>暂无数据</p></div>}>
                <Table.Column title="文件标题" dataIndex="title" align="center" width={200}/>
                <Table.Column title="全宗名称" dataIndex="order" align="center" width={200}/>
                <Table.Column title="全宗号" dataIndex="num" align="center" width={200}/>
                <Table.Column title="责任人" dataIndex="person" align="center" width={200}/>
                <Table.Column title="所属单位" dataIndex="company" align="center" width={200}/>
                <Table.Column title="密集" dataIndex="mj" align="center" width={200}/>
                <Table.Column title="年度" dataIndex="year" align="center" width={200}/>
                <Table.Column title="概要" dataIndex="content" align="center" width={200}/>
              </Table.StickyLock>
            </div>
            <Pagination shape="arrow-only" defaultCurrent={2} total={50} className="paginate"/>
          </div>
        </div>
      </div>
    )
  }
}