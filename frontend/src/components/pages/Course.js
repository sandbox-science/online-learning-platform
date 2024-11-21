import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import {Modal} from '../Modal.js';

export function Course() {
    const { courseID }                = useParams();
    const [courseInfo, setCourseInfo] = useState(null);
    const [userInfo, setUserInfo]     = useState(null);
    const [error, setError]           = useState(null);
    const [newModuleName, setNewModuleName] = useState({
        title: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewModuleName({[name]: value });
    };

    const handleCreateModule = async (e) =>{
        console.log(newModuleName)
        if (newModuleName.title === ""){
            return
        } 

        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`http://localhost:4000/create-module/${userId}/${courseID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newModuleName.title,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Module creation successful!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "Module creation failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during module creation");
        }
    };

    useEffect(() => {
        const userId = Cookies.get('userId');

        if (!userId) {
            setError('User ID not found');
            return;
        }

        async function fetchCourse() {
            fetch(`http://localhost:4000/course/${courseID}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setCourseInfo(data.course))
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

        fetchCourse();
        fetchUser();
    }, [courseID]);

    if (error) return <p>Error: {error}</p>;
    if (!courseInfo || !userInfo) return <p>Loading...</p>;

    var moduleList = [];
    //Push all modules into moduleList
    courseInfo.modules.forEach(module => {
        var contentList = [];
        module.content.forEach(content => {
            contentList.push(
                <a href={`/courses/${courseID}/${content.ID}`} >
                    <div className="bg-gray-200 p-4 rounded shadow hover:bg-gray-400" >
                        <h3 className="text-xl font-semibold" >{content.title}</h3>
                    </div>
                </a>
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

    let createButton = null;
    if (userInfo.role === "educator"){
        createButton = <Modal
            title={"Create New Module"}
            trigger={
                <div className="bg-blue-500 p-2 rounded shadow hover:bg-blue-700 m-auto text-center text-sm text-white font-semibold hover:cursor-pointer" > 
                    <div>+ Add Module</div> 
                </div>
            }
            inputFields={{
                title : "Module Name",
            }}
            changeHandler={handleChange}
            confirmHandler={handleCreateModule}
        />
    }

    return (
        <div className="p-6">
            <div className="flex justify-between flex-wrap  mb-5">
                <h1 className="text-2xl font-bold mb-4">{courseInfo.title}</h1>
                {createButton}
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {moduleList}
            </div>
        </div>
    );
}
