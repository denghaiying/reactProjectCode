import React from 'react';
import './index.less';
import { Form, Select, Input, Button } from '@alifd/next';
import { Drawer } from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  StarOutlined,
  SearchOutlined,
} from '@ant-design/icons';
const { Option } = Select;
const FormItem = Form.Item;

export default class advancedSearch extends React.Component {
  cancel = () => {
    this.props.changeVisible(false);
  };
  render() {
    const formItemLayout = {
      labelCol: {
        fixedSpan: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <div className="drawer-page">
        <Drawer
          visible={this.props.drawVisible}
          placement="top"
          closable={false}
          destroyOnClose={true}
          getContainer={false}
          height={320}
          style={{ position: 'absolute' }}
        >
          <div className="drawer">
            <Form name="searchForm" {...formItemLayout}>
              <div className="row">
                <FormItem label="流程标题" className="form-item">
                  <Input placeholder="请输入流程标题" />
                </FormItem>
                <FormItem label="流程编号" className="form-item">
                  <Input placeholder="请输入流程编号" />
                </FormItem>
              </div>
              <div className="row">
                <Form.Item label="所属路径" className="form-item">
                  <Input
                    placeholder="请输入所属路径"
                    suffix={<SearchOutlined style={{ color: '#999' }} />}
                  />
                </Form.Item>
                <Form.Item label="创建日期" className="form-item">
                  <Select defaultValue="all">
                    <Option value="all">全部</Option>
                    <Option value="2020-01-26">2020-01-26</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="row">
                <Form.Item label="创建人" className="form-item">
                  <div className="worker">
                    <Select defaultValue="1" style={{ width: '35%' }}>
                      <Option value="1">员工一</Option>
                    </Select>
                    <Input
                      suffix={<SearchOutlined style={{ color: '#999' }} />}
                      style={{ width: '60%' }}
                    />
                  </div>
                </Form.Item>
                <Form.Item label="创建人编号" className="form-item">
                  <Input placeholder="请输入创建人编号" />
                </Form.Item>
              </div>
              <div className="row">
                <Form.Item label="待办状态" className="form-item">
                  <Select defaultValue="" placeholder="请选择待办状态"></Select>
                </Form.Item>
              </div>
              <div className="btns">
                <Button type="primary">确定</Button>
                <Button style={{ margin: '0 20px' }}>重置</Button>
                <Button onClick={this.cancel}>取消</Button>
              </div>
            </Form>
          </div>
        </Drawer>
      </div>
    );
  }
}
