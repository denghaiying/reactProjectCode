import React, {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row, Select, TreeSelect} from 'antd';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";
import { observer, useLocalObservable } from 'mobx-react';

import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import fetch from '@/utils/fetch'
import DocCwmService from './DocCwmService';
const FormItem = Form.Item;

const tableProp: ITable = {
    // tableSearch: true,
    // disableEdit: true,
    // disableDelete:true,
    // disableAdd:true,
    // disableCopy:true
}


const DocCwm = observer((props) =>{

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
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(DocCwmService));
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
  const DocCwmStore = useLocalObservable(() => (
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
        DocCwmStore.queryTreeDwList();
        setUmid('WDGL0004');
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
                        <Form.Item label="单位" name="dwid" >
                        <TreeSelect style={{width:  _width}} className="ant-select"
                          treeData={DocCwmStore.dwTreeData}
                          placeholder="单位"
                          treeDefaultExpandAll
                          allowClear
                        />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="名称" name="name" 
                        rules={[{ required:true, message: '请输入名称!' }]} >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="动态水印" name="dtstate"
                        >
                             <Select style={{width:  _width}}  className="ant-select">
                                <option value="Y">是</option>
                                <option value="N">否</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="类型" name="lx"
                        >
                         <Select style={{width:  _width}}  className="ant-select">
                            <option value="1">文字水印</option>
                            <option value="2">图片水印</option>
                            </Select>
                        </Form.Item>
                    </Col>
                   
                    <Col span={span}>
                        <Form.Item label="动态水印样式" name="dtlx" 
                        >
                           <Select style={{width:  _width}}  className="ant-select">
                            <option value="1">用户名岗位时间</option>
                            <option value="2">用户名时间</option>
                            <option value="3">部门用户名岗位时间</option>
                            <option value="4">部门用户名时间</option>
                            <option value="5">单位用户名时间</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="文字" name="wz"
                        >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="位置" name="wposition">
                            <Select style={{width:  _width}}  className="ant-select">
                                <option value="0">x/y坐标</option>
                                <option value="1">九宫格位置1</option>
                                <option value="2">九宫格位置2</option>
                                <option value="3">九宫格位置3</option>
                                <option value="4">九宫格位置4</option>
                                <option value="5">九宫格位置5</option>
                                <option value="6">九宫格位置6</option>
                                <option value="7">九宫格位置7</option>
                                <option value="8">九宫格位置8</option>
                                <option value="9">九宫格位置9</option>
                                <option value="10">平铺</option>
                            </Select>                       
                         </Form.Item>
                    </Col>
                    
                    <Col span={span}>
                        <Form.Item label="x座标" name="wxpoint" 
                        >
                             <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="y座标" name="wypoint" 
                        >
                           <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字体大小" name="wsize" rules={[{ required:true, message: '请输入字体大小!' }]}>
                        <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="字体颜色" name="wcolor"
                        rules={[{ required:true, message: '请选择字体颜色!' }]}>
                            <Select style={{width:  _width}}  className="ant-select">
                                <option value="WHITE">白色</option>
                                <option value="LIGHT_GRAY">浅灰色</option>
                                <option value="GRAY">灰色</option>
                                <option value="DARK_GRAY">深灰色</option>
                                <option value="BLACK">纯黑</option>
                                <option value="RED">纯红</option>
                                <option value="PINK">粉红</option>
                                <option value="ORANGE">橙色</option>
                                <option value="YELLOW">纯黄</option>
                                <option value="GREEN">纯绿</option>
                                <option value="MAGENTA">洋红</option>
                                <option value="CYAN">青色</option>
                                <option value="BLUE">纯蓝</option>
                            </Select>             
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="透明度" name="wtmd"     
                            rules={[{ required:true, message: '请选择透明度!' }]}>
>
                        <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="旋转角度" name="wrotation" >
                        <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="OpenOffice端口" name="ooport">
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="OpenOffice路径" name="oopath">
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
        code: 'dwid',
        align: 'center',
        formType: EpsFormType.Input,
        render:function(value){
          let list=DocCwmStore.dwTreeData;
          let mc = list.filter(ite => {
  
            return ite.value === value
          })
          return (<>{mc[0]?.label}</>)
        },
    },
        {
            title: '名称',
            code: 'name',
            align: 'center',
            formType: EpsFormType.Input
        }, {
            title: "动态水印",
            code: "dtstate",
            align: 'center',
            formType: EpsFormType.Input,
            render: (text) => {
              if(text ==='N') {
                return '否' ;
              }
                return  "是";
              
            }

        }, {
            title: "类型",
            code: 'lx',
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
            render: (text) => {
                if(text === '1') {
                  return '文字水印' ;
                }else if(text === '2'){
                  return '图片水印';
                }else{
                  return  "未知";
                }
              }
        },
            {
                title: '动态水印样式',
                code: 'dtlx',
                align: 'center',
                formType: EpsFormType.Input,
                render: (text) => {
                    if(text === '1') {
                      return '用户名岗位时间' ;
                    }else if(text === '2'){
                      return '用户名时间';
                    }else if(text === '3'){
                        return "部门用户名岗位时间";
                    }else if(text === '4'){
                        return "部门用户名时间";
                    }else if(text === '5'){
                        return "单位用户名时间";
                    }else{
                      return  "未知";
                    }
                  }
            }, {
                title: "文字",
                code: 'wz',
                align: 'center',
                formType: EpsFormType.Input
            },
            {
                title: "位置",
                code: "wposition",
                align: 'center',
                formType: EpsFormType.Input
    
            }, {
                title: "x座标",
                code: 'wxpoint',
                align: 'center',
                formType: EpsFormType.Input
            }, {
                title: "y座标",
                code: 'wypoint',
                align: 'center',
                formType: EpsFormType.Input
            }, {
                title: "字体大小",
                code: 'wsize',
                align: 'center',
                formType: EpsFormType.Input
            },
            {
                title: '字体颜色',
                code: 'wcolor',
                align: 'center',
                formType: EpsFormType.Input
            },
            {
                title: "透明度",
                code: 'wtmd',
                align: 'center',
                formType: EpsFormType.Input
            },
            {
                title: '旋转角度',
                code: 'wrotation',
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
        name: '文档水印'
    }

    return (
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={800}
            //customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={DocCwmService}
            customForm={customForm}
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default DocCwm;
