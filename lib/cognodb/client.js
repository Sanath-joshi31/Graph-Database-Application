import neo4j from 'neo4j-driver';

// Cache driver instance across hot reloads in development
let driverInstance = null;

/**
 * Gets or initializes the official Neo4j Bolt driver for CognoDB
 * @returns {import('neo4j-driver').Driver | null}
 */
export function getDriver() {
  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME || 'cognodb';
  const password = process.env.COGNODB_PASSWORD;

  // Return null if credentials are not configured
  if (!uri || !password) {
    return null;
  }

  if (!driverInstance) {
    try {
      driverInstance = neo4j.driver(
        uri,
        neo4j.auth.basic(username, password),
        {
          maxConnectionPoolSize: 50,
          connectionTimeout: 5000, // 5 seconds
          maxTransactionRetryTime: 10000,
          disableLosslessIntegers: true, // Auto-convert Neo4j Integers to JS numbers
        }
      );
    } catch (error) {
      console.error('[CognoDB Driver] Initialization error:', error.message);
      driverInstance = null;
    }
  }

  return driverInstance;
}

/**
 * Check connectivity and health of the CognoDB graph database
 * @returns {Promise<{ isConnected: boolean, latencyMs: number, error?: string, databaseInfo?: string }>}
 */
export async function checkDatabaseHealth() {
  const driver = getDriver();
  if (!driver) {
    return {
      isConnected: false,
      latencyMs: 0,
      error: 'CognoDB environment variables (COGNODB_URI, COGNODB_PASSWORD) are not configured. Running in Mock Fallback Mode.',
    };
  }

  const startTime = Date.now();
  const session = driver.session();
  try {
    const result = await session.run('CALL dbms.components() YIELD name, versions, edition RETURN name, versions[0] AS version, edition');
    const latencyMs = Date.now() - startTime;
    
    let info = 'CognoDB Connected';
    if (result.records.length > 0) {
      const record = result.records[0];
      info = `${record.get('name')} ${record.get('version')} (${record.get('edition')})`;
    }

    return {
      isConnected: true,
      latencyMs,
      databaseInfo: info,
    };
  } catch (err) {
    // Fallback simple ping query if dbms.components is restricted
    try {
      await session.run('RETURN 1 AS ping');
      return {
        isConnected: true,
        latencyMs: Date.now() - startTime,
        databaseInfo: 'CognoDB OpenCypher Engine',
      };
    } catch (fallbackErr) {
      return {
        isConnected: false,
        latencyMs: Date.now() - startTime,
        error: fallbackErr.message || 'Failed to connect to CognoDB Bolt endpoint',
      };
    }
  } finally {
    await session.close();
  }
}

/**
 * Execute a parameterized Cypher query against CognoDB
 * @param {string} cypher - Parameterized Cypher query string
 * @param {Record<string, any>} params - Query parameters object
 * @returns {Promise<import('neo4j-driver').QueryResult>}
 */
export async function runQuery(cypher, params = {}) {
  const driver = getDriver();
  if (!driver) {
    throw new Error('CognoDB driver not initialized. Check COGNODB_URI and COGNODB_PASSWORD env variables.');
  }

  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result;
  } finally {
    await session.close();
  }
}

/**
 * Gracefully close the CognoDB driver connection
 */
export async function closeDriver() {
  if (driverInstance) {
    await driverInstance.close();
    driverInstance = null;
  }
}
