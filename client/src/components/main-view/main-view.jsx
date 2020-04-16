import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './main-view.scss';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { setMovies } from '../../actions/actions';

import { NavBar } from '../nav-bar/nav-bar';
import { FrontPageView } from '../front-page-view/front-page-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { MovieView } from '../movie-view/movie-view';
import { MovieList } from '../movie-list/movie-list';

import { SERVER_URL } from '../../apis';

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

export function MainView(props) {
    // const [movies, setMovies] = useState([]);
    const [username, setUsername] = useState('');
    // const [user, setUser] = useState(null);

    const [token, setToken] = useState('');

    console.log('props', props);

    useEffect(() => {
        let accessToken = localStorage.getItem('token');
        if (accessToken) {
            setUsername(localStorage.getItem('user'));
            setUser(JSON.parse(localStorage.getItem('userObj')));
            getMovies(accessToken);
            setToken(accessToken);
        }
    }, []);

    function getMovies(token) {
        axios.get(`${SERVER_URL}/movies`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                props.setMovies(response.data);
                // setMovies(response.data);
            })
            .catch(function (err) {
                const msg = err.response ? err.response.data.message : err;
                console.log("fetch movies failed", msg);
                setMovies([]);
            });
    }

    function setAuthData(userObj, token = undefined) {
        setUsername(userObj.Username);
        setUser(userObj);

        localStorage.setItem('user', userObj.Username);
        localStorage.setItem('userObj', JSON.stringify(userObj));

        if (token) {
            setToken(token);
            localStorage.setItem('token', token);
        }
    }

    function onLoggedIn(authData) {
        setAuthData(authData.user, authData.token);

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

    function updateUser(user, token) {
        setUser(user, token);
        console.log("updated user", user);
        // TODO: update server, update local storage
    }

    function toggleFavorites(id) {
        let favorites = user.FavoriteMovies;
        let isFav = favorites.includes(id);

        const del = (url, options) => axios.delete(url, options);
        const add = (url, options) => axios.post(url, null, options);

        const opperation = isFav ? del : add;

        opperation(`${SERVER_URL}/users/${user.Username}/Movies/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log('response', response);
                setAuthData(response.data);
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    let { movies } = props;
    let { user } = state;

    return (
        <Router>
            <div className="main-view">
                <NavBar user={user} logOut={logOut} />
                <div className="main-content">
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
                    <ProtectedRoute path="/profile" component={ProfileView} user={user} setUser={updateUser} movies={movies} toggleFavorites={toggleFavorites} unregister={logOut} token={token} />
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
            </div>
        </Router>
    );
}

let mapStateToProps = state => {
    return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies })(MainView);