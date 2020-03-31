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
  const host = req.body.url
  dns.lookup(host, (error, _address, _family) => {
    if (error) {
      console.log(error)
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
    if(err) { return (next(err)) }
    if(!data) {
      console.log('Missing `done()` argument')
      return next({message: 'Missing callback argument'})
    }
    findURLById(data.id, (findError, url) => {
      if(findError) { return next(findError)}
      res.json(url)
      url.remove()
    })
  })
  

  res.json({ url: req.body.url, short_url: 1 })
}

// your first API endpoint... 
app.post("/api/shorturl/new", dnsLookup, createShortUrl)

app.get("/api/shorturl/:id", (req, res) => {
  // Lookup id in mongo
  // findURLById()
  // Route to the url
})


app.listen(port, () => {
  console.log('Node.js listening ...')
})