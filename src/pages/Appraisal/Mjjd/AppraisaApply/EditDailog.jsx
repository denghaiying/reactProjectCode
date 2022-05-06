import React, { useState } from 'react';
import { Input, DatePicker, Switch, Select, Message, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '@/components/EditForm';
import DajdspStore from '@/stores/appraisa/MjjdStore';
import { WflwButtons, WflwLog } from '@/components/Wflw';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);

  const savedata = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { date } = values;
        if (isMoment(date)) {
          values.date = whsj.format('YYYY-MM-DD HH:mm:ss');
        }

        DajdspStore.saveData(values);
      }
    });
  });

  const onBeforeWfAction = async (action) => {
    // 编辑界面上只有提交按钮，所有action可以不判断
    if (DajdspStore.opt === 'add') {
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
        await DajdspStore.saveData(vs);
      }
    }

    return true;
  };

  const onAfterWfAction = (data) => {
    DajdspStore.closeEditForm();
    DajdspStore.queryForPage();
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.dagl.yjsp.title' })}
      visible={DajdspStore.editVisible}
      footer={false}
      onClose={() => DajdspStore.closeEditForm()}
      opt={DajdspStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          {DajdspStore.opt !== 'add' && <WflwButtons
            style={{ marginLeft: '10px' }}
            type={['submit']}
            wfid={DajdspStore.editRecord.wfid}
            wfinst={DajdspStore.editRecord.wfinst}
            onBeforeAction={onBeforeWfAction}
            onAfterAction={onAfterWfAction}
            signcomment={DajdspStore.signcomment}
          />}
          {DajdspStore.opt !== 'view' &&
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
            </Button.Group>
          }
        </span >}
    >
      <Form
        value={DajdspStore.editRecord}
        onChange={DajdspStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.yjsp.yjtitle' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="title"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.yjtitle' })}
            readOnly={DajdspStore.opt !== 'add' && !(DajdspStore.opt === 'edit' && DajdspStore.canWfEdit('title'))}
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
            readOnly={DajdspStore.opt !== 'add' && !(DajdspStore.opt === 'edit' && DajdspStore.canWfEdit('remark'))}
          />
        </FormItem>
      </Form>
      {
        DajdspStore.opt !== 'add' &&
        <WflwLog
          wfinst={DajdspStore.editRecord.wfinst}
          wfid={DajdspStore.editRecord.wfid}
          readonly={false}
          value={DajdspStore.signcomment}
          onChange={v => DajdspStore.setSigncomment(v)}
        />
      }
    </EditForm >
  );
});

export default injectIntl(EditDialog);
