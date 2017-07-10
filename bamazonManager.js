const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');

//establish connection to mySQL
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Fightingpadre!$',
    database : 'bamazonDB'
  });
   
  //check to make sure connection successful then perform app function if connection established
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    mainMenu();
});

//display items currently for sale on the database.
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

//query MySQL for all items with less than 5 items in stock then display items in a new table
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

//query MySQL to update the stock of an item of the manager's choosing
const addInventory = (item, quantity) => {
    let query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
    connection.query(query, [quantity, item], function(err, res, fields){
        if (err) throw err;
        console.log(`${quantity} added to inventory!`);
        setTimeout(mainMenu, 1500);
    })    
}

//question object for asking what item and how much of it to stock. To be used in inquirer.prompt
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

//query MySQL to add a new product to the database to be sold
const addProduct = (name, department, price, quantity) => {
    let query = "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)";
    connection.query(query, [name, department, price, quantity], function(err, res, fields){
        if (err) throw err;
        console.log(`${quantity} ${name} added to the inventory!`);
        setTimeout(mainMenu, 1500);
    })
}

//question object get product details for new product to be added. To be used in inquirer.prompt
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

//main app function provides UI/UX, prompts user to see what they want to do
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
            //prompt user with quesitons from previously declared inventoryQuestions
            inquirer.prompt(inventoryQuestions).then(function(choices){
                let item = choices.productID;
                let quantity = choices.itemQuantity;

                //pass responses into function
                addInventory(item, quantity);
            })
            break;
        case "Add New Product":
        //prompt user with quesitons from previously declared productQuestions
            inquirer.prompt(productQuestions).then(function(product){
                let name = product.name;
                let department = product.department;
                let price = product.price;
                let quantity = product.quantity

                //pass productQuestions responses into function
                addProduct(name, department, price, quantity);
            })
            break;
        }
    })
}