import React, {useEffect,  useState} from 'react';
import {Tooltip, Modal, Table, Button, Transfer} from 'antd';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import {AuditOutlined} from "@ant-design/icons";

import YhStore from "@/stores/system/YhStore";
import OrgStore from '@/stores/system/OrgStore';



function RoleYh(text, record, index, store: EpsTableStore) {

    const [visible, setVisible] = useState(false);

    // useEffect(() => {
    // YhStore.setRoleColumns([{
    //         title: "全宗号",
    //         dataIndex: "dwqzh",
    //         width: 150,
    //         align: 'center',
    //         lock: true
    //     },
    //         {
    //             title: "所属单位",
    //             dataIndex: "dwid",
    //             align: 'center',
    //             width: 300
    //         }, {
    //             title: "角色编号",
    //             dataIndex: 'rolecode',
    //             align: 'center',
    //             width: 100,
    //         }, {
    //             title: "角色名称",
    //             dataIndex: 'rolename',
    //             align: 'center',
    //             width: 250,
    //         }]);

    // }, []);

//     const state = {
//     targetKeys: originTargetKeys,
//     disabled: false,
//     showSearch: false,
//   };

  const  [targetKeys, setTargetKeys] = useState([]);
  const  [disabled, setDisabled] = useState(true);
  const  [showSearch, setShowSearch] = useState(true);

//   const onChange = nextTargetKeys => {
//     this.setState({ targetKeys: nextTargetKeys });
//   };
    const onChange = (nextTargetKeys, direction, moveKeys) => {
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
    };

  const triggerDisable = disabled => {
    this.setState({ disabled });
  };

  const triggerShowSearch = showSearch => {
    this.setState({ showSearch });
  };

 const leftTableColumns = [
  {
    dataIndex: 'yhcode',
    title: '用户编码',
  },
  {
    dataIndex: 'yhname',
    title: '用户名',
   
  },
  {
    dataIndex: 'orgleader',
    title: '部门领导',
  },
];   


const rightTableColumns = [
    {
        dataIndex: 'yhcode',
        title: '用户编码',
      },
      {
        dataIndex: 'yhname',
        title: '用户名',
       
      }
];

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false} titles={['组织用户', '未设置用户']} >
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





    return (
        <>
            <Tooltip title="组织机构用户">
                <Button size="small" style={{fontSize: '12px'}} type="primary" shape="circle" icon={<AuditOutlined /> }
                 onClick={() => {OrgStore.queryOrgYh(store.key);OrgStore.queryNoOrgYh(store.key);setVisible(true)}}/>
            </Tooltip>
            <Modal
                title="组织机构用户维护"
                centered
                visible={visible}
                footer={null}
                width={1200}
                onCancel={() => setVisible(false)}
            >
                    <TableTransfer
                        dataSource={OrgStore.orgYhData}
                        targetKeys={OrgStore.orgYhNoData}
                        disabled={disabled}
                        showSearch={showSearch}
                        onChange={onChange}
                        filterOption={(inputValue, item) =>
                            item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
                        }
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                        />
            </Modal>
        </>
    );
}

export default RoleYh
