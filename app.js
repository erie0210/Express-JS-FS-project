import express from 'express';
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import { randomBytes } from 'crypto';
import { isExist, isExistById, isAuthorized } from './utils.js';
import { makeJson } from './utils.js';  
import { ascendingSort, descendingSort } from './utils.js';


const app = express();
const PORT = 4000;

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      response:
 *        200:
 *          description: 랜딩 페이지
 */
app.get('/', async (req, res) => {
  return res.send('안녕하세요, 책을 저장하는 사이트입니다.');
});

/**
 * @swagger
 * paths:
 *  /book:
 *    post:
 *      summary: 새로운 책 정보 입력
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  required: true
 *                  example: "a1b2c3"
 *                  type: string
 *                title:
 *                  required: true
 *                  example: "book title"
 *                  type: string
 *                author:
 *                  require: true
 *                  example: "book author"
 *                  type: string
 *                published:
 *                  require: true
 *                  example: 1990
 *                  type: number
 *                price:
 *                  required: true
 *                  example: 12000
 *                  type: number
 *      description:  새로운 책 정보 입력
 *      responses:
 *        200:
 *          description: 데이터 베이스 입력 성공
 *        403:
 *          description: 데이터 베이스 입력 실패
 */
export const postBook = app.post('/book', async (req, res) => {

  // 예외처리
  if(req.body=={}){
    return res.status(403).send('책 정보를 입력해주세요.');
  }
  if (isExist(req.body)) {
    return res.status(403).send('이미 책이 존재합니다.');
  }

  // 책정보 parsing
  const {
    body: { userId, title, author, published, price },
  } = req;
  if ( userId === "" || title === "" || author === "" || published === "" ||price === "" ) {
    return res.status(403).send('책 정보를 입력해주세요.');
  }

  // 책정보 입력
  try {
    const id = randomBytes(10).toString('hex');
    const bookJson = makeJson(req.body, id)
    fs.writeFileSync(`./db/${id}.txt`, bookJson, (error) => {
      if (error) throw error;
    });
    return res.send('저장되었습니다.');
  } catch (error) {
    return res.status(403).send('저장하지 못했습니다');
  }
});

/**
 * @swagger
 * paths:
 *  /allbooks:
 *    get:
 *      summary: 책 정보 조회
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *        - application/xml
 *      parameters:
 *        - in: query
 *          name: order
 *          type: string
 *          description: "정렬 순서, 'asce': 오름차순, 'desc': 내림차순"
 *      description: 책 정보 조회
 *      responses:
 *        200:
 *          description: 데이터 베이스 조회 성공
 *        403:
 *          description: 데이터 베이스 조회 실패
 */
export const getAllBooks = app.get('/allbooks', async (req, res) => {
  const {
    query: { order },
  } = req;

  // db 폴더의 모든 파일 이름을 list로 가져온다
  const books = fs.readdirSync('./db', (error, fileList) => {
    if (error) throw error;
    return fileList;
  });

  // 파일 속 컨텐츠를 list 형태로 만든다
  const jsonBooksResult = [];
  books.map((bookInfo) => {
    const book = fs.readFileSync(`./db/${bookInfo}`, 'utf-8', (error, data) => {
      if (error) throw error;
      return data;
    });
    jsonBooksResult.push(JSON.parse(book));
  });

  // order에 따라 정렬해서 return한다. default: asce
  if (order === 'desc') {
    jsonBooksResult.sort(descendingSort);
  } else {
    jsonBooksResult.sort(ascendingSort);
  }
  
  return res.send(jsonBooksResult);
});

/**
 * @swagger
 * paths:
 *  /book/{id}:
 *    put:
 *      summary: 기존 책 정보 업데이트
 *      parameters:
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *          example: "2cf6db814205dc2fd478"
 *          description: 글 id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  required: true
 *                  example: "a1b2c3"
 *                  type: string
 *                title:
 *                  required: true
 *                  example: "book title"
 *                  type: string
 *                author:
 *                  require: true
 *                  example: "book author"
 *                  type: string
 *                published:
 *                  require: true
 *                  example: 1990
 *                  type: number
 *                price:
 *                  required: true
 *                  example: 12000
 *                  type: number
 *      description: 기존 책 정보 업데이트
 *      responses:
 *        200:
 *          description: 데이터 베이스 업데이트 성공
 *        403:
 *          description: 데이터 베이스 업데이트 실패 
 */
export const updateBook = app.put('/book/:id', (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    body: { userId, title, author, published, price },
  } = req;

  // 예외처리
  if (!isExistById(id)) {
    return res.status(403).send('존재하지 않는 책입니다.');
  }
  if (userId== '' || title == '' || author == '' || published == '' || price == '') {
    return res.status(403).send('정보를 모두 입력해주세요');
  }

  // 책 정보 수정
  try {
    const bookJson = makeJson(req.body, id);
    fs.writeFileSync(`./db/${id}.txt`, bookJson, (error) => {
      if (error) throw error;
    });
    return res.send('수정되었습니다.');
  } catch (error) {
    return res.status(403).send('수정하지 못했습니다');
  }
});

/**
 * @swagger
 * paths:
 *  /book/{id}:
 *    delete:
 *      summary: 기존 책 정보 삭제
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *        - application/xml
 *      parameters:
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *          description: 책의 id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  required: true
 *                  example: "a1b2c3"
 *                  type: string
 *                  description: 유저 id
 *      description: 기존 책 정보 삭제
 *      responses:
 *        200:
 *          description: 데이터 베이스 삭제 성공
 *        403:
 *          description: 데이터 베이스 삭제 실패 
 */
export const deleteBook = app.delete('/book/:id', (req, res) => {
  const {
    params: { id },
  } = req;

  const {
    body: { userId },
  } = req;

  if (!isExistById(id)) {
    return res.status(403).send('존재하지 않는 책입니다.');
  }
  if (!isAuthorized(id, userId)) {
    return res.status(403).send('사용자와 생성자가 다릅니다.');
  }

  fs.unlinkSync(`./db/${id}.txt`, (error) => {
    if (error) return res.status(403).send('삭제하지 못했습니다');
  });
  return res.status(200).send('성공적으로 삭제되었습니다.');
});

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}.`);
});

export default app;