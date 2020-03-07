export const puppetOptions = {
    headless: false,
    slowMo: 200, // maybe needed?
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--timeout=30000',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      "--proxy-server='direct://'",
      '--proxy-bypass-list=*',
      '--deterministic-fetch',
    ],
  };