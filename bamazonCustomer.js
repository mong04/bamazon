const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Fightingpadre!$',
    database : 'bamazonDB'
  });
   
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   displayItems();
    // console.log('connected as id ' + connection.threadId);
  });

  function displayItems(){
      connection.query('SELECT * FROM products', function(error, res, fields){
          for (i = 0; i < res.length; i++){
              let item = res[i];
              console.log('\nID: ' + item.item_id + ' Name: ' + item.product_name + ' Price: $' + item.price);
          }
      })
  }