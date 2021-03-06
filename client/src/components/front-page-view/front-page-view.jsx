import React from 'react';
import { Container } from 'react-bootstrap';
import './front-page-view.scss';
import welcome from '../../assets/images/undraw_web_search_eetr.svg';

export function FrontPageView(props) {
    return (
        <Container className='frontpage-body'>
            <img src={welcome} alt="" className='greeting-image'/>
            <div className='greeting'>Login to view movies</div>
        </Container>
    )
}