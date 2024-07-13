import express from "express";
import { notes, removeNote, addNote, editNote, singleNote } from "../persistence.js"
import { v4 as uuidv4 } from "uuid";  
import "dotenv/config";
import Redis from "redis";

const api_key = process.env.UNSPLASH_KEY;
let redisClient;

const router = express.Router();

async function connectRedis(){
    try{
       redisClient = Redis.createClient(); 
       await redisClient.connect();
    }
    catch(error){
        console.log(`Error : ${error}`)
    }
}

(async () =>{
    await connectRedis();
})();

async function cached(req, res, next){
    const search = req.params.data;
    try{
        let cacheData = await redisClient.get(search);

        if(cacheData){
            console.log("inside redis");
            const imgData = JSON.parse(cacheData);
            
            let random = Math.floor(Math.random() * imgData.results.length);
            res.status(200).json({imgData: imgData.results[random]}); 
        }
        else{
            next();
        }
    }
    catch(err){
        console.error("Not able to access redis :/ ", err);
    }
}

const getImgData = async (url) =>{
    try{
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData;
    }
    catch(err){
        console.error("Not possible to load the img: ", err );
    }
}

router.get("/", (req, res) => {
    console.log("Displaying notes");
    res.status(200).json(notes()); 
});

router.get("/:id", (req, res) => {
    console.log("Displaying single note");
    res.status(200).json(singleNote(req.params.id)); 
});

router.post("/", (req, res) => {
    // console.log(req.body)
    const id = uuidv4(); 
    addNote(id, req.body.content);  
    res.status(200).json({res: `Note added succesfully`}); 
});

router.delete("/:id", (req, res) => {
    removeNote(req.params.id);
    res.status(200).json({res: `Note ${req.params.id} deleted succesfully`}); 
});

router.patch("/:id/:data",  (req, res) => {
    editNote(req.params.id, req.params.data);

    res.status(200).json({res: `Note ${req.params.id} updated succesfully`}); 
});

router.get("/:id/:data", cached, async (req, res) => {
    const url = `https://api.unsplash.com/search/photos?client_id=${api_key}&query=${req.params.data}`;
    const imgData = await getImgData(url);

    redisClient.set(req.params.data, JSON.stringify(imgData));

    let random = Math.floor(Math.random() * imgData.results.length);

    res.status(200).json({imgData: imgData.results[random]}); 
});

export default router;
