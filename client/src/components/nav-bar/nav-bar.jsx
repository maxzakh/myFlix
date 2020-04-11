import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './nav-bar.scss';

export function NavBar(props) {
    const { user, logOut } = props;

    return (
        <Navbar className='nav-bar-container shadow-sm' bg='light'>
            {
                user
                    ?
                        <div>
                            <span>
                                <Link to="/">
                                    <Button>Movies</Button>
                                </Link>
                            </span>
                            <span>
                                <Link to="/profile">
                                    <Button>Profile</Button>
                                </Link>
                            </span>
                            <span><Button onClick={() => logOut()}>Log out</Button></span>
                        </div>
                    :
                        <div>
                            <span>
                                <Link to="/login">
                                    <Button>Login</Button>
                                </Link>
                            </span>
                            <span>
                                <Link to="/register">
                                    <Button>Register</Button>
                                </Link>
                            </span>
                        </div>
            }
        </Navbar>
    )
}