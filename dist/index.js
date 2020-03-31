"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dns_1 = __importDefault(require("dns"));
const url_1 = require("./url");
const app = express_1.default();
// Basic Configuration 
const port = process.env.PORT || 3000;
/** this project needs a db !! **/
console.log(process.env);
mongoose_1.default.connect('mongodb+srv://klemai:V43AohgkBgKFYCa3G7WQoMihfzaEDXEpcB67sxWn83YzEdjE6AEA8jZeVwBaryyW@jc-freecodecamp-mongo-seo4v.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors_1.default());
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/public', express_1.default.static(process.cwd() + '/public'));
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
const dnsLookup = (req, res, next) => {
    const host = req.body.url;
    dns_1.default.lookup(host, (error, _address, _family) => {
        if (error) {
            console.log(error);
            res.json({ error: "Invalid URL" });
        }
        else {
            next();
        }
    });
};
const createShortUrl = (req, res, next) => {
    // increment the id for the url
    const url = req.body.url;
    url_1.createAndSaveUrl(url, (err, data) => {
        if (err) {
            return (next(err));
        }
        if (!data) {
            console.log('Missing `done()` argument');
            return next({ message: 'Missing callback argument' });
        }
        url_1.findURLById(data.id, (findError, url) => {
            if (findError) {
                return next(findError);
            }
            res.json(url);
            url.remove();
        });
    });
    res.json({ url: req.body.url, short_url: 1 });
};
// your first API endpoint... 
app.post("/api/shorturl/new", dnsLookup, createShortUrl);
app.get("/api/shorturl/:id", (req, res) => {
    // Lookup id in mongo
    // findURLById()
    // Route to the url
});
app.listen(port, () => {
    console.log('Node.js listening ...');
});
//# sourceMappingURL=index.js.map