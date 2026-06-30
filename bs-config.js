module.exports = {
  server: { baseDir: './' },
  files: ['index.html', 'css/*.css', 'js/*.js', 'images/**/*'],
  port: Number(process.env.PORT) || 3000,
  open: false,
  ui: false,
  notify: false,
  ghostMode: false,
  logLevel: 'info',
  logPrefix: 'lt-dev',
};
