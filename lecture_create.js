const Input = require("./userInput");
let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//강의번호입력
async function lecture_id() {
  console.log("강의번호 입력>");
  let lecture_id = await Input.getUserInput();
  return lecture_id;
}

//강의명 입력
async function lecture_name() {
  console.log("강의명 입력>");
  let lecture_name = await Input.getUserInput();
  return lecture_name;
}

//강의요일 입력
async function lecture_day() {
  console.log("강의요일 입력>");
  let lecture_day = await Input.getUserInput();
  return lecture_day;
}

//강의시간 입력
async function lecture_time() {
  console.log("강의시간 입력>");
  let lecture_time = await Input.getUserInput();
  return lecture_time;
}

//강의학점 입력
async function lecture_credit() {
  console.log("강의학점 입력>");
  let lecture_credit = await Input.getUserInput();
  return lecture_credit;
}

//교수 id선택
async function professor_id() {
  return new Promise(async (resolve, reject) => {
    try {
      const professors = await getProfessorList();

      console.log("Professor List:");
      professors.forEach((professor, index) => {
        console.log(
          `${index + 1}. ${professor.professor_name} - ${
            professor.professor_id
          } - ${professor.professor_major}`
        );
      });

      console.log("교수번호 선택:");
      let selectedProfessorIndex = await Input.getUserInput();

      resolve(professors[selectedProfessorIndex - 1].professor_id);
    } catch (error) {
      console.error("Error fetching professors:", error);
      reject(error);
    }
  });
}

// 데이터베이스에서 교수 목록을 가져오는 함수
function getProfessorList() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT professor_id, professor_name, professor_tel, professor_major FROM professor";
    connection.query(sql, (error, results) => {
      if (error) {
        console.error("교수 목록을 가져오는 중 오류 발생:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

//전공,교양 선택
async function lecture_type() {
  console.log("강의형태 입력(전공 or 교양)>");
  let lecture_type = await Input.getUserInput();
  return lecture_type;
}

//전공선택
async function major_id() {
  return new Promise(async (resolve, reject) => {
    try {
      const majors = await getMajorList();

      console.log("Major List:");
      majors.forEach((major, index) => {
        console.log(`${index + 1}. ${major.college} - ${major.major_name}`);
      });

      console.log("전공번호 선택:");
      let selectedMajorIndex = await Input.getUserInput();

      resolve(majors[selectedMajorIndex - 1].major_id);
    } catch (error) {
      console.error("Error fetching majors:", error);
      reject(error);
    }
  });
}

// 데이터베이스에서 전공 목록을 가져오는 함수
function getMajorList() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT major_id, college, major_name FROM major";
    connection.query(sql, (error, results) => {
      if (error) {
        console.error("전공 목록을 가져오는 중 오류 발생:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

async function addLectureToDatabase() {
  try {
    let id = await lecture_id();
    let name = await lecture_name();
    let day = await lecture_day();
    let time = await lecture_time();
    let credit = await lecture_credit();
    let p_id = await professor_id();
    let type = await lecture_type();
    let m_id = await major_id();

    let sql =
      "INSERT INTO lecture(lecture_id, lecture_name, lecture_day, lecture_time, lecture_credit, professor_id, lecture_type, major_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [id, name, day, time, credit, p_id, type, m_id],
      (error, results) => {
        if (error) {
          console.error("Error inserting lecture:", error);
        } else {
          console.log("Lecture information inserted successfully.");
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

function main() {
  addLectureToDatabase()
    .then(() => {
      console.log("Main 함수 실행 중...");
    })
    .catch((error) => {
      console.log("Main 에러 발생 : ", error);
    });
}

module.exports = { main };
