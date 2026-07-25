CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,

  donationalerts_access_token  text NULL,
  donationalerts_refresh_token text NULL
);
