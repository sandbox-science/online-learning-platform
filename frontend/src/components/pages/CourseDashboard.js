import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import {Modal} from '../Modal.js';

export function CourseDashboard() {
    const [courseInfo, setCourseInfo] = useState(null);
    const [userInfo, setUserInfo]     = useState(null);
    const [newCourse, setNewCourse]   = useState({
        title: "",
        description: "",
    });
    const [error, setError]           = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: value });
    };

    const handleCreateCourse = async (e) =>{
        if (newCourse.title === "" || newCourse.description === ""){
            return
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
                    description: newCourse.description
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

        fetch(`http://localhost:4000/courses/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setCourseInfo(data.courses))
            .catch((error) => setError(error.message));
    }, []);

    useEffect(() => {
        const userId = Cookies.get('userId');

        if (!userId) {
            setError('User ID not found');
            return;
        }

        fetch(`http://localhost:4000/user/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setUserInfo(data.user))
            .catch((error) => setError(error.message));
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!courseInfo) return <p>Loading...</p>;
    if (!userInfo) return <p>Loading...</p>;

    let createButton = null;
    if (userInfo.role === "educator"){
        createButton = <Modal
            title={"Create New Course"}
            trigger={
                <div className="bg-blue-500 p-2 rounded shadow hover:bg-blue-700 m-auto text-center text-sm text-white font-semibold hover:cursor-pointer" > 
                    <div>+ New Course</div> 
                </div>
            }
            inputFields={{
                title : "Course Name",
                description : "Course Description"
            }}
            changeHandler={handleChange}
            confirmHandler={handleCreateCourse}
        />
    }

    var courseList = [];
    //Push all courses into courseList
    courseInfo.forEach(course => {
        courseList.push(
            <a href={`/courses/${course.ID}`}>
                <div className="bg-gray-100 p-4 rounded shadow hover:bg-gray-300" >
                    <h3 className="text-xl font-semibold" >{course.title}</h3>
                    <p className="mt-2">{course.description}</p>
                </div>
            </a>
        )
    });
    
    return (
        <div className="p-6">
            <div className="flex justify-between flex-wrap  mb-5">
                <h1 className="text-2xl font-bold">Courses</h1>
                {createButton}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseList}
            </div>
        </div>
    );
}
