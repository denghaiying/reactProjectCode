import React, {useEffect, useRef, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row, TreeSelect} from 'antd';
import { observer, useLocalStore } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
import fetch from '@/utils/fetch';
import moment from 'moment';
import SsService from './service/SsService';
import Fzys_bak from '../kp/fzys_bak';
import wdglAttachdocService from "@/pages/dagl/Dagl/AppraisaManage/WdglAttachdocService";
import EpsUploadButton from "@/eps/components/buttons/EpsUploadButton";
import {IUpload} from "@/eps/components/upload/EpsUpload";
const FormItem = Form.Item;
const { TextArea } = Input;

const tableProp: ITable = {
    tableSearch: true,
    disableEdit: false,
    disableDelete:false,
    disableAdd:true,
    disableCopy:true
}

const Kp = observer((props) =>{

    const [umid, setUmid] = useState('');
    const ref = useRef();

      /**
   * 获取当前用户名称
   */
  const yhmc = SysStore.getCurrentUser().yhmc

  /**
   * 获取当前用户ID
   */
  const yhid = SysStore.getCurrentUser().id
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const store = useLocalStore(() => ({


        dwTreeData: [],

        dwData:[],


        async queryForListByYhid() {
            const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid`);
                if (response.status === 200) {
                if (response.data.length > 0) {
                    this.dwData = response.data;
                }
            }
        },


        async querydwTree() {
            const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
                if (response.status === 200) {
                var sjData = [];
                if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                    let newKey = {};
                    newKey = response.data[i];
                    newKey.key = newKey.id
                    newKey.title = newKey.mc
                    sjData.push(newKey)
                    }
                    this.dwTreeData = sjData;
                }
            }
        },

      }));

        /**
   * 上传组件prop
   */
  const uploadProp: IUpload = {
    disableUpload: false, // 上传按钮
    disableBigUpload: true, // 大文件上传按钮
    disableDown: false, // 下载按钮
    disableYwDown: true, // 水印下载
    disableViewDoc: true, // 查阅
    disableYwViewDoc: true, // 水印查阅
  //  uploadUrl: '/api/eps/control/main/fzpsfj/upload', // 上传url地址
  uploadUrl: '/api/eps/wdgl/attachdoc/uploadFzps', // 上传url地址
    doctbl: 'FZPSFJ', // 附件表名
    grptbl: 'FZPSDOCGROUP', // 附件分组表名
    wrkTbl: 'FZPS', // 数据表名
    // dakid: dakid,
    dw: SysStore.getCurrentCmp().id, // 用户单位ID
    umId: 'FZPS003',
  };

  // 附件列表信息
  const uploadtableProp: ITable = {
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    tableSearch: false,
    labelColSpan: 8,
    rowSelection: {
      type: 'check',
    },
  };

  /**
   * 附件列表 表格source
   */
  const fjsource: EpsSource[] = [
    {
      title: '标题',
      code: 'title',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件名',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件类型',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件大小',
      code: 'fullsize',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '备注',
      code: 'desc',
      align: 'center',
      formType: EpsFormType.Input,
    },

  ];



    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(SsService));
    const customTableAction = (text, record, index, store) => {

        return (<>
           <Fzys_bak record={record}/>
          <EpsUploadButton
            title={'附件信息'} // 组件标题，必填
            uploadProp={uploadProp} //附件上传prop
            width={1250}
            source={fjsource}
            height={800}
          //  refesdata={refreshPage}
            grpid={record.filegrpid}
            fjs={record.fjs}
            params={{
              docTbl: 'FZPSFJ',
              docGrpTbl: 'FZPSDOCGROUP',
              grpid: record.filegrpid,
              docTblXt: 'FZPSFJ',
              idvs: JSON.stringify({ id: record.id }),
              wrkTbl: 'FZPS',
              lx: null,
              atdw: 'DEFAULT',
              tybz: 'N',
              whr: yhmc,
              whsj: getDate,
              fjsctrue: true,

            }} //附件上传参数
            tableProp={uploadtableProp} //附件列表prop
            tableService={wdglAttachdocService} //附件列表server
            tableparams={{
              doctbl: 'FZPSFJ',
              grptbl: 'FZPSDOCGROUP',
              grpid: record.filegrpid,
              sfzxbb: '1',
              lx: null,
              ordersql: 'N',
            }} //附件列表参数
          />
        </>)}

    useEffect(() => {
        store.querydwTree();
        store.queryForListByYhid();
        setUmid('FZPS003');
    }, []);

    // const customAction = (store: EpsTableStore) => {
    //     return ([<>
    //         {/* <EpsReportButton store={store} umid={umid} /> */}
    //         //        <EpsReportButton store={store} umid={umid} />
    //     </>])
    // }


    const span = 24;
    const _width = 360


// 自定义表单

    const customForm = () => {
        //自定义表单校验


        return (
            <>
                <Row gutter={20}>
                <Col span={span}>
                        <Form.Item label="单位" name="dw">
                        <TreeSelect style={{width:  _width}} className="ant-select"
                          treeData={store.dwTreeData}
                          placeholder="单位"
                          treeDefaultExpandAll
                        //  onChange={dwChange}
                          allowClear
              />

                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="志书名称" name="fzmc"  rules={[{ required: true, message: '请输入志书名称' }]}
>
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="编者" name="bz"  rules={[{ required: true, message: '请输入编者' }]}
 >
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="主编" name="zb"  rules={[{ required: true, message: '请输入主编' }]}
>
                            <Input style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="副主编" name="fzb" rules={[{ required: true, message: '请输入副主编' }]}
>
                            <Input style={{width:  _width}} className="ant-input" />
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item
                            label="志书说明"
                            name="sm">

                            <Input.TextArea
                                    style={{width:  _width}}
                                    placeholder="请输入志书简略说明"
                                    rows={4}>
                            </Input.TextArea>

                        </Form.Item>

                    </Col>

                    <Col span={span}>
                        <Form.Item label="维护人" name="whr" initialValue={yhmc}>
                            <Input disabled style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="维护时间" name="whsj" initialValue={getDate}>
                            <Input disabled style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                    <Col span={span}>
                        <Form.Item label="状态" name="status" hidden>
                            <Input hidden style={{width:  _width}} className="ant-input"/>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        )
    }

    const source: EpsSource[] = [{
        title: '状态',
        code: 'status',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            if(text=='1') {
              return '登记' ;
            }else if(text=='2'){
              return '登记';
            }else if(text=='3'){
                return '初审';
            }else if(text=='4'){
                return '复审';
            }else if(text=='5'){
                return '终稿';
            }else if(text=='9'){
                return '发布';
            }else{
              return  "未知";
            }
        }
    },
        {
            title: '单位',
            code: 'dw',
            align: 'center',
            width: 250,
            ellipsis: true,         // 字段过长自动东隐藏
            formType: EpsFormType.Input,
            render:function(value){
                let list=store.dwData;
                let mc = list.filter(ite => {
                  return ite.id === value
                })
                return (<>{mc[0]?.mc}</>)
              },
        }, {
            title: "志书名称",
            code: "fzmc",
            align: 'center',
            ellipsis: true,         // 字段过长自动东隐藏
            formType: EpsFormType.Input

        }, {
            title: "编者",
            code: 'bz',
            align: 'center',
            width: 200,
            formType: EpsFormType.Input
        }, {
            title: "主编",
            code: 'zb',
            align: 'center',
            width: 200,
            formType: EpsFormType.Input
        }, {
            title: "副主编",
            code: 'fzb',
            ellipsis: true,         // 字段过长自动东隐藏
            align: 'center',
            width:200,
            formType: EpsFormType.Input
        },
        // {
        //     title: "出版社",
        //     code: 'publisher',
        //     align: 'center',
        //     formType: EpsFormType.Input
        // },
        {
            title: '维护人',
            code: 'whr',
            align: 'center',
            width: 120,
            formType: EpsFormType.Input
        },
        {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            width: 150,
            formType: EpsFormType.Input
        }
    ]
    const title = {
        name: '方志送审管理'
    }

    return (
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={600}
            customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={SsService}
            customForm={customForm}
        >
        </EpsPanel>
    );
})

export default Kp;
