export namespace DotEnv {
  export interface Domain {
    SERVER_PORT: string;
    SERVER_TEST_PORT: string;
    SERVER_PREFIX: string;
    SERVER_LISTEN_MESSAGE: string;
    SERVER_TEST_LISTEN_MESSAGE: string;

    DATABASE_NAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_USERNAME: string;
    DATABASE_PORT: string;

    AUTH_TOKEN_SECRET: string;
    
    SPA_PORT: string;
    SPA_URL: string;
  }

  export interface Databse {
    port: number;
    password: string;
    name: string;
    username: string;
  }

  export interface Server {
    port: number;
    test_port: number;
    prefix: string;
    message: string;
    test_message: string;
  }

  export interface Spa {
    url: string;
  }

  export interface Token {
    secret: string;
  }

  export interface Contract {
    server: Server;
    spa: Spa;
    database: Databse;
    token: Token;
  }
}
