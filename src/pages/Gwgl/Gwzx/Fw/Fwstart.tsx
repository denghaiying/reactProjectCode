import React, { useEffect, useState } from 'react';
import './Fwstart.less';
import { Form, Input, Button, Upload } from 'antd';
import { Select } from 'antd';
import { Radio } from 'antd';
import { Tag } from 'antd';
import { DatePicker, Space } from 'antd';
import { message } from 'antd';
import { Modal } from 'antd';
import { Transfer } from 'antd';
import { observer } from 'mobx-react';
import WPS from '../WPS/index';
import WflwButtons from '@/components/Wflw';
import { SearchOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
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

const Fwstart = observer((props) => {
  // 拟稿人
  const [modal1Visibleaa, setModal1Visibleaa] = useState<boolean>(false);
  // 拟稿部门
  const [modal1Visibleaabm, setModal1Visibleaabm] = useState<boolean>(false);
  // 校对人
  const [modal1Visibleaajdr, setModal1Visibleaajdr] = useState<boolean>(false);
  // 文种
  const [modal1Visibleaawz, setModal1Visibleaawz] = useState<boolean>(false);
  // 秘密等级
  const [modal1Visibleaadj, setModal1Visibleaadj] = useState<boolean>(false);
  // 主送
  const [modal1Visibleaazs, setModal1Visibleaazs] = useState<boolean>(false);
  // 抄送
  const [modal1Visibleaacs, setModal1Visibleaacs] = useState<boolean>(false);
  ///WPS弹框
  const [modalWPSVisible, setModalWPSVisible] = useState<boolean>(false);

  //WPS文件路径
  const [filePath, setFilePath] = useState(null);
  // 穿梭框
  const [mockData, setMockData] = useState<any[]>([]);
  // 穿梭框
  const [targetKeys, setTargetKeys] = useState<any[]>([]);

  const [wflwType, setWflwType] = useState([
    'submit',
    'return',
    'reject',
    'logview',
  ]);
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const formItemLayout2 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const [refform] = Form.useForm();

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

  //WPS的弹窗确定事件
  const onWPSModalOk = (value) => {
    setModalWPSVisible(false);
  };
  //请求
  const onOpenWPS = () => {
    setModalWPSVisible(true);
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
  const onBeforeWfAction = () => {};

  const onAfterWfAction = () => {};
  const onClick = () => {
    refform.validateFields().then((values) => {
      console.log(values);
    });
  };
  return (
    <div className="fabox">
      {/* 顶部标题 */}
      <div className="fatop">
        <div className="faz">
          <p>发文拟稿</p>
          {/* <Button onClick={onClick}>提交</Button> */}
        </div>
        <div className="sfann">
          <WflwButtons
            style={{ marginLeft: '10px' }}
            offset={[18, 0]}
            type={wflwType}
            wfid={''}
            wfinst={''}
            onBeforeAction={onBeforeWfAction}
            onAfterAction={onAfterWfAction}
          />
        </div>
      </div>
      {/* 左边输入信息 */}
      <Form form={refform} {...formItemLayout} onValuesChange={onChange}>
        <div className="faleft">
          <div className="faleftbox">
            {/* 第一行 */}
            <div className="faa">
              <div className="faa-bt">
                <div className="fa-yyicx">
                  <div className="faform">
                    <Form.Item name="jjcd" className="fa-fcxb" label="紧急程度">
                      <Radio.Group defaultValue="1">
                        <Radio value="1">
                          <Tag color="success">正常</Tag>
                        </Radio>
                        <Radio value="2">
                          <Tag color="processing">重要</Tag>
                        </Radio>
                        <Radio value="3">
                          <Tag color="warning">紧急</Tag>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
                {/* 2 */}
              </div>
            </div>
            {/* 第二行 */}
            <div className="fab">
              <div className="faa-bt">
                <div className="fa-yyicx">
                  <Form.Item name="title" className="fa-fcx" label="标题">
                    <Input className="fa-inpcxa" />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* 第三行 */}
            <div className="fabfabfab">
              <div className="faa-bt">
                <div className="fa-yyicxyyicx">
                  <Form.Item label="发文号" name="fwh">
                    <Input className="fa-inpcxa" />
                  </Form.Item>
                  <Button.Group style={{ marginLeft: 250, top: 0 }}>
                    <Button className="fa-inpcxaxfdann">
                      <span>重新生成编号</span>
                    </Button>
                    <Button className="fa-inpcxaxfdanna">
                      <span>选择预留号</span>
                    </Button>
                    <Button className="fa-inpcxaxfdanna">
                      <span>新建预留号</span>
                    </Button>
                  </Button.Group>
                </div>
              </div>
            </div>
          </div>
          {/* 第四行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyicxa">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="拟稿部门"
                    name="ngbm"
                  >
                    <Input
                      addonAfter={
                        <Button
                          className="fa-inpcxb"
                          onClick={() => setModal1Visibleaabm(true)}
                        >
                          <SearchOutlined />
                        </Button>
                      }
                    />
                    <Modal
                      title="请输入拟稿部门："
                      style={{ top: 100 }}
                      visible={modal1Visibleaabm}
                      onOk={() => setModal1Visibleaabm(false)}
                      onCancel={() => setModal1Visibleaabm(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </div>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="拟稿人"
                    name="ngr"
                  >
                    <Input
                      addonAfter={
                        <Button
                          className="fa-inpcxb"
                          onClick={() => setModal1Visibleaa(true)}
                        >
                          <SearchOutlined />
                        </Button>
                      }
                    />
                    <Modal
                      title="请输入拟稿人："
                      style={{ top: 100 }}
                      visible={modal1Visibleaa}
                      onOk={() => setModal1Visibleaa(false)}
                      onCancel={() => setModal1Visibleaa(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
          {/* 第五行 */}
          <div className="fabh">
            <div className="faa-bt">
              <div className="fa-yyi">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="公文种类"
                    name="doctypeId"
                  >
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaawz(true)}
                    >
                      <span className="anniuzia">点击输入</span>
                    </Button>
                    <Modal
                      title="请输入文种："
                      style={{ top: 100 }}
                      visible={modal1Visibleaawz}
                      onOk={() => setModal1Visibleaawz(false)}
                      onCancel={() => setModal1Visibleaawz(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </div>
              </div>
              {/* 2 */}
              <div className="fa-yyer">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="校对人"
                    name="jdr"
                  >
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaajdr(true)}
                    >
                      <span className="anniuzia">点击输入</span>
                    </Button>
                    <Modal
                      title="请输入校对人："
                      style={{ top: 100 }}
                      visible={modal1Visibleaajdr}
                      onOk={() => setModal1Visibleaajdr(false)}
                      onCancel={() => setModal1Visibleaajdr(false)}
                    >
                      <Input className="fa-inpcxb" />
                    </Modal>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          {/* 第六行 */}
          <div className="fablw">
            <div className="faa-bt">
              <div className="fa-yyi">
                <div className="faform">
                  <Form.Item
                    className="fa-fcxb"
                    label="发文日期"
                    name="fwrq"
                    {...formItemLayout2}
                  >
                    <Space direction="vertical" className="fa-inpcxb">
                      <DatePicker
                        className="fa-inpcxbcx"
                        renderExtraFooter={() => 'extra footer'}
                        showTime
                      />
                    </Space>
                  </Form.Item>
                </div>
              </div>

              <div className="fa-yyer">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="秘密等级"
                    name="mj"
                  >
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaadj(true)}
                    >
                      <span className="anniuzia">点击选择</span>
                    </Button>
                    <Modal
                      title="请选择秘密等级："
                      style={{ top: 100 }}
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
                </div>
              </div>
            </div>
          </div>

          {/* 第7行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyicx">
                <Form.Item className="fa-fcx" label="主题词" name="ztc">
                  <Input className="fa-inpcxa" />
                </Form.Item>
              </div>
              {/* 2 */}
            </div>
          </div>

          {/* 第8行 */}
          <div className="fabdbg">
            <div className="faa-bt">
              <div className="fa-yyicx">
                <Form.Item className="fa-fcx" label="拟稿意见" name="ngyj">
                  {/* <Input className='fa-inpcxa' /> */}
                  <TextArea
                    className="fa-inpcxainpcxa"
                    showCount
                    maxLength={100}
                    onChange={onChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* 第9行 */}
          <div className="fabh">
            <div className="faa-bt">
              <div className="fa-yyi">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="分发"
                    name="fenfa"
                  >
                    <Select
                      className="fa-inpcxb"
                      defaultValue="请选择"
                      onChange={handleChange}
                    >
                      <Option value="a">单位</Option>
                      <Option value="b">个人</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/* 2 */}
              <div className="fa-yyer"></div>
            </div>
          </div>

          {/* 第10行 */}
          <div className="fab">
            <div className="faa-bt">
              <div className="fa-yyi">
                <div className="faform">
                  <Form.Item
                    {...formItemLayout2}
                    className="fa-fcxb"
                    label="主送"
                    name="zhusong"
                  >
                    <Button
                      className="fa-inpcxb"
                      onClick={() => setModal1Visibleaazs(true)}
                    >
                      <span className="anniuzia">点击选择</span>
                    </Button>
                    <Modal
                      className="mtk"
                      title="请选择主送："
                      style={{ top: 100 }}
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
                </div>
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
                      style={{ top: 100 }}
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
                    {/* <Button className='fa-inpcxb' onClick={() => setModal1Visibleaabm(true)}>
                                            <span className='anniuzia'>打开文件</span>
                                        </Button> */}
                    <Input
                      addonAfter={
                        <Button type="primary" onClick={onOpenWPS}>
                          打开文件
                        </Button>
                      }
                    />
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
      </Form>

      {/* 右边 */}

      <Modal
        title="编辑文档："
        width={940}
        style={{ top: 0 }}
        visible={modalWPSVisible}
        onOk={() => onWPSModalOk(false)}
        onCancel={() => setModalWPSVisible(false)}
        forceRender
      >
        {modalWPSVisible && <WPS />}
      </Modal>
    </div>
  );
});
export default Fwstart;
