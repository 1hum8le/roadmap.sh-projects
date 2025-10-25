import EventEmitter from "EventEmitter"


const eventEmitter = new EventEmitter();
const taskName = document.getElementById('task-name')

let taskList = './tasks.json';

// let taskList =  {
//     "id":"",
//     "description":"",
//     "status":"",
//     "createdAt":"",
//     "updatedAt":"",
// }

function AddTask (task){
    eventEmitter.on(taskName, task => {

    })

}