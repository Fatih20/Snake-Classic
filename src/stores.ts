import { readable, writable } from "svelte/store";
import {defaultBinding, initialLength, initialRefreshTime, numberOfFruitSpawned } from "./config";
import { getSavedGame, updateSavedGame } from "./utilities/api";
import type { Direction, IAchievementInfo, IBindingsInfo, InitialBindingType, ISavedGameInfo, IUserData, IUserDataStore, possibleGameStateType, UpdateAchievementPayload, UpdateSavedGamePayload } from "./utilities/types";
import { allCoordinateList, fetchItemFromLocalStorage, updateBindingFirstElement } from "./utilities/utilities";
import { randomCoordinate, randomDirection, randomUniqueCoordinateGenerator, wholeSnakeCoordinateListInitialGenerator } from "./utilities/utilitiesCoreGame";

export const deviceWidth = readable(screen.width);

function createSavedGame () {
    const {subscribe, set, update} = writable(fetchSavedGameFromLocalStorage());

    async function getServerData () {
        return getSavedGame();
    }

    function fetchSavedGameFromLocalStorage() {
    const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
    return (candidateSavedGame ?? createNewSavedGame()) as ISavedGameInfo;
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
        } as ISavedGameInfo
    }

    function updatePartOfSavedGame (payload : UpdateSavedGamePayload, isLoggedIn : boolean) {
        update (previousSavedGame => {
            const overriderObject = {[payload.updatedValue] : payload.newValue};
            const newObject = {
                ...previousSavedGame,
                ...overriderObject
            }
            if (!isLoggedIn) {
                localStorage.setItem("savedGame", JSON.stringify(newObject));
            }
            return newObject;
        })
    }

    function setDataFromServer (savedGameFromServer : ISavedGameInfo) {
        set({...savedGameFromServer, currentRefreshTime : savedGameFromServer.currentRefreshTime ?? initialRefreshTime,
        })
    }

    async function reset (isLoggedIn : boolean) {
        const newSavedGame = createNewSavedGame();
        if (!isLoggedIn) {
            localStorage.removeItem("savedGame");
        } else {
            updateSavedGame(newSavedGame);
        }
        set(newSavedGame);
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("savedGame");
    }

    return {
        subscribe,
        reset,
        set,
        removeFromLocalStorage,
        getServerData,
        setDataFromServer,
        updatePartOfSavedGame,
        fetchSavedGameFromLocalStorage
    }
}

function createAchievement () {
    const {subscribe, set, update} = writable(fetchAchievementFromLocalStorage());

    function fetchAchievementFromLocalStorage() {
        const candidateAchievement = fetchItemFromLocalStorage("achievement");
        const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
        return (candidateAchievement ?? createNewAchievement(
            (candidateAchievement === undefined ? 0 : (candidateSavedGame as ISavedGameInfo).wholeSnakeCoordinateList.length)
        )) as IAchievementInfo
    }

    async function getServerData () {
        return getSavedGame();
    }

    function createNewAchievement (length = 0) {
        return {
            "highScore" : 0,
            "longestLength" : length
        } as IAchievementInfo
    }

    function updatePartOfAchievement (payload : UpdateAchievementPayload, isLoggedIn : boolean) {
        update (previousSavedGame => {
            const overriderObject = {[payload.updatedValue] : payload.newValue};
            const newObject = {
                ...previousSavedGame,
                ...overriderObject
            }
            if (!isLoggedIn) {
                localStorage.setItem("achievement", JSON.stringify(newObject));
            }
            return newObject;
        })
    }

    function setDataFromServer (savedGameFromServer : IAchievementInfo) {
        set({...savedGameFromServer})
    }

    function reset () {
        localStorage.removeItem("achievement");
        set(createNewAchievement());
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("achievement");
    }

    return {
        subscribe,
        reset,
        set,
        fetchAchievementFromLocalStorage,
        removeFromLocalStorage,
        getServerData,
        setDataFromServer,
        updatePartOfAchievement
    }
}

function createBindings () {
    const {subscribe, set, update} = writable(fetchBindingsFromLocalStorage());

    function fetchBindingsFromLocalStorage() {
        const candidateBindings = fetchItemFromLocalStorage("bindings");
        return (candidateBindings ?? defaultBinding) as IBindingsInfo
    }

    async function getServerData () {
        return getSavedGame();
    }

    function changeFirstElementPartOfBindings (newKey : string, changedDirection : Direction, isLoggedIn : boolean) {
        update (previousBinding => {
            const newBinding =  updateBindingFirstElement(newKey, changedDirection, previousBinding); 
            if (!isLoggedIn) {
                localStorage.setItem("bindings", JSON.stringify(newBinding));
            }
            return newBinding;
        })
    }

    function setDataFromServer (savedGameFromServer : IBindingsInfo) {
        set({...savedGameFromServer})
    }

    function reset () {
        localStorage.removeItem("bindings");
        set(defaultBinding);
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("bindings");
    }

    return {
        subscribe,
        reset,
        set,
        fetchBindingsFromLocalStorage,
        removeFromLocalStorage,
        getServerData,
        setDataFromServer,
        changeFirstElementPartOfBindings
    }
}

export const savedGame = createSavedGame();
export const achievement = createAchievement();

export const firstStart = writable(fetchItemFromLocalStorage("savedGame") === undefined);
export const gameState = writable("loadingData" as possibleGameStateType);
export const isLoggedIn = writable(false);
export const gameIsPaused = writable(fetchItemFromLocalStorage("savedGame") !== undefined);
export const gameIsOver = writable(false);
export const modalOpen = writable(false);
export const initialBindingModalJustOpened = writable(null as InitialBindingType);

export const userData = writable({username : "Anonymous", id : undefined} as (IUserDataStore | IUserData))
export const bindings = createBindings();

export const savedGameStale = writable(false);
export const achievementStale = writable(false);
