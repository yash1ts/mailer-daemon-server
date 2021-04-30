import admin from 'firebase-admin';
import serviceAccount from '../admin-key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mailer-daemon-a2608.firebaseio.com'
});

export function formNotification(topic, title, body, image, action) {
  return {
    notification: {
      title,
      body,
      image,
      click_action: action
    },
    topic
  };
}

export async function sendMessageToTopic(message) {
  // Send a message to devices subscribed to the provided topic.
  return await admin.messaging().send(message).then(response => {
    // Response is a message ID string.
    console.log(response);
    return true;
  }).catch(error => {
    console.log('Error sending message:', error);
    return false;
  });
}

export const Topics = Object.freeze({
  PLACEMENT: 'placement',
  CAMPUS: 'campus',
  EVENTS: 'event',
  LNF: 'lnf'
});