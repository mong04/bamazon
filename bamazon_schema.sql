DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40),
    department_name VARCHAR(20),
    price DECIMAL(10,4),
    stock_quantity INT,
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Xbox One S', 'Electronics', 279.99, 100),
('Xbox One X', 'Electronics', 499.99, 0), 
('PS4 Pro', 'Electronics', 399.99, 100),
('Mad Max (Blu-Ray)', 'Entertainment', 24.99, 40),
('1TB SSD', 'Computer Hardware', 249.99, 10),
('DJI Phantom 4 Quadcopter', 'Drones', 999.99, 2),
('Samsung Refrigerator', 'Appliances', 2199.99, 3),
('Surface Book with Performance Base', 'Computer Hardware', 2699.99, 5),
('5 Years of Mau5 [CD]', 'Entertainment', 12.99, 5),
('Group Therapy [CD]', 'Entertainment', 11.99, 2);