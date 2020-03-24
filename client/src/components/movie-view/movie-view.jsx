import React from 'react';
import Button from 'react-bootstrap/Button';
import './movie-view.scss'
import { Container, Card } from 'react-bootstrap';
// import { useHistory } from 'react-router';
import { MovieCard } from '../movie-card/movie-card';

export function MovieView(props) {
    const { movie } = props;
    // const history = useHistory();

    // function goBack() {
    //     history.goBack();
    // }

    if (!movie) {
        return null;
    }

    return (
        <MovieCard movie={movie} showOpen={false} />

        // <Container className="movie-view col-8">
        //     <Card.Img src={movie.ImagePath} />
        //     <Card.Title>{movie.Title}</Card.Title>
        //     <Card.Text>{movie.Description}</Card.Text>
        //     <div className="mb-3 font-weight-light">
        //         <div>Genre: {movie.Genre.Name}</div>
        //         <div>Director: {movie.Director.Name}</div>
        //     </div>
        //     <div className="text-center">
        //         <Button onClick={ () => goBack() }>Back</Button>
        //     </div>
        // </Container>
    );
}