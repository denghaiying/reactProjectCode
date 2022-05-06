import { observable, action } from "mobx";
import moment from "moment";
import qs from "qs";
import BaseStore from "../BaseStore";
import UserService from "../../services/user/UserService";
import RoleService from "../../services/user/RoleService";
import UserroleService from "../../services/user/UserroleService";
import diagest from "../../utils/diagest";
import fetch from "../../utils/fetch";
import util from "../../utils/util";

class UserStore extends BaseStore {
  passwordValues = {};
  pswModalVisible = false;
  rsModalVisible = false;
  roleData = [];
  userroleIds = [];
  orgList = [];

  onRecordChange = (value) => {
    if (value.userTyrq === "" || value.userTyrq === null) {
      value.userTyrq = moment().format("YYYY-MM-DD");
    }
    if (
      value.userEnable === 1 ||
      (value.userEnable === true && value.userTyrq != null)
    ) {
      value.userTyrq = null;
    }
    this.editRecord = value;
  };

  findOrgAll = async () => {
    const response = await fetch.get("/userapi/org", { params: {} });
    if (response && response.status === 200) {
      this.orgList = response.data;
    }
  };

  beforeSaveData(values) {
    if (values.bUserEnable) {
      values.userEnable = 1;
    } else {
      values.userEnable = 0;
    }
    return values;
  }

  beforeSetEditRecord(value) {
    if (value.userEnable === 1) {
      value.bUserEnable = true;
    } else {
      value.bUserEnable = false;
    }
    return value;
  }

  setPasswordValues = async (passwordValues) => {
    this.passwordValues = passwordValues;
  };

  showPasswordDailog = (visible) => {
    this.pswModalVisible = visible;
  };

  changepassword = async (id, newpassword) => {
    try {
      await UserService.changepassword(id, diagest.desencode(id, newpassword));
    } catch (err) {
      // do nothing
    }
  };

  showRsDailog = async (visible) => {
    this.rsModalVisible = visible;
    if (visible) {
      this.roleData = await RoleService.findAll({});
      const userroles = await UserroleService.findByUserId(
        this.selectRowRecords[0].id
      );
      this.userroleIds = userroles ? userroles.map((r) => r.id) : [];
    }
  };

  reSetroleData = (values) => {
    this.userroleIds = values;
  };

  saveUserrole = async () => {
    await UserroleService.updateByUserId(
      this.selectRowRecords[0].id,
      this.userroleIds
        ? this.userroleIds.map((r) => ({
            userId: this.selectRowRecords[0].id,
            roleId: r,
          }))
        : []
    );
  };

  afterQueryData(data) {
    const userData = [];
    data.list.forEach((v) => {
      const user = {};
      this.orgList.forEach((org) => {
        if (org.id === v.orgId) {
          user.orgName = org.orgName;
        }
      });

      userData.push({
        id: v.id,
        userLoginname: v.userLoginname,
        userName: v.userName,
        userEnname: v.userEnname,
        orgId: v.orgId,
        orgName: user.orgName,
        userPost: v.userPost,
        userTel: v.userTel,
        userTax: v.userTax,
        userMail: v.userMail,
        userType: v.userType,
        userEnable: v.userEnable,
        userQyrq: v.userQyrq,
        userTyrq: v.userTyrq,
        whrid: v.whrid,
        whr: v.whr,
        whsj: v.whsj,
      });
    });
    data.list = userData;
    return data;
  }

  findByCode(bh) {
    return new Promise((resolve, reject) => {
      fetch
        .get(`${this.url}/queryForId?${qs.stringify({ bh, syry: "N" })}`)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(err.response.status, err.response.data)
          );
        });
    });
  }
}

export default new UserStore("/api/eps/control/main/yh", false, true);
