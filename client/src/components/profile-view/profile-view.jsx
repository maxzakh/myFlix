import React, { useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Form } from 'react-bootstrap';

import { MovieCard } from '../movie-card/movie-card';

function inputControl(label, type, value, update, options, feedback) {
    if (!feedback) {
        feedback = `Enter your ${label.toLowerCase()}`;
    }

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                onChange={(event) => {
                    update(event.target.value);
                }}
                value={value}
                placeholder={feedback}
                {...options}
            />
            <Form.Control.Feedback type={"invalid"}>
                {feedback}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

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
                required
                minLength="8"
            />
        </Form.Group>
    );
}

function MovieGrid(props) {
    const { movies, favorites, toggleFavorites } = props;

    function isFavorite(id) {
        return favorites.includes(id);
    }

    return (
        <div>
            {
                movies.map(movie => {
                    return (
                        <MovieCard key={movie._id} movie={movie} favorite={isFavorite(movie._id)} setFavorite={toggleFavorites} />
                    );
                })
            }
        </div>
    );
}

export function ProfileView(props) {
    const { user, setUser, movies, toggleFavorites } = props;

    const [username, setUsername] = useState(user.Username);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user.Email);
    const [birthday, setBirthday] = useState((user.Birthday || '').substr(0, 10));

    const [validated, setValidated] = useState(false);

    function validateUserData() {

    }

    function handleSave(event) {
        let newUser = {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        };

        // TODO: validate user data: 
        //      username min 4 chars
        //      username unique
        //      username alphanumeric
        //      password min 4 chars
        //      email valid
        //      birthday not empty
        /*
        [
        check('Username', 'Username is required').isLength({ min: 4 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Password', 'Password is required').isLength({ min: 4 }),
        check('Email', 'Email does not appear to be valid').isEmail()
        ]
        */

        const form = event.target;
        if (!form.checkValidity()) {
            event.preventDefault();
        }

        setValidated(true);

        if (newUser.length > 3) {
            // setUser(newUser);
        } else {
            console.log('username not long enough')
        }
    }

    return (
        <div className="container">
            <Row>
                <Col>
                    <Form noValidate validated={validated}>
                        {inputControl('Username', 'text', username, setUsername, { required: true, minLength: 8 })}
                        {inputControl('Password', 'password', password, setPassword, { required: true, minLength: 8 })}
                        {inputControl('Email', 'email', email, setEmail, { required: true, minLength: 8 })}
                        {inputControl('Birthday', 'date', birthday, setBirthday, { required: true })}

                        {/* <GroupControl label={'Username'} type={'text'} update={setUsername} value={username} placeholder={'Enter your new username'} />
                        <GroupControl label={'Password'} type={'password'} update={setPassword} value={password} placeholder={'Enter your password'} />
                        <GroupControl label={'Email'} type={'email'} update={setEmail} value={email} placeholder={'Enter your email'} />
                        <GroupControl label={'Birthday'} type={'date'} update={setBirthday} value={birthday} placeholder={'Enter your birthday'} />
 */}
                        <Button onClick={handleSave}>Save</Button>
                        <Button>Cancel</Button>
                    </Form>
                </Col>
                <Col>
                    <Button>Unregister</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <MovieGrid movies={movies} favorites={user.FavoriteMovies} toggleFavorites={toggleFavorites} />
                </Col>
            </Row>
        </div>
    )
}