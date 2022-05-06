import { observer } from 'mobx-react';
import LoginFormComp from './loginFormComp.jsx';
import './loginFormR.less';
const Kfjd = observer((props) => {
  const title = '电子阅览室管理系统';
  //const backgroundUrl="/public/assets/img/bg_dianziyuelanshi.png";

  return <LoginFormComp title={title} location={props.location} />;
});

export default Kfjd;
