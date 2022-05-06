import './index.less';
import { Input, Tabs } from 'antd';
import { Form, InputNumber } from 'antd';
import { Select } from 'antd';

const { Option } = Select;


const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

const App = () => {

    return (
        <>
            <div className='plxgbox'>
                <Tabs centered defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="按位置替换" key="1">
                        <div className='tabpa'>
                            <div className='tababox'>
                                <Form
                                    style={{ marginTop: 10 }}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 16 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="著录项"
                                        name="username"
                                        rules={[{ required: true }]}
                                    >
                                        <Select listItemHeight={10} listHeight={200}
                                            showSearch
                                            placeholder=" "
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">档号</Option>
                                            <Option value="2">分类号</Option>
                                            <Option value="3">批准日期</Option>
                                            <Option value="4">原件持有人</Option>
                                            <Option value="5">年度</Option>
                                            <Option value="6">件号</Option>
                                            <Option value="7">文件题名</Option>
                                            <Option value="8">文件编号</Option>
                                            <Option value="9">成文日期</Option>
                                            <Option value="10">页数</Option>
                                            <Option value="11">责任者</Option>
                                            <Option value="12">保管期限</Option>
                                            <Option value="13">机构（问题）</Option>
                                            <Option value="14">密级</Option>
                                            <Option value="15">归档部门</Option>
                                            <Option value="16">盒号</Option>
                                            <Option value="17">库位码</Option>
                                            <Option value="18">存放位置</Option>
                                            <Option value="19">全宗号</Option>
                                            <Option value="20">全宗名称</Option>
                                            <Option value="21">备注</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="替换字符位置"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: 280.5 }} min={1} max={10} defaultValue={3} />
                                    </Form.Item>
                                    <Form.Item
                                        label="至"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: 280.5 }} min={1} max={10} defaultValue={3} />
                                    </Form.Item>

                                    <Form.Item
                                        label="替换为"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                </Form>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="按内容替换" key="2">
                        <div className='tabpa'>
                            <div className='tabbbox'>
                                <Form
                                    style={{ marginTop: 10 }}
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="著录项"
                                        name="username"
                                        rules={[{ required: true }]}
                                    >
                                        <Select listItemHeight={10} listHeight={200}
                                            showSearch
                                            placeholder=" "
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">档号</Option>
                                            <Option value="2">分类号</Option>
                                            <Option value="3">批准日期</Option>
                                            <Option value="4">原件持有人</Option>
                                            <Option value="5">年度</Option>
                                            <Option value="6">件号</Option>
                                            <Option value="7">文件题名</Option>
                                            <Option value="8">文件编号</Option>
                                            <Option value="9">成文日期</Option>
                                            <Option value="10">页数</Option>
                                            <Option value="11">责任者</Option>
                                            <Option value="12">保管期限</Option>
                                            <Option value="13">机构（问题）</Option>
                                            <Option value="14">密级</Option>
                                            <Option value="15">归档部门</Option>
                                            <Option value="16">盒号</Option>
                                            <Option value="17">库位码</Option>
                                            <Option value="18">存放位置</Option>
                                            <Option value="19">全宗号</Option>
                                            <Option value="20">全宗名称</Option>
                                            <Option value="21">备注</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="替换值"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="替换为"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                </Form>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="合并著录项" key="3">
                        <div className='tabpa'>
                            <div className='tababox'>
                                <Form
                                    style={{ marginTop: 10 }}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 16 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="著录项A"
                                        name="username"
                                        rules={[{ required: true }]}
                                    >
                                        <Select listItemHeight={10} listHeight={200}
                                            showSearch
                                            placeholder=" "
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">档号</Option>
                                            <Option value="2">分类号</Option>
                                            <Option value="3">批准日期</Option>
                                            <Option value="4">原件持有人</Option>
                                            <Option value="5">年度</Option>
                                            <Option value="6">件号</Option>
                                            <Option value="7">文件题名</Option>
                                            <Option value="8">文件编号</Option>
                                            <Option value="9">成文日期</Option>
                                            <Option value="10">页数</Option>
                                            <Option value="11">责任者</Option>
                                            <Option value="12">保管期限</Option>
                                            <Option value="13">机构（问题）</Option>
                                            <Option value="14">密级</Option>
                                            <Option value="15">归档部门</Option>
                                            <Option value="16">盒号</Option>
                                            <Option value="17">库位码</Option>
                                            <Option value="18">存放位置</Option>
                                            <Option value="19">全宗号</Option>
                                            <Option value="20">全宗名称</Option>
                                            <Option value="21">备注</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="连接符"
                                        rules={[{ required: true }]}
                                    >
                                        <Input value={'-'} />
                                    </Form.Item>

                                    <Form.Item
                                        label="著录项B"
                                        name="username"
                                        rules={[{ required: true }]}
                                    >
                                        <Select listItemHeight={10} listHeight={200}
                                            showSearch
                                            placeholder=" "
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">档号</Option>
                                            <Option value="2">分类号</Option>
                                            <Option value="3">批准日期</Option>
                                            <Option value="4">原件持有人</Option>
                                            <Option value="5">年度</Option>
                                            <Option value="6">件号</Option>
                                            <Option value="7">文件题名</Option>
                                            <Option value="8">文件编号</Option>
                                            <Option value="9">成文日期</Option>
                                            <Option value="10">页数</Option>
                                            <Option value="11">责任者</Option>
                                            <Option value="12">保管期限</Option>
                                            <Option value="13">机构（问题）</Option>
                                            <Option value="14">密级</Option>
                                            <Option value="15">归档部门</Option>
                                            <Option value="16">盒号</Option>
                                            <Option value="17">库位码</Option>
                                            <Option value="18">存放位置</Option>
                                            <Option value="19">全宗号</Option>
                                            <Option value="20">全宗名称</Option>
                                            <Option value="21">备注</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="合并到著录项"
                                        name="username"
                                        rules={[{ required: true }]}
                                    >
                                        <Select listItemHeight={10} listHeight={200}
                                            showSearch
                                            placeholder=" "
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">档号</Option>
                                            <Option value="2">分类号</Option>
                                            <Option value="3">批准日期</Option>
                                            <Option value="4">原件持有人</Option>
                                            <Option value="5">年度</Option>
                                            <Option value="6">件号</Option>
                                            <Option value="7">文件题名</Option>
                                            <Option value="8">文件编号</Option>
                                            <Option value="9">成文日期</Option>
                                            <Option value="10">页数</Option>
                                            <Option value="11">责任者</Option>
                                            <Option value="12">保管期限</Option>
                                            <Option value="13">机构（问题）</Option>
                                            <Option value="14">密级</Option>
                                            <Option value="15">归档部门</Option>
                                            <Option value="16">盒号</Option>
                                            <Option value="17">库位码</Option>
                                            <Option value="18">存放位置</Option>
                                            <Option value="19">全宗号</Option>
                                            <Option value="20">全宗名称</Option>
                                            <Option value="21">备注</Option>
                                        </Select>
                                    </Form.Item>




                                </Form>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="生成序列号" key="4">
                    <div className='tabpa'>
                            <div className='tabbbox'>
                                <Form
                                    style={{ marginTop: 10 }}
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="著录项"
                                        name="username"
                                        rules={[{ required: true }]}
                                    >
                                        <Select listItemHeight={10} listHeight={200}
                                            showSearch
                                            placeholder=" "
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">档号</Option>
                                            <Option value="2">分类号</Option>
                                            <Option value="3">批准日期</Option>
                                            <Option value="4">原件持有人</Option>
                                            <Option value="5">年度</Option>
                                            <Option value="6">件号</Option>
                                            <Option value="7">文件题名</Option>
                                            <Option value="8">文件编号</Option>
                                            <Option value="9">成文日期</Option>
                                            <Option value="10">页数</Option>
                                            <Option value="11">责任者</Option>
                                            <Option value="12">保管期限</Option>
                                            <Option value="13">机构（问题）</Option>
                                            <Option value="14">密级</Option>
                                            <Option value="15">归档部门</Option>
                                            <Option value="16">盒号</Option>
                                            <Option value="17">库位码</Option>
                                            <Option value="18">存放位置</Option>
                                            <Option value="19">全宗号</Option>
                                            <Option value="20">全宗名称</Option>
                                            <Option value="21">备注</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="前缀"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="起始值"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: 300 }} min={1} max={10} defaultValue={3} />
                                    </Form.Item>
                                    <Form.Item
                                        label="步长"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: 300 }} min={1} max={10} defaultValue={3} />
                                    </Form.Item>
                                    <Form.Item
                                        label="位数"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber style={{ width: 300 }} min={1} max={10} defaultValue={3} />
                                    </Form.Item>

                                </Form>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
};
export default App;