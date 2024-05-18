const express = require('express')
const app = express()
const dotenv = require('dotenv'); // dotenv 모듈
dotenv.config()

app.listen(process.env.PORT)

const userRouter = require('./routes/users')
const channelRouter = require("./routes/channels")

app.use("/", userRouter)  // 각기 다른 경로에 미들웨어 장착
app.use("/channels", channelRouter)  // 공통된 url을 빼줄 수 있음