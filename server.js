const express = require('express')
const app = express();
const bodyParser= require('body-parser');
const request = require('request');
const apiKey = '726db3b41ced932687040cdd191825da';
const port = 80;
const NodeHog = require('nodehog');
var Q = require('q');

let ec2amiid;
let ec2hostname;
let ec2pubhostname;
let ec2pubip;
let ec2instanceid;
let ec2region;

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', function (req, res) {

    var metadata = require('node-ec2-metadata');

Q.all([
        metadata.getMetadataForInstance('ami-id'),
        metadata.getMetadataForInstance('hostname'),
        metadata.getMetadataForInstance('public-hostname'),
        metadata.getMetadataForInstance('public-ipv4'),
        metadata.getMetadataForInstance('instance-id'),
        metadata.getMetadataForInstance('region')
    ])
.spread(function(amiID, hostname, publicHostname, publicIPv4, instanceID, region) {
    console.log("AMI-ID: " + amiID);
    console.log("Hostname: " + hostname);
    console.log("Public Hostname: " + publicHostname);
    console.log("Public IPv4: " + publicIPv4);
    console.log("Instance ID: " + instanceID)
    console.log("Region: " + region)
    
    ec2amiid= amiID;
    ec2hostname = hostname;
    ec2pubhostname = publicHostname;
    ec2pubip = publicIPv4;
    ec2region = region;
    ec2instanceid = instanceID;

   // res.render('pages/index', {amiID:amiid, ec2hostname:ec2hostname,ec2pubhostname:ec2pubhostname, ec2pubip:ec2pubip});
})
.fail(function(error) {
    console.log("Error: " + error);
  //  res.render('pages/index', {amiID:null, ec2hostname:null,ec2pubhostname:null, ec2pubip:null});

});
    
    if(typeof ec2hostname !== null){
        console.log('identifiquei o hostname, vou renderizar.')
        res.render('pages/index', {amiID:ec2amiid, ec2hostname:ec2hostname,ec2pubhostname:ec2pubhostname, ec2pubip:ec2pubip, ec2instanceid:ec2instanceid, ec2region:ec2region});
        
    }else{
        
        console.log('nao identifiquei o hostname, vou renderizar.')
        res.render('pages/index', {amiID:null, ec2hostname:null,ec2pubhostname:null, ec2pubip:null, ec2instanceid:null, ec2region:null});

    };
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
});

app.get('/stress', function(req, res){
    res.render('pages/load-stress');
});

app.post('/stress', function(req,res) {
//qdo for usar, multiplicar por 1000



let tipo = req.body.tipo;
let lifespan = req.body.lifespan;
let deathspan = req.body.deathspan;
let iterations = req.body.iterations;

console.log('inicio do teste de stress');
new NodeHog(tipo,lifespan*1000,deathspan*1000,iterations).start();
console.log('fim do teste de stress');


});

app.listen(port, function () {
  console.log(`Certification app running on port ${port} !`)
})
