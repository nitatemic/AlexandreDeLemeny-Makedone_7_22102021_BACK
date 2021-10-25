module.exports = {
    mode : "development",
    entry: {
        signup: "./src/js/signup/signup.js",
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist",
    },
};
