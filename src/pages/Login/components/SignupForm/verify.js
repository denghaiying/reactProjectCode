import React, { useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';

const GVerify = props => {
  const { type, id, getIdentifyValue, ...oprops } = props;
  const NumArr = '0,1,2,3,4,5,6,7,8,9'.split(',');
  const LetterArr = 'a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
  const ref = useRef(null);
  useEffect(() => {
    refresh();
  }, [id]);


  /** 生成一个随机数* */
  const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /** 生成一个随机色* */
  const randomColor = (min, max) => {
    const r = randomNum(min, max);
    const g = randomNum(min, max);
    const b = randomNum(min, max);
    return `rgb(${r},${g},${b})`;
  };

  const refresh = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const canvas = findDOMNode(ref.current);
    if (!canvas.getContext) {
      return;
    }
    const con = canvas.parentNode;
    const width = con.offsetWidth > 0 ? con.offsetWidth : '100';
    const height = con.offsetHeight > 0 ? con.offsetHeight : '30';
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'middle';

    ctx.fillStyle = randomColor(180, 240);
    ctx.fillRect(0, 0, width, height);
    let txtArr = [];
    if (type === 'blend') { // 判断验证码类型
      txtArr = NumArr.concat(LetterArr);
    } else if (type === 'number') {
      txtArr = NumArr;
    } else {
      txtArr = LetterArr;
    }
    let v = '';
    for (let i = 1; i <= 4; i++) {
      const txt = txtArr[randomNum(0, txtArr.length)];
      v += txt;
      ctx.font = `${randomNum(height / 2, height)}px SimHei`; // 随机生成字体大小
      ctx.fillStyle = randomColor(50, 160); // 随机生成字体颜色
      ctx.shadowOffsetX = randomNum(-3, 3);
      ctx.shadowOffsetY = randomNum(-3, 3);
      ctx.shadowBlur = randomNum(-3, 3);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      const x = width / 5 * i;
      const y = height / 2;
      const deg = randomNum(-30, 30);
      /** 设置旋转角度和坐标原点* */
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(txt, 0, 0);
      /** 恢复旋转角度和坐标原点* */
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    }
    /** 绘制干扰线* */
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = randomColor(40, 180);
      ctx.beginPath();
      ctx.moveTo(randomNum(0, width), randomNum(0, height));
      ctx.lineTo(randomNum(0, width), randomNum(0, height));
      ctx.stroke();
    }
    /** 绘制干扰点* */
    for (let i = 0; i < width / 4; i++) {
      ctx.fillStyle = randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    getIdentifyValue(v);
  };

  return (<canvas
    ref={ref}
    onClick={() => {
      refresh();
    }}
    style={{ cursor: 'pointer' }}
    {...oprops}
  />);
};

GVerify.defaultProps = {
  type: 'number', // 图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
};

export default GVerify;
