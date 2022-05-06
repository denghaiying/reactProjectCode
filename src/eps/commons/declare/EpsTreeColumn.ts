
 class TreeColumn{
    title: string;
    key: string;
    isLeaf?: boolean;
    children?: TreeColumn[];
  
    constructor(title: string, key: string, children: TreeColumn[] = [], isLeaf:boolean = false){
      this.title = title;
      this.key = key;
      this.isLeaf = isLeaf;
      this.children = children;
    }
}

export { TreeColumn }
