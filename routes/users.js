// express 모듈 셋팅
const express = require('express')
const router = express.Router() // app.js가 user-demo를 찾을 수 있게 해줌 > express의 router로 사용가능
const conn = require('../mariadb')

router.use(express.json())  // http 외 모듈 'json'

// 로그인
router
    .post('/login', (req, res) => {
        const { email, password } = req.body
        
        let sql = `SELECT * FROM users WHERE email = ?`
        conn.query (sql, email,  // ?에 email 값이 들어옴
            function (err, results) {
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
    .post('/join', (req, res) => {
        // body에 값이 있을 경우
        if (req.body == {}) {
            res.status(404).json({
                message : `입력 값을 다시 확인해주세요.`
            })
        } else {  // body에 값이 없을 경우
            const { email, name, password, contact } = req.body

            let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
            let values = [email, name, password, contact]
            conn.query(sql, values,
                function (err, results) {
                    res.status(201).json(results)
                }
            );
        }
    })

router
    // 회원 개별 조회
    .route('/users')
    .get(function (req, res) {
        let { email } = req.body

        let sql = `SELECT * FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results, fields) {
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
    .delete(function (req, res) {
        let { email } = req.body

        let sql = `DELETE FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results, fields) {
                res.status(200).json(results)
            }
        );
    })

module.exports = router  // 모듈화