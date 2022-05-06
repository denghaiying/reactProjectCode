import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import IEpsService from '@/eps/commons/IEpsService';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

import './index.less';
import EpsEditButton from '../../buttons/EpsEditButton/index';
import EpsDeleteButton from '../../buttons/EpsDeleteButton/index';
import { observer } from 'mobx-react';
import EpsNormalTableStore from './EpsNormalTableStore';

export interface ITable {
  size?: SizeType;
  onRowClick?: Function;
  onRowMouseEnter?: Function;
  onRowMouseLeave?: Function;
  onSort?: Function;
  onFilter?: Function;
  onResizeChange?: Function;
  rowProps?: Function;
  cellProps?: Function;
  hasBorder?: Boolean;
  hasHeader?: Boolean;
  disableEdit?: Boolean;
  disableDelete?: Boolean;
  disableIndex?: Boolean;
}

export interface IColumn {
  dataIndex?: String;
  title: String;
  key?: String;
  width?: Number|String;
  render?: Function;
  customRender?: Function;
  className?: String;
}



export interface IEpsTableProps {
  pagination: object;
  store: IEpsService;
  tableProp?: ITable;
  columnProp: IColumn[];
  loadData?: Function;
  className: string;
  dataList?: any[];
}

const rowClass = (record, index) => {
  return index % 2 === 0 ? '' : 'tableBack';
};

const EpsNormalTable = observer((params: IEpsTableProps) => {

  const [dataList, setDataList] = useState([]);
  const [columns, SetColumns] = useState<any[]>([]);
  const [loding, setLoding] = useState(false);
  const ds: IEpsTableProps = params;
  let Store:EpsNormalTableStore;

  async function loadData(params) {
    Store.findAll(params);
  }

  useEffect(() => {
    setLoding(true);
    Store = new EpsNormalTableStore(ds.store)
    const lis = ds.columnProp || [];
    const enableIndex = !ds.tableProp?.disableIndex;
    if (enableIndex) {
      lis.unshift({
        title: '序号',
        className: 'tableHeader',
        width: 60,
        render: (_, __, index: number) => index + 1,
      });
    }
    const enableEdit = !ds.tableProp?.disableEdit;
    const enableDelete = !ds.tableProp?.disableDelete;
    const actionWidth = 0 + (enableEdit ? 50 : 0) + (enableDelete ? 50 : 0);
    if (enableDelete || enableEdit) {
      lis.push({
        title: '操作',
        key: 'action',
        width: actionWidth,
        render: (text) => (
          <>
            {enableEdit && <EpsEditButton />}
            {enableDelete && <EpsDeleteButton data={text} store={ds.store} />}
          </>
        ),
      });
    }
    SetColumns(lis);
    if(ds.dataList){
      setDataList(ds.dataList)
    }else{
      loadData({});
      setDataList( dataList)
    }
    setLoding(false);
  }, [ds.dataList]);

  return (
    <Table dataSource={dataList} pagination={ds.pagination} columns={columns} loading={loding} rowKey="id" bordered {...ds.tableProp} rowClassName={rowClass} size="small" className={ds.className || 'epstable'}/>
  );
});

export default EpsNormalTable;
