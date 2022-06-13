import { baseAPIPath, recallingAPILimit } from "../config";
import type { IAchievementInfo, IAPIReturn, IBindingsInfo, IGetSavedGameRetrievedData, ILoginAndRegisterRetrievedData, ILoginInput, IRegisterInput, ISavedGameInfo } from "./types";
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

export async function updateSavedGame (savedGame : ISavedGameInfo) {
    console.log("Trying to update saved game");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/gameData/mine/savedGame`, {
        "newSavedGame" : savedGame
    } as {"newSavedGame" : ISavedGameInfo}, "put"), 0, recallingAPILimit) as IAPIReturn<null>;
}

export async function updateAchievement (savedAchievement : IAchievementInfo) {
    console.log("Trying to update saved game");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/gameData/mine/achievement`, {
        "newAchievement" : savedAchievement
    } as {"newAchievement" : IAchievementInfo}, "put"), 0, recallingAPILimit) as IAPIReturn<null>;
}

export async function updateBindings (savedBindings : IBindingsInfo) {
    console.log("Trying to update saved game");
    return await fetchDataRetry(async () => await errorHandlingWrapper(`${baseAPIPath}/gameData/mine/bindings`, {
        "newBindings" : savedBindings
    } as {"newBindings" : IBindingsInfo}, "put"), 0, recallingAPILimit) as IAPIReturn<null>;
}