import React, { useEffect, useState } from 'react';
import { Card, Input, Select, Checkbox, Form } from 'antd';
import { useIntl } from 'umi';
import { observer } from 'mobx-react';
import WfsrvStore from '../../../../stores/workflow/WfsrvStore';
import WfdefStore from '../../../../stores/workflow/WfdefStore';


const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const DefForm = observer(() => {
  const { formatMessage } = useIntl();
  const { Item: FormItem } = Form;
  const [field] = Form.useForm();
  const [inChanging, setInChanging] = useState(false);

  const onchange = (() => {

    field
      .validateFields()
      .then(values => {
        const data = { ...WfdefStore.defData.def };
        Object.entries(values).forEach(([k, v]) => { data[k] = v || '' });
        setInChanging(true);
        WfdefStore.defDataChange(data).then(() => { setInChanging(false) });
      });
  });

  useEffect(() => {
    if (!inChanging) { field.resetFields(); }
  }, [WfdefStore.defData.def]);

  return (
    <Card title={formatMessage({ id: 'e9.wflw.wfdef.title' })} >
      {/* value={props.propsAPI.currentPage.get('data').def} onChange={onchange} */}
      <Form
        colon={false}
        initialValues={WfdefStore.defData.def}
        onChange={onchange}
        style={{ width: '80%' }}
        form={field}
        {...inlineFormItemLayout}
      >
        <FormItem rules={[{ required: true, message: "业务分类不允许为空" }]} label={`${formatMessage({ id: 'e9.wflw.wfdef.wfvid' })}：`} name="wfvid">
          <Select style={{ width: '100%' }}>
            {WfsrvStore.list.map(s => <Option key={s.wfvid} value={s.wfvid}>{s.name}</Option>)}
          </Select>
        </FormItem>
        <FormItem rules={[{ required: true, message: "编号不允许为空" }]} label={`${formatMessage({ id: 'e9.wflw.wfdef.wfid' })}：`} name="wfid">
          <Input maxLength={4} />
        </FormItem>
        <FormItem rules={[{ required: true, message: "名称不允许为空" }]} label={`${formatMessage({ id: 'e9.wflw.wfdef.name' })}：`} name="name">
          <Input />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfdef.wftitle' })}：`} name="wftitle">
          <Input />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfdef.synjndi' })}：`} name="synjndi">
          <Input />
        </FormItem>
        <FormItem label="被动模式：" name="bdms" valuePropName="checked">
          <Checkbox />
        </FormItem>
        <FormItem name="zxtj" label={`${formatMessage({ id: 'e9.wflw.wfdef.zxtj' })} ：`} >
          <Input.TextArea autoSize={{ minRows: 2 }} />
        </FormItem>
      </Form>
    </Card >
  );
});

export default DefForm;
