import database from '@/locales/zh-CN/datamgn/database';
import { Button, Col, Tabs, Tree, Drawer, Space, Row } from 'antd';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import E from 'wangeditor';
import TgStore from '../store/TgStore';

import './index.less';

const ROW_GUTTER = 24;

let editor = null;

const Tg = observer(() => {
  useEffect(() => {
    editor = new E('#edittg');
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
    // TgStore.setModalVisible(false)
    TgStore.modify({ id: TgStore.id, bynr: editor.txt.html() });
  };

  const handlePdf = () => {
    TgStore.pdf({ id: TgStore.id, bynr: editor.txt.html() });
  };

  const reHandlePdf = () => {
    TgStore.pdf({ id: TgStore.id, bynr: editor.txt.html(), redownload: '1' });
  };

  const handleCancel = () => {
    TgStore.setModalVisible(false);
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const getData = async () => {
    const daby = await TgStore.findById(TgStore.id);
    await TgStore.findTreeData(TgStore.id);
    if (daby && daby.bynr) {
      editor.txt.html(daby.bynr);
    } else {
      if (TgStore.treeData) {
        TgStore.treeData.forEach((item) => {
          editor.txt.append(`<p/><h2>${item.mc}</h2><p/>${item.nr}`);
        });
      }
    }
  };

  useEffect(() => {
    editor.txt.html('');

    getData();
  }, [TgStore.id]);

  return (
    <>
      <Drawer
        title="档案编研-统稿"
        visible={TgStore.isModalVisible}
        width={'100%'}
        closable={false}
        onClose={handleCancel}
        key="gt_drawer"
        extra={
          <Space key="space_tg">
            {/* <Button key="yl_tg"  type="primary" onClick={() => {}}>
            预览
          </Button> */}
            <Button key="dzs_re_tg" type="primary" onClick={reHandlePdf}>
              重新生成电子书
            </Button>
            <Button key="dzs_tg" type="primary" onClick={handlePdf}>
              下载电子书
            </Button>
            <Button key="save_tg" type="primary" onClick={handleOk}>
              保存
            </Button>
            <Button key="clock" onClick={handleCancel}>
              关闭
            </Button>
          </Space>
        }
        forceRender={true}
      >
        <div style={{ height: window.innerHeight - 90 }}>
          <Row gutter={ROW_GUTTER} style={{ height: '100%' }}>
            <Col span={4}>
              <Tree
                style={{ marginTop: 10 }}
                defaultExpandAll
                defaultSelectedKeys={[TgStore.treeData[0]?.key]}
                onSelect={onSelect}
                treeData={TgStore.treeData}
              />
            </Col>
            <Col span={20}>
              <div id="edittg" style={{ height: '90%' }}></div>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
});

export default Tg;
