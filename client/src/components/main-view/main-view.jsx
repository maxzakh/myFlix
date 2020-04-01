import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './main-view.scss';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { NavBar } from '../nav-bar/nav-bar';
import { FrontPageView } from '../front-page-view/front-page-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { MovieView } from '../movie-view/movie-view';
import { MovieList } from '../movie-list/movie-list';

const SERVER_URL = 'http://localhost:5500';

const ProtectedRoute = ({
    component: Component, ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (rest.user) {
                    return <Component {...props} {...rest} />
                }
                else {
                    return <Redirect to='/' />
                }
            }}
        />
    );
};

export function MainView() {
    const [movies, setMovies] = useState([]);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);

    const [token, setToken] = useState('');

    useEffect(() => {
        let accessToken = localStorage.getItem('token');
        if (accessToken) {
            setUsername(localStorage.getItem('user'));
            setUser(JSON.parse(localStorage.getItem('userObj')));
            getMovies(accessToken);
        }
    }, []);

    function getMovies(token) {
        axios.get(`${SERVER_URL}/movies`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setMovies(response.data);
            })
            .catch(function (err) {
                const msg = err.response ? err.response.data.message : err;
                console.log("fetch movies failed", msg);
                setMovies([]);
            });
    }

    function onLoggedIn(authData) {
        console.log("onLoggedIn: 1 ", authData.user);

        setUsername(authData.user.Username);

        console.log("onLoggedIn: 2 ", authData.user);

        setUser(authData.user);

        console.log("onLoggedIn: 3 ", authData.user);

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        localStorage.setItem('userObj', JSON.stringify(authData.user));
        getMovies(authData.token);

        window.open('/', '_self');
    }

    function logOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userObj');

        setUsername('');
        setUser(null);
    }

    function updateUser(updatedUser) {
        // setUser(updateUser);
        console.log("updated user", updatedUser);
        // TODO: update server, update local storage
    }

    function toggleFavorites(id) {
        let favorites = user.FavoriteMovies;
        let isFav = favorites.includes(id);

        // let newFavorites = !isFav ? [...favorites, id] : favorites.filter((itemId) => itemId !== id);
        // console.log("new favorites", newFavorites);

        const del = (url, options) => axios.delete(url, options);
        const add = (url, options) => axios.post(url, null, options);

        const opperation = isFav ? del : add;

        opperation(`${SERVER_URL}/users/${user.Username}/Movies/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log('response', response);
                setUser(response.data);
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    // console.log(`Call render with: '${username}' user data:`, user);

    return (
        <Router>
            <div className="main-view">
                <NavBar user={user} logOut={logOut} />
                <Route exact path="/" render={() => {
                    if (user) {
                        return <MovieList movies={movies} />
                    }
                    else {
                        return <FrontPageView />;
                    }
                }} />
                <Route exact path="/login" render={() => {
                    if (!username) {
                        return <LoginView onLoggedIn={authData => {
                            return onLoggedIn(authData);
                        }} />;
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }
                } />
                <Route path="/register" render={() => {
                    if (!user) {
                        return <RegistrationView />;
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
                {/* <ProtectedRoute path="/register" component={RegistrationView} user={!user} /> */}
                <ProtectedRoute path="/profile" component={ProfileView} user={user} setUser={updateUser} movies={movies} toggleFavorites={toggleFavorites} />
                <Route path="/movies/:movieId" render={(props) => {
                    if (user) {
                        return <MovieView
                            movie={movies.find(m => {
                                return m._id === props.match.params.movieId;
                            })}
                            showOpen={false}
                        />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
                <Route exact path="/genres/:name" render={(props) => {
                    if (user) {
                        return <GenreView movie={movies.find(m => m.Genre.Name === props.match.params.name)} />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
                <Route exact path="/directors/:name" render={(props) => {
                    if (user) {
                        return <DirectorView movie={movies.find(m => m.Director.Name === props.match.params.name)} />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
            </div>
        </Router>
    );
}