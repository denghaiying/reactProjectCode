import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import bzmkService from './service/BzmkService';
import { Form, Input, message,InputNumber, Radio, Select, Row, Col,Button} from 'antd';
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
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  labelColSpan: 8,
  searchCode: 'bzmkmc',
  rowSelection:{
    type:'check'
  }
}

const Bzmk = observer((props) => {

const ref = useRef();

const exportJson = async (val) => {
        if (val.length == 0) {
            message.error('操作失败,请至少选择一行数据');
        } else {
          for (let i = 0; i < val.length; i++) {
            var bzmkd=val[i];
            var zsmkbj={};
            zsmkbj.id = bzmkd.id;
            zsmkbj.zsmkbjsize=bzmkd.bzmksize;
            zsmkbj.zsmkbjtype=bzmkd.bzmktype;
            zsmkbj.zsmkbjmultiple=bzmkd.bzmkmultiple;
            zsmkbj.zsmkbjbh = bzmkd.bzmkbh;
            zsmkbj.zsmkbjmc = bzmkd.bzmkmc;
            zsmkbj.zsmkbjqtmc = bzmkd.bzmkqtmc;
            zsmkbj.zsmkbjwidth = bzmkd.bzmkwidth;
            zsmkbj.zsmkbjheight = bzmkd.bzmkheight;
            zsmkbj.zsmkbjrefresh = bzmkd.bzmkrefresh;
            zsmkbj.zsmkbjurl = bzmkd.bzmkurl;
            zsmkbj.zsmkbjsqlz = bzmkd.bzmksqlz;
            zsmkbj.zsmkbjsql = bzmkd.bzmksql;
            zsmkbj.zsmkbjqzfs = bzmkd.bzmkqzfs;
            const response =await fetch.post('/api/eps/ksh/zsmkbj', zsmkbj);
              if (response.status === 201) {
                message.info('导入成功');
              }else{
                message.error('导入失败');
              }
          }
        }
};

const customForm = () => {
  return (
    <>
    </>
  )
}
  // 全局功能按钮
const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
        <Button type="primary" onClick={() => exportJson(ids)}>导入</Button>
      </>
    ])
}

  // 创建右侧表格Store实例
const [tableStore] = useState<EpsTableStore>(new EpsTableStore(bzmkService));

  // 自定义表格行按钮detail
const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
}

useEffect(() => {

}, []);

const source: EpsSource[] = [ {
      title: '模块编号',
      code: 'bzmkbh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '模块标题',
      code: 'bzmkmc',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '图表标题',
      code: 'bzmkqtmc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表尺寸大小',
      code: 'bzmksize',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let sizelist=sizeData;
        let aa = sizelist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '图表宽度',
      code: 'bzmkwidth',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表高度',
      code: 'bzmkheight',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '图表类型',
      code: 'bzmktype',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let typelist=btTypeData;
        let aa = typelist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '系列',
      code: 'bzmkmultiple',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let mtplist=mulitpleData;
        let aa = mtplist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '取值方式',
      code: 'bzmkqzfs',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '刷新时间',
      code: 'bzmkrefresh',
      align: 'center',
      formType: EpsFormType.Input
    }]
  const title: ITitle = {
    name: '标注模块'
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
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={bzmkService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={1100}
        tableRowClick={(record) => console.log('abcef', record)}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>

    </>
  );
})

export default Bzmk;
