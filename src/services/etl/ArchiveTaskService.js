import BaseService from "../BaseService";
import fetch from "../../utils/fetch";
import util from "../../utils/util";

class ArchiveTaskService extends BaseService {
    constructor(url) {
        super(url);
        this.IsLogin = false;
    }

    add(record) {
        return new Promise((resolve, reject) => {
            fetch
                .post(this.url, record)
                .then(response => {
                    if (response.status === 201) {
                        resolve(response.data);
                    } else {
                        reject(util.bussinessException(response.status, response.data));
                    }
                })
                .catch(err => {
                    reject(
                        util.bussinessException(
                            err.response ? err.response.status : "404",
                            err.response ? err.response.data : err
                        )
                    );
                });
        });
    }

    runTask(id,cron) {
        return new Promise((resolve, reject) => {
            fetch
                .post(`${this.url}/runtask/${encodeURIComponent(id)}/${encodeURIComponent(cron)}`)
                .then(response => {
                    if (response.status === 204) {
                        resolve(true);
                    } else {
                        reject(util.bussinessException(response.status, response.data));
                    }
                })
                .catch(err => {
                    reject(
                        util.bussinessException(
                            err.response ? err.response.status : "404",
                            err.response ? err.response.data : err
                        )
                    );
                });
        });
    }

    stopTask(id) {
        return new Promise((resolve, reject) => {
            fetch
                .post(`${this.url}/stoptask/${encodeURIComponent(id)}`)
                .then(response => {
                    if (response.status === 204) {
                        resolve(true);
                    } else {
                        reject(util.bussinessException(response.status, response.data));
                    }
                })
                .catch(err => {
                    reject(
                        util.bussinessException(
                            err.response ? err.response.status : "404",
                            err.response ? err.response.data : err
                        )
                    );
                });
        });
    }

    delete(id, file) {
        return new Promise((resolve, reject) => {
            fetch
                .delete(
                    `${this.url}/${encodeURIComponent(id)}/${encodeURIComponent(file)}`
                )
                .then(response => {
                    if (response.status === 204) {
                        resolve(true);
                    } else {
                        reject(util.bussinessException(response.status, response.data));
                    }
                })
                .catch(err => {
                    reject(
                        util.bussinessException(
                            err.response ? err.response.status : "404",
                            err.response ? err.response.data : err
                        )
                    );
                });
        });
    }

    removeFile(file) {
        return new Promise((resolve, reject) => {
            fetch
                .delete(
                    `${this.url}/removeFile/${encodeURIComponent(file)}`
                )
                .then(response => {
                    if (response.status === 204) {
                        resolve(true);
                    } else {
                        reject(util.bussinessException(response.status, response.data));
                    }
                })
                .catch(err => {
                    reject(
                        util.bussinessException(
                            err.response ? err.response.status : "404",
                            err.response ? err.response.data : err
                        )
                    );
                });
        });
    }
}

export default new ArchiveTaskService("/api/archivetask");
