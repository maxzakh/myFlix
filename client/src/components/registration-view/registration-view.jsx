import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { SERVER_URL, SUB_DIR } from '../../apis';
import './registration-view.scss';

function fieldControl(label, value, onChange, type = 'text', feedback) {
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
    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setErrorMsg('');
        axios.post(`${SERVER_URL}/users`, {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                window.open(SUB_DIR, '_self');
            })
            .catch((error) => {
                setErrorMsg(error.response && error.response.data || error);
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
                    {errorMsg && <div className='registration-err-msg'>{errorMsg}</div>}
                </Col>
            </Row>
        </div>
    );
}