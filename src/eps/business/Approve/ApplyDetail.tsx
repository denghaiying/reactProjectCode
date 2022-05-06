import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import InspectionService from './ApplyDetailService';
import {
  Form,
  Input,
  message,
  InputNumber,
  Select,
  DatePicker,
  Radio,
  Button,
  Drawer,
  Tooltip,
} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import {
  InteractionTwoTone,
  ContactsTwoTone,
  ControlTwoTone,
  GoldTwoTone,
  UploadOutlined,
  BookOutlined,
} from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import EpsFilesView from '@/eps/components/file/EpsFilesView';
import ApplyEditButton from './ApplyEditButton';
import ApplyTimeline from './ApplyTimeline.tsx';
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
  //审批form
  const customForm = () => {
    return (
      <>
        <Form.Item label="审批人" name="spr">
          <Input disabled style={{ width: 380 }} placeholder="" />
        </Form.Item>
        <Form.Item label="审批时间" name="sprq">
          <DatePicker style={{ width: 380 }} showTime />
        </Form.Item>
        {props.approve && (
          <Form.Item label="审批" name="spzt">
            <Radio.Group defaultValue="a" buttonStyle="solid">
              <Radio.Button value="Y">
                {props.approveMark.agree || '同意'}
              </Radio.Button>
              <Radio.Button value="N">
                {props.approveMark.disAgree || '不同意'}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item label="意见" name="remark">
          <TextArea rows={2} />
        </Form.Item>
      </>
    );
  };
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
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      props.approve && (
        <ApplyEditButton
          column={spColumns}
          title={'批量审批'}
          isButton={true}
          refreshDetail={() => refreshDetail()}
          data={{
            spr: SysStore.getCurrentUser().yhmc,
            sprid: SysStore.getCurrentUser().id,
            sprq: moment(),
            jdlx: props.jdlx,
            daid: ids
              .map((o) => {
                return o.daid;
              })
              .join(','),
            kfjdmxid: ids
              .map((o) => {
                return o.id;
              })
              .join(','),
            zt: props.detailParams.zt,
            wpid: props.detailParams.wpid,
          }}
          customForm={customForm}
        />
      ),
    ];
  };

  const mulitApply = () => {};

  useEffect(() => {
    debugger;
    let storeTable = ref.current?.getTableStore();
    props.setTableStore && props.setTableStore(storeTable);
  }, []);

  useEffect(() => {
    debugger;
    let storeTable = ref.current?.getTableStore();
    if (storeTable && props.fid && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, {
        fid: props.fid,
        ...props.detailParams,
      });
    }
  }, [props.fid]);

  useEffect(() => {
    debugger;
    refreshDetail();
  }, [props.fid]);

  const refreshDetail = () => {
    debugger;
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

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(
    new EpsTableStore(inspectionService),
  );

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return [
      props.approve && (
        <ApplyEditButton
          column={spColumns}
          title={'审批'}
          refreshDetail={() => refreshDetail()}
          data={{
            spr: SysStore.getCurrentUser().yhmc,
            sprid: SysStore.getCurrentUser().id,
            sprq: moment(),
            jdlx: props.jdlx,
            daid: record.daid,
            zt: props.detailParams.zt,
            kfjdmxid: record.id,
            wpid: props.detailParams.wpid,
          }}
          approveMark={props.approveMark}
          customForm={customForm}
        />
      ),
      props.approve && (
        <Tooltip title={'日志'}>
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type={'primary'}
            shape="circle"
            icon={<BookOutlined />}
            onClick={() => viewLog(text, index, record)}
          />
        </Tooltip>
      ),
      <EpsFilesView
        fjs={record.fjs}
        bmc={props.detailParams.bmc}
        tmid={record.daid}
        printfile={0}
        dakid={props.detailParams.dakid}
        grpid={record.filegrpid}
      />,
    ];
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
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
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
