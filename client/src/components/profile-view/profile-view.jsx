import React, { useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Form, Toast } from 'react-bootstrap';

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
    const { user, setUser, movies, toggleFavorites, unregister, token } = props;

    const [username, setUsername] = useState(user.Username);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user.Email);
    const [birthday, setBirthday] = useState((user.Birthday || '').substr(0, 10));

    const [orgUsername, setOrgUsername] = useState(user.Username); // Last used username
    const [validated, setValidated] = useState(false);

    const [showErrorDuplicated, setShowErrorDuplicated] = useState(false);

    function handleSave(event) {
        /*
            Server will validate user data as: 
             username min 4 chars
             username unique
             username alphanumeric
             password min 4 chars
             email valid
             birthday not empty
         */

        const form = event.target;
        let isValid = form.checkValidity();

        if (!isValid) {
            event.preventDefault();
            setValidated(true);
            return;
        }

        let newUser = {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        };

        const url = `http://localhost:5500/users/${orgUsername}`;
        let config = { headers: { Authorization: `Bearer ${token}` } };

        axios.put(url, newUser, config)
            .then((res) => {
                let { user, token } = res.data;
                console.log(user);
                setUser(user, token);
                setOrgUsername(user.Username);
            })
            .catch((error) => {
                console.log(error);
                setShowErrorDuplicated(true);
                setValidated(false);
            });
    }

    function handleCancel(event) {
        event.preventDefault();
        setUsername(orgUsername);
        setPassword('');
        setEmail(user.Email);
        setBirthday((user.Birthday || '').substr(0, 10));
    }

    function handleUnregister(event) {
        let agree = confirm('Are you sure you want to leave our service?\nThis action cannot be undone.');
        if (agree) {
            let url = `http://localhost:5500/users/${orgUsername}`;
            let config = { headers: { Authorization: `Bearer ${token}` } };
            axios.delete(url, config)
                .then(res => {
                    unregister();
                })
                .catch(error => {
                    error && error.response && error.response.data ? console.log(error.response.data) : console.log(error)
                    // console.log('error unregistering the user.', error.response.data);
                });
        }
    }

    return (
        <div className="container">
            <Toast onClose={() => setShowErrorDuplicated(false)} show={showErrorDuplicated} delay={10000} autohide>
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>Username already exists</Toast.Body>
            </Toast>

            <Row>
                <Col>
                    <Form noValidate validated={validated}>
                        {inputControl('Username', 'text', username, setUsername, { required: true, pattern: '[a-zA-Z0-9_]{8,}' })}
                        {inputControl('Password', 'password', password, setPassword, { required: true, pattern: '[\S]{3,}' })}
                        {inputControl('Email', 'email', email, setEmail, { required: true, pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' })}
                        {inputControl('Birthday', 'date', birthday, setBirthday, { required: true })}

                        <Button onClick={handleSave}>Save</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </Form>
                </Col>
                <Col>
                    <Button onClick={handleUnregister}>Unregister</Button>
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