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
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export function MainView() {
    const [movies, setMovies] = useState([]);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            setUsername(localStorage.getItem('user'));
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
            .catch(function (error) {
                console.log(error);
            });
    }

    function onLoggedIn(authData) {
        console.log("onLoggedIn:", authData);

        setUsername(authData.user.Username);
        setUser(authData.user);

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        getMovies(authData.token);
    }

    function logOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUsername('');
        setUser(null);
    }

    console.log("the current username is", username);

    return (
        <Router>
            <div className="main-view">
                <NavBar user={user} logOut={logOut} />
                <Route exact path="/" render={() => {
                    if (user) {
                        return movies.map(m => {
                            return <MovieCard key={m._id} movie={m} />;
                        })
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
                    window.location.href = '/';
                    // <Redirect to='/' />
                    // setTimeout(() => {
                    //     window.location.href = '/';
                    // }, 3000);
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