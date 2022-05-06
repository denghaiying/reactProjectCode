import React, {useEffect, useState} from "react";
import {Input, DatePicker, Switch, Select, Message, Form, Checkbox,Radio, Grid,Button } from "@alifd/next";
import { injectIntl } from "react-intl";
import { isMoment } from "moment";
import { observer } from "mobx-react";
import EditForm from "../../../components/EditForm";
import Store from "../../../stores/system/YhStore";
const {Group: RadioGroup} = Radio;
const { Row, Col } = Grid;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    fixedSpan: 4,
  },
  // wrapperCol: {
  //   span: 14,
  // },
};
const EditDailog = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const { Item: FormItem } = Form;

/*  useEffect(() => {

    Store.queryOrg(Store.editRecord.dwid);

  }, []);*/


  const savedata = (values, errors) => {
    if (!errors) {
      const { whsj } = values;
      if (isMoment(whsj)) {
        values.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
      }

      Store.saveData(values);
    }
  };

  const [switchState, setSwitchState]= useState(Store.selectedRow.ty)
  const onChange = (value) => {
    setSwitchState(value)
  }
  const close=()=>{
    Store.editVisible = false;
  }

  return (
      <EditForm
          title={formatMessage({ id: "用户管理" })}
          visible={Store.editVisible}
          footer={false}
          hasMask={true}
          onClose={() => Store.closeEditForm()}
          opt={Store.opt}
          style={{ width: "650px" }}
          responsive
      >
        <Form
            value={Store.editRecord} inline
            label
            fullWidth={true}
            onChange={Store.onRecordChange}
            {...formItemLayout} >

          <FormItem label="单位" labelWidth={205}  required>
           {/* <Input id="dwmc" name="dwmc" style={{width: 200}} disabled/>*/}
            <Select tagInline name="dwid"  defaultValue={Store.dwid.id}
                    placeholder="单位" hasClear  disabled={Store.dwstatus}
                    dataSource={Store.dwDataSource} style={{width: 200}}/>
          </FormItem>

          <FormItem
              required
              label="登录号"  labelWidth={205}
          >
            <Input
                name="bh"
                placeholder="登录号"
                style={{width: 200}}
            />
          </FormItem>
          <FormItem
              required
              label="用户名"  labelWidth={205}
          >
            <Input name="yhmc" placeholder="用户名称" style={{width: 200}}
            />
          </FormItem>

          <FormItem label="性别"
                    labelWidth={205}>
            <Select name="xb" style={{width: 200}}>
              <option value="1">男</option>
              <option value="2">女</option>
            </Select>
          </FormItem>
          <FormItem label="任职部门" required
                    labelWidth={205}>
          {/*  <Input id="bmid" name="bmid" style={{width: 200}}/>*/}
            <Select tagInline name="bmid"  placeholder="任职部门" hasClear  dataSource={Store.orgDataSource} style={{width: 200}}/>
          </FormItem>

          <FormItem label="用户类型" required labelWidth={205}>
            <Select tagInline name="lx"  placeholder="用户类型" hasClear  dataSource={Store.lxDataSource} style={{width: 200}}/>
          </FormItem>
          <FormItem label="岗位"  labelWidth={205}>
            <Select tagInline name="gw"  placeholder="用户岗位" hasClear  dataSource={Store.gwDataSource} style={{width: 200}}/>

          </FormItem>
          <FormItem label="电子邮件"  labelWidth={205}>
            <Input name="mail"  placeholder="电子邮件" style={{width: 200}}/>
          </FormItem>
          <FormItem label="QQ号"  labelWidth={205}>
            <Input name="qq"  placeholder="QQ号" style={{width: 200}}/>
          </FormItem>
          <FormItem label="手机号码"  labelWidth={205}>
            <Input name="sjh"  placeholder="手机号码:" style={{width: 200}}/>
          </FormItem>
          <FormItem label="固定电话"  labelWidth={205}>
            <Input name="dh"  placeholder="固定电话" style={{width: 200}}/>
          </FormItem>


          <FormItem label="部职别"  labelWidth={205}>
            <Input name="bzb"  placeholder="部职别" style={{width: 200}}/>
          </FormItem>
          <FormItem label="停用日期"  labelWidth={205}>
            <DatePicker  name="tyrq"
                         placeholder="停用日期" style={{width: 200}}/>
          </FormItem>
          <FormItem label="用户密级"  labelWidth={205}>
            <Select tagInline name="yhmj"  placeholder="用户密级" hasClear  dataSource={Store.mjDataSource} style={{width: 200}}/>
          </FormItem>

          <FormItem label="用户职级"  labelWidth={205}>
            <Select tagInline name="yhzj"   placeholder="用户职级" hasClear  dataSource={Store.zjDataSource} style={{width: 200}}/>
          </FormItem>
          <FormItem label="停用"  labelWidth={205}>
            {/*<Switch  name="ty" checkedChildren="停用"  unCheckedChildren="启用" checked={switchState} onChange={onChange}/>*/}

             {/*<Checkbox id="ty" name="ty"  style={{width: 200}} defaultChecked={Store.selectedRow.ty}></Checkbox>*/}

            <Select name="ty" style={{width: 200}} defaultValue="N">
              <option value="N">启用</option>
              <option value="Y">停用</option>
            </Select>
          </FormItem>

          <FormItem label={`${formatMessage({ id: "e9.pub.whr" })}：`} >
            <Input
                name="whr"
                disabled style={{width: 200}}
                placeholder={formatMessage({ id: "e9.pub.whr" })}
            />
          </FormItem>
          <FormItem label={`${formatMessage({ id: "e9.pub.whsj" })}：`}>
            <DatePicker
                name="whsj"
                style={{width: 200}}
                showTime
                disabled
                placeholder={formatMessage({ id: "e9.pub.whsj" })}
            />
          </FormItem>
          <Row>
            <Col style={{width: 400}}></Col>
            <Col style={{textAlign:"right",width: 300}}  >
              { Store.opt=="look"?
                  <FormItem  >
                    <Button type="primary" onClick={close} style={{ marginRight: '5px' }}>关闭</Button>
                  </FormItem>
                  :
                  <FormItem  >
                    <Form.Submit validate type="primary"  onClick={savedata}  style={{ marginRight: '5px' }}>
                      {formatMessage({ id: "e9.btn.save" })}</Form.Submit>
                  </FormItem>
              }

             {/* <FormItem  >
                <Form.Submit validate type="primary"  onClick={savedata}  style={{ marginRight: '5px' }}>
                  {formatMessage({ id: "e9.btn.save" })}</Form.Submit>
              </FormItem>*/}

             {/* <FormItem>
                <Form.Reset >{formatMessage({ id: "e9.btn.rest" })}</Form.Reset>
              </FormItem>*/}
            </Col>
          </Row>
        </Form>
      </EditForm>
  );
});

export default injectIntl(EditDailog);
