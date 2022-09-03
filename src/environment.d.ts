declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MYSQL_HOST: string
            MYSQL_HOST: string
            MYSQL_PORT: string
            MYSQL_DB: string
            SERVICE_USER_PASSWORD: string
            MYSQL_SERVICE_USERNAME: string

            JWT_SECRET: string

            CLIENT_USERNAME: string
            CLIENT_PASSWORD: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
