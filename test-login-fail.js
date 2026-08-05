const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:3000/login');
    
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.content();
    if (html.includes('Incorrect email or password') || html.includes('Login failed')) {
      console.log('SUCCESS: Error toast appeared!');
    } else {
      console.log('FAIL: No error toast found!');
    }
    
    console.log('Current URL:', page.url());
    
    await browser.close();
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
