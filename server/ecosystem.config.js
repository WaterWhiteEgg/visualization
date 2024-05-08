// eslint-disable-next-line no-undef
module.exports = {
  apps: [{
    name: "server1",
    script: './dist/index.js',
    watch: './dist/',
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }],
};
