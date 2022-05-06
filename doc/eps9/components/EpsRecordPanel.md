
## 页面布局
![前端布局介绍](/doc/eps9/images/EpsRecordPanel.png "前端布局介绍")

 1. 表格区域设置请参考 [EpsPanel](/doc/eps9/components/EpsPanel3.md)
 2. 自定义组件区


# 使用
``` typescript
import { EpsRecordPanel } from '@/eps/components/panel/EpsRecordPanel';

const CustomPage = observer((props) => {
  // 配置项设置
  const epsProps: RecordPanelProps = {
    // ... 具体内容，请看下表
  }

  // 注意，EpsPanel不要用<div></div> 包裹，否则会出现样式错乱
  return (
    <EpsRecordPanel {...epsProps} />
  )

}

export default CustomPage;
```

# 配置项内容(RecordPanelProps)

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|tableService |表格 service,用于实现和后端交互，需实现 ITableService 接口 | [ITableService](#itableservice) | null | 1.0 |
|source | 数据结构，为列表页的展示字段，同时可以控制自动表单的生成内容（用于组件自带的修改和新增操作，功能待完善） | [EpsSource[]](#epssource) | null | 1.0 |
|tableProp |表格区配置内容，可控制表格的各区域的内容 | [ITable](#itable) | null | 1.0 |
|initParams |EpsPanel初始化参数，用于页面加载时预处理数据 | Object | {} | 1.0 |
|title |EpsPanel 标题和对应图标 | [ITitle](#ititle) | null | 1.0 |
|customForm |自定义表单区，设置后自动表单不生效，由于自动表单功能尚未完善，现阶段推荐使用该方式 | Function &#124; ReactNode |underfined | 1.0 |
|formWidth | 自定义表单区宽度 | number | 500 | 1.0 | 
| menuProp | 自定义菜单按钮 | [MenuData[]](#menuprop) | null | 1.0 | 
|searchForm |高级搜索表单区域，如不设置则不显示高级搜索 | Function &#124; ReactNode | null | 1.0 | 
|customTableAction |自定义表单区，针对行数据的业务操作 |  Function &#124; ReactNode  | null | 1.0 | 
|tableRowClick | 表格行点击事件 | Function | (kdy, store: EpsTableStore)=>any | 1.0 | 
|bottomAction | 页面下方组件 | (store: EpsTableStore, record: Array<any>) => any  | ((store: EpsTableStore, record: Array<any>) => any)[] | null | 1.0 | 

### <span id="epssourcedatasource">EPsSourceDataSource</span>
- EPsSourceDataSource 是用于对自动表单中，选择类组件所需的数据源的预定义规则，（用于Switch组件时，需包含两个对象，第一个对象为true对应的数据，第二个对象为false对应的数据）

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
| title | 在界面上展示的名称 | string | '' | 1.0 |
| key | 该名称在数据结构中对应的值 | string | '' | 1.0 |

### <span id="itable">ITable</span>
- ITable 负责控制对表格区域的控制，包括对通用按钮（新增、修改、删除、打印、报表等）的隐藏和显示管理

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|rowSelection | 自定义行选择配置 | [rowSelection](#rowselection) | null | 1.0 | 
|disableEdit | 是否禁用通用编辑按钮 | Boolean | false | 1.0 | 
|disableDelete | 是否禁用通用删除按钮 |  Boolean  | false | 1.0 | 
|disableIndex | 是否禁用索引列 | Boolean | false | 1.0 | 
|disableAdd | 是否禁用通用新增按钮 | Boolean | false | 1.0 | 
|tableSearch | 是否禁用普通搜索 | Boolean |  false | 1.0 |
|searchCode | 普通搜索待查询字段对应的code， 默认为 'key' | String | 'key' | 1.0 |

### <span id="rowselection">rowselection</span>
- 表格选择功能的配置。

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
| type | 多选/单选 | 'checkbox' &#124; 'radio' | 'radio' | 1.0 |
| onChange | 选中项发生变化时的回调 | function(selectedRowKeys, selectedRows) | - | 1.0 |

### <span id="menuprop">menuprop</span>
- 自定义菜单按钮

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|title | 菜单名称 | string | null | 1.0 | 
|color | 菜单使用颜色 | string | null | 1.0 | 
|icon | 菜单使用图片 | string &#124; ReactNode | null | 1.0 | 
|onClick | 菜单使用图片 |(record: any,store: EpsTableStore, row: any) => void | - | 1.0 | 

### <span id="ititle">ITitle</span>
- ITitle 用于定义页面主题，包括使用公共新增、编辑时，弹出框的名称等属性

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|name | 页面主题 | string | null | 1.0 | 
|icon | 页面对应的图标按钮，现阶段可不填写 | string &#124; ReactNode | null | 1.0 | 

### <span id="customform">customForm</span>
- customForm 用于自定义新增和修改的弹出表单内容,customForm有两个参数form, store
  - form: 为当前表单时实列，可通过form来操作表单内部元素 ，具体API可参考 [antd From](https://ant.design/components/form-cn/#FormInstance)
  - store: 为当前table的store实例，具体内容可参考 [TableStore](#tablestore)


#### 使用

``` typescript
const customForm = (form, store) => {
  
  // 24/n, n为列数
  const span = 12

  const onChange = (val) => {
    form.setFieldsValue({'yhmc': val})
  }

  return (
    <Row gutter={20}>
      <Col span={span}>
        <Form.Item label="单位"  name="dwid" required>
          <Select className="ant-select" placeholder="单位" options={xxxx} onChange={(value) => onChange(value)}/>
        </Form.Item>

      </Col>
      <Col span={span}>
          <Form.Item  required  label="用户名称" name='yhmc'>
              <Input className="ant-input" placeholder="用户名称" />
          </Form.Item>
      </Col>
    </Row>
  )
}
```
### <span id="tablestore">tableStore</span>
- 表格部分的store，用于对表格渲染数据的状态保持和操作

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|service | 表格使用的ITableService | [ITableService](#itableservice) | null | 1.0 | 
|tableList | 表格展示的数据 | Array<any> | [] | 1.0 | 
|key | 点击左侧树后，对应树的value |  string &#124; number &#124; object | '' | 1.0 | 
|page | 表格当前页数 | number | 1 | 1.0 | 
|size | 表格分页大小 |  number | 50 | 1.0 | 
|total | 总数据量 | number | 0 | 1.0 | 
|params | 调用service查询数据时，携带的参数，该参数一般为搜索或高级搜索的内容，以及初始化参数 | object | {} | 1.0 | 
|findByKey | 表格查询方法，可用于加载数据、刷新等操作 | (key, page, size, params) => void | null | 1.0 | 

