#!/usr/bin/env node

/**
 * Test script for Hive Engine integration
 * Run with: node test-scripts/test-hive-engine.js
 */

const axios = require('axios');
const { Client } = require('@hiveio/hive-js');

// Configuration
const HIVE_NODE = 'https://api.hive.blog';
const HIVE_ENGINE_API = 'https://api.hive-engine.com/rpc';
const TEST_ACCOUNT = process.env.TEST_ACCOUNT_NAME || 'peakcoin-test';

console.log('🧪 Testing PeakeCoin Hive Engine Integration\n');

async function testHiveConnection() {
  console.log('1. Testing Hive blockchain connection...');
  
  try {
    const client = new Client([HIVE_NODE]);
    const props = await client.database.getDynamicGlobalProperties();
    
    console.log(`✅ Connected to Hive blockchain`);
    console.log(`   Block: ${props.head_block_number}`);
    console.log(`   Witnesses: ${props.num_pow_witnesses}\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Hive connection failed:', error.message);
    return false;
  }
}

async function testHiveEngineAPI() {
  console.log('2. Testing Hive Engine API...');
  
  try {
    const response = await axios.post(HIVE_ENGINE_API, {
      jsonrpc: '2.0',
      method: 'findOne',
      params: {
        contract: 'tokens',
        table: 'tokens',
        query: { symbol: 'PEAK' }
      },
      id: 1
    });
    
    if (response.data.result) {
      const token = response.data.result;
      console.log(`✅ PEAK token found on Hive Engine`);
      console.log(`   Name: ${token.name}`);
      console.log(`   Symbol: ${token.symbol}`);
      console.log(`   Supply: ${token.supply}`);
      console.log(`   Max Supply: ${token.maxSupply}\n`);
      return true;
    } else {
      console.log('⚠️  PEAK token not found on Hive Engine');
      console.log('   This might be expected for a new token\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Hive Engine API failed:', error.message);
    return false;
  }
}

async function testAccountBalance() {
  console.log('3. Testing account balance query...');
  
  try {
    const response = await axios.post(HIVE_ENGINE_API, {
      jsonrpc: '2.0',
      method: 'find',
      params: {
        contract: 'tokens',
        table: 'balances',
        query: {
          account: TEST_ACCOUNT,
          symbol: 'PEAK'
        }
      },
      id: 1
    });
    
    if (response.data.result && response.data.result.length > 0) {
      const balance = response.data.result[0];
      console.log(`✅ Balance found for @${TEST_ACCOUNT}`);
      console.log(`   PEAK Balance: ${balance.balance}`);
      console.log(`   Staked: ${balance.stake || '0'}\n`);
    } else {
      console.log(`ℹ️  No PEAK balance found for @${TEST_ACCOUNT}`);
      console.log('   This is normal for accounts without PEAK tokens\n');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Balance query failed:', error.message);
    return false;
  }
}

async function testMarketData() {
  console.log('4. Testing market data...');
  
  try {
    const response = await axios.post(HIVE_ENGINE_API, {
      jsonrpc: '2.0',
      method: 'find',
      params: {
        contract: 'market',
        table: 'metrics',
        query: { symbol: 'PEAK' }
      },
      id: 1
    });
    
    if (response.data.result && response.data.result.length > 0) {
      const market = response.data.result[0];
      console.log(`✅ Market data found for PEAK`);
      console.log(`   Last Price: ${market.lastPrice} HIVE`);
      console.log(`   Volume: ${market.volume}`);
      console.log(`   Price Change: ${market.priceChangePercent}%\n`);
    } else {
      console.log('ℹ️  No market data found for PEAK');
      console.log('   This is normal if PEAK is not yet trading\n');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Market data query failed:', error.message);
    return false;
  }
}

async function testHivePrice() {
  console.log('5. Testing HIVE price feed...');
  
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd'
    );
    
    const hivePrice = response.data.hive.usd;
    console.log(`✅ HIVE price: $${hivePrice}\n`);
    
    return hivePrice;
  } catch (error) {
    console.error('❌ HIVE price query failed:', error.message);
    return 0.3; // Fallback price
  }
}

async function testTransactionHistory() {
  console.log('6. Testing transaction history...');
  
  try {
    const client = new Client([HIVE_NODE]);
    const history = await client.database.getAccountHistory(TEST_ACCOUNT, -1, 10);
    
    const hiveEngineOps = history.filter(([, tx]) => {
      return tx.op[0] === 'custom_json' && tx.op[1].id === 'ssc-mainnet-hive';
    });
    
    console.log(`✅ Found ${hiveEngineOps.length} Hive Engine operations`);
    console.log(`   Total operations: ${history.length}\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Transaction history failed:', error.message);
    return false;
  }
}

async function generateTestQR() {
  console.log('7. Generating test QR code...');
  
  const testPayment = {
    type: 'hive_engine_payment',
    symbol: 'PEAK',
    to: 'test-merchant',
    amount: '5.0000',
    memo: 'Test coffee purchase - $5.50',
    timestamp: new Date().toISOString()
  };
  
  console.log('✅ Test QR code data:');
  console.log(JSON.stringify(testPayment, null, 2));
  console.log('\nℹ️  Use this data to test QR code scanning\n');
  
  return testPayment;
}

async function runAllTests() {
  console.log('🚀 Starting PeakeCoin integration tests...\n');
  
  const results = {
    hiveConnection: false,
    hiveEngineAPI: false,
    accountBalance: false,
    marketData: false,
    hivePrice: false,
    transactionHistory: false
  };
  
  // Run tests
  results.hiveConnection = await testHiveConnection();
  results.hiveEngineAPI = await testHiveEngineAPI();
  results.accountBalance = await testAccountBalance();
  results.marketData = await testMarketData();
  results.hivePrice = await testHivePrice();
  results.transactionHistory = await testTransactionHistory();
  
  // Generate test data
  await generateTestQR();
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${test}`);
  });
  
  console.log(`\n🎯 Tests passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your integration is ready.');
  } else if (passed >= total * 0.5) {
    console.log('⚠️  Some tests failed, but core functionality works.');
  } else {
    console.log('🚨 Multiple tests failed. Check your configuration.');
  }
  
  console.log('\n💡 Next steps:');
  console.log('1. Run the mobile app: npm start');
  console.log('2. Test on device: npx react-native run-android');
  console.log('3. Try QR code scanning with the generated test data');
  console.log('4. Check payment gateway: cd ../payment-gateway && npm start');
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHiveConnection,
  testHiveEngineAPI,
  testAccountBalance,
  testMarketData,
  testHivePrice,
  generateTestQR
};
