import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Row,
  Space,
  Table,
  TreeSelect,
} from 'antd';
import { observer } from 'mobx-react';
import DdStore from './store/DdStore';
import { useEffect, useState } from 'react';
import EpsFilesView from '@/eps/components/file/EpsFilesView';
import { MenuFoldOutlined } from '@ant-design/icons';

const { Meta } = Card;

const columns = [
  {
    title: '题名',
    dataIndex: 'wjtm',
    key: 'wjtm',
  },
  {
    title: '档号',
    dataIndex: 'dh',
    key: 'dh',
  },
  {
    title: '年度',
    dataIndex: 'nd',
    key: 'nd',
    width: 120,
  },
  {
    title: '密级',
    dataIndex: 'mj',
    key: 'mj',
    width: 80,
  },
  {
    title: '成文日期',
    key: 'cwrq',
    dataIndex: 'cwrq',
    width: 120,
  },
  {
    title: '附件数',
    key: 'fjs',
    width: 120,
    render: (text: string, record: Record<string, any>) => (
      <Space size="middle">
        <a
          onClick={() => {
            DdStore.findFjList(record.id, record.bmc, record.filegrpid);
          }}
        >
          {record.fjs || 0}
        </a>
      </Space>
    ),
  },
];

interface DbProps {
  id: string;
}

const Dd = observer((props: DbProps) => {
  const handleCancel = () => {
    DdStore.setModalVisible(false);
  };

  const handleOk = () => {};

  useEffect(() => {
    DdStore.findTreeList();
  }, [DdStore.id]);

  const [treeValue, setTreeValue] = useState('请选择档案库');

  return (
    <>
      <Button onClick={() => DdStore.setModalVisible(true, props.id)}>
        调档
      </Button>
      <Drawer
        title="档案编研-素材管理-调档"
        visible={DdStore.isModalVisible}
        width={'100%'}
        closable={false}
        extra={
          <Space key="space_zxby">
            <Button key="back_zxby" type="primary" onClick={handleOk}>
              保存
            </Button>
            <Button key="clock_zxby" onClick={handleCancel}>
              关闭
            </Button>
          </Space>
        }
        onClose={handleCancel}
      >
        <div
          style={{
            width: '98%',
            height: window.innerHeight - 100,
            marginLeft: '1%',
          }}
        >
          <Row gutter={24}>
            <Col span={24} style={{ marginTop: '5px' }}>
              <TreeSelect
                style={{ width: '100%' }}
                value={treeValue}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={DdStore.treeList}
                placeholder="请选择档案库"
                fieldNames={{
                  label: 'text',
                  value: 'id',
                  children: 'children',
                }}
                treeDefaultExpandAll
                onChange={(value) => {
                  setTreeValue(value);
                  DdStore.findTableList(value);
                }}
              />
            </Col>
            <Col span={18} style={{ marginTop: '5px' }}>
              <Table
                columns={columns}
                loading={DdStore.tableLoading}
                pagination={{ position: ['bottomRight'] }}
                dataSource={DdStore.tableList}
                size={window.innerHeight < 600 ? 'small' : 'default'}
              />
            </Col>
            <Col span={6} style={{ marginTop: '5px' }}>
              {DdStore.fjList.map((item, index) => (
                <Card
                  key={item.fileid}
                  style={{ width: '98%', marginTop: 10, marginLeft: '1%' }}
                  actions={[
                    <a
                      onClick={() => {
                        const note = {
                          fileid: item.fileid,
                          rtdir: item.rtdir,
                          title: item.title,
                          filename: item.filename,
                          ext: item.ext,
                          fhid: item.fhid,
                        };
                        const dabysc = {
                          filePath: item.fileid,
                          mc: item.filename + '.' + item.gsmc,
                          size: item.size,
                          note: JSON.stringify(note),
                        };
                        DdStore.addSc(dabysc, DdStore.id);
                      }}
                    >
                      {' '}
                      添加到素材{' '}
                    </a>,
                  ]}
                >
                  <Meta
                    avatar={<Avatar icon={<MenuFoldOutlined />} />}
                    title={item.filename}
                    description={`${(item.size / 1024).toFixed(2)} KB`}
                  />
                </Card>
              ))}
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
});

export default Dd;
