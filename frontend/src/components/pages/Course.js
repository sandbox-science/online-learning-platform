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
    const [file, setFile]               = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [newContentName, setNewContentName] = useState({
        title: "",
    });
    const [newModuleName, setNewModuleName] = useState({
        title: "",
    });

    const handleModuleChange = (e) => {
        const { name, value } = e.target;
        setNewModuleName({[name]: value });
    };

    const handleCreateModule = async (e) =>{
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

    const handleContentChange = (e) => {
        const { name, value } = e.target;
        setNewContentName({[name]: value });
    };

    const handleCreateContent = (moduleID) => async (e) =>{
        if (newContentName.title === ""){
            return
        } 

        const userId = Cookies.get('userId');
        try {
            const formData = new FormData();
            formData.append("title", newContentName.title);
            const response = await fetch(`http://localhost:4000/create-content/${userId}/${moduleID}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Content creation successful!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "Content creation failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during content creation");
        }
    };

    const handleThumbnailUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const handleEditThumbnail = (courseID) => async (e) => {
        if (file === null){
            return
        } 

        const userId = Cookies.get('userId');
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(`http://localhost:4000/edit-thumbnail/${userId}/${courseID}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Thumbnail upload successful!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "Thumbnail upload failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during thumbnail upload");
        }
    };

    const handleEnroll = async () => {
        const userId = Cookies.get('userId');

        if (!userId) {
            setError('User ID not found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/Enroll/${userId}/${courseID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
        });
        const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Succesfully enrolled in the course!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "Enrollment failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during enrollment");
        }

    };

    const handleUnenroll = async () => {
        const userId = Cookies.get('userId');

        if (!userId) {
            setError('User ID not found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/Unenroll/${userId}/${courseID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }, 
        });
        const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("Succesfully unenrolled in the course!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "Unenrollment failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during Unenrollment");
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
        if (userInfo.role === "educator"){
            moduleList.push(
                <div>
                    <div className="flex justify-between flex-wrap bg-slate-400 p-4 rounded shadow" >
                        <h3 className="text-xl font-semibold" >
                            {module.title}
                        </h3>
                        <Modal
                            title={"Add New Content"}
                            trigger={
                                <div className="bg-blue-500 p-2 rounded shadow hover:bg-blue-700 m-auto text-center text-sm text-white font-semibold hover:cursor-pointer" > 
                                    <div>+ Add Content</div> 
                                </div>
                            }
                            inputFields={{
                                title : "Content Name",
                            }}
                            changeHandler={handleContentChange}
                            confirmHandler={handleCreateContent(module.ID)}
                        />
                    </div>
                    <div>
                        {contentList}
                    </div>
                </div>
            );
        } else {
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
        }
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
            changeHandler={handleModuleChange}
            confirmHandler={handleCreateModule}
        />
    }

    let editThumbnail = null;
    if (userInfo.role === "educator"){
        editThumbnail = <Modal
            title={"Edit Thumbnail"}
            trigger={
                <div className="bg-blue-500 p-2 rounded shadow hover:bg-blue-700 m-auto text-center text-sm text-white font-semibold hover:cursor-pointer" > 
                    <div>Edit Thumbnail</div> 
                </div>
            }
            confirmHandler={handleEditThumbnail(courseID)}
            fileUploadHandler={handleThumbnailUpload}
        />
    }

    return (
        <div className="p-6">
            <div className="flex justify-between flex-wrap  mb-5">
                <h1 className="text-2xl font-bold mb-4">{courseInfo.title}</h1>
                <div className="flex flex-1 justify-end flex-wrap gap-5 ml-20">
                    {editThumbnail}
                    {createButton}
                    {userInfo.role === "student" && (
                    <button
                    onClick={isEnrolled ? handleUnenroll : handleEnroll}
                    className={`p-2 rounded shadow text-white font-semibold ${isEnrolled ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}`}
                >
                    {isEnrolled ? 'Unenroll from Course' : 'Enroll in Course'}
                    </button>
                )}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {moduleList}
            </div>
        </div>
    );
}
