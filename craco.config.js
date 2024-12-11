module.exports = {
    webpack: {
        devServer: {
            setupMiddlewares: (middlewares, devServer) => {
                return middlewares;
            },
        },
    },
};

