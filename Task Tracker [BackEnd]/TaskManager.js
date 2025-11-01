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
import inquirer from 'inquirer' // Terminal and Console Readig - listing, checkbox, selector, input (...)
import { select } from '@inquirer/prompts'
import { error, log } from 'node:console';
import { stringify } from 'node:querystring';
import { once } from 'node:events';
import { getRawInput } from 'readline-sync';
import { parse } from 'node:path';

export default class TaskManager {
constructor () {
  this.isReturningUser = false; // Powracajacy Uzytkownik
  this.inquirer = inquirer; // loading inquirer powers
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
 async menuUser () // Main Welcome Menu
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
      console.log(chalk.red.bold("Exiting Task Manager. Goodbye!"));
      this.rl.close();
      process.exit(0);
      break;
    default:
      console.log(chalk.red("Invalid option. Please try again."));
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

  // Functionality and Tasks Manipulation
  
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

 this.tasks.forEach(task => this.taskSummary(task));

  this.taskAnother()
}
  async taskAdd () { // Pushing New Task into JSON
    const taskName = await this.questionPrompt(chalk.cyan.bold("📢 Add Task: ")) // naprawic jezeli jest string "" wtedy task musi miec nazwwe
    if (taskName === '') {
      console.log(`❌ String cannot be Empty!`);
      return this.taskAdd()}

    const taskDescription = await this.questionPrompt(chalk.cyan.bold(`${taskName} - 📜 Add Description: `))
    const task = {
      id: this.randomID(),
      name: taskName,
      description: taskDescription,
      status: 'todo',
      createdAt: this.getFormattedDate(),
      updatedAt: this.getFormattedDate()
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
   async taskAnother () { // Adding Another Task or Returning to Menu

    const taskAnother = await this.questionPrompt(chalk.cyan.bold(`Add Another Task? (y/n). Press Q to Quit to Main Menu: `));

    if (taskAnother.toLowerCase() === 'y') {
      await this.taskAdd();
    } else if (taskAnother.toLowerCase() === 'n') {
      console.log(`Printing Task List...\n`);
      await this.taskList();
      this.menuUser();
    } else if (taskAnother.toLowerCase()=== 'q') {
      console.log(`Exiting to Main Menu...`);
      await this.menuUser();
    } else {
      console.log(`Invalid Input.\n`);
      await this.taskAnother()
    }
}
// Zastąp istniejącą metodę taskUpdate tą wersją
async taskUpdate() {
  try {
    // Wczytaj aktualny stan z pliku (metoda ma być już w klasie)
    await this.taskReader && typeof this.taskReader === 'function' ? await this.taskReader() : null;

    if (!Array.isArray(this.tasks) || this.tasks.length === 0) {
      console.log(chalk.yellow("📭 No tasks available to update."));
      return this.menuUser();
    }

    // Wypisz listę z numerami
    console.log(boxen(chalk.cyan.bold(`📋 ${this.username}'s Task List:`), {
      padding: 1, margin: 1, borderStyle: 'double', borderColor: 'cyan'
    }));
    this.tasks.forEach((t, i) => {
      console.log(`${i + 1}. ${chalk.green(t.name)} [${chalk.yellow(t.status)}]`);
    });

    // Zapytaj o numer zadania
    const raw = await this.questionPrompt(chalk.cyan.bold('📜 Podaj numer zadania do aktualizacji: '));
    const idx = Number(raw) - 1;

    if (Number.isNaN(idx) || idx < 0 || idx >= this.tasks.length) {
      console.log(chalk.red('❌ Nieprawidłowy numer. Wracam do menu.'));
      return this.menuUser();
    }

    // Pokaż wybrane zadanie krótko
    console.log(chalk.gray('\nWybrane zadanie:'));
    this.taskSummary(this.tasks[idx]);

    // Zapytaj o nowy status (używamy prostego input z walidacją)
    console.log(chalk.cyan('Dostępne statusy: 1) ToDo  2) InProgress  3) Done'));
    const rawStatus = await this.questionPrompt(chalk.cyan.bold('📜 Wybierz numer statusu (1-3): '));
    const statusMap = { '1': 'ToDo', '2': 'InProgress', '3': 'Done' };
    const newStatus = statusMap[rawStatus.trim()];

    if (!newStatus) {
      console.log(chalk.red('❌ Nieprawidłowy wybór statusu. Wracam do menu.'));
      return this.menuUser();
    }

    // Zaktualizuj
    this.tasks[idx].status = newStatus;
    this.tasks[idx].updatedAt = this.getFormattedDate();

    // Zapisz (użyj istniejącej taskWriter lub fs)
    if (this.taskWriter && typeof this.taskWriter === 'function') {
      this.taskWriter();
    } else {
      fs.writeFileSync(`${this.username}.json`, JSON.stringify(this.tasks, null, 2), 'utf-8');
    }

    console.log(chalk.green('✔ Task has been updated.'));
    return this.menuUser();
  } catch (err) {
    console.error(chalk.red('⚠️ Error in taskUpdate:'), err);
    return this.menuUser();
  }
}

// Zastąp istniejącą metodę taskDelete tą wersją
async taskDelete() {
  try {
    await this.taskReader && typeof this.taskReader === 'function' ? await this.taskReader() : null;

    if (!Array.isArray(this.tasks) || this.tasks.length === 0) {
      console.log(chalk.yellow("📭 No tasks available to delete."));
      return this.menuUser();
    }

    // Wypisz listę z numerami
    console.log(boxen(chalk.cyan.bold(`📋 ${this.username}'s Task List:`), {
      padding: 1, margin: 1, borderStyle: 'double', borderColor: 'cyan'
    }));
    this.tasks.forEach((t, i) => {
      console.log(`${i + 1}. ${chalk.green(t.name)} [${chalk.yellow(t.status)}]`);
    });

    // Zapytaj o numery do usunięcia (np. "1,3" lub pojedynczy numer)
    const raw = await this.questionPrompt(chalk.cyan.bold('📜 Podaj numer(y) zadania do usunięcia (np. 1 lub 1,3): '));
    const parts = raw.split(',').map(s => s.trim()).filter(s => s !== '');
    const indexes = parts.map(p => Number(p) - 1).filter(n => !Number.isNaN(n));

    if (indexes.length === 0) {
      console.log(chalk.yellow('❗ Nie wybrano poprawnych numerów. Wracam do menu.'));
      return this.menuUser();
    }

    // Walidacja: upewnij się, że wszystkie indexy mieszczą się w tablicy
    const invalid = indexes.some(i => i < 0 || i >= this.tasks.length);
    if (invalid) {
      console.log(chalk.red('❌ Jeden lub więcej numerów jest nieprawidłowy. Wracam do menu.'));
      return this.menuUser();
    }

    // Potwierdzenie przed usunięciem
    const names = indexes.map(i => this.tasks[i].name).join(', ');
    const confirm = await this.questionPrompt(chalk.cyan.bold(`⚠️ Potwierdź usunięcie: ${names} (y/n): `));
    if (confirm.toLowerCase() !== 'y') {
      console.log(chalk.yellow('Anulowano usuwanie. Wracam do menu.'));
      return this.menuUser();
    }

    // Usuń elementy od najwyższego indexu do najniższego, żeby nie rozjechały się indexy
    const uniqueSorted = Array.from(new Set(indexes)).sort((a, b) => b - a);
    for (const i of uniqueSorted) {
      this.tasks.splice(i, 1);
    }

    // Zapisz zmiany
    if (this.taskWriter && typeof this.taskWriter === 'function') {
      this.taskWriter();
    } else {
      fs.writeFileSync(`${this.username}.json`, JSON.stringify(this.tasks, null, 2), 'utf-8');
    }

    console.log(chalk.green('✔ Selected tasks have been deleted.'));
    return this.menuUser();
  } catch (err) {
    console.error(chalk.red('⚠️ Error in taskDelete:'), err);
    return this.menuUser();
  }
}

 async taskDelete() {
  
  try {
    // Wczytaj aktualne zadania z pliku (zakłada, że taskReader istnieje)
    if (this.taskReader && typeof this.taskReader === 'function') {
      await this.taskReader();
    }

    if (!Array.isArray(this.tasks) || this.tasks.length === 0) {
      console.log(chalk.yellow("📭 No tasks available to delete."));
      return this.menuUser();
    }

    // Wypisz listę z numerami
    console.log(boxen(chalk.cyan.bold(`📋 ${this.username}'s Task List:`), {
      padding: 1, margin: 1, borderStyle: 'double', borderColor: 'cyan'
    }));
    this.tasks.forEach((t, i) => {
      console.log(`${i + 1}. ${chalk.green(t.name)} [${chalk.yellow(t.status)}]`);
    });

    // Zapytaj o numery do usunięcia (np. "1,3" lub pojedynczy numer)
    const raw = await this.questionPrompt(chalk.cyan.bold('📜 Podaj numer(y) zadania do usunięcia (np. 1 lub 1,3): '));
    if (!raw) {
      console.log(chalk.yellow('❗ Nie podano żadnego numeru. Wracam do menu.'));
      return this.menuUser();
    }

    const parts = raw.split(',').map(s => s.trim()).filter(s => s !== '');
    const indexes = parts.map(p => Number(p) - 1).filter(n => !Number.isNaN(n));

    if (indexes.length === 0) {
      console.log(chalk.yellow('❗ Nie wybrano poprawnych numerów. Wracam do menu.'));
      return this.menuUser();
    }

    // Walidacja: upewnij się, że wszystkie indexy mieszczą się w tablicy
    const invalid = indexes.some(i => i < 0 || i >= this.tasks.length);
    if (invalid) {
      console.log(chalk.red('❌ Jeden lub więcej numerów jest nieprawidłowy. Wracam do menu.'));
      return this.menuUser();
    }

    // Potwierdzenie przed usunięciem
    const names = indexes.map(i => this.tasks[i].name).join(', ');
    const confirm = await this.questionPrompt(chalk.cyan.bold(`⚠️ Potwierdź usunięcie: ${names} (y/n): `));
    if (!confirm || confirm.toLowerCase() !== 'y') {
      console.log(chalk.yellow('Anulowano usuwanie. Wracam do menu.'));
      return this.menuUser();
    }

    // Usuń elementy od najwyższego indexu do najniższego, żeby nie rozjechały się indexy
    const uniqueSorted = Array.from(new Set(indexes)).sort((a, b) => b - a);
    for (const i of uniqueSorted) {
      this.tasks.splice(i, 1);
    }

    // Zapisz zmiany (użyj istniejącej taskWriter jeśli jest)
    if (this.taskWriter && typeof this.taskWriter === 'function') {
      this.taskWriter();
    } else {
      fs.writeFileSync(`${this.username}.json`, JSON.stringify(this.tasks, null, 2), 'utf-8');
    }

    console.log(chalk.green('✔ Selected tasks have been deleted.'));
    return this.menuUser();
  } catch (err) {
    console.error(chalk.red('⚠️ Error in taskDelete:'), err);
    return this.menuUser();
  }
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

   async taskSelectUpdate(tasks) {
  const choices = tasks.map((task, index) => ({
    name: `${index + 1}. ${chalk.green(task.name)} [${chalk.yellow(task.status)}]`,
    value: index
  }));

  const result = await this.inquirer.prompt([
    {
      type: 'list',
      name: 'selectedIndex',
      message: chalk.cyan.bold('📜Select a task:'),
      choices
    }
  ]);

  console.log("Selected index:", result.selectedIndex);
  return result.selectedIndex;
}


  async taskSelectDelete(tasks) { // Selecting Tasks to Delete + Display Checkbox List
  const choices = tasks.map((task, index) => ({
    name: `${index + 1}. ${task.name} [${task.status}]`,
    value: index
  }));

  const { selectedIndexes } = await this.inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedIndexes',
      message: chalk.cyan.bold('📜Select tasks to delete:'),
      choices
    }
  ]);

  return selectedIndexes;
}

async taskStatusSelect() { // Selecting Task Status [ToDo | In-Progress | Done]
  const choices = [
    { name: '💼 ToDo', value: 'ToDo' },
    { name: '✏ In Progress', value: 'InProgress' },
    { name: '✔ Done', value: 'Done' }
  ];

  const { selectedStatus } = await this.inquirer.prompt([
    {
      type: 'list',
      name: 'selectedStatus',
      message: chalk.cyan.bold('📜 Choose new status:'),
      choices
    }
  ]);

  return selectedStatus;
}


  taskReader () { // Reading Tasks from JSON File
    const filePath = `${this.username}.json`;
     const fileContent = fs.readFileSync(filePath, 'utf-8');
     this.tasks = JSON.parse(fileContent);
}
  taskWriter() { // Writing Tasks into JSON File
  fs.writeFileSync(`${this.username}.json`, JSON.stringify(this.tasks, null, 2));
}
  getFormattedDate() { // Formated Date
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} | ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

  taskSummary(task) { // Printing Task Informations
  console.log(chalk.green.bold(task.name));
  console.log(chalk.yellow(`Description: ${task.description}`));
  console.log(chalk.cyan(`Status: ${task.status}`));
  console.log(chalk.gray(`Created: ${task.createdAt}`));
  console.log(chalk.gray(`Updated: ${task.updatedAt}\n`));
}
}