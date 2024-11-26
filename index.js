import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import cors from 'cors';
import shortuuid from 'short-uuid';
import stringSanitizer from "string-sanitizer";
import * as dataProvider from './providers/dataProvider.js';
import * as igdbProvider from './providers/igdbProvider.js';
import * as config from './config.js';

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_APP_ACCESS_TOKEN) {
    console.log("IGDB credentials not found. Please set TWITCH_CLIENT_ID and TWITCH_APP_ACCESS_TOKEN as environment variables");
    console.log("following the instructions located at https://api-docs.igdb.com/#account-creation");
    process.exit(1);
}

const games_library = config.getGamesLibraryLocation();

var app = express();
app.use('/', express.static(path.join(config.getRootPath(), 'public')));
app.use('/library', express.static(games_library));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
}));

app.set('port', process.env.PORT || 3001);

app.get('/api/games', async function(req, res, next) {
	var list = await dataProvider.listGames();
    res.json(list);
});

app.get('/api/game', async function(req, res, next) {
    if (req.query.gameId) {
        var game = await dataProvider.findGame(req.query.gameId);
        res.json(game);
    }
});

app.get('/api/gamemetadata', async function(req, res, next) {
    res.json(await igdbProvider.searchGame(req.query.gameName));
});

app.get('/api/companies', async function(req, res, next) {
    res.json(await dataProvider.listCompanies());
});

app.get('/api/searchCompanies', async function(req, res, next) {
    res.json(await dataProvider.searchCompanies(req.query.search));
});

app.get('/api/company', async function(req, res, next) {
    res.json(await dataProvider.findCompany(req.query.companyId));
});

app.get('/api/genres', async function(req, res, next) {
    res.json(await dataProvider.listGenres());
});


app.post('/api/create', async function(req, res, next) {
    if (!req.files || !req.files.file) {
        return res.status(422).send('No files were uploaded');
    }

    var game = getGameFromBody(req.body);
    // these props comes as arrays per form select
    game.developers = req.body.developers;
    game.publishers = req.body.publishers;
    game.genres = req.body.genres;

    game.id = shortuuid.generate();
    game.path = stringSanitizer.sanitize.keepNumber(game.name);
    dataProvider.saveNewGame(games_library, req.files.file, game);
    res.redirect('/settings.html?action=created');
});

app.post('/api/update', (req, res, next) => {
    var game = getGameFromBody(req.body);
    // these props comes as arrays per form select
    game.developers = req.body.developers;
    game.publishers = req.body.publishers;
    game.genres = req.body.genres;
    game.id = req.body.id;
    
    dataProvider.updateGame(game);
    res.redirect('/settings.html?action=updated');
});

app.delete('/api/delete', (req, res) => {
    dataProvider.deleteGame(games_library, req.query.gameId);
    res.json({"success": true});
});

const getGameFromBody = (body) => {
    var game = {};
    game.igdb_id = body.igdb_id;
    game.name = body.name;
    game.img = body.img;
    game.description = body.description;
    game.year = body.year;
    game.trailer = body.trailer;
    return game;
};

dataProvider.init().then(() => {
    app.listen(app.get('port'), function(err){
        if (err) {
            console.log("Error in server setup");
            exit(1);
        }
        console.log("Application ready. Server listening on port", app.get('port'));
    })
});
