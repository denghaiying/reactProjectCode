import React, {Component} from 'react';
import ArchiveInfoTable from './ArchiveInfoGrid';
import EditForm from './ArchiveInfoEditProxy';

export default class ArchiveInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="etl-page">
                {/* 可筛选过滤的用户类表格 */}
                <EditForm/>
                <ArchiveInfoTable/>
            </div>
        );
    }
}
