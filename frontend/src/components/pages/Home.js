// Home.js
import React from 'react';
import './pages/homepagestyle.css';

export function Home({ ApiStatus }) {
    return (
        <div>
            <main>
                <section className="intro">
                    <h2>Welcome to the Platform</h2>
                    <p>Your one-stop destination for interactive and engaging online learning.</p>
                    <div className="buttons">
                        <button className="btn">Learn More</button>
                        <button className="btn">Learn More</button>
                    </div>
                </section>

                <section className="about">
                    <h2>About Us</h2>
                    <p>Welcome to our website Online Learning Platform which is designed to empower educators and students by providing a user-friendly space for creating, managing, and engaging with courses. It allows educators to create interactive content, track student progress, and manage enrollment, while students can easily access lessons and monitor their achievements. With a sleek, modern design and a focus on simplicity, the platform supports personalized learning experiences and fosters engagement through intuitive features like course creation, content delivery, and progress tracking.</p>
                </section>

                <section className="features">
                    <div className="feature-box">
                        <h3>HOME</h3>
                        <p>Stay updated with the latest platform news and features.</p>
                    </div>
                    <div className="feature-box">
                        <h3>ABOUT</h3>
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
                            <h3>Graphic Design Basics</h3>
                            <p>Learn the fundamentals of graphic design with practical exercises.</p>
                        </div>
                        <div className="course-box">
                            <img src="images/marketing-strategies.jpg" alt="Marketing Strategies Course" />
                            <h3>Marketing Strategies</h3>
                            <p>Discover effective marketing techniques to grow your business.</p>
                        </div>
                        <div className="course-box">
                            <img src="images/cybersecurity.jpg" alt="Cybersecurity Course" />
                            <h3>Cybersecurity Essentials</h3>
                            <p>Understand the basics of online security and protect your data.</p>
                        </div>
                        <div className="course-box">
                            <img src="images/creative-writing.jpg" alt="Creative Writing Course" />
                            <h3>Creative Writing</h3>
                            <p>Enhance your writing skills and unleash your creativity.</p>
                        </div>
                    </div>
                </section>

                {/* API Status Section */}
                <section className="api-status">
                    <p className="mt-2">API Response: {ApiStatus}</p>
                </section>
            </main>
        </div>
    );
}
