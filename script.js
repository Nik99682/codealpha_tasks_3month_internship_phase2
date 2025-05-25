// Notifications
const notificationsBtn = document.getElementById('notifications-btn');
const notificationsPanel = document.getElementById('notifications-panel');
const closeNotificationsBtn = document.getElementById('close-notifications');

notificationsBtn.addEventListener('click', () => {
  notificationsPanel.classList.toggle('hidden');
});
closeNotificationsBtn.addEventListener('click', () => {
  notificationsPanel.classList.add('hidden');
});

// Friend Requests
const friendRequestsBtn = document.getElementById('friend-requests-btn');
const friendRequestsPanel = document.getElementById('friend-requests-panel');
const closeRequestsBtn = document.getElementById('close-requests');

friendRequestsBtn.addEventListener('click', () => {
  friendRequestsPanel.classList.toggle('hidden');
});
closeRequestsBtn.addEventListener('click', () => {
  friendRequestsPanel.classList.add('hidden');
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('accept-btn')) {
    alert(`You accepted ${e.target.parentElement.textContent.trim().split(' ')[0]}!`);
    e.target.parentElement.remove();
  }
});

// Post + Like + Dislike + Comment
document.getElementById('post-btn').addEventListener('click', () => {
  const content = document.getElementById('post-content').value.trim();
  if (content === '') {
    alert('Please write something before posting!');
    return;
  }

  const imageUrl = prompt('Optional: Enter image URL for your post (or leave blank):');

  const post = document.createElement('div');
  post.classList.add('post');
  post.innerHTML = `
    <h3>${document.getElementById('profile-name').textContent}</h3>
    <p>${content}</p>
    ${imageUrl ? `<img src="${imageUrl}" alt="Post Image" style="width:100%; margin-top:10px;">` : ''}
    <button class="like-btn">Like ❤️</button>
    <button class="dislike-btn">Dislike 💔</button>
    <div class="comments">
      <input type="text" placeholder="Add a comment..." class="comment-input">
      <button class="comment-btn">Comment</button>
      <ul class="comment-list"></ul>
    </div>
  `;

  document.getElementById('feed').prepend(post);
  document.getElementById('post-content').value = '';

  addNotification(`${document.getElementById('profile-name').textContent} added a new post!`);
});

function addNotification(text) {
  const notificationItem = document.createElement('li');
  notificationItem.textContent = text;
  document.getElementById('notifications-list').appendChild(notificationItem);
}

// Like + Dislike + Comments events
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('like-btn')) {
    e.target.textContent = "Liked ❤️";
    addNotification(`${document.getElementById('profile-name').textContent} liked a post!`);
  }

  if (e.target.classList.contains('dislike-btn')) {
    e.target.textContent = "Disliked 💔";
    addNotification(`${document.getElementById('profile-name').textContent} disliked a post!`);
  }

  if (e.target.classList.contains('comment-btn')) {
    const input = e.target.previousElementSibling;
    const comment = input.value.trim();
    if (comment === '') return;

    const ul = e.target.nextElementSibling;
    const li = document.createElement('li');
    li.textContent = comment;
    ul.appendChild(li);
    input.value = '';

    addNotification(`${document.getElementById('profile-name').textContent} commented on a post!`);
  }
});

// Chat Popup
const chatPopup = document.getElementById('chat-popup');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const closeChatBtn = document.getElementById('close-chat-btn');

document.getElementById('open-chat').addEventListener('click', () => {
  chatPopup.classList.remove('hidden');
});

