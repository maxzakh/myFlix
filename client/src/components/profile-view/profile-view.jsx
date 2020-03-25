import React, { useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Form } from 'react-bootstrap';

import { MovieCard } from '../movie-card/movie-card'; 

function GroupControl(props) {
    const { label, type, value, update, placeholder } = props;
    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                onChange={(event) => {
                    update(event.target.value);
                }}
                value={value}
                placeholder={placeholder}
            />
        </Form.Group>
    );
}

function MovieGrid(props) {
    const { movies, favorites } = props;

    function onCheckbox(checked) {
        console.log('checked', checked);
    }

    return (
        <div>
            {
                movies.map(movie => {
                    return (
                        <MovieCard key={movie._id} movie={movie} onCheckbox={onCheckbox} />
                    );
                })
            }
        </div>
    );
}

export function ProfileView(props) {
    const { user, movies } = props;
    console.log("profileview", user);

    const [username, setUsername] = useState(user.Username);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user.Email);
    const [birthday, setBirthday] = useState((user.Birthday || '').substr(0, 10));

    return (
        <div className="container">
            <Row>
                <Col>
                    <Form>
                        <GroupControl label={'Username'} type={'text'} update={setUsername} value={username} placeholder={'Enter your new username'} />
                        <GroupControl label={'Password'} type={'password'} update={setPassword} value={password} placeholder={'Enter your password'} />
                        <GroupControl label={'Email'} type={'email'} update={setEmail} value={email} placeholder={'Enter your email'} />
                        <GroupControl label={'Birthday'} type={'date'} update={setBirthday} value={birthday} placeholder={'Enter your birthday'} />

                        <MovieGrid movies={movies} favorites={user.FavoriteMovies} />
                        <div>{user.FavoriteMovies}</div>
                        <Button>Save</Button>
                        <Button>Cancel</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}