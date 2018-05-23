"use strict";

class GameOfDice{
    constructor(){
        //check user ip for session
        /*this.ajax("https://api.ipify.org?format=json", "GET")
            .then(data => 
                this.ajax("localhost:6789/db/sessionid/" + this.hash(JSON.parse(data).ip), "GET")
            )*/
        
        this.bindEvents();
    }
        
    bindEvents(){
        this.grab("registerBtn").addEventListener("click", (e) =>{
            this.toggleHidden("loginView", "registerView");
        });
        
        this.grab("backBtn").addEventListener("click", (e) => {
            this.toggleHidden("registerView", "loginView");
        });
        
        this.grab("loginBtn").addEventListener("click", (e) => {
            
            let uname = this.grab("unameInput");
            let pw = this.grab("pwInput");
            
            if(uname.value.length == 0){ return this.popup("No username inserted!", "error"); }
            if(pw.value.length == 0){ return this.popup("No password inserted!", "error")}  
            
            this.ajax("http://localhost:6789/db/auth/user/" + uname.value + "/pw/" + this.hash(pw.value), "GET")
                .then(data => {
                    if(data != "bad pw" && data != "error" && data != "no user"){
                        this.toggleHidden("loginView", "gameView");
                        this.toggleSelected("navLogin", "navGame");
                        console.log();
                        let prevScores = data.split(";").slice(1, -1);
                        for(let i of prevScores){
                            let ps = i.split(",");
                            this.grab("resultTable").innerHTML +="<tr>" +
                                                                    "<td>" + ps[0] + "</td>" +
                                                                    "<td>" + ps[1] + "</td>" +
                                                                "</tr>";   
                        }
                        //console.log("player: "+ prevScores[0] + ", npc: "+ prevScores[1]);                        
                    }else if(data == "bad pw" || data == "no user"){
                        return this.popup("Wrong password or username!", "error");
                    } else{
                        return this.popup("Some error has occured!", "error");
                    }
                });
        });
        
        this.grab("navLogin").addEventListener("click", (e) => {
            this.toggleHidden(["gameView", "registerView"], "loginView");
            this.toggleSelected("navGame", "navLogin");
        });
        
        this.grab("navGame").addEventListener("click", (e) => {
            //if auth true then change to game
            this.toggleHidden(["loginView", "registerView"], "gameView");
            this.toggleSelected("navLogin", "navGame");
        });
        
        this.grab("createUserBtn").addEventListener("click", (e) => {
            
            let uname = this.grab("newUnameInput");
            let pw = this.grab("newPwInput");
            
            if(uname.value.length == 0){ return this.popup("No username inserted!", "error"); }
            if(pw.value.length == 0){ return this.popup("No password inserted!", "error")}                            
            
            this.ajax("http://localhost:6789/db/create/user/" + uname.value + "/pw/" + this.hash(pw.value), "POST")
                .then(data => {
                    if(data == "success"){
                        this.toggleHidden("registerView", "gameView");
                        this.toggleSelected("navLogin", "navGame");
                        //start session
                    }else{
                        return this.popup(data, "error");
                    }
                });
        });
        
        this.grab("rollDiceBtn").addEventListener("click", (e) => {
            this.ajax("http://localhost:6789/calc/roll", "POST")
                .then(data => {
                    if(data != "err"){
                        let rolls = data.replace("[", "").replace("]", "").replace(" ", "").split(",");
                        
                        this.grab("resultTable").innerHTML +="<tr>" +
                                                                    "<td>" + (parseInt(rolls[0])+parseInt(rolls[1])) + "</td>" +
                                                                    "<td>" + (parseInt(rolls[2])+parseInt(rolls[3])) + "</td>" +
                                                                "</tr>"; 
                        
                        console.log(parseInt(rolls[0]) + " " + parseInt(rolls[1]) + " " + parseInt(rolls[2]) + " " +parseInt(rolls[3]) );
                    }else{
                        return this.popup("Something went wrong!", "error");
                    }
                    
                });
        });
        
    }
    
    popup(msg, type){
        //type: info, error, warning
        let popup = this.grab("popup");
        if(popup.classList.contains("hidden")){
            popup.innerHTML = msg;
            popup.classList.toggle("hidden");
            popup.classList.toggle(type);

            setTimeout(() => {
                popup.innerHTML = "";
                popup.classList.toggle("hidden");
                popup.classList.toggle(type);
            }, 5000);
        }        
    }
    
    ajax(url, methodType){
        let promise = new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open(methodType, url, true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4){
                    if (xhr.status === 200){ res(xhr.response); }
                    else { rej(xhr.status); }
                }
            }
        });
        return promise;
    }
    
    hash(s) {
        let a = 1, c = 0, h, o;
        if (s) {
            a = 0;
            
            for (h = s.length - 1; h >= 0; h--) {
                o = s.charCodeAt(h);
                a = (a<<6&268435455) + o + (o<<14);
                c = a & 266338304;
                a = c!==0?a^c>>21:a;
            }
        }
        return String(a);
    };
    
    toggleHidden(whatHide, whatShow){
        if(whatHide.constructor === Array){
            for(let item of whatHide){
                let el = this.grab(item);
                if(!el.classList.contains("hidden")){
                    el.classList.toggle("hidden"); 
                }
           }
        }else{
            let el = this.grab(whatHide);
            if(!el.classList.contains("hidden")){
                el.classList.toggle("hidden"); 
            }
        }
        this.grab(whatShow).classList.toggle("hidden");
    }
    
    toggleSelected(whatHide, whatShow){
        this.grab(whatHide).classList.toggle("selected");
        this.grab(whatShow).classList.toggle("selected");        
    }
    
    grab(id){
        return document.getElementById(id);
    }
}

new GameOfDice();