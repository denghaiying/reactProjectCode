import {  Observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import TodoCount from './todo';
import { useState } from 'react';
let num=1;

class TabLayoutStore {
  title= 'Test';
  count=0;
  done=true;
  titleMobx="title";
  toggle() {
    this.done = !this.done;
  };
  constructor() {
    makeAutoObservable(this)
  }
  countAddChangeTitle(){
    const count=this.count+1;
    this.count=count;
    this.titleMobx=this.titleMobx+"#"+this.count;
    this.toggle();
  }
  
}
const todo = new TabLayoutStore();


const Todo = () => {
  const [info,setInfo]=useState({stateCount:1,stateTitle:"info"});

  const [singleStateCount,setSingleStateCount]=useState(0);
  const [singleStateTitle,setSingleStateTitle]=useState("infoTitle");
  //const [info,setInfo]=useState({singleStateCount:1});

  // const todo = useLocalObservable(() => ({
  //   title: 'Test',
  //   count:0,
  //   done: true,
  //   titleMobx:"title",
  //   toggle() {
  //     this.done = !this.done;
  //   },
  //   countAddChangeTitle(){
  //     const count=this.count+1;
  //     this.count=count;
  //     this.titleMobx=this.titleMobx+"#"+this.count;
  //     this.toggle();
  //   }
  // }));

  const sateChange=()=>{
    const item={};
    item.stateTitle=info.stateTitle=="info"?"warn":"info";
    const count=item.stateCount+=1;
    setInfo(count);
  }

  const changeStateTitle=()=>{
   
    info.stateTitle=info.stateTitle=="info"?"warn":"info";
   
    setInfo(info);
  }
  



  const  singleStateChange=async()=>{
    const count=await singleStateCount+1;
    setSingleStateCount(count);
    setSingleStateTitle(singleStateTitle + "#"+ singleStateCount);
 
  }



  num += 1;
  console.log("num:",num)
  
  return (
    <Observer>
      {() => (
        <>
          <span>界面刷新次数:{num}</span>
          <br/>
          <TodoCount todoCount={todo.count} stateCount={info.stateCount} singleStateCount={singleStateCount} />
          <br/>
         
         
          <br/>
          <span onClick={()=>todo.countAddChangeTitle()}>addChangeTitle||{todo.titleMobx}</span>（mobx值无延迟
          <h1 onClick={todo.toggle}>
            {todo.title} {todo.done ? '[DONE]' : '[TODO]'}-点击后子组件div不会刷新
          </h1>
          <br/>
           
            <br/>
            <br/>
            <span onClick={()=>{todo.count+=1}}>clickMobxCount</span>
            <br/>
            <span onClick={()=>sateChange()}>clickState||{info.stateTitle}</span>
            <br/>
            <span onClick={()=>changeStateTitle()}>clickStateTitle||{info.stateTitle}</span>
          <br/>
          <span onClick={()=>singleStateChange()}>clickSingleState||{singleStateTitle}</span>（state值有延迟
          <br/>
          <br/>
         
        </>
      )}
    </Observer>
  );
};

export default Todo;
