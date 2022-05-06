import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Input, Select, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import EditForm from '../../../components/EditForm';
import ModuleStore from '../../../stores/system/ModuleStore';

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
        ModuleStore.saveData(values);
      }
    });
  });
  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.module.title' })}
      visible={ModuleStore.editVisible}
      footer={false}
      onClose={() => ModuleStore.closeEditForm()}
      opt={ModuleStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={ModuleStore.editRecord}
        onChange={ModuleStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.sys.module.moduleName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="moduleName"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.module.moduleName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.module.moduleEname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="moduleEname"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.module.moduleEname' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.module.sysId' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="sysId"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.module.sysId' })}
          >
            {ModuleStore.sysList.map(item => (
              <Select.Option key={item.id} value={item.id}>{item.systemName}</Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.module.moduleType' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select name="moduleType" style={{ width: '100%' }} placeholder={formatMessage({ id: 'e9.sys.module.moduleType' })}>
            {Object.entries(ModuleStore.moduleType).map(([key, value]) => (<Select.Option value={key}>{value}</Select.Option>))}
          </Select>
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.module.moduleUrl' })}：`} >
          <Input
            name="moduleUrl"
            maxLength={200}
            placeholder={formatMessage({ id: 'e9.sys.module.moduleUrl' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.module.moduleIndex' })}：`} >
          <Input
            name="moduleIndex"
            placeholder={formatMessage({ id: 'e9.sys.module.moduleIndex' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);
