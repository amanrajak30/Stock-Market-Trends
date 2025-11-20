const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing MySQL connection...');
  console.log('Host: localhost');
  console.log('Port: 3306');
  console.log('User: root');
  console.log('Password: root');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root'
    });
    
    console.log('\n✓ Connection successful!');
    
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log('MySQL Version:', rows[0].version);
    
    await connection.end();
  } catch (error) {
    console.error('\n✗ Connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nThe password might be incorrect. Try:');
      console.error('1. Check your MySQL password');
      console.error('2. Reset MySQL root password if needed');
    }
  }
}

testConnection();
