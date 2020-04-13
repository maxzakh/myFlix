import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import './movie-view.scss';

export function MovieView(props) {
    const { movie } = props;

    if (!movie) {
        return null;
    }

    return (
        <Container>
            <Row className='justify-content-center'>
                <Col className='col-8'>
                    <MovieCard movie={movie} showOpen={false} />
                </Col>
            </Row>
        </Container>
    );
}