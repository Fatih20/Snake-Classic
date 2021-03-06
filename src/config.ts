import type { IBindingsInfo } from "./utilities/types";

export const shootToProduction = true;
export const isInProduction = true;
export const gridSize = 20;
export const initialRefreshTime = 750;
export const refreshTimeDecrementEveryTurn = 1;
export const refreshTimeMultiplierEveryTurn = 0.995
export const refreshTimeLowerBound = 300;
export const numberOfFruitSpawned = 3;
export const turnIntervalBetweenFruitSpawn = 4;
export const numberOfTailAddedAfterEating = 1;
export const scoresAfterEveryFruit = 7;
export const initialLength = 4;
export const mainMenuTransitionDuration = 250;
export const loadPageTransitionDuration = 500;
export const delayUntilGameStarts = 500 + mainMenuTransitionDuration;
export const placeholderUsername = "snakeman69";
export const placeholderPassword = "5n4k3m4n69";
export const placeholderEmail = "snakeman69@420.com";
export const baseAPIPath = (shootToProduction ? "https://snake-classic-backend.herokuapp.com" : "http://localhost:5000");
export const recallingAPILimit = 5;
export const originSite = isInProduction ? "http://localhost:8080" : "https://imaginative-axolotl-a6f771.netlify.app/"
export const usernameCharacterLimit = 20;
export const durationOfSavingConfirmationMessage = 500;
export const saveInterval = 5000;
export const defaultBinding : IBindingsInfo = {Up : ["w", "ArrowUp"], Down : ["s", "ArrowDown"], Left : ["a", "ArrowLeft"], Right : ["d", "ArrowRight"]}