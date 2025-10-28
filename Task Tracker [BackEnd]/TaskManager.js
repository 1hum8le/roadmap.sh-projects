//@ts-ignore
//@ts-nocheck
import readLine from 'readline'; // odczyt danych od uzytkownika w terminalu
import fs from 'fs';  // operacja na plikach (zapis, czytanie, aktualizacja JSON) 
import EventEmitter from 'events'; // zarzadzanie zdarzeniami
import path from 'path'; // bezpieczne budowanie sciezek plikow
import process from 'process'; // stdin, stdout, argv, exit()
import util from 'node:util' //konwersja funkcji callbackowych na "promisyfy"
import chalk from 'chalk'; // console.log(chalk.(..) syling )
import boxen from 'boxen'; // fancy boxes
import { error, log } from 'node:console';
import { stringify } from 'node:querystring';
import { once } from 'node:events';
import { getRawInput } from 'readline-sync';
import { parse } from 'node:path';

export default class TaskManager {
constructor () {

  this.eventEmitter = new EventEmitter();

  // User Data JSON Information
  // this.username = `./${this.username}.json`
  // this.username = this.task(parse(user))
  
  // Users-Related Files
  this.username = null;
  this.userFilePath = null;
 
  // Tasks Array
  this.tasks = [];

  // UI Messages
  this.welcomeMsg = chalk.yellow(`\nWelcome in my Task Manager! \n Press "Enter" to Continue!\n`)
  
  // ReadLine Interface
    this.rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
    });
  }

// Start + Walidation + User Data Storage

  start () { // User Welcoming Message
    this.rl.question(boxen(this.welcomeMsg,{padding: 1, margin: 1, borderStyle: 'double'}), (input) => {
      if (input === ''){
        // console.log(`Starting "userStart"`);
        this.userValidation()
        }
       else {
          console.log(`It must be "Enter" key to continue! \n`)
          return this.start();
        }


});}
  userValidation () { // User Registration Method
    this.rl.question(`Write your name.\n`, (username) => {
    if (username === '')
      { console.log(`Your name CANNOT be empty!\n Please, try again!`);
        return this.userValidation();

      } else if (fs.existsSync(`${username}.json`)) {
            console.log("User already Exist. Try again. \n");
            return this.userValidation();

      } else if (!fs.existsSync(`${username}.json`)) {
            console.log(`Creating new User: ${username} \n`);
            this.username = username;
          fs.writeFile(`${username}.json`, JSON.stringify(username), (error) => {
            if (error) {
              console.error("Error creating user file:", err);
            }
          });
          this.menuUser();
      }
    });


  };
  loadUserDate () {
    console.log(`user Data has been loaded`);
  }
  saveUserData() {
    console.log(`user Data has been saved`);
  }

  // Menu and Interactions (interface)
  menuUser () // Main Welcome Menu
  { // Showing Menu for User Method
    this.menuPrint()
    this.rl.question(`Choose an option: `, (answer) => {
  switch (answer) {
    case '1':
      this.taskList();
      break;
    case '2':
      this.taskAdd();
      break; 
    case '3':
      this.taskUpdate();
      break;
    case '4':
      this.taskDelete();
      break;
    case 'Q':
    case 'q':
      console.log("Exiting Task Manager. Goodbye!");
      this.rl.close();
      process.exit(0);
      break;
    default:
      console.log("Invalid option. Please try again.");
      this.menuUser();
      break;
  }
}
)


}
 menuPrint() { // Choosing Menu Options
  const header = (` Welcome ${this.username}! \n Choose your Option:\n`);

  const menu = `
  ${header}
[1] ${chalk.green('List of Tasks')}
[2] ${chalk.yellow('Add New Task')}
[3] ${chalk.cyan('Update Existing Task')}
[4] ${chalk.magenta('Delete Task')}
[Q] ${chalk.red('Quit')}
`;

  const boxedMenu = boxen(menu, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    align: 'center'
  });

  console.log(boxedMenu);
}

  // Funcjonality and Tasks Manipulation

  taskList () {

  }
  taskAdd () { // Pushing New Task into JSON
    this.task = [];
    const task = await this.questionPrompt("What do you need to do?\n", (taskName)=> {
       this.taskname = taskName;
      task.id = this.randomID();
      task.status = "In-Progress";
      task.createdAt = new Date().toISOString();
      task.updatedAt = new Date().toISOString();
    this.task.push(task);
    });

    const description = await this.questionPrompt(`${this.taskname} - what is a description (details)?`, (description)=> {
      task.description = description;
      this.task.push(task);
      this.fs.writeFile(`${this.username}.json`, JSON.stringify(this.task, null, 2), (error) => {
        if (error) {
          console.error(`Error saving task:`, error);
        } else {
          console.log(chalk.green(`✔ Task Added Successfully!\n`));
        }
    });
    const againQuestion = await this.questionPrompt(`Do you want to add another Task? (y/n)`, (answer)=> {
      if (answer.toLowerCase() === 'y') {
        this.taskAdd();
      } else if (answer.toLowerCase() === 'n') {
        this.menuUser();
      } else {
        console.log(`Wrong Typing!`);
        return againQuestion;
      }
    })
  });




}
  taskUpdate() { // Updating Task JSON Informations | In-Progress | Done



    console.log("halo");

  }
  taskDelete () { // Delete Existing Task from JSON
 console.log("halo");
 




}

  // Helping Functions

    randomID(){ // Generating Random ID
        return Number(Math.random().toString().slice(2, 10));
}
    questionPrompt(questionText) { // Geting user question => return answer (avoid callbackhell) | using example: `const username = await questionPrompt("What is your name? \n"); 
      return new Promise((resolve) => {
        this.rl.question(questionText, (answer) => {
        resolve(answer.trim());
     });
    });
  }
    



}


