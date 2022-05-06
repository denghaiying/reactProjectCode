import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  TimePicker,
  Checkbox,
  Modal,
  Table,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import KqszService from './Service/KqszService';
import moment from 'moment';
import ProjectService from './Service/ProjectService';
import SysStore from '@/stores/system/SysStore';
import OptrightStore from '@/stores/user/OptrightStore';
import './index.less';


/**
 * 考勤设置
 */
const Kqsz = observer((props: any) => {
  //权限按钮
  const umid = 'DPS007';
  OptrightStore.getFuncRight(umid);
  //控制负责人弹框
  const [xmVisible, setxmvisible] = useState(false);
  //form表单值
  const [fm, setFm] = useState();
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中项目搜索框中项目名称
  const [xmmcData, setXmmcData] = useState('');

  useEffect(() => {
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    searchCode: 'projectName',
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    onAddClick: (form) => {
      KqszStore.xxsjData = true;
      KqszStore.stimeData = [];
      KqszStore.etimeData = [];
      KqszStore.xzopt = 'add';
      setFm(form);
    },
    onEditClick: (form, data) => {
      setFm(form);
      data.brest = data.brest === 'Y' ? true : false;
      if (data.brest === true) {
        KqszStore.xxsjData = false;
      } else {
        KqszStore.xxsjData = true;
      }
      data.workdate = data.workdate.split(',');
      data.stime = data.stime ? moment(data.stime, 'HH:ss:mm') : '';
      data.etime = data.etime ? moment(data.etime, 'HH:ss:mm') : '';
      data.rstime = data.rstime ? moment(data.rstime, 'HH:ss:mm') : '';
      data.retime = data.retime ? moment(data.retime, 'HH:ss:mm') : '';
      KqszStore.xzopt = '';
      KqszStore.stimeData = data.stime;
      KqszStore.etimeData = data.etime;
      KqszStore.rstimeData = data.rstime;
      KqszStore.retimeData = data.retime;
    },
  };

  //考勤设置store
  const KqszStore = useLocalObservable(() => ({
    xmmcData: '',
    whrData: false,
    stimeData: [],
    etimeData: [],
    rstimeData: [],
    retimeData: [],
    xzopt: 'add',
    xxsjData: true,
    options: [
      { label: '周一', value: '1' },
      { label: '周二', value: '2' },
      { label: '周三', value: '3' },
      { label: '周四', value: '4' },
      { label: '周五', value: '5' },
      { label: '周六', value: '6' },
      { label: '周日', value: '0' },
    ],
  }));

  // 表单名称
  const title: ITitle = {
    name: '考勤设置',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '项目名称',
      code: 'projectName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 250,
    },
    {
      title: '工作日',
      code: 'workdate',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
      ellipsis: false,
      render: (text: any, record: any, index: any) => {
        if (text.length === 1) {
          const a = [];
          KqszStore.options.forEach((k) => {
            if (text === k.value) {
              a.push(k.label);
            }
          });
          return a;
        } else if (text.hasOwnProperty('')) {
          return '';
        } else {
          const a = [];
          KqszStore.options.forEach((k) => {
            text.split(',').forEach((t) => {
              if (k.value === t) {
                a.push(k.label + '，');
              }
            });
          });
          return a;
        }
      },
    },
    {
      title: '上班时间',
      code: 'stime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '下班时间',
      code: 'etime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '休息时间',
      code: 'brest',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
    },
    {
      title: '休息时间起',
      code: 'rstime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '休息时间止',
      code: 'retime',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
  ];

  const onxmtableSearch = (value) => {
    ProjectService.findAllProjectData({
      mgner: currentUserIsChecked ? whrid : null,
      xmmc: value,
    }).then((data) => {
      setProjectData(data);
    });
  };
  //弹窗搜索表单
  const customAction = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => onxmtableSearch(val)}
              onChange={(record) => {
                setXmmcData(record.target.value);
              }}
              style={{ width: 300 }}
              placeholder="请输入项目名称"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Checkbox onChange={(record) => fzxmOnchange(record)}>
              仅显示我负责的项目
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  //仅显示我负责的项目
  const fzxmOnchange = (record) => {
    if (record.target.checked) {
      setCurrentUserIsChecked(true);
      ProjectService.findAllProjectData({ mgner: whrid, xmmc: xmmcData }).then(
        (data) => {
          setProjectData(data);
        },
      );
    } else {
      setCurrentUserIsChecked(false);
      ProjectService.findAllProjectData({ xmmc: xmmcData }).then((data) => {
        setProjectData(data);
      });
    }
  };
  //负责人弹框的确认按钮
  const onxm = (record) => {
    fm?.setFieldsValue({ projectId: record.id });
    fm?.setFieldsValue({ projectName: record.xmmc });
    setxmvisible(false);

  };
  //定义table表格字段 ---项目信息
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];

  // 自定义弹框表单
  const customForm = (text: any, form: any) => {
    //休息时间是否开启onchange
    const xgonChange = (record) => {
      if (record.target.checked === true) {
        KqszStore.xxsjData = false;
      } else {
        KqszStore.xxsjData = true;
        text.setFieldsValue({ rstime: '' });
        text.setFieldsValue({ retime: '' });
      }
    };

    //项目选择弹窗的查询
    const onxmSearch = (value) => {
      setxmvisible(true);
    };

    //onChange事件
    const Stimeonchange = (record) => {
      KqszStore.stimeData = record;
      KqszStore.xzopt = '';
    };
    const Etimeonchange = (record) => {
      KqszStore.etimeData = record;
      KqszStore.xzopt = '';
    };
    const Rstimeonchange = (record) => {
      KqszStore.rstimeData = record;
      KqszStore.xzopt = '';
    };
    const Retimeonchange = (record) => {
      KqszStore.retimeData = record;
      KqszStore.xzopt = '';
    };
    //判断时可选不可选
    const Stimediable = () => {
      var hours = [];
      if (KqszStore.xzopt === 'add') {
        return [];
      } else {
        for (var i = 24; i > moment(KqszStore.etimeData).hour(); i--) {
          hours.push(i);
        }
      }
      return hours;
    };

    const Etimediable = () => {
      var hours = [];
      if (KqszStore.xzopt === 'add') {
        return [];
      } else {
        for (var i = 0; i < moment(KqszStore.stimeData).hour(); i++) {
          hours.push(i);
        }
      }
      return hours;
    };

    const Rstimedisable = () => {
      var hours = [];
      if (KqszStore.xzopt === 'add') {
        return [];
      } else {
        for (var i = 24; i > moment(KqszStore.retimeData).hour(); i--) {
          hours.push(i);
        }
      }
      return hours;
    };

    const Retimedisable = () => {
      var hours = [];
      if (KqszStore.xzopt === 'add') {
        return [];
      } else {
        for (var i = 0; i < moment(KqszStore.rstimeData).hour(); i++) {
          hours.push(i);
        }
      }
      return hours;
    };

    // 自定义表单
    return (
      <>
        <Form.Item label="项目名称:" name="projectName">
          <Input.Search
            allowClear
            onSearch={(val) => onxmSearch(val)}
            style={{ width: 300 }}
            readOnly
          />
        </Form.Item>
        <Form.Item
          label="工作日:"
          name="workdate"
          required
          rules={[{ required: true, message: '请选择工作日' }]}
        >
          <Select
            allowClear
            placeholder="请选择工作日"
            style={{ width: 300 }}
            showArrow
            mode="multiple"
            options={KqszStore.options}
          ></Select>
        </Form.Item>
        <Form.Item label="上班时间:" name="stime">
          <TimePicker
            allowClear
            style={{ width: 300 }}
            onChange={Stimeonchange}
            disabledHours={Stimediable}
          />
        </Form.Item>
        <Form.Item label="下班时间:" name="etime">
          <TimePicker
            allowClear
            style={{ width: 300 }}
            onChange={Etimeonchange}
            disabledHours={Etimediable}
          />
        </Form.Item>
        <Form.Item label="休息时间:" name="brest" valuePropName="checked">
          <Checkbox onChange={xgonChange} />
        </Form.Item>
        <Form.Item label="休息时间起:" name="rstime">
          <TimePicker
            allowClear
            style={{ width: 300 }}
            disabled={KqszStore.xxsjData}
            onChange={Rstimeonchange}
            disabledHours={Rstimedisable}
          />
        </Form.Item>
        <Form.Item label="休息时间止:" name="retime">
          <TimePicker
            allowClear
            style={{ width: 300 }}
            disabled={KqszStore.xxsjData}
            onChange={Retimeonchange}
            disabledHours={Retimedisable}
          />
        </Form.Item>
        <Form.Item label="备注:" name="remark">
          <Input.TextArea
            allowClear
            showCount
            maxLength={500}
            style={{ height: '10px', width: '300px' }}
          />
        </Form.Item>
        <Form.Item label="项目名称:" name="projectId" hidden>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={KqszService} // 右侧表格实现类，必填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      ></EpsPanel>
      <Modal
        title="项目信息"
        zIndex={1001}
        centered
        forceRender={true} //  强制渲染modal
        visible={xmVisible}
        onCancel={() => setxmvisible(false)}
        width={600}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        {customAction}
        <Table
          id={'modal-table'}
          dataSource={projectData}
          scroll={{ y: 400 }}
          columns={columns}
          bordered
          rowKey={'id'}
          onRow={(record) => {
            return {
              onDoubleClick: () => onxm(record),
            };
          }}
        />
      </Modal>
    </>
  );
});

export default Kqsz;
