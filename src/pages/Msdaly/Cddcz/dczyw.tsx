import React, { useEffect, useState, createRef, useRef } from 'react';
import {
  message,
  Tooltip,
  Modal,
  Button,
  Card,
  Steps,
  Form,
  Row,
  Col,
  Input,
  Select,
  Divider,
  TreeSelect,
  Checkbox,
  DatePicker,
  Alert,
  Rate,
  Spin,
  Icon,
  Progress,
} from 'antd';
import { AuditOutlined } from '@ant-design/icons';
import { observer, useLocalObservable } from 'mobx-react';
import PDF from 'react-pdf-js';
import SysStore from '../../../stores/system/SysStore';
import './index.less';
import fetch from '../../../utils/fetch';
import moment from 'moment';
import { pdfjs, Document, Page } from 'react-pdf/dist/esm/entry.webpack'; ///dist/esm/entry.webpack
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = '/work/pdf.worker.min.js';

const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;
const dczyw = observer((props) => {
  const [sqxxform] = Form.useForm();
  const [cdxsform] = Form.useForm();
  const [dasjfsform] = Form.useForm();
  const [sqxxqrform] = Form.useForm();
  const [czclform] = Form.useForm();
  const [bljgform] = Form.useForm();
  const [sfslly, setSfslly] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(4);
  const [currentstep, setCurrentstep] = useState(0);
  //pdf
  const [fileurl, setFileurl] = useState();
  const [pdfdata, setPdfdata] = useState();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [nextpage, setNextpage] = useState(true);
  const [ratepj, setRatepj] = useState(0);
  const [sfthdisabled, setSfthdisable] = useState(true);
  const [sfsl, setSfsl] = useState(true);
  const [czfs, setCzfs] = useState(false);
  const [czfsrequired, setCzfsrequired] = useState(false);
  const [bslyy, setBslyy] = useState(false);
  const [jdsj, setJdsj] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const printRef = useRef(null);
  //控制是否显示pdf
  const [isShowPdf, setIsShowPdf] = useState(true);

  const DczywStore = useLocalObservable(() => ({
    cdata: {},
    cdgdata: {},
    dwTreeData: [],
    dalxData: [],
    mscdfwData: [],
    pic_z: '',
    pic_f: '',
    PDFBlob: '',
    sslchecked: false,
    fslchecked: false,
    yjczfschecked: false,
    smlqczfschecked: false,
    emsyjfschecked: false,
    ghyjfschecked: false,
    // 利用目的数据
    lymdSelectData: [],
    scsj: props.record.scsj === 'undefined' ? 0 : Date.parse(props.record.scsj), //上传时间
    bcsc: props.record.bcsc, //保存时长
    sysj: 0, //剩余时间秒
    taskname: 0, //定时任务id
    async saveData(values) {
      const { ...v } = this.cdgdata;
      this.cdgdata = { ...v, ...values };
      console.log(this.cdgdata);
    },
    async downloadFile(id) {
      const response = await fetch.post(
        '/api/eps/e9msdaly/lasqd/download/',
        { params: { sqdid: id } },
        { responseType: 'blob' },
      );
      if (response.status === 200) {
        setPdfdata(response.data);
        const type = 'application/pdf';
        const blob = new Blob([response.data], { type });
        let reader = new FileReader();
        reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
        reader.addEventListener('load', function () {
          setFileurl(reader.result);
        });
      } else {
        message.error('查档结果预览失败！');
        return;
      }
    },
    async getData(id) {
      const res = await fetch.get('/api/eps/e9msdaly/lasqd/' + id);
      if (res.status == 200) {
        const data = res.data;
        if (!data) {
          message.error('该受理单不存在！');
        } else {
          this.cdata = data;
          this.cdgdata = data;
          this.pic_z = data.pic_z;
          this.pic_f = data.pic_f;
          if (data.sfsl === 'N') {
            setSfslly(true);
          }
          //查档被退回
          if (
            data.status === 1 &&
            data.hasOwnProperty('yid') &&
            data.yid !== null
          ) {
            setStep(1);
            setSfthdisable(false);
          }
          if (data.sfsl === 'Y') {
            DczywStore.sslchecked = true;
          } else {
            DczywStore.fslchecked = true;
          }
          if (data.czfs === '01') {
            DczywStore.yjczfschecked = true;
          } else if (data.czfs === '02') {
            DczywStore.smlqczfschecked = true;
          }
          if (data.yjfs === '01') {
            DczywStore.emsyjfschecked = true;
          } else if (data.yjfs === '02') {
            DczywStore.ghyjfschecked = true;
          }
          sqxxform.setFieldsValue(data);
          cdxsform.setFieldsValue(data);
          dasjfsform.setFieldsValue(data);
          sqxxqrform.setFieldsValue(data);
        }
      }
    },
    async getdaLx() {
      let url = '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=020';
      const response = await fetch.get(url);
      console.log('responenLx', response);
      if (response && response.status === 200) {
        if (response.data) {
          this.dalxData = response.data.map((o) => ({
            id: o.bh,
            label: o.mc,
            value: o.bh,
          }));
        }
      } else {
        return;
      }
    },
    async queryTreeDwList() {
      const response = await fetch.get(
        '/api/eps/control/main/dw/queryForList',
        { params: { dag: 'Y' } },
      );
      if (response.status === 200) {
        var sjData = [];
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            let newKey = {};
            newKey = response.data[i];
            newKey.key = newKey.id;
            newKey.title = newKey.mc;
            newKey.value = newKey.id;
            sjData.push(newKey);
          }
          this.dwTreeData = sjData;
        }
      }
    },
    //删除ftp文件,
    async deleteFtpFile() {
      const params = {
        sqdid: props.record.id,
        ftpid: props.record.id,
        pdfname: props.record.filename,
      };
      return await fetch.post('/api/eps/e9msdaly/lasqd/deletftpfile', params);
    },
    async getSjzdData(zdmc) {
      const fd = new FormData();
      fd.append('zdx', zdmc);
      const res = await fetch.post(
        `/api/eps/control/main/dalydj/querySjzd`,
        fd,
      );
      if (res && res.data && res.data.success) {
        this.lymdSelectData = res.data.results;
      }
    },
    async getMscdfw() {
      let url = '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=MSCDFW';
      const response = await fetch.get(url);
      console.log('responenLx', response);
      if (response && response.status === 200) {
        if (response.data) {
          this.mscdfwData = response.data.map((o) => ({
            id: o.bh,
            label: o.mc,
            value: o.bh,
          }));
        }
      } else {
        return;
      }
    },
  }));
  // 点击后初始化页面
  const click = () => {
    debugger;
    if (props.record.hasOwnProperty('ftpid')) {
      DczywStore.downloadFile(props.record.id)
        .then(() => {
          if (fileurl) {
            DczywStore.getdaLx().then(() => {
              DczywStore.queryTreeDwList().then(() => {
                DczywStore.getData(props.record.id).then(() => {
                  timetask();
                  setVisible(true);
                  DczywStore.getSjzdData('借阅目的');
                  DczywStore.getMscdfw();
                });
              });
            });
          }
        })
        .catch((error) => {
          DczywStore.getdaLx().then(() => {
            DczywStore.queryTreeDwList().then(() => {
              DczywStore.getData(props.record.id).then(() => {
                timetask();
                setVisible(true);
                DczywStore.getSjzdData('借阅目的');
                DczywStore.getMscdfw();
              });
            });
          });
        });
    } else {
      DczywStore.getdaLx().then(() => {
        DczywStore.queryTreeDwList().then(() => {
          DczywStore.getData(props.record.id).then(() => {
            timetask();
            setVisible(true);
            DczywStore.getSjzdData('借阅目的');
            DczywStore.getMscdfw();
          });
        });
      });
    }
  };
  // 初始化加载数据
  useEffect(() => {}, []);
  const handleDczywCancel = () => {
    clearInterval(DczywStore.taskname);
    DczywStore.taskname = 0;
    setVisible(false);
    setStep(4);
  };
  const next = () => {
    switch (step) {
      case 0:
        break;
      case 1:
        cdxsform.validateFields().then((values) => {
          const entity = {};
          const { entries } = Object;
          entries(values).forEach(([key, value]) => {
            if (value) {
              entity[key] = value;
            }
          });
          DczywStore.saveData(entity);
        });
        break;
      case 2:
        dasjfsform.validateFields().then((values) => {
          const entity = {};
          const { entries } = Object;
          entries(values).forEach(([key, value]) => {
            if (value) {
              if (key === 'jdsj') {
                entity['jdsj'] = moment(value).format('YYYY-MM-DD HH:mm:ss');
              } else {
                entity[key] = value;
              }
            }
          });
          DczywStore.saveData(entity);
        });
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        bljgform.validateFields().then((values) => {
          const entity = {};
          const { entries } = Object;
          entries(values).forEach(([key, value]) => {
            if (value) {
              entity[key] = value;
            }
          });
          DczywStore.saveData(entity);
        });
        break;
    }
  };
  const prev = () => {
    if (DczywStore.cdgdata.sfsl === 'N' && step === 4) {
      setStep(step - 3);
      setCurrentstep(step - 3);
    } else {
      setStep(step - 1);
    }
  };
  const onFinish = (values: any) => {
    if (DczywStore.cdgdata.sfsl === 'N' && step === 1) {
      setStep(step + 3);
    } else {
      setStep(step + 1);
    }
    setCurrentstep(step + 1);
  };
  // 定时任务方法
  const timetask = () => {
    if (DczywStore.taskname !== 0) {
      return;
    }
    debugger;
    DczywStore.sysj =
      DczywStore.bcsc - (Date.parse(new Date()) - DczywStore.scsj) / 1000; //秒
    if (DczywStore.sysj > 0) {
      DczywStore.taskname = setInterval(() => {
        console.log(DczywStore.sysj / 60);
        DczywStore.sysj = DczywStore.sysj - 1;
        if (DczywStore.sysj <= 0) {
          clearInterval(DczywStore.taskname);
          DczywStore.deleteFtpFile();
          DczywStore.taskname = 0;
        }
      }, 1000);
    } else {
      DczywStore.deleteFtpFile();
      DczywStore.sysj = 0;
      setIsShowPdf(false);
    }
  };
  const renderCdsqxx = () => {
    return (
      <Form
        labelAlign="left"
        form={sqxxform}
        style={{ padding: '20px' }}
        onFinish={onFinish}
      >
        <Row>
          <Col span={5}>
            <div className="card">
              {!DczywStore.pic_z && (
                <div className="card-inner">
                  <i className="iconfont iconsaomiaoyi card-fonticon" />
                  <div className="card-inner-text">扫描身份证 头像面</div>
                </div>
              )}
              {DczywStore.pic_z && (
                <div className="card-inner">
                  <img src={DczywStore.pic_z} alt="" />
                </div>
              )}
            </div>
            <div className="card">
              {!DczywStore.pic_f && (
                <div className="card-inner">
                  <i className="iconfont iconsaomiaoyi card-fonticon" />
                  <div className="card-inner-text">扫描身份证 国徽面</div>
                </div>
              )}
              {DczywStore.pic_f && (
                <div className="card-inner">
                  <img src={DczywStore.pic_f} alt="" />
                </div>
              )}
            </div>
          </Col>
          <Col span={19}>
            <Row>
              <Col span={12}>
                <FormItem
                  label="利用者姓名："
                  name="lyzxm"
                  required
                  rules={[{ required: true, message: '请输入利用者姓名' }]}
                >
                  <Input
                    allowClear
                    placeholder="查档人"
                    disabled
                    style={{ width: 300 }}
                    addonAfter={
                      <Button disabled type="primary">
                        读取证件
                      </Button>
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  required
                  label="联系电话："
                  name="lyzdh"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input
                    allowClear
                    style={{ width: 300 }}
                    placeholder="联系电话"
                    disabled
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  required
                  label=" 证 件 类 型："
                  name="zjlx"
                  rules={[{ required: true, message: '请选择证件类型' }]}
                >
                  <Select
                    style={{ width: 300 }}
                    placeholder="证件类型"
                    disabled
                  >
                    <Option key="01" value="01">
                      身份证
                    </Option>
                    <Option key="02" value="02">
                      军官证
                    </Option>
                    <Option key="99" value="99">
                      其他
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  required
                  label="证件号码："
                  name="zjhm"
                  rules={[{ required: true, message: '请输入证件号码' }]}
                >
                  <Input
                    allowClear
                    style={{ width: 300 }}
                    placeholder="证件号码"
                    disabled
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  required
                  label=" 利 用 目 的 ："
                  name="lymd"
                  rules={[{ required: true, message: '请选择利用目的' }]}
                >
                  <Select style={{ width: 300 }} placeholder="利用目的">
                    {DczywStore.lymdSelectData.map((o) => (
                      <Select.Option value={o.bh} key={o.id}>
                        {o.mc}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  required
                  label="档案种类："
                  name="dalx"
                  rules={[{ required: true, message: '请选择档案种类' }]}
                >
                  <Select
                    style={{ width: 300 }}
                    placeholder="档案种类"
                    disabled
                  >
                    {DczywStore.dalxData.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem name="dalxmc" hidden>
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label=" 查 档 范 围 ："
                  name="cdfw"
                  rules={[{ required: true, message: '请选择查档范围' }]}
                >
                  {DczywStore.mscdfwData.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="effooter">
          <Button.Group>
            <FormItem>
              <Button type="primary" htmlType="submit" onClick={next}>
                下一步
              </Button>
            </FormItem>
          </Button.Group>
        </div>
      </Form>
    );
  };
  const onDwChange = (value, label, extra) => {
    cdxsform.setFieldsValue({ cdgbh: '', cdgmc: label[0] });
  };
  const onNewSslChange = (e) => {
    if (e.target.checked) {
      DczywStore.sslchecked = true;
      DczywStore.fslchecked = false;
      setBslyy(false);
      setSfsl(true);
      cdxsform.setFieldsValue({
        sfsl: 'Y',
        bslyy: null,
        mfxm: null,
        mfcsrq: null,
        wfxm: null,
        wfcsrq: null,
        cdxs: null,
        cdgid: null,
        cdgbh: null,
        cdgmc: null,
      });
    } else {
      DczywStore.sslchecked = false;
      DczywStore.fslchecked = true;
      setBslyy(true);
      setSfsl(false);
      cdxsform.setFieldsValue({
        sfsl: 'N',
        bslyy: null,
        mfxm: null,
        mfcsrq: null,
        wfxm: null,
        wfcsrq: null,
        cdxs: null,
        cdgid: null,
        cdgbh: null,
        cdgmc: null,
      });
    }
  };
  const onNewFslChange = (e) => {
    if (e.target.checked) {
      setBslyy(true);
      setSfsl(false);
      DczywStore.fslchecked = true;
      DczywStore.sslchecked = false;
      cdxsform.setFieldsValue({
        sfsl: 'N',
        bslyy: null,
        mfxm: null,
        mfcsrq: null,
        wfxm: null,
        wfcsrq: null,
        cdxs: null,
        cdgid: null,
        cdgbh: null,
        cdgmc: null,
      });
    } else {
      setBslyy(false);
      setSfsl(true);
      DczywStore.fslchecked = false;
      DczywStore.sslchecked = true;
      cdxsform.setFieldsValue({
        sfsl: 'Y',
        bslyy: null,
        mfxm: null,
        mfcsrq: null,
        wfxm: null,
        wfcsrq: null,
        cdxs: null,
        cdgid: null,
        cdgbh: null,
        cdgmc: null,
      });
    }
  };
  const renderCdxs = () => {
    return (
      <Form
        labelAlign="left"
        form={cdxsform}
        style={{ padding: '20px' }}
        onFinish={onFinish}
      >
        <Row>
          <Col span={24}>
            <Card style={{ width: '100%' }}>
              <Row>
                <Col span={9}>
                  <FormItem name="sfsl" style={{ paddingTop: '20px' }}>
                    <Checkbox
                      checked={DczywStore.sslchecked}
                      onChange={onNewSslChange}
                    >
                      予以受理
                    </Checkbox>
                  </FormItem>
                </Col>
                <Col span={9}>
                  <FormItem name="sfsl" style={{ paddingTop: '20px' }}>
                    <Checkbox
                      checked={DczywStore.fslchecked}
                      onChange={onNewFslChange}
                    >
                      不予受理
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
              {bslyy && (
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="理由:"
                      name="bslyy"
                      required={bslyy}
                      rules={[{ required: bslyy, message: '请输入不予理由' }]}
                      style={{ paddingTop: '20px' }}
                    >
                      <Input.TextArea
                        allowClear
                        showCount
                        maxLength={500}
                        style={{ height: '20px' }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
        <Row>
          <Card title="查询档案" style={{ width: '100%' }}>
            <Col span={24}>
              {DczywStore.cdgdata.dalxmc === '婚姻档案' && (
                <Card title="婚姻档案" style={{ width: '100%' }}>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        label="男方姓名："
                        name="mfxm"
                        required={sfsl}
                        rules={[{ required: sfsl, message: '请输入男方姓名' }]}
                      >
                        <Input
                          allowClear
                          placeholder="男方姓名"
                          disabled={sfthdisabled}
                          style={{ width: 300 }}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        required={sfsl}
                        label="男方出生年月："
                        name="mfcsrq"
                        rules={[
                          { required: sfsl, message: '请输入男方出生年月' },
                        ]}
                      >
                        <Input
                          allowClear
                          style={{ width: 300 }}
                          placeholder="男方出生年月"
                          disabled={sfthdisabled}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        required={sfsl}
                        label="女方姓名："
                        name="wfxm"
                        rules={[{ required: sfsl, message: '请输入男方姓名' }]}
                      >
                        <Input
                          allowClear
                          placeholder="女方姓名"
                          disabled={sfthdisabled}
                          style={{ width: 300 }}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        required={sfsl}
                        label="女方出生年月："
                        name="wfcsrq"
                        rules={[
                          { required: sfsl, message: '请输入女方出生年月' },
                        ]}
                      >
                        <Input
                          allowClear
                          style={{ width: 300 }}
                          placeholder="女方出生年月"
                          disabled={sfthdisabled}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Divider />
                </Card>
              )}
            </Col>
            <Row style={{ paddingTop: '10px' }}>
              <Col span={24}>
                <FormItem label="其他查档线索:" name="cdxs">
                  <Input.TextArea
                    allowClear
                    showCount
                    maxLength={500}
                    style={{ height: '20px', width: '100%' }}
                    disabled={sfthdisabled}
                  />
                </FormItem>
              </Col>
            </Row>
            {DczywStore.cdgdata.status === 1 && (
              <Row style={{ paddingTop: '10px' }}>
                <Col span={24}>
                  <Card style={{ width: '100%' }}>
                    <Alert
                      message="查档被退回"
                      description={DczywStore.cdgdata.rptrs}
                      type="warning"
                      showIcon
                    />
                  </Card>
                </Col>
              </Row>
            )}
            <Row>
              <Col span={24}>
                <FormItem
                  label="查询档案馆:"
                  name="cdgid"
                  required={sfsl}
                  rules={[{ required: sfsl, message: '请选择查询档案馆' }]}
                >
                  <TreeSelect
                    style={{ width: 300 }}
                    treeData={DczywStore.dwTreeData}
                    placeholder="请选择查询档案馆"
                    treeDefaultExpandAll
                    allowClear
                    onChange={onDwChange}
                    disabled={sfthdisabled}
                  />
                </FormItem>
                <FormItem name="cdgbh" hidden>
                  <Input />
                </FormItem>
                <FormItem name="cdgmc" hidden>
                  <Input />
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={prev}>
              {' '}
              上一步{' '}
            </Button>
            <FormItem>
              <Button type="primary" htmlType="submit" onClick={next}>
                下一步
              </Button>
            </FormItem>
          </Button.Group>
        </div>
      </Form>
    );
  };
  const onYjczfsChange = (e) => {
    if (e.target.checked) {
      setCzfs(false);
      setCzfsrequired(true);
      DczywStore.yjczfschecked = true;
      DczywStore.smlqczfschecked = false;
      dasjfsform.setFieldsValue({ czfs: '01', sjr: DczywStore.cdgdata.lyzxm });
    } else {
      setCzfs(true);
      setCzfsrequired(false);
      DczywStore.yjczfschecked = false;
      DczywStore.smlqczfschecked = true;
      DczywStore.emsyjfschecked = false;
      DczywStore.ghyjfschecked = false;
      dasjfsform.setFieldsValue({
        czfs: '02',
        yjfs: null,
        sjr: null,
        yzbm: null,
        yjdz: null,
      });
    }
  };
  const onEmsyjfsChange = (e) => {
    if (e.target.checked) {
      DczywStore.emsyjfschecked = true;
      DczywStore.ghyjfschecked = false;
      dasjfsform.setFieldsValue({ yjfs: '01' });
    } else {
      DczywStore.emsyjfschecked = false;
      DczywStore.ghyjfschecked = true;
      dasjfsform.setFieldsValue({ yjfs: '02' });
    }
  };
  const onGhyjfsChange = (e) => {
    if (e.target.checked) {
      DczywStore.emsyjfschecked = false;
      DczywStore.ghyjfschecked = true;
      dasjfsform.setFieldsValue({ yjfs: '02' });
    } else {
      DczywStore.emsyjfschecked = true;
      DczywStore.ghyjfschecked = false;
      dasjfsform.setFieldsValue({ yjfs: '01' });
    }
  };
  const onSmlqczfsChange = (e) => {
    if (e.target.checked) {
      setCzfs(true);
      setCzfsrequired(false);
      DczywStore.yjczfschecked = false;
      DczywStore.smlqczfschecked = true;
      DczywStore.emsyjfschecked = false;
      DczywStore.ghyjfschecked = false;
      dasjfsform.setFieldsValue({
        czfs: '02',
        yjfs: null,
        sjr: null,
        yzbm: null,
        yjdz: null,
      });
    } else {
      setCzfs(false);
      setCzfsrequired(true);
      DczywStore.yjczfschecked = true;
      DczywStore.smlqczfschecked = false;
      dasjfsform.setFieldsValue({ czfs: '01', sjr: DczywStore.cdgdata.lyzxm });
    }
  };
  const renderCddasjfs = () => {
    return (
      <Form
        labelAlign="left"
        form={dasjfsform}
        style={{ padding: '20px' }}
        onFinish={onFinish}
      >
        <Row style={{ height: '80%' }}>
          <Card title="档案送交方式" style={{ width: '100%' }}>
            <Card title="受理档案馆信息" style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <FormItem
                    label="受理档案馆："
                    name="sldagmc"
                    required
                    rules={[{ required: true, message: '请输入受理档案馆' }]}
                  >
                    <Input
                      allowClear
                      placeholder="受理档案馆"
                      disabled
                      style={{ width: 300 }}
                    />
                  </FormItem>
                  <FormItem name="sldagid" hidden>
                    <Input />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    required
                    label="电话："
                    name="sldagtel"
                    rules={[{ required: true, message: '请输入电话' }]}
                  >
                    <Input
                      allowClear
                      style={{ width: 300 }}
                      placeholder="电话"
                      disabled={sfthdisabled}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="传真：" name="sldagtax">
                    <Input
                      allowClear
                      placeholder="传真"
                      disabled={sfthdisabled}
                      style={{ width: 300 }}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    required
                    label="&emsp;&emsp;接 待 人："
                    name="jdr"
                    rules={[{ required: true, message: '请输入接待人' }]}
                  >
                    <Input
                      allowClear
                      style={{ width: 300 }}
                      placeholder="接待人"
                      disabled={sfthdisabled}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    required
                    label="接待时间："
                    name="jdsj"
                    rules={[{ required: true, message: '请输入接待时间' }]}
                  >
                    <Input
                      allowClear
                      style={{ width: 300 }}
                      placeholder="接待时间"
                      disabled
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title="出证方式" style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <FormItem name="czfs" style={{ paddingTop: '20px' }}>
                    <Checkbox
                      checked={DczywStore.yjczfschecked}
                      onChange={onYjczfsChange}
                      disabled={sfthdisabled}
                    >
                      邮寄
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Card style={{ width: '100%' }}>
                <Row>
                  <Col span={8}>
                    <FormItem name="yjfs" style={{ paddingTop: '20px' }}>
                      <Checkbox
                        checked={DczywStore.emsyjfschecked}
                        onChange={onEmsyjfsChange}
                        disabled={sfthdisabled}
                      >
                        EMS(到付自费)
                      </Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem name="yjfs" style={{ paddingTop: '20px' }}>
                      <Checkbox
                        checked={DczywStore.ghyjfschecked}
                        onChange={onGhyjfsChange}
                        disabled={sfthdisabled}
                      >
                        挂号(免邮费)
                      </Checkbox>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    告知：1.为便于利用者及时收到所需档案材料，利用者应当如实提供确切的地址。2.如果送达地址有变更，利用者应当及时书面告知受理点。若因提供的地址不确切，或不及时告知变更后的地址，使档案无法及时送达，以及采用以上方式在送递达过程中其他后果由利用者自行承担。
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      label="收件人："
                      name="sjr"
                      required={czfsrequired}
                      rules={[
                        { required: czfsrequired, message: '请输入收件人' },
                      ]}
                    >
                      <Input
                        allowClear
                        placeholder="收件人"
                        disabled
                        style={{ width: 300 }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      required
                      label="邮政编码："
                      name="yzbm"
                      required={czfsrequired}
                      rules={[
                        { required: czfsrequired, message: '请输入邮政编码' },
                      ]}
                    >
                      <Input
                        allowClear
                        style={{ width: 300 }}
                        placeholder="邮政编码"
                        disabled={sfthdisabled}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      required
                      label="邮寄地址："
                      name="yjdz"
                      required={czfsrequired}
                      rules={[
                        { required: czfsrequired, message: '请输入邮寄地址' },
                      ]}
                    >
                      <Input
                        allowClear
                        placeholder="邮寄地址"
                        disabled={sfthdisabled}
                        style={{ width: 300 }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Card>
              <Row>
                <Col span={8}>
                  <FormItem name="czfs" style={{ paddingTop: '20px' }}>
                    <Checkbox
                      checked={DczywStore.smlqczfschecked}
                      onChange={onSmlqczfsChange}
                      disabled={sfthdisabled}
                    >
                      上门领取（请核对联系电话准确无误）
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </Card>
          </Card>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={prev}>
              {' '}
              上一步{' '}
            </Button>
            <FormItem>
              <Button type="primary" htmlType="submit" onClick={next}>
                下一步
              </Button>
            </FormItem>
          </Button.Group>
        </div>
      </Form>
    );
  };
  const doSqxxqrPrint = () => {
    //'dialogWidth:200mm;dialogHeight:297mm;innerHeight:297mm;innerWidthL200mm;edge:Raised;center:yes;help:no;resizable:no;status:no;scroll:no'
    const sqxxqrPrintDiv = document.getElementById('sqxxqrPrint');
    const iframe = document.createElement('IFRAME');
    let doc = null;
    iframe.setAttribute(
      'style',
      'position:absolute;width:0px;height:0px;left:500px;top:500px;',
    );
    document.body.appendChild(iframe);

    doc = iframe.contentWindow.document;
    // 打印时去掉页眉页脚
    doc.write(
      '<style media="print">@page {size: auto;  margin: 0mm; }</style>',
    );

    doc.write(sqxxqrPrintDiv.innerHTML);
    doc.close();
    // 获取iframe的焦点，从iframe开始打印
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    if (navigator.userAgent.indexOf('MSIE') > 0) {
      //打印完删除iframe
      document.body.removeChild(iframe);
    }
  };
  const renderCdsqxxqr = () => {
    return (
      <Form
        labelAlign="left"
        form={sqxxqrform}
        style={{ padding: '20px' }}
        onFinish={onFinish}
      >
        <Row>
          <Card title="申请信息确认" style={{ width: '100%' }}>
            <Row>
              <Col span={24} style={{ margin: '0 auto' }}>
                {/* <div  ref="slreport"> */}
                <div id="sqxxqrPrint">
                  <div align="center">
                    <h1>
                      <font face="verdana">民生档案“异地查档、便民服务”</font>
                    </h1>
                    <h1>
                      <font face="verdana">申请表</font>
                    </h1>
                    <pre>
                      {' '}
                      {moment(DczywStore.cdgdata.jdsj).format('YYYY')}年
                      {moment(DczywStore.cdgdata.jdsj).format('MM')}月
                      {moment(DczywStore.cdgdata.jdsj).format('DD')}日 ● 编号:
                      {DczywStore.cdgdata.id}
                    </pre>
                    <table
                      border="1px"
                      cellspacing="0px"
                      style={{ width: '100%' }}
                    >
                      <tr>
                        <td style={{ width: '20%', textAlign: 'center' }}>
                          <b>利用者姓名</b>
                        </td>
                        <td style={{ width: '30%' }}>
                          {DczywStore.cdgdata.lyzxm}
                        </td>
                        <td style={{ width: '20%', textAlign: 'center' }}>
                          <b>联系电话</b>
                        </td>
                        <td style={{ width: '30%' }}>
                          {DczywStore.cdgdata.lyzdh}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>证件类型</b>
                        </td>
                        <td>
                          <pre>
                            {DczywStore.cdgdata.zjlx === '01' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            居民身份证
                            <br />
                            {DczywStore.cdgdata.zjlx === '02' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            军官证
                            <br />
                            {DczywStore.cdgdata.zjlx === '99' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            其他
                            <br />
                          </pre>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {' '}
                          <b>证件号码</b>{' '}
                        </td>
                        <td>{DczywStore.cdgdata.zjhm}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>利用目的</b>
                        </td>
                        <td>
                          {DczywStore.lymdSelectData.map((o) => {
                            if (DczywStore.cdgdata.lymd === o.bh) {
                              return o.mc;
                            }
                          })}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <b>档案种类</b>
                        </td>
                        <td>{DczywStore.cdgdata.dalxmc}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>查档线索</b>
                        </td>
                        <td colSpan={3}>
                          <pre>
                            档案记载的 {DczywStore.cdgdata.cdgmc}{' '}
                            保管档案的档案馆
                            <br />
                            当事人姓名： {DczywStore.cdgdata.lyzxm}{' '}
                            (查档档案馆)名称：{DczywStore.cdgdata.cdgmc}
                            <br />
                            其他查档内容:
                            <br />
                            &emsp;&emsp;&emsp;&emsp;{DczywStore.cdgdata.cdxs}
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td rowSpan={2} style={{ textAlign: 'center' }}>
                          <b>档案送交方式</b>
                        </td>
                        <td colSpan={3}>
                          <pre>
                            {DczywStore.cdgdata.czfs === '01' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            邮寄：{' '}
                            {DczywStore.cdgdata.yjfs === '01' ? (
                              <span>●</span>
                            ) : (
                              <span>○</span>
                            )}{' '}
                            EMS(到付自费){' '}
                            {DczywStore.cdgdata.yjfs === '02' ? (
                              <span>●</span>
                            ) : (
                              <span>○</span>
                            )}
                            挂号(免邮费)
                            <br />
                            &emsp;告知：
                            1、为便于利用者及时收到所需档案材料，利用者应当如实提供确切的地址。
                            <br />
                            &emsp;&emsp;&emsp;&emsp;&emsp;
                            2、如果送达地址有变更，利用者应当及时书面告知受理点。若因提供的地址不确
                            <br />
                            &emsp;&emsp;&emsp;&emsp;&emsp;
                            切，或不及时告知变更后的地址，使档案无法及时送达，利用者自行承担后果。
                            <br />
                            <br />
                            &emsp;收 件 人：{DczywStore.cdgdata.sjr} 邮政编码：
                            {DczywStore.cdgdata.yzbm}
                            <br />
                            <br />
                            &emsp;邮寄地址:{DczywStore.cdgdata.yjdz}
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <pre>
                            {DczywStore.cdgdata.czfs === '02' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}
                            上门领取 请核对联系电话准确无误。
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>告知承诺</b>
                        </td>
                        <td colSpan={3}>
                          <pre>
                            请利用者仔细阅读下文并签名:
                            <br />
                            &emsp;&emsp;1.异地查档申请和档案材料传输过程有可能造成个人信息泄露风险。
                            <br />
                            &emsp;&emsp;2.本申请表适用于公民异地查询利用记载本人信息的民生档案，不能申请利用
                            <br />
                            &emsp;&emsp;其他公民或组织的档案。
                            <br />
                            &emsp;&emsp;3.利用者承诺提供的身份证件真实有效。
                            <br />
                            &emsp;&emsp;4.是否准予复制档案及可复制档案的内容、数量，由查档档案馆决定。
                            <br />
                            &emsp;&emsp;5.本次复制的档案及其相关信息仅供利用者陈述之查档目的;未经查档档案馆
                            <br />
                            &emsp;&emsp;同意,不得擅自向社会公布。
                            <br />
                            &emsp;&emsp;6.不得利用上述档案材料及其相关内容从事法律法规禁止的行为。
                            <br />
                            &emsp;&emsp;本人承诺遵守上述内容。
                            <br />
                            <b>&emsp;&emsp;利用者签名： 日期： </b>
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            backgroundColor: '#6A4313',
                            textAlign: 'center',
                          }}
                        >
                          <font color="#FFFFFF">
                            以下由受理档案馆 工作人员填写
                          </font>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>是否受理</b>
                        </td>
                        <td>
                          <pre>
                            {DczywStore.cdgdata.sfsl === 'Y' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}
                            予以受理
                            <br />
                            {DczywStore.cdgdata.sfsl !== 'Y' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}
                            不予受理，理由：
                            <br />
                            {DczywStore.cdgdata.bslyy}
                          </pre>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <b>受理签章</b>
                        </td>
                        <td>
                          <pre>
                            （盖章处）
                            <br />
                            <br />
                            <br />
                            <br />
                            受理人员签名：
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>受理档案馆及工作人员信息</b>
                        </td>
                        <td>
                          <pre>
                            {DczywStore.cdgdata.sldagmc}，工作人员
                            {DczywStore.cdgdata.jdr}
                            <br />
                            电话号码：({DczywStore.cdgdata.sldagtel})，传真号：(
                            {DczywStore.cdgdata.sldagtax})
                          </pre>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </Col>
              <Col span={24} style={{ padding: '10px' }}>
                <Button
                  type="primary"
                  onClick={doSqxxqrPrint}
                  style={{ float: 'right' }}
                >
                  打印
                </Button>
              </Col>
            </Row>
          </Card>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={prev}>
              {' '}
              上一步{' '}
            </Button>
            {DczywStore.cdgdata.status !== 1 && (
              <FormItem>
                <Button type="primary" htmlType="submit" onClick={next}>
                  下一步
                </Button>
              </FormItem>
            )}
            {step === 3 &&
              DczywStore.cdgdata.sfsl === 'Y' &&
              DczywStore.cdgdata.status === 1 && (
                <Button type="primary" onClick={doSaveData}>
                  {' '}
                  提交查档档案馆处理{' '}
                </Button>
              )}
          </Button.Group>
        </div>
      </Form>
    );
  };
  const doSaveData = () => {
    let oldstatus = DczywStore.cdgdata.status;
    DczywStore.cdgdata['cdkssj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    DczywStore.cdgdata['whrid'] = SysStore.getCurrentUser().id;
    DczywStore.cdgdata['whr'] = SysStore.getCurrentUser().yhmc;
    DczywStore.cdgdata['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    if (DczywStore.cdgdata.sfsl === 'Y') {
      DczywStore.cdgdata['comple'] = 0;
      DczywStore.cdgdata.status = step;
    } else {
      DczywStore.cdgdata.status = step + 1;
      DczywStore.cdgdata['comple'] = 2; //未受理也结束掉
    }
    if (oldstatus === 0) {
      fetch
        .post('/api/eps/e9msdaly/lasqd/', DczywStore.cdgdata)
        .then((response) => {
          if (response.status == 201) {
            DczywStore.cdgdata = response.data.id;
            if (DczywStore.cdgdata.sfsl == 'Y') {
              message.info('再次成功提交受理单');
            } else {
              message.info('再次申请未受理，已结束成功!');
            }
            clearInterval(DczywStore.taskname);
            DczywStore.taskname = 0;
            setStep(4);
            setVisible(false);
            props.store.findByKey(
              props.store.key,
              1,
              props.store.size,
              props.store.params,
            );
          } else {
            DczywStore.cdgdata.status = 0;
            DczywStore.cdgdata['comple'] = 0;
            message.error(response.statusText);
          }
        })
        .catch((err) => {
          DczywStore.cdgdata.status = 0;
          DczywStore.cdgdata['comple'] = 0;
          message.error('网络出现异常，请刷新后重试');
        });
    } else {
      fetch
        .put(
          '/api/eps/e9msdaly/lasqd/' + DczywStore.cdgdata.id,
          DczywStore.cdgdata,
        )
        .then((response) => {
          if (response.status == 200) {
            DczywStore.cdgdata = response.data;
            if (DczywStore.cdgdata.sfsl == 'Y') {
              message.info('再次成功提交受理单');
            } else {
              message.info('再次申请未受理，已结束成功!');
            }
            clearInterval(DczywStore.taskname);
            DczywStore.taskname = 0;
            setStep(4);
            setVisible(false);
            props.store.findByKey(
              props.store.key,
              1,
              props.store.size,
              props.store.params,
            );
          } else {
            DczywStore.cdgdata.status = oldstatus;
            DczywStore.cdgdata['comple'] = 0;
            message.error(response.statusText);
          }
        })
        .catch((err) => {
          DczywStore.cdgdata.status = 0;
          DczywStore.cdgdata['comple'] = 0;
          message.error('网络出现异常，请刷新后重试');
        });
    }
  };

  const onDocumentComplete = (pages) => {
    setPage(1);
    setPages(pages);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPage(1);
    setPages(numPages);
  };
  //点击上一页
  const handlePrevious = () => {
    debugger;
    if (pages != page - 1) {
      setNextpage(true);
    }
    setPage(page - 1);
  };
  //点击下一页
  const handleNext = () => {
    debugger;
    if (pages === page + 1) {
      setNextpage(false);
    }
    setPage(page + 1);
  };

  const handlePrint = () => {
    debugger;
    const dom = printRef.current;
    const blob = new Blob([pdfdata], { type: 'application/pdf' });
    dom.src = window.URL.createObjectURL(blob);
    if (dom.attachEvent) {
      dom.attachEvent('onload', () => {
        dom.contentWindow.print();
      });
    } else {
      dom.onload = () => {
        dom.contentWindow.print();
      };
    }
  };
  const renderCdczcl = () => {
    return (
      <>
        <Form
          labelAlign="left"
          form={czclform}
          style={{ padding: '20px' }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={24}>
              <Card title="出证处理" style={{ width: '100%' }}>
                {DczywStore.cdgdata.byly === 'N' && (
                  <Row>
                    <Col
                      span={12}
                      style={{ paddingLeft: '100px', paddingBottom: '20px' }}
                    >
                      <Progress
                        strokeColor="#f57979"
                        strokeLinecap="square"
                        type="line"
                        percent={
                          100 - (DczywStore.sysj / DczywStore.bcsc) * 100
                        }
                        showInfo={false}
                      />
                    </Col>
                    <Col span={10} style={{ paddingLeft: '20px' }}>
                      {DczywStore.sysj === 0
                        ? '文件已过期或不存在'
                        : '距离销毁还剩:' +
                          Math.floor(DczywStore.sysj / 3600) +
                          '时' +
                          Math.floor((DczywStore.sysj / 60) % 60) +
                          '分' +
                          Math.floor(DczywStore.sysj % 60) +
                          '秒'}
                    </Col>
                  </Row>
                )}
                {DczywStore.cdgdata.hasOwnProperty('ftpid') && (
                  <>
                    {' '}
                    <Card>
                      <div id="pdfPrint" className="filePdf">
                        {/* <PDF
                          file={fileurl}
                          onDocumentComplete={onDocumentComplete}
                          page={page}
                          scale={(1000 / 595).toFixed(2)}
                        /> */}
                        <Document
                          file={fileurl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          options={{
                            cMapUrl: 'cmaps/',
                            cMapPacked: true,
                          }}
                        >
                          <Page width={880} pageNumber={page} />
                        </Document>
                      </div>
                    </Card>
                    <div className="filePdfFooter">
                      {page !== 1 && (
                        <Button type="primary" onClick={handlePrevious}>
                          上一页
                        </Button>
                      )}
                      <div className="filePdfPage">
                        <span>第{page}页</span>/<span>共{pages}页</span>
                      </div>
                      {nextpage && (
                        <Button
                          style={{ marginLeft: '10px' }}
                          type="primary"
                          onClick={handleNext}
                        >
                          下一页
                        </Button>
                      )}
                      <Button
                        type="primary"
                        onClick={handlePrint}
                        style={{ float: 'right' }}
                      >
                        打印
                      </Button>
                    </div>
                  </>
                )}
                {DczywStore.cdgdata.byly === 'Y' && (
                  <Card style={{ width: '100%' }}>
                    <Row>
                      <Alert
                        message="不予利用"
                        description={DczywStore.cdgdata.bylyly}
                        type="warning"
                        showIcon
                      />
                    </Row>
                  </Card>
                )}
              </Card>
              <iframe
                type="data:application/pdf"
                style={{ display: 'none' }}
                ref={printRef}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="effooter">
                <Button.Group>
                  <Button type="primary" onClick={prev}>
                    {' '}
                    上一步{' '}
                  </Button>
                  <FormItem>
                    <Button type="primary" htmlType="submit" onClick={next}>
                      下一步
                    </Button>
                  </FormItem>
                </Button.Group>
              </div>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  // 办结归档操作加上完成操作
  const doCompData = () => {
    bljgform.validateFields().then((values) => {
      const entity = {};
      const { entries } = Object;
      entries(values).forEach(([key, value]) => {
        if (value) {
          entity[key] = value;
        }
      });
      DczywStore.saveData(entity);
    });
    DczywStore.cdgdata['bjgd'] = 'Y';
    DczywStore.cdgdata['status'] = 6;
    DczywStore.cdgdata['comple'] = 1;
    fetch
      .put(
        '/api/eps/e9msdaly/lasqd/' + DczywStore.cdgdata.id,
        DczywStore.cdgdata,
      )
      .then((response) => {
        if (response.status == 200) {
          clearInterval(DczywStore.taskname);
          DczywStore.taskname = 0;
          DczywStore.cdgdata = response.data;
          setVisible(false);
          setStep(4);
          message.info('办结出证成功，已完成受理单');
          props.store.findByKey(
            props.store.key,
            1,
            props.store.size,
            props.store.params,
          );
        } else {
          message.error(response.statusText);
        }
      })
      .catch((err) => {
        DczywStore.cdgdata['status'] = 4;
        DczywStore.cdgdata['comple'] = 0;
        clearInterval(DczywStore.taskname);
        DczywStore.taskname = 0;
        setVisible(false);
        setStep(4);
        message.error('网络出现异常，请刷新后重试');
        props.store.findByKey(
          props.store.key,
          1,
          props.store.size,
          props.store.params,
        );
      });
  };
  const onPjChange = (value) => {
    setRatepj(value);
    bljgform.setFieldsValue({ pj: value });
  };
  const renderCdbjjg = () => {
    return (
      <Form
        labelAlign="left"
        form={bljgform}
        style={{ padding: '20px' }}
        onFinish={onFinish}
      >
        <Row>
          <Card title="用户评价" style={{ width: '100%' }}>
            <FormItem name="pj">
              <Rate onChange={onPjChange} />
            </FormItem>
          </Card>
          <Card title="办结结果" style={{ width: '100%' }}>
            <Card style={{ width: '100%' }}>
              <Row>
                <Col span={24} style={{ margin: '0 auto' }}>
                  <div id="bjjgPrint">
                    <div align="center">
                      <h1>
                        <font face="verdana">
                          民生档案“异地查档、便民服务”
                          <br />
                          办理结果记录表
                        </font>
                      </h1>
                      <table border="1px" cellspacing="0px">
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              backgroundColor: '#6A4313',
                              textAlign: 'center',
                              width: '600px',
                            }}
                          >
                            <font color="#FFFFFF">
                              <b>以下档案馆工作人员填写</b>
                            </font>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: '100px', textAlign: 'center' }}>
                            <b>
                              查档档案馆
                              <br />
                              名&nbsp;&nbsp;&nbsp;&nbsp;称
                            </b>
                          </td>
                          <td width="200px">{DczywStore.cdgdata.cdgmc}</td>
                          <td style={{ width: '100px', textAlign: 'center' }}>
                            <b>
                              查档档案馆
                              <br />
                              传真电话
                            </b>
                          </td>
                          <td width="200px">{DczywStore.cdgdata.cdgtel}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <b>
                              查档档案馆
                              <br />
                              工作人员姓名
                            </b>
                          </td>
                          <td>{DczywStore.cdgdata.cdglxr}</td>
                          <td style={{ textAlign: 'center' }}>
                            {' '}
                            <b>
                              查档档案馆
                              <br />
                              联系电话
                            </b>{' '}
                          </td>
                          <td>{DczywStore.cdgdata.cdgtel}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <b>
                              预计
                              <br />
                              办结日期
                            </b>
                          </td>
                          <td colSpan={3}>
                            <pre>
                              （请记录查档档案馆预计办结日期，便于追踪。）
                            </pre>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <b>
                              办理
                              <br />
                              结果
                            </b>
                          </td>
                          <td>
                            <pre>
                              {DczywStore.cdgdata.sftgfyj === 'Y' ? (
                                <span>√</span>
                              ) : (
                                <span>□</span>
                              )}
                              提供档案全文复制件，复制：
                              {DczywStore.cdgdata.fyfs} 页。
                              <br />
                              {DczywStore.cdgdata.sfcjzms === 'Y' ? (
                                <span>√</span>
                              ) : (
                                <span>□</span>
                              )}
                              出具档案证明书。
                              <br />
                              {DczywStore.cdgdata.byly === 'Y' ? (
                                <span>√</span>
                              ) : (
                                <span>□</span>
                              )}
                              不准予利用，理由：
                              <div
                                style={{
                                  width: '300px',
                                  display: 'block',
                                  wordBreak: 'break-all',
                                  wordWrap: 'break-word',
                                }}
                              >
                                {DczywStore.cdgdata.bylyly}
                              </div>
                              <br />， 已由查档档案馆告知利用者。
                              <br />
                              {DczywStore.cdgdata.wzdda === 'Y' ? (
                                <span>√</span>
                              ) : (
                                <span>□</span>
                              )}
                              未找到所需档案，未找到原因：
                              <br />
                              <div
                                style={{
                                  width: '300px',
                                  display: 'block',
                                  wordBreak: 'break-all',
                                  wordWrap: 'break-word',
                                }}
                              >
                                {DczywStore.cdgdata.wzdyy}
                              </div>
                            </pre>
                          </td>
                          <td colSpan={2}>
                            <pre>
                              <b>受理信息索引</b>
                              ：（请备注受理编号或利用者姓名，
                              <br />
                              便于与《申请表》对应）
                              <br />
                              受理编号：{DczywStore.cdgdata.id}
                              <br />
                              利用者姓名：{DczywStore.cdgdata.lyzxm}
                              <br />
                            </pre>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <b>
                              受理档案馆
                              <br />
                              通知取件
                              <br />
                              记录
                            </b>
                          </td>
                          <td>
                            <pre>电话通知日：</pre>
                          </td>
                          <td colSpan={2}>
                            <pre>预计取件日：</pre>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={4}
                            bgcolor="#6A4313"
                            style={{ textAlign: 'center' }}
                          >
                            <font color="#FFFFFF">
                              <b>以下由利用者取件时填写</b>
                            </font>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <b>
                              利用者
                              <br />
                              自取
                              <br />
                              签收
                            </b>
                          </td>
                          <td colSpan={3}>
                            <pre>
                              <b>签收人： 日期： </b>
                            </pre>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <b>
                              利用者
                              <br />
                              意见及
                              <br />
                              建议
                            </b>
                          </td>
                          <td colSpan={3}>
                            <pre>
                              <b>服务评价：</b>
                              {ratepj === 0 && <span>☆☆☆☆☆</span>}
                              {ratepj === 1 && <span>★☆☆☆☆</span>}
                              {ratepj === 2 && <span>★★☆☆☆</span>}
                              {ratepj === 3 && <span>★★★☆☆</span>}
                              {ratepj === 4 && <span>★★★★☆</span>}
                              {ratepj === 5 && <span>★★★★★</span>}
                              <br />
                              请利用者提出宝贵的意见和建议：
                            </pre>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </Col>
                <Col span={24} style={{ padding: '10px' }}>
                  <Button
                    type="primary"
                    onClick={doBjjgPrint}
                    style={{ float: 'right' }}
                  >
                    打印
                  </Button>
                </Col>
              </Row>
            </Card>
          </Card>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={prev}>
              {' '}
              上一步{' '}
            </Button>
            <Button type="primary" onClick={doCompData}>
              {' '}
              完成{' '}
            </Button>
          </Button.Group>
        </div>
      </Form>
    );
  };
  const doBjjgPrint = () => {
    const bjjgPrintDiv = document.getElementById('bjjgPrint');
    const iframe = document.createElement('IFRAME');
    let doc = null;
    iframe.setAttribute(
      'style',
      'position:absolute;width:0px;height:0px;left:500px;top:500px;',
    );
    document.body.appendChild(iframe);

    doc = iframe.contentWindow.document;
    // 打印时去掉页眉页脚
    doc.write(
      '<style media="print">@page {size: auto;  margin: 0mm; }</style>',
    );

    doc.write(bjjgPrintDiv.innerHTML);
    doc.close();
    // 获取iframe的焦点，从iframe开始打印
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    if (navigator.userAgent.indexOf('MSIE') > 0) {
      //打印完删除iframe
      document.body.removeChild(iframe);
    }
  };
  const doPdfPrint = () => {
    const pdfPrintDiv = document.getElementById('pdfPrint');
    const iframe = document.createElement('IFRAME');
    let doc = null;
    iframe.setAttribute(
      'style',
      'position:absolute;width:0px;height:0px;left:500px;top:500px;',
    );
    document.body.appendChild(iframe);

    doc = iframe.contentWindow.document;
    // 打印时去掉页眉页脚
    doc.write(
      '<style media="print">@page {size: auto;  margin: 0mm; }</style>',
    );

    doc.write(pdfPrintDiv.innerHTML);
    doc.close();
    // 获取iframe的焦点，从iframe开始打印
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    if (navigator.userAgent.indexOf('MSIE') > 0) {
      //打印完删除iframe
      document.body.removeChild(iframe);
    }
  };
  return (
    <>
      <Tooltip title="待出证">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<AuditOutlined />}
          onClick={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            event.stopPropagation();
            click();
          }}
        />
      </Tooltip>
      <Modal
        title={<span className="m-title">受理档案馆待出证业务步骤</span>}
        visible={visible}
        onCancel={(event) => {
          event.nativeEvent.stopImmediatePropagation();
          event.stopPropagation();
          handleDczywCancel();
        }}
        footer={null}
        style={{
          paddingLeft: '24px 0',
          paddingRight: '24px 0',
          paddingTop: '24px 0',
        }}
        width="80%"
      >
        <div className="hall-regist">
          <div className="editform">
            <Steps current={step}>
              <Step title="填写申请信息" key={0} />
              <Step title="填写查档线索" key={1} />
              <Step title="填写档案送交方式" key={2} />
              <Step title="申请信息确认" key={3} />
              <Step title="出证处理" key={4} />
              <Step title="办理结果" key={5} />
              <Step title="完成" key={6} />
            </Steps>
            <div className="editContext">
              <Card style={{ width: '100%', height: '100%' }}>
                {step === 0 && renderCdsqxx()}
                {step === 1 && renderCdxs()}
                {step === 2 && renderCddasjfs()}
                {step === 3 && renderCdsqxxqr()}
                {step === 4 && renderCdczcl()}
                {step === 5 && renderCdbjjg()}
              </Card>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default dczyw;
