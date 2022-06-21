import { useState } from "react";
import { useRef, useEffect } from "react";

// const useHandleInputRe = (fieldNames) => {
//     const initialFieldState = {};

//     for (let i = 0; i < fieldNames.length; i++) {
//         const fieldName = fieldNames[i];
//         initialFieldState[fieldName] = '';
//     }

//     const [fields, setFields] = useState(initialFieldState);

//     const handleChanged = [];

//     for (let i = 0; i < fieldNames.length; i++) {
//         handleChanged[i] = e => {
//             setFields(
//                 {
//                     ...fields,
//                     [fieldNames[i]]: e
//                 }
//             )
//         }
//     }

//     return { fields, handleChanged };
// }

const useHandleInput = (initialValue) => {
    // need a useState to work
    const [updateTime, update] = useState(0);
    let inputRef = useRef(null); // persist when state changes, lose when reloading page

    const set = (val) => {
        inputRef.current = val;
    }

    const setPartial = (part, val) => {
        inputRef.current[part] = val;

        update(updateTime + 1);
    }

    useEffect(() => set(initialValue), [])

    return { input: inputRef.current, getInput: setPartial }
}

export { useHandleInput }
