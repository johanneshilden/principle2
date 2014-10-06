--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: area; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE area (
    id integer NOT NULL,
    depot_id bigint,
    name character varying NOT NULL,
    region_id bigint NOT NULL
);


ALTER TABLE public.area OWNER TO postgres;

--
-- Name: area_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE area_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.area_id_seq OWNER TO postgres;

--
-- Name: area_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE area_id_seq OWNED BY area.id;


--
-- Name: area_user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE area_user (
    id integer NOT NULL,
    area_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.area_user OWNER TO postgres;

--
-- Name: area_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE area_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.area_user_id_seq OWNER TO postgres;

--
-- Name: area_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE area_user_id_seq OWNED BY area_user.id;


--
-- Name: complaint; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE complaint (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    customer_id bigint NOT NULL,
    title character varying DEFAULT ''::character varying NOT NULL,
    description character varying NOT NULL,
    kind character varying NOT NULL,
    resolved timestamp without time zone
);


ALTER TABLE public.complaint OWNER TO postgres;

--
-- Name: complaint_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE complaint_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.complaint_id_seq OWNER TO postgres;

--
-- Name: complaint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE complaint_id_seq OWNED BY complaint.id;


--
-- Name: complaint_product; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE complaint_product (
    id integer NOT NULL,
    batch_number character varying NOT NULL,
    complaint_id bigint NOT NULL,
    description character varying NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint NOT NULL,
    produced timestamp without time zone NOT NULL,
    expiry_date timestamp without time zone NOT NULL
);


ALTER TABLE public.complaint_product OWNER TO postgres;

--
-- Name: complaint_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE complaint_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.complaint_product_id_seq OWNER TO postgres;

--
-- Name: complaint_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE complaint_product_id_seq OWNED BY complaint_product.id;


--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE customer (
    id integer NOT NULL,
    area_id bigint NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    is_active boolean NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    price_cat_id bigint NOT NULL,
    address character varying(255) NOT NULL,
    tin character varying NOT NULL
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_activity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE customer_activity (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    customer_id bigint NOT NULL,
    description character varying NOT NULL,
    kind character varying NOT NULL,
    user_id bigint NOT NULL,
    contact_type character varying,
    entity_id bigint
);


ALTER TABLE public.customer_activity OWNER TO postgres;

--
-- Name: customer_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE customer_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_activity_id_seq OWNER TO postgres;

--
-- Name: customer_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customer_activity_id_seq OWNED BY customer_activity.id;


--
-- Name: customer_contact; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE customer_contact (
    id integer NOT NULL,
    customer_id bigint NOT NULL,
    datum character varying NOT NULL,
    kind character varying NOT NULL,
    meta character varying
);


ALTER TABLE public.customer_contact OWNER TO postgres;

--
-- Name: customer_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE customer_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_contact_id_seq OWNER TO postgres;

--
-- Name: customer_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customer_contact_id_seq OWNED BY customer_contact.id;


--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_id_seq OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customer_id_seq OWNED BY customer.id;


--
-- Name: customer_pending; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE customer_pending (
    id integer NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    address character varying(255) NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.customer_pending OWNER TO postgres;

--
-- Name: customer_pending_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE customer_pending_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_pending_id_seq OWNER TO postgres;

--
-- Name: customer_pending_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customer_pending_id_seq OWNED BY customer_pending.id;


--
-- Name: depot; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE depot (
    id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name character varying NOT NULL,
    region_id bigint NOT NULL
);


ALTER TABLE public.depot OWNER TO postgres;

--
-- Name: depot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE depot_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.depot_id_seq OWNER TO postgres;

--
-- Name: depot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE depot_id_seq OWNED BY depot.id;


--
-- Name: depot_stock; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE depot_stock (
    id integer NOT NULL,
    product_id integer NOT NULL,
    depot_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.depot_stock OWNER TO postgres;

--
-- Name: depot_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE depot_stock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.depot_stock_id_seq OWNER TO postgres;

--
-- Name: depot_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE depot_stock_id_seq OWNED BY depot_stock.id;


--
-- Name: depot_stock_transaction; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE depot_stock_transaction (
    id integer NOT NULL,
    product_id integer NOT NULL,
    depot_id integer NOT NULL,
    quantity integer NOT NULL,
    "time" timestamp without time zone NOT NULL,
    transaction_type character varying(255) NOT NULL
);


ALTER TABLE public.depot_stock_transaction OWNER TO postgres;

--
-- Name: depot_stock_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE depot_stock_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.depot_stock_transaction_id_seq OWNER TO postgres;

--
-- Name: depot_stock_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE depot_stock_transaction_id_seq OWNED BY depot_stock_transaction.id;


--
-- Name: dispatch; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE dispatch (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    depot_id bigint NOT NULL,
    status character varying NOT NULL,
    vehicle_id bigint
);


ALTER TABLE public.dispatch OWNER TO postgres;

--
-- Name: dispatch_activity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE dispatch_activity (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    dispatch_id bigint NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.dispatch_activity OWNER TO postgres;

--
-- Name: dispatch_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dispatch_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dispatch_activity_id_seq OWNER TO postgres;

--
-- Name: dispatch_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dispatch_activity_id_seq OWNED BY dispatch_activity.id;


--
-- Name: dispatch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dispatch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dispatch_id_seq OWNER TO postgres;

--
-- Name: dispatch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dispatch_id_seq OWNED BY dispatch.id;


--
-- Name: dispatch_order; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE dispatch_order (
    id integer NOT NULL,
    dispatch_id bigint NOT NULL,
    order_id bigint NOT NULL
);


ALTER TABLE public.dispatch_order OWNER TO postgres;

--
-- Name: dispatch_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dispatch_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dispatch_order_id_seq OWNER TO postgres;

--
-- Name: dispatch_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dispatch_order_id_seq OWNED BY dispatch_order.id;


--
-- Name: maintenance_activity_type; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE maintenance_activity_type (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.maintenance_activity_type OWNER TO postgres;

--
-- Name: maintenance_activity_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE maintenance_activity_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.maintenance_activity_type_id_seq OWNER TO postgres;

--
-- Name: maintenance_activity_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE maintenance_activity_type_id_seq OWNED BY maintenance_activity_type.id;


--
-- Name: order_activity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_activity (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    order_id bigint NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.order_activity OWNER TO postgres;

--
-- Name: order_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_activity_id_seq OWNER TO postgres;

--
-- Name: order_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_activity_id_seq OWNED BY order_activity.id;


--
-- Name: order_object; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_object (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    customer_id bigint NOT NULL,
    last_change timestamp without time zone NOT NULL,
    status character varying NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.order_object OWNER TO postgres;

--
-- Name: order_object_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_object_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_object_id_seq OWNER TO postgres;

--
-- Name: order_object_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_object_id_seq OWNED BY order_object.id;


--
-- Name: order_product; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_product (
    id integer NOT NULL,
    order_id bigint NOT NULL,
    price character varying NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint NOT NULL,
    return bigint NOT NULL
);


ALTER TABLE public.order_product OWNER TO postgres;

--
-- Name: order_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_product_id_seq OWNER TO postgres;

--
-- Name: order_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_product_id_seq OWNED BY order_product.id;


--
-- Name: order_stock; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_stock (
    id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.order_stock OWNER TO postgres;

--
-- Name: order_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_stock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_stock_id_seq OWNER TO postgres;

--
-- Name: order_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_stock_id_seq OWNED BY order_stock.id;


--
-- Name: order_stock_transaction; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_stock_transaction (
    id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    quantity integer NOT NULL,
    "time" timestamp without time zone NOT NULL,
    transaction_type character varying(255) NOT NULL
);


ALTER TABLE public.order_stock_transaction OWNER TO postgres;

--
-- Name: order_stock_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_stock_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_stock_transaction_id_seq OWNER TO postgres;

--
-- Name: order_stock_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_stock_transaction_id_seq OWNED BY order_stock_transaction.id;


--
-- Name: order_weight; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_weight (
    id integer NOT NULL,
    order_id bigint NOT NULL,
    category_id bigint NOT NULL,
    weight double precision NOT NULL
);


ALTER TABLE public.order_weight OWNER TO postgres;

--
-- Name: order_weight_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_weight_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_weight_id_seq OWNER TO postgres;

--
-- Name: order_weight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_weight_id_seq OWNED BY order_weight.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product (
    id integer NOT NULL,
    deleted boolean NOT NULL,
    description character varying NOT NULL,
    name character varying NOT NULL,
    unit_size character varying NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_id_seq OWNED BY product.id;


--
-- Name: product_limit; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product_limit (
    id integer NOT NULL,
    category_id bigint NOT NULL,
    load_limit bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_limit OWNER TO postgres;

--
-- Name: product_limit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_limit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_limit_id_seq OWNER TO postgres;

--
-- Name: product_limit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_limit_id_seq OWNED BY product_limit.id;


--
-- Name: product_price; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product_price (
    id integer NOT NULL,
    price character varying NOT NULL,
    price_cat_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_price OWNER TO postgres;

--
-- Name: product_price_category; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product_price_category (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.product_price_category OWNER TO postgres;

--
-- Name: product_price_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_price_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_price_category_id_seq OWNER TO postgres;

--
-- Name: product_price_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_price_category_id_seq OWNED BY product_price_category.id;


--
-- Name: product_price_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_price_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_price_id_seq OWNER TO postgres;

--
-- Name: product_price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_price_id_seq OWNED BY product_price.id;


--
-- Name: product_stock; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product_stock (
    id integer NOT NULL,
    depot_id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer,
    quantity integer NOT NULL
);


ALTER TABLE public.product_stock OWNER TO postgres;

--
-- Name: product_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_stock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_stock_id_seq OWNER TO postgres;

--
-- Name: product_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_stock_id_seq OWNED BY product_stock.id;


--
-- Name: region; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE region (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.region OWNER TO postgres;

--
-- Name: region_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE region_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.region_id_seq OWNER TO postgres;

--
-- Name: region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE region_id_seq OWNED BY region.id;


--
-- Name: role_commission; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE role_commission (
    id integer NOT NULL,
    product_id bigint NOT NULL,
    role character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE public.role_commission OWNER TO postgres;

--
-- Name: role_commission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE role_commission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_commission_id_seq OWNER TO postgres;

--
-- Name: role_commission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE role_commission_id_seq OWNED BY role_commission.id;


--
-- Name: sdrp_user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sdrp_user (
    id integer NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL,
    username character varying NOT NULL,
    depot_id bigint
);


ALTER TABLE public.sdrp_user OWNER TO postgres;

--
-- Name: sdrp_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sdrp_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sdrp_user_id_seq OWNER TO postgres;

--
-- Name: sdrp_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sdrp_user_id_seq OWNED BY sdrp_user.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE settings (
    id integer NOT NULL,
    key character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE settings_id_seq OWNED BY settings.id;


--
-- Name: sphere_user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sphere_user (
    id integer NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL,
    salt character varying NOT NULL,
    username character varying NOT NULL,
    depot_id bigint
);


ALTER TABLE public.sphere_user OWNER TO postgres;

--
-- Name: sphere_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sphere_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sphere_user_id_seq OWNER TO postgres;

--
-- Name: sphere_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sphere_user_id_seq OWNED BY sphere_user.id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stock (
    id integer NOT NULL,
    actual bigint NOT NULL,
    available bigint NOT NULL,
    depot_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- Name: stock_activity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stock_activity (
    id integer NOT NULL,
    activity_type character varying NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    depot_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint NOT NULL
);


ALTER TABLE public.stock_activity OWNER TO postgres;

--
-- Name: stock_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE stock_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_activity_id_seq OWNER TO postgres;

--
-- Name: stock_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_activity_id_seq OWNED BY stock_activity.id;


--
-- Name: stock_damage_report; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stock_damage_report (
    id integer NOT NULL,
    activity_id bigint NOT NULL,
    damage_type character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.stock_damage_report OWNER TO postgres;

--
-- Name: stock_damage_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE stock_damage_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_damage_report_id_seq OWNER TO postgres;

--
-- Name: stock_damage_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_damage_report_id_seq OWNED BY stock_damage_report.id;


--
-- Name: stock_damage_type; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stock_damage_type (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.stock_damage_type OWNER TO postgres;

--
-- Name: stock_damage_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE stock_damage_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_damage_type_id_seq OWNER TO postgres;

--
-- Name: stock_damage_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_damage_type_id_seq OWNED BY stock_damage_type.id;


--
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE stock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_id_seq OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_id_seq OWNED BY stock.id;


--
-- Name: trombone_keys; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE trombone_keys (
    id integer NOT NULL,
    client character varying NOT NULL,
    key character varying NOT NULL
);


ALTER TABLE public.trombone_keys OWNER TO postgres;

--
-- Name: trombone_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE trombone_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trombone_keys_id_seq OWNER TO postgres;

--
-- Name: trombone_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE trombone_keys_id_seq OWNED BY trombone_keys.id;


--
-- Name: vehicle; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vehicle (
    id integer NOT NULL,
    depot_id bigint NOT NULL,
    is_available boolean NOT NULL,
    make character varying NOT NULL,
    model character varying NOT NULL,
    reg_no character varying NOT NULL,
    status character varying NOT NULL,
    user_id bigint,
    category_id bigint NOT NULL
);


ALTER TABLE public.vehicle OWNER TO postgres;

--
-- Name: vehicle_fuel_activity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vehicle_fuel_activity (
    id integer NOT NULL,
    amount double precision NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    meter_reading double precision NOT NULL,
    vehicle_id bigint NOT NULL
);


ALTER TABLE public.vehicle_fuel_activity OWNER TO postgres;

--
-- Name: vehicle_fuel_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE vehicle_fuel_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vehicle_fuel_activity_id_seq OWNER TO postgres;

--
-- Name: vehicle_fuel_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE vehicle_fuel_activity_id_seq OWNED BY vehicle_fuel_activity.id;


--
-- Name: vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE vehicle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vehicle_id_seq OWNER TO postgres;

--
-- Name: vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE vehicle_id_seq OWNED BY vehicle.id;


--
-- Name: vehicle_maintenance_activity; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vehicle_maintenance_activity (
    id integer NOT NULL,
    description character varying NOT NULL,
    end_time timestamp without time zone,
    meter_reading double precision NOT NULL,
    start_time timestamp without time zone NOT NULL,
    activity character varying NOT NULL,
    vehicle_id bigint NOT NULL
);


ALTER TABLE public.vehicle_maintenance_activity OWNER TO postgres;

--
-- Name: vehicle_maintenance_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE vehicle_maintenance_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vehicle_maintenance_activity_id_seq OWNER TO postgres;

--
-- Name: vehicle_maintenance_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE vehicle_maintenance_activity_id_seq OWNED BY vehicle_maintenance_activity.id;


--
-- Name: weight_category; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE weight_category (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.weight_category OWNER TO postgres;

--
-- Name: weight_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE weight_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.weight_category_id_seq OWNER TO postgres;

--
-- Name: weight_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE weight_category_id_seq OWNED BY weight_category.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY area ALTER COLUMN id SET DEFAULT nextval('area_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY area_user ALTER COLUMN id SET DEFAULT nextval('area_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY complaint ALTER COLUMN id SET DEFAULT nextval('complaint_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY complaint_product ALTER COLUMN id SET DEFAULT nextval('complaint_product_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer ALTER COLUMN id SET DEFAULT nextval('customer_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer_activity ALTER COLUMN id SET DEFAULT nextval('customer_activity_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer_contact ALTER COLUMN id SET DEFAULT nextval('customer_contact_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer_pending ALTER COLUMN id SET DEFAULT nextval('customer_pending_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY depot ALTER COLUMN id SET DEFAULT nextval('depot_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY depot_stock ALTER COLUMN id SET DEFAULT nextval('depot_stock_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY depot_stock_transaction ALTER COLUMN id SET DEFAULT nextval('depot_stock_transaction_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch ALTER COLUMN id SET DEFAULT nextval('dispatch_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch_activity ALTER COLUMN id SET DEFAULT nextval('dispatch_activity_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch_order ALTER COLUMN id SET DEFAULT nextval('dispatch_order_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY maintenance_activity_type ALTER COLUMN id SET DEFAULT nextval('maintenance_activity_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_activity ALTER COLUMN id SET DEFAULT nextval('order_activity_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_object ALTER COLUMN id SET DEFAULT nextval('order_object_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_product ALTER COLUMN id SET DEFAULT nextval('order_product_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_stock ALTER COLUMN id SET DEFAULT nextval('order_stock_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_stock_transaction ALTER COLUMN id SET DEFAULT nextval('order_stock_transaction_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_weight ALTER COLUMN id SET DEFAULT nextval('order_weight_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product ALTER COLUMN id SET DEFAULT nextval('product_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_limit ALTER COLUMN id SET DEFAULT nextval('product_limit_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_price ALTER COLUMN id SET DEFAULT nextval('product_price_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_price_category ALTER COLUMN id SET DEFAULT nextval('product_price_category_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_stock ALTER COLUMN id SET DEFAULT nextval('product_stock_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY region ALTER COLUMN id SET DEFAULT nextval('region_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY role_commission ALTER COLUMN id SET DEFAULT nextval('role_commission_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sdrp_user ALTER COLUMN id SET DEFAULT nextval('sdrp_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY settings ALTER COLUMN id SET DEFAULT nextval('settings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sphere_user ALTER COLUMN id SET DEFAULT nextval('sphere_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock ALTER COLUMN id SET DEFAULT nextval('stock_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_activity ALTER COLUMN id SET DEFAULT nextval('stock_activity_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_damage_report ALTER COLUMN id SET DEFAULT nextval('stock_damage_report_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_damage_type ALTER COLUMN id SET DEFAULT nextval('stock_damage_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY trombone_keys ALTER COLUMN id SET DEFAULT nextval('trombone_keys_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle ALTER COLUMN id SET DEFAULT nextval('vehicle_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle_fuel_activity ALTER COLUMN id SET DEFAULT nextval('vehicle_fuel_activity_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle_maintenance_activity ALTER COLUMN id SET DEFAULT nextval('vehicle_maintenance_activity_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY weight_category ALTER COLUMN id SET DEFAULT nextval('weight_category_id_seq'::regclass);


--
-- Data for Name: area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY area (id, depot_id, name, region_id) FROM stdin;
2	\N	Arusha - Area #3	2
5	\N	Dodoma - Area #1	3
6	\N	Dodoma - Area #2	3
8	3	Arusha - Area #1	2
9	3	Area-8765	2
3	1	Dar es Salaam - Area #3	1
4	1	Area #1	1
7	1	Dar es Salaam - Area #2	1
1	1	Dar es Salaam - Area #1	1
\.


--
-- Name: area_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('area_id_seq', 9, true);


--
-- Data for Name: area_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY area_user (id, area_id, user_id) FROM stdin;
1	1	3
\.


--
-- Name: area_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('area_user_id_seq', 1, true);


--
-- Data for Name: complaint; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY complaint (id, created, customer_id, title, description, kind, resolved) FROM stdin;
1	2014-05-22 00:00:00	7			ComplaintTypeService	\N
2	2014-05-24 19:26:56.086044	1		baaa	service	\N
3	2014-05-24 19:32:56.080494	22		abc	service	\N
4	2014-05-24 12:49:49.457917	2		abc	service	\N
5	2014-05-24 12:52:37.912484	2		abc	service	\N
6	2014-05-24 12:52:41.497501	2		def	service	\N
7	2014-05-24 12:56:36.944656	1		x	service	\N
8	2014-05-24 12:57:52.05537	1		abc	service	\N
9	2014-05-24 12:58:31.965543	1		abc	service	\N
10	2014-05-24 13:02:33.745984	1		hellowhat	service	\N
11	2014-05-24 13:03:05.016916	1		xx	service	\N
12	2014-05-24 13:05:48.633766	2		abc	service	\N
13	2014-05-24 13:13:15.077629	2		baaa	service	\N
14	2014-05-24 13:16:22.72036	2		bbb	service	\N
15	2014-05-24 13:16:29.61045	2		x	service	\N
16	2014-05-24 13:26:00.954822	1		x	service	\N
17	2014-05-24 13:28:44.041798	1		a	service	\N
18	2014-05-24 13:28:51.18075	1		helloa	service	\N
19	2014-05-24 14:24:10.651037	1		ba	service	\N
20	2014-05-24 14:24:33.102715	1		fez	service	\N
21	2014-05-24 14:28:13.442877	1		x	service	\N
22	2014-05-24 14:30:31.082144	1		x	service	\N
23	2014-05-24 14:30:36.970783	1		YEP	service	\N
24	2014-05-24 14:31:31.333559	1		abc	service	\N
25	2014-05-24 14:31:55.5865	4		banan	service	\N
26	2014-05-24 14:34:31.408981	2		---	service	\N
27	2014-05-24 14:41:53.412263	2		abc	service	\N
28	2014-05-24 14:41:58.374177	2		xx	service	\N
29	2014-05-24 14:44:06.597847	4		heeeelo	service	\N
30	2014-05-24 14:45:50.142359	14		abc	service	\N
31	2014-05-24 14:45:54.790045	14		def	service	\N
32	2014-05-24 14:48:43.817095	14		x	service	\N
33	2014-05-24 14:52:14.558669	4		xa1	service	\N
34	2014-05-24 14:54:05.680281	4		service	service	\N
35	2014-05-24 15:35:49.979788	2		x	service	\N
36	2014-05-24 15:41:31.513926	2		abc	service	\N
37	2014-05-24 16:25:34.254927	17		abc	service	\N
38	2014-05-24 16:25:38.517625	17		zz	service	\N
39	2014-05-24 16:25:42.959405	17		123	service	\N
40	2014-05-24 16:53:55.261233	18		hello	service	\N
41	2014-05-24 17:15:36.728435	21		baz	service	\N
42	2014-05-24 17:16:11.03016	21		x	service	\N
43	2014-05-24 21:11:38.720494	4		xx123	service	\N
44	2014-05-24 21:12:54.116291	4		hellobanan	service	\N
45	2014-05-24 21:13:00.81847	4		wat	service	\N
46	2014-05-24 21:13:23.744034	20		afff	service	\N
47	2014-05-24 21:41:22.731766	1		abc	service	\N
48	2014-05-24 21:41:34.282848	1		rrrrrrrrr	service	\N
49	2014-05-24 22:23:34.544234	23		ba	service	\N
50	2014-05-24 22:44:14.710417	1		abc	service	\N
51	2014-05-24 22:44:22.200908	1		diego	service	\N
52	2014-05-24 22:44:32.013046	1		service x	service	\N
53	2014-05-24 22:50:39.649017	7		xx	service	\N
54	2014-05-24 22:50:47.786179	7		zz	service	\N
55	2014-05-24 23:02:14.350334	4		abc	service	\N
56	2014-05-24 23:02:19.085021	4		r1	service	\N
57	2014-05-24 23:02:24.574679	4		rrr1	service	\N
58	2014-05-24 23:03:58.561248	5		xx	service	\N
59	2014-05-24 23:04:04.180915	5		123	service	\N
60	2014-05-24 23:12:37.520987	4		xx	service	\N
61	2014-05-25 07:59:44.811631	6		z	service	\N
62	2014-05-25 10:46:21.367013	1		X	service	\N
63	2014-05-25 10:46:49.152233	1		X	service	\N
64	2014-05-25 10:46:56.995439	1		X	service	\N
65	2014-05-25 10:47:18.164484	1		X	service	\N
66	2014-05-25 10:47:28.299784	1		X	service	\N
67	2014-05-26 06:46:40.196301	5		abc	service	\N
68	2014-05-26 09:38:19.814701	5		abc	service	\N
69	2014-05-26 14:30:52.656025	1		abc	service	\N
70	2014-05-26 14:31:01.738992	1		abc	service	\N
71	2014-05-26 14:32:21.025307	1		abc	service	\N
72	2014-05-26 14:32:25.444979	5		abc	service	\N
73	2014-05-26 14:32:31.570086	5		banan	service	\N
74	2014-05-26 14:33:08.36907	1		abc	service	\N
75	2014-05-26 14:33:12.746514	5		abc	service	\N
76	2014-05-26 14:35:27.160798	1		abc	service	\N
77	2014-05-26 14:42:01.650747	6		banan	service	\N
78	2014-05-26 14:54:53.108844	1		ab	service	\N
79	2014-05-26 14:57:11.045579	1		abc	service	\N
80	2014-05-24 12:20:50.86354	1		abc	service	2014-07-13 15:32:36.11385
81	2014-05-24 14:20:16.134093	3		x	service	2014-07-13 15:36:45.2565
82	2014-05-24 14:20:24.503864	3		zzzzzzzzz	service	2014-07-13 17:01:23.384628
83	2014-05-25 08:30:35.912531	3		xx	service	2014-07-13 17:01:31.274655
84	2014-05-21 00:00:00	5		hello	ComplaintTypeService	2014-07-13 17:02:55.351289
85	2014-05-24 13:12:56.927204	2		zz	service	2014-07-13 17:03:21.811733
86	2014-05-22 00:00:00	2		err	ComplaintTypeService	2014-07-13 17:35:33.43555
87	2014-05-22 00:00:00	2		x	ComplaintTypeService	2014-07-13 17:37:00.005081
88	2014-05-24 16:04:22.770171	15		xyz	service	2014-07-13 17:39:17.349274
89	2014-05-25 09:01:28.36687	12		x	service	2014-07-13 18:13:15.98353
90	2014-05-24 12:21:07.733073	1		abc	service	2014-07-13 20:37:17.351932
91	2014-05-24 22:44:58.668554	1		no electronic beer available	service	2014-07-14 09:10:05.502704
92	2014-05-22 00:00:00	7		xx	ComplaintTypeService	2014-07-22 11:59:25.074689
93	2014-05-26 15:00:19.639517	4		x	service	\N
94	2014-05-26 15:02:41.16358	4		abc	service	\N
95	2014-05-26 17:00:27.356791	4		abc	service	\N
96	2014-05-26 17:00:28.184743	4		abc	service	\N
97	2014-05-26 17:00:28.461767	4		abc	service	\N
98	2014-05-26 17:00:28.505603	4		abc	service	\N
99	2014-05-26 17:00:28.527617	4		abc	service	\N
100	2014-05-26 17:00:28.568827	4		abc	service	\N
101	2014-05-26 17:00:28.607548	4		abc	service	\N
102	2014-05-26 17:00:28.654048	4		abc	service	\N
103	2014-05-26 17:00:28.689169	4		abc	service	\N
104	2014-05-26 17:00:28.759704	4		abc	service	\N
105	2014-05-26 17:00:28.797405	4		a	service	\N
106	2014-05-26 17:00:28.8552	4		abc	service	\N
107	2014-05-26 17:00:28.871501	4		abc	service	\N
108	2014-05-26 17:00:28.910329	4		ab	service	\N
109	2014-05-26 17:00:28.944859	4		ab	service	\N
110	2014-05-26 17:00:28.962001	4		a	service	\N
111	2014-05-26 17:00:28.977762	4		a	service	\N
112	2014-05-26 17:00:28.995367	4		a	service	\N
113	2014-05-26 17:00:29.012368	4		a	service	\N
114	2014-05-26 17:00:35.251773	4		a	service	\N
115	2014-05-26 17:00:50.384518	4		wat!	service	\N
116	2014-05-26 17:11:12.364283	4		abc	service	\N
117	2014-05-26 17:15:50.551784	4		ab	service	\N
118	2014-05-26 17:15:50.584703	4		abc	service	\N
119	2014-05-26 17:15:50.630273	4		abc	service	\N
120	2014-05-26 17:16:04.266509	4		ratthatt	service	\N
121	2014-05-26 17:16:21.177437	4		a	service	\N
122	2014-05-26 17:21:25.768309	1		a	service	\N
123	2014-05-26 17:21:25.865443	1		a	service	\N
124	2014-05-26 17:21:27.660513	1		ax	service	\N
125	2014-05-26 20:19:11.934604	1		a	service	\N
126	2014-05-26 20:19:12.338659	1		a	service	\N
127	2014-05-26 20:19:12.460858	1		abc	service	\N
128	2014-05-26 20:19:39.34191	2		x	service	\N
129	2014-05-26 20:30:29.183346	2		a	service	\N
130	2014-05-26 20:41:47.027797	15		abc	service	\N
131	2014-05-26 20:44:31.111154	15		a	service	\N
132	2014-05-26 20:46:35.733178	2		x	service	\N
133	2014-05-26 22:21:27.372172	4		a	service	\N
134	2014-05-27 09:00:55.688581	4		abc	service	\N
135	2014-05-27 09:31:39.000832	18		abc	service	\N
136	2014-05-27 09:31:45.101661	18		wat	service	\N
137	2014-05-27 09:34:33.806721	6		abc	service	\N
138	2014-05-27 09:38:46.89139	15		a	service	\N
139	2014-05-27 09:39:37.430374	15		banan	service	\N
140	2014-05-27 09:39:37.466604	15		banan	service	\N
141	2014-05-27 09:39:37.513013	15		banan	service	\N
142	2014-05-27 09:39:37.553826	15		banan	service	\N
143	2014-05-27 09:39:37.607714	15		banan	service	\N
144	2014-05-27 09:39:37.648748	15		banan	service	\N
145	2014-05-27 09:39:37.68865	15		banan	service	\N
146	2014-05-27 09:39:37.724878	15		banan	service	\N
147	2014-05-27 09:40:15.040412	15		xyz	service	\N
148	2014-05-27 09:40:15.092656	15		xyz	service	\N
149	2014-05-27 09:40:15.118507	15		xyz	service	\N
150	2014-05-27 09:40:15.14961	15		xyz	service	\N
151	2014-05-27 09:40:15.182114	15		xyz	service	\N
152	2014-05-27 09:40:15.211615	15		xyz	service	\N
153	2014-05-27 09:40:15.252128	15		xyz	service	\N
154	2014-05-27 09:40:15.282077	15		xyz	service	\N
155	2014-05-27 09:40:15.305347	15		xyz	service	\N
156	2014-05-27 09:40:15.337847	15		xyz	service	\N
157	2014-05-27 09:40:15.369082	15		xyz	service	\N
158	2014-05-27 09:40:15.424433	15		xyz	service	\N
159	2014-05-27 09:40:15.460425	15		xyz	service	\N
160	2014-05-27 09:50:01.284307	5		abcdef	service	\N
161	2014-05-27 09:50:01.348495	5		12345	service	\N
162	2014-05-27 09:50:01.399329	5		123456	service	\N
163	2014-05-27 09:52:29.676302	2		banan!	service	\N
164	2014-05-27 09:53:24.396893	5		987	service	\N
165	2014-05-27 09:56:12.663982	5		abc123	service	\N
166	2014-05-27 09:57:27.070249	5		123123123	service	\N
167	2014-05-27 10:36:48.551581	6		abc	service	\N
168	2014-05-27 14:51:00.156501	1		fez	service	\N
169	2014-05-27 14:51:23.871539	1		hatt	service	\N
170	2014-05-27 15:53:13.346416	5		ab	service	\N
171	2014-05-27 17:46:04.8914	2		sb	service	\N
172	2014-05-27 20:44:31.987597	1		abc	service	\N
173	2014-05-27 20:55:25.586793	1		abc	service	\N
174	2014-05-28 07:04:56.682453	1		!	service	\N
175	2014-05-29 07:23:02.580994	6		abc	service	\N
176	2014-05-29 08:59:03.025783	1		baaaaaaaaaaaa	service	\N
177	2014-05-29 13:59:09.302296	9		abc	service	\N
178	2014-05-29 14:12:59.630685	1		kjhlhjkh	service	\N
179	2014-05-29 14:15:39.4435	1		this is a new complaint	service	\N
180	2014-06-01 08:33:35.401094	1		x	service	\N
181	2014-06-05 11:17:10.6127	2		a	service	\N
182	2014-06-07 07:58:54.247889	1		abc	service	\N
183	2014-05-27 13:10:37.73095	3		abc	service	2014-07-22 12:03:46.960576
\.


--
-- Name: complaint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('complaint_id_seq', 183, true);


--
-- Data for Name: complaint_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY complaint_product (id, batch_number, complaint_id, description, product_id, quantity, produced, expiry_date) FROM stdin;
\.


--
-- Name: complaint_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('complaint_product_id_seq', 1, false);


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY customer (id, area_id, created, is_active, latitude, longitude, name, phone, price_cat_id, address, tin) FROM stdin;
1	5	2014-04-15 09:42:00.007	t	0	0	Ametek	123-1144455	3		
2	7	2014-04-15 09:42:00.007	t	0	0	Able Canopies	123-1144455	3		
3	8	2014-04-15 09:42:00.007	t	0	0	ABSL Power Solutions Ltd	123-1144455	2		
4	9	2014-04-15 09:42:00.007	t	0	0	AC & DC Powerdrive Systems	123-1144455	1		
5	9	2014-04-15 09:42:00.007	t	0	0	Acal Technology Ltd	123-1144455	1		
6	9	2014-04-15 09:42:00.007	t	0	0	E-T-A Circuit Breakers Ltd	123-1144455	1		
7	8	2014-04-15 09:42:00.007	t	0	0	E2V Technologies	123-1144455	2		
8	7	2014-04-15 09:42:00.007	t	0	0	EAO Ltd	123-1144455	1		
9	6	2014-04-15 09:42:00.007	t	0	0	Eastman Packaging	123-1144455	2		
10	5	2014-04-15 09:42:00.007	t	0	0	Eaton-Williams Group Ltd	123-1144455	2		
11	5	2014-04-15 09:42:00.007	t	0	0	Echomaster Marine Ltd	123-1144455	2		
12	3	2014-04-15 09:42:00.007	t	0	0	Edmolift UK Ltd	123-1144455	1		
14	1	2014-04-15 09:42:00.007	t	0	0	Jaguar Land Rover	123-1144455	2		
15	2	2014-04-15 09:42:00.007	t	0	0	Jackson Civil Engineering Group Ltd	123-1144455	3		
16	3	2014-04-15 09:42:00.007	t	0	0	James Fairley Athena	123-1144455	2		
17	4	2014-04-15 09:42:00.007	t	0	0	James G Carrick & Co Ltd	123-1144455	2		
18	5	2014-04-15 09:42:00.007	t	0	0	JCB Transmissions	123-1144455	2		
19	6	2014-04-15 09:42:00.007	t	0	0	Jetway Associates Ltd	123-1144455	1		
20	7	2014-04-15 09:42:00.007	t	0	0	John Lilley & Gillie Ltd	123-1144455	1		
21	8	2014-04-15 09:42:00.007	t	0	0	Jon Philips Ltd	123-1144455	2		
22	9	2014-04-15 09:42:00.007	t	0	0	JS Humidifiers Plc	123-1144455	3		
23	4	2014-04-15 09:42:00.007	t	0	0	JVC Professional Europe Ltd	123-1144455	1		
13	1	2014-04-15 09:42:00.007	t	0	0	Electron Beam Processes Ltd	123-1144455	1	adsfsa	asdfasdf
\.


--
-- Data for Name: customer_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY customer_activity (id, created, customer_id, description, kind, user_id, contact_type, entity_id) FROM stdin;
1	2014-09-16 21:14:14.095	1	A customer order was placed.	order-placed	3	proactive	1
2	2014-09-17 11:08:51.235	1	A customer order was placed.	order-placed	3	proactive	3
3	2014-09-17 11:09:44.578	3	A customer order was placed.	order-placed	3	proactive	4
4	2014-09-17 11:47:47.429	14	A customer order was placed.	order-placed	3	proactive	5
5	2014-09-17 11:48:51.407	13	A customer order was placed.	order-placed	3	customer-received	6
6	2014-09-17 11:50:54.877	13	A customer order was placed.	order-placed	3	proactive	7
7	2014-09-17 11:54:20.674	13	A customer order was placed.	order-placed	3	proactive	8
\.


--
-- Name: customer_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('customer_activity_id_seq', 7, true);


--
-- Data for Name: customer_contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY customer_contact (id, customer_id, datum, kind, meta) FROM stdin;
\.


--
-- Name: customer_contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('customer_contact_id_seq', 1, false);


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('customer_id_seq', 23, true);


--
-- Data for Name: customer_pending; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY customer_pending (id, name, phone, address, created, user_id) FROM stdin;
\.


--
-- Name: customer_pending_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('customer_pending_id_seq', 1, false);


--
-- Data for Name: depot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY depot (id, latitude, longitude, name, region_id) FROM stdin;
2	0	0	Depot #2	1
3	0	0	Depot #3	2
4	0	0	Depot #4	2
5	0	0	Depot #5	3
1	0	0	Depot #1	1
\.


--
-- Name: depot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('depot_id_seq', 5, true);


--
-- Data for Name: depot_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY depot_stock (id, product_id, depot_id, quantity) FROM stdin;
115	1	2	112
112	3	1	112
113	1	1	111
118	12	1	5
117	11	1	1
114	11	11	11534336
119	15	1	6
120	10	1	6
121	1022	1	6
122	100	1	6
123	85	1	6
124	22	1	6
116	5	1	4
\.


--
-- Name: depot_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('depot_stock_id_seq', 125, true);


--
-- Data for Name: depot_stock_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY depot_stock_transaction (id, product_id, depot_id, quantity, "time", transaction_type) FROM stdin;
14	1	1	-3	2014-10-10 10:00:00	order-created
\.


--
-- Name: depot_stock_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('depot_stock_transaction_id_seq', 14, true);


--
-- Data for Name: dispatch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY dispatch (id, created, depot_id, status, vehicle_id) FROM stdin;
1	2014-06-05 13:15:51.787302	1	placed	1
2	2014-06-05 13:52:38.060978	1	placed	1
3	2014-06-05 13:53:18.178468	1	placed	1
4	2014-06-05 13:54:08.272125	1	placed	1
5	2014-06-05 13:59:52.044433	1	placed	1
6	2014-06-05 14:01:48.125647	1	placed	1
7	2014-06-05 14:01:54.407698	1	placed	1
8	2014-06-05 14:04:20.818141	1	placed	1
9	2014-06-05 14:07:34.443457	1	placed	1
10	2014-06-05 14:08:17.006862	1	placed	1
11	2014-06-05 14:08:32.459536	1	placed	1
12	2014-06-05 14:08:56.373971	1	placed	1
13	2014-06-05 14:20:55.717941	1	placed	1
14	2014-06-05 15:02:53.442494	1	placed	8
15	2014-06-05 15:21:03.965751	1	placed	1
16	2014-06-05 15:26:06.308837	1	placed	8
17	2014-06-05 15:26:20.012158	1	placed	8
18	2014-06-06 09:18:46.18184	1	placed	8
19	2014-06-06 09:19:06.0482	1	placed	8
20	2014-06-06 09:19:28.271507	1	placed	8
21	2014-06-06 09:22:02.839033	1	placed	8
22	2014-06-06 12:05:48.657175	1	placed	8
23	2014-06-06 14:52:45.29102	1	placed	8
\.


--
-- Data for Name: dispatch_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY dispatch_activity (id, created, dispatch_id, status) FROM stdin;
\.


--
-- Name: dispatch_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('dispatch_activity_id_seq', 1, false);


--
-- Name: dispatch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('dispatch_id_seq', 1, false);


--
-- Data for Name: dispatch_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY dispatch_order (id, dispatch_id, order_id) FROM stdin;
\.


--
-- Name: dispatch_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('dispatch_order_id_seq', 1, false);


--
-- Data for Name: maintenance_activity_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY maintenance_activity_type (id, name) FROM stdin;
\.


--
-- Name: maintenance_activity_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('maintenance_activity_type_id_seq', 1, false);


--
-- Data for Name: order_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY order_activity (id, created, order_id, status) FROM stdin;
2	2014-09-17 11:08:51.235	3	placed
3	2014-09-17 11:09:44.578	4	placed
4	2014-09-17 11:47:47.429	5	placed
5	2014-09-17 11:48:51.407	6	placed
6	2014-09-17 11:50:54.877	7	placed
7	2014-09-17 11:54:20.674	8	placed
\.


--
-- Name: order_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_activity_id_seq', 7, true);


--
-- Data for Name: order_object; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY order_object (id, created, customer_id, last_change, status, user_id) FROM stdin;
4	2014-09-17 11:09:44.578	3	2014-09-17 11:09:44.578	placed	3
19	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
20	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
29	2014-10-06 13:37:37.15	1	2014-10-06 13:37:37.15	placed	1
39	2014-10-06 14:29:07.588	1	2014-10-06 14:29:07.588	placed	1
5	2014-09-17 11:47:47.429	14	2014-09-17 11:47:47.429	placed	3
9	2014-10-06 08:39:25.314	1	2014-10-06 08:39:25.314	placed	1
21	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
22	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
30	2014-10-06 13:38:23.544	1	2014-10-06 13:38:23.544	placed	1
31	2014-10-06 13:39:26.785	2	2014-10-06 13:39:26.785	placed	1
40	2014-10-06 14:34:21.217	1	2014-10-06 14:34:21.217	placed	1
6	2014-09-17 11:48:51.407	13	2014-09-17 11:48:51.407	placed	3
10	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
23	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
32	2014-10-06 13:40:12.427	2	2014-10-06 13:40:12.427	placed	1
41	2014-10-06 14:35:13.476	1	2014-10-06 14:35:13.476	placed	1
7	2014-09-17 11:50:54.877	13	2014-09-17 11:50:54.877	placed	3
11	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
24	2014-01-01 01:00:00	4	2014-01-01 01:00:00	placed	1
33	2014-01-01 01:00:00	4	2014-01-01 01:00:00	placed	1
42	2014-10-06 14:37:20.033	1	2014-10-06 14:37:20.033	placed	1
8	2014-09-17 11:54:20.674	13	2014-09-17 11:54:20.674	placed	3
12	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
13	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
25	2014-01-01 01:00:00	4	2014-01-01 01:00:00	placed	1
34	2014-10-06 14:03:04.415	1	2014-10-06 14:03:04.415	placed	1
43	2014-10-06 14:38:31.056	1	2014-10-06 14:38:31.056	placed	1
14	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
15	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
16	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
26	2014-01-01 01:00:00	4	2014-01-01 01:00:00	placed	1
35	2014-10-06 14:04:17.605	1	2014-10-06 14:04:17.605	placed	1
17	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
27	2014-01-01 01:00:00	4	2014-01-01 01:00:00	placed	1
36	2014-10-06 14:07:34.323	1	2014-10-06 14:07:34.323	placed	1
18	2014-01-01 01:00:00	1	2014-01-01 01:00:00	placed	1
28	2014-10-06 13:36:41.203	1	2014-10-06 13:36:41.203	placed	1
37	2014-10-06 14:10:28.842	1	2014-10-06 14:10:28.842	placed	1
38	2014-10-06 14:11:04.088	1	2014-10-06 14:11:04.088	placed	1
3	2014-09-17 11:08:51.235	1	2014-09-17 11:08:51.235	placed	3
\.


--
-- Name: order_object_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_object_id_seq', 43, true);


--
-- Data for Name: order_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY order_product (id, order_id, price, product_id, quantity, return) FROM stdin;
18	6	100	4	2	0
19	6	150	5	1	0
20	6	220	6	3	0
21	7	120	3	2	0
22	7	220	4	2	0
23	8	320	4	2	0
34	11	35000	1	2	0
35	12	35000	1	2	0
36	13	35000	1	2	0
37	17	35000	1	1	0
38	18	35000	1	1	0
39	19	35000	1	1	0
40	19	35000	3	1	0
41	20	35000	1	1	0
42	20	35000	3	2	0
43	21	35000	1	1	0
44	21	35000	3	2	0
45	22	35000	1	1	0
46	22	35000	3	2	0
47	23	35000	1	1	0
48	23	35000	3	2	0
65	12	24000	11	1	0
67	12	24000	12	1	0
68	24	24000	1	3	0
69	25	24000	1	3	0
70	26	24000	1	3	0
77	26	28000	3	1	0
78	27	24000	1	3	0
79	28	35000	1	1	0
80	29	35000	1	1	0
81	29	35000	3	1	0
82	30	35000	1	1	0
83	30	35000	3	1	0
84	31	35000	1	1	0
85	31	35000	3	1	0
86	32	35000	1	1	0
91	27	28000	3	1	0
92	33	24000	1	3	0
93	34	35000	1	1	0
94	35	35000	1	1	0
95	39	35000	3	1	0
96	43	35000	1	1	0
\.


--
-- Name: order_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_product_id_seq', 96, true);


--
-- Data for Name: order_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY order_stock (id, product_id, order_id, quantity) FROM stdin;
53	1	1	2
54	1	1	2
55	1	1	2
56	1	1111	2
57	1	1111	1
58	1	1111	2
59	3	1111	2
60	1	1111	2
61	1	1111	2
62	1	1111	2
63	1	1111	2
64	1	1111	2
65	1	1111	2
66	1	11	2
67	1	12	2
68	1	13	2
69	1	17	1
70	1	18	1
71	1	19	1
72	3	19	1
73	1	20	1
74	3	20	2
75	1	21	1
76	3	21	2
77	1	22	1
78	3	22	2
79	1	23	1
80	3	23	2
81	1	1	1
82	1	11	1
83	1	111	1
84	1	211	1
85	1	211	1
86	1	55	1
87	1	55	1
88	5	55	1
89	5	155	1
90	3	555	1
91	3	1555	1
92	3	81	1
93	1	81	1
94	1	12	1
95	11	12	1
96	11	12	1
97	12	12	1
98	1	24	3
99	1	25	3
100	1	26	3
101	1	88	3
102	1	89	3
103	1	89	3
104	1	29	3
105	11	29	3
106	1	26	3
48	1	5	3
49	1	2	0
50	1	1	6
51	1	11	2
52	11	33	44
107	3	26	1
108	1	27	3
109	1	28	1
110	1	29	1
111	3	29	1
112	1	30	1
113	3	30	1
114	1	31	1
115	3	31	1
116	1	32	1
117	3	26	1
118	1	26	1
119	3	26	1
120	1	27	1
121	3	27	1
122	1	33	3
123	1	34	1
124	1	35	1
125	3	39	1
126	1	43	1
\.


--
-- Name: order_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_stock_id_seq', 126, true);


--
-- Data for Name: order_stock_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY order_stock_transaction (id, product_id, order_id, quantity, "time", transaction_type) FROM stdin;
10	1	1	3	2014-10-10 10:00:00	order-created
\.


--
-- Name: order_stock_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_stock_transaction_id_seq', 10, true);


--
-- Data for Name: order_weight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY order_weight (id, order_id, category_id, weight) FROM stdin;
6	3	1	0
7	3	2	0
8	3	3	0
9	3	4	0
10	3	5	0
11	4	1	0
12	4	2	0
13	4	3	0
14	4	4	0
15	4	5	0
16	5	1	0
17	5	2	0
18	5	3	0
19	5	4	0
20	5	5	0
21	6	1	0
22	6	2	0
23	6	3	0
24	6	4	0
25	6	5	0
26	7	1	0
27	7	2	0
28	7	3	0
29	7	4	0
30	7	5	0
31	8	1	0.0100000000000000002
32	8	2	0.00800000000000000017
33	8	3	0.00666666666666666709
34	8	4	0.166666666666666657
35	8	5	0.25
\.


--
-- Name: order_weight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_weight_id_seq', 35, true);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY product (id, deleted, description, name, unit_size) FROM stdin;
2	f	General Mills Honey Nut Cheerios Cereal Bowl. 1 oz individual bowl.	General Mills Honey Nut Cheerios Cereal Bowl	-
3	f	Kelloggs Frosted Flakes of Corn Cereal (bowl) 1 oz bowl.	Kelloggs Frosted Flakes of Corn Cereal	-
4	f	Freshscent Deodorant Soap wrapped in paper. 3 ounces of bulk discount cheap wholesale bar soap.	3oz. Freshscent Deodorant Soap	-
5	f	30 g (1.27 oz) automatic dishwashing detergent in sealed package of 2 pods. 2 loads. Non-toxic. Naturally derived ingredients. No phosphates. Chlorine free wholesale discount cheap bulk dishwash detergent soap. Sparkling clean. Removes greasy stuff. Spotless rinse aid.	Wholesale Grabgreen Auto Dishwash Detergent - Tangerine	-
6	f	Soft Scrub Automatic Dish Detergent Soap. 1 oz travel size in individually sealed package. This wholesale discount cheap bulk dish soap is great for camping or traveling.	Soft Scrub Automatic Dish Detergent	-
7	f	Eco-friendly, automatic dishwasher gel offers a crisp lemon scent and superior cleaning in your dishwasher for removing dried-on foods. Phosphate-free formula is better for lakes and streams. Gel dissolves quickly without caking and leaves no spots.	Colgate Palmolive, IPD Automatic Dishwashing Gel, 75 oz, Lemon Fresh Scent	-
8	f	asdfadfa	test123	abc
9	f	asdfadfa	test123	abc
10	f	asdfadfa	test123	abc
11	f	asdfadfa	test123	abc
12	f	asdfadfa	test123	abc
13	f	asdfadfa	test123	abc
14	f	asdfadfa	test123	abc
15	f	asdfadfa	test123	abc
16	f	asdfadfa	test123	abc
17	f	Personal Care Spike It Xtreme Hold Styling Gel. Great for spiking and scrunching or any hair style that requires extreme hold and control. Alcohol free won't dry or damage your hair and leaves hair with healthy shine. 16 oz bottle.	Personal Care Spike It Xtreme Hold Styling Gel	Case pack: true2 bottles
18	f	Salon Grafix Professional Freezing Hair Spray - Mega Hold 1.5 oz 1.5 oz mega hold hair spray in travel size aerosol can. Hold level is 10 on these wholesale bulk cheap discount travel size hair spray.	Salon Grafix Pro Freezing Hair Spray - Mega H	-
19	f	Freshscent 3oz Antibacterial Soap is vegetable based. Comes packed with individually wrapped bars of soap per wholesale bulk cheap discount case pack.	Freshscent 3oz Antibacterial Soap	72 bars per case
20	f	2 oz Hand Sanitizer is effective at eliminating 99.9% of many common harmful germs and bacteria. Perfect bottle for putting in your briefcase, suitcase, purse or desk. Active Ingredient is Ethyl Alcohol 62% w/w. Also contains moisturizers and aloe. Made in the USA! 96 hand sanitizer bottles per bulk wholesale cheap discount case.	2 oz Hand Sanitizer	-
21	f	# 1 Face & Body Bars Soap is Vegetable Based and in a bar form. Comes packed 5 boxes of 100 units (500 total units of bulk wholesale cheap discount bars of soap in a case)	#1 Face & Body Soap	-
22	f	Disposable toothbrush. Wholesale bulk toothbrushes are great for Hotels, Institutions and Charitable Giving. Individually wrapped bulk toothbrush with 33 nylon tufts and a blue styrene handle. Length is 6.25 inches. Comes packaged in 10 boxes of 144 (total of 1,440 toothbrushes).	33 Tuft Nylon Bristle Styrene Handle Toothbrush	-
23	f	Goji Berries (Lycium barbarum L.) have been used for 6,000 years by herbalists in China, Tibet and India as health foods and supplements. Protects the kidney and liver, helps eyesight, improves sexual function, has anti-fatigue properties, and promotes longevity. Goji Berries are also rich in antioxidants, particularly beta-carotene and zeaxanthin, which has a key role in protecting the retina of the eye.	Gogee 8 fl oz (240 mL.) Goji Berries & Acai Juice	-
24	f	Gatorade Perform 02 Powder Packet G - Lemon Lime. 1.34 oz powdered drink mix in packet. Add to 20 fl oz bottle of water. Natural and artificial flavor. Ingredients: sucrose, dextrose, citric acid, natural and artificial flavor, salt, sodium citrate, monopotassium phosphate, modified food starch, calcium silicate, yellow 5.	Gatorade Perform 02 Powder Packet G - Lemon Lime	-
25	f	Arizona Mucho Mango Fruit Juice is a vitamin C fortified drink. Enjoy this great tasting fruit juice cocktail. Kids love the mango flavored drink. Trusted Arizona brand name. Net wt 23 oz.	Arizona Mucho Mango w/Vitamin C	24 cans per case.
26	f	Motts Hot Spiced Cider Original	Motts Hot Spiced Cider Original	.74 oz package
27	f	Arnold Palmer Iced Tea is a delicately delicious combination of iced tea and lemonade and is perfect for refreshing the taste and reviving the senses. Made of half iced tea and half lemonade, this original beverage combination is made of 100 percent natural tea and contains no preservatives and no artificial flavors. Powder in the single-serve packets dissolves instantly into a 16.9 oz. bottle of water to create the refreshing beverage.	Marjack Arnold Palmer Iced Tea Packs, Multi	30/BX
28	f	100% All Natural Carbonated Fruit Juice.	Epic Purple (Black Cherry) 100% Juice	24 Pieces per Case
29	f	Hawaiian Punch Green Berry Rush 10 oz. Convenient 12 packs can be sold as a 12 pack or broken apart for 12 individual sales. Made with natural fruit juices.	Hawaiian Punch Green Berry Rush 10 oz	12 bottles per case each bottle is 10 oz
30	f	Del Monte Tomato & Basil Pasta Sauce. Great for dinners and casseroles.	Del Monte Tomato & Basil Pasta Sauce	There are 12 cans per case - each is 26.5oz
31	f	Hy Top Solid Pack Pumpkin.	HyTop Solid Pack Pumpkin	15 oz can, packed 24 per case
32	f	Raspberry Lemonade .1 oz packet add to 16.9 oz water. Ingredients: maltodextrin, citric acid, sodium citrate, potassium citrate, natural an artificial flavor, ascorbic acid (vitamin C), sucralose, silicon dioxide, niacinamide (vitamin B3), acesulfame potassium, calcium disodium EDTA (to protect freshness), calcium pantothenate (vitamin B5), vitamin E acetate, pyridoxine hydrochloride (vitamin B6), cyanocobalamin (vitamin B12).	Propel Zero - Raspberry Lemonade	-
33	f	Gatorade Perform 02 Powder Packet G2 - Grape. 0.52 oz powdered low calorie drink mix in packet. Add to 20 fl oz bottle of water. Natural and artificial flavor. Ingredients: sucrose, citric acid, natural and artificial flavor, salt, sodium citrate, monopotassium phosphate, modified food starch, calcium silicate, sucralose, acesulfame potassium, red 40, blue 1.	Gatorade Perform 02 Powder Packet G2 - Grape	-
34	f	Cascade Dishwashing Powder is formulated for under-counter dishwashers and cabinet-type automatic utensil washers.	Procter & Gamble Commercial Cascade Dishwashing Powder, 20 oz	-
1	f	A light silicone-based creme which provides thermal protection while ironing hair with heat-styling appliances.	One and Only Ceramic Silk Curling Iron Creme Thermal Protection	5.94 oz tube packed 12 to a case
35	f	Natural Automatic Dishwasher Gel gets dishes sparkling clean and is gentle on the earth. Dishwasher gel makes effortless work of whatever is waiting in the dishwasher, without the use of phosphates, chlorine or dyes. Nontoxic, plant-derived formula contains enzymes for greater cleaning power, but no NTA or EDTA. Kosher-certified gel formula has not been tested on animals and is safe for septic systems. Dishwasher gel has a lemon scent.	Seventh Generation Dishwasher Gel, 42oz., Non-Toxic, Lemon	-
36	f	Provides the same micro-abrasive cleaning power as regular soft scrub liquid cleanser, but without bleach. Gently removes tough stains, soap scum and mildew. Cleans dirt and grime without harsh scratching. Safely cleans virtually any hard surface including pots and pans, counter-tops, tubs and sinks, vinyl siding and more. Contains EPA registered disinfectants. Biodegradable and phosphate-free. Citrus scent. 2 oz bottle.	Soft Scrub Citrus Scent Liquid Dish Soap 2 Ounce	Case pack: 24 bottles
37	f	asdfadfa	test123	abc
38	f	asdfadfa	test123	abc
39	f	asdfadfa	test123	abc
40	f	asdfadfa	test123	abc
41	f	asdfadfa	test123	abc
42	f	asdfadfa	test123	abc
43	f	asdfadfa	test123	abc
44	f	asdfadfa	test123	abc
45	f	asdfadfa	test123	abc
46	f	asdfadfa	test123	abc
47	f	asdfadfa	test123	abc
48	f	asdfadfa	test123	abc
49	f	asdfadfa	test123	abc
50	f	asdfadfa	test123	abc
51	f	asdfadfa	test123	abc
52	f	asdfadfa	test123	abc
53	f	asdfadfa	test123	abc
54	f	asdfadfa	test123	abc
55	f	asdfadfa	test123	abc
56	f	asdfadfa	test123	abc
57	f	asdfadfa	test123	abc
58	f	asdfadfa	test123	abc
59	f	asdfadfa	test123	abc
60	f	asdfadfa	test123	abc
61	f	asdfadfa	test123	abc
62	f	asdfadfa	test123	abc
63	f	asdfadfa	test123	abc
64	f	asdfadfa	test123	abc
65	f	bbb	1	aaa
66	f	bbb	keso	aaa
67	f	bbb	bananhatt	aaa
68	f	bbb	katt	aaa
69	f	XX	A	B
70	f	--	Keebler Nutrigrain Cereal Bars	16/BX
71	t	bbb	keso	aaa
72	t	1	1	1
73	t	asdfadfa	test123	abc
74	t	1	1	1
75	t	asdfadfa	test123	abc
76	t	Y	X	Z
77	t	hello abcdefg	hello abcdefg	hello abcdefg
78	t	xyzxyzxyzxyz	xyzxyzxyzxyz	xyzxyzxyzxyz
79	t	asfdsadasdf	myproduct	adsfasdfsdf
80	t	x	abc	s
81	t	x	abc	s
82	t	ef	ab	cd
83	t	ef	ab	cd
84	t	4	1	23
85	f	A light silicone-based creme which provides thermal protection while ironing hair with heat-styling appliances.	One and Only Ceramic Silk Curling Iron Creme Thermal Protection	5.94 oz tube packed 12 to a case
86	f	General Mills Honey Nut Cheerios Cereal Bowl. 1 oz individual bowl.	General Mills Honey Nut Cheerios Cereal Bowl	-
87	f	Kelloggs Frosted Flakes of Corn Cereal (bowl) 1 oz bowl.	Kelloggs Frosted Flakes of Corn Cereal	-
88	f	Freshscent Deodorant Soap wrapped in paper. 3 ounces of bulk discount cheap wholesale bar soap.	3oz. Freshscent Deodorant Soap	-
89	f	30 g (1.27 oz) automatic dishwashing detergent in sealed package of 2 pods. 2 loads. Non-toxic. Naturally derived ingredients. No phosphates. Chlorine free wholesale discount cheap bulk dishwash detergent soap. Sparkling clean. Removes greasy stuff. Spotless rinse aid.	Wholesale Grabgreen Auto Dishwash Detergent - Tangerine	-
90	f	Soft Scrub Automatic Dish Detergent Soap. 1 oz travel size in individually sealed package. This wholesale discount cheap bulk dish soap is great for camping or traveling.	Soft Scrub Automatic Dish Detergent	-
91	f	Eco-friendly, automatic dishwasher gel offers a crisp lemon scent and superior cleaning in your dishwasher for removing dried-on foods. Phosphate-free formula is better for lakes and streams. Gel dissolves quickly without caking and leaves no spots.	Colgate Palmolive, IPD Automatic Dishwashing Gel, 75 oz, Lemon Fresh Scent	-
92	f	Personal Care Spike It Xtreme Hold Styling Gel. Great for spiking and scrunching or any hair style that requires extreme hold and control. Alcohol free won't dry or damage your hair and leaves hair with healthy shine. 16 oz bottle.	Personal Care Spike It Xtreme Hold Styling Gel	Case pack: true2 bottles
93	f	Salon Grafix Professional Freezing Hair Spray - Mega Hold 1.5 oz 1.5 oz mega hold hair spray in travel size aerosol can. Hold level is 10 on these wholesale bulk cheap discount travel size hair spray.	Salon Grafix Pro Freezing Hair Spray - Mega H	-
94	f	Freshscent 3oz Antibacterial Soap is vegetable based. Comes packed with individually wrapped bars of soap per wholesale bulk cheap discount case pack.	Freshscent 3oz Antibacterial Soap	72 bars per case
95	f	2 oz Hand Sanitizer is effective at eliminating 99.9% of many common harmful germs and bacteria. Perfect bottle for putting in your briefcase, suitcase, purse or desk. Active Ingredient is Ethyl Alcohol 62% w/w. Also contains moisturizers and aloe. Made in the USA! 96 hand sanitizer bottles per bulk wholesale cheap discount case.	2 oz Hand Sanitizer	-
96	f	# 1 Face & Body Bars Soap is Vegetable Based and in a bar form. Comes packed 5 boxes of 100 units (500 total units of bulk wholesale cheap discount bars of soap in a case)	#1 Face & Body Soap	-
97	f	Disposable toothbrush. Wholesale bulk toothbrushes are great for Hotels, Institutions and Charitable Giving. Individually wrapped bulk toothbrush with 33 nylon tufts and a blue styrene handle. Length is 6.25 inches. Comes packaged in 10 boxes of 144 (total of 1,440 toothbrushes).	33 Tuft Nylon Bristle Styrene Handle Toothbrush	-
98	f	Goji Berries (Lycium barbarum L.) have been used for 6,000 years by herbalists in China, Tibet and India as health foods and supplements. Protects the kidney and liver, helps eyesight, improves sexual function, has anti-fatigue properties, and promotes longevity. Goji Berries are also rich in antioxidants, particularly beta-carotene and zeaxanthin, which has a key role in protecting the retina of the eye.	Gogee 8 fl oz (240 mL.) Goji Berries & Acai Juice	-
99	f	Gatorade Perform 02 Powder Packet G - Lemon Lime. 1.34 oz powdered drink mix in packet. Add to 20 fl oz bottle of water. Natural and artificial flavor. Ingredients: sucrose, dextrose, citric acid, natural and artificial flavor, salt, sodium citrate, monopotassium phosphate, modified food starch, calcium silicate, yellow 5.	Gatorade Perform 02 Powder Packet G - Lemon Lime	-
100	f	Arizona Mucho Mango Fruit Juice is a vitamin C fortified drink. Enjoy this great tasting fruit juice cocktail. Kids love the mango flavored drink. Trusted Arizona brand name. Net wt 23 oz.	Arizona Mucho Mango w/Vitamin C	24 cans per case.
101	f	Motts Hot Spiced Cider Original	Motts Hot Spiced Cider Original	.74 oz package
102	f	Arnold Palmer Iced Tea is a delicately delicious combination of iced tea and lemonade and is perfect for refreshing the taste and reviving the senses. Made of half iced tea and half lemonade, this original beverage combination is made of 100 percent natural tea and contains no preservatives and no artificial flavors. Powder in the single-serve packets dissolves instantly into a 16.9 oz. bottle of water to create the refreshing beverage.	Marjack Arnold Palmer Iced Tea Packs, Multi	30/BX
103	f	100% All Natural Carbonated Fruit Juice.	Epic Purple (Black Cherry) 100% Juice	24 Pieces per Case
104	f	Hawaiian Punch Green Berry Rush 10 oz. Convenient 12 packs can be sold as a 12 pack or broken apart for 12 individual sales. Made with natural fruit juices.	Hawaiian Punch Green Berry Rush 10 oz	12 bottles per case each bottle is 10 oz
105	f	Del Monte Tomato & Basil Pasta Sauce. Great for dinners and casseroles.	Del Monte Tomato & Basil Pasta Sauce	There are 12 cans per case - each is 26.5oz
106	f	Hy Top Solid Pack Pumpkin.	HyTop Solid Pack Pumpkin	15 oz can, packed 24 per case
107	f	Raspberry Lemonade .1 oz packet add to 16.9 oz water. Ingredients: maltodextrin, citric acid, sodium citrate, potassium citrate, natural an artificial flavor, ascorbic acid (vitamin C), sucralose, silicon dioxide, niacinamide (vitamin B3), acesulfame potassium, calcium disodium EDTA (to protect freshness), calcium pantothenate (vitamin B5), vitamin E acetate, pyridoxine hydrochloride (vitamin B6), cyanocobalamin (vitamin B12).	Propel Zero - Raspberry Lemonade	-
108	f	Gatorade Perform 02 Powder Packet G2 - Grape. 0.52 oz powdered low calorie drink mix in packet. Add to 20 fl oz bottle of water. Natural and artificial flavor. Ingredients: sucrose, citric acid, natural and artificial flavor, salt, sodium citrate, monopotassium phosphate, modified food starch, calcium silicate, sucralose, acesulfame potassium, red 40, blue 1.	Gatorade Perform 02 Powder Packet G2 - Grape	-
109	f	Cascade Dishwashing Powder is formulated for under-counter dishwashers and cabinet-type automatic utensil washers.	Procter & Gamble Commercial Cascade Dishwashing Powder, 20 oz	-
110	f	Natural Automatic Dishwasher Gel gets dishes sparkling clean and is gentle on the earth. Dishwasher gel makes effortless work of whatever is waiting in the dishwasher, without the use of phosphates, chlorine or dyes. Nontoxic, plant-derived formula contains enzymes for greater cleaning power, but no NTA or EDTA. Kosher-certified gel formula has not been tested on animals and is safe for septic systems. Dishwasher gel has a lemon scent.	Seventh Generation Dishwasher Gel, 42oz., Non-Toxic, Lemon	-
111	f	Provides the same micro-abrasive cleaning power as regular soft scrub liquid cleanser, but without bleach. Gently removes tough stains, soap scum and mildew. Cleans dirt and grime without harsh scratching. Safely cleans virtually any hard surface including pots and pans, counter-tops, tubs and sinks, vinyl siding and more. Contains EPA registered disinfectants. Biodegradable and phosphate-free. Citrus scent. 2 oz bottle.	Soft Scrub Citrus Scent Liquid Dish Soap 2 Ounce	Case pack: 24 bottles
\.


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_id_seq', 111, true);


--
-- Data for Name: product_limit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY product_limit (id, category_id, load_limit, product_id) FROM stdin;
4	1	200	2
5	2	250	2
6	3	300	2
7	1	200	3
8	2	250	3
9	3	300	3
10	1	200	4
11	2	250	4
12	3	300	4
13	1	200	5
14	2	250	5
15	3	300	5
16	1	200	6
17	2	250	6
18	3	300	6
19	1	200	7
20	2	250	7
21	3	300	7
22	1	200	8
23	2	250	8
24	3	300	8
25	1	200	9
26	2	250	9
27	3	300	9
28	1	200	10
29	2	250	10
30	3	300	10
31	1	200	11
32	2	250	11
33	3	300	11
34	1	200	12
35	2	250	12
36	3	300	12
37	1	100	63
38	1	55	64
39	2	75	64
40	1	55	65
41	2	75	65
42	1	55	66
43	2	75	66
44	1	10	67
45	2	10	67
46	1	10	68
47	2	10	68
48	1	10	69
49	2	10	69
50	1	10	70
51	2	10	70
52	1	10	71
53	2	10	71
54	1	1	72
55	2	1	72
56	3	1	72
57	4	1	72
58	1	55	73
59	2	75	73
60	1	1	74
61	2	1	74
62	3	1	74
63	4	1	74
64	1	55	75
65	2	75	75
66	1	1	77
67	2	2	77
68	3	3	77
69	4	4	77
70	1	1	78
71	2	1	78
72	3	1	78
73	4	1	78
74	1	12	79
75	2	123	79
76	3	123	79
77	4	132	79
78	1	22	80
79	2	2	80
80	3	2	80
81	4	2	80
82	1	22	81
83	2	2	81
84	3	2	81
85	4	2	81
86	1	8	82
87	2	8	82
88	3	8	82
89	4	8	82
90	1	8	83
91	2	8	83
92	3	8	83
93	4	8	83
94	1	2	84
95	2	2	84
96	3	3	84
97	4	2	84
98	1	200	1
99	2	250	1
100	3	300	1
101	4	6	1
102	5	4	1
\.


--
-- Name: product_limit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_limit_id_seq', 102, true);


--
-- Data for Name: product_price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY product_price (id, price, price_cat_id, product_id) FROM stdin;
4	24000	1	2
5	28000	2	2
6	35000	3	2
7	24000	1	3
8	28000	2	3
9	35000	3	3
10	24000	1	4
11	28000	2	4
12	35000	3	4
13	24000	1	5
14	28000	2	5
15	35000	3	5
16	24000	1	6
17	28000	2	6
18	35000	3	6
19	24000	1	7
20	28000	2	7
21	35000	3	7
22	24000	1	8
23	28000	2	8
24	35000	3	8
25	24000	1	9
26	28000	2	9
27	35000	3	9
28	24000	1	10
29	28000	2	10
30	35000	3	10
31	24000	1	11
32	28000	2	11
33	35000	3	11
34	24000	1	12
35	28000	2	12
36	35000	3	12
37	100	1	29
38	100	2	29
39	1000	1	41
40	1000	2	41
41	1000	1	42
42	1000	2	42
43	1000	1	43
44	1000	2	43
45	1000	1	44
46	1000	2	44
47	1000	1	45
48	1000	2	45
49	1000	1	46
50	1000	2	46
51	1000	1	47
52	1000	2	47
53	1000	1	48
54	1000	2	48
55	1000	1	49
56	1000	2	49
57	1000	1	50
58	1000	2	50
59	1000	1	51
60	1000	2	51
61	1000	1	52
62	1000	2	52
63	1000	1	56
64	1000	2	56
65	1000	1	61
66	1000	2	61
67	1000	1	62
68	1000	2	62
69	1000	1	63
70	1000	2	63
71	1000	1	64
72	1000	2	64
73	1000	1	65
74	1000	2	65
75	1000	1	66
76	1000	2	66
77	1000	1	67
78	1000	2	67
79	1000	1	68
80	1000	2	68
81	1000	1	69
82	1000	2	69
83	1000	1	70
84	1000	2	70
85	1000	1	71
86	1000	2	71
87	1	1	72
88	1	2	72
89	1	3	72
90	1000	1	73
91	1000	2	73
92	1	1	74
93	1	2	74
94	111	3	74
95	1000	1	75
96	1000	2	75
97	100	1	77
98	200	2	77
99	300	3	77
100	1	1	78
101	1	2	78
102	2	3	78
103	123	1	79
104	444	2	79
105	555	3	79
106	1	1	80
107	2	2	80
108	2	3	80
109	1	1	81
110	2	2	81
111	2	3	81
112	12	1	82
113	6	2	82
114	7	3	82
115	12	1	83
116	6	2	83
117	7	3	83
118	24000	1	1
119	28000	2	1
120	35000	3	1
121	11	4	1
122	11	5	1
123	11	6	1
124	11	7	1
\.


--
-- Data for Name: product_price_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY product_price_category (id, name) FROM stdin;
1	Wholesale
2	Agent
3	banan
4	faaaaaa
5	abc
6	xx
7	Standard
\.


--
-- Name: product_price_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_price_category_id_seq', 7, true);


--
-- Name: product_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_price_id_seq', 124, true);


--
-- Data for Name: product_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY product_stock (id, depot_id, product_id, order_id, quantity) FROM stdin;
1	1	1	3	4
2	1	1	3	6
3	1	1	3	11
4	1	1	\N	25
5	1	2	\N	6
6	1	2	3	6
7	1	2	1	2
8	1	3	2	10
9	1	3	\N	10
10	1	3	\N	4
\.


--
-- Name: product_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_stock_id_seq', 10, true);


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY region (id, name) FROM stdin;
2	Geita
3	Iringa
4	Kagera
5	Katavi
6	Kigoma
7	Kilimanjaro
8	Manyara
9	Mara
10	Mbeya
11	Morogoro
12	Mtwara
13	Njombe
14	Pemba
15	Pemba South
16	Pwani
1	x
17	xxx
20	b
\.


--
-- Name: region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('region_id_seq', 21, true);


--
-- Data for Name: role_commission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY role_commission (id, product_id, role, value) FROM stdin;
\.


--
-- Name: role_commission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('role_commission_id_seq', 1, false);


--
-- Data for Name: sdrp_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY sdrp_user (id, name, password, role, username, depot_id) FROM stdin;
1	Test User	demo	depot-manager	depotman1	\N
2	BoB Dylan	demo	call-center	demouser	\N
4	Nikolai Tesla	demo2	call-center	demo2	\N
5	Steven Seagal	demo3	call-center	demo3	\N
6	Dolph Lundgren	demo4	call-center	demo4	\N
7	Chuck Norris	demo5	call-center	demo5	\N
8	Boris Karloff	demo6	field-staff	demo6	\N
9	Nicki Minaj	demo7	field-staff	demo7	\N
10	Papa Bear	123	driver	driver1	\N
11	Yogi Bear	123	driver	driver2	\N
12	Rick Hunter	123	driver	driver3	\N
13	X Y	123	depot-manager	X	\N
3	Salman Khan	4d6b016465c8d648ca14332f0f7e7fd2b639f3ca	field-staff	fstaff	1
\.


--
-- Name: sdrp_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('sdrp_user_id_seq', 13, true);


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY settings (id, key, value) FROM stdin;
1	task	{\\"contactTimeInterval\\":\\"1\\",\\"orderTimeInterval\\":\\"1\\",\\"visitTimeInterval\\":\\"1\\",\\"inactiveTimeInterval\\":\\"1\\"}
\.


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('settings_id_seq', 1, true);


--
-- Data for Name: sphere_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY sphere_user (id, name, password, role, salt, username, depot_id) FROM stdin;
1	fstaff	$1$SXK8xuzw$PM5c6PFvLD.fSasVHEjSp1	field-staff	$1$eoSwBfPr	fstaff	1
\.


--
-- Name: sphere_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('sphere_user_id_seq', 1, true);


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stock (id, actual, available, depot_id, product_id) FROM stdin;
4	100	90	2	1
1	100	90	1	3
5	100	99	1	4
6	100	99	1	5
3	94	875	1	1
2	100	39	1	2
\.


--
-- Data for Name: stock_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stock_activity (id, activity_type, created, depot_id, product_id, quantity) FROM stdin;
1	order-placed	2014-09-16 23:14:14.7537	1	1	1
2	order-placed	2014-09-16 23:14:14.929909	1	2	1
3	order-placed	2014-09-17 13:08:51.387429	1	1	1
4	order-placed	2014-09-17 13:08:51.482737	1	2	1
5	order-placed	2014-09-17 13:09:44.666048	1	1	1
6	order-placed	2014-09-17 13:09:44.788363	1	2	1
7	order-placed	2014-09-17 13:47:47.494989	1	1	1
8	order-placed	2014-09-17 13:47:47.590877	1	2	1
9	order-placed	2014-09-17 13:48:51.492798	1	1	1
10	order-placed	2014-09-17 13:48:51.540608	1	2	2
11	order-placed	2014-09-17 13:48:51.589999	1	3	1
12	order-placed	2014-09-17 13:48:51.642632	1	4	1
13	order-placed	2014-09-17 13:48:51.697866	1	5	1
14	order-placed	2014-09-17 13:50:54.937646	1	1	1
15	order-placed	2014-09-17 13:54:20.751618	1	1	1
16	order-placed	2014-09-17 13:54:20.777726	1	2	1
\.


--
-- Name: stock_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('stock_activity_id_seq', 16, true);


--
-- Data for Name: stock_damage_report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stock_damage_report (id, activity_id, damage_type, description) FROM stdin;
\.


--
-- Name: stock_damage_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('stock_damage_report_id_seq', 1, false);


--
-- Data for Name: stock_damage_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stock_damage_type (id, name) FROM stdin;
1	Fire
2	Flood
3	Explosion
4	Sabotage
5	Other/Unspecified
\.


--
-- Name: stock_damage_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('stock_damage_type_id_seq', 5, true);


--
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('stock_id_seq', 6, true);


--
-- Data for Name: trombone_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY trombone_keys (id, client, key) FROM stdin;
1	generic	14ad0ef86bc392b39bad6009113c2a5a8a1d993a
\.


--
-- Name: trombone_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('trombone_keys_id_seq', 1, true);


--
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY vehicle (id, depot_id, is_available, make, model, reg_no, status, user_id, category_id) FROM stdin;
1	1	t	Toyota	DYNA TRUCK	TXA-014	VehicleActive	\N	1
2	1	t	Toyota	DYNA TRUCK	TXA-015	VehicleActive	\N	1
3	1	t	Toyota	DYNA TRUCK	TXA-016	VehicleActive	\N	1
4	5	t	Mitsubishi	Canter	T763 BMS	VehicleActive	\N	1
5	1	t	Toyota	Canter	TXA-018	VehicleActive	\N	3
6	2	t	Ford	Wagon	T843 8BFF	VehicleActive	\N	2
7	1	t	Mitsubishi	Canter	T763 BMT	VehicleActive	\N	1
8	3	t	Mitsubishi	Canter	T902 AGM	VehicleActive	\N	2
9	3	t	Mitsubishi	Canter	T328 BGY	VehicleActive	\N	4
10	4	t	Mitsubishi	Canter	T548 9BFM	VehicleActive	\N	2
11	4	t	Mitsubishi	Canter	T323 8MNO	VehicleActive	\N	3
12	5	t	Mitsubishi	Canter	T538 MNY	VehicleActive	\N	2
13	5	t	Mitsubishi	Canter	T672 ULS	VehicleActive	\N	3
14	1	t	Toyota	DYNA TRUCK	TXA-013	VehicleActive	11	1
16	1	t	x	y	z	-	12	3
\.


--
-- Data for Name: vehicle_fuel_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY vehicle_fuel_activity (id, amount, created, meter_reading, vehicle_id) FROM stdin;
\.


--
-- Name: vehicle_fuel_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('vehicle_fuel_activity_id_seq', 1, false);


--
-- Name: vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('vehicle_id_seq', 16, true);


--
-- Data for Name: vehicle_maintenance_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY vehicle_maintenance_activity (id, description, end_time, meter_reading, start_time, activity, vehicle_id) FROM stdin;
\.


--
-- Name: vehicle_maintenance_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('vehicle_maintenance_activity_id_seq', 1, false);


--
-- Data for Name: weight_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY weight_category (id, name) FROM stdin;
1	Class C
2	Class A
3	Class B
4	Class DD
5	Class X
\.


--
-- Name: weight_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('weight_category_id_seq', 5, true);


--
-- Name: area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id);


--
-- Name: area_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY area_user
    ADD CONSTRAINT area_user_pkey PRIMARY KEY (id);


--
-- Name: complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY complaint
    ADD CONSTRAINT complaint_pkey PRIMARY KEY (id);


--
-- Name: complaint_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY complaint_product
    ADD CONSTRAINT complaint_product_pkey PRIMARY KEY (id);


--
-- Name: customer_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customer_activity
    ADD CONSTRAINT customer_activity_pkey PRIMARY KEY (id);


--
-- Name: customer_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customer_contact
    ADD CONSTRAINT customer_contact_pkey PRIMARY KEY (id);


--
-- Name: customer_pending_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customer_pending
    ADD CONSTRAINT customer_pending_pkey PRIMARY KEY (id);


--
-- Name: customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: depot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY depot
    ADD CONSTRAINT depot_pkey PRIMARY KEY (id);


--
-- Name: dispatch_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY dispatch_activity
    ADD CONSTRAINT dispatch_activity_pkey PRIMARY KEY (id);


--
-- Name: dispatch_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY dispatch_order
    ADD CONSTRAINT dispatch_order_pkey PRIMARY KEY (id);


--
-- Name: dispatch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY dispatch
    ADD CONSTRAINT dispatch_pkey PRIMARY KEY (id);


--
-- Name: maintenance_activity_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY maintenance_activity_type
    ADD CONSTRAINT maintenance_activity_type_pkey PRIMARY KEY (id);


--
-- Name: order_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY order_activity
    ADD CONSTRAINT order_activity_pkey PRIMARY KEY (id);


--
-- Name: order_object_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY order_object
    ADD CONSTRAINT order_object_pkey PRIMARY KEY (id);


--
-- Name: order_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY order_product
    ADD CONSTRAINT order_product_pkey PRIMARY KEY (id);


--
-- Name: order_weight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY order_weight
    ADD CONSTRAINT order_weight_pkey PRIMARY KEY (id);


--
-- Name: product_limit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_limit
    ADD CONSTRAINT product_limit_pkey PRIMARY KEY (id);


--
-- Name: product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_price_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_price_category
    ADD CONSTRAINT product_price_category_pkey PRIMARY KEY (id);


--
-- Name: product_price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_price
    ADD CONSTRAINT product_price_pkey PRIMARY KEY (id);


--
-- Name: region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: role_commission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY role_commission
    ADD CONSTRAINT role_commission_pkey PRIMARY KEY (id);


--
-- Name: sdrp_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sdrp_user
    ADD CONSTRAINT sdrp_user_pkey PRIMARY KEY (id);


--
-- Name: settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: stock_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock_activity
    ADD CONSTRAINT stock_activity_pkey PRIMARY KEY (id);


--
-- Name: stock_damage_report_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock_damage_report
    ADD CONSTRAINT stock_damage_report_pkey PRIMARY KEY (id);


--
-- Name: stock_damage_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock_damage_type
    ADD CONSTRAINT stock_damage_type_pkey PRIMARY KEY (id);


--
-- Name: stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- Name: trombone_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY trombone_keys
    ADD CONSTRAINT trombone_keys_pkey PRIMARY KEY (id);


--
-- Name: unique_area_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY area
    ADD CONSTRAINT unique_area_name UNIQUE (name, region_id);


--
-- Name: unique_area_user; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY area_user
    ADD CONSTRAINT unique_area_user UNIQUE (user_id, area_id);


--
-- Name: unique_complaint_product_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY complaint_product
    ADD CONSTRAINT unique_complaint_product_id UNIQUE (product_id, complaint_id);


--
-- Name: unique_depot_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY depot
    ADD CONSTRAINT unique_depot_name UNIQUE (name);


--
-- Name: unique_dispatch_order_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY dispatch_order
    ADD CONSTRAINT unique_dispatch_order_id UNIQUE (dispatch_id, order_id);


--
-- Name: unique_maintenance_type_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY maintenance_activity_type
    ADD CONSTRAINT unique_maintenance_type_name UNIQUE (name);


--
-- Name: unique_order_product_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY order_product
    ADD CONSTRAINT unique_order_product_id UNIQUE (order_id, product_id);


--
-- Name: unique_order_weight_category_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY order_weight
    ADD CONSTRAINT unique_order_weight_category_id UNIQUE (order_id, category_id);


--
-- Name: unique_product_category_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_limit
    ADD CONSTRAINT unique_product_category_id UNIQUE (product_id, category_id);


--
-- Name: unique_product_price_cat_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_price
    ADD CONSTRAINT unique_product_price_cat_id UNIQUE (product_id, price_cat_id);


--
-- Name: unique_product_price_category_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_price_category
    ADD CONSTRAINT unique_product_price_category_name UNIQUE (name);


--
-- Name: unique_reg_no; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT unique_reg_no UNIQUE (reg_no);


--
-- Name: unique_region_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY region
    ADD CONSTRAINT unique_region_name UNIQUE (name);


--
-- Name: unique_role_commission_product; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY role_commission
    ADD CONSTRAINT unique_role_commission_product UNIQUE (product_id, role);


--
-- Name: unique_settings_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT unique_settings_key UNIQUE (key);


--
-- Name: unique_stock_damage_report_activity_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock_damage_report
    ADD CONSTRAINT unique_stock_damage_report_activity_id UNIQUE (activity_id);


--
-- Name: unique_stock_damage_type_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock_damage_type
    ADD CONSTRAINT unique_stock_damage_type_name UNIQUE (name);


--
-- Name: unique_stock_depot_product_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT unique_stock_depot_product_id UNIQUE (depot_id, product_id);


--
-- Name: unique_username; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sdrp_user
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: unique_vehicle_user; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT unique_vehicle_user UNIQUE (user_id);


--
-- Name: unique_weight_category_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY weight_category
    ADD CONSTRAINT unique_weight_category_name UNIQUE (name);


--
-- Name: vehicle_fuel_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vehicle_fuel_activity
    ADD CONSTRAINT vehicle_fuel_activity_pkey PRIMARY KEY (id);


--
-- Name: vehicle_maintenance_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vehicle_maintenance_activity
    ADD CONSTRAINT vehicle_maintenance_activity_pkey PRIMARY KEY (id);


--
-- Name: vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (id);


--
-- Name: weight_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY weight_category
    ADD CONSTRAINT weight_category_pkey PRIMARY KEY (id);


--
-- Name: area_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY area
    ADD CONSTRAINT area_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES depot(id);


--
-- Name: area_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY area
    ADD CONSTRAINT area_region_id_fkey FOREIGN KEY (region_id) REFERENCES region(id);


--
-- Name: area_user_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY area_user
    ADD CONSTRAINT area_user_area_id_fkey FOREIGN KEY (area_id) REFERENCES area(id);


--
-- Name: area_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY area_user
    ADD CONSTRAINT area_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES sdrp_user(id);


--
-- Name: complaint_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY complaint
    ADD CONSTRAINT complaint_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- Name: complaint_product_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY complaint_product
    ADD CONSTRAINT complaint_product_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES complaint(id);


--
-- Name: complaint_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY complaint_product
    ADD CONSTRAINT complaint_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: customer_activity_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer_activity
    ADD CONSTRAINT customer_activity_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- Name: customer_activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer_activity
    ADD CONSTRAINT customer_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES sdrp_user(id);


--
-- Name: customer_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_area_id_fkey FOREIGN KEY (area_id) REFERENCES area(id);


--
-- Name: customer_contact_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer_contact
    ADD CONSTRAINT customer_contact_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- Name: customer_price_cat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_price_cat_id_fkey FOREIGN KEY (price_cat_id) REFERENCES product_price_category(id);


--
-- Name: depot_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY depot
    ADD CONSTRAINT depot_region_id_fkey FOREIGN KEY (region_id) REFERENCES region(id);


--
-- Name: dispatch_activity_dispatch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch_activity
    ADD CONSTRAINT dispatch_activity_dispatch_id_fkey FOREIGN KEY (dispatch_id) REFERENCES dispatch(id);


--
-- Name: dispatch_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch
    ADD CONSTRAINT dispatch_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES depot(id);


--
-- Name: dispatch_order_dispatch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch_order
    ADD CONSTRAINT dispatch_order_dispatch_id_fkey FOREIGN KEY (dispatch_id) REFERENCES dispatch(id);


--
-- Name: dispatch_order_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch_order
    ADD CONSTRAINT dispatch_order_order_id_fkey FOREIGN KEY (order_id) REFERENCES order_object(id);


--
-- Name: dispatch_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dispatch
    ADD CONSTRAINT dispatch_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicle(id);


--
-- Name: order_activity_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_activity
    ADD CONSTRAINT order_activity_order_id_fkey FOREIGN KEY (order_id) REFERENCES order_object(id);


--
-- Name: order_object_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_object
    ADD CONSTRAINT order_object_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- Name: order_object_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_object
    ADD CONSTRAINT order_object_user_id_fkey FOREIGN KEY (user_id) REFERENCES sdrp_user(id);


--
-- Name: order_product_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_product
    ADD CONSTRAINT order_product_order_id_fkey FOREIGN KEY (order_id) REFERENCES order_object(id);


--
-- Name: order_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_product
    ADD CONSTRAINT order_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: order_weight_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_weight
    ADD CONSTRAINT order_weight_category_id_fkey FOREIGN KEY (category_id) REFERENCES weight_category(id);


--
-- Name: order_weight_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_weight
    ADD CONSTRAINT order_weight_order_id_fkey FOREIGN KEY (order_id) REFERENCES order_object(id);


--
-- Name: product_limit_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_limit
    ADD CONSTRAINT product_limit_category_id_fkey FOREIGN KEY (category_id) REFERENCES weight_category(id);


--
-- Name: product_limit_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_limit
    ADD CONSTRAINT product_limit_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: product_price_price_cat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_price
    ADD CONSTRAINT product_price_price_cat_id_fkey FOREIGN KEY (price_cat_id) REFERENCES product_price_category(id);


--
-- Name: product_price_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_price
    ADD CONSTRAINT product_price_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: role_commission_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY role_commission
    ADD CONSTRAINT role_commission_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: stock_activity_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_activity
    ADD CONSTRAINT stock_activity_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES depot(id);


--
-- Name: stock_activity_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_activity
    ADD CONSTRAINT stock_activity_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: stock_damage_report_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_damage_report
    ADD CONSTRAINT stock_damage_report_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES stock_activity(id);


--
-- Name: stock_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT stock_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES depot(id);


--
-- Name: stock_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT stock_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- Name: user_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sdrp_user
    ADD CONSTRAINT user_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES depot(id);


--
-- Name: vehicle_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT vehicle_category_id_fkey FOREIGN KEY (category_id) REFERENCES weight_category(id);


--
-- Name: vehicle_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT vehicle_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES depot(id);


--
-- Name: vehicle_fuel_activity_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle_fuel_activity
    ADD CONSTRAINT vehicle_fuel_activity_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicle(id);


--
-- Name: vehicle_maintenance_activity_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle_maintenance_activity
    ADD CONSTRAINT vehicle_maintenance_activity_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicle(id);


--
-- Name: vehicle_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT vehicle_user_id_fkey FOREIGN KEY (user_id) REFERENCES sdrp_user(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

