import { ContentMessage } from './types'

chrome.runtime.onMessage.addListener(function (
  msg: ContentMessage, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
): boolean {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
  return true; // Keep the message channel open for async responses
});
