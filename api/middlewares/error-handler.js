const STATUS_CODES = require('http').STATUS_CODES;

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.expose ? err.message : STATUS_CODES[ctx.status],
    };
    ctx.app.emit('error', err, ctx);
  }
};
