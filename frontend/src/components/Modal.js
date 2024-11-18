import React, {useState} from 'react';

/**
 * Modal component
 * @param {string} title - A string which is the title at the top of the modal.
 * @param {React.JSX.Element} trigger - React.JSX.Element that when clicked will open the modal.
 * @param {Map} inputFields - {var : "Input Var Here", ...} A map of variables where things typed into a text box will be stored to the string that the user will see above that text box.
 * @param {(e: any) => void} changeHandler - The handler that handles changes in text and assigns them to a variable.
 * @param {(e: any) => Promise<void>} confirmHandler - The handler that calls an API upon clicking confirm
 */
export const Modal = ({title, trigger, inputFields, changeHandler, confirmHandler}) => {

    const [showModal, setShowModal] = useState(false);

    const close = () => {
        setShowModal(false);
    };

    const open = () => {
        setShowModal(true);
    };

    var fieldList = []
    Object.entries(inputFields).map(([name, text]) => (
        fieldList.push(
            <div className="p-2">
                <label>{text+ ": "} </label>
                <input className="border-2 border-slate-300 rounded p-2 size-11/12"
                type="text"
                name={name}
                onChange={changeHandler}
                />
            </div>
        )
    ));

    return (
        <div>
            <div onClick={open}>{trigger}</div>
            {showModal ? 
            <div>
                <div className='opacity-50 bg-black fixed top-0 left-0 h-full w-full' onClick={close}/>
                <div className="flex-auto bg-white rounded-lg border-2 border-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3">
                    <h3 className="font-semibold">
                        {title}
                    </h3>
                    {fieldList}
                    <div className="grid grid-rows-1 grid-cols-2 p-2">
                        <button className="justify-self-start border-2 border-slate-300 p-1 rounded" onClick=
                            {() => close()}>
                                Cancel
                        </button>
                        <button className="justify-self-end border-2 border-slate-300 p-1 rounded bg-green-400" onClick={confirmHandler}>
                            Confirm
                        </button>
                    </div> 
                </div>
            </div>:null}
        </div>
    );
}