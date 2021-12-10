import React from "react";
import Header from "./Header";
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const layout = (props)=>{
    return (
        <div>
            <Container>
                <Header/>
                {props.children}
            </Container>
        </div>
    )
}

export default layout;