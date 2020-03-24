import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

export function MovieCard(props) {
    const { movie, showOpen } = props;
    const history = useHistory();

    function goBack() {
        history.goBack();
    }

    return (
        <Card className='movie-card col-8 col-md-6 col-lg-4 mb-2'>
            <Card.Img variant="top" src={movie.ImagePath} />
            <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>{movie.Description}</Card.Text>

                <Link to={`/directors/${movie.Director.Name}`}>
                    <Button variant="link">Director</Button>
                </Link>
                <Link to={`/genres/${movie.Genre.Name}`}>
                    <Button variant="link">Genre</Button>
                </Link>
            </Card.Body>
            <Card.Footer className='text-center'>
                {
                    showOpen
                        ?
                        <Link to={`/movies/${movie._id}`}>
                            <Button variant='link'>Open</Button>
                        </Link>
                        :
                        <Button onClick={() => goBack()}>Back</Button>
                }
            </Card.Footer>
        </Card>
    );
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired
    }).isRequired
};