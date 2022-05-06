import React, { useEffect, useRef, useState } from 'react';
import {
  EpsPanel,
  EpsTableStore,
} from '@/eps/components/panel/EpsPanelNoToolBar';
import EpsFormType from '@/eps/commons/EpsFormType';
import inspectionService from './ArchDetailService';
import {
  Form,
  Input,
  message,
  InputNumber,
  Select,
  DatePicker,
  Radio,
} from 'antd';
import { observer, useLocalObservable, useLocalStore } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import EpsFilesView from '@/eps/components/file/EpsFilesView';
import { runInAction } from 'mobx';
import TableService from '@/pages/dagl/Dagl/AppraisaManage/TableService';
import update from 'immutability-helper';

const { TextArea } = Input;
const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const ArchDetail = observer((props) => {
  const ref = useRef();
  const archParams = props.archParams;

  //

  const spColumns = [];
  //审批form
  const customForm = () => {
    return <></>;
  };
  const tableProp: ITable = {
    disableAdd: true,
    disableEdit: true,
    disableDelete: true,
    tableSearch: false,
    disableCopy: true,
    searchCode: 'name',
    rowSelection: {
      type: 'radio',
      onChange: (row) => alert(row),
    },
  };

  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [<></>];
  };

  const store = useLocalObservable(() => ({
    params: archParams,
    childParams: {},
    ktable: {},
    childKtable: {},
    childKfields: [],
    childColumns: [],
    params: {},
    dakid: archParams.dakid,
    childDakid: '',
    // 点击的主表的id，子表查询传递fid参数
    mainRowId: '',
    async initKtable() {
      debugger;
      // const ktable: KtableType = await TableService.queryKTable(archParams);
      const childKtable: KtableType = await TableService.queryKTable( archParams, );
      //   }
      console.log(childKtable, 'childktable111111111');
      const childKfields = await TableService.getKField({
        dakid: childKtable.id,
        lx: archParams.tmzt,
        pg: 'list',
      });
      runInAction(() => {
        this.childKfields = childKfields;
        store.childColumns = childKfields
          .filter((kfield) => kfield['lbkj'] === 'Y')
          .map((kfield) => ({
            width: kfield['mlkd'] * 1.3,
            code: kfield['mc'].toLowerCase(),
            title: kfield['ms'],
            ellipsis: true,
          }));
        this.childKtable = update(this.childKtable, {
          $set: childKtable,
        });

        this.childDakid = childKtable.id;
        debugger
        this.childParams = update(this.childParams, {
          $set: {
            bmc: childKtable.bmc,
            lx: childKtable.daklx,
            tmzt: archParams.tmzt,
            dakid: childKtable.id,
          },
        });
        console.log(childKtable, 'childktable22');
        if (props.setDakid) {
          props.setDakid(childKtable.id);
        }
      });
    },
  }));

  useEffect(() => {
    let storeTable = ref.current?.getTableStore();
    console.log('111', store.childParams);
    if (storeTable && store.childParams.bmc && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, {
        ...store.childParams,
        fid: props.recordId,
      });
    }
  }, [store.childParams]);

  useEffect(() => {
    // if (archParams.dakid) {
    store.initKtable(props.recordId);
    //   }
  }, [props.recordId]);

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(
    new EpsTableStore(inspectionService),
  );

  //**选择切换时把档案库信息和选择的条目信息传递给父组件 */
  // const onChangeRow=props.onChangRow(value,row);

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return [
      // <ApplyEditButton column={spColumns} title={"审批"}
      //     data={{
      //         spr: SysStore.getCurrentUser().yhmc,
      //         sprid: SysStore.getCurrentUser().id,
      //         sprq: moment(),
      //         jdlx: props.jdlx,
      //         daid: record.daid,
      //         zt: props.detailParams.zt,
      //         kfjdmxid: record.id,
      //         wpid: props.detailParams.wpid,
      //     }}
      //     customForm={customForm} />,
      <EpsFilesView
        fjs={record.fjs}
        bmc={store.childKtable?.bmc}
        tmid={record.daid}
        printfile={0}
        dakid={store.childKtable?.id}
        grpid={record.filegrpid}
      />,
    ];
  };

  const title: ITitle = {
    name: '卷内',
  };

  const searchFrom = () => {
    return <></>;
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={store.childColumns} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={inspectionService} // 右侧表格实现类，必填
        ref={ref}
        onChangeRow={(value, row) => props.onChangeRow(value, row)} // 获取组件实例，选填
        formWidth={500}
        tableAutoLoad={false}
        bmc={store.bmc}
        searchForm={searchFrom}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
    </>
  );
});

export default ArchDetail;
