import { baseAPIPath, recallingAPILimit } from "../config";
import type { IAPIReturn, IGetSavedGameRetrievedData, ILoginAndRegisterRetrievedData, ILoginInput, IRegisterInput } from "./types";
import { errorHandlingWrapper, fetchDataRetry } from "./utilities";

export async function logout () {
    console.log("Trying to logout");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/user/logout`, {}, "post"), 0, recallingAPILimit);
}

export async function login (loginInfo : ILoginInput) {
    console.log("Trying to login");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/user/login`, loginInfo, "post"), 0, recallingAPILimit) as IAPIReturn<ILoginAndRegisterRetrievedData>;
}

export async function register (registerInfo : IRegisterInput) {
    console.log("Trying to register");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/user/register`, registerInfo, "post"), 0, recallingAPILimit) as IAPIReturn<ILoginAndRegisterRetrievedData>;
}

export async function getSavedGame () {
    console.log("Trying to get saved game");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/gameData/mine`, {}, "get"), 0, recallingAPILimit) as IAPIReturn<IGetSavedGameRetrievedData>;
}