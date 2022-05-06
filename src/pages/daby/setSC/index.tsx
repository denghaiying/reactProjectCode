import { observer } from 'mobx-react';
import { Button, Form, message, Modal, Popconfirm, Upload } from 'antd';
import ScStore from '../store/ScStore';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import ScTreeService from './service/ScTreeService';
import ScTableService from './service/ScTableService';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { ControlTwoTone, UploadOutlined } from '@ant-design/icons';
import ZxbyStore from '../store/ZxbyStore';
import Dd from './components/dd';

const SetSc = observer(() => {
  const props = (store: EpsTableStore) => {
    return {
      name: 'file',
      accept: '.jpg, .pdf, .jpeg, .png, .bmp, .ico, .icon',
      action: `/api/dabysc/upload/${ScStore.id}`,
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
          store.findByKey(store.key);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    };
  };

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        ScStore.setModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleOkAndNext = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        ScStore.setModalVisible(false);
        ZxbyStore.setModalVisible(true);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    ScStore.setModalVisible(false);
  };

  const customAction = (store, record: any[]) => {
    return [
      <Upload {...props(store)}>
        <Button icon={<UploadOutlined />}>上传</Button>
      </Upload>,

      // <EpsModalButton
      // name="共享"
      // title="共享"
      // url="YYYY"
      // width={1200}
      // store={store}
      // useIframe={true}
      // icon={<ControlTwoTone />}/>,

      // <EpsModalButton
      // name="取消共享"
      // title="取消共享"
      // url="YYYY"
      // width={1200}
      // store={store}
      // useIframe={true}
      // icon={<ControlTwoTone />}/>,
      <Dd id={ScStore.id} />,
    ];
  };

  const customTableAction = (text, record, index, store: EpsTableStore) => {
    return [
      // <Button size='small' type='text'>修改名称</Button>,
      <Popconfirm
        title="是否要删除该条记录？"
        onConfirm={async () => {
          await store.delete(record);
          await store.findByKey();
        }}
      >
        <Button size="small" type="text">
          删除
        </Button>
      </Popconfirm>,
    ];
  };

  const source = [
    {
      title: '素材名称',
      code: 'mc',
    },
    ,
    {
      title: '素材类型',
      code: 'sclx',
      render: (text: number, record: Record<string, unknown>) => {
        if (text === 0) {
          return '本地素材';
        }
        if (text === 1) {
          return '调档素材';
        }
      },
    },
    {
      title: '文件大小',
      code: 'size',
    },
  ];

  return (
    <>
      <Modal
        title="档案编研-素材设置"
        visible={ScStore.isModalVisible}
        onOk={handleOk}
        width={1000}
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="primary" onClick={handleOk}>
            保存并关闭
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkAndNext}>
            保存并在线编研
          </Button>,
          <Button key="clock" onClick={handleCancel}>
            关闭
          </Button>,
        ]}
      >
        <div style={{}}>
          <EpsPanel
            initParams={{ daby_id: ScStore.id }}
            menuLoad={() => console.log(1)}
            customTableAction={customTableAction}
            tableProp={{
              disableAdd: true,
              tableSearch: false,
              disableCopy: true,
              disableDelete: true,
              disableEdit: true,
              rowSelection: { type: 'radio' },
            }}
            customAction={customAction}
            treeService={ScTreeService}
            tableService={ScTableService}
            source={source}
            title={{ name: '素材管理' }}
          ></EpsPanel>
        </div>
      </Modal>
    </>
  );
});

export default SetSc;
