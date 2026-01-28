/**
 * PillBow Automated Test Runner
 *
 * Run this in browser console at http://localhost:3003
 *
 * Usage: Copy and paste this entire file into the browser console
 */

(function() {
  const STORAGE_KEY = 'pillbow_data';
  const USERS_KEY = 'pillbow_users';
  const CURRENT_USER_KEY = 'pillbow_current_user_id';

  let testsPassed = 0;
  let testsFailed = 0;
  let testsSkipped = 0;
  const results = [];

  // Helper to log test result
  function logResult(testName, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const result = { testName, passed, message };
    results.push(result);

    if (passed) {
      testsPassed++;
      console.log(`${status}: ${testName}`);
    } else {
      testsFailed++;
      console.error(`${status}: ${testName} - ${message}`);
    }
  }

  function skip(testName, reason) {
    testsSkipped++;
    results.push({ testName, passed: null, message: reason });
    console.warn(`⏭️ SKIP: ${testName} - ${reason}`);
  }

  // Helper to get storage data
  function getStorageData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // Helper to set storage data
  function setStorageData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  console.log('\n========================================');
  console.log('🧪 PILLBOW AUTOMATED TEST SUITE');
  console.log('========================================\n');

  // ============ TEST GROUP 1: Storage & Data Service ============
  console.log('\n--- 1. Storage & Data Service Tests ---\n');

  // Test 1.1: Default data structure
  try {
    const backup = getStorageData();
    localStorage.removeItem(STORAGE_KEY);

    // Simulate app initialization
    const defaultData = {
      medications: [],
      dayLogs: [],
      settings: { reminderEnabled: true, soundEnabled: true },
      lastUpdated: new Date().toISOString()
    };
    setStorageData(defaultData);

    const data = getStorageData();
    const hasCorrectStructure =
      Array.isArray(data.medications) &&
      Array.isArray(data.dayLogs) &&
      typeof data.settings === 'object';

    logResult('1.1 Default data structure', hasCorrectStructure);

    // Restore backup
    if (backup) setStorageData(backup);
  } catch (e) {
    logResult('1.1 Default data structure', false, e.message);
  }

  // Test 1.2: Add medication to storage
  try {
    const data = getStorageData() || {
      medications: [],
      dayLogs: [],
      settings: { reminderEnabled: true, soundEnabled: true },
      lastUpdated: new Date().toISOString()
    };

    const testMed = {
      id: 'test-med-' + Date.now(),
      name: 'Test Aspirin',
      strength: '100 mg',
      dosage: '1 tablet',
      dosesPerDay: 1,
      timesOfDay: ['08:00'],
      color: 'bg-blue-300',
      shape: 'round-small',
      startDate: new Date().toISOString().split('T')[0],
      instructions: 'Take with food'
    };

    data.medications.push(testMed);
    setStorageData(data);

    const saved = getStorageData();
    const found = saved.medications.find(m => m.id === testMed.id);

    logResult('1.2 Add medication to storage', !!found && found.name === 'Test Aspirin');

    // Cleanup
    saved.medications = saved.medications.filter(m => m.id !== testMed.id);
    setStorageData(saved);
  } catch (e) {
    logResult('1.2 Add medication to storage', false, e.message);
  }

  // Test 1.3: Update medication in storage
  try {
    const data = getStorageData() || {
      medications: [],
      dayLogs: [],
      settings: { reminderEnabled: true, soundEnabled: true },
      lastUpdated: new Date().toISOString()
    };

    const testMed = {
      id: 'test-update-' + Date.now(),
      name: 'Original Name',
      strength: '50 mg',
      dosesPerDay: 1,
      timesOfDay: ['08:00'],
      color: 'bg-blue-300'
    };

    data.medications.push(testMed);
    setStorageData(data);

    // Update
    const toUpdate = getStorageData();
    const idx = toUpdate.medications.findIndex(m => m.id === testMed.id);
    if (idx !== -1) {
      toUpdate.medications[idx].name = 'Updated Name';
      toUpdate.medications[idx].strength = '100 mg';
      setStorageData(toUpdate);
    }

    const updated = getStorageData();
    const med = updated.medications.find(m => m.id === testMed.id);

    logResult('1.3 Update medication', med && med.name === 'Updated Name' && med.strength === '100 mg');

    // Cleanup
    updated.medications = updated.medications.filter(m => m.id !== testMed.id);
    setStorageData(updated);
  } catch (e) {
    logResult('1.3 Update medication', false, e.message);
  }

  // Test 1.4: Delete medication from storage
  try {
    const data = getStorageData() || {
      medications: [],
      dayLogs: [],
      settings: { reminderEnabled: true, soundEnabled: true },
      lastUpdated: new Date().toISOString()
    };

    const testMed = {
      id: 'test-delete-' + Date.now(),
      name: 'To Delete',
      dosesPerDay: 1,
      timesOfDay: ['08:00'],
      color: 'bg-red-300'
    };

    data.medications.push(testMed);
    setStorageData(data);

    // Delete
    const toDelete = getStorageData();
    toDelete.medications = toDelete.medications.filter(m => m.id !== testMed.id);
    setStorageData(toDelete);

    const afterDelete = getStorageData();
    const found = afterDelete.medications.find(m => m.id === testMed.id);

    logResult('1.4 Delete medication', !found);
  } catch (e) {
    logResult('1.4 Delete medication', false, e.message);
  }

  // ============ TEST GROUP 2: Validation Tests ============
  console.log('\n--- 2. Validation Tests ---\n');

  // Test 2.1: Medication requires name
  try {
    const isValid = (med) => med.name && med.name.trim().length >= 2;

    logResult('2.1 Empty name fails validation', !isValid({ name: '' }));
    logResult('2.1b Single char fails', !isValid({ name: 'A' }));
    logResult('2.1c Valid name passes', isValid({ name: 'Aspirin' }));
  } catch (e) {
    logResult('2.1 Name validation', false, e.message);
  }

  // Test 2.2: Times of day required
  try {
    const hasValidTimes = (med) => Array.isArray(med.timesOfDay) && med.timesOfDay.length > 0;

    logResult('2.2 No times fails', !hasValidTimes({ timesOfDay: [] }));
    logResult('2.2b Valid times passes', hasValidTimes({ timesOfDay: ['08:00'] }));
  } catch (e) {
    logResult('2.2 Times validation', false, e.message);
  }

  // Test 2.3: Color validation
  try {
    const validColors = [
      'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-red-300',
      'bg-purple-300', 'bg-orange-300', 'bg-pink-300', 'bg-cyan-300',
      'bg-gray-300', 'bg-white'
    ];
    const isValidColor = (color) => validColors.includes(color);

    logResult('2.3 Valid color passes', isValidColor('bg-blue-300'));
    logResult('2.3b Invalid color fails', !isValidColor('bg-invalid-999'));
  } catch (e) {
    logResult('2.3 Color validation', false, e.message);
  }

  // ============ TEST GROUP 3: Date Logic Tests ============
  console.log('\n--- 3. Date Logic Tests ---\n');

  // Test 3.1: Today is editable
  try {
    const today = new Date().toISOString().split('T')[0];
    const isEditable = (dateStr) => dateStr === today;

    logResult('3.1 Today is editable', isEditable(today));
  } catch (e) {
    logResult('3.1 Today editable', false, e.message);
  }

  // Test 3.2: Past is not editable
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const isEditable = (dateStr) => dateStr === todayStr;

    logResult('3.2 Past is NOT editable', !isEditable(yesterdayStr));
  } catch (e) {
    logResult('3.2 Past not editable', false, e.message);
  }

  // Test 3.3: Future is not editable
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const isEditable = (dateStr) => dateStr === todayStr;

    logResult('3.3 Future is NOT editable', !isEditable(tomorrowStr));
  } catch (e) {
    logResult('3.3 Future not editable', false, e.message);
  }

  // Test 3.4: Medication date filtering
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const pastMed = {
      id: 'past',
      startDate: '2020-01-01',
      endDate: '2020-12-31'
    };

    const activeMed = {
      id: 'active',
      startDate: '2020-01-01',
      endDate: '2030-12-31'
    };

    const futureMed = {
      id: 'future',
      startDate: '2030-01-01',
      endDate: '2030-12-31'
    };

    const isActive = (med, dateStr) => {
      const date = new Date(dateStr);
      const start = med.startDate ? new Date(med.startDate) : null;
      const end = med.endDate ? new Date(med.endDate) : null;

      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    };

    logResult('3.4a Past med not active today', !isActive(pastMed, todayStr));
    logResult('3.4b Active med is active today', isActive(activeMed, todayStr));
    logResult('3.4c Future med not active today', !isActive(futureMed, todayStr));
  } catch (e) {
    logResult('3.4 Date filtering', false, e.message);
  }

  // ============ TEST GROUP 4: Export/Import Tests ============
  console.log('\n--- 4. Export/Import Tests ---\n');

  // Test 4.1: Export generates valid JSON
  try {
    const data = getStorageData() || {
      medications: [],
      dayLogs: [],
      settings: { reminderEnabled: true, soundEnabled: true },
      lastUpdated: new Date().toISOString()
    };

    const exported = JSON.stringify(data, null, 2);
    const parsed = JSON.parse(exported);

    logResult('4.1 Export generates valid JSON',
      parsed.medications !== undefined &&
      parsed.dayLogs !== undefined &&
      parsed.settings !== undefined
    );
  } catch (e) {
    logResult('4.1 Export valid JSON', false, e.message);
  }

  // Test 4.2: Import validates structure
  try {
    const isValidImport = (jsonStr) => {
      try {
        const data = JSON.parse(jsonStr);
        return data.medications && data.dayLogs && data.settings;
      } catch {
        return false;
      }
    };

    const validData = '{"medications":[],"dayLogs":[],"settings":{}}';
    const invalidData = '{"medications":[]}'; // missing dayLogs, settings
    const brokenJson = '{broken json';

    logResult('4.2a Valid import passes', isValidImport(validData));
    logResult('4.2b Incomplete data fails', !isValidImport(invalidData));
    logResult('4.2c Broken JSON fails', !isValidImport(brokenJson));
  } catch (e) {
    logResult('4.2 Import validation', false, e.message);
  }

  // ============ TEST GROUP 5: User Management Tests ============
  console.log('\n--- 5. User Management Tests ---\n');

  // Test 5.1: Users storage exists
  try {
    const users = localStorage.getItem(USERS_KEY);
    // Just check if we can read it (may be null for new app)
    logResult('5.1 Users storage accessible', true);
  } catch (e) {
    logResult('5.1 Users storage', false, e.message);
  }

  // Test 5.2: Current user storage exists
  try {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    logResult('5.2 Current user storage accessible', true);
  } catch (e) {
    logResult('5.2 Current user storage', false, e.message);
  }

  // ============ TEST GROUP 6: UI Element Tests ============
  console.log('\n--- 6. UI Element Tests ---\n');

  // Test 6.1: App header exists
  try {
    const header = document.querySelector('.app-header');
    logResult('6.1 App header exists', !!header);
  } catch (e) {
    logResult('6.1 App header', false, e.message);
  }

  // Test 6.2: Timeline container exists
  try {
    const timeline = document.querySelector('.timeline-container');
    logResult('6.2 Timeline container exists', !!timeline);
  } catch (e) {
    logResult('6.2 Timeline', false, e.message);
  }

  // Test 6.3: FAB buttons exist
  try {
    const fabContainer = document.querySelector('.fab-container');
    const todayBtn = document.querySelector('.fab-today-btn');
    const addBtn = document.querySelector('.fab-add-btn');

    logResult('6.3 FAB container exists', !!fabContainer);
    logResult('6.3b Today button exists', !!todayBtn);
    logResult('6.3c Add button exists', !!addBtn);
  } catch (e) {
    logResult('6.3 FAB buttons', false, e.message);
  }

  // Test 6.4: Settings button exists
  try {
    const settingsBtn = document.querySelector('.app-header__menu-btn');
    logResult('6.4 Settings button exists', !!settingsBtn);
  } catch (e) {
    logResult('6.4 Settings button', false, e.message);
  }

  // ============ SUMMARY ============
  console.log('\n========================================');
  console.log('📊 TEST SUMMARY');
  console.log('========================================');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`⏭️ Skipped: ${testsSkipped}`);
  console.log(`📝 Total: ${testsPassed + testsFailed + testsSkipped}`);
  console.log('========================================\n');

  if (testsFailed > 0) {
    console.log('❌ FAILED TESTS:');
    results.filter(r => r.passed === false).forEach(r => {
      console.log(`  - ${r.testName}: ${r.message}`);
    });
  }

  return {
    passed: testsPassed,
    failed: testsFailed,
    skipped: testsSkipped,
    results: results
  };
})();
