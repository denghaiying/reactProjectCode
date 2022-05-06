import React, { useEffect, useState, useRef } from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import {Col, Form, Input, Row, Select} from 'antd';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import SelectService from "@/pages/base/sjqx/SelectService";
import SjqxService from "@/pages/base/sjqx/SjqxService";
import DwService from './DwService';
import EpsTreeStore from '@/eps/components/panel/EpsPanel2/EpsTreeStore';

const FormItem = Form.Item;


const Sjqx = observer((props) => {
    /**
     * 获取当前用户
     */
    const yhmc = SysStore.getCurrentUser().yhmc;
    /**
     * 获取当前时间
     */
    const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const [tableStore, setTableStore]= useState<EpsTableStore>();
    const [treeStore, setTreeStore]= useState<EpsTreeStore>();

    //const { TextArea } = Input;

    const umid="JC061";
    /**
     * childStore
     */
    const sjqxStore = useLocalObservable(() => (
        {
            params: {},
            rolerenderlist: [],
            qwtmgzlstA: [],
            qwywgzlstB:[],
            roleData:[],
            qwgzlst:[],
            MkReg : false,
            dakRoleList:[],

            async getMkReg() {
                const response = await fetch.get(`/api/eps/control/main/getMkReg?mkbh=DMZSGN`);
                if (response && response.status === 200) {
                    if(response.data && response.data.success && "Y"==response.data.message){
                        this.MkReg = true;
                    }else {
                        return;
                    }
                }
            },

            async getRolerenderlist() {
                let url="/api/eps/control/main/role/queryForList";
                const response=await fetch.get(url);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        this.rolerenderlist = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));

                    }else{
                        return;
                    }
                }
            },



            async queryQwtmgzList() {
                const response = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=A`);
                if (response && response.status === 200) {
                    this.qwtmgzlstA = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
                    //   console.log('qwjsqxStore.qwtmgzlst',this.qwtmgzlst)
                }else{
                    return;
                }
            },

            async queryQwywgzList() {
                const response = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=B`);
                if (response && response.status === 200) {
                    this.qwywgzlstB = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
                    //          console.log('qwjsqxStore.qwywgzlst',this.qwywgzlst)
                }else {
                    return;
                }
            },

            async queryQwgzList() {
                let a=[];
                let b=[];

                const response1 = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=A`);
                if (response1 && response1.status === 200) {
                    a = response1.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
                }else {
                    return;
                }
                const response = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=B`);
                if (response && response.status === 200) {
                    b = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
                }else {
                    return;
                }
                this.qwgzlst=a.concat(b);
            },


            async queryDakRole() {
                // if (!this.dwData || this.dwData.length === 0) {
                const response = await fetch.get(`/api/eps/control/main/dakrole/queryForDakroleList`);
                if (response.status === 200) {

                    if (response.data.length > 0) {

                        this.dakRoleList = response.data;
                    }
                    return;
                }
            },

        }

    ));




    const tableProp: ITable = {
        tableSearch: false,
      onSearchClick: (form,ts) => {
        form.setFieldsValue({searchdwid: ts?.params?.treeData})
      }
    }


    const [sjgzlst , setSjgzlst]= useState<Array<Object>>([]);
    const [daksearchdisable , setDaksearchdisable]= useState(true);
    const [dakeditdisable , setDakeditdisable]= useState(true);
    const [daksearch , setDaksearch]= useState<Array<Object>>([]);
    const [dakedit , setDakedit]= useState<Array<Object>>([]);
    //const [tmztsearchdisable , setTmztsearchdisable]= useState(true);

    const [tmztSearchData , setTmztSearchData]= useState<Array<Object>>([]);
    const [tmztEditData , setTmztEditData]= useState<Array<Object>>([]);

    let ztList = [{value: "", label: "全部"}, {value: "1", label: "文件收集"}, {value: "2", label: "文件整理"},
        {value: "3", label: "档案管理"}, {value: "4", label: "档案利用"}, {value: "5", label: "档案编研"},
        {value: "8", label: "档案鉴定"}, {value: "9", label: "三段式收集"}, {value: "10", label: "档案分发"},
        {value: "-1", label: "电子文件中心"}, {value: "0", label: "电子文件分发"}];
    if(sjqxStore.MkReg){
        ztList= [{value: "", label: "全部"}, {value: "1", label: "文件收集"}, {value: "2", label: "文件整理"},
            {value: "3", label: "档案管理"}, {value: "4", label: "档案利用"}, {value: "5", label: "档案编研"},
            {value: "8", label: "档案鉴定"}, {value: "9", label: "三段式收集"}, {value: "10", label: "档案分发"},
            {value: "11", label: "功能"}, {value: "-1", label: "电子文件中心"}, {value: "0", label: "电子文件分发"}];
    }else{
        ztList = [{value: "", label: "全部"}, {value: "1", label: "文件收集"}, {value: "2", label: "文件整理"},
            {value: "3", label: "档案管理"}, {value: "4", label: "档案利用"}, {value: "5", label: "档案编研"},
            {value: "8", label: "档案鉴定"}, {value: "9", label: "三段式收集"}, {value: "10", label: "档案分发"},
            {value: "-1", label: "电子文件中心"}, {value: "0", label: "电子文件分发"}];
    }



    const pcodeChange=(value) =>{
        if(value == "A"){
            setSjgzlst(sjqxStore.qwtmgzlstA);
        }else if(value == "B"){
            setSjgzlst(sjqxStore.qwywgzlstB)
        }

    }



    const editlxChange=(value) =>{

        if(value == "2"){
            setDakeditdisable(false);
            if(tableStore){

                let dwid="";
                if(tableStore?.params.treeData && tableStore?.params.treeData !=""){
                    dwid=tableStore?.params.treeData;
                }

                fetch.get(`/api/eps/control/main/dak/queryForList?orderby=DAK_MBC&dw=`+dwid).then(res => {
                    if (res && res.status === 200) {
                        if (res.data.length > 0) {
                            let sdata = res.data.map(o => ({'id': o.id, 'label': o.bh + '|' + o.mc, 'value': o.id}));
                            setDakedit(sdata);
                        }else{
                            setTmztEditData([]);
                        }
                    }
                });

            }
        }else{
            setTmztEditData([]);
            setDakeditdisable(true);
        }

    }

    const searchlxChange=(value) =>{

        if(value == "2"){
            setDaksearchdisable(false);
            if(tableStore){
                let dwid="";
                if(tableStore?.params.treeData && tableStore?.params.treeData !=""){
                    dwid=tableStore?.params.treeData;
                }

                fetch.get(`/api/eps/control/main/dak/queryForList?orderby=DAK_MBC&dw=`+dwid).then(res => {
                    if (res && res.status === 200) {
                        if (res.data.length > 0) {
                            let sdata = res.data.map(o => ({'id': o.id, 'label': o.bh + '|' + o.mc, 'value': o.id}));
                            setDaksearch(sdata);
                        }
                    }else{
                        setTmztSearchData([]);
                    }
                });

            }
        }else{
            setDaksearchdisable(true);
            setTmztSearchData([]);
        }



        if(value == "2"){
            // (false);
        }

    }



    const [initParams, setInitParams] = useState({})
    const ref = useRef();
    const [qjjslist, setQjjslist]= useState<Array<{id:string;label:string;value:string}>>([]);


    useEffect(() => {
        debugger
        console.log(props)
        sjqxStore.queryQwtmgzList();
        sjqxStore.queryQwywgzList();
        sjqxStore.queryQwgzList();
        sjqxStore.getMkReg();
        sjqxStore.getRolerenderlist();

        setTableStore(ref.current.getTableStore());
        setTreeStore(ref.current.getTreeStore());

    }, []);

    useEffect(() => {



        const queryQjjsList =  async () =>{
            if(tableStore){
                let url="/api/eps/control/main/role/queryForList";

                if(tableStore?.params.treeData && tableStore?.params.treeData !=""){
                    url=url+"?dwid="+tableStore?.params.treeData;
                }
                const response=await fetch.get(url);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        let  SjzdData = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
                        setQjjslist(SjzdData);

                    }else{
                        setQjjslist(response.data);
                    }
                }
            }

        }

        queryQjjsList()
    }, [tableStore?.key])


    useEffect(() => {
        const settarDs =  () => {
            setSjgzlst(sjqxStore.qwgzlst);

        }

        settarDs()
    },[sjqxStore.qwgzlst])


    // 自定义表单

    const span = 24;
    const _width = 240
    const customForm = () => {

        return (
            <>
                <Row gutter={20}>
                    <Col span={span}>
                        <Form.Item label="类型:" name="pcode" >
                            <Select  className="ant-select"   placeholder="请选择"
                                     style={{width:  _width}}
                                     onChange={pcodeChange}
                            >
                                <option value=""></option>
                                <option value="A">条目</option>
                                <option value="B">原文</option>

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="设置方式:" name="lx" >
                            <Select  className="ant-select"   placeholder="请选择" style={{width:  _width}}
                                     value="1" onChange={editlxChange}>
                                <option value="1">按角色设置</option>
                                <option value="2">按档案库设置</option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="档案库:" name="dakid" >
                            <Select  className="ant-select"   placeholder="请选择"
                                     options={dakedit} style={{width:  _width}} disabled={dakeditdisable}/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="状态:" name="tmzt" >
                            <Select   className="ant-select"
                                      style={{width:  _width}}
                                      placeholder="请选择"
                                      options={ztList}
                            >

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="角色:" name="roleid" required rules={[{ required: true, message: '请选择角色' }]}>
                            <Select  className="ant-select"   placeholder="请选择"
                                     options={qjjslist}
                                     style={{width:  _width}}/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="权限:" name="value" required rules={[{ required: true, message: '请选择权限' }]}>
                            <Select  className="ant-select"   placeholder="请选择"
                                     options={sjgzlst} style={{width:  _width}}/>
                        </Form.Item>
                    </Col>

                    <Col span={span}>
                        <Form.Item label="维护人:" name="whr" >
                            <Input disabled defaultValue={yhmc} className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="维护时间:" name="whsj" >
                            <Input disabled defaultValue={getDate} className="ant-input"  style={{width:  _width}} />
                        </Form.Item>
                    </Col>
                </Row>

            </>
        )
    }


    const source: EpsSource[] = [

        {
            title: '类型',
            code: 'pcode',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if(text=='A'){
                    return '条目';
                }else if(text=='B'){
                    return '原文';
                }else {
                    return '未知';
                }

            }
        },
        {
            title: '档案库编号',
            code: 'dakcode',
            align: 'center',
            width: 100,
            formType: EpsFormType.Input
        },
        {
            title: '档案库名称',
            code: 'dakmc',
            align: 'center',
            formType: EpsFormType.Input,
        },
        {
            title: '状态',
            code: 'tmzt',
            align: 'center',
            formType: EpsFormType.Input,
            width: 100,
            render:function(value){

                let mc = ztList.filter(ite => {

                    return ite.value === value
                })
                return (<>{mc[0]?.label}</>)
            },
        },
        {
            title: '角色',
            code: 'roleid',
            align: 'center',
            width: 180,
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                let  roleList = sjqxStore.rolerenderlist;
                if (roleList) {
                    // for (let j = 0, l = roleList.length; j < l; j++) {
                    //     let g = roleList[j];
                    //     if (g.id == record.id ) return g.code+"|"+g.name;
                    // }
                    let aa = roleList.filter(item => {
                        return item.value === text;
                    })
                    return aa[0]?.label;

                }
            },
        },
        {
            title: '权限',
            code: 'value',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {

                if (sjgzlst) {
                    // console.log("jflsddjfldsf",sjgzlst)
                    let aa = sjgzlst.filter(item => {
                        return item.value === text;
                    })
                    return aa[0]?.label;
                }
            }

        },
        {
            title: '维护人',
            code: 'whr',
            align: 'center',
            width: 100,
            formType: EpsFormType.Input
        },
        {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            width: 160,
            formType: EpsFormType.Input
        }
    ]
    const title = {
        name: '数据权限'
    }
    const [sss, setSss]= useState();

  useEffect(() => {
    console.log('treeData', treeStore?.key, tableStore?.params?.treeData);
    setSss(treeStore?.key)

  }, [treeStore?.key])


    const searchFrom = () => {

      // console.log("lajflsjf=treeStore==",treeStore);
        return (
            <>
                {/* <Form.Item label="角色:" name="roleid" initialValue={roleFirst} >
                    <Select  className="ant-select"   placeholder="请选择"
                        options={qjjslist} />
                    </Form.Item> */}
                <Form.Item label="设置方式:" name="lx" initialValue="1">
                    <Select  className="ant-select"   placeholder="请选择"  onChange={searchlxChange}>
                        <option value="1">按角色设置</option>
                        <option value="2">按档案库设置</option>
                    </Select>
                </Form.Item>
                <Form.Item label="档案库状态:" name="tmzt" >
                    <Select  className="ant-select"   placeholder="请选择"
                             options={ztList} />
                </Form.Item>
                <Form.Item label="档案库:" name="dakid" >
                    <Select  className="ant-select"   placeholder="请选择"
                             options={daksearch}  disabled={daksearchdisable} />
                </Form.Item>
                <Form.Item  name="searchdwid" hidden>
                    <input    value={treeStore?.key}  hidden />
                </Form.Item>
                <Form.Item  name="jslx" hidden>
                    <input  hidden value="2"/>
                </Form.Item>
            </>
        )
    }


    /**
     * 查询
     * @param {*} current
     */
    /*    const OnSearch = (values: any, store: EpsTableStore) => {
            store && store.findByKey(store.key, 1, store.size, values);
        };*/

    // 自定义查询按钮
    const customAction = (store: EpsTableStore) => {
        return ([
            <>

            </>
        ])
    }
  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
  }




    return (

        <EpsPanel
            title={title}
            source={source}
            ref={ref}
            treeProp={treeProp}
            treeService={DwService}
            tableProp={tableProp}
            //   customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={SjqxService}
            customForm={customForm}
            customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            searchForm={searchFrom}
            initParams={initParams}
            noRender={true}
            selectService={SelectService}
        >
        </EpsPanel>

    );
})

export default Sjqx;
