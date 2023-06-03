--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Homebrew)
-- Dumped by pg_dump version 14.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA heroku_ext;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flashcards; Type: TABLE; Schema: heroku_ext; Owner: karolinespohn
--

CREATE TABLE public.flashcards (
    "flashcardID" uuid DEFAULT heroku_ext.uuid_generate_v4() NOT NULL,
    parent uuid,
    "lastLearningDate" timestamp without time zone,
    "nextLearningDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "timesAnsweredEasy" integer DEFAULT 0,
    "timesAnsweredIncorrectly" integer DEFAULT 0,
    level integer DEFAULT 0,
    front json,
    back json,
    "timesAnsweredHard" integer,
    "timesAnsweredMedium" integer
);


ALTER TABLE public.flashcards OWNER TO karolinespohn;

--
-- Name: folders; Type: TABLE; Schema: public; Owner: karolinespohn
--

CREATE TABLE public.folders (
    "folderID" uuid DEFAULT heroku_ext.uuid_generate_v4() NOT NULL,
    "folderName" character varying(64) NOT NULL,
    owner uuid,
    parent uuid
);


ALTER TABLE public.folders OWNER TO karolinespohn;

--
-- Name: stacks; Type: TABLE; Schema: public; Owner: karolinespohn
--

CREATE TABLE public.stacks (
    "stackID" uuid DEFAULT heroku_ext.uuid_generate_v4() NOT NULL,
    "stackName" character varying(64) NOT NULL,
    owner uuid,
    parent uuid
);


ALTER TABLE public.stacks OWNER TO karolinespohn;

--
-- Name: users; Type: TABLE; Schema: public; Owner: karolinespohn
--

CREATE TABLE public.users (
    uid uuid DEFAULT heroku_ext.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    CONSTRAINT password_length CHECK ((length((password)::text) >= 8))
);


ALTER TABLE public.users OWNER TO karolinespohn;

--
-- Data for Name: flashcards; Type: TABLE DATA; Schema: public; Owner: karolinespohn
--

COPY public.flashcards ("flashcardID", parent, "lastLearningDate", "nextLearningDate", "timesAnsweredEasy", "timesAnsweredIncorrectly", level, front, back, "timesAnsweredHard", "timesAnsweredMedium") FROM stdin;
f0ebeb75-fc05-4176-b660-d9a06d88a517	ce727159-48a7-40bd-9ef4-94c3c52cabba	2023-05-31 10:18:36.432	2023-06-01 12:18:36.432	1	0	2	{"time":1685528273164,"blocks":[{"id":"DgKXjCmanf","type":"paragraph","data":{"text":"Was sind Flz"}}],"version":"2.27.0"}	{"time":1685528273165,"blocks":[{"id":"einxXrMFbg","type":"Math","data":{"math":"\\\\frac 12 + 4"}}],"version":"2.27.0"}	\N	\N
db9385cb-3ab6-4beb-aadf-03c8225ddb22	ce727159-48a7-40bd-9ef4-94c3c52cabba	2023-06-01 16:46:15.984	2023-06-02 18:46:15.984	1	0	2	{"time":1685528403309,"blocks":[{"id":"Sd2k5NVeO_","type":"paragraph","data":{"text":"For all"}}],"version":"2.27.0"}	{"time":1685528403309,"blocks":[],"version":"2.27.0"}	\N	\N
\.


--
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: karolinespohn
--

COPY public.folders ("folderID", "folderName", owner, parent) FROM stdin;
a80c0c35-5145-47fd-a031-96ff54760cec	gra	40494d8a-fc56-4fd9-ae55-c1c9236eb69e	\N
9d033551-36a0-4444-9975-cc1ec08e8d83	yes#	40494d8a-fc56-4fd9-ae55-c1c9236eb69e	\N
\.


--
-- Data for Name: stacks; Type: TABLE DATA; Schema: public; Owner: karolinespohn
--

COPY public.stacks ("stackID", "stackName", owner, parent) FROM stdin;
ce727159-48a7-40bd-9ef4-94c3c52cabba	fließkommazahlen	40494d8a-fc56-4fd9-ae55-c1c9236eb69e	a80c0c35-5145-47fd-a031-96ff54760cec
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: karolinespohn
--

COPY public.users (uid, email, username, password) FROM stdin;
40494d8a-fc56-4fd9-ae55-c1c9236eb69e	karoline.spohn@gmail.com	Karo	$2b$10$BtKk0kaxOgzagP4JlD2I/uRT4u.ecihiO4jITTjubSkETiv1Rsv.q
\.


--
-- Name: flashcards flashcards_pkey; Type: CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_pkey PRIMARY KEY ("flashcardID");


--
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY ("folderID");


--
-- Name: stacks stacks_pkey; Type: CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.stacks
    ADD CONSTRAINT stacks_pkey PRIMARY KEY ("stackID");


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (uid);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: folders fk_folders_uid; Type: FK CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT fk_folders_uid FOREIGN KEY (parent) REFERENCES public.folders("folderID") ON DELETE CASCADE;


--
-- Name: CONSTRAINT fk_folders_uid ON folders; Type: COMMENT; Schema: public; Owner: karolinespohn
--

COMMENT ON CONSTRAINT fk_folders_uid ON public.folders IS 'pointer to parent';


--
-- Name: stacks fk_owner; Type: FK CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.stacks
    ADD CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: flashcards fk_parent; Type: FK CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT fk_parent FOREIGN KEY (parent) REFERENCES public.stacks("stackID") ON DELETE CASCADE;


--
-- Name: stacks fk_parent; Type: FK CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.stacks
    ADD CONSTRAINT fk_parent FOREIGN KEY (parent) REFERENCES public.folders("folderID") ON DELETE CASCADE;


--
-- Name: folders ownerID; Type: FK CONSTRAINT; Schema: public; Owner: karolinespohn
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT "ownerID" FOREIGN KEY (owner) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

