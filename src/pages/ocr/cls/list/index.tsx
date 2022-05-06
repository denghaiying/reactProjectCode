import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Image , List, message, Modal, Select, Typography, Upload } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, history } from 'umi';
import OcrPlusService from './service';
import type { CardListItemDataType } from './data.d';
import styles from './style.less';
import { useState } from 'react';

const { Paragraph } = Typography;
const { Dragger } = Upload;

const OcrPlusList = () => {

  // 上传 props
  const [fileList ,setFileList] = useState<[]>([])
  // 新增标签值
  const [tagVal, setTagVal] = useState<[]>([])

  const upLoadsProps = {
    name: 'file',
    multiple: true,
    accept: '.png,.jpg,.jpeg,.bmp,.gif,.mp4,.flv,.avi',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    fileList,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: file => {
      setFileList([...fileList, file])
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 新增Model控制

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if( !fileList ||  fileList === [] || fileList.length === 0 ){
      message.error('请正确选择待归档文件')
    }else{
      const formData = new FormData();
      formData.append('resource', fileList[0])
      formData.append('tags', tagVal.join(','))
      OcrPlusService.save(formData).then(({data,status}) => {
        if(status === 200){
          message.success('资源上传成功')
          setTimeout(() => {
            OcrPlusService.findAll()
            setIsModalVisible(false);
          }, 2000);
        }else{
          message.error('资源上传失败，请检查上传内容')
        }
      }).catch(err => {
        message.error(err)
      })
      console.log('提交数据', formData)
    }
    // setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const { data, loading } = useRequest(() => {
    return OcrPlusService.findAll();
  });

  const [tagList, setTagList]= useState<[]>([])

  const handleTagsChange = (value: any) => {
    console.log('标签选择', value)
    setTagVal(value)
  }

  const list = data?.data || [];

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        该模块主要对系统中的图片和视频资源进行管理。图片和视频在系统中进行归档存储后，可通过文字或图片进行相似度检索(以图片、文字搜索图片)或者包含检索(以图片、文字搜索视频)。
      </p>
       <div className={styles.contentLink} onClick={() => history.push('/eps/ocrplus/search')}>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />
          快速开始
        </a>
      </div> 
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  const nullData: Partial<CardListItemDataType> = {};
  return (
    <>
    <PageContainer header={{title: '资源管理'}} content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List<Partial<CardListItemDataType>>
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[nullData, ...list]}
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
            return (
              <List.Item>
                <Button type="dashed" className={styles.newButton} onClick={showModal}>
                  <PlusOutlined /> 新增产品
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
    <Modal title="新增资源" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <div>
        <Dragger {...upLoadsProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">选择或拖拽图片到此进行上传</p>
          <p className="ant-upload-hint">
            可上传图片或视频
          </p>
        </Dragger>
      </div>
      <div style={{marginTop: '10px'}}>
      <Select mode="tags" options={tagList} style={{ width: '100%' }} placeholder="文件描述标签（可选填）" onChange={handleTagsChange}>
        
      </Select>
        </div>   
      </Modal>
    </>
  );
};

export default OcrPlusList;
