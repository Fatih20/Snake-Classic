import { readable, writable } from "svelte/store";
import { baseAPIPath, initialLength, initialRefreshTime, numberOfFruitSpawned, recallingAPILimit, refreshTimeLowerBound } from "./config";
import { getSavedGame } from "./utilities/api";
import type {cellCoordinate, direction, IAPIReturn, ISavedGameInfo, possibleGameStateType, UpdateSavedGamePayload } from "./utilities/types";
import { allCoordinateList, fetchDataRetry, fetchItemFromLocalStorage } from "./utilities/utilities";
import { randomCoordinate, randomDirection, randomUniqueCoordinateGenerator, wholeSnakeCoordinateListInitialGenerator } from "./utilities/utilitiesCoreGame";

function createHighScore () {
    const candidateHighScore = fetchItemFromLocalStorage("highScore");
    const {subscribe, set} = writable(candidateHighScore ?? 0);

    function updateAndSave (newValue : number) {
        set(newValue);
        localStorage.setItem("highScore", JSON.stringify(newValue))
    }

    function setDataFromServer (dataFromServer : number) {
        set(dataFromServer ?? 0);
    }
    return {
        subscribe,
        updateAndSave,
        setDataFromServer
    }
}

function createLongestLength () {
    const candidateLongestLength = fetchItemFromLocalStorage("longestLength");
    const {subscribe, set} = writable(candidateLongestLength ?? 0);

    function updateAndSave (newValue : number) {
        set(newValue);
        localStorage.setItem("longestLength", JSON.stringify(newValue))
    }
    return {
        subscribe,
        updateAndSave
    }
}

export const gameIsPaused = writable(fetchItemFromLocalStorage("savedGame") !== undefined);

export const highScore = createHighScore();
export const longestLength = createLongestLength();

export const deviceWidth = readable(screen.width);

export const gameIsOver = writable(false);

function createSavedGame () {
    const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
    const {subscribe, set, update} = writable((candidateSavedGame ?? createNewSavedGame()) as ISavedGameInfo);

    async function getServerData () {
        return getSavedGame();
    }

    function createNewSavedGame () {
        const direction = randomDirection()
        const wholeSnakeCoordinateList = wholeSnakeCoordinateListInitialGenerator(
            randomCoordinate(),
            direction,
            initialLength
          );
        return {
            "direction" : direction,
            "wholeSnakeCoordinateList" : wholeSnakeCoordinateList,
            "fruitPositionList" :  randomUniqueCoordinateGenerator(
                wholeSnakeCoordinateList,
                allCoordinateList,
                numberOfFruitSpawned
              ),
            "fruitEaten" : 0,
            "score" : 0,
            "currentRefreshTime" : initialRefreshTime,
            "longestLength" : wholeSnakeCoordinateList.length,
            "highScore" : 0,
        } as ISavedGameInfo
    }

    function updatePartOfSavedGame (payload : UpdateSavedGamePayload) {
        update (previousSavedGame => {
            const overriderObject = {[payload.updatedValue] : payload.newValue};
            const newObject = {
                ...previousSavedGame,
                ...overriderObject
            }
            localStorage.setItem("savedGame", JSON.stringify(newObject));
            return newObject;
        })
    }

    function setDataFromServer (savedGameFromServer : ISavedGameInfo) {
        set({...savedGameFromServer, currentRefreshTime : savedGameFromServer.currentRefreshTime ?? initialRefreshTime,
        })
    }

    function reset () {
        localStorage.removeItem("savedGame");
        set(createNewSavedGame());
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("savedGame");
    }

    

    return {
        subscribe,
        reset,
        removeFromLocalStorage,
        getServerData,
        setDataFromServer,
        updatePartOfSavedGame
    }
}

export const savedGame = createSavedGame();

export const firstStart = writable(fetchItemFromLocalStorage("savedGame") === undefined);
export const gameState = writable("loadingData" as possibleGameStateType);

export const isLoggedIn = writable(false);