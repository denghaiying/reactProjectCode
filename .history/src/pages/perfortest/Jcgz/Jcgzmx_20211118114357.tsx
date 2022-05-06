import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import jcgzmxService from './service/JcgzmxService';
import { Form, Input, message, Radio, Switch, Tabs, Table, InputNumber , Select, Button, Modal} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import moment from 'moment';

import './TabLayout.less';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  disableEdit: true,
  disableAdd: true,
  searchCode: 'sxjcjcszbh',
}

const jcdata = [{ value: 'sxjcxCddy', label: '长度等于' }, { value: 'sxjcxCdd', label: '长度大于' }, { value: 'sxjcxCdxy', label: '长度小于' }, { value: 'sxjcxgsh', label: '格式化' }, { value: 'sxjcxgshcd', label: '格式化长度' }, { value: 'sxjcxisnumber', label: '必须数字' }, { value: 'sxjcxdy', label: '必须等于' }, { value: 'sxjcxnumberdy', label: '必须数字，并大于' }, { value: 'sxjcxnumberxy', label: '必须数字，并小于' },{value: 'sxjcxBl', label: '必须'}
    , { value: 'sxjcxZyz', label: '值域值' }, { value: 'sxjcxRqdy', label: '日期等于' }, { value: 'sxjcxRqd', label: '日期大于' }, { value: 'sxjcxRqx', label: '日期小于' }, { value: 'sxjcxRqdanddy', label: '日期大于等于' }, { value: 'sxjcxRqxyanddy', label: '日期小于等于' }, { value: 'sxjcxBhtszf', label: '包含特殊字符' },{ value: 'sxjcxwjgs', label: '扩展名' }, { value: 'sxjcxwjbl', label: '文件大小' }, { value: 'sxjcxwjgs', label: '类型' }, { value: 'sxjcxwjbl', label: '必须' }, { value: 'sxjcxywBb', label: '文件版本' }, { value: 'sxjcxwjywMd5', label: '文件MD5码' }
    , { value: 'sxjcszhtWdith', label: '尺寸Wdith' }, { value: 'sxjcszhtHgith', label: '尺寸Hgith' }, { value: 'sxjcszhtColor', label: '彩色' }, { value: 'sxjcxwjgs', label: '图片格式' },{ value: 'zssjly', label: '数据来源' }, { value: 'sxjcwjsize', label: '文件大小' }, { value: 'sxjcwjgs', label: '文件格式'},{ value: 'kk01', label: '包含恶意代码' }, { value: 'kk02', label: '已安装杀毒软件' },{value: 'ky01', label: '检测包含头文件'},{value:'GD-1-7', label: '档号规范性 ' },{ value: 'GD-1-8', label: '元数据项数据重复性' },{ value: 'GD-1-12', label: '文件和目录文件规范性' },{ value: 'GD-1-13', label: '信息包目录结构规范性' },{ value: 'GD-1-14', label: '信息包一致性' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-3-1', label: '信息包中元数据的可读性'},{ value: 'GD-3-2', label: '目标数据库中元数据可访问性'},{ value: 'GD-4-3', label: '载体中多余文件'},{ value: 'GD-3-8', label: '信息包中包含的内容数据格式合规范性'}
  ,{ value: 'GD-1-5', label: '合理性年度检测' },{ value: 'GD-1-3', label: '数据类型' },{ value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' },{ value: 'ky01', label: '检测包含头文件' },{ value: 'sxjcwjHjserver', label: '文件软硬件环境server'}, { value: 'sxjcwjHjprogram', label: '文件软硬件环境program'},{ value: 'sxjcwjHjsystem', label: '文件软硬件环境system'}, { value: 'sxjcwjglwj', label: '元数据关联文件检测'}, { value: 'sxjcwjsj', label: '文件属性创建时间'},{ value: 'sxjcxSjcf', label: '数据重复性' }];

const sxjclxData =  [{ value: '真实性', label: '真实性' },{ value: '安全性', label: '安全性' },{ value: '完整性', label: '完整性' },{ value: '可用性', label: '可用性' }];

const Jcgzmx = observer((props) => {

  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(jcgzmxService));
  const ref = useRef();
  const [datalist, setdatalist]= useState<Array>([]);
  var Ids = [];
  const [visible, setVisible] =useState(false);
  const [selectionType] = useState<'checkbox'>('checkbox');
  var addparams = [];

  const onChangelx =  async (value) => {
      let url="/api/api/sxjcjcsz/findForKey";
        const response =await fetch.post(url,{'sxjcjcszlx':value,'jclx':value});
         if (response.status === 200) {
            var sjdate=[];
          if (response.data?.length > 0) {
            for (let i = 0; i < response.data?.length; i++) {
                  var a=response.data[i];
                  a.key=i+1;
                  sjdate.push(a);
            }
            setdatalist(sjdate);
          }else{
            setdatalist(sjdate);
          }
        }
  };

  const onButtonClick = value => {
       setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = async () => {
    if(checkedRows.length>0){
      for(let item of checkedRows) {
            var aa={};
            aa.sxjcjcgzmxjcgzid=props.gzid;
            aa.sxjcjcgzmxjcszid=item.id;
            addparams.push(aa);
      }
      let url="/api/api/sxjcjcgzMx";
      const response =await fetch.post(url,{'jcgzmxlist':addparams});
        if (response.status === 201) {
          setVisible(false);
          ref.current?.getTableStore().findByKey("",1,50,{'gzid':props.gzid});
        }
    }else{
       message.warning('请至少选择一条数据!');
    }
  };

  const columns = [
    {
      title: '检测类型',
      dataIndex: 'sxjcjcszlx',
    },{
      title: '检测编号',
      dataIndex: 'sxjcjcszbh',
    },{
      title: '检测名称',
      dataIndex: 'sxjcjcszname',
       render: (text, record, index) => {
        let jcnamelist=jcdata;
        let aa = jcnamelist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '检测属性',
      dataIndex: 'sxjcjcszsxid',
      render: (text, record, index) => {
        let lxlist=sxlist;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '检测数值',
      dataIndex: 'sxjcjcszz',
    },
  ];

  const customForm = () => {

    return (
      <>
      </>
    )
  }
    // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
        return [
          <>
                <Button type="primary" onClick={() => onButtonClick(props.gzid)}>
                    新增
                </Button>
          </>
        ];
  }


    // 创建右侧表格Store实例

  const [sxlist, setSxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [selectedRowMxKeys, setSelectedMxRowKeys] = useState([]);
  const [checkedRows, setCheckedRows] = useState<any>([]);
  const [clickRowData, setClickRowData] = useState();

    // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
      return (
        <>

        </>
      );
    }
  useEffect(() => {
    const queryXysjsxList =  async () =>{
        let url="/api/eps/control/main/ysjwh/queryForList";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.zdms, 'value': o.id}));
            setSxlist(SxData);
          }else{
            setSxlist(response.data);
          }
      }
    }
    queryXysjsxList();
      //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [{
      title: '检测类型',
      code: 'sxjcjcszlx',
      align: 'center',
      formType: EpsFormType.Input
      },
      {
        title: '检测编号',
        code: 'sxjcjcszbh',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '检测名称',
        code: 'sxjcjcszname',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
        let jcnamelist=jcdata;
        let aa = jcnamelist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
        },
      },
      {
        title: '检测值',
        code: 'sxjcjcszz',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '对应属性',
        code: 'sxjcjcszsxid',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          let alist=sxlist;
          let aa = alist.filter(item => {
            return item.value === text
          })
          return aa[0]?.label
        },
      },
      {
        title: '检测分类',
        code: 'sxjcjcszfl',
        align: 'center',
        formType: EpsFormType.Input
      }]
  const title: ITitle = {
      name: '规则详情'
  }


  const onSelectChange = (value, row) => {
    console.log('selectedRowKeys changed: ', value);
    setSelectedMxRowKeys(value);
    setCheckedRows(row)
  };

  const selectRow = (record) => {
    const selectedRowKeys = selectedRowMxKeys;
      if (selectedRowKeys.indexOf(record.key) >= 0) {
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
      } else {
        selectedRowKeys.push(record.key);
      }
    setSelectedMxRowKeys(selectedRowKeys);
  }

  const rowMxSelection = {
      selectedRowMxKeys,
      onChange: onSelectChange,
  };

  const searchFrom = () => {
      return (
        <>
          <Form.Item label="编号" className="form-item" name="sxjcjcszbh"><Input placeholder="请输入业务号" /></Form.Item >
          <Form.Item label="检测类型" className="form-item" name="sxjcjcszlx"><Select  placeholder="请选择检测类型" options={sxjclxData} /></Form.Item >
        </>
      )
  }

  return (
      <>
        <EpsPanel title={title}                    // 组件标题，必填
            source={source}                          // 组件元数据，必填
            tableProp={tableProp}                    // 右侧表格设置属性，选填
            tableService={jcgzmxService}             // 右侧表格实现类，必填
            ref={ref}                                // 获取组件实例，选填
            formWidth={1100}
            searchForm={searchFrom}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            initParams={{'gzid':props.gzid}}
          >
        </EpsPanel>
        <Modal
          title="规则设置"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          width='1300px'
        >

          <div style={{ height: '100%'}}>
             <Select  placeholder="请选择检测类型" options={sxjclxData} style={{ width: 200}} onChange={onChangelx}/>
            <div style={{ height: '540px'}}>
            <Table  className="ant-table" rowSelection={rowMxSelection} columns={columns} dataSource={datalist} size="middle"/>
            </div>
          </div>
               {/* onRow={record => {
                    return {
                      onClick: event => {
                        selectRow(record)
                      }, // 点击行
                    };
                  }} */}
        </Modal>
      </>
    );
  })

export default Jcgzmx;
