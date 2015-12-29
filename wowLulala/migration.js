var dotenv = require('dotenv');

var pg = require('pg').native;
var databaseUrl = process.env.DATABASE;

var client = new pg.Client(databaseUrl);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  var enrollment_id = 1,
      username      = "'lula'",
      course_id     = "'poka'";

  var sql = 'INSERT INTO enrollment (enrollment_id, username, course_id) VALUES (' + enrollment_id + ', ' + username +', ' + course_id +');'
  console.log(sql);
  client.query(sql, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
});