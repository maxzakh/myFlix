import React, { useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Form } from 'react-bootstrap';

export function ProfileView(props) {
    const { user } = props;
    console.log("profileview", user);

    const [username, setUsername] = useState(user.Username);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user.Email);
    const [birthday, setBirthday] = useState('2020-03-02');

    return (
        <div className="container">
            <Row>
                <Col>
                    <Form>
                        <div>{user.Username}</div>
                        <div>{username}</div>

                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }} 
                                value={username}
                                placeholder='enter your username'
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                                value={password}
                                placeholder='enter your new password'
                            />
                        </Form.Group>

                        {/* <div>{user.Password}</div> */}
                                    
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                }}
                                value={email}
                                placeholder='enter your email'
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={(event) => {
                                    console.log(`setBirthday "${event.target.value}"`);
                                    setBirthday(event.target.value);
                                }}
                                value={birthday}
                                placeholder='enter your birthday'
                            />
                        </Form.Group>

                        <div>{password}</div>
                        <div>{email}</div>
                        <div>{birthday}</div>
                        
                        {/* <div>{user.FavoriteMovies}</div> */}
                        <Button>Save</Button>
                        <Button>Cancel</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}