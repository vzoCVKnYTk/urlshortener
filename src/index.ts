import express, { Request, Response, NextFunction} from 'express'
import mongo from 'mongodb'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dns from 'dns'
import { initDB, createAndSaveUrl, findURLById } from './url'

const app = express()

// Basic Configuration 
const port = process.env.PORT || 3000

/** this project needs a db !! **/ 
console.log(process.env)

mongoose.connect('mongodb+srv://klemai:V43AohgkBgKFYCa3G7WQoMihfzaEDXEpcB67sxWn83YzEdjE6AEA8jZeVwBaryyW@jc-freecodecamp-mongo-seo4v.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html')
})

const dnsLookup = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const originalUrl = new URL(req.body.url)
  dns.lookup(originalUrl.hostname, (error, _address, _family) => {
    if (error) {
      res.json({ error: "Invalid URL"})
    } else {
      next()
    }
  })
}

const createShortUrl = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // increment the id for the url
  const url = req.body.url

  createAndSaveUrl(url, (err, data) => {
    if(err) { 
      res.status(500).send('Internal Server Error')
    }
    if(!data) {
      console.log('Missing `done()` argument', data)
      res.status(500).send('Internal Server Error')
    }
    findURLById(data._id, (findError, urlObject) => {
      if(findError) { 
        res.status(404).send('Could not find the url you wanted')
      }
      res.json({ url: urlObject.url, short_url: urlObject._id })
    })
  })
}

// your first API endpoint... 
app.post("/api/shorturl/new", dnsLookup, createShortUrl)

app.get("/api/shorturl/:id", (req, res) => {
  // Lookup id in mongo
  findURLById(req.params.id, (findError, urlObject) => {
    if(findError) { 
      res.status(404).send('Could not find the url you wanted')
    }
    res.redirect(urlObject.url)
  })  
})

app.listen(port, () => {
  console.log('Node.js listening ...')
})