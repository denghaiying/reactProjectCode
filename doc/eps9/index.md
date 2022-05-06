# Eps9.1前端使用说明
## 技术储备
 -  [ES6](https://es6.ruanyifeng.com/) ,开发语言，需熟练掌握
 - [ReactJS](https://react.docschina.org/) ，视图组件，需熟练掌握
 - [React-Hook](https://react.docschina.org/docs/hooks-intro.html) ，使用React的函数式写法，需熟练掌握
 - [TypeScript](https://www.tslang.cn/docs/home.html)，定义开发约束和规范，需掌握
 - [NodeJS](https://nodejs.org/zh-cn/),开发环境， 建议安装14以上版本

## 开发约定
  - 统一使用typescript来编写页面及组件
  - 每个独立功能应提取为单独的组件，放置于当前调用页面的目录下
  - 编写功能组件时，将组件放置于 ```@/components```下，并在该目录下找对应模块，以及对应页面的文件夹中
  - 在编写页面时，在需要进行弹框操作的时候，应注意弹出的对话框大小，不要超过浏览器大小，对话框本身不要出现横向或纵向滚动条
  - 在调用组件时，被调用的组件如有初始化数据，请在调用事件中进行树的初始化

## 组件使用
1. 布局类 
  - 左树右表格([EpsPanel](./components/EpsPanel.md))
  - 纯表格 ([EpsPanel](./components/EpsPanel3.md))
  - 主从式布局（上下结构）[EpsRecordPanel](./components/EpsRecordPanel.md)
2. 功能类
  - 弹框按钮 [EpsModalButton](./components/EpsModalButton.md)
  - ~~表单按钮~~ [](./components/EpsModalButton.md)
3. 业务类
  - 档案管理菜单开发[ArchMenu](./arch/ArchMenu.md)

## 前端规范
1. 开发规范
  - [开发规范](./rules/dev.md)
2. 布局规范
  - [布局规范](./rules/layout.md)
3. 代码提交规范
  - [代码提交规范](./rules/commit.md)
## 变更记录
- [更新记录](./components/changelist.md)

