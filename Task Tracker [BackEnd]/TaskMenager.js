// @ts-nocheck
// @ts-ignore
import readline from 'readline-sync';
import fs from 'fs';

    let tasksList = [""];

    const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
    });



function addTask (){

    tasksList = readline.question('What Task:')

}    


// console.log(addTask())
console.log(`Your task is to ${addTask()}`);

