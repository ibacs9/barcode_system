var mysql = require('mysql');
const express = require('express')
const app = express()
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(express.static("public"))

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos"
});



app.post('/',urlencodedParser,(req,res)=>{

  if(req.body.barcode_input > 0 && req.body.termek_nev == undefined){
    getTermek(req.body.barcode_input,res)
  }else if(req.body.termek_nev != undefined && req.body.termek_ar != undefined){
    console.log(req.body.termek_nev);
    console.log(req.body.barcode_input);
    console.log(req.body.termek_ar);
    let barcode = con.escape(req.body.barcode_input)
    let termek_nev = con.escape(req.body.termek_nev)
    let termek_ar = con.escape(req.body.termek_ar)

    var sql = "INSERT INTO termekek (barcode, nev, ar) VALUES ('"+barcode+"', '"+termek_nev+"', '"+termek_ar+"')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.json({ nev:req.body.termek_nev,ar:req.body.termek_ar,barcode:req.body.barcode_input });

    }); 
  }

});

function send_termek(nev2,ar2,res){
  if(nev2 != undefined){
    res.json({ nev:nev2,ar:ar2 });
  }else{
    res.json({ msg: "Ismeretlen Termék!\nAdd meg a nevét és az árát" });
  }
}


function getTermek(barcode,res){
  let barcode = con.escape(barcode)
  let sql = `SELECT * FROM termekek WHERE barcode = '${barcode}'`;
  con.query(sql, function (err, result) {
      if (err) throw err;

      if(result[0] != undefined){
        send_termek(result[0].nev,result[0].ar,res) 
      }else{
        send_termek(undefined,undefined,res)
      }  
      
  });
}


con.connect(function(err) {
  if (err) throw err;
  console.log("MYSQL Kapcsolodva!");
  app.listen(3000);
}); 


