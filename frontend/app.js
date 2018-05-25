"use strict";

class GameOfDice{
    constructor(){
        this.sid = "";
        this.uname = "";
        this.activeTimer;
        
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
            
            if(uname.length == 0){ return this.popup("No username inserted!", "error"); }
            if(pw.value.length == 0){ return this.popup("No password inserted!", "error"); }  
            
            this.ajax("http://localhost:6789/db/auth/user/" + uname.value + "/pw/" + this.hash(pw.value), "GET")
                .then(data => {
                    if(data != "bad pw" && data != "error" && data != "no user"){
                        this.grab("navLogin").classList.remove("disabled");
                        this.grab("navLogin").innerHTML = "Logout";
                        
                        this.uname = uname.value;
                        this.startSession();
                        this.toggleHidden("loginView", "gameView");
                        this.toggleSelected("navLogin", "navGame");
                        console.log();
                        let prevScores = data.split(";").slice(1, -1);
                        for(let i of prevScores){
                            let ps = i.split(",");
                            this.grab("resultTable").innerHTML +="<tr><td>" + ps[0] + "</td><td>" + ps[1] + "</td></tr>";   
                        }
                        this.grab("resultTableWrapper").scrollTop = this.grab("resultTableWrapper").scrollHeight;
                        uname.value = "";
                        pw.value = "";
                        
                    }else if(data == "bad pw" || data == "no user"){
                        return this.popup("Wrong password or username!", "error");
                    } else{
                        return this.popup("Some error has occured!", "error");
                    }
                });
        });
        
        this.grab("navLogin").addEventListener("click", (e) => {
            
            if(this.uname.length == 0 || this.sid.length == 0){return;}
            this.ajax("http://localhost:6789/db/session/end/user/" + this.uname + "/sid/" + this.sid, "PUT")
                            .then(data => {this.endSession()});
        });
        
        this.grab("navGame").addEventListener("click", (e) => {
            if(this.uname.length == 0 || this.sid.length == 0){return this.popup("Please login.", "error");}
        });
        
        this.grab("createUserBtn").addEventListener("click", (e) => {
            
            let uname = this.grab("newUnameInput");            
            let pw = this.grab("newPwInput");
            
            if(uname.length == 0){ return this.popup("No username inserted!", "error"); }
            if(pw.value.length == 0){ return this.popup("No password inserted!", "error"); }                            
            
            this.ajax("http://localhost:6789/db/create/user/" + uname.value + "/pw/" + this.hash(pw.value), "POST")
                .then(data => {
                    if(data == "success"){
                        this.uname = uname.value;
                        this.grab("navLogin").classList.remove("disabled");
                        this.grab("navLogin").innerHTML = "Logout";
                        
                        this.toggleHidden("registerView", "gameView");
                        this.toggleSelected("navLogin", "navGame");
                        uname.value = "";
                        pw.value = "";
                        this.startSession();
                    }else{
                        return this.popup(data, "error");
                    }
                });
        });
        
        this.grab("rollDiceBtn").addEventListener("click", (e) => {
            
            e.target.setAttributeNode(document.createAttribute("disabled"));
            
            this.checkSession(()=>{
                this.ajax("http://localhost:6789/calc/roll/user/" + this.uname + "/sid/" + this.sid, "POST")
                    .then(data => {
                        if(data != "err"){
                            let rolls = data.replace("[", "").replace("]", "").replace(" ", "").split(",");
                            let psum = (parseInt(rolls[0])+parseInt(rolls[1]));
                            let npcsum = (parseInt(rolls[2])+parseInt(rolls[3]));
                            this.grab("resultTable").innerHTML +="<tr><td>" + psum + "</td><td>" + npcsum + "</td></tr>"; 
                            this.grab("resultTableWrapper").scrollTop = this.grab("resultTableWrapper").scrollHeight;
                            
                            this.setDices(rolls);
                            
                            this.grab("playerScoreSpan").innerHTML = psum;
                            this.grab("npcScoreSpan").innerHTML = npcsum;
                            
                            let pwin = this.grab("pWinner");
                            let npcwin = this.grab("npcWinner");
                            if(psum > npcsum){
                                if(pwin.classList.contains("hidden")){ pwin.classList.remove("hidden");}
                                if(!npcwin.classList.contains("hidden")){ npcwin.classList.add("hidden");}
                            }else if(psum < npcsum){
                                if(!pwin.classList.contains("hidden")){ pwin.classList.add("hidden");}
                                if(npcwin.classList.contains("hidden")){ npcwin.classList.remove("hidden");}
                            }else{
                                if(pwin.classList.contains("hidden")){ pwin.classList.remove("hidden");}
                                if(npcwin.classList.contains("hidden")){ npcwin.classList.remove("hidden");}
                            }
                            
                            e.target.removeAttribute("disabled");
                        }else{
                            return this.popup("Something went wrong!", "error");
                        }
                    }); 
            });          
        });
        
    }
    
    setDices(rolls){
        for(let i = 0; i < 4; i++){
            let roll = parseInt(rolls[i]);
            let dice = this.grab("dice"+i);

            let html = "<div class='dice'>";                                
            for(let j = 0; j < roll; j++){ html += "<div class='diceDot'></div>"; }
            html += "</div>";

            dice.innerHTML = html; 
        }
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
            }, 2000);
        }        
    }
    
    startSession(){
        this.ajax("https://api.ipify.org?format=json", "GET")
            .then(data => {
                this.sid = this.hash(JSON.parse(data).ip + this.uname);
                this.ajax("http://localhost:6789/db/session/start/user/" + this.uname + "/sid/" + this.sid, "POST")
                    .then(sdata => { this.activeTimerfn(1); });
            });        
    }
    
    checkSession(callback){
        this.ajax("http://localhost:6789/db/session/check/user/" + this.uname + "/sid/" + this.sid, "GET")
            .then(data => {
                if(data == "success"){callback();}
                else if(data == "session ended"){ this.popup("The session has ended!", "warning"); this.endSession();}
                else if(data == "no session"){ this.popup("Please login!", "error"); this.endSession();}
                else{ this.popup("Something went wrong.", "error"); this.endSession();}
            });
    }
    
    endSession(){
        this.ajax("http://localhost:6789/db/session/end/user/" + this.uname + "/sid/" + this.sid, "PUT");
        this.toggleHidden(["gameView", "registerView"], "loginView");
        this.toggleSelected("navGame", "navLogin");
        this.grab("navLogin").classList.add("disabled");
        this.grab("navLogin").innerHTML = "Login";
        if(!this.grab("pWinner").classList.contains("hidden")){ this.grab("pWinner").classList.add("hidden"); }
        if(!this.grab("npcWinner").classList.contains("hidden")){ this.grab("npcWinner").classList.add("hidden"); }
        this.grab("resultTable").innerHTML = "<tr><th>User</th><th>Opponent</th></tr>";
        this.uname = "";
        this.sid = "";
        this.setDices(["1","1","1","1"]);
        this.activeTimerfn(0);
    }
    
    activeTimerfn(which){
        if(which == 1){ this.activeTimer = setInterval(() => {this.checkSession(()=>{})}, 10000); }
        else{ clearInterval(this.activeTimer); }   
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