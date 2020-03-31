"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.initDB = (env) => {
};
const Schema = mongoose_1.default.Schema;
const urlSchema = new Schema({
    url: { type: String, required: true },
});
const URL = mongoose_1.default.model("URL", urlSchema);
exports.createAndSaveUrl = (urlString, done) => {
    const url = new URL({ url: urlString });
    url.save(function (err, data) {
        if (err)
            return done(err);
        done(null, data);
    });
};
exports.findURLById = (id, done) => URL.findById(id, done);
//# sourceMappingURL=url.js.map