import React from 'react';
import { Pagination } from 'antd';
import { history } from 'umi';
import Header from '../components/header';
import Technology from '../components/technology';
import LeftMenu from '../components/leftMenu';
import style from './index.less';

class List extends React.Component {
  state = {
    // 每一页最多18条，否则会出现滚动条
    lists: [
      {
        id: 1,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 2,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 3,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 4,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 5,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 6,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 7,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 8,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 9,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
      {
        id: 10,
        title:
          '一体机出证能够将所有馆藏民生一体机出证能够将所有馆藏民生直接出证识别比对后完',
        time: '2021-12-9',
      },
    ],
  };

  jump(item) {
    history.push(`/runRfunc/detail?id=${item.id}`);
  }

  renderInfo() {
    const { lists } = this.state;
    return lists.map((item) => {
      return (
        <div
          className={`${style['common-line']}`}
          key={item.id}
          onClick={this.jump.bind(this, item)}
        >
          <div className={`${style['det']}`}>
            <div className={`${style['name']}`}>{item.title}</div>
            <div className={`${style['time']}`}>{item.time}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={`${style['list-content']}`}>
        <Header />
        <div className={`${style['list-body']}`}>
          <LeftMenu />
          <div className={`${style['list-table']}`}>
            <div className={`${style['title']}`}>公示公告</div>
            <div className={`${style['info']}`}>{this.renderInfo()}</div>
            <div className={`${style['pagination']}`}>
              <Pagination defaultCurrent={1} total={50} />
              <span className={`${style['total']}`}>共50页</span>
            </div>
          </div>
        </div>
        <Technology />
      </div>
    );
  }
}
export default List;
