import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import dddlService from './service/DddlService';
import { Form, Input, message, Select, Checkbox } from 'antd';
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

import moment from 'moment';
import fetch from '@/utils/fetch';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [
  { value: 0, label: '密码明文', key: 0 },
  { value: 1, label: 'md5加密密码', key: 1 },
  { value: 2, label: '不验证密码', key: 2 },
  { value: 3, label: '接口密码', key: 3 },
];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',
  onEditClick: (form, record) => {
    if (record.basejm == 'Y') {
      record.basejm = true;
    } else {
      record.basejm = false;
    }
    if (record.gdmmyz == 'Y') {
      record.gdmmyz = true;
    } else {
      record.gdmmyz = false;
    }
    form.setFieldsValue(record);
  },
};

const Dddl = observer((props) => {
  const ref = useRef();
  const [gdmmdisable, setGdmmdisable] = useState(true);

  const onGgdmmyzChange = (value) => {
    let checked = value.target.checked;
    if (checked) {
      setGdmmdisable(false);
    } else {
      setGdmmdisable(true);
    }
  };

  const customForm = () => {
    return (
      <>
        <Form.Item label="验证方式:" name="lx">
          <Select
            placeholder="接口类型"
            options={lxData}
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item label="BASE64加密:" name="basejm" valuePropName="checked">
          <Checkbox style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="使用固定密码:" name="gdmmyz" valuePropName="checked">
          <Checkbox style={{ width: 300 }} onChange={onGgdmmyzChange} />
        </Form.Item>
        <Form.Item label="固定密码:" name="gdmm">
          <Input disabled={gdmmdisable} style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
          <Input disabled style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
          <Input disabled style={{ width: 300 }} />
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

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(dddlService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return <></>;
  };
  useEffect(() => {
    //YhStore.queryForPage();
    // setGdmmdisable(true);
  }, []);

  const source: EpsSource[] = [
    {
      title: '验证方式',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let xlxlist = lxData;
        let aa = xlxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
      with: 400,
    },
    {
      title: 'BASE64加密',
      code: 'basejm',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === 'Y') {
          return '是';
        } else {
          return '否';
        }
      },
      with: 400,
    },
    {
      title: '使用固定密码',
      code: 'gdmmyz',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === 'Y') {
          return '是';
        } else {
          return '否';
        }
      },
      with: 400,
    },

    // {
    //   title: '固定密码',
    //   code: 'whr',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   with: 300
    // },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      with: 300,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      with: 300,
    },
  ];
  const title: ITitle = {
    name: '单点登录配置',
  };

  const searchFrom = () => {
    return <></>;
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={dddlService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        //searchForm={searchFrom}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
    </>
  );
});

export default Dddl;
