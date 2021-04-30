import express from 'express';
import fetch from 'node-fetch';
import * as Database from './database.js';
import * as Fcm from './fcm.js';
import { isCovidTag, isLNFTag, isPlacementTag } from './utils.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(async (req, res, next) => {
  try {
    await Database.initialise();
  } catch (err) {
    console.log(err);
  }
  next();
});

function formatNotices(data) {
  const result = {};
  result.id = data.id;
  result.message = data.message;
  result.created_time = data.created_time;
  if (data.message_tags) {
    result.message_tags = data.message_tags.map(it => it.name);
  }
  result.permalink_url = data.permalink_url;
  result.photo = [];
  result.video = [];
  result.attachment = [];
  if (data.attachments && data.attachments.data[0].subattachments) {
    data.attachments.data[0].subattachments.data.forEach(it => {
      const attachment = {
        media: it.media,
        type: it.type
      };
      if (it.type.includes('photo')) {
        result.photo.push(attachment);
      } else if (it.type.includes('video')) {
        result.video.push(attachment);
      } else {
        result.attachment.push(attachment);
      }
    });
  }
  result.full_picture = data.full_picture;
  return result;
}

const token = 'EAAFy6i3ZALOYBAIoQ7ZCZCF4NTUwdkfMphQQTQU11WfG3teSLYNaDYlnHEmOdutRoyZCTKVTgp6qZBdQHmIDwIr5NKXBJnjZBdELbzHkcbTlXVGZCbcAcgj0ZBMdJmaCFfZAZAeJIHTuBzoO6FvbAb1P7lGPCeIVXsHygb04HRZAWkTi3lZALD70wLey';

app.get('/update/limit/:limit', async (req, res) => {
  const { limit } = req.params;
  if (!limit) {
    res.sendStatus(400);
    return;
  }
  const url = `https://graph.facebook.com/525664164162839?fields=posts.limit(${limit}){full_picture,story_tags,message,created_time,message_tags,permalink_url,attachments{subattachments}}&access_token=`;
  const result = await fetch(url + token).then(response => response.json()).then(data => data.posts.data).catch(error => {
    res.sendStatus(error.message);
    return [];
  });
  const placeData = [];
  const noticeData = [];
  const postsData = [];
  const LNFData = [];
  const latestPost = await Database.getLatest();
  for (let index = 0; index < result.length; index += 1) {
    const it = result[index];
    if (latestPost && it.created_time <= latestPost.created_time || it.created_time <= '2019-01-01T16:59:28+0000') {
      break;
    }
    postsData.push(it);
    if (it.message_tags && it.message_tags.length !== 0) {
      if (isPlacementTag(it.message_tags[0])) {
        placeData.push(it);
      } else if (isLNFTag(it.message_tags[0])) {
        LNFData.push(it);
      } else {
        noticeData.push(formatNotices(it));
      }
    } else {
      noticeData.push(formatNotices(it));
    }
  }
  Database.insertPosts(postsData);
  Database.insertNotices(noticeData);
  Database.insertPlaces(placeData);
  res.send(result);
});

app.get('/posts', (req, res) => {
  Database.readAllNotices().then(data => {
    res.send(data);
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
    res.status(400).json({ message: 'Bad Request' });
    return;
  }
  const success = await Fcm.sendMessageToTopic(message);
  if (success) {
    res.status(200).json({ message: 'Sent Successfully' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, async () => {
  console.log(`listening at https://md-app-server.herokuapp.com/:${PORT}`);
});