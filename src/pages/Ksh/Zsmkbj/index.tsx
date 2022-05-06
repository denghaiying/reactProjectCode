import React, { useEffect, useRef, useState , useLocalObservable} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import zsmkbjService from './service/ZsmkbjService';
import { Form, Input, message,InputNumber, Radio, Select, Row, Col, Switch, Modal, Button, Tooltip,Checkbox} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable, IUpload} from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined, FileAddOutlined, ToolTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import Bzmk from "./Bzmk.tsx";
import zsmkService from '../Zsmk/service/ZsmkService';
import EpsUploadButton from '@/eps/components/buttons/EpsUploadButton';
import zsmkbjFjService from './service/ZsmkbjFjService';

const yhmc = SysStore.getCurrentUser().yhmc;

const btTypeData =[{value: 0, label: '单系列饼图'},{value: 1, label: '多系列饼图'},{value: 2, label: '多系列百分比饼图'},{value: 3, label: '单系列横向柱形图'},{value: 4, label: '单系列纵向柱形图'},{value: 5, label: '多系列横向柱形图'},{value: 6, label: '多系列纵向柱形图'},{value: 7, label: '折线图'},{value: 8, label: '数据面积图'},{value: 9, label: '柱形折线混合图'},{value: 10, label: '雷达图'}
  ,{value: 11, label: '漏斗图'},{value: 12, label: '仪表盘图'},{value: 13, label: '树图'},{value: 14, label: '矩形树图'},{value: 15, label: '旭日图'},{value: 16, label: '散点图'},{value: 17, label: '气泡图'},{value: 18, label: '主题河流图'},{value: 19, label: '日历坐标系'},{value: 20, label: '表格'},{value: 21, label: '统计表'},{value: 22, label: '设备管理图表'},{value: 23, label: 'iframe内嵌网页'},{value: 24, label: 'video视频'},{value: 25, label: '按钮组图表'},{value: 26, label: '滚动图表'}];
const mulitpleData = [{value: 0, label: '单系列'},{value: 1, label: '多系列'}];
const sizeData = [{value: 0, label: '小尺寸'},{value: 1, label: '较大尺寸'}];

