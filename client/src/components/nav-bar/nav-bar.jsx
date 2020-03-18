import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './nav-bar.scss';

export function NavBar(props) {
    const { user, logOut } = props;

    return (
        user
            ?
            <div className='nav-bar-container'>
                <Link to="/">
                    Movies
                </Link>
                <Link to="/profile">
                    Profile
                </Link>
                <Button onClick={() => logOut()}>Log out</Button>
            </div>
            :
            <div className='nav-bar-container'>
                <span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </span>
                <span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </span>
            </div>
    )
}