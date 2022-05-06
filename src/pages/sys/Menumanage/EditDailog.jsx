import React, { useState } from 'react';
import { Select, Input, Form, Button, Icon } from '@alifd/next';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import EditForm from '../../../components/EditForm';
import MenuStore from '../../../stores/user/MenuStore';
import SysStore from '../../../stores/system/SysStore';

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
  /**
   * 右键添加菜单与编辑菜单,将数据保存在tree中,并非提交数据库中
   */
  const addData = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        MenuStore.addTreeData(MenuStore.editRecord);
      }
    });
  });
  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.menu.titlegl' })}
      visible={MenuStore.editVisible}
      footer={false}
      onClose={() => MenuStore.closeEditForm()}
      // onOk={() => adddata}
      opt={MenuStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={addData}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={MenuStore.editRecord}
        onChange={MenuStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.sys.menu.con.sysName' })}：`}>
          <Select name="sysId" style={{ width: '100%' }} placeholder={formatMessage({ id: 'e9.sys.menu.con.sysName' })} disabled>
            {SysStore.normallist.map(item => <Select.Option value={item.id} key={item.id}>{item.systemName}</Select.Option>)}
          </Select>
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.menu.menuName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="menuName"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.menu.menuName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.menu.menuEname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="menuEname"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.menu.menuEname' })}
          />
        </FormItem>
        {/* <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
          <Form.Submit validate type="primary" onClick={addData}>{formatMessage({ id: 'e9.btn.save' })}</Form.Submit>
        </FormItem> */}
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);
