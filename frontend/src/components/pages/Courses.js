import React from 'react';

export function Courses() {

    //Push all courses into courseList
    var courseList = []
    for(var i = 1; i < 10; i++){
        courseList.push(
            <a href={`/courses/${i}`}>
                <div className="bg-gray-100 p-4 rounded shadow" >
                    <h3 className="text-xl font-semibold" >Course Title {i}</h3>
                    <p className="mt-2">Description of Course {i}</p>
                </div>
            </a>
        )
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
