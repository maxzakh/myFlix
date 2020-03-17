import React from 'react';
import axios from 'axios';
import { Button, Card, Container, Form } from 'react-bootstrap';

export function ProfileView(props) {
    const { user } = props;
    console.log("profileview", user);

    return (
        <Form>
            <Card>
                <div>{user}</div>
                div
                <div>{user.Password}</div>
                <div>{user.Email}</div>
                <div>{user.FavoriteMovies}</div>
            </Card>
        </Form>
    )
}