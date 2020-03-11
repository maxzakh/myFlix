import React from 'react';
import axios from 'axios';
import { Container, CardGroup, Grid } from 'react-bootstrap';
import './main-view.scss';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
    constructor() {
        // Call the superclass constructor
        // so React can initialize it
        super();

        // Initialize the state to an empty object so we can destructure it later
        this.state = {
            movies: null,
            selectedMovie: null,
            user: null
        };
    }

    // One of the "hooks" available in a React Component
    componentDidMount() {
        axios.get('http://localhost:5500/movies')
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

    onLoggedIn(user) {
        this.setState({
            user
        });
    }

    // This overrides the render() method of the superclass
    // No need to call super() though, as it does nothing by default
    render() {
        // If the state isn't initialized, this will throw on runtime
        // before the data is initially loaded
        const { movies, selectedMovie, user } = this.state;

        if (!user) return (
            <Container className="container-login-view">
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Container>
        );

        return (
            <div className="main-view">
                {
                    movies
                        ? 
                            selectedMovie
                                ? <MovieView movie={selectedMovie} clearSelection={ () => this.clearMovieSelection() } />
                                : 
                                    <div className='container-movie-cards'>
                                        {
                                            movies.map(movie => (
                                                <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
                                            ))
                                        }
                                    </div>
                        :
                            ''
                }
            </div>
        );
    }
}