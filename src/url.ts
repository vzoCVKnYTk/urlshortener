import mongodb from 'mongodb'
import mongoose from 'mongoose'
type Callback = (error: any, data?: any) => void;

export const initDB = (env: string) => {
}

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    url: { type: String, required: true },
});

const URL = mongoose.model("URL", urlSchema);



export const createAndSaveUrl = (urlString: string, done: Callback) => {
    const url = new URL({ url: urlString })
  
    url.save(function(err, data) {
        if(err) return done(err);
        done(null, data);
    });
}

export const findURLById = (id: string, done: Callback) => URL.findById(id, done);