import "./Navbar.css";

import { FaSchool, FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import Cookies from 'js-cookie';

function Navbar() {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn]             = useState(false);

    const handleMobileMenuClick = () => setMobileMenuActive(!mobileMenuActive);
    const closeMobileMenu       = () => setMobileMenuActive(false);

    const checkLoggedInStatus = useCallback(() => {
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        checkLoggedInStatus();
    }, [checkLoggedInStatus]);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                <FaSchool />&nbsp;OLP
            </Link>
            <div className="navbar-container">
                <div
                    className="menu-icon"
                    onClick={handleMobileMenuClick}
                    aria-expanded={mobileMenuActive}
                >
                    {mobileMenuActive ? <FaTimes style={{ color: "white" }} /> : <FaBars style={{ color: "white" }} />}
                </div>
                <ul className={mobileMenuActive ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>

                    {/* Conditional rendering for account vs login/signup */}
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link to="/courses" className="nav-links" onClick={closeMobileMenu}>
                                    Courses
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/account" className="nav-btns" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline' buttonSize='btn--large'>Account</Button>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-btns" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline' buttonSize='btn--large'>Log In</Button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/signup" className="nav-btns" onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline' buttonSize='btn--large'>Sign Up</Button>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
