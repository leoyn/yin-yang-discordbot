CREATE TABLE "public"."reactionrole"
(
  "message_id"  character varying(64) NOT NULL,
  "role_id"      character varying(64) NOT NULL,
  "emojiname"   character varying(300) NOT NULL
)
WITH (oids = false);

CREATE TABLE "public"."feed" (
  "id"            SERIAL PRIMARY KEY,
  "url"           character varying(1024) UNIQUE NOT NULL,
  "channel_id"    character varying(1024) NOT NULL
);

CREATE TABLE "public"."item" (
  "id"            SERIAL PRIMARY KEY,
  "guid"          character varying(1024) UNIQUE NOT NULL,
  "title"         character varying(120) NOT NULL,
  "description"   character varying(1024) NULL,
  "url"           character varying(1024) NULL,
  "feed_id"       INTEGER REFERENCES "public"."feed" (id) ON DELETE CASCADE
);