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
import figlet from 'figlet'; // fancy testing
import { error, log } from 'node:console';
import { stringify } from 'node:querystring';
import { once } from 'node:events';
import { getRawInput } from 'readline-sync';
import { parse } from 'node:path';

export default class TaskManager {
constructor () {

  this.isReturningUser = false; // Powracajacy Uzytkownik
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

// Start + Validation + User Data Storage

start() { // User Welcoming Message
  figlet('TaskManager', (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }

    console.log(data); // Show banner first

    this.rl.question(this.welcomeMsg,(input) => {
        if (input === '') {
          this.userValidation();
        } else {
          console.log(`It must be "Enter" key to continue! \n`);
          return this.start(); // Retry
        }
      }
    );
  });
}
  userValidation() {
  this.rl.question(chalk.cyan.bold("📝 Write your name: "), (username) => {
    if (username === '') {
      console.log(
        boxen(chalk.red.bold("❌ Your name CANNOT be empty!\nPlease, try again!"), {
          padding: 1,
          margin: 1,
          borderStyle: 'double',
          borderColor: 'red'
        })
      );
      return this.userValidation();
    }

    const filePath = `${username}.json`;

    if (fs.existsSync(filePath)) {
      console.log(
        boxen(chalk.green.bold(`👋 Welcome back, ${username}!`), {
          padding: 1,
          margin: 1,
          borderStyle: 'double',
          borderColor: 'green'
        })
      );
      this.isReturningUser = true;
      this.username = username;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      try {
        this.tasks = JSON.parse(fileContent);
      } catch (err) {
        console.error(chalk.red("⚠️ Error while parsing user file:"), err);
        this.tasks = [];
      }

      this.menuUser();
    } else {
      console.log(
        boxen(chalk.yellow.bold(`✨ Creating new user: ${username}`), {
          padding: 1,
          margin: 1,
          borderStyle: 'double',
          borderColor: 'yellow'
        })
      );
      this.username = username;
      this.isReturningUser = false;
      this.tasks = [];

      fs.writeFile(filePath, JSON.stringify(this.tasks, null, 2), (error) => {
        if (error) {
          console.error(chalk.red("⚠️ Error creating user file:"), error);
        }
      });

      this.menuUser();
    }
  });
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
})};

 menuPrint() { // Choosing Menu Options
  const headerText = this.isReturningUser ? `Welcome back ${this.username}!` : `Welcome ${this.username}`
  const header = (`${headerText} \n Choose your Option:\n`);
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

  // Funcjonality and Taasks Manipultion

  taskList() {

  const filePath = `${this.username}.json`;

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`❌ No task file found for ${this.username}.`));
    return this.menuUser();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  let tasks = [];

  try {
    tasks = JSON.parse(fileContent);
  } catch (err) {
    console.error(chalk.red("⚠️ Error parsing task file:"), err);
    return this.menuUser();
  }

  if (tasks.length === 0) {
    const noTasksMsg = boxen(chalk.yellow.bold("📭 No tasks yet.\nStart by adding one!"), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'yellow'
    });
    console.log(noTasksMsg);
    return this.taskAdd();
  }

  console.log(boxen(chalk.cyan.bold(`📋 ${this.username}'s Task List:`), {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan'
  }));

  tasks.forEach((task, index) => {
    console.log(chalk.green.bold(`${index + 1}. ${task.name}`));
    console.log(chalk.yellow(`   Description: ${task.description}`));
    console.log(chalk.cyan(`   Status: ${task.status}`));
    console.log(chalk.gray(`   Created: ${task.createdAt}`));
    console.log(chalk.gray(`   Updated: ${task.updatedAt}\n`));
  });

  this.taskAnother()

  }
  async taskAdd () { // Pushing New Task into JSON
    const taskName = await this.questionPrompt(chalk.cyan.bold("📢 Add Task: ")) // naprawic jezeli jest string "" wtedy task musi miec nazwwe
    const taskDescription = await this.questionPrompt(chalk.cyan.bold(`${taskName} - 📜 Add Description: `))
    const task = {
      id: this.randomID(),
      name: taskName,
      description: taskDescription,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };


    this.tasks.push(task);

    fs.writeFile(`${this.username}.json`, JSON.stringify(this.tasks, null, 2), (error) => {
      if (error) {
        console.error(`Error Saving Task:`, error);
      } else {
        console.log(chalk.green(`✔ Task Added Successfully!\n`))
      }
    })
    this.taskAnother()
  }

   async taskAnother () {

    const taskAnother = await this.questionPrompt(chalk.cyan.bold(`Add Another Task? (y/n)`));

    if (taskAnother.toLowerCase() === 'y') {
      await this.taskAdd();
    } else if (taskAnother.toLowerCase() === 'n') {
      console.log(`Returning to the Main Menu...`);
      await this.menuUser();
    } else {
      console.log(`Invalid Input.\n`);
      await this.taskAnother()
    }
}


  async taskUpdate() { // Updating Task JSON Informations | In-Progress | Done
    console.log("UPDATE task");
    this.taskMenu()
  }
  async taskDelete () { // Delete Existing Task from JSON
        console.log("delete task");
    this.taskMenu()
  }


  // Helping Functions

    randomID () { // Generating Random ID
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