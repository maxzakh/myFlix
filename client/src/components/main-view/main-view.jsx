import React from 'react';
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

export class MainView extends React.Component {
    constructor() {
        super();

        this.state = {
            movies: [],
            username: null,
            user: null
            // selectedMovie: null,
        };
    }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                username: localStorage.getItem('user')
            });
            this.getMovies(accessToken);
        }
    }

    getMovies(token) {
        axios.get('http://localhost:5500/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                this.setState({
                    movies: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onLoggedIn(authData) {
        console.log("onLoggedIn:", authData);
        //this.state.username = authData.user.Username;
        // this.state = {
        //     ...this.state,
        //     username: authData.user.Username
        // };
        //this.state = Object.assign({}, this.state, { username: authData.user.Username });
        
        this.setState({
            username: authData.user.Username,
            //user: authData.user
        });

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    logOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.setState({
            username: null,
            //user: null
        });
    }

    render() {
        const { movies, username, user } = this.state;
        console.log("the current username is", username);

        return (
            <Router>
                <div className="main-view">
                    <NavBar user={user} />
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
                                return this.onLoggedIn(authData);
                            }} />;
                        }
                        <Redirect to='/' />
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
}