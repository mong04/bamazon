const inquirer = require('inquirer');
const mysql = require('mysql');
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
    mainMenu();
});

const displayItems = () => {
    connection.query('SELECT * FROM products', function(err, res, fields){
        if (err) throw err;
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
        mainMenu();
    })
}

const lowInventory = () => {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res, fields){
        if (err) throw err;
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
        mainMenu();
    })
}

const addInventory = (item, quantity) => {
    let query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
    connection.query(query, [quantity, item], function(err, res, fields){
        if (err) throw err;
        console.log(`${quantity} added to inventory!`);
        setTimeout(mainMenu, 1500);
    })    
}

let inventoryQuestions = [
    {
        type: 'input',
        message: `Enter ID of item you'd like to stock.`,
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
        message: `How much of the item would you like to stock?`,
        name: 'itemQuantity'
    }    
];

const addProduct = (name, department, price, quantity) => {
    let query = "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)";
    connection.query(query, [name, department, price, quantity], function(err, res, fields){
        if (err) throw err;
        console.log(`${quantity} ${name} added to the inventory!`);
        setTimeout(mainMenu, 1500);
    })
}

let productQuestions = [
    {
        type: 'input',
        message: 'Enter product name.',
        name: 'name',
        validate: function(value){
            if (value.length){
                return true;
            }
            console.log('Please enter a product name.')
        }
    },
    {
        type: 'input',
        message: 'Enter department the product is sold in.',
        name: 'department',
        validate: function(value){
            if (value.length){
                return true;
            }
            console.log('Please enter a department.')
        }
    },
    {
        type: 'input',
        message: 'Enter product price.',
        name: 'price',
        validate: function(value){
            if (value.length){
                return true;
            }
            console.log('Please enter a price.')
        }
    },
    {
        type: 'input',
        message: 'How much product are you adding?',
        name: 'quantity',
        default: 0
    }
]

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            choices: ['View Inventory', 'View Low Inventory Items', 'Add To Inventory', 'Add New Product'],
            name: 'menuChoice'
        }
    ]).then(function(choice){
        let x = choice.menuChoice;
        switch(x){
        case "View Inventory":
            displayItems();
            break;
        case "View Low Inventory Items":
            lowInventory();
            break;
        case "Add To Inventory":
            inquirer.prompt(inventoryQuestions).then(function(choices){
                let item = choices.productID;
                let quantity = choices.itemQuantity;
                addInventory(item, quantity);
            })
            break;
        case "Add New Product":
            inquirer.prompt(productQuestions).then(function(product){
                let name = product.name;
                let department = product.department;
                let price = product.price;
                let quantity = product.quantity
                addProduct(name, department, price, quantity);
            })
            break;
        }
    })
}