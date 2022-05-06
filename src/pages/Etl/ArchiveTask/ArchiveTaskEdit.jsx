/* eslint-disable comma-dangle */
/**
 * @author caijc
 * 编辑界面
 */
import React, {Component} from "react";
import {
    Form,
    Field,
    Input,
    Switch,
    DatePicker,
    Radio,
    Upload
} from "@alifd/next";
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
export default class ArchiveTaskEdit extends Component {
    constructor(props) {
        super(props);
        this.editField = new Field(this);
    }

    componentWillReceiveProps(o) {
        /*if (o.editFieldValues) {
            this.editField.setValues(o.editFieldValues);
        }*/
    }

    render() {
        const {
            intl: {formatMessage},
            visible,
            setVisible,
            opt,
            onSaveDataAction,
            onUploadSuccess,
            onUploadRemove,
            onUploadError
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
                            name="archivetaskCode"
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
                            name="archivetaskName"
                            maxLength={50}
                            placeholder={formatMessage({
                                id: "e9.etl.archiveInfo.archiveinfoName"
                            })}
                        />
                    </FormItem>
                   {/* <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoUsing"
                        })}：`}
                    >
                        <Switch name="archivetaskUsing"/>
                    </FormItem>*/}

                    <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archivetaskCron"
                        })}：`}
                    >
                        <Input
                            name="archivetaskCron"
                            maxLength={20} value="* * * * * *"
                            placeholder={formatMessage({
                                id: "e9.etl.archiveInfo.archivetaskCron"
                            })}
                        />
                    </FormItem>
                   {/* <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoType"
                        })}：`}
                    >
                        <RadioGroup name="archivetaskType">
                            <Radio value="epst" checked>转换</Radio>
                            <Radio value="epsb">任务</Radio>
                        </RadioGroup>
                    </FormItem>*/}
                    <FormItem label={`${formatMessage({id: "e9.etl.archiveTask.archivetaskFile"})}：`}>
                        <Upload.Dragger
                            disabled={opt === "edit"}
                            onSuccess={(file, arr) => onUploadSuccess(file, arr)}
                            onError={(file) => onUploadError(file)}
                            onRemove={(file) => onUploadRemove(file)}
                            listType="text"
                            limit={5}
                            action="http://localhost:8810/api/archivetask/file"
                            accept=".epst,.epsb,.ktr,.kjb"
                        />
                    </FormItem>
                    <FormItem
                        label={`${formatMessage({
                            id: "e9.etl.archiveInfo.archiveinfoComments"
                        })}：`}
                    >
                        <Input.TextArea
                            placeholder="TextArea"
                            maxLength={100}
                            rows={4}
                            name="archivetaskComments"
                            maxLength={20}
                            placeholder={formatMessage({
                                id: "e9.etl.archiveInfo.archiveinfoComments"
                            })}
                        />
                    </FormItem>

                </Form>
            </EditForm>
        );
    }
}
