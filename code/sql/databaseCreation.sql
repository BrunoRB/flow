-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- PostgreSQL version: 9.3
-- Project Site: pgmodeler.com.br
-- Model Author: ---

SET check_function_bodies = false;
-- ddl-end --


-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: flow | type: DATABASE --
-- CREATE DATABASE flow
-- ;
-- -- ddl-end --
-- 

-- object: public.flowuser | type: TABLE --
CREATE TABLE public.flowuser(
	id serial,
	name character varying(100) NOT NULL,
	email character varying(100) NOT NULL,
	password character varying(100) NOT NULL,
	is_active boolean NOT NULL DEFAULT true,
	session_time timestamp,
	CONSTRAINT pk_aluno PRIMARY KEY (id),
	CONSTRAINT unique_email UNIQUE (email),
	CONSTRAINT check_name CHECK (LENGTH(name)  >= 4),
	CONSTRAINT check_email CHECK (LENGTH(email)  >= 5)

);
-- ddl-end --
COMMENT ON CONSTRAINT check_email ON public.flowuser IS 'TEMPORARIO';
-- ddl-end --
-- ddl-end --

-- object: public.flowchart | type: TABLE --
CREATE TABLE public.flowchart(
	id serial,
	name character varying(30) NOT NULL,
	last_alteration timestamp,
	is_public boolean NOT NULL DEFAULT false,
	fk_flow_user integer NOT NULL,
	CONSTRAINT pk_fluxograma PRIMARY KEY (id),
	CONSTRAINT check_name CHECK (LENGTH(name) >= 4)

);
-- ddl-end --
-- object: public.shape | type: TABLE --
CREATE TABLE public.shape(
	id bigserial,
	value character varying(30),
	position_left double precision NOT NULL,
	position_top double precision NOT NULL,
	fk_flowchart integer NOT NULL,
	fk_shape_definition character varying(30) NOT NULL,
	CONSTRAINT pk_geometric_symbol PRIMARY KEY (id)

);
-- ddl-end --
-- object: id | type: CONSTRAINT --
ALTER TABLE public.flowchart ADD CONSTRAINT id FOREIGN KEY (fk_flow_user)
REFERENCES public.flowuser (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE;
-- ddl-end --


-- object: public.shapedefinition | type: TABLE --
CREATE TABLE public.shapedefinition(
	id serial,
	name character varying(30) NOT NULL,
	default_value character varying(30),
	max_inputs smallint NOT NULL DEFAULT 1,
	max_outputs smallint NOT NULL DEFAULT 1,
	max_copies smallint NOT NULL DEFAULT 1,
	has_user_text bool NOT NULL DEFAULT true,
	conn_label_type character varying(30) DEFAULT 'text',
	CONSTRAINT pk_shape_definition PRIMARY KEY (name)

);
-- ddl-end --
-- object: flowchart_fk | type: CONSTRAINT --
ALTER TABLE public.shape ADD CONSTRAINT flowchart_fk FOREIGN KEY (fk_flowchart)
REFERENCES public.flowchart (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE;
-- ddl-end --


-- object: public.shapeconnection | type: TABLE --
CREATE TABLE public.shapeconnection(
	fk_shape bigint,
	fk_shape1 bigint,
	value character varying(30) DEFAULT ' ',
	id serial,
	CONSTRAINT shapeconnection_pk PRIMARY KEY (fk_shape,fk_shape1)

);
-- ddl-end --
COMMENT ON COLUMN public.shapeconnection.id IS 'Lixo, gerado pela restricao do redbeanphp';
-- ddl-end --
-- ddl-end --

-- object: id | type: CONSTRAINT --
ALTER TABLE public.shapeconnection ADD CONSTRAINT id FOREIGN KEY (fk_shape1)
REFERENCES public.shape (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE NOT DEFERRABLE;
-- ddl-end --


-- object: id1 | type: CONSTRAINT --
ALTER TABLE public.shapeconnection ADD CONSTRAINT id1 FOREIGN KEY (fk_shape1)
REFERENCES public.shape (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE NOT DEFERRABLE;
-- ddl-end --


-- object: fk_shape_definition | type: CONSTRAINT --
ALTER TABLE public.shape ADD CONSTRAINT fk_shape_definition FOREIGN KEY (fk_shape_definition)
REFERENCES public.shapedefinition (name) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION NOT DEFERRABLE;
-- ddl-end --







ALTER TABLE flowchart DROP CONSTRAINT id;

ALTER TABLE public.flowchart ADD CONSTRAINT id FOREIGN KEY (fk_flow_user)
REFERENCES public.flowuser (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE;

ALTER TABLE shape DROP CONSTRAINT flowchart_fk;

ALTER TABLE public.shape ADD CONSTRAINT flowchart_fk FOREIGN KEY (fk_flowchart)
REFERENCES public.flowchart (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE;

ALTER TABLE shape DROP CONSTRAINT fk_shape_definition;

ALTER TABLE public.shape ADD CONSTRAINT fk_shape_definition FOREIGN KEY (fk_shape_definition)
REFERENCES public.shapedefinition (name) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE shapeconnection DROP CONSTRAINT id;
ALTER TABLE shapeconnection DROP CONSTRAINT id1;

ALTER TABLE shapeconnection RENAME COLUMN fk_shape TO fk_source_shape;
ALTER TABLE shapeconnection RENAME COLUMN fk_shape1 TO fk_target_shape;

ALTER TABLE shapeconnection ADD CONSTRAINT fk_source_shape FOREIGN KEY (fk_source_shape) REFERENCES shape(id) ON DELETE CASCADE;
ALTER TABLE shapeconnection ADD CONSTRAINT fk_target_shape FOREIGN KEY (fk_target_shape) REFERENCES shape(id) ON DELETE CASCADE;





