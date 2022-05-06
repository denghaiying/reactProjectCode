### 2021-07-21
- 修复左侧树只显示两层数据的问题
- ITable中新增属性```refreshTree```，用于控制在新增或删除操作后，是否刷新左侧树的数据
- 在表格类布局上，当开启多行选择后，可对所选数据进行批量删除
- 新增表格上基于自动表单的双击查看功能
- 新增复制基础组件

### 2021-07-23
- ITable中新增属性```enableBatchDelete```，用于判断是否启用批量删除
- ITable中新增方法```onAddClick```,用于控制```新增```操作时，点击按钮后对数据或表单的预处理操作
- ITable中新增方法```onEditClick```,用于控制```修改```操作时，点击按钮后对数据或表单的预处理操作
- ITable中新增方法```onSearchClick```,用于控制```高级搜索```操作时，点击按钮后对数据或表单的预处理操作
- 修复选择行数据后，customTableAction 中不能正常获取对应数据的问题

### 2021-08-12
- EpsModalButton 增加申明配置，以解决在AntD Pro环境下每分钟刷新一次的问题
- EpsPanel2 、 EpsPanel新增删除内容描述，如不设置则默认为```数据删除后将无法恢复，请谨慎操作```

### 2021-08-18
- 修复```EpsPanel2```中，```initParams```设置后不生效的问题
- 新增```ITable```配置树型```labelColSpan```，用于设置```customForm```的标签宽度，配置信息参考[```Form```](https://ant.design/components/form-cn/#Form)的```labelCol```

### 2021-08-19
- 新增 ```EpsAddButton```控制属性```addReadonly```属性，可对 EpsAddButton 进行 激活/禁用的控制
- 新增```EpsAddButton```在点击```onAddClick(form)```事件中，可返回布尔值类型控制是否打开弹框(true:弹框,false: 不弹框)
- 新增 ```EpsPanel```中，```EpsSource```对表格列的隐藏控制，通过参数可控制数据列在表格中是否隐藏。

### 2021-08-26
- 新增 ```EpsPanel```中，```treeParams```属性，用于设置左侧树初始化属性配置

### 2021-09-02
- 新增 ```EpsPanel```中，在进行删除操作时，可预处理业务逻辑，只有返回true时才继续执行后续操作
