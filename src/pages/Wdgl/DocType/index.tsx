import React, {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import MkService from '@/services/system/MkService';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row, TreeSelect} from 'antd';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";
import Detail from "@/pages/sys/Mk/Detail";
import { observer } from 'mobx-react';
import FtpHttpService from './FtpHttpService';
import Select from 'rc-select';
import YhStore from '@/stores/system/YhStore';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import DocTypeService from './DocTypeService';
const FormItem = Form.Item;

const tableProp: ITable = {
    // tableSearch: true,
    // disableEdit: true,
    // disableDelete:true,
    // disableAdd:true,
    // disableCopy:true
}


const DocType = observer((props) =>{

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
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(DocTypeService));
    const customTableAction = (text, record, index, store) => {
        
        return (<>
            {[
                //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
            ]}
        </>)}


    useEffect(() => {
        // SearchStore.queryDw();
       
        setUmid('WDGL0002');
    }, []);

    const customAction = (store: EpsTableStore) => {
        return ([<>
            {/* <EpsReportButton store={store} umid={umid} /> */}
            //        <EpsReportButton store={store} umid={umid} />
        </>])
    }

    const span = 24;
    const _width = 240;


// 自定义表单

    const customForm = () => {
        //自定义表单校验
        return (
            <>
                <Row gutter={20}>
                     <Col span={span}>
                        <Form.Item label="编码" name="code"
                        rules={[{ required:true, message: '请输入编码!' }]} 
                        >
                            <Input style={{width:  _width}} className="ant-input" />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="名称" name="name" 
                        rules={[{ required:true, message: '请输入名称!' }]} >
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
                </Row>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '编码',
        code: 'code',
        align: 'center',
        formType: EpsFormType.Input
    },
        {
            title: '名称',
            code: 'name',
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
        name: '文档分类'
    }

    return (
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={500}
            //customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={DocTypeService}
            customForm={customForm}
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
    );
})

export default DocType;
