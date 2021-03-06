import React, {FC, useEffect, useRef, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import InspectionService from '../ApplyDetailService';
import {
  Input,
  Button,
  Drawer,
  Tooltip, Card, Row, Col, List, Progress, Modal, Avatar, Upload, message,
} from 'antd';
import {observer, useLocalStore} from 'mobx-react';
import {  ITable } from '@/eps/commons/declare';
import {

  BookOutlined, PlusOutlined, UploadOutlined,
} from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import EpsFilesView from '@/eps/components/file/EpsFilesView';
import ApplyEditButton from '../ApplyEditButton';
import ApplyTimeline from '../ApplyTimeline.tsx';
import { useRequest } from 'umi';


import type { ProFormInstance } from '@ant-design/pro-form';

import fetch from "@/utils/fetch";
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import {addFakeList, queryFakeList, removeFakeList, updateFakeList,downloadFakeList} from "@/eps/business/Approve/Fzps/service";
import {BasicListItemDataType} from "@/eps/business/Approve/Fzps/data.d";
import OperationModal from "@/eps/business/Approve/Fzps/components/OperationModal";
import EpsUploadSimple from '@/eps/components/uploadSimple';
import EpsUploadButton from '@/eps/components/buttons/EpsUploadButton';
import xtfjService from '@/pages/sys/xt/xtfjService';
import {showMessage} from "@/eps/components/message";



const { TextArea } = Input;

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);


// const ListContent = ({
//                        data: { whr, whsj, percent, status },
//                      }: {
//   data: BasicListItemDataType;
// }) => (
//   <div className={styles.listContent}>
//     <div className={styles.listContentItem} style={{ width: 180 }}>
//       <span>?????????</span>
//       <p>{whr}</p>
//     </div>
//     <div className={styles.listContentItem} style={{ width: 180 }}>
//       <span>????????????</span>
//       <p>{moment(whsj).format('YYYY-MM-DD HH:mm')}</p>
//     </div>
//     {/*<div className={styles.listContentItem}>*/}
//     {/*  <span>??????</span>*/}
//     {/*  <p>{moment(whsj).format('YYYY-MM-DD HH:mm')}</p>*/}
//     {/*</div>*/}
//      <div className={styles.listContentItem}>
//       <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
//     </div>
//   </div>
// );

