import React from 'react';
import './homepagestyle.css';

export function Home() {
    return (
        <div className="p-6">
            <section className="about">
                <h2>About Us</h2>
                <p>Welcome to our Online Learning Platform, designed to empower educators and students by providing a user-friendly space
                    for creating, managing, and engaging with courses. It allows educators to create interactive content, track student progress,
                    and manage enrollment, while students can easily access lessons and monitor their achievements. With a sleek, modern design
                    and a focus on simplicity, the platform supports personalized learning experiences and fosters engagement through intuitive
                    features like course creation, content delivery, and progress tracking.</p>
            </section>

            <section className="features">
                <div className="feature-box">
                    <a href='https://github.com/sandbox-science/online-learning-platform/blob/main/README.md' target="_blankc" rel="noreferrer">
                        <h3><b>MISSION</b></h3>
                        <p>Learn more about our mission and vision.</p>
                    </a>
                </div>
                <div className="feature-box">
                    <a href='#top' target="_blankc" rel="noreferrer">
                        <h3><b>COURSES</b></h3>
                        <p>Browse through a variety of courses tailored to your interests.</p>
                    </a>
                </div>
                <div className="feature-box">
                    <a href='#top' target="_blankc" rel="noreferrer">
                        <h3><b>CONTACT</b></h3>
                        <p>Reach out to us for support and inquiries.</p>
                    </a>
                </div>
            </section>

            <section className="popular-courses">
                <h2>Popular Courses</h2>
                <div className="course-list">
                    <div className="course-box">
                        <h3><b>Placeholder</b></h3>
                        <p>Nothing to show, yet</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
