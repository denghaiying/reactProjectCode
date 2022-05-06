import React from "react";
import {
  Button,
  Input,
  DatePicker,
  NumberPicker,
  Form,
  Step,
  Field,
  Card,
  Box,
  Icon,
  Typography
} from "@alifd/next";
import { injectIntl } from "react-intl";
import moment, { isMoment } from "moment";
import { observer } from "mobx-react";

import EditForm from "../../../components/EditForm";
import FrontIntStore from "../../../stores/etl/FrontIntStore";
import ReturnField from "./ReturnField";

const formItemLayout = {
  labelCol: {
    fixedSpan: 6
  },
  wrapperCol: {
    span: 14
  }
};



const EditDialog = observer(props => {
  const {
    intl: { formatMessage }
  } = props;
  const { Item: FormItem } = Form;
  const { currentStep, setStep, setStepValues, onSubmit } = FrontIntStore;
  const steps = [
    "基本信息",
    "返回参数",
    "查询参数",
    "成"
  ].map((item, index) => (
    <Step.Item
      aria-current={index === FrontIntStore.currentStep ? "step" : null}
      key={index}
      title={item}
    />
  ));
  const goNext = (values, errors) => {
    /*   const { errors } = await projectField.validatePromise();

    if (errors) {
      console.log('errors', errors);
      return;
    }
    */
    if (!errors) {
      setStepValues(values);
      setStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    setStep(currentStep - 1);
  };

  const submit = (values, errors) => {
    /* const values = projectField.getValues();
    console.log('values:', values);
    onSubmit(values);
 */
    if (!errors) { 
      values.whsj = moment().format("YYYY-MM-DD HH:mm:ss");
      setStepValues();
      onSubmit();
    }
  };

  let actions;
  let mainbody;

  switch (currentStep) {
    case 0:
      actions = (
        <Form.Submit validate type="primary" onClick={goNext} validate>
          下一步
        </Form.Submit>
      );
      break;
    case 1:
      actions = (
        <>
          <Button onClick={goPrev} style={{ marginRight: "5px" }}>
            上一步
          </Button>
          <Form.Submit type="primary" onClick={goNext} validate>
            下一步
          </Form.Submit>
        </>
      );
      mainbody = (
        <>
          <Box align="center">
            <ReturnField key={"field"} stepType={"field"} />
          </Box>

          <Button size="small" onClick={goPrev} style={{ marginRight: "5px" }}>
            上一步
          </Button>
          <Form.Submit size="small" type="primary" onClick={goNext} validate>
            下一步
          </Form.Submit>
        </>
      );

      break;
    case 2:
      actions = (
        <>
          <Button onClick={goPrev} style={{ marginRight: "5px" }}>
            上一步
          </Button>
          <Form.Submit type="primary" onClick={goNext} validate>
            下一步
          </Form.Submit>
        </>
      );
      mainbody = (
        <>
          <Box align="center">
            <ReturnField key={"search"} stepType={"search"} />
          </Box>

          <Button size="small" onClick={goPrev} style={{ marginRight: "5px" }}>
            上一步
          </Button>
          <Form.Submit size="small" type="primary" onClick={goNext} validate>
            下一步
          </Form.Submit>
        </>
      );
      break;
    case 3:
      mainbody = (
        <>
          <Box align="center">
            <Icon type="success-filling" size={72} />
            <Typography.H1>提交?</Typography.H1>
            <Box margin={20} direction="row">
              <Button
               
                style={{ marginRight: "5px" }}
                onClick={goPrev}
              >
                上一步
              </Button>
              <Button  type="primary" onClick={submit}>提交</Button>
            </Box>
          </Box>
        </>
      );
      break;
    default:
      break;
  }

  if (!mainbody) {
    mainbody = (
      <>
        <Form
          size="small"
          value={FrontIntStore.editRecord}
          onChange={FrontIntStore.onRecordChange}
          {...formItemLayout}
        >
          <FormItem
            required
            label={`${formatMessage({ id: "e9.etl.frontinf.code" })}：`}
          >
            <Input
              size="small"
              maxLength={50}
              name="code"
              placeholder={formatMessage({ id: "e9.etl.frontinf.code" })}
            />
          </FormItem>
          <FormItem
            required
            label={`${formatMessage({ id: "e9.etl.frontinf.name" })}：`}
          >
            <Input
              size="small"
              maxLength={50}
              name="name"
              placeholder={formatMessage({ id: "e9.etl.frontinf.name" })}
            />
          </FormItem>
          <FormItem
            required
            label={`${formatMessage({ id: "e9.etl.frontinf.tb" })}：`}
            name="tb"
          >
            <Input
              size="small"
              maxLength={50}
              name="tb"
              placeholder={formatMessage({ id: "e9.etl.frontinf.tb" })}
            />
          </FormItem>
          <FormItem  label={`${formatMessage({ id: 'e9.etl.frontinf.page' })}：`} name="page">
          <NumberPicker type="inline" size="small"
            defaultValue={1}
            name="page"
            maxLength={50} 
           
          />
        </FormItem>
        <FormItem  label={`${formatMessage({ id: 'e9.etl.frontinf.size' })}：`} name="size">
          <NumberPicker type="inline" size="small"
            maxLength={50} 
            name="size"
            defaultValue={10}
          />
        </FormItem>
          <Form.Item colSpan={12}>{actions}</Form.Item>
        </Form>
      </>
    );
  }

  return (
    <EditForm
      title={formatMessage({ id: "e9.etl.frontinf.title" })}
      visible={FrontIntStore.editVisible}
      footer={false}
      onClose={() => FrontIntStore.closeEditForm()}
      opt={FrontIntStore.opt}
      style={{ width: 700 }}
    >
      {/*      'e9.etl.frontinf.id': '编号',
  'e9.etl.frontinf.title': '前置接口',
  'e9.etl.frontinf.tb': '表名',
  'e9.etl.frontinf.search': '查询字段',
  'e9.etl.frontinf.page': '页数',
  'e9.etl.frontinf.size': '每页大小',
  'e9.etl.frontinf.sqlwhere': '条件字段',
  'e9.etl.frontinf.sqlorder': '排序字段' */}
      <Card free>
        <Card.Content>
          <Step
            style={{ margin: "40px auto 24px" }}
            current={currentStep}
            shape="circle"
          >
            {steps}
          </Step>
          {mainbody}
        </Card.Content>
      </Card>
    </EditForm>
  );
});

export default injectIntl(EditDialog);
