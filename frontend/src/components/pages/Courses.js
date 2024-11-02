import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function Courses() {
    const [courseInfo, setCourseInfo] = useState(null);
    const [error, setError] = useState(null);

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

    if (error) return <p>Error: {error}</p>;
    if (!courseInfo) return <p>Loading...</p>;
    
    var courseList = [];
    //Push all courses into courseList
    courseInfo.forEach(course => {
        courseList.push(
            <a href={`/courses/${course.ID}`}>
            <div className="bg-gray-100 p-4 rounded shadow" >
                <h3 className="text-xl font-semibold" >{course.title}</h3>
                <p className="mt-2">{course.description}</p>
            </div>
            </a>
        )
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseList}
            </div>
        </div>
    );
}
