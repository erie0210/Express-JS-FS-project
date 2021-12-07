import * as fs from "fs";

// 오름차순 정렬
export const ascendingSort = (current, next) => {
  if (current.title == next.title) {
    return 0;
  }
  return current.title > next.title ? 1 : -1;
};

// 내림차순 정렬
export const descendingSort = (current, next) => {
  if (current.title == next.title) {
    return 0;
  }
  return current.title > next.title ? -1 : 1;
};

// request Body로 들어온 책 정보를 JOSN 형태로 바꾸는 함수
export const makeJson = (body, id) => {
  const { 
    userId,
    title,
    author,
    published,
    price
  } = body;

  const bookInfo = {
    id: id,
    userId: userId,
    title: title,
    author: author,
    published: published,
    price: price,
  };

  return JSON.stringify(bookInfo);
}

// 책이 이미 재고에 있는 지 확인하는 함수
export const isExist = (bookInfo) => {
  const books = fs.readdirSync("./db", (error, fileList) => {
    if (error) throw error;
    return fileList;
  });

  for (let i = 0; i < books.length; i++) {
    const book = fs.readFileSync(`./db/${books[i]}`, "utf-8", (error, data) => {
      if (error) throw error;
      return data;
    });
    const parsedData = JSON.parse(book);
    if (
      parsedData["title"] === bookInfo["title"] &&
      parsedData["author"] === bookInfo["author"]
    ) {
      return true;
    }
  }
  return false;
};

export const isExistById = (id) => {
  const books = fs.readdirSync("./db", (error, fileList) => {
    if (error) throw error;
  });

  for (let i = 0; i < books.length; i++) {
    if (books[i] === `${id}.txt`) {
      return true;
    }
  }

  return false;
};

export const isAuthorized = (id, userId) => {
  const content = fs.readFileSync(
    `./db/${id}.txt`,
    'utf-8',
    (error, result) => {
      if (error) throw error;
    }
  );
  if (userId === JSON.parse(content)["userId"]) {
    return true;
  }
  return false;
};
