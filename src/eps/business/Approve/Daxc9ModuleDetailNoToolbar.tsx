import React, { useEffect, useRef, useState } from 'react';
import {
  EpsPanel,
  EpsTableStore,
} from '@/eps/components/panel/EpsPanelNoToolBar';
import InspectionService from './ApplyDetailService';
import { Input, Button, Drawer, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { BookOutlined, FileSearchOutlined } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import EpsFilesView from '@/eps/components/file/EpsFilesView';
import ArchModuleEditButton from './Daxc9ModuleEditButton';
import ApplyTimeline from './ApplyTimeline.tsx';
import NewDajyStore from '@/stores/daly/NewDajyStore';
const { TextArea } = Input;


/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
const inspectionService = new InspectionService('');
const Inspection = observer((props) => {
  inspectionService.setUrl(`/api/eps/control/main/${props.spurl}`);
  const [logVisible, setLogVisible] = useState(false);
  const [tmmx, setTmmx] = useState('');
  const ref = useRef();
  //
  const spColumns = [];

  const tableProp: ITable = {
    disableAdd: true,
    disableEdit: true,
    disableDelete: true,
    tableSearch: false,
    disableCopy: true,
    searchCode: 'name',
    rowSelection: {
      type: 'check',
    },
  };

  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {};

  const mulitApply = () => {};

  const [storeTable, setTableStore] = useState();

  useEffect(() => {
    let storeTable = ref.current?.getTableStore();
    props.setTableStore && props.setTableStore(storeTable);
  }, []);

  useEffect(() => {
    let st = ref.current?.getTableStore();
    if (st && props.fid && st.findByKey) {
      st.findByKey('', 1, st.size, {
        fid: props.fid,
        ...props.detailParams,
      });
    }
  }, [props.fid]);

  const refreshDetail = () => {
    let storeTable = ref.current?.getTableStore();
    if (storeTable && props.fid && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, {
        fid: props.fid,
        ...props.detailParams,
      });
    }
  };

  const onClose = () => {
    setLogVisible(false);
  };

  const viewLog = (value, index, record) => {
    setTmmx('');
    setTmmx(record.id);
    setLogVisible(true);
  };

  const findByDataLx = (text, record, index) => {
    let res: Array<any> = [];
    var dy = record?.mxdy === 'Y' ? 1 : 0;
    var xz = record?.mxxz === 'Y' ? 1 : 0;
    if (props?.detailParams?.wpid !== 'ZZZZ') {
      res.push(
        props.approve && (
          <ArchModuleEditButton
            title={'审批'}
            column={spColumns}
            refreshDetail={() => refreshDetail()}
            data={{
              spr: SysStore.getCurrentUser().yhmc,
              sprid: SysStore.getCurrentUser().id,
              sprq: moment(),
              jdlx: props.jdlx,
              daid: record.tmid,
              zt: props.detailParams.zt,
              jydid: record.id,
              wpid: props.detailParams.wpid,
              jylx: props.detailParams.jylx,
              dakid: props.detailParams.dakid,
              //fid: props.detailParams.fid,
              fid: record.fid,
              mxck: record.mxck,
              mxdy: record.mxdy,
              mxxz: record.mxxz,
              dzjy: record.dzjy,
              stjy: record.stjy,
            }}
            approveMark={props.approveMark}
            customForm={props.customForm}
          />
        ),
      );
    }
    // if(props.detailParams.wpid==='ZZZZ'){

    res.push(
      props.approve && (
        <EpsFilesView
          fjs={record.fjs}
          //bmc={props.detailParams.bmc}
          bmc={record.bmc}
          tmid={record.tmid}
          printfile={dy}
          downfile={xz}
          dakid={props.detailParams.dakid}
          grpid={record.filegrpid}
        />
      ),
    );
    //}

    return res;
  };

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(
    new EpsTableStore(inspectionService),
  );

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {

    return findByDataLx(text, record, index);
  };

  const title: ITitle = {
    name: '明细',
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={props.columns} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={inspectionService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        tableRowClick={props.tableRowClick}
        customForm={props.customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
      <Drawer
        title="审批意见"
        placement="right"
        tmmx={tmmx}
        width="500px"
        closable={false}
        onClose={onClose}
        visible={logVisible}
      >
        <ApplyTimeline kfjdmxid={tmmx} />
      </Drawer>
    </>
  );
});

export default Inspection;
