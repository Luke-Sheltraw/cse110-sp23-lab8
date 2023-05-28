describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('https://cse110-f2021.github.io/Lab8_Website');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    const prodItems = await page.$$('product-item');
    const results = await Promise.all(prodItems.map(async (item, i) => {
        console.log(`Checking product item ${i + 1}/${prodItems.length}`);
        // Grab the .data property of <product-items> to grab all of the json data stored inside
        const data = await item.getProperty('data');
        const plainValue = await data.jsonValue();
        // Make sure the title, price, and image are populated in the JSON
        if (plainValue.title.length === 0) { return false; }
        if (plainValue.price.length === 0) { return false; }
        if (plainValue.image.length === 0) { return false; }
        return true;
    }));
    const allArePopulated = !results.some((bool) => bool === false);
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const button = await page.$('product-item >>> button');
    await button.click();
    const text = await button.getProperty('innerText')
      .then((t) => t.jsonValue());
    expect(text).toBe('Remove from Cart');
    await button.click(); // reset state
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    const buttons = await page.$$('product-item >>> button');
    await Promise.all(buttons.map(async (button) => {
      button.evaluate((b) => b.click());
    }));
    const cartCount = await page.$('#cart-count')
      .then((c) => c.getProperty('innerText'))
      .then((t) => t.jsonValue());
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const buttons = await page.$$('product-item >>> button');
    const buttonTexts = await Promise.all(buttons.map(async (button) => {
      return button.getProperty('innerText')
        .then((t) => t.jsonValue());
    }));
    const allRemove = buttonTexts.every((text) => text === 'Remove from Cart');
    const cartCount = await page.$('#cart-count')
      .then((c) => c.getProperty('innerText'))
      .then((t) => t.jsonValue());
    expect(allRemove).toBe(true);
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    const localCart = await page.evaluate(() => window.localStorage.getItem('cart'));
    expect(localCart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    const buttons = await page.$$('product-item >>> button');
    await Promise.all(buttons.map(async (button) => {
      button.evaluate((b) => b.click());
    }));
    const cartCount = await page.$('#cart-count')
      .then((c) => c.getProperty('innerText'))
      .then((t) => t.jsonValue());
    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const buttons = await page.$$('product-item >>> button');
    const buttonTexts = await Promise.all(buttons.map(async (button) => {
      return button.getProperty('innerText')
        .then((t) => t.jsonValue());
    }));
    const allRemove = buttonTexts.every((text) => text === 'Add to Cart');
    const cartCount = await page.$('#cart-count')
      .then((c) => c.getProperty('innerText'))
      .then((t) => t.jsonValue());
    expect(allRemove).toBe(true);
    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const localCart = await page.evaluate(() => window.localStorage.getItem('cart'));
    expect(localCart).toBe('[]');
  });
});
