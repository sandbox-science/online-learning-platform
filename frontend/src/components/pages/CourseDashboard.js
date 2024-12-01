import React, { useEffect, useState, useMemo } from 'react';
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import { Modal } from '../Modal.js';
import SearchBar from '../search-bar.js'
import CourseCard from '../CourseCard.js';

export function CourseDashboard() {
    const userId                        = Cookies.get('userId');
    const [courseInfo, setCourseInfo]   = useState([]);
    const [userInfo, setUserInfo]       = useState(null);
    const [newCourse, setNewCourse]     = useState({ title: "", description: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError]             = useState(null);
    const [courses, setCourses]         = useState([]);
    const [loading, setLoading]         = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCreateCourse = async () => {
        if (newCourse.title === "" || newCourse.description === "") {
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/create-course/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCourse),
            });
            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Course creation successful!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "Course creation failed");
            }
        } catch {
            Notiflix.Notify.failure("Error occurred during course creation");
        }
    };

    useEffect(() => {
        if (!userId) {
            setError("User ID not found");
            return;
        }
        const fetchAllData = async () => {
            try {
                const [coursesRes, userRes, allCoursesRes] = await Promise.all([
                    fetch(`http://localhost:4000/courses/${userId}`),
                    fetch(`http://localhost:4000/user/${userId}`),
                    fetch("http://localhost:4000/course/"),
                ]);
                if (!coursesRes.ok || !userRes.ok || !allCoursesRes.ok) {
                    throw new Error("Failed to fetch data");
                }
                const [coursesData, userData, allCoursesData] = await Promise.all([
                    coursesRes.json(),
                    userRes.json(),
                    allCoursesRes.json(),
                ]);
                setCourseInfo(coursesData.courses || []);
                setUserInfo(userData.user || null);
                setCourses(allCoursesData.courses || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [userId]);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courses, searchQuery]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    let createButton = null;
    if (userInfo.role === "educator") {
        createButton = (
            <Modal
                title={"Create New Course"}
                trigger={
                    <div className="bg-blue-500 p-3 rounded shadow hover:bg-blue-700 m-auto text-center text-sm text-white font-semibold hover:cursor-pointer">
                        <div>+ New Course</div>
                    </div>
                }
                inputFields={{
                    title: "Course Name",
                    description: "Course Description",
                }}
                changeHandler={handleChange}
                confirmHandler={async () => {
                    await handleCreateCourse();
                }}
            />

        );
    }

    const myCourses = courseInfo.map((course) => (
        <CourseCard key={course.ID} course={course} />
    ));

    const allCourses = filteredCourses.map((course) => (
        <CourseCard key={course.ID} course={course} />
    ));

    return (
        <div className="p-6">
            <div className="mb-5">
                <h1 className="text-2xl font-bold">Courses</h1>
            </div>
            <div className="mb-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    {createButton}
                    <SearchBar onChange={handleSearchChange} />
                </div>
            </div>

            {/* My Courses Section */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">My Courses</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-9">
                    {myCourses}
                </div>
            </div>

            {/* All Courses Section */}
            {userInfo.role !== "educator" && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">All Courses</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-7">
                        {loading ? (
                            <p>Loading courses...</p>
                        ) : filteredCourses.length > 0 ? (
                            allCourses
                        ) : (
                            <div className="course-box">
                                <p>Nothing to show, yet</p>
                            </div>
                        )}
                    </div>
                </div>)}
        </div>
    );
}
