import React, {useRef, useState} from 'react';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  message, Modal,
  Row,
  Select, Space, Switch,
  Table,
  Tooltip
} from 'antd';
import './index.less'
import {EpsSource, ITable, ITitle} from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined, ExclamationCircleOutlined, ImportOutlined, SaveOutlined,
  SearchOutlined,
  SyncOutlined,
  ToolOutlined
} from "@ant-design/icons";
import SysStore from "@/stores/system/SysStore";
import moment from "moment";
import {observer, useLocalObservable} from "mobx-react";
import fetch from "@/utils/fetch";

const { Panel } = Collapse;
const { confirm } = Modal;

const Dazd = observer((props) => {

  console.log("dazdprops===",props);

  const {umid="DAK0083",umname="档案指导"} = props;

  const ref = useRef();

  const [rowSelection, setRowSelection] = useState(props.tableProp?.rowSelection);


  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD');

  const [initParams, setInitParams] = useState({});
 // const [umid, setUmid] = useState('');
  const [checkJysm, setCheckJysm] = useState(true);
  const [checkLymd, setCheckLymd] = useState(true);
  //借阅单是否启用防扩散功能，判断文件下载，打开，打印次数是否显示
  const [checkFksshow, setCheckFksshow] = useState(false);

  // 本地store
  const DazdStore = useLocalObservable(() => (
    {
    
      dataSource:[],

     
      async query() {
        const url = "/api/eps/control/main/dazdtemp/queryForList" ;

        const res = await fetch.get(url);
        console.log('responenAll',res);
        debugger;
        if (res && res.status === 200) {
          this.dataSource = res.data;
        } else {
          return;
        }
        // const res = await fetch.post(`/api/eps/control/main/dazdtemp/queryForPage`, this.params, {
        //     params: {

        //         pageIndex : "0",
        //         sortOrder : "asc",
        //         sortField : "dh",
        //         start : "0",
        //         limit : "500",
        //         pageSize : "500",
        //       ...this.params,
        //     },
        //   });
        //   console.log('responenAll',res);
        //   if (res && res.status === 200) {
        //     this.dataSource = res.data.results;
        //   } else {
        //     return;
        //   }

      },

      async delete(record) {
        console.log("recorddelete==",record)
        const url="/api/eps/control/main/dazdtemp/deletetemp?id="+record.id;
        const response=await fetch.post(url);

        if (response && response.status === 200) {
            const url1 = "/api/eps/control/main/dazdtemp/queryForList" ;
            const res = await fetch.get(url1);
          if (res && res.status === 200) {
            this.dataSource = res.data;
          } else {
            return;
          }
        } else {
          return
        }
      },


      
      async apply(bdInfo) {

    
              const getDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
              const formData = new FormData();
              formData.append('dwid', SysStore.getCurrentUser().dwid);
              formData.append('whrid', SysStore.getCurrentUser().id);
              formData.append('whr', SysStore.getCurrentUser().yhmc);
              formData.append('zdyj', bdInfo.zdyj);
              formData.append('whsj', getDateTime);


              const response=await fetch
                .post(`/api/eps/control/main/dazd/apply`, formData, { headers: { 'Content-type': 'application/x-www-form-urlencoded',dataType: "json", } });
                debugger
                if (response && response.status === 200) {
                  if (response.data.success) {
                    message.success(`加入指导成功!`)
                  } else {
                  
                      message.error("操作失败！",  response.data.messag);
                  }

              }
         },
    }
  ));



  useEffect(() => {
    DazdStore.query();
  }, []);


  const [gridData,setGridData] =useState([]);


  const getGridData = ()=>{
    const uo= DazdStore.dataSource;
    setGridData(uo);
  }


  useEffect(() => {
    getGridData();
  }, [
    DazdStore.dataSource
  ]);

  const handleOk = async (record) => {
    DazdStore.delete(record);
    // DazdStore.query();
    // Modal.destroyAll();
  };



  const handleCancel = () => {
    console.log('Clicked cancel button');
  };


  function showConfrim(record) {
    confirm({
      title: `确定要移除这条数据么?`,
      icon: <ExclamationCircleOutlined />,
      content: '数据移除后将无法进行档案指导，请谨慎操作!',
      okText: '移除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => { handleOk(record)},
      onCancel: handleCancel,
    });
  };

  const source = [{
    title: '操作',
    key:'option',
    align: 'center',
    //  fixed: 'left',
    width: 100,
    render: (text,record,index) => {
      return(
        <Tooltip title="移除">
          <Button size="small" danger={true} style={{fontSize: '12px'}} type={'primary'}
                  shape="circle" icon={<DeleteOutlined />}
                  onClick={() =>showConfrim(record)}/>
        </Tooltip>
      )},
  },{
    title: '序号',
    align: 'center',
    fixed: 'left',
    width: 60,
    render: (_, __, index: number) => index+1 ,
    },
    {
      title: '档号',
      dataIndex: 'dh',
      align: 'center',
      fixed: 'left',
      width: 120,
      formType: EpsFormType.Input
    },{
      title: '题名',
      dataIndex: 'tm',
      align: 'center',
      fixed: 'left',
      width: 200,
      formType: EpsFormType.Input
    },{
      title: '年度',
      dataIndex: 'nd',
      align: 'center',
      fixed: 'left',
      width: 80,
      formType: EpsFormType.Input
    },{
      title: '保管期限',
      dataIndex: 'bgqx',
      align: 'center',
      fixed: 'left',
      width: 120,
      formType: EpsFormType.Input
    },{
        title: '文号',
        dataIndex: 'wh',
        align: 'center',
        fixed: 'left',
        width: 120,
        formType: EpsFormType.Input
      },{
        title: '机构问题',
        dataIndex: 'jgwt',
        align: 'center',
        fixed: 'left',
        width: 120,
        formType: EpsFormType.Input
      },{
        title: '密级',
        dataIndex: 'mj',
        align: 'center',
        fixed: 'left',
        width: 100,
        formType: EpsFormType.Input
      },{
        title: '全宗号',
        dataIndex: 'qzh',
        align: 'center',
        fixed: 'left',
        width: 150,
        formType: EpsFormType.Input
      },{
        title: '全宗名称',
        dataIndex: 'qzmc',
        align: 'center',
        fixed: 'left',
        width: 200,
        formType: EpsFormType.Input
      },
  ]

  const title: ITitle = {
    name: '档案指导'
  }



  const onFinish = (values: any) => {
    form.validateFields().then(data => {

        DazdStore.apply(data).then(res => {
        //  message.success('密码修改成功');
      //  BykfdbmhStore.query();
      }).catch(err => {
        message.error(err)
      })

    }).catch(err => {
      message.error(err)
    })
  };


  const [form]= Form.useForm()
  const span = 12

    const _width=320;
  return (
    <>
    <div style={{height: '100%', overflowX: 'auto', overflowY: 'auto'}}>
      <div className={props.umname ? "title": ""}>{props.umname}</div>
      <Space direction="vertical">
        <div style={{width: 820}}>
      <Form 
            form={form}
            onFinish={onFinish}
            name="form1"
      >
        <Row >
          <Col >
            <div className="btns" style={{marginTop: '10px',marginRight: '10px',padding:' 0 20px'}}>
              <Button type="primary" htmlType="submit" style={{ fontSize: '12px' }}  icon={<SaveOutlined />}>提交</Button>
              &nbsp;&nbsp;&nbsp;
        
            </div>
          </Col>
        </Row>

        <Divider orientation="left" plain>指导信息</Divider>
              <Row>
              <Col span={span}  >
                  <Form.Item
                    label="&nbsp;&nbsp;&nbsp;指导日期"
                    name="whsj" 
                    initialValue={getDate}
                  >
                    <Input disabled  style={{width:  _width}}/>
                  </Form.Item>
                </Col>
                <Col span={span} >
                  <Form.Item label="指导人" initialValue={yhmc} name="whr"  rules={[{ required:true, message: '请选择栏目!' }]} >
                        <Input disabled  style={{width:  _width}}/>
                  </Form.Item>
                </Col>
              
               
                             
               <Col span={24}  >
                <Form.Item  label="指导说明"   name="zdyj" rules={[{ required:true, message: '请填写指导说明!' }]}>
                  <Input.TextArea  
              //    placeholder="请输入对利用目的详细说明" 
                  rows={4} 
                   style={{width:  '98%'}}
                    ></Input.TextArea>
                </Form.Item>
                </Col>
              </Row>
            
             
        <Divider orientation="left" plain>指导清单</Divider>
          <div
            style={{height: '240px'}}
          >
            <Table columns={source} dataSource={DazdStore.dataSource} bordered scroll={{ x: 'max-content' }}
                   pagination={false}
                   className="my-table"
                   scroll={{
                     y: 230,
                     x: 990
                   }}
                   expandable={{
                     defaultExpandAllRows: true
                   }}
            />
          </div>
      </Form>
      </div>
      </Space>
    </div>
    </>
  );
})

export default Dazd;
