const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

//establish connection to MySQL
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Fightingpadre!$',
    database : 'bamazonDB'
  });

  //check if connection had errors, if not perform app function 
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   displayItems();
  });

  //Call on 'cli-table' to create new table, push MySQL query into the table then display table
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

  //calculate final price to the customer using price from MySQL query and quantity the customer provided
  const priceCalculate = (price, quantity) => console.log(`Order successful, your total is $${price * quantity}`);

  //prompt the customer for the item they'd like to purchase and how many of that item.
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
            //take customer input to query MySQL for items matching item_id
            var query = "SELECT * FROM products WHERE item_id = ?";
            connection.query(query, [response.productID], function(err, res){
                //check if there is enough item in stock to fulfill order
                if (res[0].stock_quantity < response.itemQuantity){
                    console.log('Insufficient quantity!');
                    setTimeout(displayItems, 1500);
                }
                else{
                    //update stock_quantity to reflect items sold
                    let query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
                    connection.query(query, [response.itemQuantity, response.productID], function(err, res, fields){
                        if (err) throw err;
                            let queryPrice = "SELECT price FROM products WHERE item_id = ?";
                            connection.query(queryPrice, [response.productID], function(err, res, fields){
                                //call on priceCalculate function to take MySQL price response and customer quantity input to calculate final cost
                                priceCalculate(res[0].price, response.itemQuantity);
                                setTimeout(displayItems, 1500);
                            })
                    })
                }
            })
        })
  }