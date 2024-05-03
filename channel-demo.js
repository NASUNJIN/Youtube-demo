const express = require('express')
const app = express()
app.listen(3000)
app.use(express.json())

let db = new Map()
var id = 1

// route 사용
app
    .route('/channels')
    // 채널 전체 조회
    .get((req, res) => {
        if(db.size) {  // db 값이 있을 경우
            var channels = []   // json arry
            
            db.forEach(function(value, key) {
                channels.push(value)
            })
    
            res.status(200).json(channels)
        } else {
            res.status(404).json({
                message : "조회할 채널이 없습니다."
            })
        }
    })

    // 채널 개별 생성 = db 저장
    .post((req, res) => {
        if (req.body.channelTitle) {  // db에 channelTitle 값이 있을 경우
            db.set(id++, req.body)
    
            res.status(201).json({
                message : `${db.get(id-1).channelTitle} 채널을 응원합니다.`
            })
        } else {
            res.status(400).json({
                message : "요청 값을 제대로 보내주세요."
            })
        }
    })



app
    .route('/channels/:id')
    // 채널 개별 조회
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {  // 객체 있음
            res.status(200).json(channel)
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    })

    // 채널 개별 수정
    .put((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        var oldTitle = channel.channelTitle
        if (channel) {  // 객체 있음
            var newTitle = req.body.channelTitle

            channel.channelTitle = newTitle
            db.set(id, channel)

            res.json({
                message : `채널명이 ${oldTitle}에서 ${newTitle}로 수정되었습니다.`
            })
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    })

    // 채널 개별 삭제
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {  // 객체 있음
            db.delete(id)

            res.status(200).json({
                message : `${channel.channelTitle}이 정상적으로 삭제되었습니다.`
            })
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    })
