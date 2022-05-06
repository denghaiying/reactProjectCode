import React, { useEffect, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import SjcjService from './service/SjcjService';
import { Form, Select, Button, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
/**
 * 数据采集
 *
 */
const Sjcj = observer((props) => {
  const [searchForm] = Form.useForm();
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
  };
  const ref = useRef();
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return [
      <>
        <Form layout="inline" form={searchForm}>
          <Form.Item label="推送时间:" name="sendtime">
            <DatePicker.RangePicker style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="处理时间:" name="dealtime">
            <DatePicker.RangePicker style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="处理状态:" name="state">
            <Select
              allowClear
              placeholder="请选择处理状态"
              style={{ width: 180 }}
              showArrow
              showSearch
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }}
            >
              <Select.Option value="0">未处理</Select.Option>
              <Select.Option value="1">已处理</Select.Option>
              <Select.Option value="2">归档包异常</Select.Option>
              <Select.Option value="3">处理失败</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="检测状态:" name="jcstate">
            <Select
              allowClear
              placeholder="请选择检测状态"
              style={{ width: 180 }}
              showArrow
              showSearch
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }}
            >
              <Select.Option value="1">检测通过</Select.Option>
              <Select.Option value="2">检测不通过</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" onClick={onSearchClick}>
            查询
          </Button>
        </Form>
      </>,
    ];
  };

  const onSearchClick = () => {
    searchForm.validateFields().then((values) => {
      if (values.sendtime != undefined) {
        values['sstime'] = values.sendtime[0].format('yyyy-MM-DD');
        values['setime'] = values.sendtime[1].format('yyyy-MM-DD');
      } else if (values.dealtime != undefined) {
        values['dstime'] = values.dealtime[0].format('yyyy-MM-DD');
        values['detime'] = values.dealtime[1].format('yyyy-MM-DD');
      }
      const tableStore = ref.current?.getTableStore();
      tableStore.findByKey(tableStore.key, 1, tableStore.size, values);
    });
  };

  useEffect(() => {}, []);

  const source: EpsSource[] = [
    {
      title: '业务分类',
      code: 'businesscode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 70,
    },
    {
      title: '归档包名称',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '目录方式',
      code: 'pathtype',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '归档包后缀名',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '归档包路径',
      code: 'path',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '归档包类型',
      code: 'type',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '归档包大小',
      code: 'size',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '服务器类型',
      code: 'server',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '程序',
      code: 'programe',
      align: 'center',
      formType: EpsFormType.Input,
      width: 60,
    },
    {
      title: '操作系统版本',
      code: 'system',
      align: 'center',
      formType: EpsFormType.Input,
      width: 90,
    },
    {
      title: '归档包MD5验证码',
      code: 'md5',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '归档包创建时间',
      code: 'createtime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '归档包推送时间',
      code: 'sendtime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '归档包处理时间',
      code: 'dealtime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 130,
    },
    {
      title: '处理状态',
      code: 'state',
      align: 'center',
      formType: EpsFormType.Input,
      width: 75,
      render: (value) => {
        if (value === '0') {
          return '未处理';
        } else if (value === '1') {
          return '已处理';
        } else if (value === '2') {
          return '归档包异常';
        } else {
          return '处理错误';
        }
      },
    },
    {
      title: '检测状态',
      code: 'jcstate',
      align: 'center',
      formType: EpsFormType.Input,
      width: 75,
      render: (value) => {
        return value === '1' ? '检测通过' : '检测不通过';
      },
    },
    {
      title: '处理信息',
      code: 'message',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
  ];
  const title: ITitle = {
    name: '数据采集',
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={SjcjService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
    </>
  );
});

export default Sjcj;
