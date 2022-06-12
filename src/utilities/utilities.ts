import { blankSavedGame, cellCoordinate, direction, directionVectorType, errorHandlingWrapperType, IAPIReturn, ISavedGameInfo, ISavedGameNone, ISavedGameProperty, makePossibleCoordinate, makePossibleVectorValue, oppositeDirectionDictionaryType, possibleAPIMethodType } from "./types";
import { gridSize } from "../config";
import { directionsPropertyType,
    possibleDirectionKey,
    possibleDirectionVector, } from "./types";
import axios from "axios";

export function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

export function randomizeFrom0ToNMinus1 (N : number) {
    return Math.floor(Math.random() * N)
}

export const directionsProperty: directionsPropertyType = {
    Up: {
      keyList: possibleDirectionKey[0],
      vectorValue: possibleDirectionVector[0],
    },
    Down: {
      keyList: possibleDirectionKey[1],
      vectorValue: possibleDirectionVector[1],
    },
    Right: {
      keyList: possibleDirectionKey[2],
      vectorValue: possibleDirectionVector[2],
    },
    Left: {
      keyList: possibleDirectionKey[3],
      vectorValue: possibleDirectionVector[3],
    },
  };

export const oppositeDirectionDictionary : oppositeDirectionDictionaryType = {
    "Up" : "Down",
    "Down" : "Up",
    "Left" : "Right",
    "Right" : "Left"
}

export function allCoordinateMaker (gridSize : number) {
    let allCoordinateList = [] as cellCoordinate[];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            allCoordinateList.push({x : makePossibleCoordinate(i), y : makePossibleCoordinate(j)})
        }
    }
    return allCoordinateList;
}

export const allCoordinateList = allCoordinateMaker(gridSize)

export function fetchItemFromLocalStorage (key : string){
    let candidateResult = localStorage.getItem(key);
    if (candidateResult !== undefined && candidateResult !== null) {
        return JSON.parse(candidateResult)
    } else {
        return undefined
    }
}

export function isSavedGameUndefined(savedGame : ISavedGameNone | ISavedGameInfo) {
    return (JSON.stringify(savedGame) === JSON.stringify(blankSavedGame))
}

// const argumentToGetCookies = {headers: { 'Content-Type': 'application/json' }, withCredentials: true,}

const argumentToGetCookies = {}


export async function errorHandlingWrapper (url : string, bodyData : any = {}, method : possibleAPIMethodType) {
    try {
        const response = await axios({...{method, url, data : bodyData }, ...argumentToGetCookies ?? {}});
        console.log(response);
        return {
            statusCode : response.status,
            isError : true,
            message : response.data?.message,
            error : null,
            retrievedData : response.data
        } as IAPIReturn;

    } catch (error) {
        console.log(error);
        return {
            statusCode : error.response.status,
            isError : true,
            message : error.response.data?.message,
            error : error,
            retrievedData : null
        } as IAPIReturn;
    }
}

export async function fetchDataRetry (functionToCall : () => Promise<IAPIReturn>, timesFunctionIsCalled : number, limitOfCalling : number) : Promise<IAPIReturn>{
    const response = await functionToCall();
    if (response.statusCode < 500) {
        return response;
    }

    if (timesFunctionIsCalled < limitOfCalling) {
        return fetchDataRetry(functionToCall, timesFunctionIsCalled + 1, limitOfCalling)
    }

    return response;
}   