const zsmkqzfsData= [{value: 'URL', label: 'URL'},{value: 'SQL', label: 'SQL'}];
const sqlsmValue="由于图表需要特定名称,因此SQL需重命名为name(名称),vaule(数值),max(最大数值),x(X轴数值<散点图/气泡图>),y(y轴数值 <散点图/气泡图>),sjdate(日期<主题河流图/日历坐标>),type(开关)属性，因此sql语句的格式，需要将查询的数值 as 成所需要的属性,如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; 多个语句时 ,语句必须‘;’结尾,语句间 必须用$charildsql$ 连接如：select A.name as name, COUNT(*) as value  from  A  group  by A.name; $charildsql$ select B.name as name, COUNT(*) as value  from  B  group  by B.name;";
const zsmkbjsqlzsmValue="由于多系列,需要外层数据和内数据,因此外层SQL和SQL是需关联的,外层需要必须值id,name,zid 如select A.id as id,A.name as name,A.id as zid from  A,而且内sql,必须和外层id关联条件,条件时值必须为$charildid$ ,如 外层SQL为：select A.id as id,A.name as name,A.id as zid  from  A; 那么下面的SQL为 select C.name as name COUNT(*) as value  from  C where C.zid=$charildid$; SQL多个时必须用$charildsql$ 连接";
const colorsData =[{label:'浅粉色',value:'#FFB6C1'},{label:'粉红',value:'#FFC0CB'},{label:'猩红',value:'#DC143C'},{label:'脸红的淡紫色',value:'#FFF0F5'},{label:'苍白的紫罗兰红色',value:'#DB7093'},{label:'热情的粉红',value:'#FF69B4'},{label:'深粉色',value:'#FF1493'},{label:'适中的紫罗兰红色',value:'#C71585'},{label:'兰花的紫色',value:'#DA70D6'},{label:'蓟',value:'#D8BFD8'},{label:'李子',value:'#DDA0DD'},{label:'紫罗兰',value:'#EE82EE'},{label:'洋红',value:'#FF00FF'},{label:'灯笼海棠(紫红色)',value:'#FF00FF'},{label:'深洋红色',value:'#8B008B'},{label:'紫色',value:'#800080'},{label:'适中的兰花紫',value:'#BA55D3'},{label:'深紫罗兰色',value:'#9400D3'},{label:'深兰花紫',value:'#9932CC'},{label:'靛青',value:'#4B0082'},{label:'深紫罗兰的蓝色',value:'#8A2BE2'}
  ,{label:'适中的紫色',value:'#9370DB'},{label:'适中的板岩暗蓝灰色',value:'#7B68EE'},{label:'板岩暗蓝灰色',value:'#6A5ACD'},{label:'深岩暗蓝灰色',value:'#483D8B'},{label:'薰衣草花的淡紫色',value:'#E6E6FA'},{label:'幽灵的白色',value:'#F8F8FF'},{label:'纯蓝',value:'#0000FF'}
  ,{label:'适中的蓝色',value:'#0000CD'},{label:'午夜的蓝色',value:'#191970'},{label:'深蓝色',value:'#00008B'},{label:'海军蓝',value:'#000080'},{label:'皇军蓝',value:'#4169E1'},{label:'矢车菊的蓝色',value:'#6495ED'},{label:'淡钢蓝',value:'#B0C4DE'},{label:'浅石板灰',value:'#778899'}
  ,{label:'石板灰',value:'#708090'},{label:'道奇蓝',value:'#1E90FF'},{label:'爱丽丝蓝',value:'#F0F8FF'},{label:'钢蓝',value:'#4682B4'},{label:'淡蓝色',value:'#87CEFA'},{label:'天蓝色',value:'#87CEEB'},{label:'深天蓝',value:'#00BFFF'},{label:'淡蓝',value:'#ADD8E6'},{label:'火药蓝',value:'#B0E0E6'}
  ,{label:'军校蓝',value:'#5F9EA0'},{label:'蔚蓝色',value:'#F0FFFF'},{label:'淡青色',value:'#E1FFFF'},{label:'苍白的绿宝石',value:'#AFEEEE'},{label:'青色',value:'#00FFFF'},{label:'水绿色',value:'#00FFFF'},{label:'深绿宝石',value:'#00CED1'}
  ,{label:'深石板灰',value:'#2F4F4F'},{label:'深青色',value:'#008B8B'},{label:'水鸭色',value:'#008080'},{label:'适中的绿宝石',value:'#48D1CC'},{label:'浅海洋绿',value:'#20B2AA'},{label:'绿宝石',value:'#40E0D0'}
  ,{label:'绿玉碧绿色',value:'#7FFFAA'},{label:'适中的碧绿色',value:'#00FA9A'},{label:'适中的春天的绿色',value:'#F5FFFA'},{label:'薄荷奶油',value:'#00FF7F'},{label:'春天的绿色',value:'#3CB371'}
  ,{label:'海洋绿',value:'#2E8B57'},{label:'蜂蜜',value:'#F0FFF0'},{label:'淡绿色',value:'#90EE90'},{label:'苍白的绿色',value:'#98FB98'},{label:'深海洋绿',value:'#8FBC8F'},{label:'酸橙绿',value:'#32CD32'},{label:'酸橙色',value:'#00FF00'},{label:'森林绿',value:'#228B22'}
  ,{label:'纯绿',value:'#008000'},{label:'深绿色',value:'#006400'},{label:'查特酒绿',value:'#7FFF00'},{label:'草坪绿',value:'#7CFC00'},{label:'绿黄色',value:'#ADFF2F'},{label:'橄榄土褐色',value:'#556B2F'},{label:'米色(浅褐色)',value:'#6B8E23'}
  ,{label:'浅秋麒麟黄',value:'#FAFAD2'},{label:'象牙',value:'#FFFFF0'},{label:'浅黄色',value:'#FFFFE0'},{label:'纯黄',value:'#FFFF00'},{label:'橄榄',value:'#808000'},{label:'深卡其布',value:'#BDB76B'},{label:'柠檬薄纱',value:'#FFFACD'}
  ,{label:'灰秋麒麟',value:'#EEE8AA'},{label:'卡其布',value:'#F0E68C'},{label:'金',value:'#FFD700'},{label:'玉米色',value:'#FFF8DC'},{label:'秋麒麟',value:'#DAA520'},{label:'花的白色',value:'#FFFAF0'}
  ,{label:'老饰带',value:'#FDF5E6'},{label:'小麦色',value:'#F5DEB3'},{label:'鹿皮鞋',value:'#FFE4B5'},{label:'橙色',value:'#FFA500'},{label:'番木瓜',value:'#FFEFD5'},{label:'漂白的杏仁',value:'#FFEBCD'},{label:'Navajo白',value:'#FFDEAD'}
  ,{label:'古代的白色',value:'#FAEBD7'},{label:'晒黑',value:'#D2B48C'},{label:'结实的树',value:'#DEB887'},{label:'(浓汤)乳脂,番茄等',value:'#FFE4C4'},{label:'深橙色',value:'#FF8C00'},{label:'亚麻布',value:'#FAF0E6'}
  ,{label:'秘鲁',value:'#CD853F'},{label:'桃色',value:'#FFDAB9'},{label:'沙棕色',value:'#F4A460'},{label:'巧克力',value:'#D2691E'},{label:'马鞍棕色',value:'#8B4513'},{label:'海贝壳',value:'#FFF5EE'},{label:'黄土赭色',value:'#A0522D'},{label:'浅鲜肉(鲑鱼)色',value:'#FFA07A'},{label:'珊瑚',value:'#FF7F50'},{label:'橙红色',value:'#FF4500'},{label:'深鲜肉(鲑鱼)色',value:'#E9967A'},{label:'番茄',value:'#FF6347'},{label:'薄雾玫瑰',value:'#FFE4E1'},{label:'鲜肉(鲑鱼)色',value:'#FA8072'},{label:'雪',value:'#FFFAFA'}
  ,{label:'淡珊瑚色',value:'#F08080'},{label:'玫瑰棕色',value:'#BC8F8F'},{label:'印度红',value:'#CD5C5C'},{label:'纯红',value:'#FF0000'},{label:'棕色',value:'#A52A2A'},{label:'耐火砖',value:'#B22222'},{label:'深红色',value:'#8B0000'},{label:'栗色',value:'#800000'},{label:'纯白',value:'#FFFFFF'},{label:'白烟',value:'#F5F5F5'},{label:'Gainsboro',value:'#DCDCDC'},{label:'浅灰色',value:'#D3D3D3'},{label:'银白色',value:'#C0C0C0'},{label:'深灰色',value:'#A9A9A9'},{label:'灰色',value:'#808080'},{label:'暗淡的灰色',value:'#696969'},{label:'纯黑',value:'#000000'}];


