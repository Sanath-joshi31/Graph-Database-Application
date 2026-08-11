import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

// Load environment variables from .env or .env.local
dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  console.log('\n======================================================');
  console.log('  🚀 PathGraph — CognoDB Cypher Seeding Pipeline');
  console.log('======================================================\n');

  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME || 'cognodb';
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !password) {
    console.error('❌ Error: Missing CognoDB connection environment variables!');
    console.error('Please configure COGNODB_URI and COGNODB_PASSWORD in your .env file.');
    console.error('Example:\n  COGNODB_URI=bolt+s://your-instance.cognoDB.cloud:7687\n  COGNODB_PASSWORD=your_password\n');
    process.exit(1);
  }

  console.log(`📡 Connecting to CognoDB at: ${uri} (user: ${username})...`);
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

  const session = driver.session();

  try {
    // 1. Check Connectivity
    console.log('🔍 Verifying database connectivity...');
    const pingResult = await session.run('RETURN 1 AS ping');
    if (pingResult.records.length > 0) {
      console.log('✅ Connection to CognoDB Bolt server verified successfully!\n');
    }

    // 2. Read and apply schema constraints
    const schemaPath = path.join(rootDir, 'cypher', 'schema.cypher');
    console.log(`📄 Reading schema definitions from: ${schemaPath}`);
    const schemaCypher = fs.readFileSync(schemaPath, 'utf8');

    // Split schema statements by semicolon
    const schemaStatements = schemaCypher
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('//'));

    console.log(`⚙️ Executing ${schemaStatements.length} schema constraints & indexes...`);
    for (const stmt of schemaStatements) {
      try {
        await session.run(stmt);
      } catch (stmtErr) {
        // Log constraint notice if constraint already exists
        console.warn(`  ⚠️ Schema warning: ${stmtErr.message}`);
      }
    }
    console.log('✅ Schema constraints applied.\n');

    // 3. Read and execute seed data
    const seedPath = path.join(rootDir, 'cypher', 'seed.cypher');
    console.log(`🌱 Reading seed dataset from: ${seedPath}`);
    const seedCypher = fs.readFileSync(seedPath, 'utf8');

    const seedStatements = seedCypher
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('//'));

    console.log(`📦 Executing ${seedStatements.length} Cypher MERGE transactions...`);
    let count = 0;
    for (const stmt of seedStatements) {
      count++;
      await session.run(stmt);
      if (count % 5 === 0 || count === seedStatements.length) {
        console.log(`   [${count}/${seedStatements.length}] Statements executed...`);
      }
    }

    console.log('\n======================================================');
    console.log('✅ CognoDB Database Seeding Completed Successfully!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ Seeding Failed with Error:', error);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
