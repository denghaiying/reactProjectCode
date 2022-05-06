import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import zsmkbjFjService from './service/ZsmkbjFjService';
import { Form, Input, message,Button, Modal, Upload, InputNumber} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const btTypeData =[{value: 0, label: '单系列饼图'},{value: 1, label: '多系列饼图'},{value: 2, label: '多系列百分比饼图'},{value: 3, label: '单系列横向柱形图'},{value: 4, label: '单系列纵向柱形图'},{value: 5, label: '多系列横向柱形图'},{value: 6, label: '多系列纵向柱形图'},{value: 7, label: '折线图'},{value: 8, label: '数据面积图'},{value: 9, label: '柱形折线混合图'},{value: 10, label: '雷达图'}
  ,{value: 11, label: '漏斗图'},{value: 12, label: '仪表盘图'},{value: 13, label: '树图'},{value: 14, label: '矩形树图'},{value: 15, label: '旭日图'},{value: 16, label: '散点图'},{value: 17, label: '气泡图'},{value: 18, label: '主题河流图'},{value: 19, label: '日历坐标系'},{value: 20, label: '表格'},{value: 21, label: '统计表'},{value: 22, label: '设备管理图表'},{value: 23, label: 'iframe内嵌网页'},{value: 24, label: 'video视频'},{value: 25, label: '按钮组图表'},{value: 26, label: '滚动图表'}];
const mulitpleData = [{value: 0, label: '单系列'},{value: 1, label: '多系列'}];
const sizeData = [{value: 0, label: '小尺寸'},{value: 1, label: '较大尺寸'}];
const qzfsData= [{value: 'URL', label: 'URL'},{value: 'SQL', label: 'SQL'}];

const span = 8;
const _width = 200
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableAdd: true,
  disableCopy: true,
  labelColSpan: 8,
  searchCode: 'zsmkbjfjfilename',
  rowSelection:{
    type:'check'
  }
}

const Fjxx = observer((props) => {

const ref = useRef();

const [visible, setVisiblezddy] =useState(false);

const showFjAction = ()=> {
  setVisiblezddy(true);
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
   const tableStores = ref.current?.getTableStore();
  tableStores.findByKey("",1,50,{'bzmkbjid':props.bzmkbjid});
}

const customForm = () => {
  return (
    <>
      <Form.Item label="刷新时间:" name="zsmkbjfjsj" >
        <InputNumber  type="inline" step={1}  name="zsmkbjfjsj"  min={0}  max={2000}  defaultValue={0} style={{ width: 300 }} />
      </Form.Item>
       <Form.Item label="接口ID:" name="zsmkbjfjfileid"  hidden>
          <Input disabled style={{ width:300 }}  />
      </Form.Item>
    </>
  )
}
  // 全局功能按钮
const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
      </>
    ])
}

  // 创建右侧表格Store实例
const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zsmkbjFjService));

// const handleCancel = () => {
//   setVisiblezddy(false);
//   const tableStores = ref.current?.getTableStore();
//   tableStores.findByKey("",1,50,{'bzmkbjid':props.bzmkbjid});
// };


// const handleOk = () => {
//   setVisiblezddy(false);
//   const tableStores = ref.current?.getTableStore();
//   tableStores.findByKey("",1,50,{'bzmkbjid':props.bzmkbjid});
// };

  // 自定义表格行按钮detail
const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
}

useEffect(() => {
   const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{'bzmkbjid':props.bzmkbjid});
}, [props.bzmkbjid]);

const source: EpsSource[] = [ {
      title: '文件名',
      code: 'zsmkbjfjfilename',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '文件类型',
      code: 'zsmkbjfjext',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '文件大小',
      code: 'zsmkbjfjsize',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '版本号',
      code: 'zsmkbjfjbbh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '校验码',
      code: 'zsmkbjfjmd5code',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '备注',
      code: 'zsmkbjfjbz',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '刷新时间',
      code: 'zsmkbjfjsj',
      align: 'center',
      formType: EpsFormType.Input
}]
  const title: ITitle = {
    name: '附件信息'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="模块编号" className="form-item" name="bzmkbh"><Input placeholder="请输入模块编号" /></Form.Item >
        <Form.Item label="模块标题" className="form-item" name="bzmkmc"><Input placeholder="请输入模块标题" /></Form.Item >
      </>
    )
  }

  return (
    <>
       <Upload  action="/api/eps/ksh/zsmkbj/uploadfile"  onChange={onChange}
          showUploadList ={false}
          accept="image/*,video/*"  data={{'bzmkbjid':props.bzmkbjid}}
          multiple   listType="text">
           <br/>
          <Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>选择导入文件</Button>
      </Upload>
      <div style={{ height:'550px'}}>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={zsmkbjFjService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={900}
        tableRowClick={(record) => console.log('abcef', record)}
        //searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        initParams={{'bzmkbjid':props.bzmkbjid}}
      >
      </EpsPanel>
      </div>
    </>
  );
})

export default Fjxx;
