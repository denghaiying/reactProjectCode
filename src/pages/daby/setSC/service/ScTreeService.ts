import { ITreeService } from '@/eps/commons/panel';
import BaseService from '@/eps/commons/v2/BaseService';

const treeData = [
  {
    title: '个人库',
    key: 'grk',
    children: [
      {
        title: '个人素材',
        key: '0',
      },
    ],
  },
  // {
  //   title: '公共库',
  //   key: 'ggk',
  //   children: [
  //     {
  //       title: '文本',
  //       key: '1'
  //     },
  //     {
  //       title: '图片',
  //       key: '2'
  //     },
  //     {
  //       title: '音频',
  //       key: '3'
  //     },
  //     {
  //       title: '视频',
  //       key: '4'
  //     },
  //   ],
  // },
];

class ScTreeService extends BaseService implements ITreeService {
  treeData = treeData;

  findTree(key: string, params?: Record<string, unknown> | undefined) {
    return Promise.resolve(treeData);
  }

  loadAsyncDataByKey(
    key: unknown,
    params?: Record<string, unknown> | undefined,
  ) {
    return Promise.resolve([]);
  }
}

export default new ScTreeService('/api/dabysc');
