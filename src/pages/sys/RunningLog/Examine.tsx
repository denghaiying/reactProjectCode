import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Tooltip, Button, Modal, message } from 'antd';
import { CheckSquareTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import RunningLogStore from '../../../stores/system/RunningLogStore';
const FormItem = Form.Item;
import { observer, useLocalObservable } from "mobx-react";

/**
 * 下拉框选择
 */
const Option = Select.Option;

const examine = observer((props) => {

    const [examine_visible, setExamineVisible] = useState(false)
    const [cancel_examine_visible, setCancelExamineVisible] = useState(false)
    /**
     * 获取审核结果
     * @param {*} val
     */
    const getShjg = (val) => {
        RunningLogStore.shjg = val;
    };

    /**
     * 获取审核备注
     * @param val
     */
    const getNote = (val) => {
        RunningLogStore.note = val.target.value;
    }

    /**
     * 提交审核
     */
    const onPut_Examine = async () => {
        const response = await RunningLogStore.checkLog();
        if (response.data.success) {
            message.success('审核操作成功');
            setExamineVisible(false)
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);

        } else {
            message.error(response.data.message);
            setExamineVisible(false)
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);

        }

    }


    /**
  * 取消审核
  */
    const onPut_Cancel_Examine = async () => {
        const response = await RunningLogStore.cancel_checkLog();
        if (response.data.success) {
            message.success('取消审核成功');
            setCancelExamineVisible(false);
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
        } else {
            message.error(response.data.message);
            setCancelExamineVisible(false);
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
        }

    }

    /**
     * 审核前的校验
     * @param value
     */
    const onOpenExamine_visible = (value) => {
        if (value.shjg == '通过' || value.shjg == '不通过') {
            message.warning('该条日志已经审核,不能再次审核！');
        } else {
            RunningLogStore.selectid = value.id;
            setExamineVisible(true);
        }

    }
    /**
     * 取消审核前的校验
     * @param values 多选
     * @param value  单选
     */
    const onOpenCancel_Examine_visible = (value) => {
        if (value.shjg == '通过' || value.shjg == '不通过') {
            RunningLogStore.cancel_selectid = value.id;
            setCancelExamineVisible(true);
        } else {
            message.warning('该条日志还未审核,不能取消审核！');
        }

    };


    //初始化数据
    useEffect(() => {
        getShjgValues(props.record);
        getQxShjgValues(props.record);
    }, [props.record])


    const [shjg, setShjg] = useState(true)

    const [qxshjg, setQxShjg] = useState(true)



    const getShjgValues = (values) => {
        if (values.shjg === undefined || values.shjg === '取消审核') {
            setShjg(true);
        } else {
            setShjg(false)
        }
    }

    const getQxShjgValues = (values) => {
        if (values.shjg === '通过' || values.shjg === '不通过') {
            setQxShjg(true);
        } else {
            setQxShjg(false)
        }
    }





    return (
        <>
            {
                shjg ?
                    <Tooltip title="审核">
                        <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<CheckSquareTwoTone />} onClick={() => onOpenExamine_visible( props.record)} />
                    </Tooltip> : ''
            }
            {
                qxshjg ?
                    <Tooltip title="取消审核">
                        <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<CloseCircleTwoTone />} onClick={() => onOpenCancel_Examine_visible(props.record)} />
                    </Tooltip> : ''
            }

            <Modal title={<span className="m-title">审核</span>}
                visible={examine_visible}
                onOk={() => onPut_Examine()}
                onCancel={() => setExamineVisible(false)}
            >
                <Form labelCol={{ span: 5 }} className="schedule-form" name="shForm" >
                    <FormItem label="审核人编号:" name="yhid" initialValue={RunningLogStore.yhid}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="审核人:" name="shr" initialValue={RunningLogStore.yhmc}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="审核时间:" name="shsj" initialValue={RunningLogStore.getDate}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="审核结果:" initialValue="通过">
                        <Select style={{ width: 180, height: 30 }} id="shjg" defaultValue="通过" onSelect={(val) => getShjg(val)}>
                            <Option value="通过">通过</Option>
                            <Option value="不通过">不通过</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核备注:" name="note">
                        <Input.TextArea name="note" onChange={(val) => getNote(val)} style={{ width: '250px' }} />
                    </FormItem>
                </Form>
            </Modal>

            <Modal title={<span className="m-title">取消审核</span>}
                visible={cancel_examine_visible}

                onOk={() => onPut_Cancel_Examine()}
                onCancel={() => setCancelExamineVisible(false)}
            >
                <Form labelCol={{ span: 5 }} className="schedule-form" name="shForm">
                    <FormItem label="审核人编号:" name="yhid" initialValue={RunningLogStore.yhid}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="审核人:" name="shr" initialValue={RunningLogStore.yhmc}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="审核时间:" name="shsj" initialValue={RunningLogStore.getDate}>
                        <Input disabled style={{ width: '250px' }} />
                    </FormItem>
                    <FormItem label="审核结果:" name="shjg" initialValue="取消审核">
                        <Select style={{ width: 180, height: 30 }} id="shjg" defaultValue="取消审核" onChange={(val) => getShjg(val)}>
                            <Select.Option value="取消审核">取消审核</Select.Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核备注:" name="note">
                        <Input.TextArea name="note" onChange={(value) => getNote(value)} style={{ width: '250px' }} />
                    </FormItem>
                </Form>
            </Modal>
        </>
    )
});
export default examine
