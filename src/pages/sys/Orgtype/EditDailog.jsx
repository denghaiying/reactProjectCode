import React from "react";
import { Input, DatePicker, Switch, Select, Message, Form,Radio } from "@alifd/next";
import { injectIntl } from "react-intl";
import { isMoment } from "moment";
import { observer } from "mobx-react";
import EditForm from "../../../components/EditForm";
import Store from "../../../stores/system/OrgtypeStore";
const {Group: RadioGroup} = Radio;

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const { Item: FormItem } = Form;

  const savedata = (values, errors) => {
    if (!errors) {
      const { whsj } = values;
      if (isMoment(whsj)) {
        values.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
      }

      Store.saveData(values);
    }
  };

  return (
    <EditForm
      title={formatMessage({ id: "e9.etl.archiveInfo.title" })}
      visible={Store.editVisible}
      footer={false}
      hasMask={true}
      onClose={() => Store.closeEditForm()}
      opt={Store.opt}
      style={{ width: "550px" }}
    >
      <Form
        value={Store.editRecord}
        onChange={Store.onRecordChange}
        {...formItemLayout}
      >
        <FormItem
          required
          label={`编号`}
        >
          <Input
            name="code"
            maxLength={20}
            placeholder="编号"
          />
        </FormItem>
        <FormItem
          required
          label="名称"
        >
          <Input
            name="name"
            maxLength={50}
            placeholder="名称"
          />
        </FormItem>

        <FormItem label={`${formatMessage({ id: "e9.pub.whr" })}：`}>
          <Input
            name="whr"
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: "e9.pub.whr" })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: "e9.pub.whsj" })}：`}>
          <DatePicker
            name="whsj"
            style={{ width: "100%" }}
            showTime
            disabled
            placeholder={formatMessage({ id: "e9.pub.whsj" })}
          />
        </FormItem>
        <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
          <Form.Submit validate type="primary" onClick={savedata}>
            {formatMessage({ id: "e9.btn.save" })}
          </Form.Submit>
        </FormItem>
      </Form>
    </EditForm>
  );
});

export default injectIntl(EditDialog);
