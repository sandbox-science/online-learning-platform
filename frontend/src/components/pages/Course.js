import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function Course() {
    const { courseID } = useParams(); 
    const [courseInfo, setCourseInfo] = useState(null);
    const [error, setError] = useState(null);

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

    var moduleList = [];
    //Push all modules into moduleList
    courseInfo.modules.forEach(module => {
        var contentList = [];
        module.content.forEach(content => {
            contentList.push(
                <div className="bg-gray-200 p-4 rounded shadow" >
                    <h3 className="text-xl font-semibold" >{content.title}</h3>
                </div>
            )
        })
        moduleList.push(
            <div>
                <div className="bg-slate-400 p-4 rounded shadow" >
                    <h3 className="text-xl font-semibold" >{module.title}</h3>
                </div>
                <div>
                    {contentList}
                </div>
            </div>
        );
    });
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{courseInfo.title}</h1>
            <div className="grid grid-cols-1 gap-6">
                {moduleList}
            </div>
        </div>
    );
}
