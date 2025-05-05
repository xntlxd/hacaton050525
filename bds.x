CREATE TABLE users(
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    email varchar(64) NOT NULL,
    password varchar(256) NOT NULL,
    role integer NOT NULL DEFAULT 1,
    create_time date DEFAULT now(),
    version integer NOT NULL DEFAULT 0,
    PRIMARY KEY(id)
);

-- Удаляем таблицы, если они существуют (в правильном порядке из-за внешних ключей)
DROP TABLE IF EXISTS collaborators;
DROP TABLE IF EXISTS projects;

-- Создаём таблицу проектов без owner_id
CREATE TABLE projects (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title varchar(32) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone
);

-- Создаём таблицу collaborators с ролью
CREATE TABLE collaborators (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    role varchar(20) NOT NULL DEFAULT 'member',  -- 'owner', 'admin', 'member' и т.д.
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT unique_collaborator UNIQUE (user_id, project_id)
);

-- Создаём индекс для быстрого поиска проектов пользователя
CREATE INDEX idx_collaborators_user_id ON collaborators(user_id);