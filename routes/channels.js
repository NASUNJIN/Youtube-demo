const express = require('express')
const router = express.Router()
router.use(express.json())

let db = new Map()
var id = 1

// route 사용
router
    .route('/')
    // 채널 전체 조회
    .get((req, res) => {
        var { userId } = req.body  // userId 받아오기
        var channels = []   // json arry

        if(db.size && userId) {  // db.size와 userId가 있을 경우 
            db.forEach(function(value, key) {
                if (value.userId === userId) {
                    channels.push(value)
                }
            })

            // usserId가 가진 채널이 있을 경우
            if (channels.length) {
                res.status(200).json(channels)
            } else {  // usserId가 가진 채널이 없을 경우
                notFoundChannel()
            }
        } else { // db와 userId의 값이 없을 경우
            notFoundChannel()
        }
    })

    // 채널 개별 생성 = db 저장
    .post((req, res) => {
        if (req.body.channelTitle) {  // db에 channelTitle 값이 있을 경우
            let channel = req.body
            db.set(id++, channel)
    
            res.status(201).json({
                message : `${db.get(id-1).channelTitle} 채널을 응원합니다.`
            })
        } else {
            res.status(400).json({
                message : "요청 값을 제대로 보내주세요."
            })
        }
    })



router
    .route('/:id')
    // 채널 개별 조회
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {  // 객체 있음
            res.status(200).json(channel)
        } else {
            notFoundChannel()
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
            notFoundChannel()
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
            notFoundChannel()
        }
    })

// 채널 정보를 찾을 수 없습니다.
function notFoundChannel() {
    res.status(404).json({
        message : "채널 정보를 찾을 수 없습니다."
    })
}


module.exports = router  // 모듈화