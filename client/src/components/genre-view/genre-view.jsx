import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useHistory } from 'react-router';

export function GenreView(props) {
        const { movie } = props;
        const history = useHistory();

        if (!movie) return null;

        return (
            <Container className='col-lg-6 col-8'>
                <Card>
                    <Card.Body>
                        <Card.Title>{movie.Genre.Name}</Card.Title>
                        <Card.Text>{movie.Genre.Description}</Card.Text>
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