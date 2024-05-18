// express 모듈 셋팅
const express = require('express')
const router = express.Router() // app.js가 user-demo를 찾을 수 있게 해줌 > express의 router로 사용가능
const conn = require('../mariadb')
const { body, param, validationResult } = require('express-validator'); // 유효성 검사

router.use(express.json())  // http 외 모듈 'json'

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

// 로그인
router
    .post(
        '/login', 
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
            validate
        ],
        (req, res) => {
            const { email, password } = req.body
            
            let sql = `SELECT * FROM users WHERE email = ?`
            conn.query (sql, email,  // ?에 email 값이 들어옴
                function (err, results) {
                    if (err) {   // err 발생
                        console.log(err)
                        return res.status(400).end()
                    }
                    
                    var loginUser = results[0];
                    // 로그인 유저가 있을 경우 && results로 받아온 password의 값이 body 값의 (db) password랑 같다면
                    if (loginUser && (loginUser.password == password)) {  
                        res.status(200).json({
                            message : `${loginUser.name}님 로그인 되었습니다.`
                        })
                    } else {  // 회원이 없을 경우
                        res.status(404).json({
                            message : `이메일 또는 비밀번호가 틀렸습니다.`
                        })
                    }
                }
            );
    })

// 회원가입
router
    .post(
        '/join', 
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            body('name').notEmpty().isString().withMessage('이름 확인 필요'),
            body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
            body('contact').notEmpty().isString().withMessage('연락처 확인 필요'),
            validate
        ],
        (req, res) => {
            const { email, name, password, contact } = req.body

            let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
            let values = [email, name, password, contact]
            conn.query(sql, values,
                function (err, results) {
                    if (err) {   // err 발생
                        console.log(err)
                        return res.status(400).end()
                    }

                    res.status(201).json(results)
                }
            );
    })

router
    // 회원 개별 조회
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        function (req, res) {
            let { email } = req.body

            let sql = `SELECT * FROM users WHERE email = ?`
            conn.query(sql, email,
                function (err, results, fields) {
                    if (err) {   // err 발생
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        // 결과값이 없을 경우
                        res.status(404).json({
                            message : "회원정보가 없습니다."
                        })
                    }
                }
            );
    })
    // 회원 개별 탈퇴
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        function (req, res) {
            let { email } = req.body

            let sql = `DELETE FROM users WHERE email = ?`
            conn.query(sql, email,
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
            );
    })

module.exports = router  // 모듈화