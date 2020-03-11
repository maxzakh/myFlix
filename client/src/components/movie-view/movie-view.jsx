import React from 'react';
import Button from 'react-bootstrap/Button';
import './movie-view.scss'
import { Container, Card } from 'react-bootstrap';

export class MovieView extends React.Component {

    constructor() {
        super();

        this.state = {};
    }

    render() {
        const { movie, clearSelection } = this.props;

        if (!movie) return null;

        return (
            <Container className="movie-view col-8">
                <Card.Img src={movie.ImagePath} />
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>{movie.Description}</Card.Text>
                <div className="mb-3 font-weight-light">
                    <div>Genre: {movie.Genre.Name}</div>
                    <div>Director: {movie.Director.Name}</div>
                </div>
                <div className="text-center">
                    <Button onClick={clearSelection}>Back</Button>
                </div>
            </Container>
        );
    }
}