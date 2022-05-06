import './index.less'
import {observer} from "mobx-react";
import { Link } from 'react-router-dom'


interface IProp
{
  list: [];

}

const PanelList = observer((props: IProp) => {


  return (
    <div className="panel-list">
      {
        props.list.map((item, index) => (
          <Link key={index} className="panel-item"
          to={
            {
              pathname:`/runRfunc/messagedetail`,
              state:{id:item.id}
            }
          }
          //to="/runRfunc/messagedetail?id={item.id}"
          >
            <div className="left">
              <div className="title">{item.title}</div>
              { item.whsj ? <div className="time">{item.whsj}</div> : '' }
            </div>
            {/*<img src={item.img} alt="" style={{height: 50, width: 40}}></img>*/}
          </Link>        ))
      }
    </div>
  );
});

export default PanelList;
