import { Dropdown, Menu, message, TreeSelect } from 'antd';
import React, { useState } from 'react';
import util from '@/utils/util';
import { useEffect } from 'react';
import UserOrgService from './UserOrgService';
import icon_caretDown from  '@/styles/assets/img/file-transfer/icon_caretDown.png'
import { history } from 'umi';
const makeTreeData = (
  data: Record<string, unknown>[],
  list: Record<string, unknown>[],
) => {
  data.map((item) => {
    let children = list.filter((it) => it.fid === item.id);
    if (children !== [] || children.length > 0) {
      children = makeTreeData(children, list);
      item.children = children;
    }
    return item;
  });
  return data;
};

function UserOrg() {
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState<string>();

  const [menu, setMenu] = useState<Element[]>([]);

  useEffect(() => {
    const getOrg = async () => {
      const comp = util.getLStorage('currentCmp');
      if (comp) {
        const data = await UserOrgService.getUserOrg();
        if (Array.isArray(data)) {
          // setOptions(makeTreeData(data?.filter(item => !item.fid), data))
          setMenu(data);
        }
        setDefaultValue(comp.mc);
        await UserOrgService.setEpsSessionByGet(comp.id);
      }
    };
    getOrg();
  }, []);

  const onChange = (val: string, label) => {
    const [qzh, mc] = label.split('|');
    debugger;
    setDefaultValue(mc);
    UserOrgService.setEpsSessionByGet(val)
      .then((res) => {
        if (res && res.success) {
          const comp_label = (label && label[0]) || '|';
          const newComp = {
            id: val,
            mc,
            qzh,
            dwbh: qzh,
            text: label,
            dwname: label,
          };
          util.setLStorage('currentCmp', newComp);

          window.location.reload();
          // history.push("/");
          // window.location.reload()
        }
      })
      .catch((err) => {
        console.error('单位切换异常', err);
        message.error('单位切换异常');
      });
    //
  };

  return (
    <>
      {/* <TreeSelect value={defaultValue} treeDefaultExpandAll={true} style={{ width: 350, color: '#FFF', textAlign: 'right' }} bordered={false} treeData={options} onChange={(val, label, args) => onChange(val, label, args)}>
      </TreeSelect> */}
      <Dropdown
        overlay={() => (
          <Menu>
            {menu.map((item, index) => (
              <Menu.Item
                key={index}
                onClick={(event) => onChange(item.id, item.label)}
              >
                {item.dwname}
              </Menu.Item>
            ))}
          </Menu>
        )}
        trigger={['click']}
        offset={[18, 0]}
      >
        <span
          className="ant-dropdown-link"
          style={{ fontSize: 14, cursor: 'pointer' }}
        >
          {defaultValue}
          <img
            src={icon_caretDown}
            style={{ marginLeft: 5, width: 20 }}
          />
        </span>
      </Dropdown>
    </>
  );
}

export default UserOrg;