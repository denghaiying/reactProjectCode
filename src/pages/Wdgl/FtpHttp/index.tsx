import React, {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row, Select, TreeSelect} from 'antd';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";
import { observer, useLocalObservable } from 'mobx-react';
import FtpHttpService from './FtpHttpService';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import fetch from '@/utils/fetch'
const FormItem = Form.Item;

const tableProp: ITable = {
    // tableSearch: true,
    // disableEdit: true,
    // disableDelete:true,
    // disableAdd:true,
    // disableCopy:true
}


const FtpHttp = observer((props) =>{

    /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


    const [umid, setUmid] = useState('');


    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(FtpHttpService));
    const customTableAction = (text, record, index, store) => {
        
        return (<>
            {[
                //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
            ]}
        </>)}


            // 创建Store实例
  /**
   * childStore
   */
  const FtpHttpStore = useLocalObservable(() => (
    {

        dwTreeData: [],
      
      async queryTreeDwList() {
        const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);

        if (response.status === 200) {
            const sjData = [];
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id;
                newKey.title = newKey.mc;
                sjData.push(newKey)
              }
              this.dwTreeData = sjData;

            }else{
                return;
            }
        }
      },



    }
  ));


    useEffect(() => {
        // SearchStore.queryDw();
        FtpHttpStore.queryTreeDwList();
        setUmid('WDGL0001');
    }, []);

    const customAction = (store: EpsTableStore) => {
        return ([<>
            {/* <EpsReportButton store={store} umid={umid} /> */}
            //        <EpsReportButton store={store} umid={umid} />
        </>])
    }

    const span = 12;
    const _width = 240;


