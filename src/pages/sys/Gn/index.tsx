import React, { useEffect, useRef, useState} from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';

import GnService from '@/services/system/GnService';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";

import { Col, Form, Input, Row, Select } from 'antd';
import { EpsSource, ITable, ITitle, ITree, MenuData } from '@/eps/commons/declare';

import OrgStore from "@/stores/system/OrgStore";




import {observer} from "mobx-react";
import MkService from "@/services/system/MkService";
import TextArea from "antd/es/input/TextArea";
import DetailGn from "@/pages/sys/Gn/DetailGn";
const FormItem = Form.Item;


const tableProp: ITable = {
    tableSearch: true,
    disableAdd: true,
    disableEdit: true,
    disableDelete:true,
    disableCopy:true

}



const span = 24;
const _width = 240;




const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
}



const Gn = observer((props) => {

    const [umid, setUmid] = useState('')


    // 自定义表单
    const customForm = () => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                        <Form.Item label="功能编号"  name="id" required>
                            <input  className="ant-input"  placeholder="功能编号"
                                    style={{width:  _width}}/>
                        </Form.Item>

                    </Col>
                    <Col span={span}>
                        <Form.Item  required  label="功能名称" name='mc'>
                            <Input
                                placeholder="功能名称" className="ant-input"
                                style={{width:  _width}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item
                            required
                            name="url"
                            label="URL"
                        >
                            <Input placeholder="URL"  className="ant-input" style={{width:  _width}}/>
                        </Form.Item>
                    </Col>


                    <Col span={span}>
                        <Form.Item label="类型" name="lx">
                            <Select style={{width:  _width}}  className="ant-select">
                                <option value="F">业务功能</option>
                                <option value="I">信息功能</option>
                                <option value="U">网址</option>
                                <option value="K">档案库</option>
                                <option value="G">GTK自定义</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label='备注'
                                   name="bz" >
                            <TextArea className="ant-input-textarea-show-count"
                                      disabled style={{width:  _width}}
                                      placeholder=''
                            />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label='维护人'
                                   name="whr" >
                            <Input className="ant-input"
                                   disabled style={{width:  _width}}
                                   placeholder=''
                            />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label='维护时间'
                                   name="whsj">

                            <Input className="ant-input" style={{width:  _width}} disabled />

                        </Form.Item>
                    </Col>
                </Row>
            </>
        )
    }


    const ref = useRef();
    // const FChild = forwardRef(EpsPanel);

    // 自定义功能按钮
    const customAction = (store: EpsTableStore) => {
        return ([<>
            {/* <EpsReportButton store={store} umid={umid} />
            <EpsModalButton name="批量导入" title="批量导入" width={1200}   useIframe={true}  url={'/api/eps/control/main/yh/yhpldr'}  icon={<ImportOutlined />}/>
            <EpsModalButton name="组织机构用户" title="组织机构用户"  width={1200}   useIframe={true}  url={'/api/eps/control/main/org/openOrgyh'}  icon={<ClusterOutlined />}/> */}

        </>])
    }

    const [initParams, setInitParams] = useState({})
    const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(GnService));

// 创建右侧表格Store实例
    //   const [tableStore] = useState<EpsTableStore>(new EpsTableStore(YhService));

    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
        return (<>
            {[
                <DetailGn title="查看" column={source} data={record} store={tableStore} customForm={customForm} />,

            ]}
        </>);
    }






    useEffect(() => {
        OrgStore.queryOrgLx();
        setUmid('CONTROL0006')

        setTableStore(ref.current?.getTableStore())
    }, []);

    useEffect(() => {
        //    YhStore.queryOrg(tableStore?.key);
        console.log('左侧菜单值: ', tableStore?.key)
    }, [tableStore?.key])

    const Lxs = [{value: "F", label: "业务功能"}, {value: "I", label: "信息功能"},
        {value: "U", label: "网址"}, {value: "K", label: "档案库"}, {value: "G", label: "GTK自定义"}];

    const source:EpsSource[] = [{
        title: '功能编号',
        code: 'id',
        align: 'center',
        fixed: 'left',
        formType: EpsFormType.Input
    }, {
        title: '功能名称',
        code: 'mc',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        formType: EpsFormType.Input
    }, {
        title: '类型',
        align: 'center',
        code: 'lx',
        ellipsis: true,
        formType: EpsFormType.Select,
        render: (text, record, index) => {

            let aa = Lxs.filter(item => {
                return item.value === text
            })
            return aa[0]?.label
        }
    },
        {
            title: "URL",
            code: "url",
            align: 'center',
            formType: EpsFormType.Input,

        }, {
            title: '备注',
            align: 'center',
            code: 'bz',
            ellipsis: true,
            formType: EpsFormType.Select,

        }, {
            title: "维护人",
            code: 'whr',
            align: 'center',
            formType: EpsFormType.Input,

        },{
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            formType: EpsFormType.None
        }]

    const title:ITitle = {
        name: '功能'
    }

    const menuProp: MenuData[] = [
        {
            title: '导入',
            icon: 'file-transfer/icon_edit',
            onClick: (record , store, rows) => console.log('这是导入按钮', record , rows),
            color: '#CCCCFF'
        }, {
            title: '打印',
            icon: 'file-transfer/icon_book',
            onClick: (record , store, rows) => console.log('这是打印按钮', record, rows),
            color: '#FFCCFF'
        }

    ]


    return (
        <>
            <EpsPanel title={title}                            // 组件标题，必填
                      source={source}                          // 组件元数据，必填
                      treeService={MkService}
                      treeProp={treeProp}                      // 左侧树 设置属性,可选填
                      tableProp={tableProp}                    // 右侧表格设置属性，选填
                      tableService={GnService}                 // 右侧表格实现类，必填
                      ref={ref}                                // 获取组件实例，选填
                      formWidth={480}
                      initParams={initParams}
                      tableRowClick={(record) => console.log('abcef', record) }
                      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            >
            </EpsPanel>
        </>
    );
})

export default Gn;
