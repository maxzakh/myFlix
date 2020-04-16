import React, { useState, useEffect } from 'react';
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

import axios from 'axios';
import { SERVER_URL } from '../../apis';
import './main-view.scss';

import { connect } from 'react-redux';
import { actions } from '../../actions/actions';

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
    // const [username, setUsername] = useState('');
    // const [user, setUser] = useState(null);
    // const [token, setToken] = useState('');
    let { movies, user, username, token, filter, setMovies, setUser, setUsername, setToken, setFilter } = props;

    // console.log('props', props);
    // return (<div>work in progress</div>);

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

    return (
        <Router>
            <div className="main-view">
                <NavBar user={user} logOut={logOut} />
                <div className="main-content">
                    <Route exact path="/" render={() => {
                        if (user) {
                            return <MovieList movies={movies} visibilityFilter={filter} />
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

function mapStateToProps(state) {
    return {
        movies: state.movies,
        user: state.user,
        username: state.username,
        token: state.token,
        filter: state.filter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setMovies(newMovies) {
            return dispatch(actions.setMovies(newMovies));
        },
        setUser(newUser) {
            return dispatch(actions.setUser(newUser));
        },
        setUsername(newUsername) {
            return dispatch(actions.setUsername(newUsername));
        },
        setToken(newToken) {
            return dispatch(actions.setToken(newToken));
        },
        setFilter(newFilter) {
            return dispatch(actions.setFilter(newFilter));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);