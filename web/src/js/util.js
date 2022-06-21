import React from "react";
import { useHistory, useLocation } from "react-router";

const lockScroll = (isLock) => {
    const body = document.getElementsByTagName('body');

    body[0].style.overflow = isLock ? 'hidden' : '';
}

const pushPath = (history, append) => {
    let currentPath = history.location.pathname;

    const len = currentPath.length;

    if (currentPath[len - 1] == '/') {
        currentPath = currentPath.slice(0, len - 1);
    }

    history.push(`${currentPath}/${append}`);
}

const popPath = (history) => {
    let currentPath = history.location.pathname

    const len = currentPath.length;

    if (currentPath[len - 1] == '/') {
        currentPath = currentPath.slice(0, len - 1)
    }

    for (let i = currentPath.length - 2; i >= 0; i--) {
        if (currentPath[i] == "/") {
            currentPath = currentPath.slice(0, i)
            break
        }
    }

    history.push(`${currentPath}`)
}

// change current path and save previous path, add a new search param
const appendParam = (history, append) => {
    let currentPath = history.location.pathname;
    const search = history.location.search;

    const len = currentPath.length;

    if (currentPath[len - 1] == '/') {
        currentPath = currentPath.slice(0, len - 1);
    }

    if (search == "") {
        append = "?" + append;
    }
    else {
        append = "&" + append;
    }

    history.push(currentPath + search + append);
}

const changeUrlParam = (history, key, newQuery) => {
    let currentPath = history.location.pathname;
    const search = history.location.search;

    const len = currentPath.length;

    if (currentPath[len - 1] == '/') {
        currentPath = currentPath.slice(0, len - 1);
    }

    const keyLength = key.length

    let newSearch = search
    let replacedStr

    for (let i = search.indexOf(key) + keyLength + 1; i < search.length; i++) {
        if (search[i] == "&" || i == search.length - 1) {
            replacedStr = search.substring(search.indexOf(key) + keyLength + 1, i + 1)
            break
        }
    }

    newSearch = search.replace(replacedStr, newQuery)

    history.push({
        pathname: currentPath,
        search: newSearch
    })

    // history.push(currentPath + newSearch);
}

// const changePath = (history, newPath) => {
//     history.replace(newPath);
// }

// replace current path, push new path to stack, able to redirect to previous path
const changePath = (history, newPath) => {
    history.push(newPath);
}

const changeWholePath = (history, newPath) => {
    history.replace(`/${newPath}`);
}

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const setLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const setSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
}

const getSessionStorage = (key) => {
    return JSON.parse(sessionStorage.getItem(key));
}

const removeSessionStorage = (key) => {
    sessionStorage.removeItem(key)
}

const isLocalStorageKeyExist = (key) => {
    return localStorage.getItem(key) != null
}

const isNullOrUndefined = (obj) => {
    return obj == null || obj == undefined
}

const getCurrentDate = () => {
    var today = new Date();
    var dateStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    return dateStr;
}

const convertDate = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var d = new Date(date);
    var dateStr = monthNames[d.getMonth() + 1] + " " + d.getDate() + ", " + d.getFullYear();

    return dateStr;
}

const gradientPropeties = () => {
    const keep = Math.floor(Math.random() * 3);

    let start = {};
    let step = {};

    for (let i = 0; i < 3; i++) {
        if (i != keep) {
            start[i] = 50 + Math.floor(Math.random() * 50);
            step[i] = (Math.random() * (0.20 - 0.0200) + 0.0200).toFixed(1);
        }
        else {
            start[i] = 255;
            step[i] = 0
        }
    }

    return { start: start, step: step }
}

const gradientColor = (i, start, step) => {
    // const c = "#" + Math.floor(Math.random()*16777215).toString(16);
    // const c = "#" + (0x1000000+(i*step)*0xffffff).toString(16).substr(1,6)
    // console.log(c);

    const r = Math.min(start[0] + (i * step[0]) * 255, 255);
    const g = Math.min(start[1] + (i * step[1]) * 255, 255);
    const b = Math.min(start[2] + (i * step[2]) * 255, 255);

    const c = `rgb(${r},${g},${b})`

    return c
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const obj2Array = (obj) => {
    return Object.values(obj)
}

const changeColorAlpha = (hexStr, hexAlpha) => {
    hexStr = hexStr.substring(1)
    if (hexStr.length == 3) return "#".concat(hexStr).concat(hexStr).concat(hexAlpha)
    if (hexStr.length == 6) return "#".concat(hexStr).concat(hexAlpha)
}

const formatTime = (time) => {
    if (time < 10) return `0${time}`
    else return time
}

const toHumanDate = (timestamp) => {
    const d = new Date(Number(timestamp))
    const hour = formatTime(d.getHours())
    const min = formatTime(d.getMinutes())

    return `${hour}:${min}, ${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`
}

const clipText = (text) => {
    if (text.length < 100) return text

    for (let i = 0; i < text.length; i++) {
        if (i < 100) continue
        if (text[i] == " ") return text.substring(0, i).concat("...")
    }
}

const asyncWithTimeout = (fun, timeout) => {
    return new Promise(
        (resolve, reject) => {
            fun.then(resolve, reject)

            setTimeout(() => reject("Connection Error"), timeout)
        })
}

const getFileStructure = (paths, types) => {
    let path, allFoldersAndFiles = []

    for (let i = 0; i < paths.length; i++) {
        path = paths[i].split("/")

        for (let j = 0; j < path.length; j++) {
            if (allFoldersAndFiles[`level${j}`] == undefined) {
                allFoldersAndFiles[`level${j}`] = []
            }

            allFoldersAndFiles[`level${j}`].push({
                name: path[j],
                // type: j == path.length - 1 ? "file" : "folder"
                type: types[i]
            })
        }
    }

    return allFoldersAndFiles
}

const removePropertyFromObject = (obj, prop) => {
    let res = Object.assign({}, obj)
    delete res[prop]
    return res
}

const randomNumber = (numDigit) => {
    return Math.floor(Math.pow(10, numDigit) + Math.random() * 9 * Math.pow(10, numDigit))
}

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer)
    console.log(arr);
    var str = String.fromCharCode.apply(String, arr)
   
    return str
}

function stringToArrayBuffer(str){
    var arr = new Uint8Array(str.length);
    for(var i=str.length; i--; )
        arr[i] = str.charCodeAt(i);
    return arr.buffer;
}

export {
    lockScroll, pushPath, popPath, appendParam, changeUrlParam, changePath, changeWholePath, useQuery,
    setLocalStorage, getLocalStorage, isLocalStorageKeyExist, setSessionStorage,
    getSessionStorage, removeSessionStorage, isNullOrUndefined, getCurrentDate, convertDate, gradientPropeties, gradientColor, capitalizeFirstLetter,
    obj2Array, changeColorAlpha, toHumanDate, clipText, asyncWithTimeout, getFileStructure, removePropertyFromObject, randomNumber,
    arrayBufferToString, stringToArrayBuffer
}
