import { gridSize } from "../config";

export function makePossibleCoordinate(
    candidateCoordinate: number
  ): PossibleCoordinateType {
    if (candidateCoordinate >= 1 && candidateCoordinate <= gridSize) {
      return candidateCoordinate as PossibleCoordinateType;
    } else {
      throw new Error("The coordinate is not a valid coordinate");
    }
  }
export type PossibleCoordinateType = number & { _type_: "possibleCoordinateType" };
export type CellCoordinate = {
    x: PossibleCoordinateType,
    y : PossibleCoordinateType
};

export const possibleDirection = ["Up", "Down", "Right", "Left"] as const;

export type Direction = typeof possibleDirection[number];

export function makePossibleVectorValue (candidateVectorValue : number) : DirectionVectorValue{
  if (candidateVectorValue >= -1 && candidateVectorValue <= 1) {
    return candidateVectorValue as DirectionVectorValue
  } else {
    throw new Error("This is not a valid direction vector value");
  }
}

export type DirectionVectorValue = number & {_type_ : "directionVectorValue"}

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

export type DirectionVectorType = typeof possibleDirectionVector[number];

export type IDirectionToVector = Record<Direction, DirectionVectorType>
export type IBindingsInfo = Record<Direction, string[]>

const possibleBindingListOperation = ["remove", "add"] as const;

export type BindingListOperation = typeof possibleBindingListOperation[number];

export interface IChangeBindingsPayload {
  action : "remove" | "add",
  payload : string
}

// export interface IChangeBindingsPayloadWhole {
//   action : "overwrite",
//   payload : string[]
// }

export interface UpdateBindingsPayload extends IChangeBindingsPayload {
  updatedDirection : Direction;
}

const edgeCoordinateCornerList = ["above-radius", "bottom-radius", "left-radius", "right-radius"] as const;

export type EdgeCoordinateCornerType = typeof edgeCoordinateCornerList[number];
// Direction is Up, Down, Right, Left
// DirectionVector is the element in possibleDirectionVector
// Direction key is "W", "S", "D", "A"

export type OppositeDirectionDictionaryType = Record<Direction, Direction>

export interface ISavedGameInfo {
  "direction" : Direction,
  "wholeSnakeCoordinateList" : CellCoordinate[],
  "fruitPositionList" : CellCoordinate[],
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
  achievement : IAchievementInfo,
  bindings : IBindingsInfo,
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
  achievement : IAchievementInfo,
  bindings : IBindingsInfo,
}

export type errorHandlingWrapperType = (url: string, bodyData: any, method: possibleAPIMethodType) => Promise<IAPIReturn>

export interface IUpdateCurrentRefreshTimePayload {
  updatedValue : "currentRefreshTime",
  newValue : number
}

export interface IUpdateWholeSnakeCoordinateListPayload {
  updatedValue : "wholeSnakeCoordinateList",
  newValue : CellCoordinate[]
}

export interface IUpdateDirectionPayload {
  updatedValue : "direction",
  newValue : Direction
}

export interface IUpdateFruitPositionListPayload {
  updatedValue : "fruitPositionList",
  newValue : CellCoordinate[]
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

export type DirectionBeingChangedType = Direction | "";
