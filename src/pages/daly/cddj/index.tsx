import React, { useEffect, useState, Fragment, useRef } from 'react';
import { observer } from 'mobx-react';
import { useIntl } from 'umi';
import Fulltext from './FullSearch9';
import CddjService from './CddjService';
import SimpleArch from '@/pages/dagl/Dagl/AppraisalMain/SimapleArch';
import {
  Input as IceInput,
  NumberPicker,
  Button as IceButton,
  Table,
  Pagination,
  Icon as IceIcon,
  Field,
  Radio,
  Form,
  Grid,
  Select as IceSelect,
  TreeSelect,
  Tab,
  Card,
  Dialog,
  Loading,
  Upload,
  Nav,
  Checkbox as IceCheckBox,
} from '@alifd/next';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LydjStore from '@/stores/dadt/LydjStore';
import SvgIcon from '@/components/SvgIcon';
import DapubStore from '@/stores/dagl/DapubStore';
import E9Config from '@/utils/e9config';
import util from '@/utils/util';
import FileView from './fileView';
import './index.less';
import moment from "moment";
import {
  Input,
  message,
  Rate,
  Tooltip,
  Modal,
  Space,
  Tag,
  Divider,
  Typography,
  Button,
  Checkbox,
  Spin,
  DatePicker,
  Tabs,
  Steps,
} from 'antd';
const { Step } = Steps;
import Icon, {
  QuestionCircleTwoTone,
  DoubleRightOutlined,
  FilterOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import DrawerAction from '@/pages/dagl/Dagl/AppraisaManage/DrawerAction';
import { runFunc } from '@/utils/menuUtils';

import tabLayoutStore from '@/layouts/BaseLayoutStore';

const { Row, Col } = Grid;
const MutiEdit = (props) => {
  const { value, onChange } = props;
  const [count, setCount] = useState(0);
  const [vs, setVs] = useState([]);
  var opt = 'add';
  useEffect(() => {
    const aVs = (value || '').toString().split(',');
    setCount(aVs.length);
    setVs(aVs);
  }, [value]);

  const changeValue = (v, index) => {
    const aVs = Array.from(vs);
    aVs[index] = v;
    setCount(aVs.length);
    setVs(aVs);
    onChange(aVs.join(','));
  };

  const addInput = () => {
    const aVs = Array.from(vs);
    aVs.push('');
    setCount(aVs.length);
    setVs(aVs);
    onChange(aVs.join(','));
  };

  const delInput = (index) => {
    const aVs = Array.from(vs);
    aVs.splice(index, 1);
    setCount(aVs.length);
    setVs(aVs);
    onChange(aVs.join(','));
  };

  return (
    <>
      {util.num2arr(count).map((i) => (
        <Row>
          <Col style={{ marginTop: 2 }}>
            <IceInput
              key={`input-${i}`}
              value={vs[i]}
              onChange={(v) => changeValue(v, i)}
            />
            {i === count - 1 && (
              <Tooltip title="添加关键字">
                <Button
                  size="small"
                  style={{
                    fontSize: '12px',
                    width: 20,
                    height: 20,
                    maxWidth: 20,
                    minWidth: 20,
                    marginLeft: 5,
                  }}
                  shape="circle"
                  onClick={() => {
                    addInput(i);
                  }}
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            )}
            {count !== 1 && count !== 0 && (
              <Tooltip title="删除当前关键字">
                <Button
                  size="small"
                  danger={true}
                  style={{
                    fontSize: '12px',
                    width: 20,
                    height: 20,
                    maxWidth: 20,
                    minWidth: 20,
                    marginLeft: 5,
                  }}
                  shape="circle"
                  onClick={() => {
                    delInput(i);
                  }}
                  icon={<MinusOutlined />}
                />
              </Tooltip>
            )}
          </Col>
        </Row>
      ))}
    </>
  );
};

const LydjEdit = observer(() => {
  const opt = 'add';
  const umid = 'DADT0002';
  const { formatMessage } = useIntl();
  const { Item: FormItem } = Form;

  const { CheckableTag } = Tag;
  const [step, setStep] = useState(0);
  const [tabIndex, setTabIndex] = useState(-1);
  const [curImg, setCurImg] = useState({});
  const [imgDlgVisible, setImgDlgVisible] = useState(false);
  const [picDlgVisible, setPicDlgVisible] = useState(false);
  const [picDlgVisibleLinux, setPicDlgVisibleLinux] = useState(false);
  const [field, setField] = useState(null);
  const [fieldLyxx, setFieldLyxx] = useState(null);
  const [fieldRate, setFieldRate] = useState(null);
  const [validDw, setValidDw] = useState(false);
  const [maxBodyHeight, setMaxBodyHeight] = useState('500px');
  const [validZjh, setValidZjh] = useState(true);

  const [timer, setTimer] = useState('');
  const [steamvideoimg, setSteamvideoimg] = useState('');

  const ref = useRef(null);
  const formItemLayout = {
    labelCol: {
      fixedSpan: 5,
    },
    wrapperCol: {
      // span: 16
    },
  };

  const steps = ['查档人登记', '查询档案信息', '利用情况登记', '利用评价'];
  const fieldDak = Field.useField();
  useEffect(() => {
    if (opt === 'add') {
      clearData();
    }
    OptrightStore.getFuncRight(umid);
    LydjStore.getSjzdData('证件名称');
    LydjStore.getSjzdData('利用方式');
    LydjStore.getSjzdData('借阅目的');
    LydjStore.getSjzdData('单位借阅目的');
    LydjStore.getSjzdData('利用效果');
    // LydjStore.getSjzdData('查档内容');
    LydjStore.getDakTree();
    LydjStore.queryTempUsers();
    LydjStore.getParamValue('DADTS002');
    LydjStore.getParamValue('DADTS003');
    LydjStore.queryLymxData(LydjStore.editRecord.id);

  }, []);
  useEffect(() => {
    LydjStore.getCurrentOS();
    if (ref && ref.current && ref.current.clientHeight) {
      setMaxBodyHeight(`${ref.current.clientHeight - 212}px`);
    }
  }, [ref && ref.current && ref.current.clientHeight]);

  useEffect(() => {
    if (LydjStore.editVisible && LydjStore.editRecord) {
      LydjStore.queryFJList(LydjStore.editRecord);
      const zjid = LydjStore.editRecord.zjmc;
      if (zjid) {
        const sjdata = LydjStore.sjzdData['证件名称'] || [];
        for (let i = 0; i < sjdata.length; i++) {
          if (sjdata[i].bh === zjid) {
            setValidZjh(sjdata[i].mc.includes('身份证'));
            break;
          }
        }
      } else {
        setValidZjh(true);
      }
    }

  }, [LydjStore.editVisible]);

  const clearData = () => {
    LydjStore.clearData();
  };

  const saveDjrxx = (genuser, callback) => {
    field.validate((errors, values) => {
      if (!errors) {
        LydjStore.saveDjrData({ ...values, status: step }, genuser, () => {
          callback && callback(true);
        });
        LydjStore.clearLymxData();
        fieldDak.setValue('key', values.cyrxm);
        if (LydjStore.editRecord && LydjStore.editRecord.lydanr) {
          fieldDak.setValue('dakid', LydjStore.editRecord.lydanr);
        }
      } else {
        callback && callback(false);
      }
    });
  };

  const doGenUser = () => {
    LydjStore.showQxModal(true);
    // saveDjrxx(true, (success) => {
    //   success &&
    //     message.success(
    //       '生成临时用户成功，请查档人到指定机器上使用身份证登录进行查档利用',
    //     );
    // });
  };

  //页面跳转到查档记录
  const showCdjl = () => {
    const params = {
      umid: 'DALY062',
      umname: '查档记录',
      path: '/runRfunc/cdjl',
    };
    runFunc(params);
  };

  const doNext = () => {
    switch (step) {
      case 0:
        if (opt !== 'view') {
          saveDjrxx(false, (success) => {
            success && setStep(step + 1);
            LydjStore.findCount(LydjStore.editRecord.id);
          });
        }
        if (LydjStore.editRecord && LydjStore.editRecord.id) {
          opt === 'view' && setStep(step + 1);
          LydjStore.queryLymxData(LydjStore.editRecord.id);
        }
        break;
      case 1:
        setStep(step + 1);
        break;
      case 2:
        if (opt !== 'view') {
          fieldLyxx.validate((errors, values) => {
            if (!errors) {
              setStep(step + 1);
              LydjStore.saveDjData({ ...values, status: step }, false);
            }
          });
        } else {
          setStep(step + 1);
        }
        break;
      case 3:
        if (opt !== 'view') {
          fieldRate.validate((errors, values) => {
            if (!errors) {
              LydjStore.saveLastDjData({ ...values, status: 'C' });
            }
          });
        } else {
          LydjStore.closeEditForm();
        }

        break;
    }
  };

  const doPrev = () => {
    console.log('step,step', step);
    if (step > 0) {
      if (step === 2) {
        //从第三步退回第二步
        if (LydjStore.editRecord) {
          fieldDak.setValue('key', LydjStore.editRecord.cyrxm);
          fieldDak.setValue('dakid', LydjStore.editRecord.lydanr);
        }
      }
      LydjStore.editRecord.yysj = LydjStore.editRecord.yysj ? moment(LydjStore.editRecord.yysj, "YYYY-MM-DD HH:mm:ss") : undefined;
      setStep(step - 1);
    }
  };

  /**
   * 转审批
   */
  const doTranferAppro = () => {
    const record = LydjStore.lymxData.results;
    if (!record || record.length === 0) {
      message.info('至少有一条利用记录，才允许转审批');
      return;
    }
    Modal.confirm({
      icon: <QuestionCircleTwoTone />,
      title: '询问',
      content: (
        <>
          如果进行转审批操作，将不允许进行调卷操作，对于进行了调卷操作的，将会自动取消调卷。
          <br />
          是否继续转审批？
        </>
      ),
      okText: '继续',
      onOk: () => LydjStore.tranferAppro(),
    });
  };

  /**
   * 实体调卷，出入库
   */
  const doDiaoJuan = () => {
    const record = (LydjStore.lymxData.results || []).filter(
      (o) => o.stjy === 'Y',
    );
    if (!record || record.length === 0) {
      message.info('至少有一条记录为实体借阅的，才允许进行调卷');
      return;
    }
    LydjStore.diaoJuan();
  };

  const doStlq = () => {
    LydjStore.stlq();
  };

  const doStgh = () => {
    LydjStore.stgh();
  };

  const doSearchAction = () => {
    fieldDak.validate((errors, values) => {
      if (!errors) {
        const index = tabIndex + 1;
        setTabIndex(index);
        DapubStore.getDaklist(values.dakid, '4', umid).then(() => {
          const { ...params } = values;
          params['bmc'] = DapubStore.ktables[values.dakid].bmc;
          LydjStore.setRecordValue('lydanr', values.dakid);
          LydjStore.queryDakData(index, params);
        });
      }
    });
  };

  const onTableClose = (key) => {
    LydjStore.removeTab(key);
    if (tabIndex >= LydjStore.tpageno.length) {
      setTabIndex(tabIndex - 1);
    }
  };

  const onPaginationChange = (key, current) => {
    LydjStore.setTPageNo(key, current);
  };

  const onPageSizeChange = (key, pageSize) => {
    LydjStore.setTPageSize(key, pageSize);
  };

  const doRotate90 = () => {
    LydjStore.rotate(90);
  };

  const doRotate270 = () => {
    LydjStore.rotate(270);
  };

  const doChangeCarme = () => {
    LydjStore.changeDevIdx();
  };

  const doViewFileAction = (img) => {
    setImgDlgVisible(true);
    setCurImg(img);
  };

  const doDeleteFileAction = (grpid, fileid) => {
    Dialog.confirm({
      title: '提醒',
      content: '确定删除选中文件?',
      onOk: () => {
        LydjStore.deleteFile(grpid, fileid);
      },
    });
  };

  const onFileTableRowChange = (selectedRowKeys, records) => {
    LydjStore.setFileSelectRows(selectedRowKeys, records);
  };

  const showDakFile = (index, record) => {
    if (record.filegrpid && record.fjs && record.fjs > 0) {
      LydjStore.showFiles('D', {
        bmc: LydjStore.tparams[index].bmc,
        dakid: LydjStore.tparams[index].dakid,
        grpid: record.filegrpid,
        id: LydjStore.editRecord.id,
        rec: record,
      });
    }
  };

  const showLymxFile = (record) => {
    if (record.fjs > 0) {
      LydjStore.showFiles('L', { ...record });
    }
  };

  const addTmToLymx = (index, record) => {
    LydjStore.addTmToLymx(index, record);
  };

  const onClickReadCard = () => {
    const system = LydjStore.system;
    if (system == 'Windows') {
      LydjStore.readCard(field);
    } else if (system == 'Linux') {
      LydjStore.readLinuxCard();
      LydjStore.readCard(field);
    }
  };
  //点击扫描材料
  const onPhotoOpen = () => {
    if (LydjStore.system == 'Windows') {
      setPicDlgVisible(true);
    } else {
      startPreview();
      setPicDlgVisibleLinux(true);
    }
  };

  const startPreview = () => {
    LydjStore.startPreview()
      .then((res) => {
        if (res.status == 200 && res.data) {
          if (res.data.returnCode == 0) {
            //启动定时器
            const itimer = setInterval(() => {
              getFrame();
            }, 300); //对于配置差的电脑可降低刷新频率
            setTimer(itimer);
          } else {
            alert(res.data.returnMsg);
          }
        }
      })
      .catch((err) => {
        message.error('启动高拍仪出错，请关闭弹窗后再试一次！');
      });
  };
  const getFrame = () => {
    LydjStore.getFrame()
      .then((res) => {
        if (res.status == 200 && res.data && res.data.returnCode == 0) {
          setSteamvideoimg('data:image/gif;base64,' + res.data.data.img);
        } else {
          if (timer != null) {
            clearInterval(timer);
          }
        }
      })
      .catch((err) => {
        if (timer != null) {
          clearInterval(timer);
        }
      });
  };

  const renderCdrxx = () => (
    <Form
      labelAlign="left"
      labelTextAlign="right"
      value={LydjStore.editRecord}
      onChange={(values, item) => {
        if (item) {
          // eslint-disable-next-line default-case
          switch (item.name) {
            case 'jyrxz':
              setValidDw(item.value === 'B');
              break;
            case 'lsyhid':
              if (values.lsyhid) {
                const yhs = LydjStore.tempUsers.filter(
                  (o) => o.id === values.lsyhid,
                );
                if (yhs != null && yhs.length > 0) {
                  values.lsyhbh = yhs[0].bh;
                  values.lsyhmc = yhs[0].yhmc;
                }
              }
              break;
            case 'zjmc':
              // eslint-disable-next-line no-case-declarations
              const zjid = values.zjmc;
              if (zjid) {
                const sjdata = LydjStore.sjzdData['证件名称'] || [];
                for (let i = 0; i < sjdata.length; i++) {
                  if (sjdata[i].bh === zjid) {
                    setValidZjh(sjdata[i].mc.includes('身份证'));
                    break;
                  }
                }
              } else {
                setValidZjh(true);
              }
              break;
            default:
          }
        }
        LydjStore.onRecordChange(values);
      }}
      saveField={(f) => {
        setField(f);
      }}
    >
      <Row>
        {/* <Col span={5}>
          {LydjStore.system == 'Windows' ? (
            <div>
              <div className="card">
                {!LydjStore.pic_z && (
                  <div className="card-inner">
                    <i className="iconfont iconsaomiaoyi card-fonticon" />
                    <div className="card-inner-text">扫描身份证 头像面</div>
                  </div>
                )}
                {LydjStore.pic_z && (
                  <div className="card-inner">
                    <img src={LydjStore.pic_z} alt="" />
                  </div>
                )}
              </div>
              <div className="card">
                {!LydjStore.pic_f && (
                  <div className="card-inner">
                    <i className="iconfont iconsaomiaoyi card-fonticon" />
                    <div className="card-inner-text">扫描身份证 国徽面</div>
                  </div>
                )}
                {LydjStore.pic_f && (
                  <div className="card-inner">
                    <img src={LydjStore.pic_f} alt="" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ marginRight: 10, marginTop: 10 }}>
              <img
                style={{ height: 300, width: 230 }}
                src={LydjStore.pic_z}
                alt=""
              />
            </div>
          )}


        </Col>*/}
        <Col span={24}>
          <div style={{ margin: 4, fontWeight: Blob }}>
            <b>查档人信息</b>
          </div>
          <Row>
            <Col>
              <FormItem
                fullWidth
                required
                label="查档人："
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
                {...formItemLayout}
              >
                <IceInput
                  name="cyrxm"
                  placeholder="查档人"
                  readOnly={opt === 'view'}
                  addonAfter={
                    opt !== 'view' && (
                      <IceButton
                        loading={LydjStore.loadingCard}
                        type="primary"
                        onClick={onClickReadCard}
                      >
                        读取证件
                      </IceButton>
                    )
                  }
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem
                fullWidth
                required
                label="证件："
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
                {...formItemLayout}
              >
                <IceSelect
                  name="zjmc"
                  placeholder="证件"
                  defaultValue="01"
                  readOnly={opt === 'view'}
                >
                  {(LydjStore.sjzdData['证件名称'] || []).map((item) => (
                    <IceSelect.Option value={item.bh} key={item.id}>
                      {item.mc}
                    </IceSelect.Option>
                  ))}
                </IceSelect>
              </FormItem>
            </Col>
            <Col>
              <FormItem
                fullWidth
                required
                label="证件号："
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
                {...formItemLayout}
                validator={(rule, value, callback) =>
                  (validZjh &&
                    !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
                      value,
                    ) &&
                    callback('错误的身份证号码')) ||
                  callback()
                }
              >
                <IceInput
                  name="zjhm"
                  placeholder="请扫描证件"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem
                fullWidth
                label=" "
                required
                colon={false}
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
                {...formItemLayout}
              >
                <Radio.Group name="jyrxz" defaultValue="A">
                  <Radio value="A">个人</Radio>
                  <Radio value="B">单位</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem fullWidth label="联系电话：" {...formItemLayout}>
                <IceInput
                  name="lxdh"
                  placeholder="请填写联系电话"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem fullWidth label="家庭住址：" {...formItemLayout}>
                <IceInput
                  name="jtzz"
                  placeholder="请填写家庭住址"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem
                required
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
                fullWidth
                label="利用方式："
                {...formItemLayout}
              >
                <IceSelect
                  name="lyfs"
                  placeholder="请选择利用方式"
                  readOnly={opt === 'view'}
                >
                  {(LydjStore.sjzdData['利用方式'] || []).map((o) => (
                    <IceSelect.Option value={o.mc} key={o.id}>
                      {o.mc}
                    </IceSelect.Option>
                  ))}
                </IceSelect>
              </FormItem>
            </Col>
            <Col>
              <FormItem
                fullWidth
                required
                label="利用目的："
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
                {...formItemLayout}
              >
                <IceSelect
                  name="lymd"
                  placeholder="请选择利用目的"
                  readOnly={opt === 'view'}
                >
                  {(LydjStore.editRecord &&
                    LydjStore.editRecord.jyrxz &&
                    LydjStore.editRecord.jyrxz === 'B' &&
                    LydjStore.sjzdData['单位借阅目的'] &&
                    LydjStore.sjzdData['单位借阅目的'].length > 0 &&
                    LydjStore.sjzdData['单位借阅目的'].map((o) => (
                      <IceSelect.Option value={o.mc} key={o.id}>
                        {o.mc}
                      </IceSelect.Option>
                    ))) ||
                    (LydjStore.sjzdData['借阅目的'] || []).map((o) => (
                      <IceSelect.Option value={o.mc} key={o.id}>
                        {o.mc}
                      </IceSelect.Option>
                    ))}
                </IceSelect>
              </FormItem>
            </Col>
          </Row>
          <Row></Row>

          <Row>
            <Col>
              <FormItem
                fullWidth
                required={validDw}
                label="单位："
                {...formItemLayout}
                requiredMessage={`${formatMessage({
                  id: 'e9.info.data.require',
                })}`}
              >
                <IceInput
                  name="dw"
                  placeholder="请填写查档单位"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem fullWidth label="配偶姓名：" {...formItemLayout}>
                <IceInput
                  name="poxm"
                  placeholder="查询婚姻档案时请填写配偶姓名"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem fullWidth label="结婚年度：" {...formItemLayout}>
                <NumberPicker
                  name="jhnd"
                  min={1900}
                  max={2200}
                  style={{ width: '100%' }}
                  placeholder="查询婚姻档案时请填写结婚年度"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>

            <Col>
              <FormItem fullWidth label="预约时间：" {...formItemLayout}>
                <DatePicker
                  name="yysj"
                  showTime
                  onOk={onOk}
                  disabled={opt === 'view'}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem fullWidth label="便民网点：" {...formItemLayout}>
                <IceInput
                  name="bmwd"
                  placeholder="请填写便民网点"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem fullWidth label="备注：" {...formItemLayout}>
                <IceInput.TextArea
                  name="bz"
                  autoHeight={{ minRows: 1, maxRows: 6 }}
                  placeholder="备注"
                  readOnly={opt === 'view'}
                />
              </FormItem>
            </Col>
          </Row>
          <Row className="clsmdiv">
            <Col>
              <div className="filetitle">材料清单</div>
              <Loading visible={LydjStore.loadingFile}>
                <div className="filelist" float="left">
                  {LydjStore.system == 'Windows' ? (
                    <div className="card">
                      <Space size="small">
                        {!LydjStore.pic_z && (
                          <div className="card-inner">
                            <i className="iconfont iconsaomiaoyi card-fonticon" />
                            <div className="card-inner-text">
                              扫描身份证 头像面
                            </div>
                          </div>
                        )}
                        {LydjStore.pic_z && (
                          <div className="card-inner">
                            <img src={LydjStore.pic_z} alt="" />
                          </div>
                        )}

                        {!LydjStore.pic_f && (
                          <div className="card-inner">
                            <i className="iconfont iconsaomiaoyi card-fonticon" />
                            <div className="card-inner-text">
                              扫描身份证 国徽面
                            </div>
                          </div>
                        )}
                        {LydjStore.pic_f && (
                          <div className="card-inner">
                            <img src={LydjStore.pic_f} alt="" />
                          </div>
                        )}
                      </Space>
                    </div>
                  ) : (
                    <div style={{ marginRight: 5, float: 'left' }}>
                      <img
                        style={{ height: 130, width: 230 }}
                        src={LydjStore.pic_z}
                        alt=""
                      />
                    </div>
                  )}

                  {(LydjStore.loadingFile ||
                    (opt === 'view' &&
                      (!LydjStore.fjData || LydjStore.fjData.length == 0))) && (
                      <div className="file">
                        <div className="file-bottom">
                          <div className="file-inner">
                            <EmptyData />
                          </div>
                        </div>
                      </div>
                    )}
                  {LydjStore.fjData.map((f, index) => (
                    <div className="file" key={index}>
                      <div
                        className="file-inner"
                        onClick={() => doViewFileAction({ url: f.url })}
                      >
                        <img src={f.url} alt="" />
                      </div>
                      {opt !== 'view' && (
                        <div className="image-footer">
                          {/*  */}
                          <div onClick={() => doViewFileAction({ url: f.url })}>
                            <IceIcon type="eye" />{' '}
                          </div>
                          <div
                            onClick={() =>
                              doDeleteFileAction(f.grpid, f.fileid || f.id)
                            }
                          >
                            <IceIcon type="ashbin" />{' '}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {opt !== 'view' && (
                    <div className="file-bottom">
                      <div className="file-inner" onClick={onPhotoOpen}>
                        <i className="iconfont iconsaomiaoyi" />
                        <div className="file-inner-text">点击扫描材料</div>
                      </div>
                    </div>
                  )}
                </div>
              </Loading>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );

  const onOk = (value) => {
    console.log('onOK:', value.format('YYYY-MM-DD HH:mm:ss'));
  };

  const renderTableCell = (index, value, colindex, record) => {
    console.log('+++++', index);
    console.log(value);
    console.log(colindex);
    console.log(record);
    return (
      <div>
        <a href="javascript:void(0)" onClick={() => addTmToLymx(index, record)}>
          <SvgIcon type="iconadd" />
        </a>
        <a
          href="javascript:void(0)"
          style={{ marginLeft: 10 }}
          onClick={() => {
            showDakFile(index, record);
          }}
        >
          <SvgIcon type="iconfujian" />
          <span>{record.fjs || ''}</span>
        </a>
      </div>
    );
  };

  const renderLymxTableCell = (value, colindex, record) => {
    return (
      <div>
        {LydjStore.opt !== 'view' && (
          <a
            href="javascript:void(0)"
            onClick={() => {
              LydjStore.deleteLYmx(record);
            }}
          >
            <SvgIcon type="icondel" />
          </a>
        )}
        {(record.fjs && record.fjs > 0 && (
          <a
            href="javascript:void(0)"
            style={{ marginLeft: 10 }}
            onClick={() => {
              showLymxFile(record);
            }}
          >
            <SvgIcon type="iconfujian" />
            <span>{record.fjs || ''}</span>
          </a>
        )) ||
          ''}
      </div>
    );
  };

  const getTableHeight = () => {
    return `${ref.current.clientHeight - 212}px`;
  };

  const onClickRotate = () => {
    LydjStore.getRotate().then((res) => {
      if (res.data.returnCode == 0) {
        let new_rotate = res.data.data + 1;
        new_rotate = new_rotate > 3 ? 0 : new_rotate;
        LydjStore.Rotate(new_rotate);
      }
    });
  };

  const renderDakcx = () => (
    <Fragment>
      {/* 这里为查询结果页面 */}
      <Row gutter={4} className="dakresult">
        <Col span={24}>
          <Tab size="small">
            <Tab.Item key="dakcx" title="目录检索">
              <div className="dakcx" style={{ padding: '5px' }}>
                <TreeSelect
                  showSearch
                  dataSource={LydjStore.treeData}
                  treeDefaultExpandAll
                  style={{ width: '20%' }}
                  readOnly={opt === 'view'}
                  disabled={opt === 'view'}
                  notFoundContent="未找到数据"
                  {...fieldDak.init('dakid', {
                    rules: [
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'e9.info.data.require',
                        })}`,
                      },
                    ],
                  })}
                />
                <span style={{ color: 'red', fontSize: 12 }}>
                  {fieldDak.getError('dakid')}
                </span>
                <IceInput
                  {...fieldDak.init('key', {})}
                  style={{ width: '30%', marginLeft: 10 }}
                  readOnly={opt === 'view'}
                  addonAfter={
                    <IceButton
                      disabled={opt === 'view'}
                      onClick={doSearchAction}
                    >
                      <IceIcon type="search" />
                      检索
                    </IceButton>
                  }
                />
              </div>

              <Tab
                activeKey={tabIndex}
                onChange={(index) => setTabIndex(index)}
                onClose={onTableClose}
              >
                {LydjStore.tpageno.map((item, index) => (
                  <Tab.Item
                    key={index}
                    title={`查询结果${index + 1}`}
                    closeable
                  >
                    <Table.StickyLock
                      isZebra
                      bordered="true"
                      fixedHeader
                      maxBodyHeight={maxBodyHeight}
                      dataSource={
                        (LydjStore.tdata.length > index &&
                          LydjStore.tdata[index].results) ||
                        []
                      }
                      loading={
                        LydjStore.tloading.length > index &&
                        LydjStore.tloading[index]
                      }
                      emptyContent={<EmptyData />}
                    >
                      <Table.Column
                        title="操作"
                        alignHeader="center"
                        align="center"
                        cell={(value, colindex, record) =>
                          renderTableCell(index, value, colindex, record)
                        }
                        width="80px"
                        lock
                      />
                      {LydjStore.tparams[index] &&
                        DapubStore.columns[
                          `${LydjStore.tparams[index].dakid}-4-${umid}`
                        ].map((col) => (
                          <Table.Column
                            alignHeader="center"
                            key={col.dataIndex}
                            {...col}
                            width={(col.width || 200) * 1.5}
                          />
                        ))}
                    </Table.StickyLock>
                    <Pagination
                      className="paginate"
                      size={E9Config.Pagination.size}
                      current={LydjStore.tpageno[index] || pageno}
                      pageSize={LydjStore.tpagesize[index] || pagesize}
                      total={
                        (LydjStore.tdata.length > index &&
                          LydjStore.tdata[index].total) ||
                        0
                      }
                      onChange={(current) => onPaginationChange(index, current)}
                      shape={E9Config.Pagination.shape}
                      pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                      pageSizePosition={E9Config.Pagination.pageSizePosition}
                      onPageSizeChange={(pageSize) =>
                        onPageSizeChange(index, pageSize)
                      }
                      popupProps={E9Config.Pagination.popupProps}
                      totalRender={(total) => (
                        <span className="pagination-total">
                          {' '}
                          {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}
                        </span>
                      )}
                    />
                  </Tab.Item>
                ))}
                {LydjStore.tpageno.length === 0 && (
                  <Tab.Item title="查询结果" disabled />
                )}
              </Tab>
            </Tab.Item>
            <Tab.Item
              key="epsSerach"
              title="全文检索"
              style={{ height: '100%' }}
            >
              <div
                id="scrollableDiv"
                style={{
                  //height: '400px',
                  height: '100%',
                  overflow: 'auto',
                  padding: '0 16px',
                  // border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
              >
                <Fulltext />
              </div>
            </Tab.Item>
          </Tab>
        </Col>
      </Row>

      <DrawerAction
        // params={archStore.archParams}
        count={LydjStore.lymxDataCount || 0}
        archStore={LydjStore}
        drawVisit={LydjStore.drawVisit}
        setDrawVisit={(visit) => (LydjStore.drawVisit = visit)}
        colseDraw={() => (LydjStore.drawVisit = false)}
        drawExtendParams={LydjStore.drawExtendParams}
        doSubmit={LydjStore.drawSubmit}
        drawWidth={'750px'}
        drawUrl={'/runRfunc/cddjmx'}
        refreshPage={() => alert(1)}
        drawUseIframe={false}
      />
    </Fragment>
  );

  const renderLydj = () => (
    <Form
      labelAlign="left"
      labelTextAlign="right"
      value={LydjStore.editRecord}
      onChange={LydjStore.onRecordChange}
      saveField={(f) => {
        setFieldLyxx(f);
      }}
    >
      <Row>
        <Col>
          <FormItem
            required
            fullWidth
            label="查档内容："
            requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
            {...formItemLayout}
          >
            <IceSelect
              name="lydanr"
              placeholder="查档内容"
              readOnly={opt === 'view'}
            >
              {(LydjStore.daklist || []).map((o) => (
                <IceSelect.Option value={o.value} key={o.key}>
                  {o.label}
                </IceSelect.Option>
              ))}
              {/* {(LydjStore.sjzdData["查档内容"] || []).map(o => <IceSelect.Option value={o.bh} key={o.id}>{o.mc}</IceSelect.Option>)} */}
            </IceSelect>
          </FormItem>
        </Col>
        <Col>
          <FormItem required fullWidth label="利用方式：" {...formItemLayout}>
            <IceSelect
              name="lyfs"
              placeholder="请选择利用方式"
              readOnly={opt === 'view'}
            >
              {(LydjStore.sjzdData['利用方式'] || []).map((o) => (
                <IceSelect.Option value={o.mc} key={o.id}>
                  {o.mc}
                </IceSelect.Option>
              ))}
            </IceSelect>
          </FormItem>
        </Col>
        <Col>
          <FormItem fullWidth label="打印页数：" {...formItemLayout}>
            <NumberPicker
              name="fyys"
              min={0}
              style={{ width: '100%' }}
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem fullWidth label="翻拍页数：" {...formItemLayout}>
            <NumberPicker
              name="fbys"
              min={0}
              style={{ width: '100%' }}
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem fullWidth label="下载文件数：" {...formItemLayout}>
            <NumberPicker
              name="xzwjs"
              min={0}
              style={{ width: '100%' }}
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem fullWidth label="复印页数：" {...formItemLayout}>
            <NumberPicker
              name="kpzs"
              min={0}
              style={{ width: '100%' }}
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem fullWidth label="调资料册数：" {...formItemLayout}>
            <NumberPicker
              name="dzlcs"
              min={0}
              style={{ width: '100%' }}
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem fullWidth label="出具证明数：" {...formItemLayout}>
            <NumberPicker
              name="cjzms"
              min={0}
              style={{ width: '100%' }}
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <FormItem
            fullWidth
            required
            label="利用目的："
            requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
            {...formItemLayout}
          >
            <IceSelect
              name="lymd"
              placeholder="请选择利用目的"
              readOnly={opt === 'view'}
            >
              {(LydjStore.editRecord &&
                LydjStore.editRecord.jyrxz &&
                LydjStore.editRecord.jyrxz === 'B' &&
                LydjStore.sjzdData['单位借阅目的'] &&
                LydjStore.sjzdData['单位借阅目的'].length > 0 &&
                LydjStore.sjzdData['单位借阅目的'].map((o) => (
                  <IceSelect.Option value={o.mc} key={o.id}>
                    {o.mc}
                  </IceSelect.Option>
                ))) ||
                (LydjStore.sjzdData['借阅目的'] || []).map((o) => (
                  <IceSelect.Option value={o.mc} key={o.id}>
                    {o.mc}
                  </IceSelect.Option>
                ))}
            </IceSelect>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            fullWidth
            required
            label="利用效果："
            requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
            {...formItemLayout}
          >
            <IceSelect
              name="lyxg"
              placeholder="请选择利用效果"
              readOnly={opt === 'view'}
            >
              {(LydjStore.sjzdData['利用效果'] || []).map((o) => (
                <IceSelect.Option value={o.mc} key={o.id}>
                  {o.mc}
                </IceSelect.Option>
              ))}
            </IceSelect>
          </FormItem>
        </Col>
        <Col>
          <FormItem fullWidth label="补充说明：" {...formItemLayout}>
            <IceInput.TextArea
              name="lyxgre"
              maxLength={200}
              placeholder="请补充说明利用效果详情"
              readOnly={opt === 'view'}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );

  const renderRate = () => (
    <Form
      labelAlign="left"
      labelTextAlign="right"
      value={LydjStore.editRecord}
      onChange={LydjStore.onRecordChange}
      saveField={(f) => {
        setFieldRate(f);
      }}
    >
      <Row>
        <Col style={{ textAlign: 'center', fontWeight: 800, fontSize: 18 }}>
          服务满意度
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'center' }}>
          <FormItem label="" {...formItemLayout}>
            <Rate
              tooltips={['很不满意', '不满意', '一般', '满意', '非常满意']}
              name="rate"
              disabled={opt === 'view'}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );

  const changeDevIdxImg = () => (
    <svg viewBox="0 0 1181 1024" width="1em" height="1em">
      <path
        d="M850.786462 533.792821a282.834051 282.834051 0 0 0-47.996718-158.06359c-0.472615-0.787692-0.735179-1.549128-1.234052-2.284308-3.754667-5.461333-7.876923-10.60759-11.92041-15.701333l-1.417846-1.942975a269.942154 269.942154 0 0 0-101.717333-78.349128l-3.229539-1.522872c-6.327795-2.625641-12.734359-5.041231-19.219692-7.220512-2.310564-0.787692-4.621128-1.654154-7.010462-2.363077a247.860513 247.860513 0 0 0-17.092923-4.542359c-3.203282-0.761436-6.380308-1.575385-9.609846-2.258052-1.601641-0.288821-3.098256-0.787692-4.699897-1.076512-4.279795-0.787692-8.612103-1.102769-12.944411-1.680411-2.940718-0.393846-5.881436-0.840205-8.900923-1.155282-7.220513-0.708923-14.414769-0.997744-21.609025-1.155282-1.312821 0-2.573128-0.183795-3.912206-0.183795-0.210051 0-0.420103 0.078769-0.65641 0.07877a265.531077 265.531077 0 0 0-155.595487 50.46482c-14.834872 10.870154-18.379487 31.507692-8.008205 46.73641a32.137846 32.137846 0 0 0 45.528615 8.192 201.911795 201.911795 0 0 1 138.476308-37.336615l5.513846 0.682667c4.909949 0.630154 9.819897 1.365333 14.598564 2.310564 2.126769 0.420103 4.201026 0.997744 6.301539 1.496615 4.726154 1.076513 9.426051 2.231795 14.020923 3.675898 1.496615 0.446359 2.914462 1.024 4.38482 1.522871 5.251282 1.759179 10.423795 3.675897 15.517539 5.802667 0.525128 0.236308 1.050256 0.525128 1.575384 0.708923a208.790974 208.790974 0 0 1 78.060308 60.04841 214.961231 214.961231 0 0 1 47.419077 135.115488h-54.534564l87.223795 134.170256 87.171282-134.170256h-54.482051z m-153.705026 174.00123a201.938051 201.938051 0 0 1-121.278359 38.281846 220.396308 220.396308 0 0 1-16.909128-0.892718c-2.310564-0.210051-4.594872-0.577641-6.87918-0.866461-4.384821-0.630154-8.769641-1.207795-13.128205-2.100513-2.625641-0.498872-5.198769-1.181538-7.82441-1.837949a196.739282 196.739282 0 0 1-12.471795-3.255794c-1.969231-0.630154-3.912205-1.312821-5.881436-2.021744a190.962872 190.962872 0 0 1-13.994667-5.277539c-1.050256-0.420103-2.048-0.918974-3.072-1.391589a212.283077 212.283077 0 0 1-15.753846-7.798154l-0.708923-0.393846a209.893744 209.893744 0 0 1-47.130256-36.233846c-0.236308-0.183795-0.420103-0.446359-0.682667-0.708923a194.139897 194.139897 0 0 1-12.340513-13.968411c-0.840205-1.024-1.627897-2.126769-2.468102-3.203282a214.751179 214.751179 0 0 1-45.371077-132.332307h54.508307l-87.223794-134.170257-87.171282 134.170257h54.482051c0 58.814359 17.906872 113.322667 48.259282 158.404923 0.36759 0.630154 0.603897 1.286564 1.050256 1.916718 3.124513 4.621128 6.642872 8.874667 9.977436 13.206974 1.286564 1.654154 2.468103 3.360821 3.754667 4.988718 4.988718 6.196513 10.266256 11.999179 15.675077 17.69682 0.525128 0.525128 1.024 1.102769 1.496615 1.627898 18.221949 18.694564 38.859487 34.44841 61.282462 47.077743 0.577641 0.341333 1.155282 0.735179 1.759179 1.050257 6.485333 3.544615 13.101949 6.80041 19.849846 9.819897 1.68041 0.735179 3.308308 1.575385 5.014975 2.310564 5.723897 2.441846 11.657846 4.568615 17.591795 6.616616 2.809436 0.971487 5.618872 1.995487 8.48082 2.888205 5.198769 1.575385 10.502564 2.888205 15.885128 4.201025 3.570872 0.866462 7.089231 1.785436 10.686359 2.468103 1.496615 0.341333 2.888205 0.787692 4.437334 1.050256 5.041231 0.918974 10.134974 1.417846 15.176205 2.048l5.435077 0.761436c9.084718 0.892718 18.169436 1.522872 27.227897 1.522872 55.401026 0 109.436718-17.381744 155.805539-50.701128a34.15959 34.15959 0 0 0 8.008205-46.73641 32.137846 32.137846 0 0 0-45.554872-8.218257zM1047.552 156.488205h-143.885128C869.349744 156.488205 796.461949 0 758.232615 0H396.603077c-38.176821 0-111.064615 156.488205-145.197949 156.488205H108.333949C48.548103 156.488205 0 209.027282 0 273.854359V899.807179c0 64.853333 48.521846 117.366154 108.360205 117.366154h939.191795c59.864615 0 108.360205-52.460308 108.360205-117.366154V273.828103c0-64.800821-48.469333-117.339897-108.360205-117.339898z m36.128821 704.196923c0 43.244308-32.374154 78.244103-72.231385 78.244103H144.489026c-39.909744 0-72.257641-34.973538-72.257641-78.244103V312.97641c0-43.218051 32.321641-78.244103 72.231384-78.244102h143.701334c33.398154 0 105.970872-156.488205 144.200205-156.488205h288.321641c38.071795 0 110.644513 156.488205 144.01641 156.488205h146.72082c39.883487 0 72.205128 35.026051 72.205129 78.244102v547.708718h0.052513z"
        fill="currentColor"
      ></path>
    </svg>
  );

  const customRequest = (option) => {
    LydjStore.uploadSQZip(option.file);
    return { abort() { } };
  };

  return (
    <div className="hall-regist" style={{ paddingTop: '10px' }} ref={ref}>
      <div className="editform">
        <Steps
          current={step}
          size="small"
          style={{ marginLeft: '10%', width: '80%' }}
        >
          {steps.map((s, index) => (
            <Step title={s} key={index} />
          ))}
        </Steps>
        <div className="editContext">
          {step === 0 && renderCdrxx()}
          {step === 1 && renderDakcx()}
          {step === 2 && renderLydj()}
          {step === 3 && renderRate()}
          <div className="effooter">
            {/* <UserSwitchOutlined /> */}
            {step === 0 && opt !== 'view' && (
              <>
                {OptrightStore.hasRight(umid, 'DALY101') && (
                  <Upload
                    accept=".zip"
                    request={customRequest}
                    onChange={() => { }}
                  >
                    <IceButton type="secondary">
                      {/* <Icon type="upload" /> */}
                      上传申请包
                    </IceButton>
                  </Upload>
                )}
                &nbsp;
                <IceButton type="primary" onClick={() => showCdjl()}>
                  查档记录
                </IceButton>
                &nbsp;
                {/* <IceButton type="primary" >
                保存清空
              </IceButton> */}
                <IceButton type="primary" onClick={doGenUser}>
                  生成临时账户
                </IceButton>
              </>
            )}
            {step === 1 && opt !== 'view' && (
              <>
                <IceButton.Group>
                  <IceButton type="primary" onClick={doTranferAppro}>
                    转审批
                  </IceButton>
                </IceButton.Group>
                <IceButton.Group style={{ marginLeft: 5 }}>
                  <Tooltip title="实体出库登记">
                    <IceButton type="primary" onClick={doDiaoJuan}>
                      调卷
                    </IceButton>
                  </Tooltip>
                  {LydjStore.paramValue['DADTS002'] !== 'Y' && (
                    <IceButton IceButton type="primary" onClick={doStlq}>
                      出库并领取
                    </IceButton>
                  )}
                  {LydjStore.paramValue['DADTS003'] !== 'Y' && (
                    <IceButton type="primary" onClick={doStgh}>
                      归还并入库
                    </IceButton>
                  )}
                </IceButton.Group>
              </>
            )}
            {step === steps.length - 1 && (
              <IceButton type="primary">满意度评价</IceButton>
            )}

            <IceButton.Group style={{ marginLeft: 5 }}>
              {step !== 0 && (
                <IceButton type="primary" onClick={doPrev}>
                  <IceIcon type="arrow-left" />
                  上一步
                </IceButton>
              )}
              <IceButton type="primary" onClick={doNext}>
                {(step === steps.length - 1 && '完成') || '下一步'}
                {step !== steps.length - 1 && <IceIcon type="arrow-right" />}
              </IceButton>
            </IceButton.Group>
            {/* <IceButton
              type="normal"
              warning
              onClick={() => {
                if (opt !== 'view') {
                  LydjStore.queryForPage();
                }
                LydjStore.closeEditForm();
              }}
              style={{ marginLeft: 20 }}
            >
              <IceIcon type="exit" />
              关闭
            </IceButton> */}
          </div>
        </div>
        <Dialog
          isFullScreen
          title="查看材料"
          visible={imgDlgVisible}
          onClose={() => {
            setImgDlgVisible(false);
          }}
          footer={false}
          shouldUpdatePosition
        >
          <div className="fileViewDialog">
            <img src={curImg && curImg.url} />
          </div>
        </Dialog>
        {LydjStore.system == 'Windows' ? (
          <Dialog
            isFullScreen
            title={
              <Row>
                <Col span={4}>照相机</Col>
                <Col>
                  <IceButton.Group style={{ marginLeft: 20 }}>
                    <IceButton type="primary" onClick={() => doRotate90()}>
                      {/* <SvgIcon type="iconundo" />{' '} */}
                      左旋转图片
                    </IceButton>
                    <IceButton type="primary" onClick={() => doRotate270()}>
                      {/* <SvgIcon type="iconredo" />{' '} */}
                      右旋转图片
                    </IceButton>
                    <IceButton type="primary" onClick={() => doChangeCarme()}>
                      <Icon component={changeDevIdxImg} />
                      切换摄像头
                    </IceButton>
                  </IceButton.Group>
                  <IceButton
                    style={{ marginLeft: 20 }}
                    type="primary"
                    onClick={() => {
                      LydjStore.scanPic().then(() => {
                        message.info({ content: '拍照成功' });
                      });
                    }}
                  >
                    拍照
                  </IceButton>
                </Col>
              </Row>
            }
            visible={picDlgVisible}
            onClose={() => {
              LydjStore.closeCamera();
              setPicDlgVisible(false);
            }}
            footer={false}
            shouldUpdatePosition
          >
            <div key={`div_${LydjStore.devIdx}`} className="picViewDialog">
              <img
                key={`img_${LydjStore.devIdx}`}
                src={
                  (picDlgVisible &&
                    `http://127.0.0.1:38088/video=stream&camidx=${LydjStore.devIdx}`) ||
                  ''
                }
              />
            </div>
          </Dialog>
        ) : (
          <Dialog
            isFullScreen
            title={
              <Row>
                <Col span={4}>照相机</Col>
                <Col>
                  {/* <IceButton.Group style={{ marginLeft: 20 }}> */}
                  <IceButton type="primary" onClick={onClickRotate}>
                    旋转图片
                  </IceButton>
                  <IceCheckBox
                    style={{ marginLeft: 10 }}
                    onChange={(checked) => {
                      LydjStore.JiuPian(checked).catch((err) =>
                        message.error('设置纠偏失败！'),
                      );
                    }}
                  >
                    纠偏
                  </IceCheckBox>
                  <IceButton type="primary" onClick={() => doChangeCarme()}>
                    切换摄像头
                  </IceButton>
                  {/* </IceButton.Group> */}
                  <IceButton
                    style={{ marginLeft: 20 }}
                    type="primary"
                    onClick={() => {
                      LydjStore.scanPicLinux().then(() => {
                        message.info({ content: '拍照成功' });
                      });
                    }}
                  >
                    拍照
                  </IceButton>
                </Col>
              </Row>
            }
            visible={picDlgVisibleLinux}
            onClose={() => {
              LydjStore.closeCameraLinux();
              setPicDlgVisibleLinux(false);
              clearInterval(timer);
            }}
            footer={false}
            shouldUpdatePosition
          >
            <div className="picViewDialog">
              <img src={picDlgVisibleLinux && steamvideoimg} alt="" />
            </div>
          </Dialog>
        )}
        <FileView />
        <Modal
          title="权限分配"
          visible={LydjStore.qxModalVisible}
          okText="授权"
          onCancel={() => LydjStore.showQxModal(false)}
          bodyStyle={{ paddingTop: '4px', height: '70vh' }}
          maskClosable={false}
          width={'80%'}
          footer={[
            <Button onClick={() => LydjStore.clearQxData()}>全清</Button>,
            <Button
              type="primary"
              key="ok"
              onClick={() => {
                // console.log(toJS(LydjStore.qxData));
                let flag = false;
                const { attr_tm, tm_no } = LydjStore.qxData;
                if (attr_tm) {
                  LydjStore.setTmtj(
                    true,
                    attr_tm
                      .toString()
                      .split(',')
                      .filter((v) => !!v)
                      .join(','),
                  );
                }
                if (tm_no) {
                  LydjStore.setTmtj(
                    false,
                    tm_no
                      .toString()
                      .split(',')
                      .filter((v) => !!v)
                      .join(','),
                  );
                }
                for (let key in LydjStore.qxData) {
                  if (key != 'ywck' && LydjStore.qxData[key]) {
                    flag = true;
                    break;
                  }
                }
                if (!flag) {
                  message.info('请至少设置一个维度的权限');
                  return;
                }
                saveDjrxx(true, (success) => {
                  if (success) {
                    LydjStore.showQxModal(false);
                    message.success(<span>授权成功！</span>);
                  }
                });
              }}
            >
              授权
            </Button>,
            <Button
              danger
              key="cancel"
              onClick={() => LydjStore.showQxModal(false)}
            >
              关闭
            </Button>,
          ]}
        >
          <Spin spinning={LydjStore.saving} size="large">
            <Row align="stretch" className="lydj-qx">
              <Col span={10} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                <Typography>
                  <Typography.Title level={5}>
                    全宗号{' '}
                    <Button
                      size="small"
                      shape="circle"
                      style={{ float: 'right' }}
                      onClick={() => {
                        LydjStore.refreshQxset('attr_qzh');
                      }}
                    >
                      <DoubleRightOutlined />
                    </Button>
                  </Typography.Title>
                  <Typography.Paragraph>
                    <Space wrap>
                      {LydjStore.qxData.attr_qzh &&
                        LydjStore.qxData.attr_qzh.map((o) => (
                          <CheckableTag
                            key={o}
                            checked
                            onChange={(checked) =>
                              LydjStore.reSetQxData('attr_qzh', o, checked)
                            }
                          >
                            {o}
                          </CheckableTag>
                        ))}
                    </Space>
                  </Typography.Paragraph>
                  <Divider orientation="left" />
                  <Typography.Title level={5}>
                    档案库
                    <Button
                      size="small"
                      shape="circle"
                      style={{ float: 'right' }}
                      onClick={() => {
                        LydjStore.refreshQxset('attr_dakmc');
                      }}
                    >
                      <DoubleRightOutlined />
                    </Button>
                  </Typography.Title>
                  <Typography.Paragraph>
                    <Space wrap>
                      {LydjStore.qxData.attr_dakmc &&
                        LydjStore.qxData.attr_dakmc.map((o) => (
                          <CheckableTag
                            key={o}
                            checked
                            onChange={(checked) =>
                              LydjStore.reSetQxData('attr_dakmc', o, checked)
                            }
                          >
                            {o}
                          </CheckableTag>
                        ))}
                    </Space>
                  </Typography.Paragraph>
                  <Divider orientation="left" />
                  <Typography.Title level={5}>电子文件</Typography.Title>
                  <Typography.Paragraph>
                    <Checkbox
                      checked={LydjStore.qxData.ywck}
                      onChange={(e) => LydjStore.chaKanDoc(e.target.checked)}
                    >
                      允许查看电子文件
                    </Checkbox>
                  </Typography.Paragraph>
                  <Divider orientation="left" />
                  <Typography.Title level={5}>开放档案</Typography.Title>
                  <Typography.Paragraph>
                    <Checkbox
                      checked={LydjStore.qxData.kfda}
                      onChange={(e) =>
                        LydjStore.chaKaiFangArc(e.target.checked)
                      }
                    >
                      仅仅查看开放档案
                    </Checkbox>
                  </Typography.Paragraph>
                  <Divider orientation="left" />
                  <Typography.Title level={5}>题名</Typography.Title>
                  <Typography.Paragraph>
                    <Row>
                      <Col span={5}>包含</Col>
                      <Col>
                        <MutiEdit
                          value={LydjStore.qxData.attr_tm || ''}
                          onChange={(value) => LydjStore.setTmtj(true, value)}
                        />
                      </Col>
                    </Row>
                    <Divider orientation="left" dashed />
                    <Row style={{ marginTop: '2px' }}>
                      <Col span={5}>不包含</Col>
                      <Col>
                        <MutiEdit
                          value={LydjStore.qxData.tm_no || ''}
                          onChange={(value) => LydjStore.setTmtj(false, value)}
                        />
                      </Col>
                    </Row>
                  </Typography.Paragraph>
                  <Divider orientation="left" />
                  <Typography.Title level={5}>
                    年度
                    <Button
                      size="small"
                      shape="circle"
                      style={{ float: 'right' }}
                      onClick={() => {
                        LydjStore.refreshQxset('attr_nd');
                      }}
                    >
                      <DoubleRightOutlined />
                    </Button>
                  </Typography.Title>
                  <Typography.Paragraph>
                    <Space wrap>
                      {LydjStore.qxData.attr_nd &&
                        LydjStore.qxData.attr_nd.map((o) => (
                          <CheckableTag
                            key={o}
                            checked
                            onChange={(checked) =>
                              LydjStore.reSetQxData('attr_nd', o, checked)
                            }
                          >
                            {o}
                          </CheckableTag>
                        ))}
                    </Space>
                  </Typography.Paragraph>
                  <Divider orientation="left" />
                  <Typography.Title level={5}>
                    全宗名称
                    <Button
                      size="small"
                      shape="circle"
                      style={{ float: 'right' }}
                      onClick={() => {
                        LydjStore.refreshQxset('attr_qzmc');
                      }}
                    >
                      <DoubleRightOutlined />
                    </Button>
                  </Typography.Title>
                  <Typography.Paragraph>
                    <Space wrap>
                      {LydjStore.qxData.attr_qzmc &&
                        LydjStore.qxData.attr_qzmc.map((o) => (
                          <CheckableTag
                            key={o}
                            checked
                            onChange={(checked) =>
                              LydjStore.reSetQxData('attr_qzmc', o, checked)
                            }
                          >
                            {o}
                          </CheckableTag>
                        ))}
                    </Space>
                  </Typography.Paragraph>
                </Typography>
              </Col>
              <Col
                span={14}
                style={{
                  borderLeft: '1px #d9d9d9 dashed',
                  paddingLeft: '20px',
                }}
              >
                <Row>
                  <Col span={18}>
                    {(LydjStore.qxCurName &&
                      LydjStore.qxCurName === 'attr_nd' && (
                        <DatePicker.RangePicker
                          style={{ marginBottom: 5 }}
                          picker="year"
                          onChange={(_, dateStrings) => {
                            LydjStore.refreshQxNdFilter(dateStrings);
                          }}
                        />
                      )) || (
                        <Input
                          style={{ marginBottom: 5 }}
                          placeholder="输入条件可以进行过滤"
                          value={LydjStore.qxFilterStr}
                          onChange={(e) => {
                            console.log(e.target.value);
                            LydjStore.refreshQxFilter(e.target.value);
                          }}
                        />
                      )}
                  </Col>
                  <Col>
                    <Button.Group>
                      <Button
                        type="primary"
                        onClick={() => {
                          LydjStore.qxCurName &&
                            LydjStore.setAllQxData(LydjStore.qxCurName, true);
                        }}
                      >
                        全选
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          LydjStore.qxCurName &&
                            LydjStore.setAllQxData(LydjStore.qxCurName, false);
                        }}
                      >
                        全清
                      </Button>
                    </Button.Group>
                  </Col>
                </Row>
                <Spin size="large" spinning={LydjStore.qxMapLoading}>
                  <Space wrap style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                    {LydjStore.qxCurName &&
                      LydjStore.qxMap[LydjStore.qxCurName] &&
                      LydjStore.qxMap[LydjStore.qxCurName]
                        .filter(
                          (o) =>
                            (LydjStore.qxCurName !== 'attr_nd' &&
                              (!LydjStore.qxFilterStr ||
                                o.includes(LydjStore.qxFilterStr))) ||
                            (LydjStore.qxCurName === 'attr_nd' &&
                              (!LydjStore.qxNdFilterStr ||
                                LydjStore.qxNdFilterStr.length != 2 ||
                                !LydjStore.qxNdFilterStr[0] ||
                                (o >= LydjStore.qxNdFilterStr[0] &&
                                  o <= LydjStore.qxNdFilterStr[1]))),
                        )
                        .map((o) => (
                          <CheckableTag
                            key={o}
                            checked={(
                              LydjStore.qxData[LydjStore.qxCurName] || []
                            ).includes(o)}
                            onChange={(checked) =>
                              LydjStore.reSetQxData(
                                LydjStore.qxCurName,
                                o,
                                checked,
                              )
                            }
                          >
                            {o}
                          </CheckableTag>
                        ))}
                  </Space>
                </Spin>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </div>
    </div>
  );
});

export default LydjEdit;
