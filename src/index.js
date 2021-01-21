'use strict';

import express from 'express';
import fetch from 'node-fetch';
import {insertPosts, insertPlaces, readAllPosts} from './database.js';

const app = express();
const PORT = process.env.PORT || 80;
// const PORT = 3000;

const TAGS = {
  PLACEMENT : "#PlacementDaemon",
  PLACEMENT2 : "#PlacementDeamon",
  PLACEMENT3 : "#PlacemntDaemon",
}

var token = "EAAFy6i3ZALOYBAIoQ7ZCZCF4NTUwdkfMphQQTQU11WfG3teSLYNaDYlnHEmOdutRoyZCTKVTgp6qZBdQHmIDwIr5NKXBJnjZBdELbzHkcbTlXVGZCbcAcgj0ZBMdJmaCFfZAZAeJIHTuBzoO6FvbAb1P7lGPCeIVXsHygb04HRZAWkTi3lZALD70wLey";
const url = "https://graph.facebook.com/525664164162839?fields=posts.limit(20){full_picture,story_tags,message,created_time,message_tags,permalink_url,attachments{subattachments}}&access_token=";
app.get('/update', async (req, res) => {
    const response = await fetch(url+token).then((response)=>response.json()).then((data)=>{
      return data.posts.data;
    }).catch((error)=>{
      res.send(error.message);
    });
    const placeData = [], postData = [];
    response.forEach((it)=>{
      if(it.message_tags&&(it.message_tags[0].name===TAGS.PLACEMENT||it.message_tags[0].name===TAGS.PLACEMENT2)){
        placeData.push(it);
      }else{
        postData.push(it);
      }
    });
    insertPosts(postData);
    insertPlaces(placeData);
    res.send(response);
});

app.get('/posts',(req,res)=>{
  readAllPosts().then(
    data=>{
      res.send({data});
    }
  ).catch(error=>{console.log(error)});
})

app.get('/place',(req,res)=>{
  readAllPlaces().then(
    data=>{
      res.send({data});
    }
  ).catch(error=>{console.log(error)});
})

app.listen(PORT, () => {
  console.log(`listening at https://md-app-server.herokuapp.com/:${PORT}`)
});
