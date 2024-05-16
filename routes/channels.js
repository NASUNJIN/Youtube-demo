const express = require('express')
const router = express.Router()
router.use(express.json())
const conn = require('../mariadb')

let db = new Map()
var id = 1

// route 사용
router
    .route('/')
    // 채널 전체 조회
    .get((req, res) => {
        var { userId } = req.body  // userId 받아오기

        let sql = `SELECT * FROM channels WHERE user_id = ?`
        // userId가 있을 경우
        if (userId) { 
            conn.query(sql, userId,
                function (err, results, fields) {
                    if (results.length) {  // 결과값이 있을 경우
                        res.status(200).json(results)
                    } else {
                       notFoundChannel(res)
                    }
                }
            )
        } else {  // userId에 값이 없을 경우
            res.status(400).end()
        }
    })

    // 채널 개별 생성 = db 저장
    .post((req, res) => {
        const { name, userId, } = req.body  // userId : 변수
        if (name && userId) {  // name, userId 모두 있을 경우

            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`  // user_id : db coulmn 이름
            let values = [name, userId]
            conn.query(sql, values,
                function (err, results) {
                    res.status(201).json(results)
                }
            )
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

        let sql = `SELECT * FROM channels WHERE id = ?`
        conn.query(sql, id,
            function (err, results, fields) {
                if (results.length) {  // 결과값이 있을 경우
                    res.status(200).json(results)
                } else {
                   notFoundChannel(res)
                }
            }
        );
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
function notFoundChannel(res) {
    res.status(404).json({
        message : "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router  // 모듈화