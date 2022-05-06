import React, { useEffect, useState } from 'react';
import './index.less';
import { Form, Input, Button } from 'antd';
import { Select } from 'antd';
import { Radio } from 'antd';
import { Tag } from 'antd';
import { DatePicker, Space } from 'antd';
import { message } from 'antd';
import { Modal } from 'antd';
import { Transfer } from 'antd';
import { observer } from 'mobx-react';

const { TextArea } = Input;

const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function onChange(value) {
  console.log('changed', value);
}

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const Sw = observer((props) => {
  // 拟稿人
  const [modal1Visibleaa, setModal1Visibleaa] = useState(false);
  // 拟稿部门
  const [modal1Visibleaabm, setModal1Visibleaabm] = useState(false);
  // 校对人
  const [modal1Visibleaajdr, setModal1Visibleaajdr] = useState(false);
  // 文种
  const [modal1Visibleaawz, setModal1Visibleaawz] = useState(false);
  // 秘密等级
  const [modal1Visibleaadj, setModal1Visibleaadj] = useState(false);
  // 主送
  const [modal1Visibleaazs, setModal1Visibleaazs] = useState(false);
  // 抄送
  const [modal1Visibleaacs, setModal1Visibleaacs] = useState(false);

  const [modal2Visible, setModal2Visible] = useState(false);
  // 穿梭框
  const [mockData, setMockData] = useState([]);
  // 穿梭框
  const [targetKeys, setTargetKeys] = useState([]);

  //   穿梭框
  useEffect(() => {
    getMock();
  }, []);

  const getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    setMockData(mockData);
    setTargetKeys(targetKeys);
  };

  const handleChange = (targetKeys) => {
    setTargetKeys(targetKeys);
  };

  const renderFooter = (props, { direction }) => {
    if (direction === 'left') {
      return (
        <Button
          size="small"
          style={{ float: 'left', margin: 5 }}
          onClick={getMock}
        >
          Left button reload
        </Button>
      );
    }
    return (
      <Button
        size="small"
        style={{ float: 'right', margin: 5 }}
        onClick={getMock}
      >
        Right button reload
      </Button>
    );
  };
  return (
    <div className="fabox">
      {/* 顶部标题 */}
      <div className="fatop">
        <div className="faz">
          <p>收文</p>
        </div>
        <div className="sfann">
          <Form.Item wrapperCol={{ offset: 2, span: 100 }} className="formann">
            <Button className="lkj" type="primary" htmlType="submit">
              转发
            </Button>
            <Button className="fa-tjan" type="primary" htmlType="submit">
              保存
            </Button>
            <Button className="fa-tjan" type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </div>
      </div>
      {/* 左边输入信息 */}
      <div className="faleft">
        <div className="faleftbox">
          {/* 第一行 */}
          <div className="faa">
            <div className="faa-bt">
              <div className="fa-yyicx">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="拟稿人">
                    <Radio.Group name="radiogroup" defaultValue={1}>
                      <Radio value={1}>
                        <Tag color="success">正常</Tag>
                      </Radio>
                      <Radio value={2}>
                        <Tag color="processing">重要</Tag>
                      </Radio>
                      <Radio value={3}>
                        <Tag color="warning">紧急</Tag>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
            </div>
          </div>
          {/* 第二行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyicx">
                <Form
                  name="basic"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcx" label="标题">
                    <Input className="fa-inpcxa" />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>

          {/* 第三行 */}
          <div className="fabfabfab">
            <div className="faa-bt">
              <div className="fa-yyicxyyicx">
                <Form
                  name="basic"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxaaacxtjd" label="发文号">
                    <Input className="fa-inpcxa" />
                    <Button className="fa-inpcxaxfdann">
                      <span>重新生成编号</span>
                    </Button>
                    <Button className="fa-inpcxaxfdanna">
                      <span>选择预留号</span>
                    </Button>
                    <Button className="fa-inpcxaxfdanna">
                      <span>新建预留号</span>
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
          {/* 第四行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyicxa">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="拟稿部门">
                    {/* <Button className='fa-inpcxb' >
                                                <span className='anniuzia'>点击选择</span>
                                            </Button> */}
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaabm(true)}
                    >
                      <span className="anniuzia">点击输入</span>
                    </Button>
                    <Modal
                      title="请输入拟稿部门："
                      style={{ top: 300 }}
                      visible={modal1Visibleaabm}
                      onOk={() => setModal1Visibleaabm(false)}
                      onCancel={() => setModal1Visibleaabm(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="拟稿人">
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaa(true)}
                    >
                      <span className="anniuzia">点击输入</span>
                    </Button>
                    <Modal
                      title="请输入拟稿人："
                      style={{ top: 300 }}
                      visible={modal1Visibleaa}
                      onOk={() => setModal1Visibleaa(false)}
                      onCancel={() => setModal1Visibleaa(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
          {/* 第五行 */}
          <div className="fabh">
            <div className="faa-bt">
              {/* <div className='faa-btz'></div> */}
              <div className="fa-yyi">
                {/* <Form
                                        className='faform'
                                        name="basic"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                    >
                                        <Form.Item className='fa-fcxb'
                                            label="拟稿部门"
                                        >
                                            <Button className='fa-inpcxb' onClick={() => setModal1Visibleaabm(true)}>
                                                <span className='anniuzia'>点击输入</span>
                                                </Button>
                                                <Modal
                                                title="请输入拟稿部门："
                                                style={{ top: 300 }}
                                                visible={modal1Visibleaabm}
                                                onOk={() => setModal1Visibleaabm(false)}
                                                onCancel={() => setModal1Visibleaabm(false)}
                                                >
                                                <Input className='fa-inpcxb' />
                                                </Modal>
                                        </Form.Item>
                                    </Form> */}
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="文种">
                    {/* <Button className='fa-inpcxb' >
                                                <span className='anniuzia'>点击选择</span>
                                            </Button> */}
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaawz(true)}
                    >
                      <span className="anniuzia">点击输入</span>
                    </Button>
                    <Modal
                      title="请输入文种："
                      style={{ top: 300 }}
                      visible={modal1Visibleaawz}
                      onOk={() => setModal1Visibleaawz(false)}
                      onCancel={() => setModal1Visibleaawz(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="校对人">
                    {/* <Button className='fa-inpcxb' >
                                                <span className='anniuzia'>点击输入</span>
                                            </Button> */}

                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaajdr(true)}
                    >
                      <span className="anniuzia">点击输入</span>
                    </Button>
                    <Modal
                      title="请输入校对人："
                      style={{ top: 300 }}
                      visible={modal1Visibleaajdr}
                      onOk={() => setModal1Visibleaajdr(false)}
                      onCancel={() => setModal1Visibleaajdr(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>

          {/* 第六行 */}
          <div className="fablw">
            <div className="faa-bt">
              <div className="fa-yyi">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    className="fa-fcxb"
                    label="发文日期"
                    name="username"
                  >
                    <Space direction="vertical" className="fa-inpcxb">
                      <DatePicker
                        className="fa-inpcxbcx"
                        renderExtraFooter={() => 'extra footer'}
                        showTime
                      />
                    </Space>
                  </Form.Item>
                </Form>
              </div>

              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="秘密等级">
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaadj(true)}
                    >
                      <span className="anniuzia">点击选择</span>
                    </Button>
                    <Modal
                      title="请选择秘密等级："
                      style={{ top: 300 }}
                      visible={modal1Visibleaadj}
                      onOk={() => setModal1Visibleaadj(false)}
                      onCancel={() => setModal1Visibleaadj(false)}
                    >
                      <Radio.Group
                        name="radiogroup"
                        defaultValue={1}
                        className="fw-dx"
                      >
                        <Radio value={1}>机密</Radio>
                        <Radio value={2}>秘密</Radio>
                        <Radio value={3}>公开</Radio>
                      </Radio.Group>
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>

          {/* 第7行 */}
          <div className="fab">
            <div className="faa-bt">
              {/* <div className='faa-btz'></div> */}
              <div className="fa-yyicx">
                <Form
                  name="basic"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcx" label="主题词">
                    <Input className="fa-inpcxa" />
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
            </div>
          </div>

          {/* 第8行 */}
          <div className="fabdbg">
            <div className="faa-bt">
              <div className="fa-yyicx">
                <Form
                  name="basic"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcx" label="拟稿意见">
                    {/* <Input className='fa-inpcxa' /> */}
                    <TextArea
                      className="fa-inpcxainpcxa"
                      showCount
                      maxLength={100}
                      onChange={onChange}
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>

          {/* 第9行 */}
          <div className="fabh">
            <div className="faa-bt">
              <div className="fa-yyi">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="分发" name="username">
                    <Select
                      className="fa-inpcxb"
                      defaultValue="请选择"
                      onChange={handleChange}
                    >
                      <Option value="a">单位</Option>
                      <Option value="b">个人</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer"></div>
            </div>
          </div>

          {/* 第10行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyi">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="主送">
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaazs(true)}
                    >
                      <span className="anniuzia">点击选择</span>
                    </Button>
                    <Modal
                      className="mtk"
                      title="请选择主送："
                      style={{ top: 200 }}
                      visible={modal1Visibleaazs}
                      onOk={() => setModal1Visibleaazs(false)}
                      onCancel={() => setModal1Visibleaazs(false)}
                    >
                      {/* 穿梭框 */}
                      <Transfer
                        dataSource={mockData}
                        showSearch
                        listStyle={{
                          width: 200,
                          height: 300,
                        }}
                        operations={['to right', 'to left']}
                        targetKeys={targetKeys}
                        onChange={handleChange}
                        render={(item) => `${item.title}-${item.description}`}
                        footer={renderFooter}
                      />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                ></Form>
              </div>
            </div>
          </div>

          {/* 第11行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyi">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="抄送">
                    {/* <Button className='fa-inpcxb' >
                                                <span className='anniuzia'>点击输入</span>
                                            </Button> */}
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaacs(true)}
                    >
                      <span className="anniuzia">点击选择</span>
                    </Button>
                    <Modal
                      className="mtk"
                      title="请选择抄送："
                      style={{ top: 200 }}
                      visible={modal1Visibleaacs}
                      onOk={() => setModal1Visibleaacs(false)}
                      onCancel={() => setModal1Visibleaacs(false)}
                    >
                      {/* 穿梭框 */}
                      <Transfer
                        dataSource={mockData}
                        showSearch
                        listStyle={{
                          width: 200,
                          height: 300,
                        }}
                        operations={['to right', 'to left']}
                        targetKeys={targetKeys}
                        onChange={handleChange}
                        render={(item) => `${item.title}-${item.description}`}
                        footer={renderFooter}
                      />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                ></Form>
              </div>
            </div>
          </div>

          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyi">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="正文文件">
                    {/* <Upload {...props} >
                                                <Button icon={<UploadOutlined />}>上传</Button>
                                            </Upload> */}

                    <Button className="fa-inpcxb">
                      <span className="anniuzia">
                        <input type="file"></input>
                      </span>
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  {/* <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                            <Button type="primary" htmlType="submit">
                                            转发
                                            </Button>
                                            <Button className='fa-tjan' type="primary" htmlType="submit">
                                            保存
                                            </Button>
                                            <Button className='fa-tjan' type="primary" htmlType="submit">
                                            提交
                                            </Button>
                                    </Form.Item> */}
                </Form>
              </div>

              {/* 倒数第二个 */}

              {/* 最后一行 */}
            </div>
          </div>
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyi">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item className="fa-fcxb" label="附件">
                    {/* <Upload {...props} >
                                                <Button icon={<UploadOutlined />}>上传</Button>
                                            </Upload> */}

                    <Button className="fa-inpcxb">
                      <span className="anniuzia">
                        <input type="file"></input>
                      </span>
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <Form
                  className="faform"
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  {/* <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                            <Button type="primary" htmlType="submit">
                                            转发
                                            </Button>
                                            <Button className='fa-tjan' type="primary" htmlType="submit">
                                            保存
                                            </Button>
                                            <Button className='fa-tjan' type="primary" htmlType="submit">
                                            提交
                                            </Button>
                                    </Form.Item> */}
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右边 */}
    </div>
  );
});
export default Sw;
