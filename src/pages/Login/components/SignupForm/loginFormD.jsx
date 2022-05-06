/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {useEffect, useState} from 'react';
import {injectIntl} from 'react-intl';
import {observer} from 'mobx-react';
import _ from 'lodash';
import {Message} from '@alifd/next';
import util from '@/utils/util';
import GVerify from './verify';
import PtinfoStore from '../../../../stores/system/PtinfoStore';
import LoginStore from '../../../../stores/system/LoginStore';
import { Form, Input, Modal} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './loginFormD.less';

const LoginFormD = observer(props => {
    const {intl:formatMessage} = useIntl();
    const [identifyValue, setIdentifyValue] = useState('');
    const [value, setValue] = useState({});
    const [gvid, setGvid] = useState(util.uuid());
    const [form] = Form.useForm();

    useEffect(() => {
        LoginStore.findXTname();
        LoginStore.findVscode();
        LoginStore.getRemember().then(() => {
            setValue(LoginStore.loginrec);
            // LoginStore.findPicture().then(() => {
            //   document.getElementById("ss").src = window.URL.createObjectURL(new Blob([LoginStore.picture]));
            // });
        });
    }, []);

    const getIdentifyValue = (e) => {
        setIdentifyValue(e);
    };
    const keyupadditem=(e)=>{
        if (e.which !== 13) return
        console.log('你按了回车键...');
        doSubmit()
    }
    const doSubmit = () => {
        if (!value.loginname) {
            Message.error(`${formatMessage({id: 'e9.login.loginname'})} ${formatMessage({id: 'e9.info.data.require'})}`);
            return;
        }
        if (!value.password) {
            Message.error(`${formatMessage({id: 'e9.login.password'})} ${formatMessage({id: 'e9.info.data.require'})}`);
            return;
        }
        if (LoginStore.vscodebloon) {
            if (!value.vericode) {
                Message.error(`${formatMessage({id: 'e9.login.vericode'})} ${formatMessage({id: 'e9.info.data.require'})}`);
                return;
            }
            if (!_.isEqual(value.vericode.toLowerCase(), identifyValue.toLowerCase())) {
                Message.error(`${formatMessage({id: 'e9.login.err.vc'})}`);
                setGvid(util.uuid());
                return;
            }
        }
        LoginStore.login(value.loginname, value.password, value.rememberlogin).then(() => {
            if(LoginStore.dlmeg){
                  Message.error(LoginStore.dlmeg);
            }
        }).catch(err => {
            Message.error(err.message);
            setGvid(util.uuid());
        });
    };

const closeModal = (e) => {
    LoginStore.setMmdoalVisible(false);
  };

  const changepasswordSubmit = () => {
       form
          .validateFields()
          .then(values => {
            form.resetFields();
            LoginStore.changepassword(values.yhid, values.password,values.oldpassword).then((respons) => {
            }).catch(err => {
                Message.error(err.message);
            });
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });



    };

    return (
        <div className="login-page">
            <div className="bottom"/>
            <div className="title">
                <img src="/sysapi/ptinfo/renderesImg" alt=""/>
                {/* {PtinfoStore.record.ptinfoName}|| formatMessage({ id: 'e9.main.title' }) */}
                <span className="title-name">{}</span>
            </div>
            <div className="content">
                <div className="left">
                    <p className="top-text">{LoginStore.xtname}</p>
                    <img src={require('./images/left-bg.png')} className="left-bg" alt=""/>
                    <img src={require('./images/light.png')} className="light lightmove" alt=""/>
                    {/* <p className="bottom-text"><span style={{ marginRight: '15px' }}>智慧城市</span><span>万物互联</span></p> */}
                </div>
                <div className="right">
          <span className="qr-bg">
            {!LoginStore.isScan &&
            <img src={require('./images/qr-code.png')} className="qr-code" alt="" onClick={() => {
                LoginStore.showScan();
            }}/>}
              {LoginStore.isScan &&
              <img src={require('./images/login-back.png')} className="qr-code" alt="" onClick={() => {
                  LoginStore.showScan();
              }}/>}
          </span>
                    <p className="form-title">{formatMessage({id: 'e9.login.title'})}</p>
                    {!LoginStore.isScan &&
                    <form className="login-form">
                        <li className="item">
                <span className="icon-span">
                  <img src={require('./images/account-icon.png')} className="icon-label" alt=""/>
                </span>
                            <input
                                type="text"
                                className="my-input"
                                placeholder={formatMessage({id: 'e9.login.loginname'})}
                                value={value.loginname || ''}
                                onChange={(obj) => {
                                    const {...v} = value;
                                    v.loginname = obj.target.value;
                                    setValue(v);
                                }}
                                onKeyPress={keyupadditem}
                            />
                        </li>
                        <li className="item">
                <span className="icon-span">
                  <img src={require('./images/password-icon.png')} className="icon-label" alt=""/>
                </span>
                            <input
                                type="password"
                                className="my-input"
                                placeholder={formatMessage({id: 'e9.login.password'})}
                                value={value.password || ''}
                                onChange={(obj) => {
                                    const {...v} = value;
                                    v.password = obj.target.value;
                                    setValue(v);
                                }}
                                onKeyPress={keyupadditem}
                            />
                        </li>
                        {LoginStore.vscodebloon &&
                        <div className="verify-div">
                            <li className="item" style={{marginBottom: '16px'}}>
                                <span className="icon-span"
                                      style={{verticalAlign: 'baseline', color: '#999999'}}>T</span>
                                <input
                                    type="text"
                                    className="my-input verify-input"
                                    placeholder={formatMessage({id: 'e9.login.vericode'})}
                                    value={value.vericode || ''}
                                    onChange={(obj) => {
                                        const {...v} = value;
                                        v.vericode = obj.target.value;
                                        setValue(v);
                                    }}
                                    onKeyPress={keyupadditem}
                                />
                            </li>
                            <div className="verifyContainer"><GVerify id={gvid} getIdentifyValue={getIdentifyValue}
                                                                      className="verifyCanvas"/></div>
                        </div>
                        }
                        <p className="remember">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={value.rememberlogin || false}
                                onChange={(obj) => {
                                    const {...v} = value;
                                    v.rememberlogin = obj.target.checked;
                                    setValue(v);
                                }}
                            />
                            {formatMessage({id: 'e9.login.rememberlogin'})}
                        </p>
                        <p className="btn-p" onClick={() => {
                            doSubmit();
                        }}>{formatMessage({id: 'e9.login.submit'})}</p>
                    </form>
                    }
                    {LoginStore.isScan &&
                    <img src={require('@/styles/img/qr-code.png')} alt="" className="code-img"/>
                    }
                </div>
            </div>

         <Modal
          visible={LoginStore.mmxgModalVisible}
          title="修改密码"
          onOk={() => {changepasswordSubmit()}}
          onCancel={() => {closeModal()}}
        >
            <Form
                form={form}
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                >
            <Form.Item label="用户名" name="yhid" rules={[{ required: true, message: '请输入用户名!' }]} >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="旧密码" name="oldpassword" rules={[{ required: true, message: '请输入旧密码!' }]}>
                <Input prefix={<LockOutlined className="site-form-item-icon" />}type="password" placeholder="请输入旧密码" />
            </Form.Item>
            <Form.Item label="新密码" name="password" rules={[{ required: true, message: '请输入新密码!' }]}>
                <Input prefix={<LockOutlined className="site-form-item-icon" />}type="password" placeholder="请输入新密码" />
            </Form.Item>
          </Form>
        </Modal>
        </div>
    );
});

export default LoginFormD;
