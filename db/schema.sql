CREATE TYPE donation_source AS ENUM ('donationalerts');
CREATE TYPE currency AS ENUM ('RUB');
CREATE DOMAIN js_date AS timestamptz(3);

CREATE TABLE "user" (
  user_id serial PRIMARY KEY,

  donationalerts_access_token  text NULL,
  donationalerts_refresh_token text NULL
);

CREATE TABLE donation (
  donation_id     int             NOT NULL,
  donation_source donation_source NOT NULL,
  user_id         int             NOT NULL REFERENCES "user" (user_id),
  author          text                NULL,
  message         text                NULL,
  currency        currency        NOT NULL,
  amount          float           NOT NULL,
  created_at      js_date         NOT NULL,
  PRIMARY KEY (donation_id, donation_source)
);

CREATE TABLE video (
  video_id        serial PRIMARY KEY,
  donation_id     int NOT NULL,
  donation_source donation_source NOT NULL,
  url             text NOT NULL,
  is_watched      bool NOT NULL DEFAULT false,
  FOREIGN KEY (donation_id, donation_source) REFERENCES donation(donation_id, donation_source)
);