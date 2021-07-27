const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const ACTION_SECRET = "secretActionToken";
const JWT_SECRET = "qwertyuiopasdfghjklzxcvbnmqwertyuiop";
//const token = jwt.sign({guid: "fb990d4d-de94-46cf-a1dc-a6acf5cd1c56"}, "test")

const app = express();

const PORT = 3012;

const users = [
  {
    id : 1,
    username : "tiger.coder",
    password : "test",
    roles: [
      "admin"
    ]
  },
  {
    id : 2,
    username : "anton1",
    password : "test",
    roles: [
      "user", "driver"
    ]
  },
  {
    id : 3,
    username : "anton2",
    password : "test",
    roles : [
      "user", "manager", "news-redactor"
    ]
  }
];

app.use(bodyParser.json());

app.use(async (req, res, next)=>{
  if (req.header("ACTION_SECRET") === ACTION_SECRET){
    next();
  }else {
    return res.status(403).json({
      message: "access denied"
    })
  }
})


// Request Handler
app.post('/auth', async (req, res) => {

  // get request input
  const { username, password } = req.body.input;
  console.log(req.body)

  if (!username || !password)
    return res.status(400).json({
      message: "username adn password"
    })


  let user = users.find(x=>x.username === username && x.password === password);
  if (!user) return res.status(401).json({
    message: "user not found"
  })

  let token = jwt.sign({
    username: user.username,
    hasura_claims: {
      "x-hasura-allowed-roles": user.roles,
      "x-hasura-default-role": "user",
      "x-hasura-user-id": `${user.id}`,
    }
  }, JWT_SECRET);

  // success
  return res.json({
    accessToken: token
  })

});

app.listen(PORT);
