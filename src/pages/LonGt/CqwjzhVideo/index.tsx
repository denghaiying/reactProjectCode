import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import CqwjzhVideoService from './service/CqwjzhVideoService';
import {
  Form,
  Input,
  message,
  Select,
  FormInstance,
  Radio,
  InputNumber,
} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import {
  InteractionTwoTone,
  ContactsTwoTone,
  ControlTwoTone,
  GoldTwoTone,
} from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from '../../../utils/fetch';
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const zhhlx = [
  { value: 'mp4', label: 'mp4' },
  { value: 'flv', label: 'flv' },
  { value: 'avi', label: 'avi' },
  { value: 'mpg', label: 'mpg' },
  { value: 'wmv', label: 'wmv' },
  { value: '3gp', label: '3gp' },
  { value: 'rm', label: 'rm' },
];
const CqwjzhVideo = observer((props) => {
  const tableProp: ITable = {
    disableCopy: true,
    searchCode: 'name',
    onEditClick: (form, record) => {
      if (record.withAudio === 1) {
        record.withAudio = '1';
      } else {
        record.withAudio = '2';
      }
      form.setFieldsValue(record);
    },
  };

  const ref = useRef();

  const _width = 380;

  const [cqwjVideolist, setCqwjVideolist] = useState<
    Array<{ id: string; label: string; value: string }>
  >([]);

  const { withAudioValue, setWithAudioValue } = useState(1);

  const customForm = (form: FormInstance) => {
    return (
      <>
        <Form.Item
          label="转换后文件类型:"
          name="outFileName"
          required
          rules={[{ required: true, message: '请选择转换后文件类型' }]}
        >
          <Select
            placeholder="请选择"
            options={zhhlx}
            style={{ width: _width }}
          />
        </Form.Item>

        <Form.Item label="质量系数:" name="crf">
          <Select style={{ width: _width }} className="ant-select">
            <option value="28">低质量</option>
            <option value="26">中等质量</option>
            <option value="23">高质量</option>
          </Select>
        </Form.Item>

        {/* <Form.Item label="编码速率:" name="preset">
          <Select style={{ width: _width }} className="ant-select">
            <option value="faster">最快压缩速度</option>
            <option value="fast">第二快的压缩速度</option>
            <option value="medium">中等压缩速度</option>
            <option value="slow">低压缩速度</option>
            <option value="slower">最慢压缩速度</option>
          </Select>
        </Form.Item> */}
        <Form.Item label="像素格式:" name="pixfmt">
          <Input allowClear style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="视频宽度:" name="width">
          <InputNumber style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="视频高度:" name="height">
          <InputNumber style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="视频码率(K):" name="bv">
          <Input style={{ width: _width }} />
        </Form.Item>
        {/* <Form.Item
          label="编码格式:"
          name="vcodec"
        >
          <Input allowClear style={{ width: _width }} />
        </Form.Item> */}
        <Form.Item label="视频帧率:" name="rfps">
          <InputNumber style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="是否保留音频:" name="withAudio">
          <Radio.Group value={withAudioValue}>
            <Radio.Button value="1">保留</Radio.Button>
            <Radio.Button value="2">不保留</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="音频声道数:" name="ac">
          <InputNumber style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="声音采样率:" name="ar">
          <InputNumber style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="音频码率(K):" name="ab">
          <Input style={{ width: _width }} />
        </Form.Item>
        {/* <Form.Item name="state" label="状态:" initialValue="true">
          <Radio.Group>
            <Radio.Button value="true">开启</Radio.Button>
            <Radio.Button value="false">关闭</Radio.Button>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
          <Input disabled style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
          <Input disabled style={{ width: _width }} />
        </Form.Item>

        {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
      </>
    );
  };
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return [<></>];
  };

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return <></>;
  };
  useEffect(() => {
    const queryCqwjVideoList = async () => {
      let url = '/api/eps/control/main/cqbcwjzhvideo/queryForList';
      const response = await fetch.get(url);
      if (response.status === 200) {
        if (response.data.length > 0) {
          let SxData = response.data.map((o) => ({
            id: o.id,
            label: o.ext,
            value: o.ext,
          }));
          setCqwjVideolist(SxData);
        } else {
          setCqwjVideolist(response.data);
        }
      }
    };
    queryCqwjVideoList();
    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [
    {
      title: '转换后文件类型',
      code: 'outFileName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '质量系数',
      code: 'crf',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
      render: (text, record, index) => {
        if (text === 28) {
          return '低质量';
        } else if (text === 26) {
          return '中等质量';
        } else if (text === 23) {
          return '高质量';
        }
      },
    },
    // {
    //   title: '编码速率',
    //   code: 'preset',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   width: 180,
    // },
    {
      title: '像素格式',
      code: 'pixfmt',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },

    {
      title: '视频宽度',
      code: 'width',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '视频高度',
      code: 'height',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '视频码率(K)',
      code: 'bv',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    // {
    //   title: '编码格式',
    //   code: 'vcodec',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   width: 150,
    // },
    {
      title: '视频帧率',
      code: 'rfps',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },

    {
      title: '是否保留音频',
      code: 'withAudio',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
      render: (text, record, index) => {
        if (text === 1) {
          return '保留';
        } else {
          return '不保留';
        }
      },
    },
    {
      title: '音频声道数',
      code: 'ac',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '声音采样率',
      code: 'ar',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '音频码率(K)',
      code: 'ab',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
  ];
  const title: ITitle = {
    name: '视频转换配置',
  };

  // const searchFrom = () => {
  //   return (
  //     <>
  //       <Form.Item label="转换后文件格式" className="form-item" name="key">
  //         <Input placeholder="请输入转换后文件格式" style={{ width: 300 }} />
  //       </Form.Item>
  //     </>
  //   );
  // };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={CqwjzhVideoService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={600}
        //   searchForm={searchFrom}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        //    customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
    </>
  );
});

export default CqwjzhVideo;
