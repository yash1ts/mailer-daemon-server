'use strict';

import express from 'express';
import fetch from 'node-fetch';
import * as Database from './database.js';
import * as Fcm from './fcm.js';

const app = express();
app.use(express.json());
// const PORT = process.env.PORT || 80;
const PORT = 3000;

const TAGS = {
  PLACEMENT: "#PlacementDaemon",
  PLACEMENT2: "#PlacementDeamon",
  PLACEMENT3: "#PlacemntDaemon"
};

var token = "EAAFy6i3ZALOYBAIoQ7ZCZCF4NTUwdkfMphQQTQU11WfG3teSLYNaDYlnHEmOdutRoyZCTKVTgp6qZBdQHmIDwIr5NKXBJnjZBdELbzHkcbTlXVGZCbcAcgj0ZBMdJmaCFfZAZAeJIHTuBzoO6FvbAb1P7lGPCeIVXsHygb04HRZAWkTi3lZALD70wLey";

app.get('/update/limit/:limit', async (req, res) => {
  const limit = req.params.limit;
  if (!limit) {
    res.sendStatus(400);
    return;
  }
  const url = `https://graph.facebook.com/525664164162839?fields=posts.limit(${limit}){full_picture,story_tags,message,created_time,message_tags,permalink_url,attachments{subattachments}}&access_token=`;
  const response = await fetch(url + token).then(response => response.json()).then(data => {
    return data.posts.data;
  }).catch(error => {
    res.sendStatus(error.message);
    return [];
  });
  const placeData = [],
        postData = [];
  response.forEach(it => {
    if (it.message_tags && it.message_tags.length !== 0 && (it.message_tags[0].name === TAGS.PLACEMENT || it.message_tags[0].name === TAGS.PLACEMENT2)) {
      placeData.push(it);
    } else {
      postData.push(it);
    }
  });
  Database.insertPosts(postData);
  Database.insertPlaces(placeData);
  res.send(response);
});

app.get('/posts', (req, res) => {
  Database.readAllPosts().then(data => {
    res.send({ data });
  }).catch(error => {
    console.log(error);
  });
});

app.get('/place', (req, res) => {
  Database.readAllPlaces().then(data => {
    res.send(data);
  }).catch(error => {
    console.log(error);
  });
});

app.post('/push', async (req, res) => {
  const message = req.body;
  if (!Object.values(Fcm.Topics).includes(message.topic)) {
    res.send(400);
    return;
  }
  const success = await Fcm.sendMessageToTopic(message);
  if (success) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`listening at https://md-app-server.herokuapp.com/:${PORT}`);
});