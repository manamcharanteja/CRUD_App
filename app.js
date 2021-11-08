const express = require("express");
const app = express();
const path = require ("path");
const { Pool } = require("pg");

app.use(express.static(path.join(__dirname,"public")));

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:false}));

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "employ",
    password: "Mcherry",
    port: 5432
});
console.log("Connected to Database");
// -----------------------------Creating Table-------------------------------------------
 /*const sql_create =`create table employees(
     employee_id serial primary key,
     name varchar(30) not null,
     role varchar(30) not null,
     salary integer not null,
     email varchar(30)
 );`;
 pool.query(sql_create,[],(err,result)=>{
     if (err){
         return console.error(err.message);
     }else{
         console.log("Successfully created Table")
     }
 });*/
// ----------------------------------------------------------------------------------------
app.listen(3000,()=>{
    console.log("server started at port 3000")
});
// -----------------Getting employee details-----------------------------------------------
app.get("/",async(req,res)=>{
    try {
        const sql = "SELECT * FROM employees"
        const data = await pool.query(sql,[]);
        res.render("index",{employees:data.rows})
    } catch (err) {
        console.error(err.message)
    }
});
// --------------------------creating  a record--------------------------------------
app.get("/create",(req,res)=>{
    res.render("create");
});

app.post("/create",async(req,res)=>{
    try {
        const sql="INSERT INTO employees (name,role,salary,email) VALUES ($1, $2, $3, $4)";
        const newEmployee = [req.body.name, req.body.role, req.body.salary, req.body.email]
        await pool.query(sql,newEmployee);
            res.redirect("/") 
    } catch (error) {
        console.error(error.message)
    }
})
// ------------------------------Editing--------------------------------------------------
app.get("/edit/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const sql = "SELECT * FROM employees WHERE employee_id = $1"
        const data = await pool.query(sql,[id]);
        res.render("edit",{employee:data.rows[0]});
    }catch(err){
        return console.error(err.message)
    } 
})

app.post("/edit/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const employee = [req.body.name, req.body.role, req.body.salary, req.body.email,id]
        const sql = "UPDATE employees SET name=$1, role=$2, salary=$3 ,email=$4 WHERE (employee_id = $5)"
        await pool.query(sql, employee);
        res.redirect("/");
    }catch(err){
        return console.error(err.message)
    } 
})
// ----------------------------Deleting---------------------------------------------------
app.get("/delete/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const sql = "SELECT * FROM employees WHERE employee_id = $1"
        const data = await pool.query(sql,[id])
        res.render("delete",{employee:data.rows[0]});
    }catch(err){
        return console.error(err.message)
    } 
})

app.post("/delete/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const sql = "DELETE FROM employees WHERE employee_id = $1"
        await pool.query(sql,[id])
        res.redirect("/");
    }catch(err){
        return console.error(err.message)
    } 
});
// -------------------------------search-----------------------------------------------

app.post("/search",(req,res)=>{
    
    console.log(req.body.search)
})