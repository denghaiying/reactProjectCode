import './index.less';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import React from 'react';

interface IProp {
  list: [];
}

const ProjectPanelList = observer((props: IProp) => {
  return (
    <div className="panel-list">
      {props.list.map((item, index) => (
        <Link
          key={index}
          className="panel-item"
          to={{
            pathname: `/runRfunc/displaydetail`,
            state: { id: item.id },
          }}
        >
          <div className="left">

            {/*<img src={require('../../assets/img/carousel-img.png')} alt=""></img>*/}
            <div className="imgdiv"><img src={'data:image/png;base64,' + item.imgStr} /></div>
            {/*<div className="text">为了避免高峰期人流大、时间过长等事情的发生，商务部分门张开张工作会议</div>*/}
            <div className="bottom">
              <span style={{ marginRight: 30 }}>{item.author}</span>
              <span>{item.whsj}</span>
            </div>
          </div>
          <div className="title">{item.title}</div>
        </Link>
      ))}
    </div>
  );
});




export default ProjectPanelList;
