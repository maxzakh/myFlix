import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import './registration-view.scss';
import { Button, Row, Col } from 'react-bootstrap';

function fieldControl(label, value, onChange, type='text', feedback) {
    if (!feedback) {
        feedback = `Enter your ${label.toLowerCase()}`;
    }
    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control 
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                required
                placeholder={`Enter ${label.toLowerCase()}`}
            />
            <Form.Control.Feedback>
                {feedback}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export function RegistrationView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:5500/users', {
            Username: username,
            Password: password,
            Email: email,
            Birdthday: birthday
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                window.open('/', '_self');
            })
            .catch(e => {
                console.log('error registering the user')
            });
    }

    return (
        <div className='container col-6 justify-content-center'>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        {fieldControl('Username', username, setUsername, 'text')}
                        {fieldControl('Password', password, setPassword, 'password')}
                        {fieldControl('Email', email, setEmail, 'email')}
                        {fieldControl('Birthday', birthday, setBirthday, 'date')}
                        <Button variant='primary' type='submit'>Submit</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}