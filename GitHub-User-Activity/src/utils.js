import fs from 'node:fs'

export default class Utils {
    constructor (){
    }

    jsonLoad(username){
        try {
        const raw = fs.readFileSync(`./cache/${username}.json`, 'utf-8');
        return JSON.parse(raw); }

        catch (err) {
            console.error(`Error with Loading .JSON File - ${err}`);
        }
    }
    jsonSave(username, response){
        try{
            fs.writeFileSync(`./cache/${username}.json`, JSON.stringify(response, null, 2)); 
    } catch (err){
        console.error(`Error with Saving .JSON File - ${err}`);    
    }
    }
}