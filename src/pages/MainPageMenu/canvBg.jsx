/* eslint-disable no-multi-assign */
/* eslint-disable react/no-find-dom-node */
import React, { useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';

const CanvBg = props => {
  const ref = useRef(null);

  const num = 200;
  let w = window.innerWidth;
  let h = window.innerHeight;
  const max = 100;
  const _x = 0;
  const _y = 0;
  const _z = 150;

  let varr = [];
  let dist = [];
  let calc = [];
  let vel = 0.04;
  let lim = 360;
  let diff = 200;
  let initPos = 100;
  let toX = _x;
  let toY = _y;
  let rotObj = {};
  let objSz = {};

  useEffect(() => {
    const canvas = findDOMNode(ref.current);
    //  const con = canvas.parentNode;
    //  w = con.innerWidth;
    //  h = con.innerHeight;

    go();
    anim();

    window.addEventListener('mousemove', e => {
      toX = (e.clientX - canvas.width / 2) * -0.8;
      toY = (e.clientY - canvas.height / 2) * 0.8;
    });
    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
      toX = (e.touches[0].clientX - canvas.width / 2) * -0.8;
      toY = (e.touches[0].clientY - canvas.height / 2) * 0.8;
    });
    window.addEventListener('mousedown', () => {
      for (let i = 0; i < 100; i++) {
        add();
      }
    });
    window.addEventListener('touchstart', e => {
      e.preventDefault();
      for (let i = 0; i < 100; i++) {
        add();
      }
    });
    window.addEventListener('resize', () => {
      canvas.width = w = window.innerWidth;
      canvas.height = h = window.innerHeight;
    }, false);

    return (() => {
      window.removeEventListener('mousemove', e => {
        toX = (e.clientX - canvas.width / 2) * -0.8;
        toY = (e.clientY - canvas.height / 2) * 0.8;
      });
      window.removeEventListener('touchmove', (e) => {
        e.preventDefault();
        toX = (e.touches[0].clientX - canvas.width / 2) * -0.8;
        toY = (e.touches[0].clientY - canvas.height / 2) * 0.8;
      });
      window.removeEventListener('mousedown', () => {
        for (let i = 0; i < 100; i++) {
          add();
        }
      });
      window.removeEventListener('touchstart', e => {
        e.preventDefault();
        for (let i = 0; i < 100; i++) {
          add();
        }
      });
      window.removeEventListener('resize', () => {
        canvas.width = w = window.innerWidth;
        canvas.height = h = window.innerHeight;
      }, false);
    });
  }, []);

  const dtr = (d) => {
    return d * Math.PI / 180;
  };

  const rnd = () => {
    return Math.sin(Math.floor(Math.random() * 360) * Math.PI / 180);
  };

  const distf = (p1, p2, p3) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
  };

  const cam = {
    obj: {
      x: _x,
      y: _y,
      z: _z,
    },
    dest: {
      x: 0,
      y: 0,
      z: 1,
    },
    dist: {
      x: 0,
      y: 0,
      z: 200,
    },
    ang: {
      cplane: 0,
      splane: 0,
      ctheta: 0,
      stheta: 0,
    },
    zoom: 1,
    disp: {
      x: w / 2,
      y: h / 2,
      z: 0,
    },
    upd: () => {
      cam.dist.x = cam.dest.x - cam.obj.x;
      cam.dist.y = cam.dest.y - cam.obj.y;
      cam.dist.z = cam.dest.z - cam.obj.z;
      cam.ang.cplane = -cam.dist.z / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
      cam.ang.splane = cam.dist.x / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
      cam.ang.ctheta = Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z) / Math.sqrt(cam
        .dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
      cam.ang.stheta = -cam.dist.y / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam
        .dist.z * cam.dist.z);
    },
  };

  const trans = {
    parts: {
      sz: (p, sz) => {
        return {
          x: p.x * sz.x,
          y: p.y * sz.y,
          z: p.z * sz.z,
        };
      },
      rot: {
        x: (p, rot) => ({
          x: p.x,
          y: p.y * Math.cos(dtr(rot.x)) - p.z * Math.sin(dtr(rot.x)),
          z: p.y * Math.sin(dtr(rot.x)) + p.z * Math.cos(dtr(rot.x)),
        }),
        y: (p, rot) => ({
          x: p.x * Math.cos(dtr(rot.y)) + p.z * Math.sin(dtr(rot.y)),
          y: p.y,
          z: -p.x * Math.sin(dtr(rot.y)) + p.z * Math.cos(dtr(rot.y)),
        }),
        z: (p, rot) => ({
          x: p.x * Math.cos(dtr(rot.z)) - p.y * Math.sin(dtr(rot.z)),
          y: p.x * Math.sin(dtr(rot.z)) + p.y * Math.cos(dtr(rot.z)),
          z: p.z,
        }),
      },
      pos: (p, pos) => ({
        x: p.x + pos.x,
        y: p.y + pos.y,
        z: p.z + pos.z,
      }),
    },
    pov: {
      plane: (p) => ({
        x: p.x * cam.ang.cplane + p.z * cam.ang.splane,
        y: p.y,
        z: p.x * -cam.ang.splane + p.z * cam.ang.cplane,
      }),
      theta: (p) => ({
        x: p.x,
        y: p.y * cam.ang.ctheta - p.z * cam.ang.stheta,
        z: p.y * cam.ang.stheta + p.z * cam.ang.ctheta,
      }),
      set: (p) => ({
        x: p.x - cam.obj.x,
        y: p.y - cam.obj.y,
        z: p.z - cam.obj.z,
      }),
    },
    persp: (p) => ({
      x: p.x * cam.dist.z / p.z * cam.zoom,
      y: p.y * cam.dist.z / p.z * cam.zoom,
      z: p.z * cam.zoom,
      p: cam.dist.z / p.z,
    }),
    disp: (p, disp) => ({
      x: p.x + disp.x,
      y: -p.y + disp.y,
      z: p.z + disp.z,
      p: p.p,
    }),
    steps: (_obj_, sz, rot, pos, disp) => {
      // eslint-disable-next-line no-underscore-dangle
      let _args = trans.parts.sz(_obj_, sz);
      _args = trans.parts.rot.x(_args, rot);
      _args = trans.parts.rot.y(_args, rot);
      _args = trans.parts.rot.z(_args, rot);
      _args = trans.parts.pos(_args, pos);
      _args = trans.pov.plane(_args);
      _args = trans.pov.theta(_args);
      _args = trans.pov.set(_args);
      _args = trans.persp(_args);
      _args = trans.disp(_args, disp);
      return _args;
    },
  };

  class ThreeD {
    constructor(param) {
      this.transIn = {};
      this.transOut = {};
      this.transIn.vtx = (param.vtx);
      this.transIn.sz = (param.sz);
      this.transIn.rot = (param.rot);
      this.transIn.pos = (param.pos);
    }
    reset = (pos, rot, sz) => {
      this.transIn.pos = pos;
      this.transIn.rot = rot;
      this.transIn.sz = sz;
    }
    // eslint-disable-next-line no-unused-vars
    vupd = () => {
      this.transOut = trans.steps(this.transIn.vtx, this.transIn.sz, this.transIn.rot, this.transIn.pos, cam.disp);
    }
  }

  const go = () => {
    const canvas = findDOMNode(ref.current);
    // const con = canvas.parentNode;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    varr = [];
    dist = [];
    calc = [];
    for (let i = 0, len = num; i < len; i++) {
      add();
    }
    rotObj = {
      x: 0,
      y: 0,
      z: 0,
    };
    objSz = {
      x: canvas.width / 5,
      y: canvas.height / 5,
      z: canvas.width / 5,
    };
  };

  const add = () => {
    varr.push(new ThreeD({
      vtx: {
        x: rnd(),
        y: rnd(),
        z: rnd(),
      },
      sz: {
        x: 0,
        y: 0,
        z: 0,
      },
      rot: {
        x: 20,
        y: -20,
        z: 0,
      },
      pos: {
        x: diff * Math.sin(360 * Math.random() * Math.PI / 180),
        y: diff * Math.sin(360 * Math.random() * Math.PI / 180),
        z: diff * Math.sin(360 * Math.random() * Math.PI / 180),
      },
    }));
    calc.push({
      x: 360 * Math.random(),
      y: 360 * Math.random(),
      z: 360 * Math.random(),
    });
  };

  const upd = () => {
    cam.obj.x += (toX - cam.obj.x) * 0.05;
    cam.obj.y += (toY - cam.obj.y) * 0.05;
  };

  const draw = () => {
    const canvas = findDOMNode(ref.current);
    if (!canvas) { return; }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cam.upd();
    rotObj.x += 0.1;
    rotObj.y += 0.1;
    rotObj.z += 0.1;
    for (let i = 0; i < varr.length; i++) {
      for (const val in calc[i]) {
        // eslint-disable-next-line no-restricted-syntax
        // if (calc[i].hasOwnProperty(val)) {
        calc[i][val] += vel;
        if (calc[i][val] > lim) calc[i][val] = 0;
        // }
      }
      varr[i].reset({
        x: diff * Math.cos(calc[i].x * Math.PI / 180),
        y: diff * Math.sin(calc[i].y * Math.PI / 180),
        z: diff * Math.sin(calc[i].z * Math.PI / 180),
      }, rotObj, objSz);
      varr[i].vupd();
      // eslint-disable-next-line no-continue
      if (varr[i].transOut.p < 0) continue;
      const g = ctx.createRadialGradient(varr[i].transOut.x, varr[i].transOut.y, varr[i].transOut.p,
        varr[i].transOut.x, varr[i].transOut.y, varr[i].transOut.p * 2);
      ctx.globalCompositeOperation = 'lighter';
      g.addColorStop(0, 'hsla(255, 255%, 255%, 1)');
      g.addColorStop(0.5, `hsla(${i + 2},85%, 40%,1)`);
      g.addColorStop(1, `hsla(${i},85%, 40%,.5)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(varr[i].transOut.x, varr[i].transOut.y, varr[i].transOut.p * 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
  };
  const anim = () => {
    const requestAnimationFrame = (callback) => {
      setTimeout(callback, 1000 / 60);
    };
    const anim2 = function () {
      upd();
      draw();
      requestAnimationFrame(anim2);
    };
    requestAnimationFrame(anim2);
  };

  return (<canvas ref={ref} />
  );
};

export default CanvBg;
