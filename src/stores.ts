import { readable, writable } from "svelte/store";
import { gridSize, initialLength, numberOfFruitSpawned } from "./config";
import type { blankSavedGame, cellCoordinate, direction, ISavedGameInfo, possibleGameStateType } from "./utilities/types";
import { allCoordinateMaker, fetchItemFromLocalStorage } from "./utilities/utilities";
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
                allCoordinateMaker(gridSize),
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
        set(initializeSavedGame());
        localStorage.removeItem("savedGame");
    }

    return {
        subscribe,
        updateScore,
        updateDirection,
        updateFruitEaten,
        updateFruitPosition,
        updateWholeSnakeCoordinate,
        reset
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