import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Input, Select, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import EditForm from '../../../components/EditForm';
import FuncStore from '../../../stores/system/FuncStore';

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
        FuncStore.saveData(values);
      }
    });
  });
  // 弹框中根据系统筛选模块的数据
  const onRecordChange = (value) => {
    FuncStore.findModuleAll(value);
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.func.title' })}
      visible={FuncStore.editVisible}
      footer={false}
      onClose={() => FuncStore.closeEditForm()}
      opt={FuncStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={FuncStore.editRecord}
        onChange={FuncStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.sys.func.funcName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="funcName"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.func.funcName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.func.funcEname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="funcEname"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.func.funcEname' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.func.sysId' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="systemName"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.func.sysId' })}
            onChange={onRecordChange}
            dataSource={FuncStore.sysSelect}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.func.moduleId' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="moduleId"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.func.moduleId' })}
            dataSource={FuncStore.moduleSelect}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.func.funcType' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select name="funcType" style={{ width: '100%' }} placeholder={formatMessage({ id: 'e9.sys.func.funcType' })}>
            {Object.entries(FuncStore.funcType).map(([key, value]) => (<Select.Option value={key}>{value}</Select.Option>))}
          </Select>
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.func.funcUrl' })}：`} >
          <Input
            name="funcUrl"
            maxLength={200}
            placeholder={formatMessage({ id: 'e9.sys.func.funcUrl' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.func.funcIndex' })}：`} >
          <Input
            name="funcIndex"
            placeholder={formatMessage({ id: 'e9.sys.func.funcIndex' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);
