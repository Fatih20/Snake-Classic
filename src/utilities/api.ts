import axios from "axios";
import { baseAPIPath } from "../config";
import type { IAPIReturn, ILoginInput, IRegisterInput } from "./types";
import { errorHandlingWrapper } from "./utilities";

export async function logout () {
    console.log("Trying to logout");
    return await errorHandlingWrapper(`${baseAPIPath}/user/logout`);
}

export async function login (loginInfo : ILoginInput) {
    console.log("Trying to login");
    return await errorHandlingWrapper(`${baseAPIPath}/user/login`, loginInfo)
}

export async function register (registerInfo : IRegisterInput) {
    console.log("Trying to register");
    return await errorHandlingWrapper(`${baseAPIPath}/user/register`, registerInfo)
}