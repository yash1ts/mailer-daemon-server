'use strict';

import express from 'express';
import fetch from 'node-fetch';
import DataStore from 'nedb';

const app = express();
const PORT = 3000;

const PlacementStore = new DataStore({ filename: './place.json', autoload: true }),
  CampusStore = new DataStore({ filename: './campus.json', autoload: true }),
  TokenStore = new DataStore({ filename: './token.json', autoload: true});

const TAGS = {
  PLACEMENT : "#PlacementDaemon",
  PLACEMENT2 : "#PlacementDeamon",
  PLACEMENT3 : "#PlacemntDaemon",
}

var token = "EAAFy6i3ZALOYBAIoQ7ZCZCF4NTUwdkfMphQQTQU11WfG3teSLYNaDYlnHEmOdutRoyZCTKVTgp6qZBdQHmIDwIr5NKXBJnjZBdELbzHkcbTlXVGZCbcAcgj0ZBMdJmaCFfZAZAeJIHTuBzoO6FvbAb1P7lGPCeIVXsHygb04HRZAWkTi3lZALD70wLey";
const url = "https://graph.facebook.com/525664164162839?fields=posts.limit(4){full_picture,story_tags,message,created_time,message_tags,permalink_url,attachments{subattachments}}&access_token=";
app.get('/update', async (req, res) => {
    // token=TokenStore.getCandidates();
    const response = await fetch(url+token).then((response)=>response.json()).then((data)=>{
      return data.posts.data;
    }).catch((error)=>{
      res.send(error.message);
    });
    response.forEach((it)=>{
      if(it.message_tags[0].name===TAGS.PLACEMENT||it.message_tags[0].name===TAGS.PLACEMENT2){
        PlacementStore.insert(it);
      }else{
        CampusStore.insert(it);
      }
    });
    res.send(response);
});

app.get('/posts',(req,res)=>{
  res.send(CampusStore.getAllData());
})

app.get('/updateToken', async (req,res)=>{
  TokenStore.insert(req);
  res.send('ok');
})

app.get('/place',(req,res)=>{
  res.send(PlaceStore.getAllData());
})

app.listen(PORT, () => {
  console.log(`listening at https://md-app-server.herokuapp.com/:${PORT}`)
});
