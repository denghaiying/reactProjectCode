import React, {useEffect, useState} from "react";
import {Input, DatePicker, Switch, Select, Message, Form, Checkbox,Radio,Dialog, Grid,Button } from "@alifd/next";
import { injectIntl } from "react-intl";
import { isMoment } from "moment";
import { observer } from "mobx-react";
import EditForm from "../../../components/EditForm";
import Store from "../../../stores/system/YhStore";
import {Table} from "antd";
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
const RoleDailog = observer((props) => {
    const {
        intl: { formatMessage },
    } = props;

    const { data, columns } = Store;
    useEffect(() => {
        Store.setRoleColumns([{
            title: "全宗号",
            dataIndex: "dwqzh",
            width: 200,
            lock: true
        },
            {
                title: "所属单位",
                dataIndex: "dwid",
                width: 250
            }, {
                title: "角色编号",
                dataIndex: 'rolecode',
                width: 200,
            }, {
                title: "角色名称",
                dataIndex: 'rolename',
                width: 200,
            }]);
   //     Store.queryRole(Store.editRecord);
    }, []);


    const [switchState, setSwitchState]= useState(Store.selectedRow.ty)
    const onChange = (value) => {
        setSwitchState(value)
    }
    const close=()=>{
        Store.roleVisible = false;
    }
    const footer=false;

    return (
        <Dialog title={<span className="m-title">全局角色</span>}
                visible={Store.roleVisible}
                onClose={close}
                footer={footer}
                >
        <Table
           /* rowSelection={{
                type: "radio",
                ...rowSelection,
            }}*/
            columns={Store.roleColumns}
            dataSource={Store.roleDataSource}
            pagination={false} />

        </Dialog>
    );
});

export default injectIntl(RoleDailog);
