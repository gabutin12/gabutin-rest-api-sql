import {Product, UnitProduct, Products} from "./product.interface";
import { v4 as random} from "uuid"
import fs from "fs"
import mysql from "mysql"

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "intprog_db"

})

const FIND_BY_ID = "SELECT * FROM tb_products WHERE id = ?";
const INSERT_NEW_PRODUCT = "INSERT INTO tb_products (id, name, quantity, price) VALUES (?, ?, ?, ?)";
//const FIND_BY_EMAIL = "SELECT * FROM products WHERE email = ?";
//const FIND_ALL_BY_USERNAME = "SELECT * FROM products WHERE username LIKE ?";
//const FIND_ALL_BY_EMAIL = "SELECT * FROM products WHERE email LIKE ?";
const FIND_ALL_USERS = "SELECT * FROM tb_products";
const UPDATE_PRODUCT_BY_ID = "UPDATE tb_products SET name = ?, quantity = ?, price = ? WHERE id = ?";
const DELETE_PRODUCT_BY_ID = "DELETE FROM tb_products WHERE id = ?";
//const FIND_BY_USERNAME_AND_EMAIL = "SELECT * FROM products WHERE username LIKE ? AND email LIKE ?";


export const findAll = async() : Promise<UnitProduct[]> =>{
    return new Promise((resolve, reject) => {
        db.query(FIND_ALL_USERS, (err, res) => {
            if(err){
                reject([])
            }else{
                resolve(res);
            }
        })
    });
}

export const findOne = async (id: string): Promise<UnitProduct | null> => {
    return new Promise((resolve, reject) => {
        db.query(FIND_BY_ID, [id], (err, res) => {
            if (err) {
                return resolve(null);
            }
            return resolve(res && res.length > 0 ? res[0] : null);
        });
    });
}

export const create = async (productInfo: Product): Promise<UnitProduct | null> => {
    return new Promise((resolve, reject) => {
        const id = random();
        const { name, quantity, price } = productInfo;
        db.query(INSERT_NEW_PRODUCT, [id, name, quantity, price], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, ...productInfo });
        });
    });
}

export const remove = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.query(DELETE_PRODUCT_BY_ID, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
        /*
        try {
        
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            userData.id = id;

            db.query(INSERT_NEW_USER, [id, username, email, hashedPassword]);

            resolve(userData);
        } catch (error) {
            reject(error);
        }
        */
    


let products : Products = loadProducts()

function loadProducts(): Products{
    try{
        const data = fs.readFileSync('./products.json', 'utf-8')
        return JSON.parse(data)
    }catch(error){
        console.log(`Error ${error}`)
        return {}
    }
}

function saveProducts(){
    try{
        fs.writeFileSync('./products.json', JSON.stringify(products), 'utf-8')
        console.log(`Products saved successfully`)
    }catch(error){
        console.log(`Error ${error}`)
    }
}

//export const findAll = async() : Promise<UnitProduct[]> => Object.values(products)

//export const findOne = async (id : string) : Promise<UnitProduct> => products[id]
/*
export const create = async (productInfo : Product) : Promise<null | UnitProduct> =>{

    let id = random()

    let product = await findOne(id)

    while(product){
        id = random()
        await findOne(id)
    }

    products[id] = {
        id : id,
        ...productInfo
    }

    saveProducts()

    return products[id]
}
*/

export const update = async(id:string, updateValues : Product) : Promise <UnitProduct | null> => {
    
    const product = await findOne(id)

    if(!product){
        return null
    }

    products[id] = {
        id,
        ...updateValues
    }

    saveProducts()

    return products[id]
}
/*
export const remove = async (id : string) : Promise <null | void > => {

    const product = await findOne(id)

    if(!product){
        return null
    }

    delete products[id]

    saveProducts()
}
*/