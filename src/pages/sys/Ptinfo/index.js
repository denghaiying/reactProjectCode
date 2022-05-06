import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import IcePanel from '@icedesign/panel';
import { Grid, Input, Icon, Button, NumberPicker, Select, Checkbox, Message, Upload, Form, Dialog } from '@alifd/next';
import Cropper from 'react-cropper';
import ContainerTitle from '@/components/ContainerTitle';
import PtinfoStore from '@/stores/system/PtinfoStore';
import '~/cropperjs/dist/cropper.css';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const { Row, Col } = Grid;

const Ptinfo = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const [ldVisible, setLdVisible] = useState(false);
  const [ldsrc, setLdSrc] = useState('');
  const cropperLdRef = useRef(null);

  useEffect(() => {
    PtinfoStore.findEditData();
  }, []);

  const save = () => {
    PtinfoStore.save().then(
      () => {
        Message.success(`${formatMessage({ id: 'e9.info.data.savesuccess' })}`);
      }
    );
  };

  const download = () => {
    PtinfoStore.download();
  };

  const customRequest = (option) => {
    PtinfoStore.upload(option.file);
    return { abort () { } };
  };

  const onSelectLogo = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLdSrc(reader.result);
      setLdVisible(true);
    };
    reader.readAsDataURL(files[0]);
  };

  const saveLdImg = () => {
    PtinfoStore.setEditLogoImage(cropperLdRef.current.getCroppedCanvas().toDataURL());
    setLdVisible(false);
  };

  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.ptinfo.title' })}
        mainroute="/sysuser"
        umid="sysmrg001"
        extra={
          <span>
            <Button.Group >
              <Button type="primary" onClick={save}><Icon className="iconfont iconsave" /><FormattedMessage id="e9.btn.save" /></Button>
            </Button.Group>
            <Button style={{ marginLeft: '10px' }} type="primary" onClick={download}><Icon className="iconfont iconfile-export" /><FormattedMessage id="e9.btn.file.export" /></Button>
            <Upload className="next-btn-group"
              // listType="text"
              // action="/api/sysapi/ptinfo/upload"
              // autoUpload={false}
              accept=".rgt"
              request={customRequest}
              onChange={() => { }}
              style={{ marginLeft: '10px' }}
            >
              <Button type="primary" ><Icon className="iconfont iconfile-import" /><FormattedMessage id="e9.btn.file.import" /></Button>
            </Upload>
          </span>
        }
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="workspace">
            <IcePanel style={{ marginBottom: '10px' }}>
              <IcePanel.Header style={{ lineHeight: '10px' }}>
                {formatMessage({ id: 'e9.sys.ptinfo.base.title' })}
              </IcePanel.Header>
              <IcePanel.Body>
                <Form value={PtinfoStore.editRecord} onChange={PtinfoStore.resetRecord} {...formItemLayout} >
                  <Row>
                    <Col span={12}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.id' })}：`} {...formItemLayout}>
                        <Input
                          name="id"
                          disabled
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.id' })}
                        />
                      </FormItem>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoName' })}：`} {...formItemLayout}>
                        <Input
                          name="ptinfoName"
                          maxLength={15}
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoName' })}
                        />
                      </FormItem>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoConame' })}：`} {...formItemLayout}>
                        <Input
                          name="ptinfoConame"
                          disabled
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoConame' })}
                        />
                      </FormItem>
                    </Col>
                    <Col offset={2} span={3}>
                      <Upload.Selecter
                        onSelect={onSelectLogo}
                        accept="image/png"
                        style={{ width: 60, height: 60 }}
                      >
                        <img style={{ width: 60, height: 60 }} alt={formatMessage({ id: 'e9.sys.ptinfo.r.logo' })} src={PtinfoStore.editRecord.ptinfoLogo || require('@/styles/img/left-logo.png')} />
                      </Upload.Selecter>
                      <Dialog
                        visible={ldVisible}
                        onCancel={() => setLdVisible(false)}
                        onOk={() => saveLdImg()}
                        onClose={() => setLdVisible(false)}
                        isFullScreen
                      >
                        <Cropper
                          // viewMode={1}
                          ref={cropperLdRef}
                          src={ldsrc}
                          style={{ height: 300, width: 300 }}
                          aspectRatio={1}
                        />
                      </Dialog>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoLxr' })}：`} {...formItemLayout} >
                        <Input
                          name="ptinfoLxr"
                          maxLength={20}
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoLxr' })}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoTel' })}：`} {...formItemLayout} >
                        <Input
                          name="ptinfoTel"
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoTel' })}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </IcePanel.Body>
            </IcePanel>
            <IcePanel style={{ marginBottom: '10px' }}>
              <IcePanel.Header style={{ lineHeight: '10px' }}>
                {formatMessage({ id: 'e9.sys.ptinfo.psw.title' })}
              </IcePanel.Header>
              <IcePanel.Body>
                <Row>
                  <Col span={24}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPwrule' })}：`}>
                        <Select
                          name="ptinfoPwrule"
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPwrule' })}
                          style={{ maxWidth: '80%', minWidth: '50%' }}
                        >
                          <Select.Option value="0">{formatMessage({ id: 'e9.sys.ptinfo.r.rule.num' })}</Select.Option>
                          <Select.Option value="1">{formatMessage({ id: 'e9.sys.ptinfo.r.rule.letter' })}</Select.Option>
                          <Select.Option value="2">{formatMessage({ id: 'e9.sys.ptinfo.r.rule.ltrnum' })}</Select.Option>
                          <Select.Option value="3">{formatMessage({ id: 'e9.sys.ptinfo.r.rule.ltr2num' })}</Select.Option>
                          <Select.Option value="4">{formatMessage({ id: 'e9.sys.ptinfo.r.rule.ltrnumchar' })}</Select.Option>
                        </Select>
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPwdiff' })}：`} >
                        <Checkbox name="pwdiff" />
                      </FormItem>
                    </Form>
                  </Col>
                  <Col span={12}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPwlen' })}：`}>
                        <NumberPicker
                          name="ptinfoPwlen"
                          max={20}
                          min={0}
                        />
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPwdays' })}：`}>
                        <NumberPicker
                          name="ptinfoPwdays"
                          max={365}
                          min={0}
                          addonTextAfter={`${formatMessage({ id: 'e9.msmunit.days' })}`}
                        />
                      </FormItem>
                    </Form>
                  </Col>
                  <Col span={12}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPwwarndays' })}：`}>
                        <NumberPicker
                          name="ptinfoPwwarndays"
                          style={{ minWidth: '50%' }}
                          max={365}
                          min={0}
                          addonTextBefore={`${formatMessage({ id: 'e9.msmunit.before' })}`}
                          addonTextAfter={`${formatMessage({ id: 'e9.msmunit.days' })}`}
                        />
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
              </IcePanel.Body>
            </IcePanel>
            <IcePanel style={{ marginBottom: '10px' }}>
              <IcePanel.Header style={{ lineHeight: '10px' }}>
                {formatMessage({ id: 'e9.sys.ptinfo.ver.title' })}
              </IcePanel.Header>
              <IcePanel.Body>
                <Row>
                  <Col span={12}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPtver' })}：`}>
                        <Input
                          name="ptinfoPtver"
                          disabled
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoPtver' })}
                        />
                      </FormItem>
                    </Form>
                  </Col>
                  <Col span={12}>
                    <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                      <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoDbver' })}：`}>
                        <Input
                          name="ptinfoDbver"
                          disabled
                          placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.ptinfoDbver' })}
                        />
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
                <Form value={PtinfoStore.record} onChange={PtinfoStore.resetRecord} {...formItemLayout}>
                  <FormItem label={`${formatMessage({ id: 'e9.sys.ptinfo.r.copyright' })}：`}>
                    <Input
                      name="copyright"
                      disabled
                      placeholder={formatMessage({ id: 'e9.sys.ptinfo.r.copyright' })}
                    />
                  </FormItem>
                </Form>
              </IcePanel.Body>
            </IcePanel>
          </div>
        </div>
      </div>
    </div >
  );
});

export default injectIntl((Ptinfo));

