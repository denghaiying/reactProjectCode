/* eslint-disable no-param-reassign */
import React, { useEffect, useState, Fragment } from "react";
import {
  Tabs,
  Card,
  Input,
  Select,
  Checkbox,
  Button,
  Form,
  Row, Col,
  Tooltip,
} from "antd";
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { withPropsAPI } from "gg-editor";
import upperFirst from "lodash/upperFirst";
import { FormattedMessage, useIntl } from "umi";
import util from "@/utils/util";
import UserStore from "@/stores/user/UserStore";
import WfparamStore from "@/stores/workflow/WfparamStore";
import WfdefStore from "@/stores/workflow/WfdefStore";
import EditTable from '../EditTable';

const { Option } = Select;
const { Item: FormItem } = Form;

const inlineFormItemLayout = {
  // labelCol: { span: 4 },
  // wrapperCol: { span: 20 },
};

const inlineFormItemLayoutHalf = {
  // labelCol: { span: 8 },
  // wrapperCol: { span: 16 },
};

const DetailForm = (props: any) => {
  const {
    propsAPI,
    type,
  } = props;
  const { formatMessage } = useIntl();
  const [tabKey, setTabKey] = useState("user");
  const [userData, setUserData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);
  const [dycData, setDycData] = useState([]);
  const [dorData, setDorData] = useState([]);
  const [field] = Form.useForm();
  const item = () => {
    return propsAPI.getSelected()[0];
  };

  useEffect(() => {
    if (type === "node") {
      const {
        wfuser = [],
        wfnotice = [],
        dmnsync = [],
        dmnor = [],
      } = item().getModel();
      setUserData(wfuser);
      setNoticeData(wfnotice);
      setDycData(dmnsync);
      setDorData(dmnor);
    }
  }, []);


  const validateNodeCode = async (rule, value) => {
    const it = item();
    if (it) {
      const mt = it.getModel().mtype;
      if (mt !== "0" && mt !== "Z") {
        if (value === "0000" || value === "ZZZZ") {
          throw new Error(
            formatMessage({ id: "e9.wflw.wfdef.msg.pro.cannot02Z" })
          );
        }
      }
    }
  };

  const handleSubmit = (e: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const { executeCommand, update } = propsAPI;
    setTimeout(() => {
      field
        .validateFields()
        .then(values => {
          const it = item();
          if (!it) {
            return;
          }
          executeCommand(() => {
            update(it, {
              ...values,
            });
          });
        });
    }, 0);
  };

  const onDefdetailAddClick = () => {
    const it = item();
    if (!it) {
      return;
    }
    if (tabKey === "user") {
      const { wfuser = [] } = it.getModel();
      const newu = (wfuser || []).concat({
        id: util.uuid(),
        type: "B",
        mode: "C",
      });

      setUserData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            wfuser: newu,
          });
        });
      }, 0);
    } else if (tabKey === "notice") {
      const { wfnotice = [] } = it.getModel();
      const newu = (wfnotice || []).concat({
        id: util.uuid(),
        type: "A",
        mode: "A",
        user: "A",
      });
      setNoticeData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            wfnotice: newu,
          });
        });
      }, 0);
    } else if (tabKey === "dmnsync") {
      const { dmnsync = [] } = it.getModel();
      const newu = (dmnsync || []).concat({ id: util.uuid(), type: "A" });
      setDycData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            dmnsync: newu,
          });
        });
      }, 0);
    } else if (tabKey === "dmnor") {
      const { dmnor = [] } = it.getModel();
      const newu = (dmnor || []).concat({ id: util.uuid(), type: "A" });
      setDorData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            dmnor: newu,
          });
        });
      }, 0);
    }
  };

  const onDefdetailDelClick = (atype: string, record: any) => {
    const it = item();
    if (!it) {
      return;
    }
    if (atype === "user") {
      const { wfuser = [] } = it.getModel();
      const newu = (wfuser || []).filter((v: any) => v.id !== record.id);
      setUserData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            wfuser: newu,
          });
        });
      }, 0);
      return;
    }
    if (atype === "notice") {
      const { wfnotice = [] } = it.getModel();
      const newu = (wfnotice || []).filter((v: any) => v.id !== record.id);
      setNoticeData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            wfnotice: newu,
          });
        });
      }, 0);
      return;
    }
    if (atype === "dmnsync") {
      const { dmnsync = [] } = it.getModel();
      const newu = (dmnsync || []).filter((v: any) => v.id !== record.id);
      setDycData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            dmnsync: newu,
          });
        });
      }, 0);
      return;
    }
    if (atype === "dmnor") {
      const { dmnor = [] } = it.getModel();
      const newu = (dmnor || []).filter((v: any) => v.id !== record.id);
      setDorData(newu);
      setTimeout(() => {
        const { executeCommand, update } = propsAPI;
        executeCommand(() => {
          update(it, {
            dmnor: newu,
          });
        });
      }, 0);
    }
    // nothing
  };

  const onDefUserDataChange = (wfuser: any) => {
    setUserData(wfuser);
    const it = item();
    if (!it) {
      return;
    }
    setTimeout(() => {
      const { executeCommand, update } = propsAPI;
      executeCommand(() => {
        update(it, {
          wfuser,
        });
      });
    }, 0);
  };

  const onDefNoticeDataChange = (wfnotice: any) => {
    setNoticeData(wfnotice);
    const it = item();
    if (!it) {
      return;
    }
    setTimeout(() => {
      const { executeCommand, update } = propsAPI;
      executeCommand(() => {
        update(it, {
          wfnotice,
        });
      });
    }, 0);
  };

  const onDmnsyncDataChange = (dmnsync: any) => {
    setDycData(dmnsync);
    const it = item();
    if (!it) {
      return;
    }
    setTimeout(() => {
      const { executeCommand, update } = propsAPI;
      executeCommand(() => {
        update(it, {
          dmnsync,
        });
      });
    }, 0);
  };

  const onDmnorDataChange = (dmnor: any) => {
    setDorData(dmnor);
    const it = item();
    if (!it) {
      return;
    }
    setTimeout(() => {
      const { executeCommand, update } = propsAPI;
      executeCommand(() => {
        update(it, {
          dmnor,
        });
      });
    }, 0);
  };

  const renderNodeDetail = () => {
    const {
      label,
      code = "",
      title = "",
      umid = "",
      canreject = true,
      canreturn = true,
      canedit = true,
      candelete = false,
      isJsign = false,
      params = "",
      // eslint-disable-next-line no-nested-ternary
      mtype = code === "0000" ? "0" : code === "ZZZZ" ? "Z" : "N",
    } = item().getModel() || {};
    return (
      <Fragment>
        <FormItem
          rules={[{ required: true, message: "名称不允许为空" }]}
          label={formatMessage({ id: "e9.wflw.wfdef.pro.name" })}
          {...inlineFormItemLayout}
          name="label"
          initialValue={label}
        >
          <Input
            disabled={mtype === "0" || mtype === "Z"}
          />
        </FormItem>
        <Row>
          <Col>
            <FormItem
              rules={[{ required: true, message: "编号不允许为空" }, { validator: validateNodeCode }]}
              label={formatMessage({ id: "e9.wflw.wfdef.pro.code" })}
              {...inlineFormItemLayoutHalf}
              name="code"
              initialValue={code}
            >
              <Input
                disabled={mtype === "0" || mtype === "Z"}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label={formatMessage({ id: "e9.wflw.wfdef.pro.umid" })}
              {...inlineFormItemLayoutHalf}
              name="umid"
              initialValue={umid}
            >
              <Input
                disabled={mtype === "0" || mtype === "Z"}
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label="会签："
          {...inlineFormItemLayout}
          name="isJsign"
          valuePropName="checked"
          initialValue={isJsign}
        >
          <Checkbox
          // checkedChildren="on"
          // unCheckedChildren="off"
          // defaultChecked={isJsign}
          />
        </FormItem>
        <FormItem
          label={formatMessage({ id: "e9.wflw.wfdef.pro.title" })}
          {...inlineFormItemLayout}
          name="title"
          initialValue={title}
        >
          <Input />
        </FormItem>
        <Row>
          <Col span={4} />
          <Col span={10}>
            <FormItem
              label={formatMessage({ id: "e9.wflw.wfdef.pro.canreject" })}
              {...inlineFormItemLayoutHalf}
              name="canreject"
              valuePropName="checked"
              initialValue={canreject}
            >
              <Checkbox
              // checkedChildren="on"
              // unCheckedChildren="off"
              // defaultChecked={canreject}
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              label={formatMessage({ id: "e9.wflw.wfdef.pro.canreturn" })}
              {...inlineFormItemLayoutHalf}
              name="canreturn"
              valuePropName="checked"
              initialValue={canreturn}
            >
              <Checkbox
              // checkedChildren="on"
              // unCheckedChildren="off"
              // defaultChecked={canreturn}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={4} />
          <Col span={10}>
            <FormItem
              label={formatMessage({ id: "e9.wflw.wfdef.pro.canedit" })}
              {...inlineFormItemLayoutHalf}
              name="canedit"
              valuePropName="checked"
              initialValue={canedit}
            >
              <Checkbox
              // checkedChildren="on"
              // unCheckedChildren="off"
              // defaultChecked={canedit}
              />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              label={formatMessage({ id: "e9.wflw.wfdef.pro.candelete" })}
              {...inlineFormItemLayoutHalf}
              name="candelete"
              valuePropName="checked"
              initialValue={candelete}
            >
              <Checkbox
              // checkedChildren="on"
              // unCheckedChildren="off"
              // defaultChecked={candelete}
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label={formatMessage({ id: "e9.wflw.wfdef.pro.params" })}
          {...inlineFormItemLayout}
          name="params"
          initialValue={params}
        >
          <Input.TextArea
            autoSize={{ minRows: 2 }}
          />
        </FormItem>
      </Fragment>
    );
  };

  const renderEdgeDetail = () => {
    const { shape = "flow-smooth", params = "" } = item().getModel();
    return (
      <Fragment>
        <FormItem
          label={formatMessage({ id: "e9.wflw.wfdef.rev.shape" })}
          {...inlineFormItemLayout}
          name="shape"
          initialValue={shape}
        >
          <Select>
            <Option value="flow-smooth">
              {formatMessage({ id: "e9.wflw.wfdef.rev.shapeSmooth" })}{" "}
            </Option>
            <Option value="flow-polyline">
              {formatMessage({ id: "e9.wflw.wfdef.rev.shapePolyline" })}{" "}
            </Option>
            <Option value="flow-polyline-round">
              {formatMessage({ id: "e9.wflw.wfdef.rev.shapePlRound" })}{" "}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label={formatMessage({ id: "e9.wflw.wfdef.rev.params" })}
          {...inlineFormItemLayout}
          name="params"
          initialValue={params}
        >
          <Input.TextArea />
        </FormItem>
      </Fragment>
    );
  };

  const renderGroupDetail = () => {
    const { label = "新建分组" } = item().getModel();
    return (
      <FormItem label="Label" {...inlineFormItemLayout} initialValue={label}>
        <Input name="group" />
      </FormItem>
    );
  };

  const onUserCodeChange = async (newValue: string, index: number, newRecord: any) => {
    const atype = newRecord.type;
    const acode = newRecord.code;
    if (!acode) {
      newRecord.name = "";
      return;
    }
    if (atype === "B") {
      const v = await UserStore.findByCode(acode);
      newRecord.name = (v && v.yhmc) || "";
      // } else if (atype === "A") {
      //   const v = await RoleStore.findByCode(acode);
      //   newRecord.name = (v && v.name) || "";
    } else if (atype === "U") {
      const v = await WfparamStore.findByCode(
        WfdefStore.defData.def.wfvid,
        acode
      );
      newRecord.name = (v && v.name) || "";
    }
  };

  const renderUserTable = () => {
    return (
      <EditTable
        // fixedHeader
        value={userData}
        onChange={(v) => onDefUserDataChange(v)}
        columns={[
          {
            width: 150,
            title: formatMessage({ id: "e9.wflw.wfdef.user.type" }),
            dataIndex: "type",
            edittype: "select",
            dropdowndata: [
              { value: "B", item: "用户" },
              // { value: "A", item: "角色" },
              { value: "U", item: "自定义参数" },
            ],
            onCellChange: async (newValue, index, newRecord) =>
              onUserCodeChange(newValue, index, newRecord),
          },
          {
            width: 100,
            title: formatMessage({ id: "e9.wflw.wfdef.user.code" }),
            dataIndex: "code",
            onCellChange: async (newValue, index, newRecord) =>
              onUserCodeChange(newValue, index, newRecord),
          },
          {
            width: 150,
            title: formatMessage({ id: "e9.wflw.wfdef.user.name" }),
            dataIndex: "name",
            readonly: true,
          },
          {
            width: 150,
            title: formatMessage({ id: "e9.wflw.wfdef.user.mode" }),
            dataIndex: "mode",
            edittype: "select",
            dropdowndata: [
              { value: "A", item: "默认选中" },
              { value: "B", item: "强制选中" },
              { value: "C", item: "自行选择" },
            ],
          },
          {
            width: 50,
            fixed: "right",
            render: (value, record) => {
              return (
                <Tooltip title="删除">
                  <Button
                    onClick={() => onDefdetailDelClick("user", record)}
                    style={{ marginLeft: "5px" }}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              );
            },
          },
        ]}
      />
    );
  };

  const renderNoticeTable = () => {
    return (
      <EditTable
        //  fixedHeader
        value={noticeData}
        onChange={(v) => onDefNoticeDataChange(v)}
        columns={[
          {
            width: 200,
            title: formatMessage({ id: "e9.wflw.wfdef.notice.type" }),
            dataIndex: "type",
            edittype: "select",
            dropdowndata: [{ value: "A", item: "系统消息" }],
          },
          {
            width: 200,
            title: formatMessage({ id: "e9.wflw.wfdef.notice.mode" }),
            dataIndex: "mode",
            edittype: "select",
            dropdowndata: [
              { value: "A", item: "提交通知" },
              { value: "B", item: "退回通知" },
              { value: "C", item: "全部通知" },
            ],
          },
          {
            width: 100,
            title: formatMessage({ id: "e9.wflw.wfdef.notice.user" }),
            dataIndex: "user",
            edittype: "select",
            dropdowndata: [
              { value: "A", item: "执行人" },
              { value: "B", item: "创建人" },
            ],
          },
          {
            width: 100,
            fixed: "right",
            render: (value, record) => {
              return (
                <Tooltip title="删除">
                  <Button
                    onClick={() => onDefdetailDelClick("notice", record)}
                    style={{ marginLeft: "5px" }}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              );
            },
          },
        ]}
      />
    );
  };

  const renderDomainSyncTable = () => {
    return (
      <EditTable
        value={dycData}
        scroll={{ x: 750 }}
        onChange={(v) => onDmnsyncDataChange(v)}
        columns={[
          {
            // e9.wflw.wfdef.dmnsync.type
            width: 150,
            title: '同步模式',
            dataIndex: "mode",
            edittype: "select",
            dropdowndata: [
              { value: "A", item: "到达同步" },
              { value: "B", item: "离开同步" },
            ],
          },
          {
            // e9.wflw.wfdef.dmnsync.type
            width: 150,
            title: formatMessage({ id: "e9.wflw.wfdef.dmnsync.type" }),
            dataIndex: "type",
            edittype: "select",
            dropdowndata: [
              { value: "A", item: "值同步" },
              { value: "B", item: "SQL同步" },
            ],
          },
          {
            width: 150,
            title: formatMessage({ id: "e9.wflw.wfdef.dmnsync.metadata" }),
            dataIndex: "metadata",
          },
          {
            width: 200,
            edittype: "mutiinput",
            title: formatMessage({ id: "e9.wflw.wfdef.dmnsync.value" }),
            dataIndex: "value",
            ellipsis: true,
          },
          {
            width: 100,
            fixed: "right",
            render: (value, record) => {
              return (
                <Tooltip title="删除">
                  <Button
                    onClick={() => onDefdetailDelClick("dmnsync", record)}
                    style={{ marginLeft: "5px" }}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              );
            },
          },
        ]}
      />
    );
  };

  const renderDmnorTable = () => {
    return (
      <EditTable
        //  fixedHeader
        value={dorData}
        onChange={(v) => onDmnorDataChange(v)}
        columns={[
          {
            width: 200,
            title: formatMessage({ id: "e9.wflw.wfdef.dmnor.ctrl" }),
            dataIndex: "ctrl",
          },
          {
            width: 200,
            title: formatMessage({ id: "e9.wflw.wfdef.dmnor.type" }),
            dataIndex: "type",
            edittype: "select",
            dropdowndata: [
              { value: "A", item: "只读" },
              { value: "B", item: "可写" },
              { value: "C", item: "不可见" },
            ],
          },
          {
            width: 100,
            fixed: "right",
            render: (value, record) => {
              return (
                <Tooltip title="删除">
                  <Button
                    onClick={() => onDefdetailDelClick("dmnor", record)}
                    style={{ marginLeft: "5px" }}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              );
            },
          },
        ]}
      />
    );
  };

  if (!item()) {
    return null;
  }
  const { label } = item().getModel();
  return (
    <div>
      <Card
        title={
          type === "edge" ? (
            <FormattedMessage id="e9.wflw.wfdef.rev.title" />
          ) : (
            label || upperFirst(type)
          )
        }
        role="grid"
      >
        <Form labelAlign="left" form={field} onChange={(e) => { handleSubmit(e); }} >
          {/* onSubmit={this.handleSubmit} */}
          {type === "node" && renderNodeDetail()}
          {type === "edge" && renderEdgeDetail()}
          {type === "group" && renderGroupDetail()}
        </Form>
      </Card>
      {type === "node" && (
        <Card >
          <Tabs
            activeKey={tabKey}
            onChange={(key) => setTabKey(key)}
            size="small"
            style={{ marginTop: "10px" }}
            tabBarExtraContent={
              <div style={{ marginRight: "50px" }}>
                <Button onClick={onDefdetailAddClick} icon={<FileAddOutlined />}>
                </Button>
              </div>
            }
          >
            <Tabs.TabPane
              key="user"
              tab={<FormattedMessage id="e9.wflw.wfdef.user.title" />}
            >
              {renderUserTable()}
            </Tabs.TabPane>
            <Tabs.TabPane
              key="notice"
              tab={<FormattedMessage id="e9.wflw.wfdef.notice.title" />}
            >
              {renderNoticeTable()}
            </Tabs.TabPane>
            <Tabs.TabPane
              key="dmnsync"
              tab={<FormattedMessage id="e9.wflw.wfdef.dmnsync.title" />}
            >
              {renderDomainSyncTable()}
            </Tabs.TabPane>
            <Tabs.TabPane
              key="dmnor"
              tab={<FormattedMessage id="e9.wflw.wfdef.dmnor.title" />}
            >
              {renderDmnorTable()}
            </Tabs.TabPane>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default withPropsAPI(DetailForm as any);
