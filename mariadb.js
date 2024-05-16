// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',  // 127.0.0.1 == localhost
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings: true  // 2024-05-14T12:19:41.000Z >> 2024-05-14 21:19:41
});

module.exports = connection

// A simple SELECT query
// connection.query(
//   'SELECT * FROM `users`',
//   function (err, results, fields) {
//     var {id, email, name, created_at} = results[0];
//     console.log(id);
//     console.log(email);
//     console.log(name);
//     console.log(created_at);
//   }
// );

