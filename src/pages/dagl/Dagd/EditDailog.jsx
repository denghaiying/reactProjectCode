import React, { useState } from 'react';
import { Input, DatePicker, Switch, Select, Message, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import DagdStore from '../../../stores/dagl/DagdStore';
import { WflwButtons, WflwLog } from '../../../components/Wflw';

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

        DagdStore.saveData(values);
      }
    });
  });

  const onBeforeWfAction = async (action) => {
    // 编辑界面上只有提交按钮，所有action可以不判断
    if (DagdStore.opt === 'add') {
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
        await DagdStore.saveData(vs);
      }
    }

    return true;
  };

  const onAfterWfAction = (data) => {
    DagdStore.closeEditForm();
    DagdStore.queryForPage();
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.dagl.dagd.title' })}
      visible={DagdStore.editVisible}
      footer={false}
      onClose={() => DagdStore.closeEditForm()}
      opt={DagdStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          {DagdStore.opt !== 'add' && <WflwButtons
            style={{ marginLeft: '10px' }}
            type={['submit']}
            wfid={DagdStore.editRecord.wfid}
            wfinst={DagdStore.editRecord.wfinst}
            onBeforeAction={onBeforeWfAction}
            onAfterAction={onAfterWfAction}
            signcomment={DagdStore.signcomment}
          />}
          {DagdStore.opt !== 'view' &&
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
            </Button.Group>
          }
        </span >}
    >
      <Form
        value={DagdStore.editRecord}
        onChange={DagdStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.dagd.gdtitle' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="title"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.dagl.dagd.gdtitle' })}
            readOnly={DagdStore.opt !== 'add' && !(DagdStore.opt === 'edit' && DagdStore.canWfEdit('title'))}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.dagd.year' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="year"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.dagd.year' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.dagl.dagd.month' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="month"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.dagd.month' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.dagl.dagd.date' })}：`} required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="date"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.dagd.date' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.dagl.dagd.remark' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="remark"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.dagl.dagd.remark' })}
            readOnly={DagdStore.opt !== 'add' && !(DagdStore.opt === 'edit' && DagdStore.canWfEdit('remark'))}
          />
        </FormItem>
      </Form>
      {
        DagdStore.opt !== 'add' &&
        <WflwLog
          wfinst={DagdStore.editRecord.wfinst}
          wfid={DagdStore.editRecord.wfid}
          readonly={false}
          value={DagdStore.signcomment}
          onChange={v => DagdStore.setSigncomment(v)}
        />
      }
    </EditForm >
  );
});

export default injectIntl(EditDialog);
