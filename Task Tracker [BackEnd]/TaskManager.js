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

export default class TaskManager {
constructor () {

  this.ac = new AbortController();
  this.signal = this.ac.signal;
  this.eventEmitter = new EventEmitter();
  // User Data JSON Information
  
  this.taskJSON = {
    id:"",
    description:"",
    status:"",
    createdAt:"",
    updatedAt:"",
  }
  this.welcomeMsg = chalk.yellow(`\nWelcome in my Task Manager! \n Press "Enter" to Continue!\n`)
  this.username = `./${this.username}.json`


    this.rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
    });
  }

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
          this.userMenu();
      }
    });
};

  userMenu () // Main Welcome Menu
  { // Showing Menu for User Method
    this.printingMenu()

 this.rl.question(`Choose an option: `, (answer) => {
  switch (menu) {
    case '1':
      this.listTasks();
      break;
    case '2':
      this.addTask();
      break; 
    case '3':
      this.updateTask();
      break;
    case '4':
      this.deleteTask();
      break;
    case 'Q':
    case 'q':
      console.log("Exiting Task Manager. Goodbye!");
      this.rl.close();
      process.exit(0);
      break;
    default:
      console.log("Invalid option. Please try again.");
      this.userMenu();
      break;
  }
}
)
  }

 printingMenu() { // Choosing Menu Options
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

  addTask () { // Pushing New Task into JSON

  }
  updateTask() { // Updating Task JSON Informations | In-Progress | Done

  }
  deleteTask () { // Delete Existing Task from JSON

  }

    randomID(){ // Generating Random ID
      return Math.floor(Math.random(32).slice(2,10))
    }
}


