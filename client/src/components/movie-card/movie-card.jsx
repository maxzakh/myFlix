import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-bootstrap';

export function MovieCard(props) {
    const { movie, showOpen: inList, favorite, setFavorite } = props;
    const history = useHistory();

    function goBack() {
        history.goBack();
    }

    return (
        <Card className='movie-card shadow-sm'>
            <div className='card-top'>
                <Card.Img className='mx-auto' variant="top" src={movie.ImagePath} />
                {inList ? <p className='center-title'>{movie.Title}</p> : <h5 className='center-title'>{movie.Title}</h5>}
            </div>

            {!inList && !setFavorite && <div className='card-desc'>{movie.Description}</div>}
            <div className='card-bottom center-button'>
                {
                    setFavorite
                        ?
                        <Form.Group className='favorites-button'>
                            <Form.Check type='checkbox' label='Favorite' defaultChecked={favorite} onClick={(event) => {
                                setFavorite(movie._id, event.target.checked);
                            }} />
                        </Form.Group>
                        :
                        inList
                            ?
                            <Link to={`/movies/${movie._id}`}>
                                <Button variant='link'>Details</Button>
                            </Link>
                            :
                            <Fragment>
                                {
                                    !inList &&
                                    <div>
                                        <Link to={`/directors/${movie.Director.Name}`}>
                                            <Button variant="link">Director</Button>
                                        </Link>
                                        <Link to={`/genres/${movie.Genre.Name}`}>
                                            <Button variant="link">Genre</Button>
                                        </Link>
                                    </div>
                                }                
                                <Button onClick={() => goBack()}>Back</Button>
                            </Fragment>
                }
            </div>
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