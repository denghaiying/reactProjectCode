// 表格列
class TableColumn {
  constructor(
    code: string = '',
    title: string,
    align: string = 'left',
    render: Function = (text?, record?, index?) => text,
    width: number | string | undefined,
    ellipsis: boolean = true,
    fixed: boolean | string = false,
  ) {
    this.code = code;
    this.title = title;
    this.align = align;
    this.width = width;
    this.render = render;
    this.key = code;
    this.ellipsis = ellipsis;
    this.fixed = fixed;
  }

  code?: string;
  title: string;
  align: string;
  render: Function;
  key: string;
  width: number | string | undefined;
  ellipsis: boolean;
  fixed: boolean | string;
}

export { TableColumn };
