/* eslint-disable comma-dangle */
import ReportszService from "../../services/ksh/ReportszService";

/**
 *统计的动态菜单
 */
export default {
    menuSource: [],

    async didMount() {
        this.menuSource = await ReportszService.findList();
    },
};
