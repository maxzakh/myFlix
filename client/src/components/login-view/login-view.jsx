import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import axios from 'axios';

export function LoginView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(username, password, e);
    //     props.onLoggedIn(username);
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5500/login', {
            Username: username,
            Password: password
        })
            .then(response => {
                const data = response.data;
                props.onLoggedIn(data);
            })
            .catch(e => {
                console.log('no such user')
            });
    };

    return (
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
        </Form>
    );
}

