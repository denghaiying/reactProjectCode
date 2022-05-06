import React, {useRef, useState} from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
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
  AuditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined, ExclamationCircleOutlined, FolderOutlined, ImportOutlined, SaveOutlined,
  SearchOutlined,
  SyncOutlined,
  ToolOutlined
} from "@ant-design/icons";
import SysStore from "@/stores/system/SysStore";
import moment from "moment";
import {observer, useLocalObservable} from "mobx-react";
import fetch from "@/utils/fetch";
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { ruRUIntl } from '@ant-design/pro-provider';

const { Panel } = Collapse;
const { confirm } = Modal;

interface IProp {
    store: EpsTableStore;
    record:{};
}

const YwzdOne = observer((props: IProp) =>{
    console.log("ywzdone",props)

  const {umid="DAK0083",umname="档案指导"} = props;

  const ref = useRef();

 const [selectedRow, setSelectedRow] = useState([]);

 const [form]= Form.useForm();
 const [formzd] = Form.useForm();


  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD');


  const [zdVisible, setZdVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [plzdVisible, setPlzdVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  // 本地store
  const ywzdoneStore = useLocalObservable(() => (
    {
    
      dataSource:[],
      mcdataSource:[],
      logSource:[],
      items:[],
      logCount:0,

      async applyZd(info,rows) {
   
        let ids = props.record.id;
        // if(rows){
          
        //   for(let i=0;i<rows.length;i++){
        //       ids += (","+rows[i].tmid);
        //   }
        //   ids = ids.substring(1);
        // }

        console.log('applyzd',info,rows);
        const formData = new FormData();
        formData.append('whrid', SysStore.getCurrentUser().id);
        formData.append('whr', SysStore.getCurrentUser().yhmc);
        formData.append('wtms', info.wtms);
        formData.append('zdnr', info.zdnr);
        formData.append('ids', ids);
        formData.append('bmc', props.record.bmc);
        formData.append('wtlx', info.wtlx);

        const response=await fetch
          .post(`/api/eps/control/main/dazd/addDazdmxnr`, formData, { headers: { 'Content-type': 'application/x-www-form-urlencoded',dataType: "json", } });
          
          if (response && response.status === 200) {
            if (response.data.success) {
              message.success(`保存成功!`)
            } else {
            
                message.error("保存失败！",  response.data.messag);
            }

        }
   },

      async loadHistory(row) {
        const rr=props.record;
        const response = await fetch.post(`/api/eps/control/main/dazd/queryforDazdmxnr?datmid=`+rr.id);
        
        if (response.status === 200) {
          this.logSource = response.data;

        }
      },

      async loadHistoryCount(row) {
        const rr=props.record;
         
        const response = await fetch.post(`/api/eps/control/main/dazd/queryforDazdmxnr?datmid=`+rr.id);
        
        if (response.status === 200) {
          this.logCount=response.data.length;
        }
      },

      


      async querySjzdMc() {

        const response = await fetch.post(`/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?mc=业务指导问题类型`);
        if (response.status === 200) {
          this.mcdataSource = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.mc }));;
        }
      },
  
      async query() {
          const rr=props.record;
        this.dataSource.push(rr);
          
        const response = await fetch.post(`/api/eps/control/main/dazd/queryforDazdmxnr?datmid=`+rr.id);
        
        if (response.status === 200) {
          this.logCount=response.data.length;
        }

        // const url = "/api/eps/control/main/dazdtemp/queryForList" ;

        // const res = await fetch.get(url);
        // console.log('responenAll',res);
        // debugger;
        // if (res && res.status === 200) {
        // //  this.dataSource = res.data;
        //   const sjData = [];
        //   if (res.data.length > 0) {
        //     for (let i = 0; i < res.data.length; i++) {
        //       let newKey = {};
        //       newKey = res.data[i];
        //       newKey.key=newKey.id;
        //       const response = await fetch.post(`/api/eps/control/main/dazd/queryforDazdmxnr?datmid=`+newKey.tmid);
        //       if (response.status === 200) {
        //         newKey.count = response.data.length;
        //       }
        //       sjData.push(newKey)
        //     }
        //     this.dataSource = sjData;
        //   }
        // } else {
        //   return;
        // }
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
    ywzdoneStore.query();
    ywzdoneStore.querySjzdMc();
  }, []);


  const [gridData,setGridData] =useState([]);


  const getGridData = ()=>{
    const uo= ywzdoneStore.dataSource;
    setGridData(uo);
  }


  useEffect(() => {
    getGridData();
    
  }, [
    ywzdoneStore.dataSource
  ]);

  const handleOk = async (record) => {
    ywzdoneStore.delete(record);
    ywzdoneStore.loadHistoryCount(record);
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
  const [srow, setSrow] = useState({});

  const showzd=(record)=>{
    setSrow(record);
    ywzdoneStore.loadHistory(record);
   // DazdStore.loadHistoryCount(record);
    setZdVisible(true);
  };

 

  const showlog=(record)=>{
    setSrow(record);
    ywzdoneStore.loadHistory(record);
  //  DazdStore.loadHistoryCount(record);
    setLogVisible(true);
    
    console.log('dddddddd=',selectedRow);
    // <EpsModalButton name="历史指导意见" title="历史指导意见" width={600}   useIframe={true}  
    //     params={{id: record.id}} url={'/api/eps/control/main/dazdtemp/ckzdmxnr'}  icon={<FolderOutlined />}/>
  };



  const source = [{
    title: '操作',
    key:'option',
    align: 'center',
    fixed: 'left',
    width: 100,
    render: (text,record,index) => {
     // DazdStore.loadHistoryCount(record);
      return(
        <>
        <Tooltip title="移除">
          <Button size="small" danger={true} style={{ fontSize: '12px' }} type={'primary'}
            shape="circle" icon={<DeleteOutlined />}
            onClick={() => showConfrim(record)} />
        </Tooltip>
        <Tooltip title="指导">
            <Button size="small"  style={{ fontSize: '12px' }} type={'primary'}
              shape="circle" icon={<AuditOutlined />}
              onClick={() => showzd(record)} />
          </Tooltip>
          <Tooltip title="历史指导意见">
            <Badge size={"small"} count={ywzdoneStore.logCount ? ywzdoneStore.logCount : 0}>
                <Button size="small"  style={{ fontSize: '12px' }} type={'primary'}
                  shape="circle" icon={<FolderOutlined />}
                  onClick={() => showlog(record)} />
              </Badge>
          </Tooltip>
          
          </>
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

        ywzdoneStore.apply(data).then(res => {
        //  message.success('密码修改成功');
      //  BykfdbmhStore.query();
      form.resetFields();
      }).catch(err => {
        message.error(err)
      })

    }).catch(err => {
      message.error(err)
    })
  };

  // const onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   setSelectedRow(selectedRows);
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows);
      console.log(`selectedRowKeys1: `,selectedRowKeys, 'selectedRows1: ', selectedRows);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    
   };

  const showplzd = ()=>{
    const row = selectedRow;
    debugger;
    if (row.length == 0) {
        message.info("请至少选择一条数据！");
        return;
    }else{
        ywzdoneStore.loadHistory(row[0]);
      setZdVisible(true);
      
    }

  };

  const onFinishZd = (values: any) => {
    // let rows = selectedRow;
    // debugger;
    // if(rows && rows.length<=1){
    //   rows.push(srow);
    // }
    // debugger
    const rows=props.record;
    formzd.validateFields().then(data => {

        ywzdoneStore.applyZd(data,rows).then(res => {
          
            ywzdoneStore.loadHistory(rows);
            ywzdoneStore.query(); 
        setSrow({});
        setSelectedRow([]);
        rowSelection.onChange("",[]);
        formzd.resetFields();
      }).catch(err => {
        message.error(err)
      })
    }).catch(err => {
      message.error(err)
    })
  };


  const span = 12

    const _width=320;
  return (
    <>
             <Tooltip title="业务指导">
            <a key={`fileView_${props.record.id}`} style={{ width: 22, margin: "0 5px" }} onClick={()=>setVisible(true)}>
              
                {/* <Badge size="small" count={ywzdoneStore.logCount}>   */}
                 <AuditOutlined style={{ color: "#55acee" }} />
                {/* </Badge> */}
                </a>
            </Tooltip >

            <Modal
                title="指导"
                centered
                visible={visible}
                footer={null}
                width={900}
                // style={{maxHeight: "600px",height:"600px"}}
                onCancel={() => setVisible(false)}
            >
       
    <div >
      <Space direction="vertical">
        <div style={{width: 860}}>
      <Form 
            form={form}
            onFinish={onFinish}
            name="form1"
      >
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
                  <Form.Item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;指导人" initialValue={yhmc} name="whr"   >
                        <Input disabled  style={{width:  _width}}/>
                  </Form.Item>
                </Col>
              
                 
               <Col span={24} style={{height:  75}} >
                <Form.Item  label="指导说明"   name="zdyj" rules={[{ required:true, message: '请填写指导说明!' }]}>
                  <Input.TextArea  
              //    placeholder="请输入对利用目的详细说明" 
                  rows={3} 
                   style={{width:  '98%'}}
                    ></Input.TextArea>
                </Form.Item>
                </Col>
              </Row>
        <Divider orientation="left" plain>指导清单</Divider>
       

          <div  style={{ overflowX: 'auto', overflowY: 'auto'}}
          //  style={{height: '100px'}}
          >
            <Table  columns={source} dataSource={ywzdoneStore.dataSource} bordered scroll={{ x: '100%' }}
                   pagination={false}
                   className="my-table"
                   scroll={{
                     y: 80,
                     x: 850
                   }}
                   expandable={{
                     defaultExpandAllRows: true
                   }}
            />
          </div>
          <div style={{height: '30px'}} />
         
            <div className="btns" style={{ textAlign: 'right' ,height:'30px', marginTop: '10px',marginRight: '10px',padding:' 0 20px'}}>
              <Button type="primary" htmlType="submit" style={{ fontSize: '12px' }}  icon={<SaveOutlined />}>提交</Button>
              &nbsp;&nbsp;&nbsp; 
              <Button type="primary" onClick={() =>  form.resetFields()} style={{ fontSize: '12px' }}  icon={<SaveOutlined />}>取消</Button>     
            </div>
      </Form>
      </div>
      </Space>
    </div>
      </Modal>
      <Drawer title="历史指导意见" placement="right" onClose={() => setLogVisible(false)} visible={logVisible}>
        <div>
        <List
              itemLayout="horizontal"
              dataSource={ywzdoneStore.logSource}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                 //    title={<p>指导人：{item.whr}&nbsp;&nbsp;&nbsp;{item.whsj}</p>}
                     description={
                      <><div>
                         <p>指导人员：{item.whr}</p>
                         <p>指导时间：{item.whsj}</p>
                         <p>问题类型：{item.wtlx}</p>
                         <p>问题描述：{item.wtms}</p>
                         <p>信息：指导内容: {item.zdnr} &nbsp;&nbsp;&nbsp;更正内容:{item.gznr}</p>
                       </div><hr /></>}
                  />
                </List.Item>
              )}
            />
              
        </div>
      </Drawer>             
                    
      <Modal
        title="指导"
        centered
        visible={zdVisible}
        footer={null}
        onCancel={() => setZdVisible(false)}
        width={600}
      >
          <Form 
            form={formzd}
            onFinish={onFinishZd}
            name="form2"
      >
       
              <Row>
              <Col span={24}  >
                  <Form.Item
                    label="问题类型"
                    name="wtlx" 
                    rules={[{ required:true, message: '请选择问题类型!' }]}
                  >
                     <Select    placeholder="问题类型" className="ant-select"   options={ywzdoneStore.mcdataSource} 
                     style={{width:  '98%'}}/>
                  </Form.Item>
                </Col>
                <Col span={24} >
                  <Form.Item label="问题描述" rules={[{ required:true, message: '请填写问题描述!' }]} name="wtms"   >
                        <Input   style={{width:  '98%'}}/>
                  </Form.Item>
                </Col>
              
                 
               <Col span={24}  >
                <Form.Item  label="详细内容"   name="zdnr" rules={[{ required:true, message: '请填写详细内容!' }]}>
                  <Input.TextArea  
              //    placeholder="请输入对利用目的详细说明" 
                  rows={3} 
                   style={{width:  '98%'}}
                   />
                </Form.Item>
                </Col>
              </Row>
              <Row >
          <Col span={24} style={{ textAlign: 'right' }}>
            <div className="btns" style={{textAlign:'right' ,height:'30px', marginTop: '10px',marginRight: '10px',padding:' 0 20px'}}>
              <Button type="primary" htmlType="submit" style={{ fontSize: '12px' }}  icon={<SaveOutlined />}>保存</Button>
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() =>  formzd.resetFields()} style={{ fontSize: '12px' }}  icon={<SaveOutlined />}>取消</Button>     
            </div>
          </Col>
        </Row>
        <Divider orientation="left" plain>历史问题</Divider>
 
          <div
            style={{height: '240px', overflowY: 'auto'}}
          >
           
           <List
              itemLayout="horizontal"
              dataSource={ywzdoneStore.logSource}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                   //  title={<a href="https://ant.design">{item.whsj}</a>}
                     description={
                      <><div>
                         <p>问题类型：{item.wtlx}</p>
                         <p>问题描述：{item.wtms}</p>
                         <p>指导内容：{item.zdnr}</p>
                       </div><hr /></>}
                  />
                </List.Item>
              )}
            />
          
          </div>
      </Form>
      </Modal>
    </>
  );
})

export default YwzdOne;
