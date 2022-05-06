# 开发规范
本文主要介绍Eps9.0在开发过程中,需注意的相关事项，不涉及对界面布局和控制

## 技术选型
1. React,[中文文档](https://react.docschina.org/)
2. 使用版本为: ```17.0.0+```
3. 使用[Hooks](https://react.docschina.org/docs/hooks-intro.html)组件,不再使用class来编写组件.
4. 使用[mobx](https://zh.mobx.js.org/README.html)中的 ```useLocalStore```或 Hooks的```useState```进行页面的状态管理,由于传统Store在使用过程中有时会存在一轮的数据渲染延迟，不推荐使用。
5. 视图组件使用[antd](https://ant.design/index-cn)和[antd Pro](https://pro.ant.design/zh-CN/),现阶段不适用其他第三方视图组件进行开发。
6. 对于频繁使用的布局类组件应使用已公布的[基础组件](../index.md),如果没有所需布局的，可联系基础组件开发小组进行统一开发，或向基础组件开发小组提出申请后，自己先行开发， 后期由开发小组将代码提取为基础组件.
7. 在处理ajax提交参数时，需要进行参数的转换或格式化的，使用```qs```库，已集成到```dev-ant```分支中，可直接使用.
8. 日期库优先使用```dayjs```，在实在不能满足需求的情况下再使用```moment```库，已集成到```dev-ant```分支中，可直接使用.

## 使用要求
1. 所有的页面均放置于```@/pages/```下，根据 模块、页面的顺序依次创建目录后，在页面目录中放置页面及相关文件。
2. 所有被```EpsModalButton```调用的功能组件放置于```@/components/```下，根据 模块、页面的顺序依次创建目录后，在页面目录中放置组件页面及相关文件
3. 在业务过程中，如果页面数值发生变换后需进行其他操作，应使用```useEffect```，减少使用回调函数,如：
```typescript
// 实例使用
const PageOne = observer((props) => {
    // tableStore
    const tableStore = useLocalStore(() => {
        // xxxx
    })

    // 监听状态，如page或size发生变化时，则调用findByKey方法
    useEffect(() => {
        tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, tableStore.params);
    }, [tableStore.page, tableStore.size])

    // 页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
    const onPageSizeChange = (page,size) => {
        (page != tableStore.page) && (tableStore.page = page);
        (size !== tableStore.size) && (tableStore.size = size);
    }

    return (
         <Table columns={columns} dataSource={tableStore.tableList} bordered scroll={{ x: 1600 }} pagination={{
            showQuickJumper: true, 
            showSizeChanger: true, 
            defaultCurrent: tableStore.page, 
            defaultPageSize: tableStore.size, 
            pageSize: tableStore.size, 
            current: tableStore.page, 
            showTotal: (total, range) => `共 ${total} 条数据`,
            onChange: onPageSizeChange,
            total: tableStore.total}}
            loading={tableStore.loading} />
    )
})
```
参考页面```@/eps/components/panel/EpsPanel2/EpsPanel.tsx```

4. 为提高页面加载效率，新增、编辑框中的初始化数据（如：Select的Options）应在点击‘新增’或‘修改’时再进行查询，对应事件为[```onAddClick```](http://www.dasaas.com:18890/eps9/eps9.1-ui/-/blob/dev-ant/doc/eps9/components/EpsPanel.md#itable)和[```onEditClick```](http://www.dasaas.com:18890/eps9/eps9.1-ui/-/blob/dev-ant/doc/eps9/components/EpsPanel.md#itable)

参考页面``````

5. 为方便代码维护，原则上，每个独立的功能（通过点击按钮触发的弹框、路由跳转等）进行独立开发，页面放置于主页面所在的目录中

6. 每个页面用的Service不与其他页面共用，放在当前页面的service目录中,与后台进行交互的请求操作统一写到Service中,以便维护

7. 
