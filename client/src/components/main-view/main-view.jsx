import React from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import './main-view.scss';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
    constructor() {
        super();

        this.state = {
            movies: [],
            selectedMovie: null,
            user: null
        };
    }

    // One of the "hooks" available in a React Component
    // componentDidMount() {
    //     axios.get('http://localhost:5500/movies')
    //         .then(response => {
    //             // Assign the result to the state
    //             this.setState({
    //                 movies: response.data
    //             });
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                user: localStorage.getItem('user')
            });
            this.getMovies(accessToken);
        }
    }

    onMovieClick(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    clearMovieSelection() {
        this.setState({
            selectedMovie: null
        });
    }

    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username
        });

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    getMovies(token) {
        axios.get('http://localhost:5500/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                // Assign the result to the state
                this.setState({
                    movies: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    logOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.setState({
            user: null
        });
    }

    render() {
        const { movies, selectedMovie, user } = this.state;

        if (!movies) return <div className='main-view' />

        return (
            <Router>
                <div className="main-view">
                    <Router>
                        <div className="main-view">
                            <Route exact path="/" render={() => {
                                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                                return movies.map(m => <MovieCard key={m._id} movie={m} />)
                            }
                            } />
                            <Route path="/register" render={() => <RegistrationView />} />
                            <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
                            <Route exact path="/genres/:name" render={({ match }) => <GenreView movie={movies.find(m => m.Genre.Name === match.params.name)} />} />
                            <Route exact path="/directors/:name" render={({ match }) => <DirectorView movie={movies.find(m => m.Director.Name === match.params.name)} />} />
                        </div>
                        <Button onClick={() => this.logOut()}>Log out</Button>
                    </Router>
                </div>
            </Router>

            // <div className="main-view">
            //     {
            //         movies
            //             ?
            //             selectedMovie
            //                 ? <MovieView movie={selectedMovie} clearSelection={() => this.clearMovieSelection()} />
            //                 :
            //                 <div className='container-movie-cards'>
            //                     {
            //                         movies.map(movie => (
            //                             <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
            //                         ))
            //                     }
            //                     <Button onClick={() => this.logOut()}>Log out</Button>
            //                 </div>
            //             :
            //             ''
            //     }
            // </div>
        );
    }
}