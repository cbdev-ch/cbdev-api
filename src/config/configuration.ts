import { prototype } from "module";
import { type } from "os";

const env = process.env;

export default () => ({
    versionPrefix: env.VERSION_PREFIX,
    port: env.DEV_MODE ? env.DEV_API_PORT : env.API_PORT,
    discordClientId: env.DISCORD_CLIENT_ID,
    discordClientSecret: env.DISCORD_CLIENT_SECRET,
    baseUrl: (env.DEV_MODE
    ? env.DEV_API_PROTOCOL + "://" + env.DEV_API_HOST + ":" + env.DEV_API_PORT
    : env.API_PROTOCOL + "://" + env.API_HOST + ":" + env.API_PORT)
    + "/" + env.VERSION_PREFIX,
    discordEndpoint: env.DISCORD_ENDPOINT,
});
