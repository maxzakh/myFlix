import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './front-page-view.scss';

export function FrontPageView(props) {
    return (
        <div className='front-page-container'>
            <Container>
                <div>Front page view for no user</div>
            </Container>
        </div>
    )
}