import './index.less';
import { Form, Select, InputNumber, Input, Tabs, Button, Radio } from 'antd';
import { Transfer, Switch, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { Divider } from 'antd';

const provinceData = ['著录项', '分隔符'];
const cityData = {
    著录项: ['档号', '分类号', '批准日期', '原件持有人','年度','件号','文件题名'
    ,'文件编号','成文日期','页数','责任者','保管期限','机构(问题)','密级','归档部门'
    ,'盒号','库位码','存放位置','全宗号','全宗名称','备注'],
    分隔符: ['-', ',', '.', '/'],
};

const columns = [
    {
        title: '类型',
        dataIndex: 'name',
        align:'center'
    },
    {
        title: '字段描述',
        dataIndex: 'age',
        align:'center'
    },
];

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const data: DataType[] = [
    // {
    //     key: '1',
    //     name: 'John Brown',
    //     age: 32,
    //     address: 'New York No. 1 Lake Park',
    // },
    // {
    //     key: '2',
    //     name: 'Jim Green',
    //     age: 42,
    //     address: 'London No. 1 Lake Park',
    // },
];

// rowSelection object indicates the need for row selection

const { Option } = Select;


const App = () => {
function rowSelection(){
    type:'check'
}


// 联动选择
const [cities, setCities] = React.useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = React.useState(cityData[provinceData[0]][0]);

  const handleProvinceChange = value => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = value => {
    setSecondCity(value);
  };
    return (
        <>
            <div className='dsbox'>
                {/* 第一行 */}
                <div className='dsdyg'>
                    <div style={{ float: 'left' }}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="所选条目"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                        >
                            <Option value="1">所选条目</Option>
                            <Option value="2">当前页</Option>
                            <Option value="3">所选条目</Option>
                        </Select>
                    </div>
                    <div style={{ float: 'right', marginLeft: 20 }}>
                        <p style={{ float: 'left', fontSize: 14, lineHeight: '28px' }}>导出电子全文：</p>
                        <div style={{ float: 'left' }}>
                            <Radio style={{ marginTop: 5 }}></Radio>
                        </div>
                        <div style={{ float: 'left' }}>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="原格式文件"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                <Option value="1">原格式文件</Option>
                                <Option value="2">带水印PDF</Option>
                                <Option value="3">不带水印PDF</Option>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className='dehbox'>
                    <div style={{border:'1px solid rgb(216, 216, 216)'}}>
                       
                        <p className='ywcmmz'>原文重命名规则</p>
                        <div style={{width:'100%',height:'28px'}}>
                            <div style={{float:'left'}}>
                            <>
                                <Select defaultValue={provinceData[0]} style={{ width: 150 }} onChange={handleProvinceChange}>
                                    {provinceData.map(province => (
                                    <Option key={province}>{province}</Option>
                                    ))}
                                </Select>
                                <Select style={{ width: 150,marginLeft:3 }} value={secondCity} onChange={onSecondCityChange}>
                                    {cities.map(city => (
                                    <Option key={city}>{city}</Option>
                                    ))}
                                </Select>
                            </>
                            </div>
                            <div style={{float:'right'}}>
                                <Button type='primary'>添加</Button>
                                <Button type='primary' style={{marginLeft:10}}>删除</Button>
                            </div>                            
                        </div>
                        <Table style={{marginTop:5}}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                        />
                    </div>
                </div>
            </div>



        </>
    );
};
export default App;