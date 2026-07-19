const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

describe('main.js', function() {

  describe('server startup', function() {

    it('listens for connections on the provided PORT', function(done) {
      this.timeout(5000);

      const port = 8123;
      const serverProcess = spawn('node', [path.join(__dirname, '../main.js')], {
        env: Object.assign({}, process.env, { PORT: port }),
      });

      let finished = false;
      const timeoutId = setTimeout(() => {
        finish(new Error('server never started listening'));
      }, 4500);

      function finish(err) {
        if (finished) return;
        finished = true;
        clearTimeout(timeoutId);
        serverProcess.kill();
        done(err);
      }

      function tryConnect() {
        if (finished) return;
        const req = http.get(`http://localhost:${port}/`, () => {
          finish();
        });
        req.on('error', () => {
          if (!finished) setTimeout(tryConnect, 50);
        });
      }

      tryConnect();
    });

  });

});
