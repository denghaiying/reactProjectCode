import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  TreeSelect,
  DatePicker,
  message,
  Modal,
  Badge,
  Col,
  Row,
  Tooltip,
  Drawer,
  List,
} from 'antd';
import fetch from '@/utils/fetch';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import RecycleBinService from '@/services/dagl/recycleBin/RecycleBinService';
import { ITable, ITitle } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import {
  CloseCircleOutlined,
  UndoOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  FolderOutlined,
  CarryOutOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { useForm } from 'antd/lib/form/Form';
import DazdclService from './dazdclService';

interface IProp {
  store: EpsTableStore;
  record: {};
}

//
const Dazdcl = observer((props: IProp) => {
  console.log('gDazdclzprops:', props);

  const [umid, setUmid] = useState('');

  const [visible, setVisible] = useState(false);

  const [gzVisible, setGzVisible] = useState(false);

  const [datmid, setDatmid] = useState('');

  const [checkRow, setCheckRow] = useState({});

  const [formzd] = Form.useForm();

  const [logVisible, setLogVisible] = useState(false);

  const [buttondisabled,setButtondisabled] = useState(true);

  const ref = useRef();

  // 创建右侧表格Store实例
  const [tableStore, setTableStore] = useState<EpsTableStore>(
    new EpsTableStore(DazdclService),
  );

  const tableProp: ITable = {
    tableSearch: false,
    disableEdit: true,
    disableDelete: true,
    disableAdd: true,
    disableCopy: true,
  //  rowSelection: { type: 'radio' },
  };

  const ywzdgzStore = useLocalObservable(() => ({
    zcdate: '',
    gninfo: {},
    fjsc: false,
    mcdataSource: [],
    logCount: 0,
    rowdata: {},
    logSource:[],

    async queryForId() {
      const res = await fetch.post(
        '/api/eps/control/main/dazd/queryForDazdmxPage',
        this.params,
        {
          params: {
            datmid: props.record.id,
            page : 0,
            limit: 50,
            pageIndex: 0,
            pageSize: 50,
            sortField: '',
            sortOrder: '',
            start : 0,
            ...this.params,
          },
        },
      );

      if (res && res.status === 200) {
        if (res.data.results.length > 0) {
          this.rowdata = res.data.results[0];
          if(res.data.results[0].zt==="0"){
        
            setButtondisabled(false);
          }else if(res.data.results[0].zt==="1"){
            setButtondisabled(true);
          }
            
        } else {
          return;
        }
      }
    },

    async loadHistoryCount() {
      const response = await fetch.post(
        `/api/eps/control/main/dazd/queryforDazdmxnr?datmid=` + props.record.id,
      );
      if (response.status === 200) {
        this.logCount = response.data.length;
      }
    },

    async updateDazdmxnr(data) {
      const res = await fetch.post(
        '/api/eps/control/main/dazd/updateDazdmxnr',
        this.params,
        {
          params: {
            tmid: props.record.id,
            wtms: data.wtms,
            zdnr: data.zdnr,
            gznr: data.gznr,
            ids: data.id,
            bmc: props.record.bmc,
            wtlx: data.wtlx,
            gzrid: SysStore.getCurrentUser().id,
            gzr: SysStore.getCurrentUser().yhmc,
            ...this.params,
          },
        },
      );

      if (res && res.status === 200) {
        message.info('操作成功！');
      } else {
        message.error('操作失败！');
      }
    },

    async loadHistory() {
      const rr=props.record;
      const response = await fetch.post(`/api/eps/control/main/dazd/queryforDazdmxnr?datmid=`+props.record.id);
      
      if (response.status === 200) {
        this.logSource = response.data;

      }
    },

  }));

  useEffect(() => {
    setTableStore(ref.current?.getTableStore());
    ywzdgzStore.loadHistoryCount();
    ywzdgzStore.queryForId();
    ywzdgzStore.loadHistory();
  }, []);

  useEffect(() => {
    setDatmid({ datmid: props.record.id });
  }, [props.record.id]);


  useEffect(() => {
    if(ywzdgzStore.rowdata.zt==='0' && ywzdgzStore.logSource.length>0){
      setButtondisabled(false);
    }
  }, [ywzdgzStore.rowdata,ywzdgzStore.logSource]);

  const tzsave = async (ids, store) => {
  
      const res = await fetch.post(
        '/api/eps/control/main/dazd/updateDazdmxByTmid?whr=' +
          SysStore.getCurrentUser().yhmc +'&whrid='+SysStore.getCurrentUser().id+
          '&tmid=' +
          props.record.id,
      );
      // if (res && res.status === 200) {
      //   if (res.data.length > 0) {
      //     const rowdata = res.data[0];
      //     //   setCheckRow(res.data[0]);
      //     debugger;
      //   } else {
      //     return;
      //   }
      // }
      if (res && res.status === 200) {
        ywzdgzStore.queryForId();
        message.info('更新状态成功！');
      } else {
        message.error('更新状态失败！');
      }

      //   setCheckRow(store.checkedRows[0]);
  //   setGzVisible(true);
   
  };

  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        {/* <EpsReportButton store={store} umid={umid} /> */}
        {/* <EpsReportButton store={store} umid={umid} /> */}
      
        <Button
          type="primary"
          onClick={() => tzsave(ids, store)} disabled={buttondisabled}
          icon={<CarryOutOutlined />}
        >
          标记已解决
        </Button>
      </>,
    ];
  };

  const showlog=(record)=>{
    ywzdgzStore.loadHistory(record);
    setLogVisible(true);
  };

  const span = 24;
  const _width = 240;

  // 自定义表单

  const source: EpsSource[] = [
    // {
    //   title: '指导意见',
    //   code: 'gzzt',
    //   align: 'center',
    //   fixed: 'left',
    //   width: 80,
    //   formType: EpsFormType.Input,
    //   render: (text, record, index) => {
    //     return(
    //       <>
    //         <Tooltip title="指导意见">
    //           <Badge size={"small"} count={ywzdgzStore.logCount ? ywzdgzStore.logCount : 0}>
    //               <Button size="small"  style={{ fontSize: '12px' }} type={'primary'}
    //                 shape="circle" icon={<FolderOutlined />}
    //                 onClick={() => showlog(record)} />
    //             </Badge>
    //         </Tooltip>
            
    //         </>
    //     )},
    // },
    // {
    //   title: '处理状态',
    //   code: 'zt',
    //   align: 'center',
    //   fixed: 'left',
    //   width: 80,
    //   formType: EpsFormType.Input,
    //   render: (text, record, index) => {
    //     if (text) {
    //       if (text === '0') {
    //         return (text = '未解决');
    //       } else if (text === '1') {
    //         return (text = '已解决');
    //       }
    //     } else {
    //       return (text = '未解决');
    //     }
    //   },
    // },
    // {
    //   title: '题名',
    //   code: 'tm',
    //   align: 'center',
    //   ellipsis: true, // 字段过长自动东隐藏
    //   width: 120,
    //   formType: EpsFormType.Input,
    // },
    // {
    //   title: '全宗号',
    //   align: 'center',
    //   code: 'qzh',
    //   width: 180,
    //   ellipsis: true,
    //   formType: EpsFormType.Select,
    // },
    // {
    //   title: '全宗名称',
    //   code: 'qzmc',
    //   width: 80,
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   /* defaultSortOrder: 'descend',
    //      sorter: (a, b) => a.whr - b.whr,*/
    // },
    // {
    //   title: '档号',
    //   code: 'dh',
    //   width: 100,
    //   align: 'center',
    //   formType: EpsFormType.None,
    // },
    // {
    //   title: '密级',
    //   code: 'mj',
    //   width: 80,
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   /* defaultSortOrder: 'descend',
    //      sorter: (a, b) => a.whr - b.whr,*/
    // },
    // {
    //   title: '保管期限',
    //   code: 'bgqx',
    //   width: 100,
    //   align: 'center',
    //   formType: EpsFormType.None,
    // },
    {
      title: '问题类型',
      code: 'wtlx',
      align: 'center',
      ellipsis: true, // 字段过长自动东隐藏
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '问题描述',
      align: 'center',
      code: 'wtms',
      width: 180,
      ellipsis: true,
      formType: EpsFormType.Select,
    },
    {
      title: '指导内容',
      code: 'zdnr',
      align: 'center',
      ellipsis: true, // 字段过长自动东隐藏
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '更正内容',
      align: 'center',
      code: 'gznr',
      width: 180,
      ellipsis: true,
      formType: EpsFormType.Select,
    },
    {
      title: '提出人',
      code: 'whr',
      width: 80,
      align: 'center',
      formType: EpsFormType.Input,
      /* defaultSortOrder: 'descend',
         sorter: (a, b) => a.whr - b.whr,*/
    },
    {
      title: '提出时间',
      code: 'whsj',
      width: 100,
      align: 'center',
      formType: EpsFormType.None,
    },
  ];
  const title = {
    name: '业务指导处理',
  };

  const onFinish = (values: any) => {
    formzd
      .validateFields()
      .then((data) => {
        ywzdgzStore
          .updateDazdmxnr(data)
          .then((res) => {
            ref.current
              ?.getTableStore()
              .findByKey('', 1, 50, { datmid: props.record.id });
            formzd.resetFields();
            setGzVisible(false);
          })
          .catch((err) => {
            message.error(err);
          });
      })
      .catch((err) => {
        message.error(err);
      });
  };

    return (
        <>
        <Tooltip title="业务指导处理">
            <a key={`fileView_${props.record.id}`} style={{ width: 22, margin: "0 10px" }} onClick={()=>setVisible(true)}>

                <Badge size="small" count={ywzdgzStore.logCount}>
                 <FolderOutlined style={{ color: "#55acee" }} />
                </Badge>
                </a>
            </Tooltip >
            <Modal
                title="业务指导处理"
                centered
                visible={visible}
                footer={null}
                width={900}

              //  style={{maxHeight: "500px",height:"500px"}}
                onCancel={() => setVisible(false)}
            >
        <div style={{height: '100%'}}>
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={600}
            initParams={datmid}
            ref={ref}
            //customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={DazdclService}
            //    customForm={customForm}
            customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
          />
        </div>
      </Modal>

      <Drawer title="历史指导意见" placement="right" onClose={() => setLogVisible(false)} visible={logVisible}>
        <div>
        <List
              itemLayout="horizontal"
              dataSource={ywzdgzStore.logSource}
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
    
    </>
  );
});
export default Dazdcl;
