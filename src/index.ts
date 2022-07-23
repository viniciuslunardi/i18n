import 'dotenv/config';

import Application from './application/application';

(async () => {
    const app = new Application()
    await app.init();
})();