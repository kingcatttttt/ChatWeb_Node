const mysql2 = require("mysql2");
const http = require("http");

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "qweqwe",
    database: "chat_wed"
})

const server = http.createServer(function (req, res) {
    switch (req.url) {
        case "/messages":
            conn.query(
                "SELECT * FROM message",
                function (err, results, fields) {
                    let html = "<html><body><ul>";
                    console.log(results);
                    results.forEach(r => html += `<li>${r.content}</li>`);
                    html += `</ul>
                            <form method="POST" action="/add">
                                <input type="text" name="content">
                            </form></body></html>`
                    res.writeHead(200, { "Content-type": "text/html" });
                    res.end(html);
                }
            )
            break;
        case "/friends":
            conn.query(
                "SELECT * FROM user",
                function (err, results, fields) {
                    let html = "<html><body><ul>";
                    console.log(results);
                    results.forEach(r => html += `<li>${r.login}</li>`);
                    html += `</ul></body></html>`
                    res.writeHead(200, { "Content-type": "text/html" });
                    res.end(html);
                }
            )
            break;
        
        case "/add":
            let data = "";
            req.on("data", function(chunk) {
                data += chunk;
            })
            req.on("end", function () {
                let obj = new URLSearchParams(data);
                let content = obj.get("content");
                conn.query(
                    `INSERT INTO message(content, dialog_id, author_id)
                    VALUES ('${content}', 1, 1)`,
                    function (err, results, fields) {
                        res.writeHead(302, {"Location": "/messages"});
                        res.end();
                    }
                )
            })
            break;
        default:
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>Page not found</h1>")
    }
})
server.listen(3000);