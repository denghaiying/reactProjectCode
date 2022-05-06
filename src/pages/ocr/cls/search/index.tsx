import {
  PictureOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, Image, Tooltip, Modal, Upload, message } from 'antd';
import { FC, useState } from 'react';
import React from 'react';
import type { ListItemDataType } from './data.d';
import styles from './style.less';

const { Dragger } = Upload;

export function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}


type SearchProps = {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
};


const OcrPlusSearch: FC<SearchProps> = () => {

  // 新增Model控制

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [data, setData] = useState([])

  const upLoadsProps = {
    multiple: false,
    accept: '.png,.jpg,.jpeg,.bmp,.gif',
    action: '/api/ocrplus/cls/inference/',
    name: 'resource',
    onChange({file, fileList}) {
      const { status } = file;
      if (status !== 'uploading') {
        console.log(file, fileList);
      }
      if (status === 'done') {
        message.success(`文件 ${file.name} 上传成功.`);
        // const {file} = info
        setData(file?.response?.msg || [])
        setIsModalVisible(false);
      } else if (status === 'error') {
        message.error(`文件 ${file.name} 上传失败.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };


  const showModal = () => {
    setIsModalVisible(true);
  };


  // 图片搜索
  const suffix = (
    <>
      <Tooltip placement="top" title={'图片搜索'}>
        <PictureOutlined
          style={{
            fontSize: 16,
            color: '#1890ff',
          }}
          onClick={showModal}
        />
      </Tooltip>
      <Modal title="图片检索" visible={isModalVisible} footer={null}>
        <Dragger {...upLoadsProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">选择或拖拽图片到此进行上传</p>
          <p className="ant-upload-hint">
            一次可查询一张图片
          </p>
        </Dragger>
      </Modal>
    </>
  );

  return (
    <PageContainer
      header={{title: '资源检索'}}
      content={
        <div style={{ textAlign: 'center' }}>
          {/* <Input.Search
            placeholder="请输入"
            enterButton="搜索"
            size="large"
            suffix={suffix}
            onSearch={handleFormSubmit}
            style={{ maxWidth: 522, width: '100%' }}
          /> */}
          <Dragger {...upLoadsProps} maxCount={1}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">选择或拖拽图片到此进行上传</p>
            <p className="ant-upload-hint">
            一次可检索一张图片
            </p>
          </Dragger>
        </div>
      }
      // tabList={tabList}
      // tabActiveKey={getTabKey()}
      // onTabChange={handleTabChange}
    >
      <div className={styles.filterCardList}>
      <br />
      <List<ListItemDataType>
        rowKey="id"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={data}
        renderItem={(item) => {
          if (item && item.path) {
            if(item.type?.startsWith('image')){
              return (
                <List.Item key={item.path}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={<Image src={`/api/ocrplus/cls/imgview/?view=${item.path}`}  height={160} />}
                    // actions={[<a key="option1">{item.type}</a>, <a key="option2">{item.tags}</a>]}
                  >
                    <Card.Meta title={item.type} description={item.tags} />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item key={item.path}>
                  视频
                </List.Item>
            )
          }
        }}
      />
    </div>
    </PageContainer>
  );
};

export default OcrPlusSearch;
