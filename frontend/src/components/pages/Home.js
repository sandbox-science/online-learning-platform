import React, { useEffect, useState } from 'react';
import './homepagestyle.css';

export function Home() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch('http://localhost:4000/course/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourses(data.courses || []);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

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
                    <a href="/courses">
                        <h3><b>COURSES</b></h3>
                        <p>Browse through a variety of courses tailored to your interests.</p>
                    </a>
                </div>
                <div className="feature-box">
                    <a href="https://github.com/sandbox-science/online-learning-platform/blob/main/README.md" target="_blank" rel="noreferrer">
                        <h3><b>MISSION</b></h3>
                        <p>Learn more about our mission and vision.</p>
                    </a>
                </div>
                <div className="feature-box">
                    <a href="#top" target="_blank" rel="noreferrer">
                        <h3><b>CONTACT</b></h3>
                        <p>Reach out to us for support and inquiries.</p>
                    </a>
                </div>
            </section>

            <section className="popular-courses" id="course-list">
                {/* <h2>Popular Courses</h2> */} {/* Uncomment this when popular courses algo is implemented */}
                <h2>Our Courses</h2>
                <div className="course-list">
                    {loading ? (
                        <p>Loading courses...</p>
                    ) : courses.length > 0 ? (
                        courses.map((course) => (
                            <div key={course.ID} className="course-box">
                                <a href={`/courses/${course.ID}`} key={course.ID}>
                                    <h3><b>{course.title}</b></h3>
                                </a>
                                <p>{course.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="course-box">
                            <h3><b>Placeholder</b></h3>
                            <p>Nothing to show, yet</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}