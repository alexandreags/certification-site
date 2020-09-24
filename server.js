const express = require('express')
const app = express()
const bodyParser= require('body-parser');
const request = require('request');
const apiKey = '726db3b41ced932687040cdd191825da'


app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req,res){
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    //console.log(url)

request(url, function(err, response, body) {
    
    if(err){
        
       // console.log('Erro no request');
        res.render('index', {weather: null, error: 'Erro ao consultar API'});
   
    } else {
        
       // console.log('Body da Requisicao: ' + body)

        let weather = JSON.parse(body)
        
        if(weather.main == undefined) {
            
            res.render('index', {weather: null, error: 'Erro ao consultar API (undefined)'});
        
        } else {
            
            let weathertext = `Esta ${weather.main.temp} graus em ${weather.name} !`;
        //    console.log(weathertext)
            res.render('index', {weather: weathertext, error: null});
        }
    }
});

    //res.render('index');
    //console.log(req.body.city)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
