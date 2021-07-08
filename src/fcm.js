import admin from 'firebase-admin';
import { isLNFTag, isPlacementTag } from './utils';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: 'https://mailer-daemon-a2608.firebaseio.com',
});

export function formNotification(topic, title, body, image, action) {
  return {
    notification: {
      title,
      body,
      image,
      click_action: action,
    },
    topic,
  };
}

export async function sendNotification(post, tag) {
  let clickAction = 'NoticesActivity';
  let topic = 'campus';
  if (isPlacementTag(tag)) {
    clickAction = 'PlacementActivity';
    topic = 'placement';
  }
  if (isLNFTag(tag)) {
    clickAction = 'LostAndFoundActivity';
    topic = 'lnf';
  }
  const message = {
    android: {
      notification: {
        title: tag,
        body: post,
        click_action: clickAction,
      },
    },
    topic,
  };
  sendNotification(message);
}

export async function verfyToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken)
  const user = await admin.auth().getUser(decodedToken.uid)
  return true;
}

export async function sendMessageToTopic(message) {
  // Send a message to devices subscribed to the provided topic.
  return admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log(response);
      return true;
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      return false;
    });
}

export const Topics = Object.freeze({
  PLACEMENT: 'placement',
  CAMPUS: 'campus',
  EVENTS: 'event',
  LNF: 'lnf',
});
