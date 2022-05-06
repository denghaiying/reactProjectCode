import { Message } from '@alifd/next';
import React from 'react';
import Table from '@/eps/components/tables/EpsNormalTable/';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import Foo from '../../../stores/example/foo.ts';

function Danb() {
  const tableAction = (value, index, record) => {
    return(
    <div key={index}>
      <a href="" onClick={() => Message.success(record.title?.name)}>我是Message</a>
    </div>
    )
  }

  const columns = [{
    title: "编号",
    dataIndex: "code",
    width: 200,
    lock: true
  },
  {
      title: "名称",
      dataIndex: "name",
      width: 250
  }, {
      title: '维护时间',
      dataIndex: 'whsj',
      width: 200,
  }]

  const table = {
    size:  'small' as SizeType
  }

  return (
    <Table store={Foo} columnProp={columns} tableProp={table}></Table>
  );
}

export default Danb;
