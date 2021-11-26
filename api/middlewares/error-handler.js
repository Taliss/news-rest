module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // TODO: dont log here, use some logger
    console.log('Error: ', err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
};
