const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');

router.use(express.json())

// middleware
// validate가 하나의 모듈이 됨
const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {  // err가 없을 경우 (에러값이 비었을 경우)
        return next(); // 다음 할 일 찾아가삼 (미들웨어, 함수)
    } else {
        console.log(err.array())
        return res.status(400).json(err.array())
    }
}



// route 사용
router
    .route('/')
    // 채널 전체 조회
    .get(
        // 유효성 검사 : 사용자의 요청에 대한 내용
        [
            body('userId').notEmpty().isInt().withMessage('숫자만 입력해주세요'),
            validate
        ],
        (req, res, next) => {

            var { userId } = req.body  // userId 받아오기

            let sql = `SELECT * FROM channels WHERE user_id = ?`
            conn.query(sql, userId,
                function (err, results) {
                    if(err) {   // 에러 발생
                        console.log(err)
                        return res.status(400).end
                    }

                    if (results.length) {  // 결과값이 있을 경우
                        res.status(200).json(results)
                    } else {
                        res.status(404).json({
                            message : "채널 정보를 찾을 수 없습니다."
                        })
                    }
                }
            ) 
    })

    // 채널 개별 생성
    .post(
        // validator express로 받아온 body, 비어선 안되고, 정수여야함
        [
            body('userId').notEmpty().isInt().withMessage('숫자만 입력해주세요'),  // userId 유효성 검사
            body('name').notEmpty().isString().withMessage('문자만 입력해주세요'),
            validate
        ]     // name 유효성 검사
        , (req, res) => {
            const { name, userId } = req.body
        
            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`  // user_id : db coulmn 이름
            let values = [name, userId]
            conn.query(sql, values,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    res.status(201).json(results)
                }
            )
    })

router
    .route('/:id')
    // 채널 개별 조회
    .get(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req, res) => {
            let {id} = req.params
            id = parseInt(id)

            let sql = `SELECT * FROM channels WHERE id = ?`
            conn.query(sql, id,
                function (err, results, fields) {
                    if (err) {   // err 발생
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {  // 결과값이 있을 경우
                        res.status(200).json(results)
                    } else {
                        res.status(404).json({
                            message : "채널 정보를 찾을 수 없습니다."
                        })
                    }
                }
            )
    })

    // 채널 개별 수정
    .put(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate
        ],
        (req, res) => {
            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            // channel의 name을 바꿔달라 id값이 ?을
            let sql = `UPDATE channels SET name = ? WHERE id = ?`
            let values = [name, id]
            conn.query(sql, values,
                function (err, results, fields) {
                    if (err) {   // err 발생
                        console.log(err)
                        return res.status(400).end()
                    }

                    // 없는 id 값을 수정 할 경우
                    if (results.affectedRows == 0) {
                        console.log(err)
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
    })

    // 채널 개별 삭제
    .delete(
        [
            param('id').notEmpty().isInt().withMessage('채널 id 필요'),
            validate
        ],
        (req, res) => {
            let {id} = req.params
            id = parseInt(id)

            let sql = `DELETE FROM channels WHERE id = ?`
            conn.query(sql, id,
                function (err, results, fields) {
                    if (err) {   // err 발생
                        console.log(err)
                        return res.status(400).end()
                    }

                    // 없는 id 값을 수정 할 경우
                    if (results.affectedRows == 0) {
                        console.log(err)
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
    })

module.exports = router  // 모듈화