import {
  Button,
  Col,
  Image,
  Row,
  Tabs,
  Tree,
  Drawer,
  Space,
  Card,
  message,
  Descriptions,
  Form,
  Tag,
  Popover,
  Carousel,
  Spin,
  Skeleton,
} from 'antd';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import ZxbyStore from '../store/ZxbyStore';
import ScStore from './store/ScStore';

import E from 'wangeditor';
import TgStore from '../store/TgStore';
import MlStore from '../store/MlStore';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import OcrStore from './store/OcrStore';

const ROW_GUTTER = 24;

const isImg = (filename: string) => {
  const name = (filename || '').toUpperCase();
  return name.endsWith('PNG') || name.endsWith('JPG') || name.endsWith('JPEG');
};

const isPdf = (filename: string) => {
  const name = (filename || '').toUpperCase();
  return name.endsWith('PDF');
};

function onChange(a) {
  console.log(a);
}

let editor = null;

interface ZxbyProps {
  id?: string;
}

type GithubIssueItem = {
  url: string;
  id: string;
  size: number;
  mc: string;
  sclx: string;
  whsj: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '素材名称',
    dataIndex: 'mc',
    ellipsis: true,
  },
  {
    title: '素材类型',
    dataIndex: 'sclx',
    valueType: 'select',
    search: false,
    renderText: (text, record, _, action) => {
      if (text == 0) {
        return '本地素材';
      }
      if (text === 1) {
        return '调档素材';
      }
      return '其他素材';
    },
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    search: false,
    width: 240,
    renderText: (text, record, _, action) => {
      return `${((text || 0) / 1024).toFixed(2)} KB`;
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'whsj',
    valueType: 'dateTime',
    sorter: true,
    search: false,
    width: 240,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      isImg(record.mc) && (
        <a
          key={record.id + '_ocr'}
          onClick={() => {
            ScStore.scDrawerClose(true, '内容识别-' + record.mc, 1, record.id);
          }}
        >
          内容识别
        </a>
      ),
      isImg(record.mc) && (
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          key={record.id + '_view'}
          onClick={() => {
            ScStore.scDrawerClose(true, '预览-' + record.mc, 2, record.id);
          }}
        >
          预览
        </a>
      ),
      isPdf(record.mc) && (
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          key={record.id + '_sturcter'}
          onClick={() => {
            ScStore.scDrawerClose(true, '版面分析-' + record.mc, 3, record.id);
          }}
        >
          版面分析
        </a>
      ),
      isImg(record.mc) && (
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          key={record.id + '_insert'}
          onClick={() => {
            editor.cmd.do(
              'insertHTML',
              `<img src=\"${location.protocol}//${location.host}/api/dabysc/view/${record.id}\" />`,
            );
          }}
        >
          插入图片
        </a>
      ),
    ],
  },
];

const helper = (
  <Form size="small">
    <Form.Item label="素材" style={{ marginBottom: '1px' }}>
      {' '}
      用于提供编研数据，一般为图片、文字、表格等易于排版的格式
    </Form.Item>
    <Form.Item label="插入图片" style={{ marginBottom: '1px' }}>
      在文本编辑区，插入当前的图片素材
    </Form.Item>
    <Form.Item label="内容识别" style={{ marginBottom: '1px' }}>
      对当前图片进行内容识别，提取文字信息到展示区
    </Form.Item>
    <Form.Item label="版面分析" style={{ marginBottom: '1px' }}>
      针对pdf格式素材进行分析，提取其中的图片、表格和文字内容
    </Form.Item>
  </Form>
);

