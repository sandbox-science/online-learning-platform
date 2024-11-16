import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export function CourseDashboard() {
    const [courseInfo, setCourseInfo] = useState(null);
    const [userInfo, setUserInfo]     = useState(null);
    const [error, setError]           = useState(null);

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

    var courseList = [];
    //Push all courses into courseList
    if (userInfo.role === "educator"){
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
        //Push the create course button at the end of courses
        courseList.push(
            <Popup trigger={<div className="bg-blue-500 p-4 rounded shadow hover:bg-blue-700 m-auto text-center text-xl text-white font-semibold hover:cursor-pointer" > 
                <div>+ New Course</div> </div>} modal nested>
                {close => (
                    <div className='modal'>
                        <div className='content'>
                            Create New Course
                        </div>
                        <div>
                            <button className="border-2 border-black p-1 rounded" onClick=
                                {() => close()}>
                                    Cancel
                            </button>
                        </div>
                    </div>
                    )
                }
            </Popup>
        )
    }
    else{
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
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseList}
            </div>
        </div>
    );
}