const span = 8;
const _width = 200
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  labelColSpan: 9,
  searchCode: 'zsmkbjmc',
  onAddClick: (form) => {
    form.setFieldsValue({zsmkbjorder:0,zsmkbjwidth:1,zsmkbjheight:1,zsmkbjrefresh:600,zsmkbjpositionX:0,zsmkbjpositionY:0});
  },
  onEditClick: (form,record) => {
    if(record.zsmkbjstate === "true"){
      record.zsmkbjstate =true;
    }else{
      record.zsmkbjstate =false;
    }
    form.setFieldsValue(record);
  },
}

const Zsmkbj = observer((props) => {

  const [zmklist, setZmklist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [visible, setVisiblezddy] =useState(false);
  const [fjvisible, setFjVisiblezddy] =useState(false);

  const [bzmkbjid, setBzmkbjid]= useState<string>('1111');
  const ref = useRef();

  
  const wjtore: ArchStoreType = useLocalObservable(() => ({
    async refreshPage() {
      const tableStores = ref.current?.getTableStore();
      tableStores.findByKey("",1,50,{});
    },
  }));

  const customForm = () => {
    return (
      <>
        <div style={{ margin: '0 0 10px 950px' }}>
          <Tooltip   title="图表宽度、图表高度、横坐标、纵坐标设置说明：图表的显示区域划分为36*36的单元格，每个图表的宽高按照单元格的数量来表示。显示区域的原点为左上角，可用相对位置的单元格数表示横纵坐标，体现图表所在的位置">
            <font color="#40a9ff">设置说明</font>
          </Tooltip>
        </div>
        <Row gutter={24}>
          <Col span={span}>
            <Form.Item label="模块编号"  name="zsmkbjbh" required  rules={[{ required: true, message: '请输入模块编号' }]}>
              <Input allowClear style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="模块标题:" name="zsmkbjmc" required  rules={[{ required: true, message: '请输入模块标题' }]}>
              <Input allowClear style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="图表标题:" name="zsmkbjqtmc" required  rules={[{ required: true, message: '请输入图表标题' }]}>
              <Input allowClear style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="图表位置序号:" name="zsmkbjorder">
              <InputNumber  type="inline" step={1}  name="zsmkbjorder"  min={0}  max={2000}   style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="图表尺寸大小"  name="zsmkbjsize" required  rules={[{ required: true, message: '请选择图表尺寸大小' }]}>
              <Select   placeholder="图表尺寸大小"   options={sizeData} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="主要颜色"  name="zsmkbjcolors" required  rules={[{ required: true, message: '请选择主要颜色' }]}>
              <Select   placeholder="主要颜色"   options={colorsData} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="图表类型"  name="zsmkbjtype" required  rules={[{ required: true, message: '请选择图表类型' }]}>
              <Select   placeholder="图表类型"   options={btTypeData} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="图表宽度:" name="zsmkbjwidth" tooltip="取值范围1-36，表示图表宽度的单元格数" required  rules={[{ required: true, message: '请输入图表宽度' }]}>
              <InputNumber  type="inline" step={1}  name="zsmkbjwidth"  min={1}  max={36}  style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="图表高度:" name="zsmkbjheight" tooltip="取值范围1-36，表示图表高度的单元格数" required  rules={[{ required: true, message: '请输入图表宽度' }]}>
              <InputNumber  type="inline" step={1} name="zsmkbjheight"  min={1}  max={36}  style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="刷新时间:" name="zsmkbjrefresh">
              <InputNumber  type="inline"  step={1} name="zsmkbjrefresh"  min={0}  max={2000}   style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="横坐标:" name="zsmkbjpositionX" tooltip="取值范围 0-35，表情所在位置距离显示区域左边边界的单元格数" required  rules={[{ required: true, message: '请输入横坐标' }]}>
              <InputNumber  type="inline" step={1}  name="zsmkbjpositionX"  min={0}  max={35}  style={{ width:  _width }} />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="纵坐标:" name="zsmkbjpositionY" tooltip="取值范围 0-35，表情所在位置距离显示区域顶部边界的单元格数" required  rules={[{ required: true, message: '请输入图表宽度' }]}>
              <InputNumber  type="inline" step={1}  name="zsmkbjpositionY"  min={0}  max={35}  style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="系列"  name="zsmkbjmultiple" required  rules={[{ required: true, message: '请选择系列' }]}>
              <Select   placeholder="系列"   options={mulitpleData} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="取值方式"  name="zsmkbjqzfs" required  rules={[{ required: true, message: '请选择取值方式' }]}>
              <Select   placeholder="取值方式"   options={zsmkqzfsData} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="URL:" name="zsmkbjurl">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="外层SQL：" name="zsmkbjsqlz" tooltip={zsmkbjsqlzsmValue}>
              <Input.TextArea  autoSize={{ minRows: 6, maxRows: 15 }}
                               style={{width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="SQL：" name="zsmkbjsql" tooltip={sqlsmValue}>
              <Input.TextArea  autoSize={{ minRows: 6, maxRows: 15 }}
                               style={{width: _width }} />
            </Form.Item>
          </Col>
          <Col  span={span}>
          </Col>
          <Col span={span}>
            <Form.Item label="所属菜单"  name="zsmkbjZsmkId" required  rules={[{ required: true, message: '请选择所属菜单' }]}>
              <Select   placeholder="所属菜单"   options={zmklist} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="更多连接:" name="zsmkbjmoreUrl">
              <Input allowClear style={{ width:  _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item name="zsmkbjstate" label="停用:" valuePropName="checked">
             <Checkbox />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
              <Input disabled  style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    )
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

  const onButtonClick = ()=> {
    setVisiblezddy(true);
  };

  const onFjClick = (val)=> {
    setBzmkbjid(val);
    setFjVisiblezddy(true);
  };
  const handleCancelfj = () => {
    setFjVisiblezddy(false);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{});
  };

  const handleOkfj = () => {
    setFjVisiblezddy(false);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{});
  };
  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
        <Button type="primary" onClick={() => onButtonClick()}>从标准模块导入</Button>
      </>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zsmkbjService));

  /**
   * 上传组件prop
   */
  const uploadProp: IUpload = {
    disableUpload: false,//上传按钮
    disableBigUpload: true, //大文件上传按钮
    disableDown: true, //下载按钮
    disableYwDown: true,  //水印下载
    disableViewDoc: true, //查阅
    disableYwViewDoc: true, //水印查阅
    uploadUrl:'/api/eps/ksh/zsmkbj/uploadfile', //上传url地址
    doctbl: '', //附件表名
    grptbl: '',//附件分组表名
    wrkTbl: '',//数据表名
    grpid: '',//附件分组id
    mj: '',//信息密集
    umId: '',//umId
    dakid: '',//档案库id
    tmzt: '', //条目状态
    daktmid: '',//条目id
    dw: SysStore.getCurrentUser().dwid,//用户单位ID
    aprint: '',//水印打印次数
    adown: '', //水印下载 次数
  }

//附件列表信息
  const uploadtableProp: ITable = {
    disableAdd: true,
    disableCopy: true,
    labelColSpan: 8,
    tableSearch: false,
    rowSelection:{
      type:'radio'
    },
  }

//附件修改表单
  const upcustomForm = () => {
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

  /**
   * 附件列表 表格source
   */
  const fjsource: EpsSource[] = [ {
    title: '文件名',
    code: 'zsmkbjfjfilename',
    align: 'center',
    formType: EpsFormType.Input,
    width:160
  }, {
    title: '文件类型',
    code: 'zsmkbjfjext',
    align: 'center',
    formType: EpsFormType.Input,
    width:40
  },
    {
      title: '文件大小',
      code: 'zsmkbjfjsize',
      align: 'center',
      formType: EpsFormType.Input,
      width:40
    }, {
      title: '版本号',
      code: 'zsmkbjfjbbh',
      align: 'center',
      formType: EpsFormType.Input,
      width:40
    }, {
      title: '校验码',
      code: 'zsmkbjfjmd5code',
      align: 'center',
      formType: EpsFormType.Input,
      width:130
    }, {
      title: '备注',
      code: 'zsmkbjfjbz',
      align: 'center',
      formType: EpsFormType.Input,
      width:100
    }, {
      title: '刷新时间',
      code: 'zsmkbjfjsj',
      align: 'center',
      formType: EpsFormType.Input,
      width:40
    }]

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        <EpsUploadButton  title={"附件信息"}                    // 组件标题，必填
                          uploadProp={uploadProp}       //附件上传prop
                          width={1300}
                          source={fjsource}
                          grpid={record.zsmkbjfilegrpid}
                          params={{'bzmkbjid':record.id}} //附件上传参数
                          tableProp={uploadtableProp}     //附件列表prop
                          tableService={zsmkbjFjService}  //附件列表server
                          customForm={upcustomForm}
                          fjs={record.zsmkbjfjs}
                          tableparams={{'bzmkbjid':record.id}} //附件列表参数
                          store={wjtore}
          //  customTableAction={}
        />
      </>
    );
  }

  useEffect(() => {
    const queryzmkList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/zsmk/findList";
        const response =await fetch.post(url,{});
        if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.zsmkmc, 'value': o.id }));
            setZmklist(SxData);
          }else{
            setZmklist(response.data);
          }
        }
      }
    }
    queryzmkList();
  }, []);

  const source: EpsSource[] = [{
    title: '模块编号',
    code: 'zsmkbjbh',
    align: 'center',
    formType: EpsFormType.Input
  }, {
    title: '模块标题',
    code: 'zsmkbjmc',
    align: 'center',
    formType: EpsFormType.Input
  },
    {
      title: '图表标题',
      code: 'zsmkbjqtmc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表位置序号',
      code: 'zsmkbjorder',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '图表尺寸大小',
      code: 'zsmkbjsize',
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
      code: 'zsmkbjwidth',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表高度',
      code: 'zsmkbjheight',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '横坐标',
      code: 'zsmkbjpositionX',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '纵坐标',
      code: 'zsmkbjpositionY',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '图表类型',
      code: 'zsmkbjtype',
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
      code: 'zsmkbjmultiple',
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
      title: '所属菜单',
      code: 'zsmkbjZsmkId',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let zsmlist=zmklist;
        let aa = zsmlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '取值方式',
      code: 'zsmkbjqzfs',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '刷新时间',
      code: 'zsmkbjrefresh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '停用',
      code: 'zsmkbjstate',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if(text == "true"){
          return "开启";
        }else{
          return "关闭";
        }
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
    name: '模块管理'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="模块编号" className="form-item" name="bzmkbh"><Input placeholder="请输入模块编号" /></Form.Item >
        <Form.Item label="模块标题" className="form-item" name="bzmkmc"><Input placeholder="请输入模块标题" /></Form.Item >
        <Form.Item label="所属菜单" className="form-item" name="zsmkbjZsmkId"><Select   placeholder="所属菜单"   options={zmklist}  /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                treeService={zsmkService}                  // 左侧树 实现类，必填
                tableService={zsmkbjService}             // 右侧表格实现类，必填
                ref={ref}                                // 获取组件实例，选填
                formWidth={1100}
                tableRowClick={(record) => console.log('abcef', record)}
                searchForm={searchFrom}
                customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
      <Modal
        title="标准模块"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        //footer={null}
        width='1300px'
      >
        <div  style={{ height:'500px'}}>
          <Bzmk />
        </div>
      </Modal>
    </>
  );
})

export default Zsmkbj;
