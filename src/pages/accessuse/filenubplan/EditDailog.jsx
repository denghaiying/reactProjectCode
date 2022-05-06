import React from "react";
import {DatePicker, Form, Input, Radio, Select} from "@alifd/next";
import {injectIntl} from "react-intl";
import {isMoment} from "moment";
import {observer} from "mobx-react";
import EditForm from "../../../components/EditForm";
import Store from "../../../stores/accessuse/FilenubplanStore";
const { Option } = Select;
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
        intl: {formatMessage},
    } = props;
    const {Item: FormItem} = Form;

    const savedata = (values, errors) => {
        if (!errors) {
            const {whsj} = values;
            if (isMoment(whsj)) {
                values.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
            }

            Store.saveData(values);
        }
    };
    const onChange = (e) => {
      Store.findZlx(e);
    }
    return (
        <EditForm
            title={formatMessage({id: "e9.etl.archiveInfo.title"})}
            visible={Store.editVisible}
            footer={false}
            hasMask={true}
            onClose={() => Store.closeEditForm()}
            opt={Store.opt}
            style={{width: "550px"}}
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

                <FormItem label="模板">
                    <Select name="mbid" style={{width: "100%"}} onChange={onChange}>
                        <Select.Option value=" " key="k0" rereadOnly={true}> </Select.Option>
                        {Store.mblist.map(item => <Select.Option value={item.id}
                                                                 key={item.id}>{item.mc}</Select.Option>)}
                    </Select>
                </FormItem>
                <FormItem label="著录项">
                    <Select name="field" style={{width: "100%"}}>
                        <Select.Option value=" " key="k0" rereadOnly={true}> </Select.Option>
                        {Store.mbzlxlist.map(item => <Select.Option value={item.id}
                                                                 key={item.id}>{item.ms}</Select.Option>)}
                    </Select>
                </FormItem>
                <FormItem label="方式">
                    <Select name="way" defaultValue="01" style={{width: "100%"}}>
                        <Option value="01">等于</Option>
                        <Option value="02">不等于</Option>
                        <Option value="03">大于</Option>
                        <Option value="04">大于等于</Option>
                        <Option value="05">小于</Option>
                        <Option value="06">小于等于</Option>
                        <Option value="07">为空</Option>
                        <Option value="08">不为空</Option>
                    </Select>
                </FormItem>
                <FormItem label="值">
                    <Input
                        name="value"
                        maxLength={50}
                        placeholder="值"
                    />
                </FormItem>
                <FormItem label={`${formatMessage({id: "e9.pub.whsj"})}：`}>
                    <DatePicker
                        name="whsj"
                        style={{width: "100%"}}
                        showTime
                        disabled
                        placeholder={formatMessage({id: "e9.pub.whsj"})}
                    />
                </FormItem>

                <FormItem wrapperCol={{offset: 20}} style={{marginTop: 24}}>
                    <Form.Submit validate type="primary" onClick={savedata}>
                        {formatMessage({id: "e9.btn.save"})}
                    </Form.Submit>
                </FormItem>
            </Form>
        </EditForm>
    );
});

export default injectIntl(EditDialog);
