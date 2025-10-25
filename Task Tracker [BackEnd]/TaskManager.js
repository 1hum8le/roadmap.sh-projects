//@ts-ignore
//@ts-nocheck
import readLine from 'readline'; // odczyt danych od uzytkownika w terminalu
import fs from 'fs';  // operacja na plikach (zapis, czytanie, aktualizacja JSON) 
import EventEmitter from 'events'; // zarzadzanie zdarzeniami
import path from 'path'; // bezpieczne budowanie sciezek plikow
import process from 'process'; // stdin, stdout, argv, exit()
import util from 'node:util' //konwersja funkcji callbackowych na "promisyfy"
import { error, log } from 'node:console';
import { stringify } from 'node:querystring';
import { once } from 'node:events';
import { getRawInput } from 'readline-sync';

export default class TaskManager {
constructor () {

  this.ac = new AbortController();
  this.signal = this.ac.signal;
  this.eventEmitter = new EventEmitter();
  this.filePath = "./${username}";
  // User Data JSON Information

  this.taskJSON = {
    id:"",
    description:"",
    status:"",
    createdAt:"",
    updatedAt:"",
  }
  
  
    this.rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
    });
  }

  welcomeMessage () { // User Welcoming Message
    this.rl.question(`\nWelcome in my Task Manager! \n Press "Enter" to Continue!\n`, (input) => {
      if (input === ''){
        // console.log(`Starting "userStart"`);
        this.userStart()
        }
       else {
          console.log(`It must be "Enter" key to continue! \n`)
          return this.welcomeMessage();
        }
});}

  userStart () { // User Registration Method

    const filePath = `./${username}.json`

    this.rl.question(`Write your name.\n`, (username) => {
    if (username === '')
      { console.log(`Your name CANNOT be empty!\n Please, try again!`);
        return this.userStart();
      } else 
        { 
          if (fs.existsSync(`${username}.json`)) {
            console.log("User already Exist. Try again. \n");
            return this.userStart()
          } else
          fs.writeFile((this.filePath, (err) => {
            console.log(error)
          }))
          this.userMenu();   
        }
    });

};

  userMenu () // Main Welcome Menu
  { // Showing Menu for User Method
  console.log(`[1] List of Tasks`);
  console.log(`[2] Add new Task`);
  console.log(`[3] Update Existing Task`);
  console.log(`[4] Delete Task`);
  console.log(`[Q] Quit`);
  }
  addTask () { // Pushing New Task into JSON

  }
  updateTask() { // Updating Task JSON Informations | In-Progress | Done

  }
  deleteTask () { // Delete Existing Task from JSON

  }

    randomID(){
      return Math.Floor(Math.random(32).slice(2,10))
    }
}


