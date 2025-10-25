class Test {

constructor () {

    this.taskJSON = {
    id:"",
    description:"",
    status:"",
    createdAt:"",
    updatedAt:"",
  }


 this.object = JSON.stringify(this.taskJSON)

}

 logTasks () {
    console.log(`This is created JSON File:`);
    console.log(this.taskJSON);
    console.log(`This is striginified object: \n ${this.object}\n`);
    }

} 

const t = new Test();

t.logTasks()