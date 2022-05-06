import React, { useState } from 'react';
import { observer } from "mobx-react";
import { Row, Col, Modal, Select, Form, message } from 'antd';
import IpapplyStore from '@/stores/des/IpapplyStore';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const ZhuLX = observer((props) => {

    const [form] = Form.useForm();

    const { zlxvisible, setZlxvisible, tableStore } = props;

    const { zhuluData, iptcfgData } = IpapplyStore;


    const onSave = () => {
        form.validateFields().then((values) => {
            IpapplyStore.saveZhulu(values).then((response) => {
                if (response && response.status == 201) {
                    tableStore.findByKey(tableStore.key, 1, tableStore.size, { sqid: IpapplyStore.editRecord.id });
                }
                setZlxvisible(false);
            })
        });
    };

    return (<div>
        <Modal
            title="著录项检测设置"
            visible={zlxvisible}
            onOk={onSave}
            onCancel={() => setZlxvisible(false)}
            width={800}
        >
            <Form form={form} {...formItemLayout}>
                <Row wrap>
                    {
                        zhuluData.map(mp => (
                            <Col span={12}>
                                <Form.Item name={mp.name} label={mp.name}>
                                    <Select
                                        mode="multiple"
                                        options={iptcfgData}
                                        showSearch
                                        allowClear
                                        filterOption={(input, option) =>
                                            option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    />
                                </Form.Item>
                            </Col>))
                    }
                </Row>
            </Form>
        </Modal>
    </div>
    );

});
export default ZhuLX;