import EpsFormType from '@/eps/commons/EpsFormType';
import {
  Modal,
  Tooltip,
  Form,
  message,
  Button,
  Drawer,
  Space,
  Col,
  Row,
  Card,
} from 'antd';
import React, { useEffect, useState } from 'react';
import EpsForm from '@/eps/components/form/EpsForm';
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';

import applyService from './ApplyEditButtonService';
import ApplyEditButtonStore from './ApplyEditbuttonStore';
import { PicCenterOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Tab } from '@alifd/next';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import util from '@/utils/util';
import Title from 'antd/lib/typography/Title';
import { observer } from 'mobx-react';
import { showMessage } from '@/eps/components/message';
export interface IProps {
  column: Array<EpsSource>;
  title: string;
  data: object;
  store: any;
  customForm?: Function;
}
const store = new ApplyEditButtonStore(applyService);
const EpsEditButton = observer((props: IProps) => {
  const [visible, setVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(600);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [formData, setFormData] = useState({});
  const [applyRecord, setApplyRecord] = useState(props.record);

  const [form] = Form.useForm();
  /**
   *
   */
  const viewFiles = () => {
    debugger;
    const bmc = props.fileinfo.bmc;
    const fjparams = {
      fjs: applyRecord.fjs,

      dakid: props.fileinfo.dakid,
      doctbl: `${bmc}_fj`,
      downfile: props.fileinfo.downfile || 0,
      bmc,
      fjck: true,
      fjdown: true,
      fjsctrue: false,
      fjupd: false,
      grpid: applyRecord.filegrpid,
      grptbl: `${bmc}_FJFZ`,
      id: applyRecord.daid,
      printfile: props.fileinfo.printfile || 0,
      psql: '$S$KCgxPTEpKQ==',
      tmzt: props.fileinfo.tmzt || 4,
      wrkTbl: bmc,
    };
    util.setSStorage('fjparams', fjparams);
    store.fileUrl = `/api/eps/wdgl/attachdoc/viewFiles?grpid=${applyRecord.filegrpid}`;
  };

  const showModal = () => {
    debugger;
    if (!props.data.daid) {
      message.warning('请选择一行数据!');
      return;
    }

    if (!props.record.fjs || props.record.fjs < 1) {
      message.warning('该条目无附件');
      return;
    }
    setVisible(true);
    applyService.findByKey(props.data).then((res) => {
      if (res) {
        var params = { ...props.data, ...res };
        if (res.sprq) {
          params.sprq = moment(res.sprq);
        }
        setFormData(params);
        store.setData(params);
        form.setFieldsValue(params);
      } else {
        setFormData(props.data);
        store.setData(props.data);
        form.setFieldsValue(props.data);
      }
    });

    viewFiles();
  };

  const doPreNextAction = () => {
    const params = {
      ...props.data,
      kfjdmxid: applyRecord.id,
      daid: applyRecord.daid,
    };
    applyService.findByKey(params).then((res) => {
      if (res) {
        var formParams = { ...params, ...res };
        if (res.sprq) {
          formParams.sprq = moment(res.sprq);
        }
        setFormData(formParams);
        store.setData(formParams);
        form.setFieldsValue(formParams);
      } else {
        setFormData(params);
        store.setData(params);
        form.setFieldsValue(params);
      }
    });

    viewFiles();
  };

  useEffect(() => {
    form.resetFields();
    let _s = props.column.filter((item) => item.formType !== EpsFormType.None);
    setSource(_s);
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, []);

  useEffect(() => {
    if (visible) {
      doPreNextAction();
    }
    // SetModalWidth((parseInt(_s.length / 6)+1) * 500)
  }, [applyRecord]);

  const next = () => {
    const tableList = props.tableStore.tableList;
    const index = tableList.findIndex((item) => item.id == applyRecord.id);

    if (tableList.length - 1 != index) {
      setApplyRecord(tableList[index + 1]);
    } else {
      showMessage('已经是当前页最后一条数据', 'warn');
    }
  };

  const previous = () => {
    const tableList = props.tableStore.tableList;
    const index = tableList.findIndex((item) => item.id == applyRecord.id);

    if (index > 0) {
      setApplyRecord(tableList[index - 1]);
    } else {
      showMessage('已经是当前页第一条数据', 'warn');
    }
  };

  return (
    <div key={`fileApply_${props.tmid}`}>
      {props.isButton ? (
        <Button
          key={`fileApply_${props.tmid}`}
          type="primary"
          onClick={showModal}
        >
          {props.title}
        </Button>
      ) : (
        <a
          key={`fileApply_${props.tmid}`}
          onClick={showModal}
          icon={<PicCenterOutlined />}
        >
          {props.title}
        </a>
      )}
      <Drawer
        key={`fileApplyDrawer_${props.tmid}`}
        closable={false}
        width={props.width}
        onClose={() => setVisible(false)}
        visible={visible}
        style={{ display: visible ? 'block' : 'none' }}
        // title={props.title}
        // extra={
        //     <Space >
        //       <Button >上一条</Button>
        //       <Button>下一条</Button>
        //     </Space>
        // }
      >
        <Card style={{ height: '100%' }}>
          <Row gutter={16}>
            <Col span={18}>
              <iframe
                style={{
                  width: 'calc(100%)',
                  height: document.body.clientHeight - 80,
                  padding: '5px 0px',
                  border: 'none',
                }}
                src={store.fileUrl}
              ></iframe>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4}>{applyRecord[props.tmField]}</Title>
                <Title level={4}>{applyRecord[props.dhField]}</Title>
              </div>
              <EpsForm
                source={source}
                form={form}
                data={formData}
                customForm={props.customForm}
              ></EpsForm>
              <Space style={{ float: 'right', right: '20px' }}>
                <Button onClick={previous}>上一条</Button>
                <Button onClick={next}>下一条</Button>
                <Button
                  onClick={() => {
                    form
                      .validateFields()
                      .then((values) => {
                        //  form.resetFields();
                        debugger;
                        values['id'] = formData.id;
                        values['daid'] = formData.daid;
                        values['wpid'] = formData.wpid;
                        values['zt'] = formData.zt;
                        values['jdlx'] = formData.jdlx;
                        values['kfjdmxid'] =
                          formData.kfjdmxid || applyRecord.id;
                        values['sprid'] = formData.sprid;
                        if (formData.applyLevel) {
                          values['applylevel'] = formData.applylevel;
                          values['spzt'] = formData.applyLevel;
                        }

                        if (formData.id && values.kfjdmxid.indexOf(',') < 0) {
                          store
                            .update(values)
                            .then((res) => {
                              showMessage('数据修改成功', 'success');
                              props.refreshDetail();
                              // setVisible(false);
                            })
                            .catch((err) => message.error(err));
                        } else {
                          debugger;
                          store
                            .save(values)
                            .then((res) => {
                              debugger;
                              showMessage('数据修改成功', 'success');
                              setFormData({ id: res.results.id, ...formData });
                              //   store.findByKey(props.store.key)
                              props.refreshDetail();
                              // setVisible(false);
                            })
                            .catch((err) => message.error(err));
                        }
                      })
                      .catch((info) => {});
                  }}
                  type="primary"
                >
                  提交
                </Button>
                <Button onClick={() => setVisible(false)}>关闭</Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Drawer>
    </div>
  );
});

export default EpsEditButton;
