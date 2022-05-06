import { SetStateAction, useEffect, useState } from 'react';
import DwTableLayout from '@/eps/business/DwTableLayout'
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Checkbox, Col, Form, Input, Row, Select, TreeSelect } from 'antd';
import MjjlService from '@/services/kfgl/mjjl/MjjlService';
import {observer, useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
const FormItem = Form.Item;
import DwStore from '../../../stores/system/DwStore';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import { runInAction } from 'mobx';


const mjjl = observer(() => {

  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [initParams] = useState({});

  const title = {
    name: '密集架列'
  }

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="所属库房:" name="cx_kfid" >
            <Select className="ant-select" placeholder="请选择库房" onChange={kfchange} options={mjjlStore.kflist}  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="组号:" name="cx_zh" >
            <Select className="ant-select" placeholder="请选择组号"  options={zhlist}  style={{ width: 300 }} />
        </Form.Item>
        <FormItem label="编号" className="form-item" name="cx_bh"><Input placeholder="请输入编号" style={{ width: 300 }}/></FormItem >
      </>
    )
  }

  const [gridData,setGridData] =useState([]);

  const getGridData = ()=>{
    const uo= mjjlStore.dwlist;
    setGridData(uo);
  }

  useEffect(() => {
    getGridData();
  }, [gridData]);

  useEffect(() => {
    mjjlStore.queryDwList();
    mjjlStore.querKfList();
    mjjlStore.queryMjjlList();
    DwStore.queryTreeDwList();
  }, []);

  const [zhlist, setZhData]= useState<Array<Object>>([]);

  const [kflist_edit, setKfEditData]= useState<Array<Object>>([]);
  const [zhlist_edit, setZhEditData]= useState<Array<Object>>([]);


  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const kfchange=(value: string) =>{
    const list: SetStateAction<Object[]> = [];
    setZhData(list);
    setZhEditData(list);
    if (value) {
      fetch.get(`/eps/control/main/mjjz/queryForList?kfid=`+value).then(res => {
        if (res && res.status === 200) {
          if (res.data.length > 0) {
              let sdata = res.data.map((item: { zh: any}) => ({label: item.zh, value: item.zh}));
              setZhData(sdata);
              let edata = res.data.map((item: { id:any; zh: any; zname: any}) => ({label: item.zh + "|" + item.zname, value: item.id}));
              setZhEditData(edata);
          }
        }
      });
    }
  }

  const dwchange=(value: string) => {
    const list: SetStateAction<Object[]> = [];
    setKfEditData(list);
    if(value){
      fetch.get(`/eps/control/main/mjjz/kf?dwid=`+value).then(res => {
        if (res && res.status === 200) {
          if (res.data.length > 0) {
              let sdata = res.data.map((item: { kfmc: any; id: any; }) => ({label: item.kfmc, value: item.id}));
              setKfEditData(sdata);
          }
        }
      });
    }
  }

  const mjjlStore = useLocalObservable(() => ({

    dwlist: [],
    kflist: [],
    mjjzlist: [],
    zhlist: [],

    async queryDwList() {
      const response = await fetch.get("/eps/control/main/dw/queryForListByYhid");
        runInAction(() => {
          if (response && response.status === 200) {
            this.dwlist = response.data;
          }
        })
    },

    async querKfList() {
      const response = await fetch.get("/eps/control/main/mjjz/kf");
      runInAction(() => {
        if (response && response.status === 200) {
          this.kflist = response.data.map((item: { kfmc: any; id: any; }) => ({label: item.kfmc, value: item.id}));
        }
      })
    },

    async queryMjjlList() {
      const response = await fetch.get("/eps/control/main/mjjl/queryMjjz");
      runInAction(() => {
        if (response && response.status === 200) {
          this.mjjzlist = response.data;
        }
      })
    },

    async queryZhList() {
      const response = await fetch.get("/eps/control/main/mjjz/queryForList?kfid=");
      runInAction(() => {
        if (response && response.status === 200) {
          this.zhlist = response.data;
        }
      })
    }

  }));

  const span = 8;
  const _width = 240;

  const customForm = (form: any) => {

    return (
      <>
       <Row gutter={20}>
          <Col span={span}>

            <Form.Item label="单位:" name="dwid" required rules={[{ required: true, message: '请选择单位' }]}>
                <TreeSelect style={{ width: _width }}
                  onChange={dwchange}
                  treeData={DwStore.dwTreeData}
                  placeholder="请选择单位"
                  treeDefaultExpandAll
                  allowClear
                />
            </Form.Item>

            <Form.Item label="所属库房:" name="kfid" required rules={[{ required: true, message: '请选择库房' }]}>
              <Select className="ant-select" placeholder="请选择库房"  onChange={kfchange} options={kflist_edit}  style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="密集架组:" name="zid" required rules={[{ required: true, message: '请选择密集架组' }]}>
              <Select className="ant-select" placeholder="请选择密集架组"  options={zhlist_edit}  style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="列的编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
              <Input placeholder="请输入列的编号" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="列的名称:" name="name">
              <Input placeholder="请输入列的名称" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="区号:" name="qh">
              <Input placeholder="请输入区号" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="层数:" name="cs">
              <Input placeholder="请输入层数" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="节数:" name="js">
              <Input placeholder="请输入节数" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="层高:" name="cg">
              <Input placeholder="请输入层高" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="节宽:" name="jk">
              <Input placeholder="请输入节宽" style={{ width: _width }} />
            </Form.Item>

          </Col>

          <Col span={span}>

            <Form.Item label="列宽:" name="lk">
              <Input placeholder="请输入列宽" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="宽度:" name="width">
              <Input placeholder="请输入宽度" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="高度:" name="height">
              <Input placeholder="请输入高度" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="长度:" name="length">
              <Input placeholder="请输入长度" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="组号:" name="zh">
              <Input placeholder="请输入组号" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="列号:" name="lh">
              <Input placeholder="请输入列号" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="显示列号:" name="xslh">
              <Input placeholder="请输入显示列号" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="状态:" name="zt">
              <Input placeholder="请输入状态" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="编号信息:" name="wm">
              <Input placeholder="请输入编号信息" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="存储盒数:" name="cchsl">
              <Input placeholder="请输入存储盒数" style={{ width: _width }} />
            </Form.Item>

          </Col>

          <Col span={span}>

            <Form.Item label="显示AB面:" name="zabm" required rules={[{ required: true, message: '请选择AB面' }]}>
              <Select className="ant-select"  placeholder="请选择AB面" style={{ width: _width }}>
                <option value="A">A面</option>
                <option value="B">B面</option>
                <option value="AB">AB面</option>
              </Select>
            </Form.Item>

            <Form.Item label="A面:" name="amname">
              <Input style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="B面:" name="bmname">
              <Input style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="左侧显示字符:" name="zcxs">
              <Input placeholder="请输入左侧显示字符" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="右侧显示字条款:" name="ycxs">
              <Input placeholder="请输入右侧显示字条款" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="是否生成图片:" name="hasPic">
              <Input placeholder="请输入是否生成图片" style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="触屏:" name="touch" >
              <Checkbox/>
            </Form.Item>

            <Form.Item label="列描述:" name="ms">
              <Input.TextArea allowClear  showCount maxLength={400} style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="维护人:" name="whr">
              <Input disabled defaultValue={yhmc} style={{ width: _width }} />
            </Form.Item>

            <Form.Item label="维护时间:" name="whsj">
            <Input disabled defaultValue={getDate} style={{ width: _width }} />
            </Form.Item>

          </Col>
        </Row>
      </>
    )
  }

  const source: EpsSource[] = [
    {
      title: '所属库房',
      code: 'kfid',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input,
      render: (text: string) => {
        const kflist = mjjlStore.kflist;
        for (var i = 0, l = kflist.length; i < l; i++) {
          const kf:any = kflist[i];
          if (kf.value == text) {
            return kf.label;
          }
        }
      }
    },
    {
      title: '单位',
      code: 'dwid',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input,
      render: (text: string) => {
        const dwlist = mjjlStore.dwlist;
        for (var i = 0, l = dwlist.length; i < l; i++) {
          const dw:any = dwlist[i];
          if (dw.id == text) {
            return dw.mc;
          }
        }
      }
    },
    {
      title: '密集架组',
      code: 'zid',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text: string) => {
        const mjjzList = mjjlStore.mjjzlist;
        for (var i = 0, l = mjjzList.length; i < l; i++) {
          const mjjz:any = mjjzList[i];
          if (mjjz.id == text) {
            return mjjz.zh+"|"+mjjz.zname;
          }
        }
      }
    },
    {
      title: '编号',
      code: 'bh',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '名称',
      code: 'name',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input
    }, {
      title: 'AB面',
      code: 'zabm',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '区号',
      code: 'qh',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '层数',
      code: 'cs',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '节数',
      code: 'js',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '层高',
      code: 'cg',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '节宽',
      code: 'jk',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    }, {
      title: '列宽',
      code: 'lk',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '长度',
      code: 'length',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '高度',
      code: 'height',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '宽度',
      code: 'width',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '组号',
      code: 'zh',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '列号',
      code: 'lh',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '显示列号',
      code: 'xslh',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: 'A面名称',
      code: 'amname',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: 'B面名称',
      code: 'bmname',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '状态',
      code: 'zt',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '左侧显示字符',
      code: 'zcxs',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '右侧显示字条款',
      code: 'ycxs',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '编号信息',
      code: 'wm',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '是否生成图片',
      code: 'hasPic',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
    },{
      title: '列描述',
      code: 'ms',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input
    },{
      title: '触屏',
      code: 'touch',
      align: 'center',
      width: 50,
      formType: EpsFormType.Input
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
      width: 100,
      formType: EpsFormType.Input
    }
  ]

  return (
    <DwTableLayout
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={MjjlService}                 // 右侧表格实现类，必填
      formWidth={1500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      searchForm={searchFrom}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </DwTableLayout>
  );
})

export default mjjl;
