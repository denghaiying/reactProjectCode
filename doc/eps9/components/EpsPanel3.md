## 页面布局
![前端布局介绍](/doc/eps9/images/EpsPanel3.png "前端布局介绍")
 1. 扩展按钮区
 2. 表格通用搜索，可通过指定searchCode指定查询内容对应的字段，如不设定该值，则统一使用key做为查询关键字
 3. 高级查询，在设置 searchForm 后，可使用高级查询，高级查询一般为组合查询
 4. [自定义功能区](#customaction)，用于全局性（非表格行数据关联）的操作区，所有自定义功能区的组件均可使用 tableStore（一般用于刷新数据或获取查询参数）和checkRows（开启行选择按钮后，可获得选择行的数据数组）
 5. 表格行数据选择
 6. 表格数据展示区，通过配置参数设置该表格是否可单/多选
 7. [自定义表格功能](#customtableaction)区，针对表格的行数据进行操作


## 使用
``` typescript
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';

const CustomPage = observer((props) => {
  // 配置项设置
  const epsProps: EpsProps = {
    // ... 具体内容，请看下表
  }

  // 注意，EpsPanel不要用<div></div> 包裹，否则会出现样式错乱
  return (
    <EpsPanel {...epsProps} />
  )

}

export default CustomPage;
```
## 开发约定
- 设计表格时，应注意控制每列的列宽，禁止出现整列单元格内有大量的空白区域
- 在使用弹出框组件/功能时，要调整弹出框的宽度和高度，宽高占比不应超过最大屏幕宽高
- 通过点击按钮/链接触发新窗口、新模块或新组件时，应将该功能的初始化操作设置于按钮/链接的 ```onClick``` 事件中
- 一般情况下， 每个独立功能在进行开发时，应封装成独立的函数组件，放置于```@/components/```中对应的模块下，并在主页面中，通过对 [EpsModalButton](./EpsModalButton.md) 设置url进行打开，主界面上不进行多余的功能开发

## 配置项内容(EpsProps)

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|tableService |表格 service,用于实现和后端交互，需实现 ITableService 接口 | [ITableService](#itableservice) | null | 1.0 |
|source | 数据结构，为列表页的展示字段，同时可以控制自动表单的生成内容（用于组件自带的修改和新增操作，功能待完善） | [EpsSource[]](#epssource) | null | 1.0 |
|tableProp |表格区配置内容，可控制表格的各区域的内容 | [ITable](#itable) | null | 1.0 |
|initParams |EpsPanel初始化参数，用于页面加载时预处理数据 | Object | {} | 1.0 |
|title |EpsPanel 标题和对应图标 | [ITitle](#ititle) | null | 1.0 |
|customForm |自定义表单区，设置后自动表单不生效，由于自动表单功能尚未完善，现阶段推荐使用该方式 | Function &#124; ReactNode |underfined | 1.0 |
|formWidth | 自定义表单区宽度 | number | 500 | 1.0 | 
|searchForm |高级搜索表单区域，如不设置则不显示高级搜索 | Function &#124; ReactNode | null | 1.0 | 
|customTableAction |自定义表单区，针对行数据的业务操作 |  Function &#124; ReactNode  | null | 1.0 | 
|tableRowClick | 表格行点击事件 | Function | (kdy, store: EpsTableStore)=>any | 1.0 | 


### <span id="itableservice">ITableService</span>
- ITableService 是一组接口，用于接收点击左侧树对应的数据，并自行封装后进行数据的查询或交互
- 接口定义
``` typescript
export default interface ITableService {
    // 根据左侧tree的节点查询数据
    // key: 点击左侧树后，对应树的值会赋值到key中
    // page: 分页查询时的页码，默认为 1
    // size: 分页查询的偏移量，默认是 50
    // args 封装的参数，参数来源一般为查询操作，默认为 {}
    findByKey(key: string | number | Array, page: number, size: number, args?: object) : Promise<any>;
    // 新增方法
    // key: 点击左侧树后，对应树的值会赋值到key中
    // data: 表单中传递的数据
    saveByKey(key: any, data: object): Promise<any>;
    // 删除
    // data: 表单中传递的数据
    deleteForTable(data: object): Promise<any>;
    // 修改
    // data: 表单中传递的数据
    updateForTable(data: object): Promise<any>
    // 批量删除
    batchDelete(data: Array<any>): Promise<any>
}
```
- 使用
``` typescript

class YhService extends BaseService implements ITableService {

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['code']= key;
        args['pageIndex']= page;
        args['pageSize']= size;

        return new Promise((resolve, reject) => {
                return super.get({url: '/xxxxxxx' ,params: args}).then(res => {
                    if(res.status > 300){
                        return reject(res)
                    }
                    return resolve(res.data)
                }).catch(err => {
                    return reject(err)
                })
            }
        )
    }

    saveByKey(key, data){
        data['inm'] = 'Y'
        data['mkbh'] = key
        return super.save(data);
    }

    updateForTable(data) {
        data['inm'] = 'Y'
        return super.update(data)
    }

    deleteForTable(data){
        return super.del(data);
    }

}

export default new YhService('/api/eps/control/main/yh');
```

### <span id="epssource">EpsSource</span>
- EpsSource 是页面渲染的核心，通过定义具体的属性，可完成对表格的渲染操作，同时，待自动表单功能完成后，在不配置 customForm 的前提下，可以自动渲染表单

| 配置属性 | 描述 |类型 | 默认值 | 版本 |
|:----|:----|:----|:----|:----|
| title | 元数据名称，用于表格的表头和表单的表单项名称 | string | '' | 1.0 |
| code | 元数据属性，对应待操作数据实体中的属性 | string | '' | 1.0 |
| align | 数据在表格中的对齐方式 | string | '' | 1.0 |
| render | 自定义渲染 | Function | (text,record,index) => text | 1.0 |
| width | 数据表格中的列宽 | number | null | 1.0 |
| ellipsis | 数据内容超出列宽是自动省略 | string | '' | 1.0 |
| fixed | 数据表格中，该数据列是否冻结 | boolean | '' | 1.0 |
| formType | 使用自动表单时，对应的表单类型 | EpsFormType | '' | 1.0 |
| tableHidden | 对表格列的隐藏控制，通过参数可控制数据列在表格中是否隐藏 | boolean | false | 1.0 |
| disabled | 使用自动表单时，该表单项是否可编辑 | boolean | '' | 1.0 |
| require | 使用自动表单时，对该表单项加* | boolean | '' | 1.0 |
| roles | 使用自动表单时，该表单项校验规则 | object[]  | '' | 1.0 |
| dataSource | 使用自动表单时，设置选择类组件的数据集合（如Select、Switch、Radio之类） | [EPsSourceDataSource[]](#epssourcedatasource) | [] | 1.0 | 
| defaultValue | 使用自动表单时，该表单项默认值 | object &#124; string &#124; number &#124; boolean | '' | 1.0 | 

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
|refreshTree | 在新增或删除操作后，是否刷新左侧树 | Boolean | false | 1.1 |
|labelColSpan | 设置自定义表单中标签的宽度,具体[参考设置](https://ant.design/components/form-cn/#Form) | number | 6 | 1.1 |
|enableBatchDelete | 是否使用批量删除 | Boolean | false | 1.2 |
|onAddClick | 新增时预处理 | (form: FormInstance) => void | - | 1.2 |
|onEditClick | 编辑弹框时预处理 | (form: FormInstance, data: Record<string, any>) => void | - | 1.2 |
|onSearchClick | 搜索弹框时预处理 | (form: FormInstance, store: EpsTableStore) => void | - | 1.2 |

### <span id="rowselection">rowSelection</span>
- 表格选择功能的配置,更多配置信息请参考[antd-table-rowSelection](https://ant.design/components/table-cn/#rowSelection)。

| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
| type | 多选/单选 | 'checkbox' &#124; 'radio' | 'radio' | 1.0 |
| onChange | 选中项发生变化时的回调 | function(selectedRowKeys, selectedRows) | - | 1.0 |

### <span id="menuprop">menuProp</span>
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


### <span id="customaction">CustomAction</span>
- 自定义功能区，用于对全局性操作的扩展（如新增、导入、报表等），一般已按钮的形式进行使用，也可以使用其他表单组件
- (tableStore: EpsTableStore, checkedRows: any[]) => React.FC | React.FC[]
  - tableStore: 组件实例使用的tableStore
  - checkedRows: 当表格开启可选择后， 所选中的表格行数据数组
- 使用

``` typescript
   const customAction = (store: EpsTableStore, checkedrows) => {
        return ([
            <EpsReportButton store={store} umid={umid} />,
            <EpsModalButton name="批量导入" title="批量导入" 
                width={1200}   
                useIframe={true}  
                url={'/xxx'}  icon={<ImportOutlined />}></EpsModalButton>
        ])
    }

    ...
    <EpsPanel ... customAction={customAction} />
```

### <span id="customtableaction">CustomTableAction</span>
- 自定义表格功能扩展区，基于表格行数据的扩展操作(如：编辑、详情查看、删除等), 统一使用圆角的图标按钮进行扩展
- (text, record, index, tableStore, checkedRows) => => React.FC | React.FC[]
  - text: 当前列对应的数据值
  - record: 当前行的数据
  - index: 当前行在表格中的索引值，从0开始
  - checkedRows: 当表格开启可选择后， 所选中的表格行数据数组
- 使用

``` typescript
    const customTableAction = (text, record, index, store) => {
        return ([
            <EpsModalButton noFoot={true} name="修改密码" 
                            title="修改密码"  
                            url="/xxx" 
                            isIcon={true}   width={500} />,
            <EpsModalButton key={'abc' + index} 
                            icon={<AuditOutlined />}  
                            noFoot={true} 
                            name="系统配置" 
                            url='/yyyy/zzz' 
                            title="系统配置" isIcon={true}   
                            width={500} />,
        ]);
    }

    ...
    <EpsPanel ... customTableAction={customTableAction} />
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



## 获取组件实例
- 由于业务场景需要，有时由于业务场景需要,要对组件实例及其属性进行操作（如：EpsTableStore、EpsTreeStore）,分三步进行操作
  - 定义```ref```属性
  ``` typescript
  import { useRef } from 'react';

  const CustomPage = observer((props) => {
    const ref = useRef();

    // 其他代码
    ...
  }
  ```
  - 绑定```ref```到组件上
  ``` typescript
  const CustomPage = observer((props) => {

      // 其他代码
      ...
      return (
        <EpsPanel {...epsProps}  ref={ref}/>
      )
    }
  ```
  - 在页面初始化完成后，对组件实例进行调用
   ``` typescript
    useEffect(() => {
      const tableStore = ref.current?.getTableStore();    // 获取tableStore实例
    }, []);
  ```
