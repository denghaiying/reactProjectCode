import './index.less'
import {observer} from "mobx-react";


interface IProp
{
  title: string;
  intro: string;
  background:string;
}

const Card1 = observer((props: IProp) => {

  return (
    <div className="card1" style={{background: props.background}}>
      <div className="title-row">
        <div className="line"></div>
        <span className="title">{props.title}</span>
        <div className="line"></div>
      </div>
      <div className="intro">{props.intro}</div>
    </div>
  );
});

export default Card1;


