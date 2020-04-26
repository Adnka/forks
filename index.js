const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const _ = require('lodash')
const app = express()
app.use(bodyParser.json({ limit: '50mb' }))

app.post("/github", async function(req,res){
    try{
        const response = await axios.get(`https://api.github.com/repos/${req.body.repo}/forks`)
        var maped = response.data.map(o => {
            return {
                forkUrl: o.forks_url,
                forkName: o.full_name,
                stars: o.stargazers_count,
                forkOwnerLogin: o.owner.login,
                searchUrl : `https://github.com/search?p=1&q=${o.name}&type=Repositories`,
                isFavorite:false,
            }
        })
        const parsed = parseLink(response.headers.link)
        var count = parseInt(parsed.last[parsed.last.length-1])
        res.send({
            "links":parsed,
            "forks":maped,
            count
        })
    }catch(e){
        console.log(e)
    }
})

app.post("/url", async function(req,res){
    try{
        const response = await axios.get(`${req.body.url}`)
        const page = req.body.page
        var maped = response.data.map(o => {
            return {
                forkUrl: o.forks_url,
                forkName: o.full_name,
                stars: o.stargazers_count,
                forkOwnerLogin: o.owner.login,
                searchUrl : `https://github.com/search?p=${page}&q=${o.name}&type=Repositories`,
                isFavorite:false
            }
        })
        const parsed = parseLink(response.headers.link)
        res.send({
            "links":parsed,
            "forks":maped,
            // count
        })
    }catch(e){
        console.log(e)
    }
})

function parseLink(header) {
    if (header.length == 0) {
      throw new Error("input must not be of zero length");
    }
  
    var parts = header.split(',');
    var links = {};
    _.each(parts, function(p) {
      var section = p.split(';');
      if (section.length != 2) {
        throw new Error("section could not be split on ';'");
      }
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });
  
    return links;
  }

app.listen(3000, ()=>{
    console.log("Server has been started")
})
