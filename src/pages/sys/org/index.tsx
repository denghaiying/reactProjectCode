import React, { useEffect, useRef, useState} from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import DwTableLayout from '@/eps/business/DwTableLayout'

import OrgService from '@/services/system//OrgService';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";

import { Col, Form, Input, Row, Select,TreeSelect } from 'antd';
import { EpsSource, ITable, ITitle, ITree, MenuData } from '@/eps/commons/declare';




import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import {AuditOutlined, CopyOutlined, ImportOutlined} from "@ant-design/icons";

//import CopyOrg from "@/pages/sys/Org/CopyOrg";
import YhStore from "@/stores/system/YhStore";
import {observer, useLocalObservable} from "mobx-react";
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import orgYh from './orgYh';
import CopyOrg from './CopyOrg';
import fetch from "@/utils/fetch"
const FormItem = Form.Item;


const tableProp: ITable = {
    tableSearch: false,
    disableEdit: false,
    /* disableAdd: true,
     disableEdit: false,
     rowSelection: {
         type: 'checkbox',
     }*/

}



const span = 24;
const _width = 240;




const treeProp: ITree = {
    treeSearch: true,
    treeCheckAble: false
}



const Org = observer((props) => {

    /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [dwTreeId, setDwTreeId] = useState('')

    const [umid, setUmid] = useState('CONTROL0002')

    const [initParams, setInitParams] = useState({})
    const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(OrgService));


    const OrgStore = useLocalObservable(() => (
        {
            params: {},

	     orgLxDataSource : [],

	     orgYhData : [],

	      orgYhNoData : [],



            async queryOrgLx() {
                let url="/api/eps/control/main/orglx/queryForList";
                const response=await fetch.post(url);
                if (response.status === 200) {
                    if (response.data.length > 0) {
			this.orgLxDataSource = response.data.map(o => ({ 'id': o.id, 'label': o.name, 'value': o.id }));

                    }else{
                        return;
                    }
                }
            },



            async queryOrgYh(dwid) {
		        const url = "/api/eps/control/main/org/queryOrgYh";

                const response = await fetch.get(url, this.params, {
                    params: {
                    page: this.page_No - 1,
                    pageSize: this.page_Size,
                    pageIndex: this.page_No - 1,
                    limit: 10,
                    orgid: dwid,
                    dqyhlx: SysStore.currentUser.lx,
                    ...this.params,
                    },
                    });
                if (response && response.status === 200) {
                    this.orgYhData = response.data;
                    console.log('orgYhData',this.orgYhData)
                }else{
                    return;
                }
            },

            async queryNoOrgYh(dwid) {
		        const url = "/api/eps/control/main/org/queryNoOrgYh";

                const response = await fetch.get(url, this.params, {
                    params: {
                    page: this.page_No - 1,
                    pageSize: this.page_Size,
                    pageIndex: this.page_No - 1,
                    limit: 10,
                    orgid: dwid,
                    dqyhlx: SysStore.currentUser.lx,
                    ...this.params,
                    },
                    });
                if (response && response.status === 200) {
                    this.orgYhData = response.data;
                    console.log('orgYhData',this.orgYhData)
                }else{
                    return;
                }
            },

        }

    ));

    useEffect(() => {
        OrgStore.queryOrgLx();
        setUmid('CONTROL0002');
         YhStore.queryTreeDwList();
        // const getUser = async () => {
        //     let result = await YhService.findByKey('DW201408191440170001');
        //     setYh(result.results[0])
        // }
        // getUser()
        setTableStore(ref.current?.getTableStore())
    }, []);

    const getDwid = ()=>{
        const uo= tableStore?.key;
        setDwTreeId(uo);
      }

    useEffect(() => {
        console.log('左侧菜单值: ', tableStore?.key)
        getDwid();
      //  setDwTreeId(tableStore?.key);
    }, [tableStore?.key])


    // 自定义表单
    const customForm = () => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>

                        <Form.Item label="单位"  name="dwid" required>
                            <TreeSelect style={{width:  _width}} className="ant-select"
                                treeData={YhStore.dwTreeData}

                                placeholder="单位"
                                treeDefaultExpandAll
                           //     onChange={dwChange}
                                allowClear
                            />

                            {/* <Select    defaultValue={YhStore.dwid}
                                       placeholder="单位"  className="ant-select"
                                       options={YhStore.dwDataSource} style={{width:  _width}}/> */}
                        </Form.Item>

                    </Col>
                    <Col span={span}>
                        <Form.Item  required  label="编码" name='code'>
                            <Input
                                placeholder="编码" className="ant-input"
                                style={{width:  _width}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item
                            required
                            name="name"
                            label="名称"
                        >
                            <Input placeholder="名称"  className="ant-input" style={{width:  _width}}/>
                        </Form.Item>
                    </Col>

                    <Col span={span}>
                        <Form.Item label="停用" name="tybz">
                            <Select style={{width:  _width}}  className="ant-select">
                                <option value="N">启用</option>
                                <option value="Y">停用</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label='维护人'
                                   name="whr"  initialValue={yhmc}>
                            <Input className="ant-input"
                                disabled style={{width:  _width}}
                                placeholder=''
                            />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label='维护时间'
                                   name="whsj" initialValue={getDate}>

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
        console.log('EpsTableStre',EpsTableStore);
        return ([<>
            <EpsReportButton store={store} umid={umid} />
            <EpsModalButton name="批量导入" title="批量导入" width={1200}   useIframe={true}  url={'/api/eps/control/main/org/orgpldr'}  icon={<ImportOutlined />}/>

            {/* <EpsModalButton name="组织机构用户" title="组织机构用户" width={1200}   useIframe={true}  url={'/api/eps/control/main/org/openOrgyh'}  icon={<TeamOutlined />}/> */}
            <EpsModalButton name="组织机构树" title="组织机构树" width={1400}   useIframe={true}  
            url={'/api/eps/control/main/org/indexDetailTree'}  
            icon={<ImportOutlined />}  params={{ dwid:'DW201905072148480006'}}/>
            &nbsp;&nbsp;&nbsp;

        </>])
    }

  
// 创建右侧表格Store实例
    //   const [tableStore] = useState<EpsTableStore>(new EpsTableStore(YhService));

    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
      //  record.yhtype=SysStore.currentUser.lx;
        return (<>
            {[
                // <CopyOrg title="复制" column={source} data={record} store={tableStore} customForm={customForm} />,
           //      orgYh(text,record,index,store)
           <EpsModalButton  name="组织机构用户" title="组织机构用户" width={1200}   useIframe={true}
                    params={record}  type="primary" isIcon={true}
                    url={'/api/eps/control/main/org/openOrgyh1'}
                        icon={<AuditOutlined />}   />
            ]}
        </>);
    }


   
    const source:EpsSource[] = [{
        title: '编码',
        code: 'code',
        align: 'center',
        fixed: 'left',
        width: 120,
        formType: EpsFormType.Input
    }, {
        title: '名称',
        code: 'name',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        width: 200,
        formType: EpsFormType.Input
    }, {
        title: '类型',
        align: 'center',
        code: 'lx',
        width: 120,
        ellipsis: true,
        formType: EpsFormType.Select,

    },
    {
        title: "停用",
        code: "tybz",
        width: 60,
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          //  return text == 'N' ? '启用' : '停用';
            //为null的时候表示启用
            return text == 'Y' ? '停用': '启用';
        }
    }, {
        title: "维护人",
        code: 'whr',
        width: 100,
        align: 'center',
        formType: EpsFormType.Input,
        /* defaultSortOrder: 'descend',
         sorter: (a, b) => a.whr - b.whr,*/
    },{
        title: '维护时间',
        code: 'whsj',
        width: 160,
        align: 'center',
        formType: EpsFormType.None
    }]

    const title:ITitle = {
        name: '组织机构'
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

    const searchFrom = () => {
        return (
            <>
                <Form.Item label="编码" className="form-item" name="code">
                    <Input placeholder="请输入组织机构编码"/>
                </Form.Item >
                <Form.Item label="名称" className="form-item" name="name">
                    <Input placeholder="请输入组织机构名称"/>
                </Form.Item>
                <Form.Item name="query_lx" className="form-item" label="类型">
                    <Select
                        placeholder="请选择类型"
                        options={OrgStore.orgLxDataSource} >
                    </Select>
                </Form.Item>
            </>
        )
    }

    return (
        <>
            <DwTableLayout title={title}                            // 组件标题，必填
                      source={source}                          // 组件元数据，必填
                      treeProp={treeProp}                      // 左侧树 设置属性,可选填
                      tableProp={tableProp}                    // 右侧表格设置属性，选填
                      tableService={OrgService}                 // 右侧表格实现类，必填
                      ref={ref}                                // 获取组件实例，选填
                      formWidth={450}
                      initParams={initParams}
                  //    menuProp={menuProp}                      // 右侧菜单 设置属性，选填
                      tableRowClick={(record) => console.log('abcef', record) }
                      searchForm={searchFrom}
                      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                      customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </DwTableLayout>
        </>
    );
})

export default Org;
