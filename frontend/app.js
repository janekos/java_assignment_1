"use strict";

class GameOfDice{
    constructor(){
        //check user ip for session
        this.ajax("https://api.ipify.org?format=json", "GET")
            .then(res => 
                this.hash(JSON.parse(res).ip)
            )
            .then(data =>
                console.log(data)
            );
        
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
            //if auth true then change to game
            this.toggleHidden("loginView", "gameView");
            this.toggleSelected("navLogin", "navGame");
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
            //if auth true then change to game
            this.toggleHidden("registerView", "gameView");
            this.toggleSelected("navLogin", "navGame");
        });
        
    }
    
    ajax(url, methodType){
        let promise = new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open(methodType, url, true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4){
                    if (xhr.status === 200){
                        res(xhr.response);
                    } else {
                        rej(xhr.status);
                    }
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