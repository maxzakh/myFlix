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

export function MainView() {
    const [movies, setMovies] = useState([]);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        let accessToken = localStorage.getItem('token');
        if (accessToken) {
            setUsername(localStorage.getItem('user'));
            setUser(JSON.parse(localStorage.getItem('userObj')));
            getMovies(accessToken);
        }
    }, []);

    function getMovies(token) {
        axios.get('http://localhost:5500/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
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

    console.log(`Call render with: '${username}' user data:`, user);

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
                    <Redirect to='/' />
                }
                } />
                <Route path="/register" render={() => {
                    if (user) {
                        window.location.href = '/';
                    }
                    else {
                        return <RegistrationView />;
                    }
                }} />
                <Route path="/profile" render={() => {
                    if (user) {
                        return <ProfileView user={user} />
                    }
                    window.location.href = '/';
                }} />
                <Route path="/movies/:movieId" render={({ match }) => {
                    if (user) {
                        return <MovieView
                            movie={movies.find(m => {
                                return m._id === match.params.movieId;
                            })}
                            clearSelection={() => {
                                window.location.href = '/';
                            }}
                        />
                    }
                    window.location.href = '/';
                }} />
                <Route exact path="/genres/:name" render={({ match }) => {
                    if (user) {
                        return <GenreView
                            movie={movies.find(m => {
                                return m.Genre.Name === match.params.name;
                            })}
                            clearSelection={() => {
                                window.location.href = '/';
                            }} />
                    }
                    window.location.href = '/';
                }} />
                <Route exact path="/directors/:name" render={({ match }) => {
                    if (user) {
                        return <DirectorView
                            movie={movies.find(m => {
                                return m.Director.Name === match.params.name;
                            })}
                            clearSelection={() => {
                                window.location.href = '/login';
                            }} />
                    }
                    window.location.href = '/';
                }} />
            </div>
        </Router>
    );
}