sendChatBtn.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (message === '') return;

  const msgDiv = document.createElement('div');
  msgDiv.textContent = `You: ${message}`;
  chatMessages.appendChild(msgDiv);
  chatInput.value = '';

  setTimeout(() => {
    const replyDiv = document.createElement('div');
    replyDiv.textContent = 'Jane: Got your message!';
    chatMessages.appendChild(replyDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
});const chatContainer = document.getElementById('chat-container');
const friends = document.querySelectorAll('.friend');

function createChatWindow(friendName) {
  // Check if chat window already open
  if (document.getElementById(`chat-${friendName.replace(/\s/g, '-')}`)) {
    return; // already open
  }

  // Create chat window div
  const chatWindow = document.createElement('div');
  chatWindow.classList.add('chat-box');
  chatWindow.id = `chat-${friendName.replace(/\s/g, '-')}`;

  chatWindow.innerHTML = `
    <div class="chat-header">
      <span>${friendName}</span>
      <button class="minimize-btn">_</button>
      <button class="close-btn">x</button>
    </div>
    <div class="chat-messages"></div>
    <input type="text" class="chat-input" placeholder="Type a message" />
    <button class="send-chat-btn">Send</button>
  `;

  chatContainer.appendChild(chatWindow);

  const chatMessages = chatWindow.querySelector('.chat-messages');
  const chatInput = chatWindow.querySelector('.chat-input');
  const sendBtn = chatWindow.querySelector('.send-chat-btn');
  const closeBtn = chatWindow.querySelector('.close-btn');
  const minimizeBtn = chatWindow.querySelector('.minimize-btn');

  // Load saved chat from localStorage
  const savedChat = localStorage.getItem(`chat_${friendName}`);
  if (savedChat) {
    chatMessages.innerHTML = savedChat;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message event
  sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (!message) return;

    const msgDiv = document.createElement('div');
    msgDiv.textContent = `You: ${message}`;
    chatMessages.appendChild(msgDiv);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    saveChat(friendName, chatMessages.innerHTML);

    // Fake reply
    setTimeout(() => {
      const replyDiv = document.createElement('div');
      replyDiv.textContent = `${friendName}: Got your message!`;
      chatMessages.appendChild(replyDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      saveChat(friendName, chatMessages.innerHTML);
    }, 1000);
  });

  // Close button event
  closeBtn.addEventListener('click', () => {
    chatWindow.remove();
  });

  // Minimize button event
  minimizeBtn.addEventListener('click', () => {
    if (chatMessages.style.display === 'none') {
      chatMessages.style.display = 'block';
      chatInput.style.display = 'block';
      sendBtn.style.display = 'inline-block';
    } else {
      chatMessages.style.display = 'none';
      chatInput.style.display = 'none';
      sendBtn.style.display = 'none';
    }
  });
}

function saveChat(friendName, chatHtml) {
  localStorage.setItem(`chat_${friendName}`, chatHtml);
}

// Open chat when friend clicked
friends.forEach(friend => {
  friend.addEventListener('click', () => {
    createChatWindow(friend.dataset.name);
  });
});


closeChatBtn.addEventListener('click', () => {
  chatPopup.classList.add('hidden');
});
function createMessageElement(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message');

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text} <span class="timestamp">${time}</span>`;
  return msgDiv;
}
sendBtn.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (!message) return;

  const msgDiv = createMessageElement('You', message);
  chatMessages.appendChild(msgDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveChat(friendName, chatMessages.innerHTML);

  // Notify if minimized
  if (chatMessages.style.display === 'none') {
    notifyUser(friendName, message);
  }

  // Fake reply
  setTimeout(() => {
    const replyText = 'Got your message!';
    const replyDiv = createMessageElement(friendName, replyText);
    chatMessages.appendChild(replyDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChat(friendName, chatMessages.innerHTML);

    // Notify if minimized
    if (chatMessages.style.display === 'none') {
      notifyUser(friendName, replyText);
    }
  }, 1000);
});
function notifyUser(friendName, message) {
  // Visual notification: briefly highlight chat header
  const chatWindow = document.getElementById(`chat-${friendName.replace(/\s/g, '-')}`);
  if (!chatWindow) return;
  const header = chatWindow.querySelector('.chat-header');

  header.classList.add('notify');
  setTimeout(() => {
    header.classList.remove('notify');
  }, 1500);

  // Play notification sound
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  audio.play();

  // Optional: You can add badge count or browser notifications here too
}
function browserNotify(friendName, message) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(`New message from ${friendName}`, {
      body: message,
      icon: 'https://cdn-icons-png.flaticon.com/512/124/124021.png' // example icon
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        browserNotify(friendName, message);
      }
    });
  }
}
