import { useEffect } from 'react';
import { Form, Select, Space, Button, Input, message } from 'antd';
import { observer } from 'mobx-react';
import fetch from '@/utils/fetch';

const formItemLayout = { colon: false, labelCol: { span: 6 } };

const gpdbGN = observer(
  (props: {
    closeModal?: any;
    params?: any;
    callback?: any;
    extendParams?: any;
  }) => {
    const [form] = Form.useForm();

    useEffect(() => {}, []);

    //打包
    const doOk = () => {
      form.validateFields().then(async (values) => {
        const keys = {};
        if (values.tm == 'choosetm') {
          keys['istm'] = 'Y';
          keys['ids'] = props.extendParams.dataParams.dakGrid.selectIds;
        } else if (values.tm == 'pagetm') {
          const response = await fetch.get(
            `/api/eps/control/main/dagl/queryForPage`,
            {
              params: {
                tmzt: props.extendParams.dataParams.tmzt,
                dakid: props.extendParams.dataParams.dakid,
                hszbz: 'N',
                bmc: props.extendParams.dataParams.dakGrid.bmc,
                start: props.extendParams.dataParams.dakGrid.grid.pageIndex,
                limit: props.extendParams.dataParams.dakGrid.grid.pageSize,
                page: '1',
              },
            },
          );
          const tms = response.data;
          let ids = '';
          for (let i = 0; i < tms.results.length; i++) {
            ids += ',' + tms.results[i].id;
          }
          ids = ids.substring(1);
          keys['istm'] = 'Y';
          keys['ids'] = ids;
        } else {
          keys['istm'] = 'N';
        }
        keys['qyyw'] = values.qyyw;
        const jn = {
          dwid: props.extendParams.dataParams.dwid,
          dakids: props.extendParams.dataParams.dakid,
          tmzt: props.extendParams.dataParams.tmzt,
        };
        if (values.qymm == 'Y') {
          if (values.psw == undefined || values.psw == '') {
            message.error(`密码不能为空!`);
          }
          if (values.psw != values.repsw) {
            message.error(`2次输入的密码不同!`);
          }
          keys['psw'] = values.psw;
          jn['psw'] = values.psw;
        }
        keys['con'] = JSON.stringify(jn);
        keys['lx'] = '0';

        const msg = await fetch.get(`/api/eps/control/main/gpkl/burndata`, {
          params: keys,
        });
        if (msg.status === 200) {
          message.success(
            `操作成功！请到包管理中查看打包结果或者下载打包数据！`,
          );
          props.closeModal();
        } else {
          message.error(`操作失败！原因:` + msg.data.message);
          props.closeModal();
        }
      });
    };

    //关闭
    const onCancel = () => {
      props.closeModal();
    };

    const Option = Select.Option;

    const options = [
      { label: '全部条目', value: 'alltm' },
      { label: '当前页条目', value: 'pagetm' },
      { label: '所选条目', value: 'choosetm' },
    ];

    return (
      <div style={{ padding: '10px 0px' }}>
        <Form form={form} {...formItemLayout}>
          <Form.Item label="选择条目:" name="tm" initialValue="choosetm">
            <Select
              className="ant-select"
              placeholder="请选择"
              options={options}
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item label="是否打包原文:" name="qyyw" initialValue="N">
            <Select
              style={{ width: 300, height: 30 }}
              id="qyyw"
              placeholder="请选择"
            >
              <Option value="N">否</Option>
              <Option value="Y">是</Option>
            </Select>
          </Form.Item>
          <Form.Item label="是否启用密码:" name="qymm" initialValue="N">
            <Select
              style={{ width: 300, height: 30 }}
              id="qymm"
              placeholder="请选择"
            >
              <Option value="N">否</Option>
              <Option value="Y">是</Option>
            </Select>
          </Form.Item>
          <Form.Item label="密码:" name="psw">
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="确认密码:" name="repsw">
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            style={{ padding: '20px 0px' }}
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Space style={{ float: 'right' }}>
              <Button type="primary" onClick={doOk}>
                打包
              </Button>
              <Button onClick={onCancel}>关闭</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  },
);

export default gpdbGN;
