import React, { useState } from 'react';
import {
  Input,
  DatePicker,
  Switch,
  Select,
  Message,
  Form,
  Button,
  Icon,
} from '@alifd/next';

import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '@/components/EditForm';
import { WflwButtons, WflwLog } from '@/components/Wflw';
import { useIntl } from 'umi';
const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer((props) => {
  const applyStore = props.ApplyStore;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);

  const savedata = () => {
    field.validate((errors, values) => {
      if (!errors) {
        const { date } = values;
        if (isMoment(date)) {
          values.date = whsj.format('YYYY-MM-DD HH:mm:ss');
        }

        applyStore.saveData(values);
      }
    });
  };

  const onBeforeWfAction = async (action) => {
    // 编辑界面上只有提交按钮，所有action可以不判断
    if (applyStore.opt === 'add') {
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
        await applyStore.saveData(vs);
      }
    }

    return true;
  };

  const onAfterWfAction = (data) => {
    applyStore.closeEditForm();
    applyStore.queryForPage();
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.dagl.yjsp.title' })}
      visible={applyStore.editVisible}
      footer={false}
      onClose={() => applyStore.closeEditForm()}
      opt={applyStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          {applyStore.opt !== 'add' && (
            <WflwButtons
              style={{ marginLeft: '10px' }}
              type={['submit']}
              wfid={applyStore.editRecord.wfid}
              wfinst={applyStore.editRecord.wfinst}
              onBeforeAction={onBeforeWfAction}
              onAfterAction={onAfterWfAction}
              signcomment={applyStore.signcomment}
            />
          )}
          {applyStore.opt !== 'view' && (
            <Button.Group style={{ marginLeft: '10px' }}>
              <Button type="primary" onClick={savedata}>
                <Icon className="iconfont iconsave" />
                {formatMessage({ id: 'e9.btn.save' })}
              </Button>
            </Button.Group>
          )}
        </span>
      }
    >
      <Form
        value={applyStore.editRecord}
        onChange={applyStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem
          required
          label={`${formatMessage({ id: 'e9.dagl.yjsp.yjtitle' })}：`}
          requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
        >
          <Input
            name="title"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.yjtitle' })}
            readOnly={
              applyStore.opt !== 'add' &&
              !(applyStore.opt === 'edit' && applyStore.canWfEdit('title'))
            }
          />
        </FormItem>
        <FormItem
          required
          label={`${formatMessage({ id: 'e9.dagl.yjsp.year' })}：`}
          requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
        >
          <Input
            name="year"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.year' })}
          />
        </FormItem>
        <FormItem
          required
          label={`${formatMessage({ id: 'e9.dagl.yjsp.month' })}：`}
          requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
        >
          <Input
            name="month"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.month' })}
          />
        </FormItem>
        <FormItem
          label={`${formatMessage({ id: 'e9.dagl.yjsp.date' })}：`}
          required
          requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
        >
          <Input
            name="date"
            disabled
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.date' })}
          />
        </FormItem>
        <FormItem
          label={`${formatMessage({ id: 'e9.dagl.yjsp.remark' })}：`}
          requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}
        >
          <Input
            name="remark"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.dagl.yjsp.remark' })}
            readOnly={
              applyStore.opt !== 'add' &&
              !(applyStore.opt === 'edit' && applyStore.canWfEdit('remark'))
            }
          />
        </FormItem>
      </Form>
      {applyStore.opt !== 'add' && (
        <WflwLog
          wfinst={applyStore.editRecord.wfinst}
          wfid={applyStore.editRecord.wfid}
          readonly={false}
          value={applyStore.signcomment}
          onChange={(v) => applyStore.setSigncomment(v)}
        />
      )}
    </EditForm>
  );
});

export default EditDialog;
