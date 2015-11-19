var sio = require('socket.io')
  , http = require('http')
  , request = require('request')
  , os = require('os')
  ;
var nodemailer = require('nodemailer');

function memoryLoad()
{
	//console.log( os.totalmem(), os.freemem() );
	return (os.totalmem() - os.freemem())/os.totalmem() * 100;
}

// Create function to get CPU information
function cpuTicksAcrossCores() 
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
 
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) 
  {
		//Select CPU core
		var cpu = cpus[i];
		//Total up the time in the cores tick
		for(type in cpu.times) 
		{
			totalTick += cpu.times[type];
		}     
		//Total up the idle time of the core
		totalIdle += cpu.times.idle;
  }
 
  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores(); 
 
	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
 
	//Calculate the average percentage CPU usage
        console.log("CPU:");
        console.log(((totalDifference-idleDifference)/totalDifference) * 100);
	return ((totalDifference-idleDifference)/totalDifference) * 100;
}

function measureLatenancy(server)
{
    var start = Date.now();
	var options = 
	{
		url: 'http://localhost' + ":" + server.address().port,
	};
	request(options, function (error, res, body) 
	{
		server.latency = Date.now() - start;
	});
 

	return server.latency;
}


function sendMail(msg) 
{
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'etc.ankit@gmail.com',
            pass: '9197938726'
        }
    });
    var mailOptions = {
        from: 'Service Alert <alerts@service.com>', // sender address
        to: 'aagrawa5@ncsu.edu, amahaja3@ncsu.edu', // list of receivers
        subject: 'Service Monitoring Alert', // Subject line
        text: 'Alert raised: ' + msg, // plaintext body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    
    });
}

///////////////
//// Monitor system every 2 seconds
//////////////
setInterval( function () 
{
    if (cpuAverage() > 20 ) {
        // send email alert
        sendMail('CPU average higher than 20%');
    }
    if (memoryLoad() > 2 ) {
        // send email alert
        sendMail('Memory Load above 2%');
    }
}, 2000);

