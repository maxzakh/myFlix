import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';

export class GenreView extends React.Component {
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
                        <Card.Title>{movie.Genre.Name}</Card.Title>
                        <Card.Text>{movie.Genre.Description}</Card.Text>
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