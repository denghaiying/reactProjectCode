/* eslint-disable comma-dangle */
/**
 * @author caijc
 * 编辑界面
 */
import React, {Component} from "react";
import {Form, Field, Input, Switch, DatePicker, Radio} from "@alifd/next";
import {FormattedMessage, injectIntl} from "react-intl";

import EditForm from "../../../components/EditForm";

const {Group: RadioGroup} = Radio;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        fixedSpan: 6
    },
    wrapperCol: {
        span: 18
    }
};
/**
 * @param {*} props react props参数
 */

@injectIntl
export default class ArchiveInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.editField = new Field(this);
    }

    componentWillReceiveProps(o) {
        console.log(o);
        if (o.editFieldValues) {
            this.editField.setValues(o.editFieldValues);
        }
    }

    render() {
        const {
            intl: {formatMessage},
            visible,
            setVisible,
            opt,
            onSaveDataAction,
            editFieldValues
        } = this.props;

        return (
            <EditForm
                style={{width: "500px"}}
                title={formatMessage({id: "e9.etl.archiveInfo.title"})}
                visible={visible}
                opt="add"
                footer={
                    <Form.Submit
                        validate
                        type="primary"
                        onClick={onSaveDataAction}
                        field={this.editField}
                    >
                        <FormattedMessage id="e9.btn.save"/>
                    </Form.Submit>
                }
                onClose={() => {
                    setVisible(false);
                }}
            >
                <Form
                    style={{width: "80%"}}
                    labelAlign="left"
                    opt={opt}
                    labelTextAlign="right"
                    {...formItemLayout}
                    field={this.editField}
                >
                    <FormItem
                        required
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoCode"
                        })}：`}
                    >
                        <Input
                            name="archiveinfoCode"
                            maxLength={20}
                            placeholder={formatMessage({
                                id: "e9.etl.archiveInfo.archiveinfoCode"
                            })}
                        />
                    </FormItem>
                    <FormItem
                        required
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoName"
                        })}：`}
                    >
                        <Input
                            name="archiveinfoName"
                            maxLength={50}
                            placeholder={formatMessage({
                                id: "e9.etl.archiveInfo.archiveinfoName"
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoUsing"
                        })}：`}
                    >
                        <Switch name="archiveinfoUsing"/>
                    </FormItem>
                    <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoComments"
                        })}：`}
                    >
                        <Input
                            name="archiveinfoComments"
                            maxLength={20}
                            placeholder={formatMessage({
                                id: "e9.etl.archiveInfo.archiveinfoComments"
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoType"
                        })}：`}
                    >
                        <RadioGroup name="archiveinfoType">
                            <Radio value="post">post</Radio>
                            <Radio value="webservice">webservice</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label={`${formatMessage({id: "e9.pub.whsj"})}：`}>
                        <DatePicker
                            name="whsj"
                            showTime
                            disabled
                            placeholder={formatMessage({id: "e9.pub.whsj"})}
                        />
                    </FormItem>
                </Form>
            </EditForm>
        );
    }
}
