import React from 'react';
import {
  Input,
  DatePicker,
  Switch,
  Select,
  Message,
  Form,
  Radio,
  TreeSelect,
  Field,
} from '@alifd/next';
import { message, Modal } from 'antd';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import Store from '../../../stores/datj/HoldingGroup';
import SearchStore from '@/stores/datj/SearchStore';
import { useIntl, FormattedMessage } from 'umi';

const { Group: RadioGroup } = Radio;
const { TreeNode } = TreeSelect;
const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer((props) => {
  const field = Field.useField();
  // const {
  //   intl: { formatMessage },
  // } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;

  const { Item: FormItem } = Form;
  const handleDakid = (dakid) => {
    //选择了单位或者档案库分组时列表不渲染,使用正则判断只能选择档案库
    var regexp = new RegExp('^DAK[0-9]+');
    if(!regexp.test(dakid)){
      return  Message.warning("请不要选择档案库分组");
    };

    Store.setDakid(dakid);
  };
  const savedata = (values, errors) => {
    if (!errors) {
      const { whsj } = values;
      if (isMoment(whsj)) {
        values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
      }

      Store.saveData(values);
    }
  };

  return (
    // <EditForm
    //   title={formatMessage({ id: 'e9.etl.archiveInfo.title' })}
    //   visible={Store.editVisible}
    //   footer={false}
    //   hasMask={true}
    //   onClose={() => Store.closeEditForm()}
    //   opt={Store.opt}
    //   style={{ width: '550px' }}
    // >    </EditForm>
    <Modal
      title={`业务维护【${Store.opt === 'add' ? '新增' : '编辑'}】`}
      visible={Store.editVisible}
      onCancel={() => Store.closeEditForm()}
      footer={false}
      width={550}
      destroyOnClose={true}
    >
      <Form
        value={Store.editRecord}
        onChange={Store.onRecordChange}
        {...formItemLayout}
      >
        <FormItem required label={`编号`}>
          <Input name="code" maxLength={20} placeholder="编号" />
        </FormItem>
        <FormItem required label="名称">
          <Input name="name" maxLength={50} placeholder="名称" />
        </FormItem>

        <Form.Item label="档案库名称:">
          <TreeSelect
            {...field.init('dakid', {})}
            placeholder={formatMessage({ id: 'e9.datj.select' })}
            onChange={handleDakid}
            value={Store.dakid}
            hasClear
            name="dakid"
            dataSource={Store.dakbmclist}
            style={{ width: 300 }}
          />
        </Form.Item>
        <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
          <Form.Submit validate type="primary" onClick={savedata}>
            {formatMessage({ id: 'e9.btn.save' })}
          </Form.Submit>
        </FormItem>
      </Form>
    </Modal>
  );
});

export default EditDialog;
