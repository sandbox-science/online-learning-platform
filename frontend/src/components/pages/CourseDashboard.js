import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import { Modal } from '../Modal.js';
import SearchBar from '../search-bar.js'

export function CourseDashboard() {
    const [courseInfo, setCourseInfo] = useState(null);
    const [userInfo, setUserInfo]     = useState(null);
    const [newCourse, setNewCourse]   = useState({
        title: "",
        description: "",
    });
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

        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`http://localhost:4000/create-course/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newCourse.title,
                    description: newCourse.description,
                }),
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
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during course creation");
        }
    };

    useEffect(() => {
        const userId = Cookies.get('userId');

        if (!userId) {
            setError('User ID not found');
            return;
        }

        async function fetchCourses() {
            await fetch(`http://localhost:4000/courses/${userId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => setCourseInfo(data.courses))
                .catch((error) => setError(error.message));
        }

        async function fetchUser() {
            await fetch(`http://localhost:4000/user/${userId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => setUserInfo(data.user))
                .catch((error) => setError(error.message));
        }

        async function fetchAllCourses() {
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
        fetchAllCourses();

        fetchCourses();
        fetchUser();
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!courseInfo || !userInfo) return <p>Loading...</p>;

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

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const myCourses = courseInfo.map((course) => (
        <a href={`/courses/${course.ID}`} key={course.ID} className="max-w-[40vw] aspect-[9/8]">
            <div className="bg-gray-100 rounded shadow hover:bg-gray-300 flex flex-col h-full w-full outline outline-1 outline-black/25">
                <div className="h-[60%] ">
                    <img
                        className="rounded outline outline-1 outline-black/40 object-fill w-full h-full block aspect-[16/9]" 
                        src={process.env.PUBLIC_URL + `/content/${course.ID}/thumbnail.png`} 
                        onError={(e)=>{e.target.onError = null; e.target.className = "invisible"}}
                        alt="Thumbnail"
                    />
                </div>
                <div className="h-[40%] p-2 md:p-4 xl:p-2 overflow-hidden">
                    <h3 className="text-base font-semibold truncate overflow-hidden">{course.title}</h3>
                    <p className="truncate overflow-hidden">{course.description}</p>
                </div>
            </div>
        </a>
    ));

    const allCourses = filteredCourses.map((course) => (
        <a href={`/courses/${course.ID}`} key={course.ID} className="max-w-[40vw] aspect-[9/8]">
            <div className="bg-gray-100 rounded shadow hover:bg-gray-300 flex flex-col h-full w-full outline outline-1 outline-black/25">
                <div className="h-[60%] ">
                    <img
                        className="rounded outline outline-1 outline-black/40 object-fill w-full h-full block aspect-[16/9]" 
                        src={process.env.PUBLIC_URL + `/content/${course.ID}/thumbnail.png`} 
                        onError={(e)=>{e.target.onError = null; e.target.className = "invisible"}}
                        alt="Thumbnail"
                    />
                </div>
                <div className="h-[40%] pl-2 p-1 overflow-hidden">
                    <h3 className="text-base font-semibold truncate overflow-hidden">{course.title}</h3>
                    <p className="truncate overflow-hidden">{course.description}</p>
                </div>
            </div>
         </a>
    ))

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
            </div>
        </div>
    );
}
