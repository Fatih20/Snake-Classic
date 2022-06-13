import { gridSize } from "../config";

export function makePossibleCoordinate(
    candidateCoordinate: number
  ): possibleCoordinateType {
    if (candidateCoordinate >= 1 && candidateCoordinate <= gridSize) {
      return candidateCoordinate as possibleCoordinateType;
    } else {
      throw new Error("The coordinate is not a valid coordinate");
    }
  }
export type possibleCoordinateType = number & { _type_: "possibleCoordinateType" };
export type cellCoordinate = {
    x: possibleCoordinateType,
    y : possibleCoordinateType
};

export const possibleDirection = ["Up", "Down", "Right", "Left"] as const;
export const possibleDirectionKey = [["W", "ArrowUp"], ["S", "ArrowDown"], ["D", "ArrowRight"], ["A", "ArrowLeft"]] as const;
export type direction = typeof possibleDirection[number];
export type directionKey = typeof possibleDirectionKey[number];

export function makePossibleVectorValue (candidateVectorValue : number) : directionVectorValue{
  if (candidateVectorValue >= -1 && candidateVectorValue <= 1) {
    return candidateVectorValue as directionVectorValue
  } else {
    throw new Error("This is not a valid direction vector value");
  }
}

export type directionVectorValue = number & {_type_ : "directionVectorValue"}

export type directionVectorTemplateType = {
  x : directionVectorValue,
  y : directionVectorValue
}

export const possibleDirectionVector = [
  {
    x : makePossibleVectorValue(0),
    y : makePossibleVectorValue(-1)
  },
  {
    x : makePossibleVectorValue(0),
    y : makePossibleVectorValue(1)
  },
  {
    x : makePossibleVectorValue(1),
    y : makePossibleVectorValue(0)
  },
  {
    x : makePossibleVectorValue(-1),
    y : makePossibleVectorValue(0)
  },
 ] as const

export type directionVectorType = typeof possibleDirectionVector[number];

interface directionPropertyType {
  keyList: directionKey,
  vectorValue : directionVectorType
}

export type directionsPropertyType = Record<direction, directionPropertyType>

const edgeCoordinateCornerList = ["above-radius", "bottom-radius", "left-radius", "right-radius"] as const;

export type edgeCoordinateCornerType = typeof edgeCoordinateCornerList[number];
// Direction is Up, Down, Right, Left
// DirectionVector is the element in possibleDirectionVector
// Direction key is "W", "S", "D", "A"

export type oppositeDirectionDictionaryType = Record<direction, direction>

export interface ISavedGameInfo {
  "direction" : direction,
  "wholeSnakeCoordinateList" : cellCoordinate[],
  "fruitPositionList" : cellCoordinate[],
  "fruitEaten" : number,
  "score" : number,
  "currentRefreshTime" : number,
  "highScore" : number,
  "longestLength" : number
}

export type ISavedGameProperty = keyof ISavedGameInfo;

const possibleGameState = [
  "startPage",
  "playing",
  "settings",
  "login",
  "signIn",
  "loadingData",
  "serverErrorOnInitialLoad"
] as const;
export type possibleGameStateType = typeof possibleGameState[number];

export interface ILoginInput {
  name : string,
  password : string
}

export interface IRegisterInput {
  name : string,
  email : string,
  password : string,
  savedGameInfo : ISavedGameInfo,
  achievement : IAchievementInfo
}

export interface IResponseData {
  message : string,
  error? : any,
}

export type IAPIReturn<RetrievedDataType = any> = {
  statusCode : number,
  isError : boolean,
  message : string,
  error : any,
  retrievedData : RetrievedDataType
}

const possibleAPIMethodList = ["post", "put", "get", "patch", "delete"] as const;
export type possibleAPIMethodType = typeof possibleAPIMethodList[number];

export interface IGetServerDataReturn {
  success : boolean,
  errorDueToServer : boolean,
}

export interface IUserData {
  username : string,
  id : number,
}

export interface IUserDataStore {
  username : string | undefined,
  id : number | undefined
}

export interface ILoginAndRegisterRetrievedData {
  userData : IUserData
}

export interface IGetSavedGameRetrievedData extends ILoginAndRegisterRetrievedData{
  savedGame : ISavedGameInfo,
  achievement : IAchievementInfo
}

export type errorHandlingWrapperType = (url: string, bodyData: any, method: possibleAPIMethodType) => Promise<IAPIReturn>

export interface IUpdateCurrentRefreshTimePayload {
  updatedValue : "currentRefreshTime",
  newValue : number
}

export interface IUpdateWholeSnakeCoordinateListPayload {
  updatedValue : "wholeSnakeCoordinateList",
  newValue : cellCoordinate[]
}

export interface IUpdateDirectionPayload {
  updatedValue : "direction",
  newValue : direction
}

export interface IUpdateFruitPositionListPayload {
  updatedValue : "fruitPositionList",
  newValue : cellCoordinate[]
}

export interface IUpdateFruitEatenPayload {
  updatedValue : "fruitEaten",
  newValue : number
}

export interface IUpdateScorePayload {
  updatedValue : "score",
  newValue : number
}

export type UpdateSavedGamePayload = IUpdateCurrentRefreshTimePayload | IUpdateDirectionPayload | IUpdateFruitEatenPayload | IUpdateFruitPositionListPayload | IUpdateScorePayload | IUpdateWholeSnakeCoordinateListPayload 

export interface IAchievementInfo {
  longestLength : number,
  highScore : number
}

export interface IUpdateHighScorePayload {
  updatedValue : "highScore",
  newValue : number
}

export interface IUpdateLongestLengthPayload {
  updatedValue : "longestLength",
  newValue : number
}

export type UpdateAchievementPayload = IUpdateHighScorePayload | IUpdateLongestLengthPayload

export type SavingText = "Saving" | "Game is saved"


