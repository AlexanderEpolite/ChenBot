#!

import {SingleWorker} from "discord-rose";
import {readFileSync} from "fs";

const secrets = JSON.parse(readFileSync("./secrets.json").toString());

const worker = new SingleWorker({
    token: secrets.token,
    intents: 1539, //guilds, guild members, guild messages, and guild message reactions
});

const emoji_roles_map = new Map<string, string>();
// emoji_roles_map.set("🟢", "930965888700678216"); //junior (🟢)
emoji_roles_map.set("🔴", "930965946158432346"); //senior (🔴)

emoji_roles_map.set("🔵", "1011045603528167444"); //hybrid (🔵)
emoji_roles_map.set("🟠", "1011045541842518129"); //in person (🟠)

emoji_roles_map.set("🟣", "1061919256230494269"); //Balasooriya (🟣)
// emoji_roles_map.set("🟢", "1020443675026800670"); //Altunkaya (🟢)
emoji_roles_map.set("🟦", "1020444262908829706"); //Chen (blue square: 🟦)

const emote_roles_map = new Map<string, string>();
emote_roles_map.set("930966776072777770", "930966018812153856"); //rider
emote_roles_map.set("930966775758209024", "930966120024907817"); //vs
emote_roles_map.set("930966774852255784", "930967696688967690"); //mac
emote_roles_map.set("930966775460397116", "930967669962866698"); //windows

worker.on("MESSAGE_REACTION_ADD", async (r) => {
    
    //three messages for roles
    if(r.message_id !== "930969230084546641" 
        && r.message_id !== "1061919018434433054"
        && r.message_id !== "1146125919606542346"
    ) return;
    
    const user_id = r.user_id;
    
    if(!r.emoji.id) { //built in emoji
        let role = emoji_roles_map.get(r.emoji.name as string) as string;
        
        //since :green_circle: exists on two messages, differentiate between them
        if(!role) {
            if(r.message_id === "930969230084546641") { //junior
                role = "930965888700678216";
            } else if(r.message_id === "1061919018434433054") { //altunkaya
                role = "1020443675026800670";
            } else {
                return;
            }
        }
    
        console.log(`added ${role} to ${user_id}`);
        
        await worker.api.members.addRole("915466119370907649", user_id, role);
    } else if(!!r.emoji.id) { //custom server emote
        let role = emote_roles_map.get(r.emoji.id);
        
        console.log(`added ${role} to ${user_id}`);
        
        await worker.api.members.addRole("915466119370907649", user_id, role);
    }
});

worker.on("MESSAGE_REACTION_REMOVE", async (r) => {
    if(r.message_id !== "930969230084546641"
        && r.message_id !== "1061919018434433054"
        && r.message_id !== "1146125919606542346"
    ) return;
    
    const user_id = r.user_id;
    
    if(!r.emoji.id) { //built in emoji
        let role = emoji_roles_map.get(r.emoji.name as string) as string;
        
        //since :green_circle: exists on two messages, differentiate between them
        if(!role) {
            if(r.message_id === "930969230084546641") { //junior
                role = "930965888700678216";
            } else if(r.message_id === "1061919018434433054") { //altunkaya
                role = "1020443675026800670";
            } else {
                return;
            }
        }
        
        console.log(`removed ${role} from ${user_id}`);
        
        await worker.api.members.removeRole("915466119370907649", user_id, role);
    } else if(!!r.emoji.id) { //custom server emote
        const role = emote_roles_map.get(r.emoji.id);
        
        if(!role) return;
    
        console.log(`removed ${role} from ${user_id}`);
        
        await worker.api.members.removeRole("915466119370907649", user_id, role);
    }
});


worker.start();
