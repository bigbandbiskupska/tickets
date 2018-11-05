import React from 'react';
import {SyncLoader} from "react-spinners";

export default ({inline}) => {
    return (<SyncLoader className={inline ? 'text-centered-spinner' : 'centered-spinner'} />)
}