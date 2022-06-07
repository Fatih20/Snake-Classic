import { baseAPIPath } from "../config";
import type { ILoginInput, IRegisterInput } from "./types";
import { errorHandlingWrapper } from "./utilities";

export async function logout () {
    console.log("Trying to logout");
    return await errorHandlingWrapper(`${baseAPIPath}/user/logout`, {}, "post");
}

export async function login (loginInfo : ILoginInput) {
    console.log("Trying to login");
    return await errorHandlingWrapper(`${baseAPIPath}/user/login`, loginInfo, "post")
}

export async function register (registerInfo : IRegisterInput) {
    console.log("Trying to register");
    return await errorHandlingWrapper(`${baseAPIPath}/user/register`, registerInfo, "post")
}

export async function getSavedGame () {
    console.log("Trying to get saved game");
    return await errorHandlingWrapper(`${baseAPIPath}/api/mine`, {}, "get")
}