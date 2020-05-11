const fs = require('fs')
const http = require('http');
const url = require('url');
const port = 8000;
const templateReplacer = require("./modules/replaceremplate")

// const newText = `I can modify my mysters code to suit my need. 
// The most important thing in this case is to understand what's happening behind the scene`;
// fs.writeFileSync('./txt/practiseTxt', newText);
// console.log('hurray, you are a writer');

///////////////////////////////////////////////////// FILE SYSTEMS /////////////////////////

// fs.readFile("./txt/start.txt", 'utf-8', (err, data1) => {
//     console.log(data1);
    
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2);
        
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3)=>{
//             console.log(data3);

//             fs.writeFile(`./txt/final.txt`, `${data2}\n ${data3}`, 'utf-8', err =>{
//                 console.log("file successfully written... Hurray!!");
//             });
//         });
           
//     });
// });
// console.log("reading file...");


///////////////////////////////////////////////////// SERVER /////////////////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// console.log(data);



const tempOverview = fs.readFileSync(`${__dirname}/templates/templateoverview.html`, "utf-8");
const prodOverview = fs.readFileSync(`${__dirname}/templates/templateproduct.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
// console.log(tempCard);
const dataObject = JSON.parse(data);
// console.log(dataObject)
const server = http.createServer((req, res) => {
const {query, pathname} = url.parse(req.url, true)

    //overview
    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200, {"Content-type": "text/html"});
        const cardsHtml = dataObject.map(el => templateReplacer(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT-CARDS%}', cardsHtml);
        res.end(output) ;

        //product page
    }else if(pathname === "/product"){
        res.writeHead(200, {"Content-type": "text/html"});
        const product = dataObject[query.id];
        output = templateReplacer(prodOverview, product);
        res.end(output);

        // API
    }else if(pathname === "/api"){
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(data);
    }else{
        res.writeHead(404, {
        "Content-type" : 'text/html'
    });
    res.end("<h1>server not found</h1>");
    }
});
server.listen(port, '127.0.0.1', ()=> {
    console.log(`server is listening on port ${port}`);
});

