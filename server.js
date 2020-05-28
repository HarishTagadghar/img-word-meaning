const express = require('express')
const bp = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const ejs = require('ejs');
const sw = require('stopword')
const af = require('arrayfilter')
const csv = require('csv-parser')

const app = express()

//middlewares
app.set('view engine', 'ejs'); //ejs template engine setup
app.use(bp()) //body-parser setup

// setting up the multer storage directory and accessing img name
let storage = multer.diskStorage({ // {have to set the filter of image formet and size before production}
    destination: (req,file, callback) => {
        callback(null , 'image')
    },
    filename: (req,file,callback) => {
        callback ( null , file.originalname)
    }
});

// for development mode name of the single is image
let upload = multer({
    storage:storage
}).single('image');



// how rought
app.get('/' , (req,res) => { 
    res.render('index')
})


// rought for uploading image and renderign array to usser
app.post('/upload' , (req,res) => {
    upload(req,res , err => {
        if (err) { // error if the img is not uploaded currect by multer
            console.log(err);
            return res.send('something went wrong')
        } // accessing image from user
        let image = fs.readFileSync(__dirname + '/image/' + req.file.originalname) // access of the image from the user

        Tesseract.recognize(
            image, //uploading image to tesseract libery
            'eng', //language is set to inglist  {have to set mode language before production}
            { logger: m => console.log(m) } //to watch the work going behind the seen by tesseract
          ).then(({ data: { text } }) => { // now the extracted data is stored in argument text
            
let rejectempty = af.emptyReject() //function to extract empty string
let duplicatereject = af.duplicateReject() //function to extract duplicate string

          let filter1 = text.replace(/[&#,+()$~%.'":*?<>{}1234567890-]/g, 1);
          let filter2 = filter1.replace(/\\/g,1);
          let filter3 = filter2.replace(/\//g,1);
          let filter4 = filter3.split(" ") // spliting the strignt with space and adding it in a array
          let filter5 = filter4.filter(el => !el.includes(1));
          let filter6 = filter5.filter(rejectempty) //output of the extracted empty array
          let filter7 = filter6.filter(duplicatereject) //output of the extracted buplicate array
          let filter8 = sw.removeStopwords(filter7) // removing the common words from array like(if,of,the,etc)
          let words = filter8.filter(el =>!(el.length <= 4) )





          const results = [];
          const value = []
        //    const words = ['abandon' ,'abased','development']
           let arrays = []
          fs.createReadStream(__dirname + '/dictionary.csv')
            .pipe(csv({
                delimiter: ','
            }))
            .on('data', (data) =>  results.push(data)
            
            )
            .on('end', () => {
             for (let i = 0; i < results.length; i++) {
                  let array = Object.values(results[i])
                 let array1 = array.map(el => el.split(" ")[0])
                  value.push(array1) 
                  arrays.push(array)
               
                }
          let index = [];
          let output = []
          for (let i = 0; i < value.length; i++) {
              index.push(value[i].toString())
          }
          for (let i = 0; i < index.length; i++) {
          for (let j = 0; j < words.length; j++) {
             if(words[j].toLowerCase() == index[i].toLowerCase()){
                 output.push(i)
             }   
          
          }
          }
          let final = []
          for ( i = 0 ; i< output.length ; i++){
          final.push(arrays[output[i]]);
           
          }
          res.send(final)
            });






        
        //   res.send(final) // rendering the array to the user
        //   return split
          })
    })
})


const PORT = process.env.PORT || 3000; 

app.listen(PORT , (req,res) => {
    console.log(`server is running on port ${PORT}`);
    
})