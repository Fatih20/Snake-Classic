import { CellCoordinate, IAPIReturn, IDirectionToVector, makePossibleCoordinate, OppositeDirectionDictionaryType, possibleAPIMethodType } from "./types";
import { gridSize, originSite } from "../config";
import {
    possibleDirectionVector, } from "./types";
import axios from "axios";

export function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

export function randomizeFrom0ToNMinus1 (N : number) {
    return Math.floor(Math.random() * N)
}

export const directionToVectorDict : IDirectionToVector = {
    Up : possibleDirectionVector[0],
    Down : possibleDirectionVector[1],
    Right : possibleDirectionVector[2],
    Left : possibleDirectionVector[3],
}

export const oppositeDirectionDictionary : OppositeDirectionDictionaryType = {
    "Up" : "Down",
    "Down" : "Up",
    "Left" : "Right",
    "Right" : "Left"
}

export function allCoordinateMaker (gridSize : number) {
    let allCoordinateList = [] as CellCoordinate[];
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

const argumentToGetCookies = {headers: { 
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": `${originSite}`,
 }, withCredentials: true,}

// const argumentToGetCookies = {}


export async function errorHandlingWrapper (url : string, bodyData : any = {}, method : possibleAPIMethodType) {
    try {
        const response = await axios({...{method, url, data : bodyData }, ...argumentToGetCookies ?? {}});
        console.log(response);
        return {
            statusCode : response.status,
            isError : false,
            message : response.data?.message,
            error : null,
            retrievedData : response.data?.sentData
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