const Zxby = observer((props: ZxbyProps) => {
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    editor = new E('#editcontent');
    editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];
    editor.config.lang = {
      设置标题: 'Title',
      字号: 'Size',
      文字颜色: 'Color',
      设置列表: 'List',
      有序列表: '',
      无序列表: '',
      对齐方式: 'Align',
      靠左: '',
      居中: '',
      靠右: '',
      正文: 'p',
      链接文字: 'link text',
      链接: 'link',
      上传图片: 'Upload',
      网络图片: 'Web',
      图片link: 'image url',
      插入视频: 'Video',
      格式如: 'format',
      上传: 'Upload',
      创建: 'init',
    };
    /**一定要创建 */
    editor.create();

    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      editor.destroy();
    };
  }, []);

  const handleOk = () => {
    if (!ZxbyStore.mlKey) {
      message.error('请选择内容所属目录');
      return;
    }
    MlStore.update(editor.txt.html(), ZxbyStore.mlKey);
    ZxbyStore.findTreeData(ZxbyStore.id);
  };

  const handleOkAndNext = () => {
    if (!ZxbyStore.mlKey) {
      message.error('请选择内容所属目录');
      return;
    }
    MlStore.update(editor.txt.html(), ZxbyStore.mlKey);
    ZxbyStore.setModalVisible(false);
    TgStore.setModalVisibleAndId(true, ZxbyStore.id);
  };

  const handleCancel = () => {
    ZxbyStore.setModalVisible(false);
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    ZxbyStore.setMlKey(selectedKeys[0]);
    const nritem = ZxbyStore.treeData.filter(
      (item) => item.id === selectedKeys[0],
    );
    editor.txt.html(nritem[0]?.nr || '');
  };

  useEffect(() => {
    ZxbyStore.findTreeData(ZxbyStore.id);
    ZxbyStore.findScData(ZxbyStore.id);
  }, [ZxbyStore.id]);

  return (
    <>
      <Drawer
        title="档案编研-在线编研"
        visible={ZxbyStore.isModalVisible}
        width={'100%'}
        closable={false}
        onClose={handleCancel}
        extra={
          <Space key="space_zxby">
            <Popover content={helper} title="备注" trigger="hover">
              <QuestionCircleOutlined
                style={{ fontSize: 20, marginRight: '15px' }}
              />
            </Popover>
            <Button key="back_zxby" type="primary" onClick={handleOk}>
              保存
            </Button>
            <Button key="submit_zxby" type="primary" onClick={handleOkAndNext}>
              保存并统稿
            </Button>
            <Button key="clock_zxby" onClick={handleCancel}>
              关闭
            </Button>
          </Space>
        }
        forceRender={true}
      >
        <div style={{ height: window.innerHeight - 150 }}>
          <Row gutter={ROW_GUTTER}>
            <Col span={4}>
              <Tree
                style={{ marginTop: 10 }}
                defaultExpandAll
                defaultSelectedKeys={[ZxbyStore.treeData[0]?.key]}
                onSelect={onSelect}
                treeData={ZxbyStore.treeData}
              />
            </Col>
            <Col span={20}>
              <Row gutter={ROW_GUTTER} style={{ height: 'auto' }}>
                <Col span={24}>
                  <ProTable<GithubIssueItem>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    search={false}
                    // style={{height: window.innerHeight/2 - 50}}
                    dataSource={ZxbyStore.scData || []}
                    columnsState={{
                      persistenceKey: 'pro-table-singe-demos',
                      persistenceType: 'localStorage',
                      onChange(value) {
                        console.log('value: ', value);
                      },
                    }}
                    rowKey="id"
                    form={{
                      // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                      syncToUrl: (values, type) => {
                        if (type === 'get') {
                          return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                          };
                        }
                        return values;
                      },
                    }}
                    pagination={{
                      pageSize: 5,
                    }}
                    dateFormatter="string"
                    headerTitle="素材列表"
                    toolBarRender={false}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col span={24}>
                  <div style={{ height: window.innerHeight - 410, zIndex: -1 }}>
                    <div id="editcontent"></div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Drawer
          title={ScStore.title}
          width={ScStore.type === 3 ? '90%' : 460}
          closable={false}
          onClose={() => ScStore.scDrawerClose(false)}
          visible={ScStore.scDrawer}
        >
          {ScStore.type === 2 && (
            <div>
              <Image
                width={'98%'}
                height={420}
                fallback="data:image/png;base64,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"
                src={
                  `${location.protocol}//${location.host}/api/dabysc/view/` +
                  ScStore.scId
                }
              />
            </div>
          )}
          {ScStore.type === 1 && <div>{ScStore.ocrText}</div>}
          {ScStore.type === 3 && (
            <div style={{ height: window.innerHeight - 150 }}>
              <Spin spinning={ScStore.loading}>
                <Row>
                  <Col span={24} style={{ height: window.innerHeight - 410 }}>
                    <div>
                      <Carousel
                        afterChange={onChange}
                        arrows={true}
                        draggable={true}
                        slidesToShow={4}
                        lazyLoad={true}
                        initialSlide={0}
                      >
                        {ScStore.ocrImgs.map((item, index) => (
                          <div key={item}>
                            <Image
                              src={`${location.protocol}//${
                                location.host
                              }/api/dabysc/claview/${ScStore.scId}/${
                                index + 1
                              }`}
                              height={300}
                              width={250}
                              style={{ margin: 5 }}
                              onClick={() => {
                                OcrStore.getOcrTxt(ScStore.scId, index + 1);
                                OcrStore.getCls(ScStore.scId, index + 1);
                              }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </Col>
                  <Col span={8} style={{ height: 'auto' }}>
                    <Card
                      title="文字"
                      bordered={false}
                      style={{ width: '100%' }}
                    >
                      <Skeleton loading={OcrStore.txtLoading} active avatar>
                        {OcrStore.txt}
                      </Skeleton>
                    </Card>
                  </Col>
                  <Col span={8} style={{ height: 'auto' }}>
                    <Card
                      title="图片"
                      bordered={false}
                      style={{ width: '100%' }}
                    >
                      <Skeleton loading={OcrStore.imgLoading} active avatar>
                        {OcrStore.imgs.map((item, idxImg) => (
                          <Card
                            key={item}
                            hoverable
                            style={{ width: 240 }}
                            cover={
                              <Image
                                alt="example"
                                src={`${location.protocol}//${location.host}/api/dabysc/resclsview?id=${ScStore.scId}&index=${OcrStore.currentIndex}&fileName=${item}`}
                              />
                            }
                            actions={[
                              <Button
                                onClick={() => {
                                  editor.cmd.do(
                                    'insertHTML',
                                    `<img src=\"${location.protocol}//${location.host}/api/dabysc/resclsview?id=${ScStore.scId}&index=${OcrStore.currentIndex}&fileName=${item}\" />`,
                                  );
                                }}
                              >
                                追加到文本
                              </Button>,
                            ]}
                          ></Card>
                        ))}
                      </Skeleton>
                    </Card>
                  </Col>
                  <Col span={8} style={{ height: 'auto' }}>
                    <Card
                      title="表格"
                      bordered={false}
                      style={{ width: '100%' }}
                    >
                      <Skeleton loading={OcrStore.excelLoading} active avatar>
                        {OcrStore.excels.map((item) => (
                          <a
                            key={item}
                            href={`/api/dabysc/downResCls?id=${ScStore.scId}&index=${OcrStore.currentIndex}&fileName=${item}`}
                          >
                            {item}
                          </a>
                        ))}
                      </Skeleton>
                    </Card>
                  </Col>
                </Row>
              </Spin>
            </div>
          )}
        </Drawer>
      </Drawer>
    </>
  );
});

export default Zxby;
