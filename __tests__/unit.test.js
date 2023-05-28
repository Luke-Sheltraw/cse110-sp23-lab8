// unit.test.js

const functions = require('../code-to-unit-test/unit-test-me.js');

describe('isPhoneNumber', () => {
	test('Valid: basic phone number', () => {
		expect(functions.isPhoneNumber('(123) 123-1234')).toBe(true);
	});

	test('Valid: no area code', () => {
		expect(functions.isPhoneNumber('510-5666')).toBe(true);
	});

	test('Invalid: too few digits', () => {
		expect(functions.isPhoneNumber('150')).toBe(false);
	});

	test('Invalid: no separators', () => {
		expect(functions.isPhoneNumber('1231231234')).toBe(false);
	});
});

describe('isEmail', () => {
	test('Valid: basic emaill address', () => {
		expect(functions.isEmail('myname@gmail.com')).toBe(true);
	});

	test('Valid: more characters and two character TLD', () => {
		expect(functions.isEmail('address123_name@site.co')).toBe(true);
	});

	test('Invalid: no address before @', () => {
		expect(functions.isEmail('@gmail.com')).toBe(false);
	});

	test('Invalid: missing TLD after domain', () => {
		expect(functions.isEmail('myname@gmail')).toBe(false);
	});
});

describe('isStrongPassword', () => {
	test('Valid: basic example', () => {
		expect(functions.isStrongPassword('a123_1')).toBe(true);
	});

	test('Valid: full 15 character length', () => {
		expect(functions.isStrongPassword('a234_a234_a234_')).toBe(true);
	});

	test('Invalid: doesnt start with letter', () => {
		expect(functions.isStrongPassword('1234__123')).toBe(false);
	});

	test('Invalid: too short', () => {
		expect(functions.isStrongPassword('a12')).toBe(false);
	});
});

describe('isDate', () => {
	test('Valid: basic date', () => {
		expect(functions.isDate('06/25/2003')).toBe(true);
	});

	test('Valid: one digit day and month', () => {
		expect(functions.isDate('1/1/1999')).toBe(true);
	});

	test('Invalid: too many digits in day and month', () => {
		expect(functions.isDate('123/321/4555')).toBe(false);
	});

	test('Invalid: too few digits in year', () => {
		expect(functions.isDate('06/25/20031')).toBe(false);
	});
});

describe('isHexColor', () => {
	test('Valid: greenish hexcode uppercase with #', () => {
		expect(functions.isHexColor('#29BB2F')).toBe(true);
	});

	test('Valid: pinkish hexcode lowercase without #', () => {
		expect(functions.isHexColor('db2379')).toBe(true);
	});

	test('Invalid: other letters', () => {
		expect(functions.isHexColor('29BB2Z')).toBe(false);
	});

	test('Invalid: four character length plus #', () => {
		expect(functions.isHexColor('#aa12')).toBe(false);
	});
});