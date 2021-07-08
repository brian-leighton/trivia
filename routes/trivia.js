const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const axios = require('axios');
const path = require('path');
const { resolveAny } = require('dns');

module.exports = (app) => {
    var db = new JsonDB(new Config("trivia", true, true, '/'));
    
    app.post("/new/quiz", async (req, res) => {
        let id = Math.floor(Math.random() * 9999);
        try{
            db.push(`/${id}`, req.body);
            //return new quiz id
            res.send(`${id}`);
        } catch(err){
            res.send();
        }
    });

    //get current trivia quizes from the url
    app.get("/get/trivia", async (req, res) => {
        let response;
        try{
            let data = [];
            response = await db.getData("/");
            //loop through each quiz in database 
            for(let key in response){
                data.push({id: parseInt(key), difficulty: response[key].difficulty, title: response[key].title, length: response[key].quiz.length })
            }
            res.send(data); 
        } catch(err){
            response = err;
            res.send(response);
        }
    });

    //get current trivia
    app.get("/get/trivia/:id", async(req, res) => {
        try{
            let response = await db.getData(`/${req.params.id}`);
            //shuffle answers
            response.quiz.map((question) => {
                question.answers = shuffle(question.answers);
            });
            res.send(response);
        } catch(err){
            // res.send("Sorry we don't have a record of this quiz. Please try again.");
            res.redirect("/")
        }
    });
}

//shuffle answers so they aren't the same every time
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }