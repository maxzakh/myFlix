import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useHistory } from 'react-router';

export function DirectorView(props) {
    const { movie } = props;
    const history = useHistory();

    if (!movie) return null;

    return (
        <Container className='col-lg-6 col-8'>
            <Card>
                <Card.Body>
                    <Card.Title>{movie.Director.Name}</Card.Title>
                    <Card.Text>{movie.Director.Bio}</Card.Text>
                    <Card.Text>Born {movie.Director.Birth}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div className="text-center">
                        <Button onClick={() => history.goBack()}>Back</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    )
}