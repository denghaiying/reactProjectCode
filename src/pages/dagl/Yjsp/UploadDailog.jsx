import React, { useState } from 'react';
import {Input, DatePicker, Switch, Select, Message, Form, Button, Icon, Dialog} from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import YjspStore from '../../../stores/dagl/YjspStore';
import { WflwButtons, WflwLog } from '../../../components/Wflw';
import Store from "@/stores/system/YhStore";
import {message, Modal, Table, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import * as SysStore from "@/services/BaseService/api";

const formItemLayout = {
    labelCol: {
        fixedSpan: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
const UploadDailog = observer(props => {
    const [uploadVisible, setUploadVisible] = useState(false);

    function onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }
    }

    const close=()=>{
        YjspStore.uploadVisible = false;
    }

    return (
        <Modal
            title="离线报表设计"
            centered
            visible={YjspStore.uploadVisible}
            footer={null}
            onCancel={close}
            width={500}
        >
            <Upload
                action="/api/eps/control/main/yjsp/upload"
                /* beforeUpload={beforeUpload}*/
                data={{whr:SysStore.currentUser.yhmc,umid:YjspStore.Umid}}
                onChange={onChange}
                /* onSuccess={onSuccess}*/
                listType="text">
               {/* <label>{bsfile}</label>*/}
                <br/>
                <Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>报表文件上传</Button>
            </Upload>

        </Modal>
    );
});

export default injectIntl(UploadDailog);
