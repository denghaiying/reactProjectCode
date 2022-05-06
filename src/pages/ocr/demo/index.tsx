import HttpRequest from '@/eps/commons/HttpRequest';
import { InboxOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, Row, Tooltip, Upload } from 'antd';
import React, { useState } from 'react';

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function Demo() {

  const [text, setText] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // 预览
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  };
  const handleCancel = () => setPreviewVisible(false)

  const props = {
    name: 'file',
    accept: '.png,.jpg,.jpeg,.bmp,.gif',
    multiple: true,
    listType: "picture",
    action: '/api/eps/ocr/show',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 图片上传成功.`);
        const {res} = info.file.response || [];
        if(res === []){
          setText('')
        }else {
          let tt = '';
          for(let i = 0; i < res.length; i++) {
            tt += (res[i] + ' ');
          }
          setText(tt);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onPreview: handlePreview,
    maxCount: 1
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      <Card title="OCR识别" style={{height: '100%'}} extra={<Tooltip placement="top" title='OCR服务设置'><Button icon={<SettingOutlined />} /> </Tooltip>}>
        <div style={{height: '100%'}}>
          <Row gutter={12}>
            <Col span={12}>
              <Card type="inner" title="图片上传">
                <div style={{height: '100%'}}>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">选择或拖拽图片到此进行上传</p>
                    <p className="ant-upload-hint">
                      支持 .png,.jpg,.jpeg,.bmp,.gif 格式的图片识别，每次可识别一张
                    </p>
                  </Dragger>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                type="inner"
                title="识别结果"
              >
                {text}
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      <Modal
          visible={previewVisible}
          title={previewTitle}
          style={{ left: '-300px', top: '10px'}}
          onCancel={handleCancel}
          footer={null}
        >
          <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </div>
  );
}

export default Demo;
