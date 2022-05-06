import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef } from 'react';
import { observer, useLocalObservable, } from 'mobx-react';
import { Button, Form, Input, message, Tooltip } from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import ClkonffService from './Service/ClkonffService';
import ClkonffmxService from './Service/ClkonffmxService';
import { SmileOutlined } from '@ant-design/icons';
import moment from 'moment';
import SysStore from '@/stores/system/SysStore';
import fetch from '@/utils/fetch';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * 打卡记录
 */
const Dkjl = observer((props) => {
  //权限按钮
  const umid = 'DPS008';
  OptrightStore.getFuncRight(umid);
  const ref = useRef();
  useEffect(() => {

  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
    searchCode: 'xm',
  }

  // 表单名称
  const title: ITitle = {
    name: '打卡记录'
  }

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '日期',
      code: 'date',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '用户姓名',
      code: 'xm',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '上班时间',
      code: 'ontime',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '下班时间',
      code: 'offtime',
      align: 'center',
      formType: EpsFormType.Input
    },
  ]

  //store层
  const dkjlStore = useLocalObservable(() => (
    {
      async dkjl(data: {}) {
        await fetch.post(`/api/eps/dps/clkonff/dkjl`, data);
         },
    }
  )
  );

  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        <Form.Item label="用户姓名:" name="xm" required rules={[{ required: true, message: '请输入用户姓名' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
      </>
    )
  }

  //上、下班打卡按钮
  const sxbdk = (value: number) => {
    const data = {};
    data['yhId'] = SysStore.getCurrentUser().id;
    data['login'] = SysStore.getCurrentUser().bh;
    data['xm'] = SysStore.getCurrentUser().yhmc;
    data['date'] = moment().format('YYYY-MM-DD');
    data['time'] = moment().format('HH:mm:ss');
    data['source'] = '手工打卡';
    if (value === 1) {
      data['type'] = '01';
    } else if (value === 2) {
      data['type'] = '02';
    }
    ClkonffmxService.saveByKey(data).then(() => {
      if (data.type === '02') {
        const param = { params: { date: data.date, yhId: data.yhId } };
        fetch
          .get('/api/eps/dps/clkonff/list/', { params: param }).then((res) => {
            if (res.data.length === 0) {
              message.error("请先打上班卡！");
            } else {
              dkjlStore.dkjl(data).then(() => {
                message.success("打卡成功");
                const tableStore = ref.current?.getTableStore();
                tableStore.findByKey(tableStore.key, 1, tableStore.size, { xm: '' }).then(() => {
                })
              })
            }
          })
      } else if (data.type === '01') {
        dkjlStore.dkjl(data).then(() => {
          message.success("打卡成功");
          const tableStore = ref.current?.getTableStore();
          tableStore.findByKey(tableStore.key, 1, tableStore.size, { xm: '' }).then(() => {
          })
        })
      }
    })
  }

  //自定义布局组件（上班、下班按钮）
  const customAction = (store: EpsTableStore) => {
    return ([
      <>
        {OptrightStore.hasRight(umid, 'SYS101') &&
          <Button type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} onClick={() => sxbdk(1)}
            icon={<SmileOutlined />}>上班打卡</Button>}
        {OptrightStore.hasRight(umid, 'SYS102') &&
          <Button type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} onClick={() => sxbdk(2)}
            icon={<SmileOutlined />}>下班打卡</Button>}
      </>
    ])
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={ClkonffService}           // 右侧表格实现类，必填
        formWidth={500}
        ref={ref}
        customAction={customAction}              // 自定义全局按钮（如新增、导入、查询条件、全局打印 等），选填
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      >
      </EpsPanel>
    </>
  );
})

export default Dkjl;

