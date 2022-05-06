## 组件介绍
- 该组件是个功能性组件，表现形式为按钮，点击后可以通过弹出模态框的形式打开指定路径下的组件或者url地址，一般用于 customAction或customTableAction中，用于打开扩展功能使用.

## 使用
- 该组件主要用于布局组件中的```customAction```和```customTableAction```中
- 调用方式
``` typescript
const customAction = (store: EpsTableStore) => {
    return ([
            <EpsModalButton 
            name="XXX" 
            title="XXX" 
            url="YYYY"
            width={1200} 
            store={store}  
            useIframe={true}  
            icon={<ControlTwoTone />}/>

    ])
}
```
- 

## 配置项（EpsModalButtonProps）
| 配置属性 | 描述 |类型 | 默认值 |版本 |
|:----|:----|:----|:----|:----|
|name | 按钮上显示的文字 | string | null | 1.0 | 
|store | 表格使用的[TableStore](/doc/eps9/components/EpsPanel.md#tablestore) | EpsTableStore | false | 1.0 | 
|title | 弹出的对话框标题 |  ReactNode  | false | 1.0 | 
|url | 组件位于```@/components/```下的路径，如果指定```useIframe```为true,则为完整的url地址 | string | false | 1.0 | 
|type | 按钮类型，参考antd的[Button](https://ant.design/components/button-cn/#API)组件 | primary &#124; ghost &#124; dashed &#124; link &#124; text &#124; default | 'default' | 1.0 | 
|icon | 按钮使用的图标 | ReactNode | <AlignCenterOutlined /> | 1.0 |
|isIcon | 是否是图标按钮，一般情况不用设置, 当组件使用在customTableAction中时，需设置为true | Boolean | false | 1.0 |
|params | 页面参数，传递给url对应的组件  | object | {} | 1.0 |
|hidden | 是否隐藏该组件 | Boolean | false | 1.0 |
|width | 弹出的模块对话框的宽度 | number | 800 | 1.0 |
|height | 弹出的模块对话框的宽度 | number | window.innerHeight - 300 | 1.0 |
|useIframe | 是否使用iframe，一般用于打开外部链接地址,和```url```参数一起使用 | Boolean | false | 1.0 |
|noFoot | 隐藏弹出对话框底部按钮 | Boolean | false | 1.0 |
|beforeOpen | 打开对话框前的判断，参数为设置的参数，返回boolean数据，如果为true，则正常打开弹框，否则不打开弹框 | (value) => boolean | null | 1.0 |

## 注册组件 v1.1
- 针对在antd pro+umijs环境下，页面每分钟会刷新一次的问题，对```EpsModalButton```进行了使用调整
- 当url为功能组件时（也就是不使用iframe打开），需在系统中，进行配置，通过url指定具体的组件,配置文件为: ```@/components/loader/index.tsx```
```typescript
const getEpsComponent = (props) =>{
  const EpsComponent = dynamic({
    async loader () {
      if(props.url=== "/sys/params/systemConf"){
        const { default: Comp1 } = await import("@/components/sys/params/systemConf");
        return Comp1;
      }
      // 在该位置判断url并返回对应的组件
      return <></>
    },
  })
  return(
   <EpsComponent params={props.params} modalVisit={props.modalVisit} store={props.store}/>
  )
}

```