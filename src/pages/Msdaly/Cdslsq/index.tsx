import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Steps,
  Card,
  Button,
  Divider,
  Checkbox,
  DatePicker,
  Alert,
  Rate,
  message,
  TreeSelect,
} from 'antd';
import { IdcardOutlined, LoadingOutlined } from '@ant-design/icons';
import SysStore from '../../../stores/system/SysStore';
import axios from 'axios';
import fetch from '../../../utils/fetch';
import moment from 'moment';
import './index.less';
import { runInAction } from '_mobx@6.3.5@mobx';

const { RangePicker } = DatePicker;
const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;
/**
 * 民生档案利用---受理申请
 */
const Cdslsq = observer((props) => {
  const [sqxxform] = Form.useForm();
  const [cdxsform] = Form.useForm();
  const [dasjfsform] = Form.useForm();
  const [sqxxqrform] = Form.useForm();
  const [czclform] = Form.useForm();
  const [bljgform] = Form.useForm();
  const [step, setStep] = useState(0);
  const [currentstep, setCurrentstep] = useState(0);
  const [insl, setInsl] = useState(true);
  const [sfslly, setSfslly] = useState(false);
  const [sfsl, setSfsl] = useState(true);
  const [czfs, setCzfs] = useState(false);
  const [czfsrequired, setCzfsrequired] = useState(false);
  const [bslyy, setBslyy] = useState(false);
  const [jdsj, setJdsj] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const ref = useRef();
  const location: locationType = props.location;
  const cdslsqParams = location.query;

  useEffect(() => {
    debugger;
    console.log(cdslsqParams);
    CdslsqStore.getCurrentOS();
    CdslsqStore.getdaLx();
    CdslsqStore.getMscdfw();
    CdslsqStore.queryTreeDwList();
    // sqxxform.setFieldsValue({ "cdfw": "01" })
    CdslsqStore.getSjzdData('借阅目的');
  }, []);
  /**
   * childStore
   */
  const CdslsqStore = useLocalObservable(() => ({
    pic_z: '',
    pic_f: '',
    editRecord: {},
    loadingCard: false,
    dalxData: [],
    mscdfwData: [],
    sslchecked: false,
    fslchecked: false,
    yjczfschecked: false,
    smlqczfschecked: false,
    emsyjfschecked: false,
    ghyjfschecked: false,
    pdfsrc: '',
    cdata: {},
    dwTreeData: [],
    system: '',
    // 利用目的数据
    lymdSelectData: [],
    async onRecordChange(value) {
      this.editRecord = value;
    },
    // 调用扫描仪读取二代身份证方法
    async readCard() {
      this.loadingCard = true;
      if (this.system == 'Windows') {
        this.readWindowsCard(sqxxform);
      } else {
        this.readLinuxCard(sqxxform);
      }
      this.loadingCard = false;
    },
    async saveData(values) {
      debugger;
      const { ...v } = this.cdata;
      this.cdata = { ...v, ...values };
      if (!this.cdata.hasOwnProperty('status')) {
        this.cdata['status'] = 0;
      }
      console.log(this.cdata);
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
            title: o.mc,
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
      debugger;
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
    //Linux环境读取身份证
    async readLinuxCard(form) {
      const res = await axios
        .post('http://127.0.0.1:6543/getIDCardInfo', '', {
          timeout: 30000,
        })
        .catch((err) => {
          message.error('身份证读取失败！原因是：' + err);
        });
      if (res && res.status === 200 && res.data) {
        if (res.data.returnCode == 0) {
          const cardinfo = res.data.data;
          const values = {
            lyzxm: cardinfo.name,
            zjhm: cardinfo.cardnumber,
            zjlx: '01',
          };
          this.cdata = { ...values };
          form.setFieldsValue(values);
        } else {
          message.warn('身份证读取失败，请重新放置后，再试一次！');
        }
      }
      const openres = await axios.post(
        'http://127.0.0.1:6543/StartPreview?dev_idx=0&res_id=0&pixfmt=pixfmt',
        '',
        {
          timeout: 30000,
        },
      );
      if (
        openres &&
        openres.status == 200 &&
        openres.data &&
        openres.data.returnCode == 0
      ) {
        alert('请放置身份证，且正面朝上！放置完成后点击关闭。');
        const response = await this.readPhotoCard(1);
        if (response.status == 200 && response.data.returnCode == 0) {
          alert('请放置身份证，反面面朝上！放置完成后点击关闭。');
          const response1 = await this.readPhotoCard(2);
          if (response1.status == 200 && response1.data.returnCode == 0) {
            this.pic_z = `data:image/jpg;base64,${response1.data.data.img}`;
          }
        }
      } else {
        message.warn('高拍仪摄像头打开失败，请重新放置后，再试一次！');
      }
    },
    async readPhotoCard(step) {
      return axios.post(
        `http://127.0.0.1:6543/composeIDcardPic?step=${step}`,
        '',
        {
          timeout: 30000,
        },
      );
    },
    async getCurrentOS() {
      if (navigator.userAgent.indexOf('Window') > 0) {
        this.system = 'Windows';
      } else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
        this.system = 'Mac';
      } else if (navigator.userAgent.indexOf('Linux') > 0) {
        this.system = 'Linux';
        this.InitScanLinux();
      } else {
        this.system = 'NUll';
      }
    },
    //windows环境读取身份证
    async readWindowsCard(form) {
      const res = await axios
        .post('http://127.0.0.1:38088/card=idcard', '', {
          timeout: 30000,
        })
        .catch((err) => {
          message.error('身份证读取错误！，请再试一次！');
        });
      if (res && res.status === 200 && res.data) {
        if (res.data.code === 0) {
          const cardinfo = res.data.IDCardInfo;
          const values = {
            lyzxm: cardinfo.name,
            zjhm: cardinfo.cardID,
            zjlx: '01',
            pic_z: `data:image/gif;base64,${cardinfo.photoBase64_Z}`,
            pic_f: `data:image/gif;base64,${cardinfo.photoBase64_F}`,
          };
          this.cdata = { ...values };
          form.setFieldsValue(values);
          this.pic_z = `data:image/gif;base64,${cardinfo.photoBase64_Z}`;
          this.pic_f = `data:image/gif;base64,${cardinfo.photoBase64_F}`;
          this.loadingCard = false;
        }
      }
    },
    async InitScanLinux() {
      await axios.get('http://localhost:6543/GetDeviceCount');
    },
    async getSjzdData(zdmc) {
      const fd = new FormData();
      fd.append('zdx', zdmc);
      const res = await fetch.post(
        `/api/eps/control/main/dalydj/querySjzd`,
        fd,
      );
      if (res && res.data && res.data.success) {
        debugger;
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
            title: o.mc,
          }));
        }
      } else {
        return;
      }
    },
  }));
  // 初始化受理申请业务流程
  const resetSqd = () => {
    setStep(0);
    setCurrentstep(0);
    setCzfsrequired(false);
    setBslyy(false);
    setCzfs(false);
    setJdsj(moment().format('YYYY-MM-DD HH:mm:ss'));
    // 所有节点from表单初始化
    sqxxform.resetFields();
    cdxsform.resetFields();
    dasjfsform.resetFields();
    sqxxqrform.resetFields();
    bljgform.resetFields();
    //设置默认值
    // sqxxform.setFieldsValue({ "cdfw": "01" })
    //填写档案送交方式所有check框默认不选中
    CdslsqStore.sslchecked = false;
    CdslsqStore.fslchecked = false;
    CdslsqStore.yjczfschecked = false;
    CdslsqStore.smlqczfschecked = false;
    CdslsqStore.emsyjfschecked = false;
    CdslsqStore.ghyjfschecked = false;
    CdslsqStore.cdata = {};
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
  const doPrint3 = () => {
    // window.location.href = "larp://open?id=" + this.cdata.id + "&type=print";
  };

  const next = () => {
    switch (step) {
      case 0:
        sqxxform
          .validateFields()
          .then((values) => {
            const entity = {};
            const { entries } = Object;
            entries(values).forEach(([key, value]) => {
              if (value) {
                entity[key] = value;
              }
            });
            CdslsqStore.saveData(entity);
          })
          .catch((errorInfo) => {
            debugger;
            console.log(errorInfo);
          });
        CdslsqStore.sslchecked = true;
        CdslsqStore.fslchecked = false;
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

        const sqxx = sqxxform.getFieldsValue();
        debugger;
        if (
          sqxx.zjlx.indexOf('01') !== -1 &&
          sqxx.dalxmc.indexOf('婚姻') !== -1
        ) {
          if (sqxx.zjhm.substring(16, 17) % 2) {
            cdxsform.setFieldsValue({
              mfxm: sqxx.lyzxm,
              mfcsrq: sqxx.zjhm.substring(6, 12),
            });
          } else {
            cdxsform.setFieldsValue({
              wfxm: sqxx.lyzxm,
              wfcsrq: sqxx.zjhm.substring(6, 12),
            });
          }
        }
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
          CdslsqStore.saveData(entity);
        });
        console.log(SysStore.getCurrentUser());
        CdslsqStore.yjczfschecked = false;
        CdslsqStore.smlqczfschecked = false;
        CdslsqStore.emsyjfschecked = false;
        CdslsqStore.ghyjfschecked = false;
        setCzfsrequired(false);
        debugger;
        dasjfsform.setFieldsValue({
          sldagmc: SysStore.getCurrentCmp().mc,
          sldagid: SysStore.getCurrentCmp().id,
          sldagtel: SysStore.getCurrentUser().sjh,
          jdr: SysStore.getCurrentUser().yhmc,
          sjr: CdslsqStore.cdata.lyzxm,
          sfsl: 'Y',
          jdsj: jdsj,
          czfs: null,
          yjfs: null,
          yzbm: null,
          yjdz: null,
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
          CdslsqStore.saveData(entity);
        });
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
    }
  };
  const prev = () => {
    if (CdslsqStore.cdata.sfsl === 'N' && step === 4) {
      setStep(step - 3);
      setCurrentstep(step - 3);
    } else {
      setStep(step - 1);
    }
  };
  const onFinish = (values: any) => {
    console.log(step);
    console.log(CdslsqStore.cdata);
    debugger;
    if (CdslsqStore.cdata.sfsl === 'N' && step === 1) {
      setStep(step + 3);
    } else {
      setStep(step + 1);
    }
    setCurrentstep(step + 1);
  };

  const handleDalxChange = (value, option) => {
    sqxxform.setFieldsValue({ dalxmc: option.children });
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
          <Col span={6}>
            {CdslsqStore.system == 'Windows' ? (
              <div>
                <div className="card">
                  {!CdslsqStore.pic_z && (
                    <div className="card-inner">
                      <i className="iconfont iconsaomiaoyi card-fonticon" />
                      <div className="card-inner-text">扫描身份证 头像面</div>
                    </div>
                  )}
                  {CdslsqStore.pic_z && (
                    <div className="card-inner">
                      <img src={CdslsqStore.pic_z} alt="" />
                    </div>
                  )}
                </div>
                <div className="card">
                  {!CdslsqStore.pic_f && (
                    <div className="card-inner">
                      <i className="iconfont iconsaomiaoyi card-fonticon" />
                      <div className="card-inner-text">扫描身份证 国徽面</div>
                    </div>
                  )}
                  {CdslsqStore.pic_f && (
                    <div className="card-inner">
                      <img src={CdslsqStore.pic_f} alt="" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginRight: 10, marginTop: 10 }}>
                <img
                  style={{ height: 300, width: 230 }}
                  src={CdslsqStore.pic_z}
                  alt=""
                />
              </div>
            )}
          </Col>
          <Col span={18}>
            <Row>
              <Col span={9}>
                <FormItem
                  label="利用者姓名："
                  name="lyzxm"
                  required
                  rules={[{ required: true, message: '请输入利用者姓名' }]}
                >
                  <Input
                    allowClear
                    placeholder="查档人"
                    style={{ width: 290 }}
                    addonAfter={
                      <Button
                        loading={CdslsqStore.loadingCard}
                        type="primary"
                        onClick={() => {
                          CdslsqStore.readCard();
                        }}
                      >
                        读取证件
                      </Button>
                    }
                  />
                </FormItem>
              </Col>
              <Col span={9}>
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
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={9}>
                <FormItem
                  required
                  label=" 证 件 类 型："
                  name="zjlx"
                  rules={[{ required: true, message: '请选择证件类型' }]}
                >
                  <Select style={{ width: 300 }} placeholder="证件类型">
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
              <Col span={9}>
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
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={9}>
                <FormItem
                  required
                  label=" 利 用 目 的 ："
                  name="lymd"
                  rules={[{ required: true, message: '请选择利用目的' }]}
                >
                  <Select style={{ width: 300 }} placeholder="利用目的">
                    {CdslsqStore.lymdSelectData.map((o) => (
                      <Select.Option value={o.bh} key={o.id}>
                        {o.mc}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem
                  required
                  label="档案种类："
                  name="dalx"
                  rules={[{ required: true, message: '请选择档案种类' }]}
                >
                  <Select
                    style={{ width: 300 }}
                    placeholder="档案种类"
                    onChange={handleDalxChange}
                  >
                    {CdslsqStore.dalxData.map((item) => (
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
              <Col span={9}>
                <FormItem
                  label=" 查 档 范 围 ："
                  name="cdfw"
                  rules={[{ required: true, message: '请选择查档范围' }]}
                >
                  <Select style={{ width: 300 }} placeholder="查档范围">
                    {CdslsqStore.mscdfwData.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
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
      CdslsqStore.sslchecked = true;
      CdslsqStore.fslchecked = false;
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
      CdslsqStore.sslchecked = false;
      CdslsqStore.fslchecked = true;
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
      CdslsqStore.fslchecked = true;
      CdslsqStore.sslchecked = false;
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
      CdslsqStore.fslchecked = false;
      CdslsqStore.sslchecked = true;
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
          <Card title="查询档案" style={{ width: '100%' }}>
            <Row>
              <Col span={24}>
                <Card style={{ width: '100%' }}>
                  <Row>
                    <Col span={9}>
                      <FormItem name="sfsl" style={{ paddingTop: '20px' }}>
                        <Checkbox
                          checked={CdslsqStore.sslchecked}
                          onChange={onNewSslChange}
                        >
                          予以受理
                        </Checkbox>
                      </FormItem>
                    </Col>
                    <Col span={9}>
                      <FormItem name="sfsl" style={{ paddingTop: '20px' }}>
                        <Checkbox
                          checked={CdslsqStore.fslchecked}
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
                          rules={[
                            { required: bslyy, message: '请输入不予理由' },
                          ]}
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
              <Col span={24}>
                {CdslsqStore.cdata.dalxmc === '婚姻档案' && (
                  <Card title="婚姻档案" style={{ width: '100%' }}>
                    <Row>
                      <Col span={9}>
                        <FormItem
                          label="男方姓名："
                          name="mfxm"
                          required={sfsl}
                          rules={[
                            { required: sfsl, message: '请输入男方姓名' },
                          ]}
                        >
                          <Input
                            allowClear
                            placeholder="男方姓名"
                            style={{ width: 300 }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={9}>
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
                          />
                        </FormItem>
                      </Col>
                      <Col span={2}>
                        <span style={{ color: '#978cc4' }}>例：199012</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={9}>
                        <FormItem
                          required={sfsl}
                          label="女方姓名："
                          name="wfxm"
                          rules={[
                            { required: sfsl, message: '请输入男方姓名' },
                          ]}
                        >
                          <Input
                            allowClear
                            placeholder="女方姓名"
                            style={{ width: 300 }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={9}>
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
                          />
                        </FormItem>
                      </Col>
                      <Col span={2}>
                        <span style={{ color: '#978cc4' }}>例：199012</span>
                      </Col>
                    </Row>
                  </Card>
                )}
              </Col>
            </Row>
            {sfsl && (
              <>
                <Row style={{ paddingTop: '10px' }}>
                  <Col span={24}>
                    <FormItem label="其他查档线索:" name="cdxs">
                      <Input.TextArea
                        allowClear
                        showCount
                        maxLength={500}
                        style={{ height: '20px', width: '100%' }}
                      />
                    </FormItem>
                  </Col>
                </Row>
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
                        treeData={CdslsqStore.dwTreeData}
                        placeholder="请选择查询档案馆"
                        treeDefaultExpandAll
                        allowClear
                        onChange={onDwChange}
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
              </>
            )}
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
      CdslsqStore.yjczfschecked = true;
      CdslsqStore.smlqczfschecked = false;
      dasjfsform.setFieldsValue({ czfs: '01', sjr: CdslsqStore.cdata.lyzxm });
    } else {
      setCzfs(true);
      setCzfsrequired(false);
      CdslsqStore.yjczfschecked = false;
      CdslsqStore.smlqczfschecked = true;
      CdslsqStore.emsyjfschecked = false;
      CdslsqStore.ghyjfschecked = false;
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
      CdslsqStore.emsyjfschecked = true;
      CdslsqStore.ghyjfschecked = false;
      dasjfsform.setFieldsValue({ yjfs: '01' });
    } else {
      CdslsqStore.emsyjfschecked = false;
      CdslsqStore.ghyjfschecked = true;
      dasjfsform.setFieldsValue({ yjfs: '02' });
    }
  };
  const onGhyjfsChange = (e) => {
    if (e.target.checked) {
      CdslsqStore.emsyjfschecked = false;
      CdslsqStore.ghyjfschecked = true;
      dasjfsform.setFieldsValue({ yjfs: '02' });
    } else {
      CdslsqStore.emsyjfschecked = true;
      CdslsqStore.ghyjfschecked = false;
      dasjfsform.setFieldsValue({ yjfs: '01' });
    }
  };
  const onSmlqczfsChange = (e) => {
    if (e.target.checked) {
      setCzfs(true);
      setCzfsrequired(false);
      CdslsqStore.yjczfschecked = false;
      CdslsqStore.smlqczfschecked = true;
      CdslsqStore.emsyjfschecked = false;
      CdslsqStore.ghyjfschecked = false;
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
      CdslsqStore.yjczfschecked = true;
      CdslsqStore.smlqczfschecked = false;
      dasjfsform.setFieldsValue({ czfs: '01', sjr: CdslsqStore.cdata.lyzxm });
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
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="传真：" name="sldagtax">
                    <Input
                      allowClear
                      placeholder="传真"
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
                      checked={CdslsqStore.yjczfschecked}
                      onChange={onYjczfsChange}
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
                        checked={CdslsqStore.emsyjfschecked}
                        onChange={onEmsyjfsChange}
                        disabled={czfs}
                      >
                        EMS(到付自费)
                      </Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem name="yjfs" style={{ paddingTop: '20px' }}>
                      <Checkbox
                        checked={CdslsqStore.ghyjfschecked}
                        onChange={onGhyjfsChange}
                        disabled={czfs}
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
                      required={czfsrequired}
                      label="邮政编码："
                      name="yzbm"
                      rules={[
                        { required: czfsrequired, message: '请输入邮政编码' },
                      ]}
                    >
                      <Input
                        allowClear
                        style={{ width: 300 }}
                        placeholder="邮政编码"
                        disabled={czfs}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      required={czfsrequired}
                      label="邮寄地址："
                      name="yjdz"
                      rules={[
                        { required: czfsrequired, message: '请输入邮寄地址' },
                      ]}
                    >
                      <Input
                        allowClear
                        placeholder="邮寄地址"
                        disabled={czfs}
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
                      checked={CdslsqStore.smlqczfschecked}
                      onChange={onSmlqczfsChange}
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
  const doSaveData = () => {
    let oldstatus = CdslsqStore.cdata.status;
    CdslsqStore.cdata['cdkssj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    CdslsqStore.cdata['whrid'] = SysStore.getCurrentUser().id;
    CdslsqStore.cdata['whr'] = SysStore.getCurrentUser().yhmc;
    CdslsqStore.cdata['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    if (CdslsqStore.cdata.sfsl === 'Y') {
      CdslsqStore.cdata['comple'] = 0;
      CdslsqStore.cdata.status = step;
    } else {
      debugger;
      if (!CdslsqStore.cdata.hasOwnProperty('pj')) {
        message.warning('请先进行用户评价！');
        return;
      }
      CdslsqStore.cdata.status = step + 1;
      CdslsqStore.cdata['comple'] = 2; //未受理也结束掉
    }
    debugger;
    if (oldstatus === 0) {
      fetch
        .post('/api/eps/e9msdaly/lasqd/', CdslsqStore.cdata)
        .then((response) => {
          if (response.status == 201) {
            CdslsqStore.cdata = response.data.id;
            if (CdslsqStore.cdata.sfsl == 'Y') {
              message.info('成功提交受理单');
            } else {
              setStep(step + 1);
              message.info('本次申请未受理，已结束成功!');
            }
            //初始化界面
            resetSqd();
          } else {
            CdslsqStore.cdata.status = 0;
            CdslsqStore.cdata['comple'] = 0;
            message.error(response.statusText);
          }
        })
        .catch((err) => {
          CdslsqStore.cdata.status = 0;
          CdslsqStore.cdata['comple'] = 0;
          message.error('网络出现异常，请刷新后重试');
        });
    } else {
      fetch
        .put(
          '/api/eps/e9msdaly/lasqd/' + CdslsqStore.cdata.id,
          CdslsqStore.cdata,
        )
        .then((response) => {
          if (response.status == 201) {
            CdslsqStore.cdata = response.data;
            if (CdslsqStore.cdata.sfsl == 'Y') {
              message.info('成功提交受理单');
            } else {
              setStep(step + 1);
              message.info('本次申请未受理，已结束成功!');
            }
            resetSqd();
          } else {
            CdslsqStore.cdata.status = oldstatus;
            CdslsqStore.cdata['comple'] = 0;
            message.error(response.statusText);
          }
        })
        .catch((err) => {
          CdslsqStore.cdata.status = 0;
          CdslsqStore.cdata['comple'] = 0;
          message.error('网络出现异常，请刷新后重试');
        });
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
                      {moment(jdsj).format('YYYY')}年{moment(jdsj).format('MM')}
                      月{moment(jdsj).format('DD')}日 ● 编号:
                      {CdslsqStore.cdata.id}
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
                          {CdslsqStore.cdata.lyzxm}
                        </td>
                        <td style={{ width: '20%', textAlign: 'center' }}>
                          <b>联系电话</b>
                        </td>
                        <td style={{ width: '30%' }}>
                          {CdslsqStore.cdata.lyzdh}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>证件类型</b>
                        </td>
                        <td>
                          <pre>
                            {CdslsqStore.cdata.zjlx === '01' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            居民身份证
                            <br />
                            {CdslsqStore.cdata.zjlx === '02' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            军官证
                            <br />
                            {CdslsqStore.cdata.zjlx === '99' ? (
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
                        <td>{CdslsqStore.cdata.zjhm}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>利用目的</b>
                        </td>
                        <td>
                          {CdslsqStore.lymdSelectData.map((o) => {
                            debugger;
                            if (CdslsqStore.cdata.lymd === o.bh) {
                              return o.mc;
                            }
                          })}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <b>档案种类</b>
                        </td>
                        <td>{CdslsqStore.cdata.dalxmc}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}>
                          <b>查档线索</b>
                        </td>
                        <td colSpan={3}>
                          <pre>
                            档案记载的 {CdslsqStore.cdata.cdgmc}{' '}
                            保管档案的档案馆
                            <br />
                            当事人姓名： {CdslsqStore.cdata.lyzxm}{' '}
                            (查档档案馆)名称：{CdslsqStore.cdata.cdgmc}
                            <br />
                            其他查档内容:
                            <br />
                            &emsp;&emsp;&emsp;&emsp;{CdslsqStore.cdata.cdxs}
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td rowSpan={2} style={{ textAlign: 'center' }}>
                          <b>档案送交方式</b>
                        </td>
                        <td colSpan={3}>
                          <pre>
                            {CdslsqStore.cdata.czfs === '01' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}{' '}
                            邮寄：{' '}
                            {CdslsqStore.cdata.yjfs === '01' ? (
                              <span>●</span>
                            ) : (
                              <span>○</span>
                            )}{' '}
                            EMS(到付自费){' '}
                            {CdslsqStore.cdata.yjfs === '02' ? (
                              <span>●</span>
                            ) : (
                              <span>○</span>
                            )}
                            挂号(免邮费)
                            <br />
                            &emsp;告知：
                            1、为便于利用者及时收到所需档案材料，利用者应当如实提供确切的地址。
                            <br />
                            &emsp;&emsp;&emsp;&emsp;&emsp;2、如果送达地址有变更，利用者应当及时书面告知受理点。若因提供的地址不确
                            <br />
                            &emsp;&emsp;&emsp;&emsp;&emsp;切，或不及时告知变更后的地址，使档案无法及时送达，利用者自行承担后果。
                            <br />
                            <br />
                            &emsp;收 件 人：{CdslsqStore.cdata.sjr} 邮政编码：
                            {CdslsqStore.cdata.yzbm}
                            <br />
                            <br />
                            &emsp;邮寄地址：{CdslsqStore.cdata.yjdz}
                          </pre>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <pre>
                            {CdslsqStore.cdata.czfs === '02' ? (
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
                            {CdslsqStore.cdata.sfsl === 'Y' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}
                            予以受理
                            <br />
                            {CdslsqStore.cdata.sfsl !== 'Y' ? (
                              <span>√</span>
                            ) : (
                              <span>□</span>
                            )}
                            不予受理，理由：
                            <br />
                            {CdslsqStore.cdata.bslyy}
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
                            {CdslsqStore.cdata.sldagmc}，工作人员
                            {CdslsqStore.cdata.jdr}
                            <br />
                            电话号码：({CdslsqStore.cdata.sldagtel})，传真号：(
                            {CdslsqStore.cdata.sldagtax})
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
            {step === 3 && CdslsqStore.cdata.sfsl === 'N' && (
              <FormItem>
                <Button type="primary" htmlType="submit" onClick={next}>
                  下一步
                </Button>
              </FormItem>
            )}
            {step === 3 && CdslsqStore.cdata.sfsl === 'Y' && (
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
  const onPjChange = (value) => {
    debugger;
    bljgform.setFieldsValue({ pj: value });
    CdslsqStore.cdata['pj'] = value;
  };
  const renderCdbjjg = () => {
    return (
      <Form labelAlign="left" form={bljgform} style={{ padding: '20px' }}>
        <Row>
          <Card title="用户评价" style={{ width: '100%' }}>
            <FormItem name="pj">
              <Rate onChange={onPjChange} />
            </FormItem>
          </Card>
        </Row>
        <div className="effooter">
          <Button.Group>
            <Button type="primary" onClick={prev}>
              {' '}
              上一步{' '}
            </Button>
            {CdslsqStore.cdata.sfsl !== 'Y' && step === 4 && (
              <FormItem>
                <Button type="primary" htmlType="submit" onClick={doSaveData}>
                  {' '}
                  办结{' '}
                </Button>
              </FormItem>
            )}
          </Button.Group>
        </div>
      </Form>
    );
  };
  return (
    <>
      <div className="hall-regist">
        <div className="editform">
          <Steps current={currentstep}>
            <Step title="填写申请信息" key={0} />
            <Step title="填写查档线索" key={1} />
            {sfsl && (
              <>
                <Step title="填写档案送交方式" key={2} />
                <Step title="申请信息确认" key={3} />
                <Step title="出证处理" key={4} />
              </>
            )}
            <Step title="办理结果" key={5} />
            <Step title="完成" key={6} />
          </Steps>
          <div className="editContext">
            <Card style={{ width: '100%', height: '100%' }}>
              {step === 0 && renderCdsqxx()}
              {step === 1 && renderCdxs()}
              {step === 2 && renderCddasjfs()}
              {step === 3 && renderCdsqxxqr()}
              {step === 4 && renderCdbjjg()}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
});

export default Cdslsq;
