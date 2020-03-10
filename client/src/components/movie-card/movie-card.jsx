import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';

export class MovieCard extends React.Component {
    render() {
        // This is given to the <MovieCard/> component by the outer world
        // which, in this case, is `MainView`, as `MainView` is what’s
        // connected to your database via the movies endpoint of your API
        const { movie, onClick } = this.props;

        return (
            <Card className='movie-card' style={{flexShrink:0}}>
                <Card.Img variant="top" src={movie.ImagePath} />
                <Card.Body>
                    <Card.Title>{movie.Title}</Card.Title>
                    <Card.Text>{movie.Description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button onClick={() => onClick(movie)}>View</Button>
                </Card.Footer>
            </Card>
        );
    }
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};