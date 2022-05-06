import moment from 'moment'

export type Condition = {
    source: string,
    type: string,
    value: string
}

export type ConditionSearch = {
    kind: string;
    names: Condition[];
}

export default class ConditionCard {

    title: string;
    create_time: string;
    num: number;
    data: ConditionSearch;

    constructor(title: string, data: ConditionSearch){
        this.title = title;
        this.create_time = moment().format('YYYY-MM-DD hh:mm');
        this.num = 0;
        this.data = data
    }
}
