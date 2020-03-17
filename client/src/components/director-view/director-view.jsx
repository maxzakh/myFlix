import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';

export class DirectorView extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        const { movie, clearSelection } = this.props;

        if (!movie) return null;

        return (
            <Container className='col-8'>
                <Card>
                    <Card.Body>
                        <Card.Title>{movie.Director.Name}</Card.Title>
                        <Card.Text>{movie.Director.Bio}</Card.Text>
                        <Card.Text>Born {movie.Director.Birth}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <div className="text-center">
                            <Button onClick={clearSelection}>Back</Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Container>
        )
    }
}