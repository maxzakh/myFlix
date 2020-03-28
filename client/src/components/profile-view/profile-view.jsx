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
    const { movies, favorites, setFavorites } = props;

    function isFavorite(id) {
        return favorites.includes(id);
    }

    function onCheckbox(id, checked) {
        if (checked) {
            setFavorites([...favorites, id]);
        } else {
            setFavorites(favorites.filter((itemId) => itemId !== id));
        }
    }

    return (
        <div>
            {
                movies.map(movie => {
                    return (
                        <MovieCard key={movie._id} movie={movie} favorite={isFavorite(movie._id)} setFavorite={onCheckbox} />
                    );
                })
            }
        </div>
    );
}

function Footer(props) {
    const { children } = props;

    const footerStyle = {
        backgroundColor: "#e8e2e8",
        fontSize: "20px",
        color: "white",
        borderTop: "1px solid #E7E7E7",
        textAlign: "center",
        padding: "20px",
        position: "fixed",
        left: "0",
        bottom: "0",
        height: "60px",
        width: "100%"
    };

    const phantomStyle = {
        display: "block",
        padding: "20px",
        height: "60px",
        width: "100%"
    };

    return (
        <div>
            <div style={footerStyle}>{children}</div>
            {/* <div style={phantomStyle}></div> */}
        </div>
    );
}

export function ProfileView(props) {
    const { user, setUser, movies } = props;
    console.log("profileview", user);

    const [username, setUsername] = useState(user.Username);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(user.Email);
    const [birthday, setBirthday] = useState((user.Birthday || '').substr(0, 10));

    const [favorites, setFavorites] = useState([...user.FavoriteMovies]);

    function validateUserData() {
        
    }

    function handleSave() {
        // TODO: validate user data: 
        //      username not empty
        //      username unique
        //      password not empty
        //      password not empty
        //      email valid
        //      birthday not empty
        // TODO: create user data
        // TODO: setUser() 
    }

    return (
        <div className="container">
            <Row>
                <Col>
                    <Form>
                        <GroupControl label={'Username'} type={'text'} update={setUsername} value={username} placeholder={'Enter your new username'} />
                        <GroupControl label={'Password'} type={'password'} update={setPassword} value={password} placeholder={'Enter your password'} />
                        <GroupControl label={'Email'} type={'email'} update={setEmail} value={email} placeholder={'Enter your email'} />
                        <GroupControl label={'Birthday'} type={'date'} update={setBirthday} value={birthday} placeholder={'Enter your birthday'} />
                        <MovieGrid movies={movies} favorites={favorites} setFavorites={setFavorites} />
                        <div>{user.FavoriteMovies}</div>
                    </Form>
                    <Footer>
                        <Button onClick={handleSave}>Save</Button>
                        <Button>Cancel</Button>
                    </Footer>
                </Col>
            </Row>
        </div>
    )
}