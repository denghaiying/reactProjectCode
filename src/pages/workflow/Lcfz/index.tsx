import { useEffect, useState } from 'react';
import { Input, message, Form, Button, Checkbox, Card } from 'antd';
import { observer } from 'mobx-react';
import LcfzStore from '@/stores/workflow/LcfzStore';
import './index.less';
const Lcfz = observer(() => {
  const [lcform] = Form.useForm();
  const [lcfz, setLcfz] = useState(false);
  const [list, setList] = useState([]);

  //初始化加载数据
  useEffect(() => {
    LcfzStore.queryForList().then((values) => {
      if (values.length == 0) {
        return message.error('请确定YWFZLC表中是否维护数据', 0);
      } else {
        setLcfz(true);
      }
    });
  }, []);

  const save = () => {
    lcform.validateFields().then((values) => {
      if (!values.id) {
        return message.error('数据有问题，请联系管理员查看数据库');
      }
      LcfzStore.update(values).then(() => {
        message.success('保存成功');
      });
    });
  };

  const cancel = () => {
    LcfzStore.queryForList().then((values) => {
      setList(values);
      LcfzStore.list = list;
      lcform.resetFields();
    });
  };
  const checkboxOnchange = (value) => {
    if (value.target.checked === true && value.target.id == 'dw') {
      lcform.setFieldsValue({ dw: 'Y' });
    } else if (value.target.checked === false && value.target.id == 'dw') {
      lcform.setFieldsValue({ dw: 'N' });
    } else if (value.target.checked === true && value.target.id == 'lx') {
      lcform.setFieldsValue({ lx: 'Y' });
    } else if (value.target.checked === false && value.target.id == 'lx') {
      lcform.setFieldsValue({ lx: 'N' });
    } else if (value.target.checked === true && value.target.id == 'daklx') {
      lcform.setFieldsValue({ daklx: 'Y' });
    } else if (value.target.checked === false && value.target.id == 'daklx') {
      lcform.setFieldsValue({ daklx: 'N' });
    } else if (value.target.checked === true && value.target.id == 'dak') {
      lcform.setFieldsValue({ dak: 'Y' });
    } else if (value.target.checked === false && value.target.id == 'dak') {
      lcform.setFieldsValue({ dak: 'N' });
    } else if (value.target.checked === true && value.target.id == 'mj') {
      lcform.setFieldsValue({ mj: 'Y' });
    } else if (value.target.checked === false && value.target.id == 'mj') {
      lcform.setFieldsValue({ mj: 'N' });
    }
  };

  return (
    lcfz && (
      <div>
        <Card
          title="介于流程分组:"
          // style={{ height: "39px" }}
          // style={{height: "100%"}}
        >
          <div
            style={{ padding: '80px', height: '100%' }}
            className="FcheckChecked"
          >
            <Form form={lcform} style={{ marginLeft: '300px' }}>
              <Form.Item name="dw" initialValue={LcfzStore.list[0].dw}>
                <Checkbox
                  onChange={checkboxOnchange}
                  defaultChecked={LcfzStore.list[0].dw === 'Y'}
                >
                  <h1>
                    <tr>
                      <td width="200px">单位</td>{' '}
                      <td width="500px" align="left">
                        （分单位形成不同借阅单据）
                      </td>
                    </tr>
                  </h1>
                </Checkbox>
              </Form.Item>

              <Form.Item name="lx" initialValue={LcfzStore.list[0].lx}>
                <Checkbox
                  defaultChecked={LcfzStore.list[0].lx === 'Y'}
                  onChange={checkboxOnchange}
                >
                  <h1>
                    <tr>
                      <td width="200px">借阅载体类型</td>{' '}
                      <td width="500px" align="left">
                        （分电子\实体形成不同借阅单据）
                      </td>
                    </tr>
                  </h1>
                </Checkbox>
              </Form.Item>
              <Form.Item name="daklx" initialValue={LcfzStore.list[0].daklx}>
                <Checkbox
                  defaultChecked={LcfzStore.list[0].daklx === 'Y'}
                  onChange={checkboxOnchange}
                >
                  <h1>
                    <tr>
                      <td width="200px">档案库类型</td>{' '}
                      <td width="500px" align="left">
                        （分档案库类型形成不同借阅单据）
                      </td>
                    </tr>
                  </h1>
                </Checkbox>
              </Form.Item>
              <Form.Item name="dak" initialValue={LcfzStore.list[0].dak}>
                <Checkbox
                  defaultChecked={LcfzStore.list[0].dak === 'Y'}
                  onChange={checkboxOnchange}
                >
                  <h1>
                    <tr>
                      <td width="200px">档案库</td>{' '}
                      <td width="500px" align="left">
                        （分档案库形成不同借阅单据）
                      </td>
                    </tr>
                  </h1>
                </Checkbox>
              </Form.Item>
              <Form.Item name="mj" initialValue={LcfzStore.list[0].mj}>
                <Checkbox
                  defaultChecked={LcfzStore.list[0].mj === 'Y'}
                  onChange={checkboxOnchange}
                >
                  <h1>
                    <tr>
                      <td width="200px">密级</td>{' '}
                      <td width="500px" align="left">
                        （根据密级形成不同借阅单据）
                      </td>
                    </tr>
                  </h1>
                </Checkbox>
              </Form.Item>
              <Form.Item name="id" hidden initialValue={LcfzStore.list[0].id}>
                <Input />
              </Form.Item>
              <div style={{ marginLeft: '600px', marginBottom: '50px' }}>
                <Button onClick={save} type="primary" size="large">
                  保存
                </Button>
                <Button
                  type="primary"
                  style={{ marginLeft: '10px' }}
                  onClick={cancel}
                  size="large"
                >
                  取消
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    )
  );
});

export default Lcfz;
