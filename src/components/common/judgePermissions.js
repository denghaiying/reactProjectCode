import React from 'react'

export default (permission) => (WrappedComponent) => {
    const shouldAct = permission ? judgePermissions(permission) : true
    return (
      shouldAct ? WrappedComponent : ''
    )
}