import './index.less';
import { Form, Select, InputNumber, Input, Space, Button, Radio,Transfer, Switch, Table, Tag } from 'antd';
import React from 'react';

// 表格
const columns = [
  {
    title: '类型',
    dataIndex: 'lx',
    key: 'lx',
  },
  {
    title: '字段描述',
    dataIndex: 'zdms',
    key: 'zdms',
  },
];


// 联动
const { Option } = Select;
const provinceData = ['著录项', '分隔符' ,'流水号'];
const cityData = {
    著录项: ['档号', '分类号', '批准日期','原件持有人','年度','件号','文件题名','文件编号','成文日期'
    ,'页数','责任者','保管期限','机构(问题)','密级','归档部门','盒号','库位码','存放位置','全宗号'
    ,'全宗名称','备注'],
    分隔符: [',', '.', '-','`'],
    流水号: ['1', '2', '3','0'],
};

const App = () => {
    // 联动
    const [cities, setCities] = React.useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = React.useState(cityData[provinceData[0]][0]);

  const handleProvinceChange = value => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = value => {
    setSecondCity(value);
  };

function rowSelection(){
    type:'check'
}

    return (
        <>
            <div className='mmbox'>
                <div className='mmdyh'>
                    <div style={{float:'left'}}>
                    <>
                        <Select defaultValue={provinceData[0]} style={{ width: 160 }} onChange={handleProvinceChange}>
                            {provinceData.map(province => (
                            <Option key={province}>{province}</Option>
                            ))}
                        </Select>
                        <Select style={{ width: 160,marginLeft:3 }} value={secondCity} onChange={onSecondCityChange}>
                            {cities.map(city => (
                            <Option key={city}>{city}</Option>
                            ))}
                        </Select>
                    </>
                    </div>
                    <div>
                    <div style={{float:'left',marginLeft:30}}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="仅标题"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        <Option value="1">仅标题</Option>
                        <Option value="2">仅文件名</Option>
                        <Option value="3">标题和文件名</Option>
                    </Select>
                    </div>
                    <div style={{float:'left'}}>
                        <Button type='primary'  style={{marginLeft:10}}>删除</Button>
                        <Button type='primary'  style={{marginLeft:10}}>添加</Button>
                        <Button type='primary'  style={{marginLeft:10}}>批量修改</Button>
                    
                    </div>
                    </div>
                </div>
                <div className='mmdeh'>
                    <div style={{border:'1px solid rgb(215, 215, 215)',marginTop:15}}>
                <Table columns={columns} rowSelection={rowSelection}/>
                </div>
                </div>
            </div>



        </>
    );
};
export default App;