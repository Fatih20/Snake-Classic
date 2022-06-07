import { readable, writable } from "svelte/store";
import { baseAPIPath, initialLength, numberOfFruitSpawned, recallingAPILimit } from "./config";
import { getSavedGame } from "./utilities/api";
import type {cellCoordinate, direction, ISavedGameInfo, possibleGameStateType } from "./utilities/types";
import { allCoordinateList, errorHandlingWrapper, fetchItemFromLocalStorage } from "./utilities/utilities";
import { randomCoordinate, randomDirection, randomUniqueCoordinateGenerator, wholeSnakeCoordinateListInitialGenerator } from "./utilities/utilitiesCoreGame";

function createHighScore () {
    const candidateHighScore = fetchItemFromLocalStorage("highScore");
    const {subscribe, set} = writable(candidateHighScore ?? 0);

    function updateAndSave (newValue : number) {
        set(newValue);
        localStorage.setItem("highScore", JSON.stringify(newValue))
    }
    return {
        subscribe,
        updateAndSave
    }
}

export const gameIsPaused = writable(fetchItemFromLocalStorage("savedGame") !== undefined);

export const highScore = createHighScore();

export const deviceWidth = readable(screen.width);

export const gameIsOver = writable(false);

function createSavedGame () {
    const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
    const {subscribe, set, update} = writable((candidateSavedGame ?? initializeSavedGame()) as ISavedGameInfo);

    // function updateAndSave (propertyName : ISavedGameProperty, newValue : cellCoordinate[]| direction | number) {
    //     switch ()
    // }

    async function getServerDataRecursive (attemptsAtCallingAPI : number = 0) {
        const response = await getSavedGame();
        if (response.isError) {
            if (response.statusCode >= 500){
                if (attemptsAtCallingAPI <= recallingAPILimit){
                    return await getServerDataRecursive(attemptsAtCallingAPI + 1)
                } else {
                    return response;
                }
            } else {
                return response;
            }
        }
        return response;
    }

    async function getServerData () {
        const response = await getServerDataRecursive(0);
        if (!response.isError) {
            // set()
            return { success : true } as { success : boolean};
        } else {
            return {success : false} as {success : boolean };
        }
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

    function reset () {
        localStorage.removeItem("savedGame");
        set(initializeSavedGame());
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("savedGame");
    }

    return {
        subscribe,
        updateScore,
        updateDirection,
        updateFruitEaten,
        updateFruitPosition,
        updateWholeSnakeCoordinate,
        reset,
        removeFromLocalStorage,
        getServerData
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
export const gameState = writable("startPage" as possibleGameStateType);

export const isLoggedIn = writable(false);