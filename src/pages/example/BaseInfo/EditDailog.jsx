import React, { useState } from 'react';
import { Input, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { isMoment } from 'moment';
import EditForm from '../../../components/EditForm';
import ExampleStore from '../../../stores/example/ExampleStore';
import UploadFile from '../../../components/UploadFile';
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
        if (isMoment(values.whsj)) {
          values.whsj = values.whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        ExampleStore.saveData(values);
      }
    });
  });

  const onBeforeWfAction = async (action) => {
    console.log(action);
    // 编辑界面上只有提交按钮，所有action可以不判断
    if (ExampleStore.opt === 'add') {
      let err;
      let vs;
      await field.validate((errors, values) => {
        err = errors;
        vs = values;
        // for (let t = Date.now(); Date.now() - t <= 5000;);
        console.log('a');
      });
      console.log('b');
      console.log(vs);
      if (!err) {
        if (isMoment(vs.whsj)) {
          vs.whsj = vs.whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        await ExampleStore.saveData(vs);
      }
    }

    return true;
  };

  const onAfterWfAction = (data) => {
    ExampleStore.closeEditForm();
    ExampleStore.queryForPage();
  };

  return (
    <EditForm
      title="Example"
      visible={ExampleStore.editVisible}
      footer={false}
      onClose={() => ExampleStore.closeEditForm()}
      opt={ExampleStore.opt}
      style={{ width: '800px' }}
      extra={
        <span>
          {ExampleStore.opt !== 'add' && <WflwButtons
            style={{ marginLeft: '10px' }}
            type={['submit']}
            wfid={ExampleStore.editRecord.wfid}
            wfinst={ExampleStore.editRecord.wfinst}
            onBeforeAction={onBeforeWfAction}
            onAfterAction={onAfterWfAction}
            signcomment={ExampleStore.signcomment}
          />}
          {/* 只有 非浏览状态，并且可编辑的才有保存按钮，对于无流程的不需要ExampleStore.canWfEdit()， */}
          {(ExampleStore.opt !== 'view' && ExampleStore.canWfEdit()) &&
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
            </Button.Group>
          }
        </span >}
    >
      <Form size="small"
        value={ExampleStore.editRecord}
        onChange={ExampleStore.onRecordChange}
        saveField={(f) => {
          setField(f);
        }}
        {...formItemLayout}
      >
        {ExampleStore.ctrlWfVisile('extableName') &&
          <FormItem required label="extableName：" requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <Input
              name="extableName"
              maxLength={20}
              placeholder="extableName"
              // 在下面两种情况下可编辑 1.新增状态可编辑 2.在编辑状态下，流程中允许编辑,
              // 对于没有流程的，直接设置readOnly={ExampleStore.opt === 'view'}
              readOnly={ExampleStore.opt !== 'add' && !(ExampleStore.opt === 'edit' && ExampleStore.canWfEdit('extableName'))}
            />
          </FormItem>
        }
        {ExampleStore.ctrlWfVisile('filegrpId') &&
          <FormItem label="附件：">
            <UploadFile
              name="filegrpId"
              sysid="example"
              limit={10}
              readOnly={ExampleStore.opt !== 'add' && !(ExampleStore.opt === 'edit' && ExampleStore.canWfEdit('filegrpId'))}
            />
          </FormItem>
        }
        {ExampleStore.ctrlWfVisile('extableName2') &&
          <FormItem label="新增不可写：" requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <Input
              name="extableName2"
              maxLength={20}
              placeholder="extableName"
              // 新增不可以写,提交流程时,在步骤中设置了允许编辑才可以编辑
              readOnly={ExampleStore.opt === 'add' ||
                (ExampleStore.opt === 'edit' && !ExampleStore.canWfEdit('extableName2'))}
            />
          </FormItem>
        }
        {(ExampleStore.ctrlWfVisile('filegrpId2')) &&
          <FormItem label="附件2：">
            <UploadFile
              name="filegrpId2"
              sysid="example"
              limit={10}
              showtype="table"
              readOnly={ExampleStore.opt === 'add' ||
                (ExampleStore.opt === 'edit' && !ExampleStore.canWfEdit('filegrpId2'))}
            />
          </FormItem>
        }
        {/* <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
          <Form.Submit validate type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Form.Submit>
        </FormItem> */}
      </Form>
      {
        ExampleStore.opt !== 'add' &&
        <WflwLog
          wfinst={ExampleStore.editRecord.wfinst}
          wfid={ExampleStore.editRecord.wfid}
          readonly={false}
          value={ExampleStore.signcomment}
          onChange={v => ExampleStore.setSigncomment(v)}
        />
      }
    </EditForm >
  );
});

export default injectIntl(EditDialog);
