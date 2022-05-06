import React from 'react';
import style from './index.less';
import Header from '@/components/header';
import LeftMenu from '@/components/leftMenu';
import Technology from '@/components/technology';

class Detail extends React.Component {
  state = {
    article: `
    <p>一体机出证能够将所有馆藏民生直接出证，通过对身份证读取和指纹或者人脸识 别比对后完成自动出证的操作。身证阅读器、指纹仪、人脸识别等硬件模块，
    能够对身份证直接读取，并将指纹对比确认为本人后完成出证的过程。 证不支持指纹，系统可以进行人脸识别功能，确 保是本人出证。</p>
    <p>一体机出证能够将所有馆藏民生直接出证，通过对身份证读取和指纹或者人脸识 别比对后完成自动出证的操作。身证阅读器、指纹仪、人脸识别等硬件模块，
    能够对身份证直接读取，并将指纹对比确认为本人后完成出证的过程。 证不支持指纹，系统可以进行人脸识别功能，确 保是本人出证。</p>
    <p>一体机出证能够将所有馆藏民生直接出证，通过对身份证读取和指纹或者人脸识 别比对后完成自动出证的操作。身证阅读器、指纹仪、人脸识别等硬件模块，
    能够对身份证直接读取，并将指纹对比确认为本人后完成出证的过程。 证不支持指纹，系统可以进行人脸识别功能，确 保是本人出证。</p>`,
  };

  componentDidMount() {
    console.log(this.props.location.query);
  }

  render() {
    return (
      <div className={`${style['detail-content']}`}>
        <Header />
        <div className={`${style['detail-body']}`}>
          <LeftMenu />
          <div className={`${style['detail-table']}`}>
            <div className={`${style['title']}`}>单位介绍单位介绍标题</div>
            <div className={`${style['banner']}`}>
              <img src="" alt="图片区域,暂无没放" />
            </div>
            <div
              className={`${style['rich-content']}`}
              dangerouslySetInnerHTML={{ __html: this.state.article }}
            />
          </div>
        </div>
        <Technology />
      </div>
    );
  }
}
export default Detail;
