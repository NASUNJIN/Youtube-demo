// express 모듈 셋팅
const express = require('express')
const app = express()
app.listen(3000)
app.use(express.json())  // http 외 모듈 'json'

let db = new Map()
var id = 1

// 로그인
app.post('/login', (req, res) => {
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
        console.log("아이디 같음")
        
        // pw가 같을 경우
        if (loginUser.password === password) {  
            console.log("패스워드도 같음")
        } else {  // pw 틀린 경우
            console.log("패스워드 다름")
        }
    } else {  // length === 0 (빈 객체일 경우)
        console.log("입력하신 아이디는 없습니다.")
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
app.post('/join', (req, res) => {
    console.log(req.body)  // json형태로 날라옴
    
    if (req.body == {}) {
        res.status(404).json({
            message : `입력 값을 다시 확인해주세요.`
        })
    } else {
        db.set(id++, req.body)

        res.status(201).json({
            message : `${db.get(id-1).name}님 환영합니다.`
        })
    }
})

app
    .route('/users/:id')
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)  // id값 숫자로 바꾸기
    
        const user = db.get(id)
        if (user == undefined) {
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        } else {
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }
    })
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)  // id값 숫자로 바꾸기
    
        const user = db.get(id)
        if (user == undefined) {
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        } else {
            db.delete(id)
    
            res.status(200).json({
                message : `${user.name}님 다음에 또 뵙겠습니다.`
            })
        }
    })

// 회원 개별 조회
// app.get('/users/:id', (req, res) => {
//     let {id} = req.params
//     id = parseInt(id)  // id값 숫자로 바꾸기

//     const user = db.get(id)
//     if (user == undefined) {
//         res.status(404).json({
//             message : "회원정보가 없습니다."
//         })
//     } else {
//         res.status(200).json({
//             userId : user.userId,
//             name : user.name
//         })
//     }
// })

// 회원 개별 탈퇴
// app.delete('/users/:id', (req, res) => {
//     let {id} = req.params
//     id = parseInt(id)  // id값 숫자로 바꾸기

//     const user = db.get(id)
//     if (user == undefined) {
//         res.status(404).json({
//             message : "회원정보가 없습니다."
//         })
//     } else {
//         db.delete(id)

//         res.status(200).json({
//             message : `${user.name}님 다음에 또 뵙겠습니다.`
//         })
//     }
// })