import FetchActivity from "../src/fetchActivity";
import FormatActivity from "../src/formatActivity";
import Utils from "../src/utils";
import { argv } from 'node:process';

export async function run() {
    const username = argv[2]}
    if(!username) return handleError(`You must give a GitHub Username`)

        try {
            const events = await FetchActivity(username);
            const output = FormatActivity(events);
            console.log(output);
            
        } catch (err){
            handleError(err.message)
        }