import React, { useState } from 'react';

export const Modal = ({ title, trigger, inputFields, changeHandler, confirmHandler, fileUploadHandler, deleteFileHandler}) => {
    const [showModal, setShowModal] = useState(false);

    const close = () => {
        setShowModal(false);
    };

    const open = () => {
        setShowModal(true);
    };

    var fieldList = null
    if (inputFields != null) {
        fieldList = Object.entries(inputFields).map(([name, text]) => (
            <div className="p-2" key={name}>
                <label className="block font-medium">{text + ":"}</label>
                {name === "body" ? 
                    <textarea 
                        className="border-2 border-gray-300 rounded p-2 size-11/12"
                        type="text"
                        name={name}
                        onChange={changeHandler}
                    />: 
                    <input
                        className="border-2 border-gray-300 rounded p-2 size-11/12"
                        type="text"
                        name={name}
                        onChange={changeHandler}
                    />}
                
            </div>
        ));
    }
    
    return (
        <div>
            <div onClick={open}>{trigger}</div>
            {/* Modal */}
            {showModal && (
                <div>
                    <div
                        className="fixed z-[1040] overflow-auto backdrop-blur bg-opacity-50 bg-black fixed top-0 left-0 h-full w-full"
                        onClick={close}
                    />
                    {/* Modal Content */}
                    <div className="fixed z-[1050] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg border-2 border-slate-300 absolute min-w-80">
                        <h3 className="font-semibold text-lg mb-4">{title}</h3>
                        {fieldList}
                        {fileUploadHandler != null ? (
                            <div>
                                <h1>File Upload</h1>
                                <input type="file" onChange={fileUploadHandler}/>
                            </div>) : null
                        }
                        {deleteFileHandler != null ? (
                            <div>
                                <button
                                    className="px-4 py-2 mt-2 border border-gray-300 rounded bg-red-500 text-white hover:bg-red-700"
                                    onClick={deleteFileHandler}
                                >
                                    Delete Current File
                                </button>
                            </div>) : null
                        }
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={close}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 border border-gray-300 rounded bg-green-500 text-white hover:bg-green-600"
                                onClick={confirmHandler}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
