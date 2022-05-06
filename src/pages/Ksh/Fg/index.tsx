import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import fgService from './service/FgService';
import { Form, Input, message,InputNumber, Radio, Select, Button, Upload, Modal} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import kshflService from '../Kshfl/service/KshflService';

const yhmc = SysStore.getCurrentUser().yhmc;
const fgTypeData =[{value: 0, label: '暗色主题'},{value: 1, label: '粉色主题'},{value: 2, label: '深蓝色主题'},{value: 3, label: '蓝白色主题'}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'fgmc',
  rowSelection:{
    type:'check'
  }
}

const Fg = observer((props) => {

const [flxlist, setFlxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [visible, setVisiblezddy] =useState(false);
const ref = useRef();

const exportJson = async (val) => {
        if (val.length == 0) {
            message.error('操作失败,请至少选择一行数据');
        } else {
            // var ids = [];
            var ids = '';
            for (var i = 0; i < val.length; i++) {
                let id = '';
                id = val[i].id;
                ids = ids + id+',';
            }
             window.open('/api/eps/ksh/fg/exportjson?pid='+ids);
        }
};

const onChange = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }
}

function beforeUpload(file) {
    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf(".") + 1);
    if (extName != 'json') {
      isJpgOrPng = false;
      message.error('只能上传JSON文件!');
    }
    return isJpgOrPng;
}

const handleCancel = () => {
  setVisiblezddy(false);
  const tableStores = ref.current?.getTableStore();
  tableStores.findByKey("",1,50,{});
};


const handleOk = () => {
  setVisiblezddy(false);
  const tableStores = ref.current?.getTableStore();
  tableStores.findByKey("",1,50,{});
};

const showFjAction = ()=> {
  setVisiblezddy(true);
};

const _width=400;
const customForm = () => {
  return (
    <>
      <Form.Item label="编号:" name="fgfgbh" required rules={[{ required: true, message: '请输入编号' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="名称:" name="fgmc" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="主题风格:" name="fgType" required rules={[{ required: true, message: '请选择主题风格' }]}>
         <Select   placeholder="主题风格"   options={fgTypeData} style={{width:  _width }}/>
      </Form.Item>
      <Form.Item label="刷新时间(秒):" name="fgTime" required rules={[{ required: true, message: '请输入刷新时间(秒)' }]}>
        <InputNumber  type="inline" step={1}  name="fgTime"  min={0}  max={200}  defaultValue={0} style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="隐藏顶部导航:" name="fghideNav" required initialValue="true">
        <Radio.Group>
            <Radio.Button value="true">隐藏</Radio.Button>
            <Radio.Button value="false">不隐藏</Radio.Button>
          </Radio.Group>
      </Form.Item>
        <Form.Item label="序号:" name="fgxh" >
           <InputNumber  type="inline" step={10}  name="fgxh"  min={0}  max={2000}  defaultValue={0} style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="分类:" name="fgflId" required rules={[{ required: true, message: '请选择分类' }]}>
         <Select   placeholder="分类"   options={flxlist} style={{width:  _width }}/>
      </Form.Item>
       <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: _width }} />
      </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
        <Button type="primary" onClick={() => exportJson(ids)}>文件导出</Button>
        <Button type="primary" onClick={() => showFjAction()} >文件导入</Button>
      </>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(fgService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
  useEffect(() => {
    const queryFlList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/kshfl";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.kshflmc, 'value': o.id }));
            setFlxlist(SxData);
          }else{
            setFlxlist(response.data);
          }
        }
        }
    }
    queryFlList();
    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [ {
      title: '编号',
      code: 'fgfgbh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '名称',
      code: 'fgmc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '主题风格',
      code: 'fgType',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let fglist=fgTypeData;
        let aa = fglist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },
     {
      title: '刷新时间(秒)',
      code: 'fgTime',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '隐藏顶部导航',
      code: 'fghideNav',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if( text == "true"){
            return "隐藏";
        }else{
           return "不隐藏";
        }
      },
    },
     {
      title: '序号',
      code: 'fgxh',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '分类',
      code: 'fgflId',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let fllist=flxlist;
        let aa = fllist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
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
  }]
  const title: ITitle = {
    name: '系统维护'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="fgfgbh"><Input placeholder="请输入编号" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="fgmc"><Input placeholder="请输入名称" /></Form.Item >
        <Form.Item label="分类" className="form-item" name="fgflId"> <Select   placeholder="分类"   options={flxlist}/></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        treeService={kshflService}                  // 左侧树 实现类，必填
        tableService={fgService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={640}
        tableRowClick={(record) => console.log('abcef', record)}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
      <Modal
          title="文件导入"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          width='500px'
        >
        <div  style={{ height:'350px'}}>
                <Upload
                    action="/eps/ksh/fg/uploadfile"
                    onChange={onChange}
                    beforeUpload={beforeUpload}
                    listType="text">
                    <br/>
                    <Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>选择导入文件</Button>
                </Upload>
        </div>
      </Modal>
    </>
  );
})

export default Fg;
