CREATE TABLE "public"."reactionrole"
(
  "messageid" character varying(64) NOT NULL,
  "roleid" character varying(64) NOT NULL,
  "emojiname" character varying(300) NOT NULL
)
WITH (oids = false);