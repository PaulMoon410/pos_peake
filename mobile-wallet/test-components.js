/**
 * Simple test runner for PeakeCoin V4V components
 * Run this to verify all services and screens are working
 */

// Test V4VService
console.log('🧪 Testing V4VService...');
try {
  const { V4VService } = require('./src/services/V4VService');
  const v4vService = new V4VService();
  
  // Test basic functionality
  const mockContent = {
    id: 'test-content',
    creator: 'test-creator',
    title: 'Test Content',
    type: 'podcast',
    duration: 1800, // 30 minutes
    suggestedRate: 0.1
  };
  
  console.log('✅ V4VService imported successfully');
  console.log('✅ Mock content created');
  
  // Test rate calculation
  const recommendedRate = v4vService.getRecommendedRate(mockContent);
  console.log(`✅ Recommended rate: ${recommendedRate} PEAK/min`);
  
  // Test content discovery
  v4vService.discoverContent().then(content => {
    console.log(`✅ Discovered ${content.length} content items`);
    content.forEach(item => {
      console.log(`   - ${item.title} by @${item.creator}`);
    });
  }).catch(err => {
    console.log('❌ Content discovery failed:', err.message);
  });
  
} catch (error) {
  console.log('❌ V4VService test failed:', error.message);
}

// Test WalletService import
console.log('\n🧪 Testing WalletService...');
try {
  const WalletService = require('./src/services/WalletService');
  const walletService = new WalletService.default || new WalletService();
  console.log('✅ WalletService imported successfully');
} catch (error) {
  console.log('❌ WalletService test failed:', error.message);
}

// Test PriceService
console.log('\n🧪 Testing PriceService...');
try {
  const PriceService = require('./src/services/PriceService');
  const priceService = PriceService.default || PriceService;
  console.log('✅ PriceService imported successfully');
} catch (error) {
  console.log('❌ PriceService test failed:', error.message);
}

// Test HiveEngineService
console.log('\n🧪 Testing HiveEngineService...');
try {
  const { HiveEngineService } = require('./src/services/HiveEngineService');
  const hiveService = new HiveEngineService();
  console.log('✅ HiveEngineService imported successfully');
} catch (error) {
  console.log('❌ HiveEngineService test failed:', error.message);
}

// Test screen imports (basic syntax check)
console.log('\n🧪 Testing Screen Components...');

const screens = [
  'WalletScreen.tsx',
  'ScannerScreen.tsx', 
  'StoreLocatorScreen.tsx',
  'CreatorDashboardScreen.tsx',
  'ContentDiscoveryScreen.tsx',
  'V4VPlayerScreen.tsx'
];

screens.forEach(screen => {
  try {
    const fs = require('fs');
    const path = `./src/screens/${screen}`;
    
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8');
      
      // Basic syntax checks
      if (content.includes('export default')) {
        console.log(`✅ ${screen} - properly exported`);
      } else {
        console.log(`⚠️  ${screen} - missing default export`);
      }
      
      if (content.includes('import React')) {
        console.log(`✅ ${screen} - React imported`);
      } else {
        console.log(`⚠️  ${screen} - React import issue`);
      }
      
    } else {
      console.log(`❌ ${screen} - file not found`);
    }
  } catch (error) {
    console.log(`❌ ${screen} - error: ${error.message}`);
  }
});

// Test package.json dependencies
console.log('\n🧪 Testing Dependencies...');
try {
  const packageJson = require('./package.json');
  
  const requiredDeps = [
    'react',
    'react-native',
    '@hiveio/hive-js',
    'hive-engine',
    'react-native-chart-kit',
    '@react-navigation/native',
    '@react-navigation/stack',
    '@react-navigation/bottom-tabs'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - missing`);
    }
  });
  
} catch (error) {
  console.log('❌ Package.json test failed:', error.message);
}

console.log('\n🎯 Test Summary:');
console.log('==============');
console.log('✅ = Working correctly');
console.log('⚠️  = Warning/needs attention'); 
console.log('❌ = Error/missing');
console.log('\nIf you see mostly ✅, you\'re ready to run the app!');
console.log('Run: npm run android (or setup-test.bat for guided setup)');

// Performance tip
console.log('\n💡 Development Tips:');
console.log('- Use Android emulator for rapid testing');
console.log('- Enable debugging with: npx react-native start');
console.log('- Check Chrome DevTools at chrome://inspect');
console.log('- Monitor Metro bundler logs for errors');
console.log('- Test on real device before merchant demos');
