import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Notiflix from 'notiflix';
import {Modal} from '../Modal.js';

export function Content() {
    const { courseID }                  = useParams();
    const { contentID }                 = useParams();
    const [courseInfo, setCourseInfo]   = useState(null);
    const [userInfo, setUserInfo]       = useState(null);
    const [contentInfo, setContentInfo] = useState(null);
    const [error, setError]             = useState(null);
    const [file, setFile]               = useState(null);
    const [newContentInfo, setNewContentInfo] = useState({
        title: "",
        body: "",
    });

    const handleContentChange = (e) => {
        const { name, value } = e.target;
        setNewContentInfo({...newContentInfo, [name]: value });
    };

    const handleContentUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const handleEditContent = (contentID) => async (e) => {
        if (newContentInfo.title === "" && newContentInfo.body === "" && file === null){
            return
        } 

        const userId = Cookies.get('userId');
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", newContentInfo.title);
            formData.append("body", newContentInfo.body)
            const response = await fetch(`http://localhost:4000/edit-content/${userId}/${contentID}`, {
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

    const handleDeleteFile = (contentID) => async (e) => {
        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`http://localhost:4000/delete-file/${userId}/${contentID}`, {
                method: "POST"
            });

            const data = await response.json();
            if (response.ok) {
                Notiflix.Notify.success("File successfully deleted!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Notiflix.Notify.failure(data.message || "File deletion failed");
            }
        } catch (error) {
            Notiflix.Notify.failure("Error occurred during file deletion");
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

        async function fetchContent() {
            await fetch(`http://localhost:4000/content/${contentID}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setContentInfo(data.content))
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
        fetchContent();
        fetchUser();
    }, [courseID, contentID]);

    if (error) return <p>Error: {error}</p>;
    if (!courseInfo || !contentInfo || !userInfo) return <p>Loading...</p>;
    
    let editButton = null;
    if (userInfo.role === "educator") {
        editButton = (
            <Modal
                title={"Edit Content"}
                trigger={
                    <div className="bg-blue-500 p-3 rounded shadow hover:bg-blue-700 m-auto text-center text-sm text-white font-semibold hover:cursor-pointer">
                        <div>Edit Content</div>
                    </div>
                }
                inputFields={{
                    title: "Content Name",
                    body: "Body",
                }}
                changeHandler={handleContentChange}
                confirmHandler={handleEditContent(contentID)}
                fileUploadHandler={handleContentUpload}
                deleteFileHandler={contentInfo.path !== "" ? handleDeleteFile(contentID) : null}
            />
        );
    }

    let attachment = null;
    if (contentInfo.path !== "") {
        let mediaType = contentInfo.type.split("/")[0];
        if (mediaType === "image") {
            attachment = <img src={process.env.PUBLIC_URL + "/content" + contentInfo.path} alt="Uploaded File"/>
        } else if (mediaType === "video") {
            attachment = <iframe src={process.env.PUBLIC_URL + "/content" + contentInfo.path} className="w-screen lg:max-w-5xl max-w-[90%] aspect-video" title="Uploaded File"/> 
        } else {
            attachment = <iframe src={process.env.PUBLIC_URL + "/content" + contentInfo.path} className="w-[82vw] h-[82vh]" title="Uploaded File"/> 
        }
    } 

    return (
        <div className="p-6">
            <div className="flex justify-between">
                <a href={`/courses/${courseID}`}>
                    <span className="text-2xl font-bold mb-4 hover:underline ">{courseInfo.title}</span>
                </a>
                {editButton}
            </div>
            <div className="text-xl font-bold">
                {contentInfo.title}
            </div>
            <div>
                {contentInfo.body}
            </div>
            {attachment}
        </div>
    );
}