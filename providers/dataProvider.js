import fs from 'fs';
import * as dbManager from '../data/dbManager.js';
import * as config from '../config.js';

const template_path = config.getBundleTemplatePath();

export async function listGames() {
  return await dbManager.listGames();
}

export async function listCompanies() {
  return await dbManager.listCompanies();
}

export async function listGenres() {
  return await dbManager.listGenres();
}

export async function searchCompanies(searchTerm) {
  return await dbManager.searchCompanies(searchTerm);
}

export async function findCompany(id) {
  return await dbManager.findCompany(id);
}

export async function findGame(gameId) {
  return await dbManager.fetchGame(gameId);
}

export async function saveNewGame(gamesLibrary, file, game) {
  // TODO Validate if exists, then throw an error
  fs.mkdirSync(`${gamesLibrary}/${game.path}`);
  file.mv(`${gamesLibrary}/${game.path}/bundle.jsdos`);
  fs.copyFileSync(`${template_path}/index.html`, `${gamesLibrary}/${game.path}/index.html`);
  fs.copyFileSync(`${template_path}/game.html`, `${gamesLibrary}/${game.path}/game.html`);
  return await dbManager.saveNewGame(game);
}

export async function updateGame(game) {
  return await dbManager.updateGame(game);
}

export async function deleteGame(gamesLibrary, gameId) {
  return await dbManager.deleteGame(gamesLibrary, gameId);
}

export async function init() {
  return dbManager.init();
}

export default init;