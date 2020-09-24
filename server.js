const express = require('express')
const app = express()
const bodyParser= require('body-parser');
const request = require('request');
const apiKey = '726db3b41ced932687040cdd191825da';
const port = 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', function (req, res) {
  res.render('pages/index');
})

app.post('/apiext', function (req,res){
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    //console.log(url)

request(url, function(err, response, body) {
    
    if(err){
        
       // console.log('Erro no request');
        res.render('pages/api-externa', {weather: null, error: 'Erro ao consultar API'});
   
    } else {
        
       // console.log('Body da Requisicao: ' + body)

        let weather = JSON.parse(body)
        
        if(weather.main == undefined) {
            
            res.render('pages/api-externa', {weather: null, error: 'Erro ao consultar API (undefined)'});
        
        } else {
            
            let weathertext = `Esta ${weather.main.temp} graus em ${weather.name} !`;
        //    console.log(weathertext)
            res.render('pages/api-externa', {weather: weathertext, error: null});
        }
    }
});

})

app.get('/apiext', function(req, res){
    res.render('pages/api-externa');
})

app.listen(port, function () {
  console.log(`Certification app running on port ${port} !`)
})
