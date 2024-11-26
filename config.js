import * as url from 'url';
import path from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export function getRootPath() {
    return __dirname;
}

export function getBundleTemplatePath() {
    return __dirname + '/bundle_template';
}

export function getDbPath() {
    return './database';
}

export function getGamesLibraryLocation() {
    return path.join(process.env.GAMES_LIBRARY || (__dirname, '/app/wdosglibrary'));
}
