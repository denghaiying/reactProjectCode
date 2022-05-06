import { observer } from 'mobx-react';
import Fwstart from './Fwstart copy';

/**
 * 发文
 */
const Fw = observer((props) => {
  return (
    <div>
      <Fwstart {...props} />
    </div>
  );
});
export default Fw;
