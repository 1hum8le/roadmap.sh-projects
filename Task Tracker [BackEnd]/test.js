// class Test {

// constructor () {

//     this.taskJSON = {
//     id:"",
//     description:"",
//     status:"",
//     createdAt:"",
//     updatedAt:"",
//   }


//  this.object = JSON.stringify(this.taskJSON)

// }

//  logTasks () {
//     console.log(`This is created JSON File:`);
//     console.log(this.taskJSON);
//     console.log(`This is striginified object: \n ${this.object}\n`);
//     }

// } 
// const t = new Test();
// t.logTasks()


class Test1 {
  constructor () {
      userMenu () // Main Welcome Menu
  { // Showing Menu for User Method
 this.rl.question(`Choose an option:\n`, (answer) => {
  this.printingMenu()
  switch (answer) {
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
  }
  printingMenu () { // Choosing Menu Options
  console.log(`[1] List of Tasks`);
  console.log(`[2] Add new Task`);
  console.log(`[3] Update Existing Task`);
  console.log(`[4] Delete Task`);
  console.log(`[Q] Quit`);
  }
}

