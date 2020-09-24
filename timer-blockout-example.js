#!/usr/bin/env node

require(__dirname+"/processor-usage.js").startWatching();

var shouldRun = true;

function blockCpu() {
	var result = 0;
	while(shouldRun) {
        result += Math.random() * Math.random();
        //console.log(result);
	}	
	return result;
}

function start() {
	shouldRun = true;
	blockCpu();
	setTimeout(stop, 10);
}

function stop() {
	console.log("Stopping cpu hog");
	shouldRun = false;
}

start();

