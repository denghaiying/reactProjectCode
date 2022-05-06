import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import DoctypeService from './Service/DoctypeService';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import { Button, message, Modal, Tooltip, Upload } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';

const Doctype = observer((props) => {
  const ref = useRef();
  const [fileList, setfileList] = useState([]);

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableDelete: false,
    disableCopy: true,
    disableAdd: false,
    disableEdit: false,
    searchCode: 'name',
  };

  // 表单名称
  const title: ITitle = {
    name: '公文种类：',
  };

  //刷新界面数据
  const queryDataBykey = () => {
    const store = ref.current?.getTableStore();
    store.findByKey(store.key, store.page, store.size, store.params);
  };

  const handleDeletecOk = (record) => {
    const params = {
      id: record.id,
      filename: record.modulefilename,
    };
    DoctypeService.deletefileByID(params)
      .then(() => {
        queryDataBykey();
        message.info(`${record.modulefilename}文件删除成功！`);
      })
      .catch((reason) => {
        message.error(
          `${record.modulefilename}文件删除失败，原因是：${reason}`,
        );
      });
  };
  const onDelClick = (record) => {
    Modal.confirm({
      title: '确定要删除该模板么?',
      icon: <ExclamationCircleOutlined />,
      content: '模板删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDeletecOk(record),
      onCancel: () => Modal.destroyAll(),
    });
  };

  const onClickDownload = (record) => {
    window.open(
      encodeURI(
        `/api/eps/gwgl/doctype/download/${record.modulefilename}?id=${record.id}`,
      ),
    );
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '编码',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
      require: true,
      roles: [{ type: 'string', max: 4 }],
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
      roles: [{ type: 'string', max: 50 }],
      require: true,
    },
    {
      title: '模板',
      code: 'modulefilename',
      align: 'center',
      formType: EpsFormType.Input,
      disabled: true,
      width: 200,
      roles: [{ type: 'string', max: 50 }],
      render: (value, record) => {
        if (value) {
          return (
            <div>
              <a onClick={() => onClickDownload(record)}>{value}</a>
              <Tooltip title="删除文件">
                <Button type="text" onClick={() => onDelClick(record)}>
                  X
                </Button>
              </Tooltip>
            </div>
          );
        }
      },
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      disabled: true,
      width: 120,
      defaultValue: whr,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      disabled: true,
      width: 160,
      defaultValue: whsj,
    },
  ];

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    //由于modal是异步执行的，无法阻塞线程，所以封装弹窗提示，使之可以做同步判断。
    const confirm = () => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '确定要上传模板么?',
          icon: <ExclamationCircleOutlined />,
          content: '上传后将覆盖之前存在的模板，请谨慎操作',
          okType: 'danger',
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });
    };

    //上传之前判断是否已存在
    const beforeUpload = async () => {
      if (record.modulefilename && record.modulefilename !== '') {
        await confirm().then((result) => {
          return result;
        });
      }
    };

    const moduleprops = {
      name: 'file',
      action: '/api/eps/gwgl/doctype/upload',
      headers: {
        authorization: 'authorization-text',
      },
      data: { id: record.id },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          queryDataBykey();
          message.success(`${info.file.name} 文件上传成功！`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
      // onPreview: (file)=>{
      //   console.log('onPreview',file);
      //   const url = '/api/eps/gwgl/doctype/download'
      // },
      onRemove: (file) => {
        console.log('onRemove', file);
      },
      maxCount: 1,
      accept: '.doc,.docx',
      beforeUpload: beforeUpload,
    };

    return (
      <div style={{ float: 'left', width: 20, height: 20 }}>
        <Upload {...moduleprops}>
          <Tooltip title="上传模板">
            <Button
              size="small"
              style={{ fontSize: '12px' }}
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
            />
          </Tooltip>
        </Upload>
      </div>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={DoctypeService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        customTableAction={customTableAction}
      ></EpsPanel>
    </>
  );
});

export default Doctype;
