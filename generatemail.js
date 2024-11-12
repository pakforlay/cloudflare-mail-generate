import readline from 'readline';
import { faker } from '@faker-js/faker';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateRandomEmail(firstName, lastName, domain) {
  const number = Math.floor(Math.random() * 100000); // Angka acak hingga 5 digit
  return `${firstName}${lastName}${number}@${domain}`.toLowerCase();
}

function generatePassword(length) {
  const passwordParts = [];
  for (let i = 0; i < length; i++) {
    passwordParts.push(faker.internet.password(2));
  }
  return passwordParts.join(':');
}

rl.question('Masukkan jumlah address (nama dan angka 5 digit) email yang ingin di generate: ', (numAddresses) => {
  const numberOfAddresses = parseInt(numAddresses);
  
  rl.question('Masukkan nama domain: ', (domain) => {
    rl.question('Apakah ingin menambahkan password otomatis? (iya/tidak): ', (addPassword) => {
      if (addPassword.toLowerCase() === 'iya') {
        rl.question('Masukkan panjang password: ', (passwordLength) => {
          const length = parseInt(passwordLength);
          
          const emails = [];
          for (let i = 0; i < numberOfAddresses; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const email = generateRandomEmail(firstName, lastName, domain);
            const password = generatePassword(length);
            emails.push(`${email}:${password}`);
          }

          fs.writeFile('generated_emails.txt', emails.join('\n'), (err) => {
            if (err) {
              console.error('Error writing to file:', err);
            } else {
              console.log('Successfully written to generated_emails.txt');
            }
            rl.close();
          });
        });
      } else {
        const emails = [];
        for (let i = 0; i < numberOfAddresses; i++) {
          const firstName = faker.name.firstName();
          const lastName = faker.name.lastName();
          const email = generateRandomEmail(firstName, lastName, domain);
          emails.push(email);
        }

        fs.writeFile('generated_emails.txt', emails.join('\n'), (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          } else {
            console.log('Successfully written to generated_emails.txt');
          }
          rl.close();
        });
      }
    });
  });
});
