import { readable, writable } from "svelte/store";
import { baseAPIPath, initialLength, initialRefreshTime, numberOfFruitSpawned, recallingAPILimit, refreshTimeLowerBound } from "./config";
import { getSavedGame } from "./utilities/api";
import type {cellCoordinate, direction, IAPIReturn, ISavedGameInfo, possibleGameStateType } from "./utilities/types";
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
    const {subscribe, set, update} = writable((candidateSavedGame ?? initializeSavedGame()) as ISavedGameInfo);

    // function updateAndSave (propertyName : ISavedGameProperty, newValue : cellCoordinate[]| direction | number) {
    //     switch ()
    // }

    async function getServerData () : Promise<IAPIReturn> {
        return fetchDataRetry(async () => await getSavedGame(), 0, recallingAPILimit);
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
            "currentRefreshTime" : initialRefreshTime 
        } as ISavedGameInfo
    }

    function initializeSavedGame() {
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
            "currentRefreshTime" : initialRefreshTime
        } as ISavedGameInfo
    }

    function updateFruitPosition (newValue : cellCoordinate[]) {
        update(previousSavedGame => {
            localStorage.setItem("savedGame", JSON.stringify({...previousSavedGame, fruitPositionList : newValue}));
            return {...previousSavedGame, fruitPositionList : newValue};
        })
    }

    function updateWholeSnakeCoordinate (newValue : cellCoordinate[]) {
        update(previousSavedGame => {
            localStorage.setItem("savedGame", JSON.stringify({...previousSavedGame, wholeSnakeCoordinateList : newValue}));
            return {...previousSavedGame, wholeSnakeCoordinateList : newValue};  
    })}

    function updateDirection (newValue : direction) {
        update(previousSavedGame => {
            localStorage.setItem("savedGame", JSON.stringify({...previousSavedGame, direction : newValue}));
            return {...previousSavedGame, direction : newValue};  
        })
    }

    function updateScore (newValue : number) {
        update(previousSavedGame => {
            let newSavedGame = previousSavedGame;
            newSavedGame.score = newValue;
            localStorage.setItem("savedGame", JSON.stringify(newSavedGame));
            return newSavedGame;
        })
    }

    function updateFruitEaten (newValue : number) {
        update(previousSavedGame => {
            localStorage.setItem("savedGame", JSON.stringify({...previousSavedGame, fruitEaten : newValue}));
            return {...previousSavedGame, fruitEaten : newValue};  

        })
    }

    function decrementRefreshTime (decrementAmount : number) {
        update (previousSavedGame => {
            localStorage.setItem("savedGame", JSON.stringify({...previousSavedGame, currentRefreshTime : previousSavedGame.currentRefreshTime - decrementAmount}));
            return {...previousSavedGame, currentRefreshTime : previousSavedGame.currentRefreshTime - decrementAmount}
        })
    }

    function multiplyRefreshTime (multiplierAmount : number) {
        update (previousSavedGame => {
            const newRefreshTime = previousSavedGame.currentRefreshTime > refreshTimeLowerBound ? previousSavedGame.currentRefreshTime * multiplierAmount : previousSavedGame.currentRefreshTime;
            localStorage.setItem("savedGame", JSON.stringify({...previousSavedGame, currentRefreshTime : newRefreshTime}));
            return {...previousSavedGame, currentRefreshTime : newRefreshTime}
        })
    }

    function setDataFromServer (savedGameFromServer : ISavedGameInfo) {
        set({...savedGameFromServer, currentRefreshTime : savedGameFromServer.currentRefreshTime ?? initialRefreshTime,
        })
    }

    function reset () {
        localStorage.removeItem("savedGame");
        set(initializeSavedGame());
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("savedGame");
    }

    

    return {
        subscribe,
        set,
        updateScore,
        updateDirection,
        updateFruitEaten,
        updateFruitPosition,
        updateWholeSnakeCoordinate,
        decrementRefreshTime,
        multiplyRefreshTime,
        reset,
        removeFromLocalStorage,
        getServerData,
        setDataFromServer
    }
}

export const savedGame = createSavedGame();

function createFirstStart () {
    const {subscribe, set} = writable(fetchItemFromLocalStorage("savedGame") === undefined);
    return {
        subscribe,
        set
    }
}

export const firstStart = createFirstStart();
export const gameState = writable("loadingData" as possibleGameStateType);

export const isLoggedIn = writable(false);