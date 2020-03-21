import React from 'react';
import axios from 'axios';
import { Button, Row, Col, Form } from 'react-bootstrap';



export function ProfileView(props) {
    const { user } = props;
    console.log("profileview", user);

    return (
        <div className="container">
            <Row>
                <Col>
                    <Form>
                        <div>{user.Username}</div>
                        <div>{user.Password}</div>
                        <div>{user.Email}</div>
                        <div>{user.FavoriteMovies}</div>
                        <Button>Save</Button>
                        <Button>Cancel</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}