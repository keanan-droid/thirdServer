CREATE TABLE Account(
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(89) NOT NULL UNIQUE,
  password VARCHAR(150) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE
);
