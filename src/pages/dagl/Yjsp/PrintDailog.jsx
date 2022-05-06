import React, { useState } from 'react';
import {Input, DatePicker, Switch, Select, Message, Form, Button, Icon, Dialog} from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import YjspStore from '../../../stores/dagl/YjspStore';

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
const PrintDailog = observer(props => {

    const close=()=>{
        YjspStore.printVisible = false;
    }

    return (
        <Modal
            title="打印"
            centered
            visible={YjspStore.printVisible}
            footer={null}
            width={1200}
            bodyStyle={{height:700}}
            onCancel={close}
        >

            <iframe name="bsframe" frameBorder="false" width="100%" scrolling="auto" height="100%"
                    src={YjspStore.yprintUrl}/>

        </Modal>
    );
});

export default injectIntl(PrintDailog);
