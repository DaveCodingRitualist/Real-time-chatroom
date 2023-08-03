
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,  collection, getDocs,
    addDoc, deleteDoc, doc, onSnapshot, 
    query, where,
    orderBy, serverTimestamp,
    getDoc,
    updateDoc
 } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoaNGIe40SGCpFC3N8bIAExxNW2zP08Qo",
  authDomain: "udemy-modern-javascript-f6dd0.firebaseapp.com",
  projectId: "udemy-modern-javascript-f6dd0",
  storageBucket: "udemy-modern-javascript-f6dd0.appspot.com",
  messagingSenderId: "796235468363",
  appId: "1:796235468363:web:763f86168681ac81e2c7ce"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

//collection ref
const colRef = collection(db, 'chats');

// CHATS

// adding new chat documents
// settings up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = colRef; 
        this.unsub;
    }
    async addChat(message){
        // format a chat object
        const chat = {
            message,
            username: this.username, 
            room: this.room, 
            created_at: serverTimestamp()
            
        }; 
        // save the chat document
        const response = await addDoc(this.chats, chat);
        return response;

    }
    
    getChats(callback){
            // queries chaining
            const q = query(colRef, where('room', '==', this.room), orderBy('created_at'));
            this.unsub = onSnapshot( q, snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){  //(changes type are either added or removed )
                        //update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }
    udpdateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }
        
    }
}

// UI
class ChatUI {
    constructor(list){
        this.list = list;
    }
    clear(){
        this.list.innerHTML = '';
    }
    render(data){
        const when = dateFns.distanceInWordsToNow(
            data.created_at.toDate(),
            { addSuffix: true }
        )
        const html = `
            <li class="list-group-item border>
            <span class="username">${data.username}</span>
            <span class="message">${data.message}</span>
            <div class="time">${ when }</div>
            </li>
        `;
        this.list.innerHTML += html
    }
}

// dom queries
const chatlist = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');

//add a new chat
newChatForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = newChatForm.message.value.trim();
    chatroom.addChat(message)
        .then(() => newChatForm.reset())
        .catch(err => console.log(err))
})

// Update the name
newNameForm.addEventListener('submit', e => {
    e.preventDefault();
    const newName = newNameForm.name.value.trim();

    //update name via chatroom
    chatroom.updateName(newName);

    //rest the form
    newNameForm.reset();

    // Show then hide the update message
    updateMssg.innerText = `your name was updated to ${newName}`
    setTimeout(() =>  updateMssg.innerText = '', 3000);
});

// update chat room
rooms.addEventListener('click', e => {
 if(e.target.tagName === 'BUTTON'){
    chatUI.clear()
    chatroom.udpdateRoom(e.target.getAttribute('id'));
    chatroom.getChats(chat => chatUI.render(chat));
 }
});

// check a local storage for name
const username = localStorage.username ? localStorage.username : 'unknown';
// class instances

const chatUI = new ChatUI(chatlist);
const chatroom = new Chatroom('general', username);

// get chats render
chatroom.getChats(data => chatUI.render(data));


