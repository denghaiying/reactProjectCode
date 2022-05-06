import React, { useState } from 'react';
import { Input, DatePicker, Switch, Select, Message, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import YjspStore from './ApplyStore';
import { WflwButtons, WflwLog } from '../../../components/Wflw';
import { useIntl } from 'umi';
const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer(props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);

  const savedata = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { date } = values;
        if (isMoment(date)) {
          values.date = whsj.format('YYYY-MM-DD HH:mm:ss');
        }

        YjspStore.saveData(values);
        props.doEditOk();
      }
    });
  });

  const onBeforeWfAction = async (action) => {
    // 编辑界面上只有提交按钮，所有action可以不判断
    if (YjspStore.opt === 'add') {
      let err;
      let vs;
      await field.validate((errors, values) => {
        err = errors;
        vs = values;
        // for (let t = Date.now(); Date.now() - t <= 5000;);
      });
      if (!err) {
        if (isMoment(vs.date)) {
          vs.date = vs.date.format('YYYY-MM-DD HH:mm:ss');
        }
        await YjspStore.saveData(vs);
      }
    }

    return true;
  };

  const onAfterWfAction = (data) => {
    YjspStore.closeEditForm();
    YjspStore.queryForPage();

  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.dagl.yjsp.title' })}
      visible={YjspStore.editVisible}
      footer={false}
      onClose={() => YjspStore.closeEditForm()}
      opt={YjspStore.opt}
      style={{ width: '800px' }}
      extra={
        <span>
          {YjspStore.opt !== 'add' && <WflwButtons
            style={{ marginLeft: '10px' }}
            type={['submit']}
            wfid={YjspStore.editRecord.wfid}
            wfinst={YjspStore.editRecord.wfinst}
            onBeforeAction={onBeforeWfAction}
            onAfterAction={onAfterWfAction}
            signcomment={YjspStore.signcomment}
          />}
          {YjspStore.opt !== 'view' &&
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
            </Button.Group>
          }
        </span >}
    >
      <Form
        value={YjspStore.editRecord}
        onChange={YjspStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.yjsp.yjtitle' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="title"
            width={200}
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.yjtitle' })}
            readOnly={YjspStore.opt !== 'add' && !(YjspStore.opt === 'edit' && YjspStore.canWfEdit('title'))}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.yjsp.year' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="year"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.year' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.yjsp.month' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="month"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.month' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.dagl.yjsp.date' })}：`} required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="date"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.date' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.dagl.yjsp.remark' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="remark"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.remark' })}
            readOnly={YjspStore.opt !== 'add' && !(YjspStore.opt === 'edit' && YjspStore.canWfEdit('remark'))}
          />
        </FormItem>
      </Form>
      {
        YjspStore.opt !== 'add' &&
        <WflwLog
          wfinst={YjspStore.editRecord.wfinst}
          wfid={YjspStore.editRecord.wfid}
          readonly={false}
          value={YjspStore.signcomment}
          onChange={v => YjspStore.setSigncomment(v)}
        />
      }
    </EditForm >
  );
});

export default EditDialog;
