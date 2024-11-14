import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function Content() {
    const { courseID }                = useParams();
    const { contentID }               = useParams();
    const [courseInfo, setCourseInfo] = useState(null);
    const [error, setError]           = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/course/${courseID}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setCourseInfo(data.course))
            .catch((error) => setError(error.message));
    }, [courseID]);

    if (error) return <p>Error: {error}</p>;
    if (!courseInfo) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <a href={`/courses/${courseID}`}>
                <span className="text-2xl font-bold mb-4 hover:underline ">{courseInfo.title}</span>
            </a>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                Course id: {courseID}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                Content id: {contentID}
            </div>
        </div>
    );
}