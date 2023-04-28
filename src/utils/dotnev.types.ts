export namespace DotEnv {
  export interface Domain {
    SERVER_PORT: string;
    SERVER_TEST_PORT: string;
    SERVER_PREFIX: string;
    SERVER_LISTEN_MESSAGE: string;
    SPA_PORT: string;
    SPA_URL: string;
  }

  export interface Server {
    port: number;
    test_port: number;
    prefix: string;
    message: string;
  }

  export interface Spa {
    url: string;
  }

  export interface Contract {
    server: Server;
    spa: Spa;
  }
}
