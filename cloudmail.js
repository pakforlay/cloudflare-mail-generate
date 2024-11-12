/*
Masss Automate Generate Custom email/mail routing cloudflare by @potaldogg
*/


import fetch from 'node-fetch';
import readline from 'readline';
import { faker } from '@faker-js/faker';
import fs from 'fs';

const cloudflareApiKey = '#######'; // API KEY
const cloudflareEmail = '#######'; // EMAIL AKUN CLOUDFLARE, BUKAN EMAIL DESTINASI
const domain = '#########'; // CUSTOM DOMAIN, WAJIB DOMAIN YANG KALIAN DAFTARIN DI CLOUDFLARE NYA
const zoneId = '########'; // Zone ID Anda

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateRandomEmail() {
  const firstName = faker.name.firstName();
  const lastNameName = faker.name.lastName();
  const number = Math.floor(Math.random() * 1000); 
  return `${firstName}${lastNameName}${number}@${domain}`;
}

async function createCustomEmail(address, destination) {
  try {
    const requestBody = {
      enabled: true,
      name: `Rule created at ${new Date().toISOString()}`,
      actions: [
        {
          type: 'forward',
          value: [destination]
        }
      ],
      matchers: [
        {
          type: 'literal',
          field: 'to',
          value: address
        }
      ]
    };

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/email/routing/rules`, {
      method: 'POST',
      headers: {
        'X-Auth-Email': cloudflareEmail,
        'X-Auth-Key': cloudflareApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.success) {
      console.log(`Email rule for address ${address} successfully created!`);
      return address;
    } else {
      console.error('Failed to create email rule:', data.errors);
      return null;
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    return null;
  }
}

console.log(`\nAuto Generate Custom Mail Routing Cloudflare by @potaldogg\n`)
rl.question('Masukan email utama (destinasi) yang sudah terverifikasi di Cloudflare : ', (destination) => {
  rl.question('Masukan jumlah email yang akan di generate : ', (num) => {
    const numberOfEmails = parseInt(num);
    const emailAddresses = Array.from({ length: numberOfEmails }, () => generateRandomEmail());
    const successfulEmails = [];

    async function main() {
      for (const address of emailAddresses) {
        const result = await createCustomEmail(address, destination);
        if (result) {
          successfulEmails.push(result);
        }
      }

      fs.writeFile('generate_mail.txt', successfulEmails.join('\n'), (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Berhasil generate, email tersimpan di file generate_mail.txt');
        }
        rl.close();
      });
    }

    main();
  });
});
