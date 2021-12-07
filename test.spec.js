import app from './app.js';
import request from 'supertest';


describe("API 테스트", () => {
  it("입력 성공", (done) => {
    const data = { 
      "userId": "user_123",
      "title": "title_123",
      "author": "author_123",
      "published": 123000,
      "price": 1230000 
    };
    request(app)
      .post('/book')
      .send(data)
      .then(res=>{
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        done();
      });
  });

  it("입력 실패", (done) => {
    const data = { 
      "userId": "a1b2c3",
      "title": "new title",
      "author": "new author",
      "published": 3000,
      "price": 30000 
    };
    request(app)
      .post('/book')
      .send(data)
      .then(res=>{
        expect(res.statusCode).toBe(403);
        done();
      });
  });

  it("조회 성공", (done) => {
    request(app)
    .get('/allbooks')
    .then(res=>{
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeTruthy();
      done();
    });
  });

  it("조회 실패", (done) => {
    request(app)
    .get('/allbooks1')
    .then(res=>{
      expect(res.statusCode).toBe(404);
      done();
    });
  });

  it("업데이트 성공", (done) => {
    const data = { 
      "userId": "a1b2c3",
      "title": "update title",
      "author": "update author",
      "published": 3000,
      "price": 30000 
    };
    request(app)
      .put('/book/a1b2c3')
      .send(data)
      .then(res=>{
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        done();
      });
  });

  it('업데이트 실패',(done)=>{
    request(app)
      .put(`/book/123`)
      .expect(403)
      .end(done)
  });

  it('삭제 성공',(done)=>{
    request(app)
      .delete(`/book/d4e5f6`)
      .send({
        "userId": "a1b2c3"
      })
      .expect(200)
      .end(done)
  });

  it('삭제 실패',(done)=>{
    request(app)
      .delete(`/book/abc`)
      .expect(403)
      .end(done)
  });
});
