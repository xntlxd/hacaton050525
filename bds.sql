CREATE TABLE users(
    id SERIAL NOT NULL,
    nickname varchar(32),
    email varchar(64) NOT NULL,
    password varchar(512) NOT NULL,
    role smallint NOT NULL DEFAULT 1,
    version integer NOT NULL DEFAULT 0,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted boolean NOT NULL DEFAULT false,
    PRIMARY KEY(id)
);
CREATE INDEX idx_users_created_at ON public.users USING btree (created_at);
CREATE INDEX idx_users_role ON public.users USING btree (role);
CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);

CREATE TABLE projects(
    id SERIAL NOT NULL,
    title varchar(32) NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE INDEX idx_projects_title ON public.projects USING btree (title);
CREATE INDEX idx_projects_created_at ON public.projects USING btree (created_at);
CREATE INDEX idx_projects_updated_at ON public.projects USING btree (updated_at);

CREATE TABLE boards(
    id SERIAL NOT NULL,
    title varchar(16) NOT NULL,
    project_id integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT board_project_id_fkey FOREIGN key(project_id) REFERENCES projects(id)
);
CREATE INDEX idx_board_project_id ON public.boards USING btree (project_id);

CREATE TABLE cards(
    id SERIAL NOT NULL,
    title varchar(16) NOT NULL,
    about text NOT NULL,
    brief_about text,
    sell_by timestamp without time zone,
    status varchar(16) NOT NULL,
    priority integer DEFAULT 0,
    external_resource varchar(256),
    board_id integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT cards_board_id_fkey FOREIGN key(board_id) REFERENCES boards(id)
);
CREATE INDEX idx_cards_board_id ON public.cards USING btree (board_id);
CREATE INDEX idx_cards_status ON public.cards USING btree (status);
CREATE INDEX idx_cards_priority ON public.cards USING btree (priority);
CREATE INDEX idx_cards_sell_by ON public.cards USING btree (sell_by);

CREATE TABLE collaborators(
    id SERIAL NOT NULL,
    project_id integer NOT NULL,
    user_id integer NOT NULL,
    role smallint DEFAULT 1,
    added_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT collaborators_project_id_fkey FOREIGN key(project_id) REFERENCES projects(id),
    CONSTRAINT collaborators_user_id_fkey FOREIGN key(user_id) REFERENCES users(id)
);
CREATE INDEX idx_collaborators_project_id ON public.collaborators USING btree (project_id);
CREATE INDEX idx_collaborators_user_id ON public.collaborators USING btree (user_id);
CREATE INDEX idx_collaborators_role ON public.collaborators USING btree (role);
CREATE UNIQUE INDEX idx_collaborators_project_user ON public.collaborators USING btree (project_id, user_id);

CREATE TABLE files(
    id SERIAL NOT NULL,
    path text NOT NULL,
    card_id integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT files_card_id_fkey FOREIGN key(card_id) REFERENCES cards(id)
);
CREATE INDEX idx_files_card_id ON public.files USING btree (card_id);

CREATE TABLE comments(
    id SERIAL NOT NULL,
    text text NOT NULL,
    promotion integer DEFAULT 0,
    card_id integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT comments_card_id_fkey FOREIGN key(card_id) REFERENCES cards(id)
);
CREATE INDEX idx_comments_card_id ON public.comments USING btree (card_id);
CREATE INDEX idx_comments_promotion ON public.comments USING btree (promotion);

CREATE TABLE projects_tags(
    id SERIAL NOT NULL,
    tag text NOT NULL,
    project_id integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT tags_project_id_fkey FOREIGN key(project_id) REFERENCES projects(id)
);

CREATE TABLE responsible(
    id SERIAL NOT NULL,
    card_id integer NOT NULL,
    user_id integer NOT NULL,
    appointed_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    appointed integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT responsible_card_id_fkey FOREIGN key(card_id) REFERENCES cards(id),
    CONSTRAINT responsible_user_id_fkey FOREIGN key(user_id) REFERENCES users(id),
    CONSTRAINT responsible_appointed_fkey FOREIGN key(appointed) REFERENCES users(id)
);
CREATE INDEX idx_responsible_card_id ON public.responsible USING btree (card_id);
CREATE INDEX idx_responsible_user_id ON public.responsible USING btree (user_id);
CREATE INDEX idx_responsible_appointed ON public.responsible USING btree (appointed);

CREATE TABLE notifications(
    id SERIAL NOT NULL,
    text text NOT NULL,
    to_whom integer NOT NULL,
    priority integer DEFAULT 0,
    checked boolean NOT NULL DEFAULT false,
    PRIMARY KEY(id),
    CONSTRAINT notifications_to_whom_fkey FOREIGN key(to_whom) REFERENCES users(id)
);
CREATE INDEX idx_notifications_to_whom ON public.notifications USING btree (to_whom);
CREATE INDEX idx_notifications_priority ON public.notifications USING btree (priority);

CREATE TABLE cards_tags(
    id SERIAL NOT NULL,
    tag text NOT NULL,
    card_id integer NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT tags_card_id_fkey FOREIGN key(card_id) REFERENCES cards(id)
);
CREATE INDEX idx_tags_card_id ON public.cards_tags USING btree (card_id);
CREATE INDEX idx_tags_tag ON public.cards_tags USING btree (tag);