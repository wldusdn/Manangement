
const mysql = require('mysql');
const Input = require('./userInput');

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 비동기 방식으로 진행, 데이터 삭제를 입력받음
async function deleteData() {
    console.log('삭제할 행 번호 입력 : ');
// await 으로 해당 줄 동기적으로 실행
    const id = await Input.getUserInput();
// 쿼리를 사용하여 해당 번호의 행 삭제
    const sql = `delete from student where id = ?`;
// sql 쿼리 작성
    connection.query(sql, [id], (error, results) => {
        if (error) return console.error(error.message);
// affectedRows 삭제된 데이터의 개수를 나타냄, 결과처리
        if (results.affectedRows === 0) {
            console.log(`번호 ${id}에 해당하는 데이터가 없습니다.`);
        } else {
            console.log(`번호 ${id} 가 삭제 되었습니다.`);
        }
    });
}

module.exports = deleteData;