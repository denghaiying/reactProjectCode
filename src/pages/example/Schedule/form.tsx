import { Form, Input } from 'antd';
import React, {useEffect, useState} from "react";
function SSForm() {

    // const [ds1, setDs1] = useState('')
    const ds1 = 'world'

    useEffect(()=>{
        // 查询某个select的datasource
        // setDs1('Hello')
    })

    return (
        <>
            <Form.Item label='abc' key='mc' name ="mc"><Input placeholder={ds1}></Input></Form.Item>
        </>
    )
}

export default SSForm