const ListContent = ({
                       data: { owner, createdAt, percent, status },
                     }: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{owner}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>????????????</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

/**
 * ??????????????????
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
const inspectionService = new InspectionService('');


const FzpsApplyDetail = observer((props) => {

  console.log("fzpsapplydetails",props);

  inspectionService.setUrl(`/api/eps/control/main/${props.spurl}`);
  const [logVisible, setLogVisible] = useState(false);
  const [tmmx, setTmmx] = useState('');
  const ref = useRef();


  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<BasicListItemDataType>();
  const [toolsDisabled, setToolsDisabled] = useState<boolean>(false);

  const [addVisible, setAddVisible] = useState<boolean>(true);

  const [fid,setFid]=useState('');
  const [curRecord,setCurRecord]=useState({});

  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(() => {
    return queryFakeList({
      count: 50,
    });
  });

  const { run: postRun } = useRequest(
    (method, params) => {


      if (method === 'remove') {
        return removeFakeList(params);
      }
      if (method === 'update') {

          return updateFakeList(params);

      }

      return addFakeList(params);

    },
    {
      manual: true,
      onSuccess: (result) => {
        mutate(result);
      },
    },
  );


  const list = listData?.list || [];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };

  const showEditModal = (item: BasicListItemDataType) => {
    const zj=FzspDetailStore.zj;
    debugger
    if (zj && zj.id) {
      setVisible(true);
      setCurrent(item);
    }else{
      showMessage("?????????????????????????????????!","info");
    }
  };

  const openTool = (item) => {
    setCurrent(item);
    setCurRecord(item);
    setToolsDisabled(true);
  };

  const deleteItem = (id: string) => {
    postRun('remove', { id });
  };

  const deleteRecord = (currentItem: BasicListItemDataType) => {
   //   FzspDetailStore.queryFjData(props.fid);
    const zj=FzspDetailStore.zj;
    debugger
    if (zj && zj.id){

          Modal.confirm({
            title: '??????',
            content: '??????????????????',
            okText: '??????',
            cancelText: '??????',
            onOk: () => deleteItem(currentItem.id),
          });
      }else{
        showMessage("?????????????????????????????????!","info");
      }

  };



  const editAndDelete = (key: string | number, currentItem: BasicListItemDataType) => {
    debugger
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '??????',
        content: '??????????????????',
        okText: '??????',
        cancelText: '??????',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };


  const FzspDetailStore = useLocalStore(() => ({


    //dwTreeData: [],

    defaultData:[],
    zj:{},


    async queryFjData(fid) {
      console.log("props.detailParams",fid);
      console.log("props.fid",props.fid)
    //  const response = await fetch.get(`/api/eps/control/main/fzspdetail/queryForPage?limit=50&page=0&fzpsid=`+fid);
    const response = await fetch.get(`/api/eps/control/main/fzspdetail/queryForList?fzpsid=`+fid);
      debugger
      if (response.status === 200) {
        if (response.data.success) {
          console.log(response.data.results)
          this.defaultData = response.data.results;
        }
      }
    },

    async queryZj(sfid) {
      console.log("props.detailParams",fid);
      console.log("props.fid",props.fid)
      //  const response = await fetch.get(`/api/eps/control/main/fzspdetail/queryForPage?limit=50&page=0&fzpsid=`+fid);
      const response = await fetch.get(`/api/eps/control/main/fzspzj/queryByZj?fzpsid=`+sfid+`&yhid=`+SysStore.getCurrentUser().id);
      debugger
      if (response.status === 200) {
          this.zj = response.data;
      }
    },
  }));

  //??????form
  // const customForm = () => {
  //   return (
  //     <>
  //       <Form.Item label="?????????" name="spr">
  //         <Input disabled style={{ width: 380 }} placeholder="" />
  //       </Form.Item>
  //       <Form.Item label="????????????" name="sprq">
  //         <DatePicker style={{ width: 380 }} showTime />
  //       </Form.Item>
  //       {props.approve && (
  //         <Form.Item label="??????" name="spzt">
  //           <Radio.Group defaultValue="a" buttonStyle="solid">
  //             <Radio.Button value="Y">
  //               {props.approveMark.agree || '??????'}
  //             </Radio.Button>
  //             <Radio.Button value="N">
  //               {props.approveMark.disAgree || '?????????'}
  //             </Radio.Button>
  //           </Radio.Group>
  //         </Form.Item>
  //       )}
  //       <Form.Item label="??????" name="remark">
  //         <TextArea rows={2} />
  //       </Form.Item>
  //     </>
  //   );
  // };
  // const tableProp: ITable = {
  //   disableAdd: true,
  //   disableEdit: true,
  //   disableDelete: true,
  //   tableSearch: false,
  //   disableCopy: true,
  //   searchCode: 'name',
  //   rowSelection: {
  //     type: 'check',
  //   },
  // };
  //
  // // ??????????????????
  // const customAction = (store: EpsTableStore, ids: any[]) => {
  //   return [
  //     props.approve && (
  //       <ApplyEditButton
  //         column={spColumns}
  //         title={'????????????'}
  //         isButton={true}
  //         refreshDetail={() => refreshDetail()}
  //         data={{
  //           spr: SysStore.getCurrentUser().yhmc,
  //           sprid: SysStore.getCurrentUser().id,
  //           sprq: moment(),
  //           jdlx: props.jdlx,
  //           daid: ids
  //             .map((o) => {
  //               return o.daid;
  //             })
  //             .join(','),
  //           kfjdmxid: ids
  //             .map((o) => {
  //               return o.id;
  //             })
  //             .join(','),
  //           zt: props.detailParams.zt,
  //           wpid: props.detailParams.wpid,
  //         }}
  //         customForm={customForm}
  //       />
  //     ),
  //   ];
  // };
  //
  // const mulitApply = () => {};

  useEffect(() => {
    // debugger;
    // let storeTable = ref.current?.getTableStore();
    // props.setTableStore && props.setTableStore(storeTable);
    FzspDetailStore.queryFjData();
 //   setAddVisible(false);
  }, []);

  // useEffect(() => {
  //   // debugger;
  //   // let storeTable = ref.current?.getTableStore();
  //   // props.setTableStore && props.setTableStore(storeTable);
  //   FzspDetailStore.queryFjData();
  // }, [props.detailParams.fid]);
  //
  // useEffect(() => {
  //   debugger;
  //   let storeTable = ref.current?.getTableStore();
  //   if (storeTable && props.fid && storeTable.findByKey) {
  //     storeTable.findByKey('', 1, storeTable.size, {
  //       fid: props.fid,
  //       ...props.detailParams,
  //     });
  //   }
  // }, [props.fid]);
  //

  useEffect(() => {
    debugger;
    findZj();
    refreshDetail();
  }, [props.fid]);


  const findZj = () => {
    debugger;
    if(props.fid){
      FzspDetailStore.queryZj(props.fid)
    }
    // let storeTable = ref.current?.getTableStore();
    // if (storeTable && props.fid && storeTable.findByKey) {
    //   storeTable.findByKey('', 1, storeTable.size, {
    //     fid: props.fid,
    //     ...props.detailParams,
    //   });
    // }
  };

  const refreshDetail = () => {
    debugger;
    if(props.fid){
      setFid(props.fid);
      FzspDetailStore.queryFjData(props.fid);
    //  FzspDetailStore.queryZj(props.fid);
      // debugger
      // const zj=FzspDetailStore.zj;
      // if (zj && zj.id) {
        setAddVisible(false);
    //  }
       const zj=FzspDetailStore.zj;
       if (zj && zj.id) {
         setAddVisible(false);
       }
    }
    // let storeTable = ref.current?.getTableStore();
    // if (storeTable && props.fid && storeTable.findByKey) {
    //   storeTable.findByKey('', 1, storeTable.size, {
    //     fid: props.fid,
    //     ...props.detailParams,
    //   });
    // }
  };

  const onClose = () => {
    setLogVisible(false);
  };

  const viewLog = (value, index, record) => {
    setTmmx('');
    setTmmx(record.id);
    setLogVisible(true);
  };

  // ??????????????????Store??????
  const [tableStore,setTableStore] = useState<EpsTableStore>(
    new EpsTableStore(inspectionService),
  );

  const spColumns = [];

  // ????????????????????????detail
  // const customTableAction = (text, record, index, store) => {
  //   return [
  //     props.approve && (
  //       <ApplyEditButton
  //         column={spColumns}
  //         title={'??????'}
  //         refreshDetail={() => refreshDetail()}
  //         data={{
  //           spr: SysStore.getCurrentUser().yhmc,
  //           sprid: SysStore.getCurrentUser().id,
  //           sprq: moment(),
  //           jdlx: props.jdlx,
  //           daid: record.daid,
  //           zt: props.detailParams.zt,
  //           kfjdmxid: record.id,
  //           wpid: props.detailParams.wpid,
  //         }}
  //         approveMark={props.approveMark}
  //         customForm={customForm}
  //       />
  //     ),
  //     props.approve && (
  //       <Tooltip title={'??????'}>
  //         <Button
  //           size="small"
  //           style={{ fontSize: '12px' }}
  //           type={'primary'}
  //           shape="circle"
  //           icon={<BookOutlined />}
  //           onClick={() => viewLog(text, index, record)}
  //         />
  //       </Tooltip>
  //     ),
  //     <EpsFilesView
  //       fjs={record.fjs}
  //       bmc={props.detailParams.bmc}
  //       tmid={record.daid}
  //       printfile={0}
  //       dakid={props.detailParams.dakid}
  //       grpid={record.filegrpid}
  //     />,
  //   ];
  // };


  const handleDone = () => {
    debugger
    setDone(false);
    setVisible(false);
    setCurrent({});
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    if(props.fid) {
      FzspDetailStore.queryZj(props.fid);
    }
    const zj=FzspDetailStore.zj;
    debugger
    if (zj && zj.id) {

      setDone(true);
    }else {
      setDone(false);
      showMessage("????????????????????????????????????","info");
      return;
    }

    debugger
    const method = values?.id ? 'update' : 'add';
    console.log("handleSubmitvalues=",values);
    postRun(method, values);
    debugger
    FzspDetailStore.queryFjData(fid);
   // refreshDetail();
  };

  /**
   * ????????????prop
   */
   const uploadProp: IUpload = {
    disableUpload: false, // ????????????
    disableBigUpload: true, // ?????????????????????
    disableDown: false, // ????????????
    disableYwDown: true, // ????????????
    disableViewDoc: true, // ??????
    disableYwViewDoc: true, // ????????????
    uploadUrl: '/api/eps/wdgl/attachdoc/uploadFzps', // ??????url??????
   //uploadUrl: '/api/eps/control/main/fzpsfj/upload', // ??????url??????
    // doctbl: 'ATTACHDOC', // ????????????
    // grptbl: 'DOCGROUP', // ??????????????????
    // wrkTbl: 'XT', // ????????????
    // dakid: dakid,
    doctbl: 'FZPSFJ', // ????????????
    grptbl: 'FZPSDOCGROUP', // ??????????????????
    wrkTbl: 'FZPSDETAIL', // ????????????
    dw: SysStore.getCurrentCmp().id, // ????????????ID
    umId: 'FZPS004',
    aprint: '', // ??????????????????
    adown: '', // ???????????? ??????
  };

  // ??????????????????
  const uploadtableProp: ITable = {
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    tableSearch: false,
    labelColSpan: 8,
    rowSelection: {
      type: 'check',
    },
  };

  /**
   * ???????????? ??????source
   */
  const fjsource = [
    {
      title: '??????',
      code: 'title',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '?????????',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '????????????',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '????????????',
      code: 'fullsize',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '????????????',
      code: 'yxrq',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '??????',
      code: 'ty',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '??????',
      code: 'bz',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '?????????',
      code: 'bbh',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '?????????',
      code: 'md5code',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];





  const onChange = (info) => {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      const res = info.file.response;
      debugger
      if (!res.success) {
        message.error(`${res.message} `);
        return;
      }
      message.success(`${info.file.name} ??????????????????.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ??????????????????.`);
    }

    ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
  };




  /**
   * ??????
   * @param val
   */
  const onDownClick = async (currentItem: BasicListItemDataType) => {
    // if (currentItem.length == 0) {
    //   message.error('????????????,???????????????????????????');
    // } else {
      var ulr =
        '/api/eps/control/main/fzspdetail/download?id=' + currentItem.id
      window.open(ulr);
  //  }
  };

  function beforeUpload(file) {
    let isJpgOrPng = true;
    // const fname = file.name;
    // const extName = fname.substring(fname.lastIndexOf('.') + 1);
    // console.log('extName' + extName);
    //
    // if (extName !== 'rgi') {
    //   isJpgOrPng = false;
    //   message.error('????????????rgi??????!');
    // }
    if(props.fid) {
      FzspDetailStore.queryZj(props.fid);
    }
    const zj=FzspDetailStore.zj;
    debugger
    if (zj && zj.id){

    }else {
      isJpgOrPng=false;
      showMessage("????????????????????????????????????????????????","info");
    }

    return isJpgOrPng;
  }

  return (
    <>
      <div>
        {/* <PageContainer> */}

            <Card
              className={styles.listCard}
              bordered={false}
           //   title="??????"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              // extra={extraContent}
            >
              <List
                size="large"
                rowKey="id"
                loading={loading}
           //     pagination={paginationProps}
                dataSource={FzspDetailStore.defaultData}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a
                        key="edit"
                        onClick={(e) => {
                          e.preventDefault();
                          showEditModal(item);
                        }}
                      >
                        ??????
                      </a>,
                      <a
                        key="delete"
                        onClick={(key) => deleteRecord(item)}
                      >
                        ??????
                      </a>,
                      // <a
                      //   key="upload"
                      //   onClick={(key) => uploadRecord(item)}
                      // >
                      //   ??????
                      // </a>,
                      <Upload
                        name="Fdata"
                        action="/api/eps/control/main/fzspdetail/upload"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        data={{id:item.id}}
                        onChange={onChange}
                      //  multiple
                      >
                       {/*<Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>??????</Button>*/}
                        <a
                          key="upload"
                        >
                          ??????
                        </a>
                      </Upload>,
                      <a
                        key="down"
                        onClick={(key) => onDownClick(item)}
                      >
                        ??????
                      </a>,
                 //     <MoreBtn key="more" item={item} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={require('./utils/word.jpg')} shape="square" size={50} />}
                      title={item.title}
                      description={item.desc}
                    />
                    {/*<ListContent data={item} />*/}
                      <div >
                        <span>?????????&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <p>{item.whr}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                      </div>
                      <div >
                        <span>????????????</span>
                        <p>{moment(item.whsj).format('YYYY-MM-DD HH:mm')}</p>
                      </div>
                  </List.Item>
                )}
              />
            </Card>
          {/*</div>*/}
        {/* </PageContainer> */}
        <Button
          type="dashed"
          hidden={addVisible}
          onClick={() => {
            setVisible(true);
          }}
          style={{ width: '100%', marginBottom: 8 }}
        >
          <PlusOutlined />
          ??????
        </Button>
        <OperationModal
          done={done}
          visible={visible}
          fid={props.fid}
          current={current}
          onDone={handleDone}
          onSubmit={handleSubmit}
        />


      {/*<Drawer*/}
      {/*  title="????????????"*/}
      {/*  placement="right"*/}
      {/*//  tmmx={tmmx}*/}
      {/*  width="500px"*/}
      {/*  closable={false}*/}
      {/*  onClose={onClose}*/}
      {/*  visible={logVisible}*/}
      {/*>*/}
      {/*  <ApplyTimeline kfjdmxid={tmmx} />*/}
      {/*</Drawer>*/}
      </div>

    {/*  <Modal*/}
    {/*    title={'??????'}*/}
    {/*    centered*/}
    {/*    visible={toolsDisabled}*/}
    {/*    footer={null}*/}
    {/*    width={1250}*/}
    {/*    //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}*/}
    {/*//    style={{ maxHeight: modalHeight + 'px', height: modalHeight + 'px' }}*/}
    {/*    onCancel={() => setToolsDisabled(false)}*/}
    {/*  >*/}
    {/*    <div style={{ height: '500px' }}>*/}

  {/*        <EpsUploadSimple*/}
  {/*          title={'??????'}*/}
  {/*          ref={ref}*/}
  {/*          uploadProp={uploadProp} //????????????prop*/}
  {/*          width={1250}*/}
  {/*          source={fjsource}*/}
  {/*          params={{*/}
  {/*            docTbl: 'FZPSFJ',*/}
  {/*            docGrpTbl: 'FZPSDOCGROUP',*/}
  {/*            grpid: curRecord.filegrpid,*/}
  {/*            docTblXt: 'FZPSFJ',*/}
  {/*            idvs: JSON.stringify({ id: curRecord.id }),*/}
  {/*            wrkTbl: 'FZPSDETAIL',*/}
  {/*            lx: null,*/}
  {/*            atdw: 'DEFAULT',*/}
  {/*            tybz: 'N',*/}
  {/*            whr: SysStore.getCurrentUser().id,*/}
  {/*            whsj: getDate,*/}
  {/*            fjsctrue: true,*/}
  {/*          }} //??????????????????*/}
  {/*          tableProp={uploadtableProp} //????????????prop*/}
  {/*          tableService={xtfjService} //????????????server*/}
  {/*          tableparams={{*/}
  {/*            doctbl: 'FZPSFJ',*/}
  {/*            grptbl: 'FZPSDOCGROUP',*/}
  {/*            grpid: curRecord.filegrpid,*/}
  {/*            sfzxbb: '1',*/}
  {/*            lx: null,*/}
  {/*            ordersql: 'N',*/}
  {/*          }} //??????????????????*/}
  {/*//          grpid={XtStore.filegre} //??????????????????*/}
  {/*        ></EpsUploadSimple>*/}
  {/*      </div>*/}
      {/*</Modal>*/}
    </>
  );
});

export default FzpsApplyDetail;
