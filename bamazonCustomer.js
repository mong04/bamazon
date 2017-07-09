const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

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
  });

  function displayItems(){
      connection.query('SELECT * FROM products', function(error, res, fields){
        var table = new Table({
            head: ['Item ID', 'Product', 'Department', 'Price', 'In Stock'], 
            colWidths: [20, 30, 20, 20, 20]
        });
        for (let value of res){
            table.push(
                [value.item_id, value.product_name, value.department_name, value.price, value.stock_quantity]
                
            );
        }
        console.log(table.toString());
        takeOrder();
        })
  }

  const priceCalculate = (price, quantity) => console.log(`Order successful, your total is $${price * quantity}`);

  function takeOrder(){
      inquirer.prompt([
          {
              type: 'input',
              message: "Please enter the ID of the product you'd like to buy.",
              name: 'productID',
              validate: function(value){
                  if (value.length){
                      return true;
                  }
                  console.log('Please enter a product ID.')
              }
          },
          {
              type: 'input',
              message: "Please enter the quantity of the product you'd like to buy.",
              name: 'itemQuantity'
          }
        ]).then(function(response){
            var query = "SELECT * FROM products WHERE item_id = ?";
            connection.query(query, [response.productID], function(err, res){
                if (res[0].stock_quantity < response.itemQuantity){
                    console.log('Insufficient quantity!');
                    setTimeout(displayItems, 1500);
                }
                else{
                    let query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
                    connection.query(query, [response.itemQuantity, response.productID], function(err, res, fields){
                        if (err) throw err;
                            let queryPrice = "SELECT price FROM products WHERE item_id = ?";
                            connection.query(queryPrice, [response.productID], function(err, res, fields){
                                priceCalculate(res[0].price, response.itemQuantity);
                                // displayItems();
                                setTimeout(displayItems, 1500);
                            })
                    })
                }
            })
        })
  }