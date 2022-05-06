/* eslint-disable import/no-dynamic-require */
import React, { useState, useRef } from 'react';
import { Input, DatePicker, Select, Form, Upload, Dialog, Grid, Button, Icon } from '@alifd/next';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import Cropper from 'react-cropper';
import EditForm from '@/components/EditForm';
import PtinfoStore from '@/stores/system/PtinfoStore';
import defaultImg from '@/styles/img/sys/icon_default.png';
import defaultImgOrange from '@/styles/img/sys/icon_default_orange.png';
import '~/cropperjs/dist/cropper.css';
import SysStore from '../../../stores/system/SysStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const { Row, Col } = Grid;

const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const cropperRef = useRef(null);
  const [cpVisible, setCpVisible] = useState(false);
  const [cpsrc, setCpsrc] = useState('');
  const [field, setField] = useState(null);

  const onSelectIcon = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCpsrc(reader.result);
      setCpVisible(true);
    };
    reader.readAsDataURL(files[0]);
  };

  const saveIcon = () => {
    SysStore.setSystemIcon(cropperRef.current.getCroppedCanvas().toDataURL());
    setCpVisible(false);
  };

  const savedata = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { whsj, userQyrq, userTyrq } = values;

        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (userQyrq && isMoment(userQyrq)) {
          values.userQyrq = userQyrq.format('YYYY-MM-DD');
        }
        if (userTyrq && isMoment(userTyrq)) {
          values.userTyrq = userTyrq.format('YYYY-MM-DD');
        }
        SysStore.saveData(values);
      }
    });
  });

  const getIcon = (id, theme) => {
    if (id) {
      try {
        return require(`@/styles/img/sys/icon_${id}${theme === 'orange' && '_orange' || ''}.png`);
        // eslint-disable-next-line no-empty
      } catch (err) {
      }
    }
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.system.title' })}
      visible={SysStore.editVisible}
      footer={false}
      onClose={() => SysStore.closeEditForm()}
      opt={SysStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={SysStore.editRecord}
        onChange={SysStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.sys.system.systemName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="systemName"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.system.systemName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.system.systemEnname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="systemEnname"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.system.systemEnname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.system.systemUrl' })}：`}>
          <Input
            name="systemUrl"
            maxLength={100}
            readOnly={SysStore.editRecord.systemType !== 9}
            placeholder={formatMessage({ id: 'e9.sys.system.systemUrl' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.system.systemInfo' })}：`}>
          <Input.TextArea
            name="systemInfo"
            readOnly={SysStore.editRecord.systemType !== 9}
            maxLength={300}
            placeholder={formatMessage({ id: 'e9.sys.system.systemInfo' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.system.systemShowtype' })}：`}>
          <Select
            name="systemShowtype"
            maxLength={20}
            readOnly={SysStore.editRecord.systemType !== 9}
            placeholder={formatMessage({ id: 'e9.sys.system.systemShowtype' })}
          >
            <Select.Option value="0">{formatMessage({ id: 'e9.sys.system.showType.S0' })}</Select.Option>
            <Select.Option value="1">{formatMessage({ id: 'e9.sys.system.showType.S1' })}</Select.Option>
            <Select.Option value="2">{formatMessage({ id: 'e9.sys.system.showType.S2' })}</Select.Option>
          </Select>
        </FormItem>
        <Row>
          <Col offset={6} span={14}>
            <Upload.Selecter
              onSelect={onSelectIcon}
              accept="image/png"
              style={{ width: 60, height: 60 }}
            >
              <img style={{ width: 60, height: 60 }}
                alt={formatMessage({ id: 'e9.sys.system.systemIcon' })}
                src={SysStore.editRecord.systemIcon ||
                  (SysStore.editRecord.systemType !== 9 && getIcon(SysStore.editRecord.id, PtinfoStore.theme))
                  ||
                  (PtinfoStore.theme === 'orange' && defaultImgOrange) || defaultImg}
              />
            </Upload.Selecter>
            <Dialog
              visible={cpVisible}
              onCancel={() => setCpVisible(false)}
              onOk={() => saveIcon()}
              onClose={() => setCpVisible(false)}
              isFullScreen
            >
              <Cropper
                // viewMode={1}
                ref={cropperRef}
                src={cpsrc}
                style={{ height: 300, width: 300 }}
                aspectRatio={1}
              />
            </Dialog>
          </Col>
        </Row>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            name="whr"
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="whsj"
            style={{ width: '100%' }}
            showTime
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);
