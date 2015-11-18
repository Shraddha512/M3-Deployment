var needle = require("needle");
var http = require('http')
  , request = require('request')
  , os = require('os')
  , nodemailer = require('nodemailer')
  , querystring = require('querystring')
;

function memoryLoad()
{
        //console.log( os.totalmem(), os.freemem() );
        console.log("Memory: " + (os.totalmem() - os.freemem())/os.totalmem() * 100);
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
        console.log("CPU:" + ((totalDifference-idleDifference)/totalDifference) * 100);
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
        to: 'aagrawa5@ncsu.edu', // list of receivers
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

function sendAlertToProxy()
{
        //send request
        //request(options, callback);
        var headers =
        {
            'Content-Type':'application/json'
        };

        needle.get("http://54.172.130.181:10000", {headers:headers}, function(err, resp, body)
        {
        //console.log(body);
        // StatusCode 202 - Means server accepted request.
        if(!err && resp.statusCode == 202)
        {
         console.log( 'sent alert');
        }
        });
}



///////////////
//// Monitor system every 2 seconds
//////////////
var alertFlag = 0;
setInterval( function ()
{
    if (cpuAverage() > 20 ) {
        // send email alert
        sendMail('CPU average higher than 20%');
        alertFlag = 1;
    }
    if (memoryLoad() > 84 ) {
        // send email alert
        sendMail('Memory Load above 84%');
        alertFlag = 1;
    }
    if (alertFlag == 1) {
       sendAlertToProxy();
       alertFlag = 0;
    }
}, 2000);
