// Home.js
import React from 'react';
import './homepagestyle.css';

export function Home({ ApiStatus }) {
    return (
        <div className="p-6">
            <section className="about">
                <p className="mt-2">API Response: {ApiStatus}</p>
                <h2>About Us</h2>
                <p>Welcome to our Online Learning Platform, designed to empower educators and students by providing a user-friendly space for creating, managing, and engaging with courses. It allows educators to create interactive content, track student progress, and manage enrollment, while students can easily access lessons and monitor their achievements. With a sleek, modern design and a focus on simplicity, the platform supports personalized learning experiences and fosters engagement through intuitive features like course creation, content delivery, and progress tracking.</p>
                <a href='https://github.com/sandbox-science/online-learning-platform/blob/main/README.md' target="_blank">
                    <button className="btn">Learn More</button>
                </a>
            </section>

            <section className="features">
                <div className="feature-box">
                    <h3>MISSION</h3>
                    <p>Learn more about our mission and vision.</p>
                </div>
                <div className="feature-box">
                    <h3>COURSES</h3>
                    <p>Browse through a variety of courses tailored to your interests.</p>
                </div>
                <div className="feature-box">
                    <h3>CONTACT</h3>
                    <p>Reach out to us for support and inquiries.</p>
                </div>
            </section>

            <section className="popular-courses">
                <h2>Popular Courses</h2>
                <div className="course-list">
                    <div className="course-box">
                        <img src="images/graphic-design.jpg" alt="Graphic Design Course" />
                        <h3>Placeholder</h3>
                        <p>Nothing to show, yet</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
