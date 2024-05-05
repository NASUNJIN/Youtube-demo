const express = require('express')
const app = express()
app.listen(3000)

const userRouter = require('./routes/users')
const channelRouter = require("./routes/channels")

app.use("/", userRouter)  // 각기 다른 경로에 미들웨어 장착
app.use("/channels", channelRouter)  // 공통된 url을 빼줄 수 있음