export type Member = {
  avatar: string;
  filename: string;
  id: string;
};

export type BasicListItemDataType = {
  // id: string;
  // owner: string;
  // title: string;
  // avatar: string;
  // cover: string;
  // status: 'normal' | 'exception' | 'active' | 'success';
  // percent: number;
  // logo: string;
  // href: string;
  // body?: any;
  // updatedAt: number;
  // createdAt: number;
  // subDescription: string;
  // description: string;
  // activeUser: number;
  // newUser: number;
  // star: number;
  // like: number;
  // message: number;
  // content: string;
  // members: Member[];

  id: string;
  whr: string;
  title: string;
  avatar: string;
  whrid: string;
  whsj: string;
  desc: string;
  fzpsid: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
};
