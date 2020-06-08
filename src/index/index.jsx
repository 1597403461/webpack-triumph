import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import lake from './lake.jpg';

function App() {
    const [Component,setComponent] = useState(null);
    const onClick = () => {
        import('./Text.jsx').then((res) => {
            console.log(res.default)
            setComponent(res.default)
        })
    }
    return <div>
        {Component ? Component : null}
        <img src={lake} alt="" onClick={onClick}/>
    </div>
}

ReactDOM.render(<App/>,document.getElementById('root'))