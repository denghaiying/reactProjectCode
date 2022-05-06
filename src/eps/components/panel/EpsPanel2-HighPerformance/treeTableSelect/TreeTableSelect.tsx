import React, { useState } from 'react';
import { TreeSelect } from 'antd';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import EpsTreeStore from '../EpsPanel2/EpsTreeStore';
import EpsTableStore from '../EpsPanel2/EpsTableStore';
import { ISelectService } from '@/eps/commons/panel';
import { runInAction } from 'mobx';

export interface TreeTableSelectProps {
  treeStore: EpsTreeStore;
  tableStore: EpsTableStore;
  selectService: ISelectService;
}

const TreeTableSelect = observer((props: TreeTableSelectProps) => {
  const [treeData, setTreeData] = useState<Array<Object>>([]);

  const [treeSelectValue, setTreeSelectValue] = useState(undefined);

  useEffect(() => {
    // service 调用拉取数据
    const getResult = async () => {
      let result = await props.selectService.findByKey(
        props.treeStore?.key,
        {},
      );
      setTreeData(result);
      result[0] && setTreeSelectValue(result[0]?.key);
      result[0] && (props.tableStore.key = result[0]?.key);
    };
    getResult();
  }, []);

  useEffect(() => {
    // service 调用拉取数据
    console.log('treeData is change, value is ' + props.treeStore?.key);
    const getResult = async () => {
      let result = await props.selectService.findByKey(
        props.treeStore?.key,
        {},
      );
      setTreeData(result);
      setTreeSelectValue(result[0]?.key || '');
      props.tableStore.key = result[0]?.key;
    };
    getResult();
  }, [props.treeStore?.key]);

  const onChange = (value) => {
    runInAction(() => {
      props.tableStore.key = value;
    });

    setTreeSelectValue(value);
  };

  return (
    <TreeSelect
      style={{ width: '250px', fontSize: '12px', marginRight: '10px' }}
      value={treeSelectValue}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="请选择"
      treeDefaultExpandAll
      onChange={onChange}
    />
  );
});

export default TreeTableSelect;
