import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import './identify.less';

const VCode = observer(props => {
  const { intl: { formatMessage } } = props;

  const getRandom = (max, min, num) => {
    // eslint-disable-next-line no-bitwise
    const asciiNum = ~~(Math.random() * (max - min + 1) + min);
    if (!num) {
      return asciiNum;
    }
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(getRandom(max, min));
    }
    return arr;
  };

  const [data, setData] = useState(getRandom(9, 0, 4));
  const [rotate, setRotate] = useState(getRandom(75, -75, 4));
  const [fz, setFz] = useState(getRandom(16, 30, 4));
  const [color, setColor] = useState([getRandom(100, 255, 3), getRandom(100, 255, 4), getRandom(100, 255, 3), getRandom(100, 255, 3)]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const v = getRandom(9, 0, 4);
    setData(v);
    canvas();
    props.getIdentifyValue(v);
  }, []);

  const canvas = () => {
    const c = document.getElementById('bgi');
    const ctx = c.getContext('2d');
    c.height = c.height;
    // ctx.clearRect(0, 0, canvas.width(), canvas.height())
    ctx.strokeStyle = `rgb(${getRandom(100, 10, 3).toString()})`;
    for (let i = 0; i < 7; i++) {
      ctx.lineTo(getRandom(200, 0), getRandom(200, 10));
      ctx.moveTo(getRandom(200, 0), getRandom(200, 0));
      ctx.stroke();
    }
  };

  const initState = () => {
    const v = getRandom(9, 0, 4);
    setData(v);
    setRotate(getRandom(75, -75, 4));
    setFz(getRandom(16, 30, 4));
    setColor([getRandom(100, 255, 3), getRandom(100, 255, 4), getRandom(100, 255, 3), getRandom(100, 255, 3)]);
    props.getIdentifyValue(v);
  };

  return (
    <div className="vcodewrap">
      <canvas id="bgi" width="200" height="200" />
      {data.map((v, i) =>
        (
          <div
            key={i}
            className="itemStr"
            style={{
              transform: `rotate(${rotate[i]}deg)`,
              fontSize: `${fz[i]}px`,
              color: `rgb(${color[i].toString()})`,
            }}
            onMouseEnter={() => setRefresh(true)}
          >
            {v}
          </div>
        )
      )}
      {
        refresh ?
          <div
            className="mask"
            onClick={() => {
              initState();
              setRefresh(false);
              canvas();
            }}
            onMouseLeave={() => { setRefresh(false); }}
          >
            {formatMessage({ id: 'e9.info.vscode.refresh' })}
          </div>
          : null}
    </div>
  );
});

export default injectIntl(VCode);