// 自定义表单

    const customForm = () => {
        //自定义表单校验
        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                        <Form.Item label="单位" name="dw" >
                        <TreeSelect style={{width:  _width}} className="ant-select"
                          treeData={FtpHttpStore.dwTreeData}
                          placeholder="单位"
                          treeDefaultExpandAll
                          allowClear
                        />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="名称" name="sm" 
                        rules={[{ required:true, message: '请输入名称!' }]} >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="描述" name="name"
                        rules={[{ required:true, message: '请输入描述!' }]} 
                        >
                            <Input style={{width:  _width}} className="ant-input" />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="服务名" name="srv"
                        rules={[{ required:true, message: '请输入服务名!' }]} 
                        >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                   
                    <Col span={span}>
                        <Form.Item label="端口号" name="port" 
                            rules={[{ required:true, message: '请输入端口号!' }]} 
                        >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="用户名" name="usrname"
                            rules={[{ required:true, message: '请输入用户名!' }]} 
                        >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="密码" name="psw"
                            rules={[{ required:true, message: '请输入密码!' }]} 
                        >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    
                    <Col span={span}>
                        <Form.Item label="类型" name="uplx" 
                             rules={[{ required:true, message: '请选择类型!' }]} 
                        >
                              <Select style={{width:  _width}}  className="ant-select">
                                <option value="0">档案系统</option>
                                <option value="1">光盘打包</option>
                                <option value="2">长期保存</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="传输类型" name="type" 
                             rules={[{ required:true, message: '请选择传输类型!' }]} 
                        >
                              <Select style={{width:  _width}}  className="ant-select">
                                <option value="0">FTP模式</option>
                                <option value="1">SFTP模式</option>
                                <option value="2">AWS3模式</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="协议类型" name="protocol">
                            <Select style={{width:  _width}}  className="ant-select">
                                <option value="1">HTTP</option>
                                <option value="2">HTTPS</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="主动模式" name="zdms" initialValue="N">
                        <Select style={{width:  _width}}  className="ant-select">
                                <option value="Y">是</option>
                                <option value="N">否</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="停用" name="ty" initialValue="N">
                        <Select style={{width:  _width}}  className="ant-select">
                                <option value="Y">是</option>
                                <option value="N">否</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="默认使用" name="mr" initialValue="N">
                        <Select style={{width:  _width}}  className="ant-select">
                                <option value="Y">是</option>
                                <option value="N">否</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="根路径" name="rootdir">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                   
                    <Col span={span}>
                        <Form.Item label='维护人'
                                name="whr" initialValue={yhmc}>
                        <Input  className="ant-input"
                                disabled style={{width:  _width}}
                                placeholder=''
                        />
                        </Form.Item>
                    </Col>

                    <Col span={span}>
                        <Form.Item label='维护时间'
                                name="whsj" initialValue={getDate}>

                        <Input  disabled className="ant-input"  style={{width:  _width}}/>

                        </Form.Item>
                    </Col>
                    {/* </Row>
                    <Row  gutter={20}>
                    <Col span={24}>
                        <Form.Item label="备注" name="bz">
                            <Input.TextArea style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col> */}
                     <Col span={23}  style={{height:  98}}>
                        <Form.Item  label="备注" labelCol={{span: 2}}   name="bz" >
                            <Input.TextArea   rows={4}   ></Input.TextArea>
                        </Form.Item>
                    </Col>
                   
                </Row>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '单位',
        code: 'dw',
        align: 'center',
        formType: EpsFormType.Input,
        render:function(value){
          let list=FtpHttpStore.dwTreeData;
          let mc = list.filter(ite => {
  
            return ite.value === value
          })
          return (<>{mc[0]?.label}</>)
        },
    },
        {
            title: '名称',
            code: 'sm',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "服务名",
            code: "srv",
            align: 'center',
            formType: EpsFormType.Input

        }, {
            title: "描述",
            code: 'name',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "端口号",
            code: 'port',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "用户名",
            code: 'usrname',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '类型',
            code: 'uplx',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
              if(text === '0') {
                return '档案系统' ;
              }else if(text === '1'){
                return '光盘打包';
              }else if(text === '2'){
                  return '长期保存';
              }else{
                return  "未知";
              }
            }
        },
            {
                title: '传输类型',
                code: 'type',
                align: 'center',
                formType: EpsFormType.Input,
                render: (text, record, index) => {
                    if(text === '0') {
                      return 'FTP模式' ;
                    }else if(text === '1'){
                      return 'SFTP模式';
                    }else if(text === '2'){
                        return "AWS3模式";
                    }else{
                      return  "未知";
                    }
                  }
            }, {
                title: "协议类型",
                code: "protocol",
                align: 'center',
                formType: EpsFormType.Input,
                render: (text, record, index) => {
                    if(text === '1') {
                      return 'HTTP' ;
                    }else if(text === '2'){
                      return 'HTTPS';
                    }else{
                      return  "未知";
                    }
                  }
    
            }, {
                title: "主动模式",
                code: 'zdms',
                align: 'center',
                formType: EpsFormType.Input,
                render: (text) => {
                  if(text ==='N') {
                    return '否' ;
                  }
                    return  "是";
                  
                }
            }, {
                title: "停用",
                code: 'ty',
                align: 'center',
                formType: EpsFormType.Input,
                render: (text) => {
                    if(text ==='N') {
                      return '否' ;
                    }
                      return  "是";
                  }
            }, {
                title: "默认使用",
                code: 'mr',
                align: 'center',
                formType: EpsFormType.Input,
                render: (text) => {
                    if(text ==='N') {
                      return '否' ;
                    }
                      return  "是";
                  }
            },
            {
                title: '根路径',
                code: 'rootdir',
                align: 'center',
                formType: EpsFormType.Input
            },
            {
                title: '备注',
                code: 'bz',
                align: 'center',
                formType: EpsFormType.Input
            },
        {
            title: '维护人',
            code: 'whr',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            formType: EpsFormType.Input
        }
    ]
    const title = {
        name: '服务配置'
    }

    return (
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={800}
            //customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={FtpHttpService}
            customForm={customForm}
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default FtpHttp;
