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

const ProtectedRoute = ({
    component: Component, user, ...rest
  }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (user) {
                    return <Component {...props} user={user} />
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
                {/* <Route path="/profile" render={() => {
                    if (user) {
                        return <ProfileView user={user} />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} /> */}
                <ProtectedRoute path="/profile" component={ProfileView} user={user} />
                <Route path="/movies/:movieId" render={(props) => {
                    if (user) {
                        return <MovieView
                            movie={movies.find(m => {
                                return m._id === props.match.params.movieId;
                            })}
                            clearSelection={() => {
                                props.history.push('/');
                            }}
                        />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
                <Route exact path="/genres/:name" render={(props) => {
                    if (user) {
                        return <GenreView
                            movie={movies.find(m => {
                                return m.Genre.Name === props.match.params.name;
                            })}
                            clearSelection={() => {
                                props.history.push('/');
                            }} />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
                <Route exact path="/directors/:name" render={(props) => {
                    if (user) {
                        return <DirectorView
                            movie={movies.find(m => {
                                return m.Director.Name === props.match.params.name;
                            })}
                            clearSelection={() => {
                                props.history.push('/');
                            }} />
                    }
                    else {
                        return <Redirect to='/' />
                    }
                }} />
            </div>
        </Router>
    );
}