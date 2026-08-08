CREATE TYPE donation_source AS ENUM ('donationalerts');
CREATE TYPE currency AS ENUM ('RUB');
CREATE DOMAIN js_date AS timestamptz(3);

-- auth

CREATE TABLE auth_user (
  "id"            text    PRIMARY KEY,
  "name"          text    NOT NULL,
  "email"         text    NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL,
  "image"         text        NULL,
  "createdAt"     js_date NOT NULL DEFAULT now(),
  "updatedAt"     js_date NOT NULL DEFAULT now()
);

CREATE TABLE auth_session (
  "id"        text    PRIMARY KEY,
  "expiresAt" js_date NOT NULL,
  "token"     text    NOT NULL UNIQUE,
  "createdAt" js_date NOT NULL DEFAULT now(),
  "updatedAt" js_date NOT NULL,
  "ipAddress" text        NULL,
  "userAgent" text        NULL,
  "userId"    text    NOT NULL REFERENCES "auth_user" ("id") ON DELETE CASCADE
);

CREATE TABLE auth_account (
  "id"                    text    PRIMARY KEY,
  "accountId"             text    NOT NULL,
  "providerId"            text    NOT NULL,
  "userId"                text    NOT NULL REFERENCES "auth_user" ("id") ON DELETE CASCADE,
  "accessToken"           text        NULL,
  "refreshToken"          text        NULL,
  "idToken"               text        NULL,
  "accessTokenExpiresAt"  js_date     NULL,
  "refreshTokenExpiresAt" js_date     NULL,
  "scope"                 text        NULL,
  "password"              text        NULL,
  "createdAt"             js_date NOT NULL DEFAULT now(),
  "updatedAt"             js_date NOT NULL
);

CREATE TABLE auth_verification (
  "id"          text    PRIMARY KEY,
  "identifier"  text    NOT NULL,
  "value"       text    NOT NULL,
  "expiresAt"   js_date NOT NULL,
  "createdAt"   js_date NOT NULL DEFAULT now(),
  "updatedAt"   js_date NOT NULL DEFAULT now()
);

CREATE INDEX "auth_session_userId_idx" ON "auth_session" ("userId");
CREATE INDEX "auth_account_userId_idx" ON "auth_account" ("userId");
CREATE INDEX "auth_verification_identifier_idx" ON "auth_verification" ("identifier");

-- main

CREATE TABLE "user" (
  user_id serial PRIMARY KEY,
  auth_user_id text UNIQUE NULL REFERENCES auth_user (id),

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
  video_id        serial          PRIMARY KEY,
  donation_id     int             NOT NULL,
  donation_source donation_source NOT NULL,
  url             text            NOT NULL,
  is_watched      bool            NOT NULL DEFAULT false,
  FOREIGN KEY (donation_id, donation_source) REFERENCES donation (donation_id, donation_source)
);
