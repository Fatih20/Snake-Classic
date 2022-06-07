import axios from "axios";
import { baseAPIPath } from "../config";
import type { ILoginInput, IRegisterInput } from "./types";

export async function logout () {
    const response = await axios.post(`${baseAPIPath}/user/logout`);
    console.log(response);
}

export async function login (loginInfo : ILoginInput) {
    console.log("Trying to login")
    try {
        const response = await axios.post(`${baseAPIPath}/user/login`, loginInfo);
    } catch (error) {
        console.log(error.response.status)
        // console.log(error.response.data);
    }
}

export async function register (registerInfo : IRegisterInput) {
    console.log("Trying to register");
    try {
        const response = await axios.post(`${baseAPIPath}/user/login`, registerInfo);
    } catch (error) {
        console.log(error)
    }
}