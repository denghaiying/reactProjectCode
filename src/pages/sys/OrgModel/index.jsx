import React, {useEffect} from 'react';
import { Transfer, Switch, Table, Tag ,Tree } from 'antd';
import difference from 'lodash/difference';
import {observer} from "mobx-react";
import Store from "../../../stores/system/OrgModelStore.js";
import {injectIntl} from "react-intl";


const OrgModel = observer(props => {

    useEffect(() => {
        Store.queryTargetKeys();
    //    Store.queryLeftKeys();
    }, []);

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false}>
        {({
              direction,
              filteredItems,
              onItemSelectAll,
              onItemSelect,
              selectedKeys: listSelectedKeys,
              disabled: listDisabled,
          }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;

            const rowSelection = {
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ pointerEvents: listDisabled ? 'none' : null }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
);

//const mockTags = ['cat', 'dog', 'bird'];

/*const mockData = [];
for (let i = 0; i < 20; i++) {
    mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 4 === 0,
      //  tag: mockTags[i % 3],
    });
}*/

//const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
    {
        dataIndex: 'omname',
        title: '名称',
        key:"omname",
    },
    {
        dataIndex: 'tb',
        key: 'tb',
        title: '图标',
    },
    {
        dataIndex: 'lx',
        key: 'lx',
        title: '类型',
    },{
        dataIndex: 'url',
        key: 'url',
        title: 'URL',
    },{
        dataIndex: 'nomenu',
        key: 'nomenu',
        title: '首页显示',
    },
];
const rightTableColumns = [
    {
        dataIndex: 'omid',
        key: 'omid',
        title: '编码',
    }, {
        dataIndex: 'omname',
        key: 'omname',
        title: '名称',
    },
];

//export default class OrgModel extends React.Component{
/*    state = {
        targetKeys: originTargetKeys,
        disabled: false,
        showSearch: false,
    };*/




    const onChange = ((setTargetKeys) => {
        Store.targetKeys(setTargetKeys);
    });

    /*triggerDisable = disabled => {
        this.setState({ disabled });
    };

    triggerShowSearch = showSearch => {
        this.setState({ showSearch });
    };*/

   /* render() {*/
      /*  const { targetKeys, disabled, showSearch } = this.state;*/
        return (
            <>
                <TableTransfer
                    dataSource={Store.targetKeys}
                    targetKeys={Store.targetKeys}
                   /* disabled={disabled}
                    showSearch={showSearch}*/
                    onChange={onChange}
                    filterOption={(inputValue, item) =>
                        item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
                    }
                    leftColumns={leftTableColumns}
                    rightColumns={rightTableColumns}
                />
                {/*<Switch
                    unCheckedChildren="disabled"
                    checkedChildren="disabled"
                    checked={disabled}
                    onChange={this.triggerDisable}
                    style={{ marginTop: 16 }}
                />
                <Switch
                    unCheckedChildren="showSearch"
                    checkedChildren="showSearch"
                    checked={showSearch}
                    onChange={this.triggerShowSearch}
                    style={{ marginTop: 16 }}
                />*/}
            </>
        );
        /* }
     }*/

});

export default injectIntl(OrgModel);

