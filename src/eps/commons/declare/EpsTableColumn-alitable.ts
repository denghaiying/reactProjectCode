// 表格列
class TableColumn {
  constructor(
    dataIndex: string = '',
    title: string,
    align: string = 'left',
    render: Function = (text?, record?, index?) => text,
    width: number | string | undefined,
    ellipsis: boolean = true,
    fixed: boolean | string = false,
  ) {
    this.dataIndex = dataIndex;
    this.title = title;
    this.align = align;
    this.width = width;
    this.render = render;
    this.key = dataIndex;
    this.ellipsis = ellipsis;
    this.fixed = fixed;
  }

  dataIndex?: string;
  title: string;
  align: string;
  render: Function;
  key: string;
  width: number | string | undefined;
  ellipsis: boolean;
  fixed: boolean | string;
}

export { TableColumn };
