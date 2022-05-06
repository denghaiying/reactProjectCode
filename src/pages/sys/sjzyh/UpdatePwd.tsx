/*
import React from 'react';
import {Form, Input,  Modal,  Tooltip} from 'antd';
const FormItem = Form.Item;
import "./index.less";
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import Store from '../../../stores/system/YhStore';
import './add.less';



/!**
 * 修改密码
 * @type {onUpdatPwdAction}
 *!/
const onUpdatPwdOpen=((record) => {


    Store.updatPwdVisible = true;
});


export default (text, record, index, store: EpsTableStore) => {

    /!**
     * 修改密码
     *!/
    const savePwd = (values, errors) => {
        if (!errors) {
            
            Store.changepassword(values);
        }
    };

    const close=()=>{
        Store.updatPwdVisible = false;
    }


    return (
        <>
            <Tooltip title='审核'>
                <img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} onClick={() => onUpdatPwdOpen(record)} style={{ width: 22 }} />
            </Tooltip>

            <Modal title={<span className="m-title">用户管理【修改密码】</span>}
                   visible={Store.updatPwdVisible}
                   onOk={savePwd}
                   onCancel={close}
                   width="500"
                   className="scheduleModal"
            >
                <Form  labelCol={{ span: 5 }} className="schedule-form" initialValues={record}>
                    <FormItem label="用户名:" name="yhmc" >
                        <Input  disabled />
                    </FormItem>
                    <FormItem label="新密码:" name="pwd" >
                        <Input.Password  />
                    </FormItem>

                </Form>
            </Modal>
        </>
    )
}
*/
