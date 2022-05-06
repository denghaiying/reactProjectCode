import util from "@/utils/util";
/**
 * 
 * @param dakid 档案库id
 * @param bmc 表名称
 * @param grpid 附件grpid
 * @param datmid 档案条目id
 * @param tmzt 条目状态
 * @param downfile 是否允许下载
 * @param printfile 是否允许打印
 */
const showFileUrl = (dakid: string, bmc: string, grpid: string, datmid: string, tmzt: number, downfile: number, printfile: number){
    const fjparams = {
        dakid,
        doctbl: `${bmc}_fj`,
        downfile,
        printfile,
        bmc,
        fjck: true,
        fjdown: true,
        fjsctrue: false,
        fjupd: false,
        grpid: grpid,
        grptbl: `${bmc}_FJFZ`,
        id: datmid,
        psql: "$S$KCgxPTEpKQ==",
        tmzt: 4,
        wrkTbl: bmc,
    }
    util.setSStorage("fjparams", fjparams);
    return `/eps/wdgl/attachdoc/viewFiles?grpid=${grpid}`;
}