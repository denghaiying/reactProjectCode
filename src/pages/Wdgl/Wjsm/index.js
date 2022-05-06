import React from 'react';
import './index.less'
import { Tree, Pagination, Button, Select, Checkbox, Icon } from '@alifd/next';

export default class Wjsm extends React.Component {
  handleAdd = (type) => {
    if(type) {    // 放大
      if(this.imgTarget.height > 1600) return
      this.imgTarget.style.height = `${this.imgTarget.height * 1.1}px`
    } else {      // 缩小
      if(this.imgTarget.height < 80) return
      this.imgTarget.style.height = `${this.imgTarget.height / 1.1}px`
    }
  }
  render() {
    const treeData = [
      {
        label: '公司名称标题',
        key: '1',
        children: [{label: '建筑图', key: '1-1'}, {label: '结构图', key: '1-2'}, {label: '水图', key: '1-3'}]
      },
      {
        label: '公司名称标题',
        key: '2',
        children: [{label: '建筑图', key: '2-1'}, {label: '结构图', key: '2-2'}, {label: '水图', key: '2-3'}]
      },
      {
        label: '公司名称标题',
        key: '3',
        children: [{label: '建筑图', key: '3-1'}, {label: '结构图', key: '3-2'}, {label: '水图', key: '3-3'}]
      },
    ]
    return (
      <div className="document-file">
        <div className="left-section">
          <p className="title">文件列表</p>
          <div className="tree">
            <Tree defaultExpandAll dataSource={treeData}/>
          </div>
        </div>
        <div className="right-section">
          <div className="right-head">
            <Pagination shape="arrow-only" defaultCurrent={2} total={30} className="paginate"/>
            <span className="total">共3页</span>
            <Button.Group>
              <Button type="primary">上一文件</Button>
              <Button type="secondary">下一文件</Button>
            </Button.Group>
            <Button type="primary" style={{margin: '0 20px 0 80px', width: 80}}>同意</Button>
            <Button type="secondary" style={{width: 80}}>不同意</Button>
            <span className="iconfont icon-quanping1"></span>
          </div>
          <div className="right-content">
            <div className="param">
              <div className="param-title">扫描设备及参数</div>
              <div className="form">
                <li className="item">
                  <span className="label">扫描仪选择</span>
                  <Select className="select"></Select>
                </li>
                <li className="item">
                  <span className="label">图像颜色</span>
                  <Select className="select"></Select>
                </li>
                <li className="item">
                  <span className="label">图像DPI</span>
                  <Select className="select"></Select>
                </li>
                <li className="item">
                  <span className="label">图像方向</span>
                  <Select className="select"></Select>
                </li>
                <li className="item">
                  <span className="label">图像大小</span>
                  <Select className="select"></Select>
                </li>
                <li className="item">
                  <span className="label">图像单双页</span>
                  <Select className="select"></Select>
                </li>
                <li className="item" style={{marginTop: 50}}>
                  <Checkbox>使用扫描仪自带界面</Checkbox>
                </li>
                <li className="item" style={{marginTop: 50}}>
                  <Button type="primary" style={{width: 120}}>扫描</Button>
                </li>
              </div>
            </div>
            <div className="img-center">
              <img src={require('../../../styles/assets/img/temp/letter-img.jpg')} className="img-target" alt="" ref={(ref) => {this.imgTarget = ref}}/>
              <div className="enlarge">
                <span className="plus" style={{marginRight: 30}} onClick={this.handleAdd.bind(this, true)}><Icon type="add" /></span>
                <span className="plus" onClick={this.handleAdd.bind(this, false)}><Icon type="minus" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}