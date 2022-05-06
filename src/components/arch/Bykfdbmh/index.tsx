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
import CartService from "@/pages/daly/jyc/cart/CartService";
import HttpRequest from "@/eps/commons/v2/HttpRequest";
import Sys from "@/pages/sys";
import DbswService from "@/pages/workflow/Dbsw/DbswService";
import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import axios from "axios";
import EpsReportButton from "@/eps/components/buttons/EpsReportButton";

const { Panel } = Collapse;
const { confirm } = Modal;

const Bykfdbmh = observer((props) => {

  console.log("bykfdbmhprops===",props);

  const {umid="DAK0081",umname="发布到门户"} = props;

  const ref = useRef();

  const [key, setKey]= useState(['4']);

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
  const BykfdbmhStore = useLocalObservable(() => (
    {

      paramfj:"",
      lxdata:[],
      userInfo:{},
      dwInfo:{},
      pDALYF002:0,
      lymdData:[],
      dwmc:"",
      pjysm:"",
      plymd:"",
      ptxtxt:"",
      pdyxz:"",
      pfksshow:"",
      pdxtxtshow:"",
      psywzshow:"",
      ptx:"",
      keyList: [],
      filegrpid:"",


      channelidData:[],
      dakDataSource:[],
      colDataSource:[],



      async query() {

        const cols=props.store.columns;
        const colsss = [];
        const coldata=[{
          
            title: '序号',
            align: 'center',
            fixed: 'left',
            width: 60,
            render: (_, __, index: number) => index+1 ,
          
        }];
        for (let i = 0; i < cols.length; i++) {
          colsss.push(cols[i].code);
          const newKey = {};
          const  aa=cols[i];
          newKey['key']=aa.code;
          newKey['title']=aa.title;
          newKey['dataIndex']=aa.code;
          newKey['width'] =aa.width;
          newKey['ellipsis']=true;
          coldata.push(newKey);
        }

        this.colDataSource=coldata;
        console.log('colsss',colsss);


        const yidss=props.store.selectRecords;
        console.log('yidss',yidss)

        //  var sjData = [];
          //  if (totals > 0) {
          //    for (var i = 0; i < response.data.results.length; i++) {
          //      var newKey = {};
          //      newKey = response.data.results[i];
          //      newKey.key = newKey.id;
          //      sjData.push(newKey);
          //    }
          // }
          //  this.lxdata=sjData;

         const idss = [];
        if (yidss.length > 0) {
            for (let i = 0; i < yidss.length; i++) {
              const newKey = {};
              const  aa=yidss[i];
                for(let j=0;j<colsss.length;j++){
                  newKey[colsss[j]]=aa[colsss[j]]
                }
                newKey['key']=aa.key;
                newKey['id'] =aa.id;
                idss.push(newKey);
                console.log('newKey',newKey);
            }
            console.log('idss',idss);
            this.dakDataSource=idss;
          console.log('dakdatasource',this.dakDataSource);
        } else {
            message.warning("请至少选择一行数据!")
            return
        }




      },


      async getChannel() {

        const url="/api/eps/portal/channel/queryForList?yhid="+SysStore.getCurrentUser().id+"&yhlx="+SysStore.getCurrentUser().lx;
        const response=await fetch.get(url);
        
        if (response && response.status === 200) {
          if(response.data) {
            const temp = response.data;
         //   this.channelidData  = response.data.map(o => ({'id': o.id, 'label': o.name, 'value': o.id}));
            const aa=[];
            for(let i=0; i<temp.length;i++)
            {
              const chan=temp[i];
              
              const type=chan.type;
              if(type==='byfb'){
                aa.push(chan);
              }
            }
              if(aa.length>0){
                this.channelidData=aa.map(o => ({'id': o.id, 'label': o.name, 'value': o.id,'key':o.id}));
              }

          }
        } else {
          return
        }
      },
      

      async apply(bdInfo,data) {

       console.log('applyformdata',bdInfo);
       console.log('applydata',data);

       const yidss=props.store.selectRecords;
       const ids = [];

       if(data) {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            // const sjdata = data[i];

            // if (sjdata.dzjy === "N" && sjdata.stjy === "N") {
            //   dzseleed = 1;
            // } else {
            //   newdata.push(sjdata);
            // }
            ids.push(data[i].id);
          }
        }else{
          message.warning("至少存在一条记录才能提交申请!")
         return;
        }
      }


    
            console.log('bdinfo',bdInfo);
              const getDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
              const formData = new FormData();
              formData.append('sqrid', SysStore.getCurrentUser().id);
              formData.append('whrid', SysStore.getCurrentUser().id);
              formData.append('bmc', props.store.ktable.bmc);
              formData.append('tmid', ids.toString());
              formData.append('dakid',  props.params.dakid);
              formData.append('whr', SysStore.getCurrentUser().yhmc);
              formData.append('title', bdInfo.title);
              formData.append('channelid',bdInfo.channelid);
              formData.append('author', bdInfo.author);
              formData.append('datefield', getDateTime);
              formData.append('contentDesc', bdInfo.contentDesc);


              const response=await fetch
                .post(`/api/eps/control/main/daby/fbDmh`, formData, { headers: { 'Content-type': 'application/x-www-form-urlencoded',dataType: "json", } });
                debugger
                if (response && response.status === 200) {
                  if (response.data.success) {
                    message.success(`发布成功！!`)
                  } else {
                  
                      message.error("操作失败！",  response.data.messag);
                  }

              }
         },
    }
  ));



  const [checkedData , setCheckedData] = React.useState([]);
 // const [defaultVals, setDefaultVals] = React.useState([]);



  const onChange = (list) => {
    setCheckedData(list);

  };


  useEffect(() => {

    BykfdbmhStore.query();
    BykfdbmhStore.getChannel();

  //  setUmid('DALY013');
  }, []);




  useEffect(() => {
    setKey(window.innerHeight > 800 ? ['2', '4'] : ['4'])
  }, []);

  const [gridData,setGridData] =useState([]);


  const getGridData = ()=>{
    const uo= BykfdbmhStore.dakDataSource;
    setGridData(uo);
  }


  useEffect(() => {
    getGridData();
  }, [
    BykfdbmhStore.dakDataSource
  ]);



  const title: ITitle = {
    name: '发布到门户'
  }



  const onFinish = (values: any) => {
    form.validateFields().then(data => {

      BykfdbmhStore.apply(data,gridData).then(res => {
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
  const [needFixed,setNeedFixed]=useState(false);
  const anchorHeaderStyle = needFixed ? { position: 'fixed', top: 0, zIndex: 3} : {};

  // const ininval={
  //   action:plainOptions
  // };


  const _width=300;
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
              {/* <br/> &nbsp;&nbsp;&nbsp; */}
              <Button type="primary" htmlType="submit" style={{ fontSize: '12px' }}  icon={<SaveOutlined />}>发布</Button>
              &nbsp;&nbsp;&nbsp;
        
            </div>
          </Col>
        </Row>

        <Divider orientation="left" plain>发布信息</Divider>
              <Row>
                <Col span={24}  >
                    <Form.Item label="标题" name="title" rules={[{ required:true, message: '请输入值!' }]}>
                        <Input  style={{width:  750}} />
                    </Form.Item>
                </Col>
                <Col span={span} >
                  <Form.Item label="栏目"  name="channelid"  rules={[{ required:true, message: '请选择栏目!' }]} >
                    <Select 
                            options={BykfdbmhStore.channelidData} style={{width:  _width}}
                    />
                  </Form.Item>
                </Col>
              
                <Col span={span}  >
                  <Form.Item
                    label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者"
                    name="author" 
                    initialValue={yhmc}
                   // style={{width:  '50%'}}
                  >
                    <Input disabled  style={{width:  _width}}/>
                  </Form.Item>
                </Col>
                <Col span={span} >
                  <Form.Item
                    label="&nbsp;&nbsp;&nbsp;维护时间"
                    name="whsj" 
                    initialValue={getDate}
                    hidden
                  >
                    <Input disabled  style={{width:  _width}} hidden />
                  </Form.Item>
                </Col>
              
               <Col span={24}  >
                <Form.Item  label="&nbsp;&nbsp;&nbsp;内容"   name="contentDesc" >
                  <Input.TextArea  
              //    placeholder="请输入对利用目的详细说明" 
                  rows={4} style={{width:  '98%'}}
                    ></Input.TextArea>
                </Form.Item>
                </Col>
              </Row>
            
             
        <Divider orientation="left" plain>申请清单</Divider>
          <div
            style={{height: '180px'}}
          >
            <Table columns={BykfdbmhStore.colDataSource} dataSource={BykfdbmhStore.dakDataSource} bordered scroll={{ x: 'max-content' }}
                   pagination={false}
                   className="my-table"
                   scroll={{
                     y: 170,
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

export default Bykfdbmh;
