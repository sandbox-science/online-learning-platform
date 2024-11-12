import React from 'react';
import "./Button.css";

const STYLES = ["btn--primary", "btn--outline"];
const SIZES  = ["btn--medium", "btn--large"];

export const Button = ({ children, type, onClick, buttonStyle, buttonSize }) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize  = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    //Returns a button that renders children. This is used to put text in buttons
    return (
        <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
};