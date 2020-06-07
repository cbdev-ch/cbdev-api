export default () => ({
    url: `mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST1}:${process.env.MONGODB_PORT1},${process.env.MONGODB_HOST2}:${process.env.MONGODB_PORT2},${process.env.MONGODB_HOST3}:${process.env.MONGODB_PORT3}/${process.env.MONGODB_DATABASE}?replicaSet=${process.env.MONGODB_REPLICA_SET}?authSource=${process.env.MONGODB_AUTH_SOURCE}`
});
