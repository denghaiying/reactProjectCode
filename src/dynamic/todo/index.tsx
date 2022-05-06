

const EpsComponentLoader = (params,modalVisit,props) =>{
  const Component = dynamic({
    async loader () {
      if(props.url=== "/sys/params/systemConf"){
        const { default: Comp1 } = await import(ComponentsMap[props.url] || "@/components/sys/params/systemConf");
        return Comp1;
      }
      // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
      
    },
  })
  return(
   <Component params={params} modalVisit={modalVisit} store={props.store}/>
  )
}

export default EpsComponentLoader;
