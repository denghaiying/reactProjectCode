import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  message,
  Select,
  Tooltip,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import OptrightStore from '@/stores/user/OptrightStore';
import fetch from '../../../utils/fetch';
import GpcwhService from './Service/GpcwhService';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import { UpCircleTwoTone, DownCircleTwoTone } from '@ant-design/icons';

/**
 * 高频词维护
 */
const Gpcwh = observer((props) => {
  //权限按钮
  const umid = 'JC091';
  OptrightStore.getFuncRight(umid);
  const ref = useRef();
  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  useEffect(() => {}, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    searchCode: 'ms',
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),

    onEditClick: (form, data) => {
      GpcwhStore.GpcwhData = data.ms;
    },
  };

  //外出管理store
  const GpcwhStore = useLocalObservable(() => ({
    GpcwhData: [],
    //上移、下移按钮
    async moverow(data: any) {
      await fetch.post('/api/eps/control/main/gcpwh/sxyd', data);
    },
  }));
  // 表单名称
  const title: ITitle = {
    name: '高频词维护',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '高频词名称',
      code: 'ms',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];

  const shangclick = (
    record: { [x: string]: string; worktplId: any },
    index: any,
    store: any,
  ) => {
    record['lx'] = 's';
    GpcwhStore.moverow(record).then(() => {
      const tableStoresy = ref.current?.getTableStore();
      tableStoresy.findByKey().then(() => {
        message.success('上移成功');
      });
    });
  };
  const xiaclick = (
    record: { [x: string]: string; worktplId: any },
    index: number,
    store: { total: any },
  ) => {
    record['lx'] = 'x';
    GpcwhStore.moverow(record).then(() => {
      const tableStoresy = ref.current?.getTableStore();
      tableStoresy.findByKey().then(() => {
        message.success('下移成功');
      });
    });
  };
  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        <Form.Item
          label="高频词名称:"
          name="ms"
          required
          validateFirst
          rules={[
            { required: true, message: '请输入高频词' },
            { max: 20, message: '高频词长度不能超过20个字符' },
            {
              async validator(_, value) {
                if (GpcwhStore.GpcwhData === value) {
                  return Promise.resolve();
                }
                const param = { ms: value, source: 'jq' };
                await fetch
                  .get('/api/eps/control/main/gcpwh/queryForList', {
                    params: param,
                  })
                  .then((res) => {
                    if (res.data.results.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('此名称已存在，请重新命名'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input
            allowClear
            style={{ width: 250 }}
            disabled={GpcwhStore.codeData}
          />
        </Form.Item>

        <Form.Item label="维护人:" name="whr">
          <Input style={{ width: 250 }} disabled defaultValue={whr} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj">
          <Input
            style={{ width: 250 }}
            disabled
            defaultValue={moment().format('YYYY-MM-DD HH:mm:ss')}
          />
        </Form.Item>
        <Form.Item label="序号:" name="xh" hidden>
          <Input />
        </Form.Item>
      </>
    );
  };

  const customTableAction = (
    text: any,
    record: any,
    index: any,
    store: any,
  ) => {
    return [
      <Tooltip title="上移">
        {OptrightStore.hasRight(umid, 'SYS104') && (
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type="primary"
            shape="circle"
            icon={<UpCircleTwoTone />}
            onClick={() => shangclick(record, index, store)}
          />
        )}
      </Tooltip>,
      <Tooltip title="下移">
        {OptrightStore.hasRight(umid, 'SYS105') && (
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type="primary"
            shape="circle"
            icon={<DownCircleTwoTone />}
            onClick={() => xiaclick(record, index, store)}
          />
        )}
      </Tooltip>,
    ];
  };
  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={GpcwhService} // 右侧表格实现类，必填
        formWidth={500}
        ref={ref}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}
      ></EpsPanel>
    </>
  );
});

export default Gpcwh;
