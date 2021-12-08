## 1. 구현 기능 상세

```
* 책 정보를 삽입한다.
 - 중복검사: ./utils 의 isExist: 각 파일을 읽고 title과 author 정보를 비교해 이미 있다면 중복으로 처리한다.
 - 입력값: userId, title, author, published, price 이며 모든 요소는 required이다.
 - 글의 id는 길이 10의 hash된 random 값을 이용해 배정한다. ( crypto의 randomBytes )
 - 책 정보가 오지 않은 경우: req.body가 비어있는 경우, required 요소가 비어있는 경우 403에러 처리한다.

* 책 정보를 조회한다.
 - 정렬기능 : query로 order에 대한 정보를 받는다. 'asce': 책 이름으로 오름차순, 'desc': 책 이름으로 내림차순을 설정한다.
 - ./utils 의 ascendingSort, descendingSort

* 책 정보를 수정한다.
 - 책 id를 path로 받고, 수정할 정보를 body로 받는다.
 - 책이 존재하지 않는 경우 에러 처리한다.
 - 정보가 다 있지 않은 경우 에러 처리한다.

* 책 정보를 삭제한다. 
  - 제약조건(해당 책 정보 생성자 만이 삭제) : userId를 비교해 생성한 userId와 같은 경우에만 삭제가 가능하다.
  - 존재하지 않는 책일 경우 에러 처리한다.

  * 협업을 위한 API spec: swagger 로 구현. /api-docs로 접근
```

## 2. 사용기술
```
* 코드 컨벤션:
 - eslint: 'eslint:recommended', {} 사이 2개 스페이스, double quote 를 사용한다.
 - prettier를 사용한다.
 - babel/core, babel/preset-env을 사용한다.
 - JS 환경으로 import sorter는 사용하지 않는다.

* express: 4000번 포트를 사용한다.

* bcrypt: id 해쉬화를 위해 사용한다.
* jest, suptertest: API 테스트 툴을 위해 사용한다.
* nodemon: 재로딩을 위해 사용한다.
* swagger: API spec을 위해 사용한다.

* docker: 도커 이미지 배포를 위해 사용한다.
* AWS EC2: 배포를 위해 사용한다.
* postman: API 테스트를 위해 사용한다.
```


## 3. 배포

### docker
`$ docker pull ej00923/task3` <br/>
`$ docker run -p 4000:4000 ej00923/task3` <br/>

* 도커 파일 구성
```
- node: 17 : docker가 지원하는 node 버전 중 가장 최신 버전으로 debian 배포, full support 버전 지원.
- 4000번 포트를 이용한다.
```
### EC2 (현재는 서버를 내렸습니다.)
구동 서버 주소: <br/>
[ec2-13-125-229-75.ap-northeast-2.compute.amazonaws.com:4000](http://ec2-13-125-229-75.ap-northeast-2.compute.amazonaws.com:4000) <br/>

구동 서버로 Swagger 접근:  <br/>
[ec2-13-125-229-75.ap-northeast-2.compute.amazonaws.com:4000/api-docs](http://ec2-13-125-229-75.ap-northeast-2.compute.amazonaws.com:4000/api-docs/) <br/>


## 4. 테스트

#### 로컬 테스트
```
* 실행방법: 
1. ./db의 파일들을 모두 사젝하고 ./testdb에 있는 파일을 옮긴다.
2. 루트 디렉터리에서 npm run test를 실행한다.

실행결과 예시:

 PASS  ./test.spec.js
  API 테스트
    √ 입력 성공 (286 ms)
    √ 입력 실패 (20 ms)
    √ 조회 성공 (12 ms)
    √ 조회 실패 (18 ms)
    √ 업데이트 성공 (13 ms)
    √ 업데이트 실패 (24 ms)
    √ 삭제 성공 (9 ms)
    √ 삭제 실패 (9 ms)

------------|---------|----------|---------|---------|---------------------------------------------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|---------------------------------------------------------
All files   |   68.75 |    51.66 |      50 |   74.25 |
 app.js     |   70.14 |    58.33 |      50 |    75.8 | 32,78,89,97,101,135-136,143-144,151,218,225,229,281,285
 swagger.js |     100 |      100 |     100 |     100 |
 utils.js   |   65.11 |    41.66 |      50 |   70.27 | 6,13-16,44-45,50-51,66,83,89
------------|---------|----------|---------|---------|---------------------------------------------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        5.015 s
```
#### Postman 을 통한 API 테스트
[✨ Postman 테스트 링크](https://www.postman.com/solar-trinity-109023/workspace/jaeyoung-public-workspace/collection/16110658-dc4f4883-b82d-4105-945a-1071d6f0ad17)


#### Swagger를 통한 API 테스트
[✨ Swagger 테스트 링크](http://ec2-13-125-229-75.ap-northeast-2.compute.amazonaws.com:4000/api-docs/)


## 5. DB
```
CREATE TABLE book (
  id VARCHAR(32) PRIMARY KEY,
  userId VARCHAR(32) NOT NULL,
  title VARCHAR(32) NOT NULL,
  author VARCHAR(32) NOT NULL,
  published INTEGER(11) NOT NULL,
  price INTEGER(11) NOT NULL,
);
```
