import { Button, Form, message, Modal, Tooltip, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { EpsTableStore } from '../../panel/EpsPanel';
import { EpsSource } from '../../panel/EpsPanel/EpsPanel';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons';
import Eps from '@/utils/eps';
import { base64encode, utf16to8 } from '@/utils/EpsUtils';
import EpsReportStore from '@/eps/components/buttons/EpsReportButton/store/EpsReportStore';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import cookie from 'react-cookies';
import { useLocalObservable } from 'mobx-react';

function Design(props) {
  const { text, record, index, store: EpsTableStore } = props;
  // console.log('designstore==', store);
  // console.log('designprops==', props);

  const [cjvisible, setCjVisible] = useState(false);
  const [bsvisible, setBsVisible] = useState(false);
  const [jspvisible, setJspVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(500);
  const [source, setSource] = useState<Array<EpsSource>>([]);
  const [formData, setFormData] = useState({});
  const [title, setTitle] = useState('设计');

  const [form] = Form.useForm();

  const reportid = record.reportid;

  const bsfile = record.reportname ? record.reportname + '.jasper' : '';

  const reportDesignStore = useLocalObservable(() => ({
    onLinePrintUrl: '',
    // xtid : "",
    // xtgjDisabled: false,
    // importDisabled: false,
    // zcdate:"",
    // gninfo:{},
    // fjsc:false,

    async getOnLineUrl() {
      const ipvaule = await fetch.post(
        '/api/eps/control/main/params/getParamsDevOption',
        this.params,
        {
          params: {
            code: 'REPORT0001',
            gnid: '',
            yhid: SysStore.getCurrentUser().id,
            ...this.params,
          },
        },
      );
      const pathvaule = await fetch.post(
        '/api/eps/control/main/params/getParamsDevOption',
        this.params,
        {
          params: {
            code: 'REPORT0012',
            gnid: '',
            yhid: SysStore.getCurrentUser().id,
            ...this.params,
          },
        },
      );

      this.onLinePrintUrl =
        'http://' +
        ipvaule.data +
        pathvaule.data +
        '/index/' +
        record.reportid +
        '?ssotoken=' +
        cookie.load('ssotoken') +
        '&gnid=' +
        record.gnid +
        '&epsParam=' +
        encodeURIComponent(JSON.stringify(props.store.params));
    },
  }));

  useEffect(() => {
    reportDesignStore.getOnLineUrl();
  }, []);

  const showModal = () => {
    if (record.designType == '1') {
      setBsVisible(true);
      setTitle('设计');
    } else if (record.designType == '2') {
      EpsReportStore.doPrintOrPreview('design', text.id);
    } else if (record.designType == '3') {
      setJspVisible(true);
      setTitle('上传');
    }
  };

  /* function beforeUpload(info) {
       console.log('beforeUpload callback : ', info);
   }*/

  function onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  }

  function beforeUpload(file) {
    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf('.') + 1);
    console.log('extName' + extName);

    if (extName !== 'jasper') {
      isJpgOrPng = false;
      message.error('只能上传JASPER文件!');
    }
    /* const isLt2M = file.size / 1024 / 1024 < 2;
     if (!isLt2M) {
         message.error('Image must smaller than 2MB!');
     }
     return isJpgOrPng && isLt2M;*/
    return isJpgOrPng;
  }

  // let bsreporturl = "http://localhost:8085/jeecg-boot/jmreport/index/" + reportid;
  // let bsreporturl="http://"+ipvaule+pathvaule+"/index/" + row.reportid + "?ssotoken="+getCookie("ssotoken")+"&gnid="+row.gnid+"&epsParam="+encodeURIComponent(JSON.stringify(queryParamsReport));
  //  let bsreporturl="http://localhost:8081/eps/control/main/app/lib/pdf/web/viewer.html?file=%2Feps%2Foffline%2Freport%2Floadpdf%3Ffile%3DD%3A%2Fworkspace%2Fhome%2Foffline%2Fyh(9).pdf&printfile=1&downfile=1";

  function showClose() {
    setBsVisible(false);
    setJspVisible(false);

    store.findByKey(store.key, 1, props.store.size, props.store.params);
  }

  return (
    <>
      <Tooltip title={title}>
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<SettingOutlined />}
          onClick={showModal}
        />

        {/*
                <img src={require('../../../../styles/assets/img/leftNav/icon_canshu.png')} alt="" style={{width: 22, margin: '0 2px'}} onClick={showModal}/>
*/}
      </Tooltip>
      <Modal
        title="在线报表设计"
        centered
        visible={bsvisible}
        onCancel={showClose}
        footer={null}
        width={1400}
        bodyStyle={{ height: 800 }}
      >
        <iframe
          name="bsframe"
          frameBorder="false"
          width="100%"
          scrolling="auto"
          height="100%"
          src={reportDesignStore.onLinePrintUrl}
        />
      </Modal>

      {/*       <Modal
                title="插件报表设计"
                centered
                visible={cjvisible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            props.store.save(values).then(res => {
                                message.success('数据添加成功');
                                props.store.findByKey(props.store.key);
                                setVisible(false);
                                form.resetFields();
                            }).catch(err => {
                                message.error(err)
                            })
                        })
                        .catch(info => {
                            message.error('数据添加失败,' + info)
                        })
                }
                }
                onCancel={() => setVisible(false)}
                width={modalWidth}
            >
                <EpsForm source={source} form={form} data={formData} customForm={props.customForm}></EpsForm>
            </Modal>
*/}

      <Modal
        title="离线报表上传"
        centered
        visible={jspvisible}
        footer={null}
        onCancel={showClose}
        width={modalWidth}
      >
        <Upload
          action="/api/eps/control/main/epsreport/upload"
          beforeUpload={beforeUpload}
          data={{ id: record.id }}
          onChange={onChange}
          listType="text"
        >
          <label>{bsfile}</label>
          <br />
          <Button
            icon={<UploadOutlined />}
            type="primary"
            style={{ margin: '0 0 10px' }}
          >
            报表文件上传
          </Button>
        </Upload>
      </Modal>
    </>
  );
}

export default Design;
