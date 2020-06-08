export default () => ({
    versionPrefix: process.env.VERSION_PREFIX,
    port: process.env.DEV_MODE ? process.env.DEV_HTTP_PORT : process.env.HTTP_PORT
});
