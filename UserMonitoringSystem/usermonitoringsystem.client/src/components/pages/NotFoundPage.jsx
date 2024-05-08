import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () =>
    <div>
        <h1>Oops! 404 - Page Not Found</h1>
        <p>Looks like you've stumbled upon a page that doesn't exist.</p>
        <p>But don't worry, we'll help you find your way back to the <Link to="/">Home</Link> page.</p>
    </div>;

export default NotFoundPage;
