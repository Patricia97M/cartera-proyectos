CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('enabled', 'disabled')),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE projects_users (
  user_id INTEGER NOT NULL REFERENCES users(id),
  project_id INTEGER NOT NULL REFERENCES projects(id),
  PRIMARY KEY (user_id, project_id)
);

INSERT INTO users (email, password) VALUES ('user_1@test.com', '1234');
INSERT INTO users (email, password) VALUES ('user_2@test.com', '5678');

INSERT INTO projects (name, description, status) VALUES ('Project 1', 'Description for project 1', 'enabled');
INSERT INTO projects (name, description, status) VALUES ('Project 2', 'Description for project 2', 'disabled');
INSERT INTO projects (name, description, status) VALUES ('Project 3', 'Description for project 3', 'enabled');

INSERT INTO projects_users (user_id, project_id) VALUES (1, 1);
INSERT INTO projects_users (user_id, project_id) VALUES (2, 2);
INSERT INTO projects_users (user_id, project_id) VALUES (1, 3);