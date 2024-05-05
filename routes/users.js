// express 모듈 셋팅
const express = require('express')
const router = express.Router() // app.js가 user-demo를 찾을 수 있게 해줌 > express의 router로 사용가능

router.use(express.json())  // http 외 모듈 'json'

let db = new Map()
var id = 1

// 로그인
router
    .post('/login', (req, res) => {
        console.log(req.body)  // userId, password

        // userId가 db에 저장된 회원인지 확인해야함
        const { userId, password } = req.body
        var loginUser = {}

        db.forEach(function(user, id) {
            if ( user.userId === userId ) {  // userId가 같을 경우
                loginUser = user
            }
        })
        
        if (isExist(loginUser)) {
            // pw가 같을 경우
            if (loginUser.password === password) {  
                res.status(200).json({
                    message : `${loginUser.name}님 로그인 되었습니다.`
                })
            } else {  // pw 틀린 경우
                res.status(400).json({
                    message : `비밀번호가 틀렸습니다.`
                })
            }
        } else {  // length === 0 (빈 객체일 경우)
            res.status(404).json({
                message : `회원 정보가 없습니다.`
            })
        }
    })

function isExist(obj) {
    if (Object.keys(obj).length) {  // 객체가 안비었을 경우 (객체 존재)
        return true
    } else {  // 객체가 비었을 경우
        return false
    }
}

// 회원가입
router
    .post('/join', (req, res) => {
        console.log(req.body)  // json형태로 날라옴
        
        if (req.body == {}) {
            res.status(404).json({
                message : `입력 값을 다시 확인해주세요.`
            })
        } else {
            const { userId } = req.body
            db.set(userId, req.body)

            res.status(201).json({
                message : `${db.get(userId).name}님 환영합니다.`
            })
        }
    })

router
    // 회원 개별 조회
    .route('/users')
    .get(function (req, res) {
        let { userId } = req.body

        const user = db.get(userId)
        // user가 있을 경우
        if (user) {
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        } else {  // user가 없을 경우
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        }
    })
    // 회원 개별 탈퇴
    .delete(function (req, res) {
        let { userId } = req.body

        const user = db.get(userId)
        // user의 값이 있을 경우
        if (user) {
            db.delete(userId)
            
            res.status(200).json({
                message : `${user.name}님 다음에 또 뵙겠습니다.`
            })
        } else { // user의 값이 없을 경우
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        }
    })

module.exports = router  // 모듈화