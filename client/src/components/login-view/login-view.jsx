import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './login-view.scss';

import axios from 'axios';

export function LoginView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        axios.post('http://localhost:5500/login', {
            Username: username,
            Password: password
        })
            .then(response => {
                const data = response.data;
                props.onLoggedIn(data);
            })
            .catch(error => {
                if (error.response) {
                    setErrorMsg(error.response.data.message);
                }
                else {
                    setErrorMsg(error.message);
                }
                // console.log('Error:', err.response.data.message);
            });
    };

    return (
        <Container className='login-form'>
            <Row className='justify-content-center mt-5'>
                <Col className='col-6'>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username:</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
            
                        <Button variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
                        <Button onClick={() => {
                            window.location.href = '/';
                        }}>Cancel</Button>
                        {
                            errorMsg
                                ?
                                    <div className='error-msg'>{errorMsg}</div>
                                :
                                    ""
                        }
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

