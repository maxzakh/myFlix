import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import './nav-bar.scss';

export function NavBar(props) {
    const { user, logOut } = props;
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const isReg = location.pathname === '/register';

    return (
        <Navbar className='nav-bar-container shadow-sm' bg='light'>
            {
                user
                    ?
                    <div>
                        <span>{user.Username}</span>
                        <Link to="/">
                            <Button>Movies</Button>
                        </Link>
                        <Link to="/profile">
                            <Button>Profile</Button>
                        </Link>
                        <Button onClick={() => logOut()}>Log out</Button>
                    </div>
                    :
                    <div>
                        {!isLogin &&
                            <Link to="/login">
                                <Button>Login</Button>
                            </Link>
                        }
                        {!isReg &&
                            <Link to="/register">
                                <Button>Register</Button>
                            </Link>
                        }
                    </div>
            }
        </Navbar>
    )
}