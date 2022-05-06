import React, { useEffect, useState } from 'react';
import { Row, Col, Tree, Input  } from 'antd';
import EpsTable from '@/eps/components/tables/EpsNormalTable'

import GnService from '@/services/example/gn';
import FuncService from '@/services/example/func';

const { Search } = Input;

import './index.less'
import EpsNormalTableStore from '@/eps/components/tables/EpsNormalTable/EpsNormalTableStore';
import { observer } from 'mobx-react';

const onCheck = (checkedKeys: React.Key[], info: any) => {
  console.log('onCheck', checkedKeys, info);
};

const onSearch  = async e => {
  let result = await GnService.findAll({fid: e})
  console.log(result || [])
};

const columnProp = [{
  dataIndex: 'dwbh',
  title: '单位编号',
}, {
  dataIndex: 'mc',
  title: '单位名称',
}, {
  dataIndex: 'qzh',
  title: '全宗号',
}, {
  dataIndex: 'bh',
  title: '档案馆',
  render: () => {
    return '是'
  }
}, {
  dataIndex: 'bz',
  title: '备注',
  width: 180
}, {
  dataIndex: 'whr',
  title: '维护人',
}, {
  dataIndex: 'whsj',
  title: '维护时间',
}]

const Dj3B= observer( (props) => {

  const [treeData, setTreeData] = useState([])
  const [tableStore, setTableStore]= useState();

  const [tablePro, setTablePro]= useState([]);

  async function getTreeData() {
    const tree = await GnService.findAll({})
    if(tree){
      let data = tree.map(data => {
          return {id: data.mkbh, title: data.mc, key: data.mkbh}
      })
      setTreeData(data || [])
    }
  }

  
  useEffect(() => {
    setTableStore(new EpsNormalTableStore(FuncService))
    getTreeData()
  },[]);

  const onSelect = async (selectedKeys: React.Key[], info: any) => {
    let data = await FuncService.findAll({mkbh: selectedKeys[0], page: 0, limit: 100})
    setTablePro(data.results || [])
  };

  const talbePro = {
    disableDelete: true,
    disableEdit: true
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={4}>
          <Search style={{ marginBottom: 8 }} placeholder="Search" onSearch={onSearch} />
          <Tree
            className="tree-height"
            checkable
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
          />
        </Col>
        <Col span={20}>
          <EpsTable pagination={{pageSize: 20}} store={FuncService} columnProp={columnProp} className="tree-height" dataList={tablePro} tableProp={talbePro}/>
        </Col>
      </Row>
    </>
  );
})

export default Dj3B;
