import { observable, action, runInAction,makeObservable } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import UserService from '../../services/user/UserService';
import EtlService from "../../services/etl/EtlService";
import fetch from '../../utils/fetch';


class ArchiveStore extends BaseStore {
    constructor(url, wfenable, oldver = true) {
        super(url, wfenable, oldver);
        makeObservable(this);
    }

}

export default new ArchiveStore('/api/archiveinfo',false,false);
