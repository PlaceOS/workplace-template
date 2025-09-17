#!/usr/bin/env node

/**
 * Verification script for Angular CLI setup
 * This script tests that Angular CLI can be used without Nx for the workplace app
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Angular CLI Setup for Workplace App\n');

const tests = [
    {
        name: 'Angular CLI Binary Exists',
        test: () => {
            const ngPath = path.join(__dirname, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
            if (!fs.existsSync(ngPath)) {
                throw new Error(`Angular CLI binary not found at ${ngPath}`);
            }
            console.log(`  ✅ Found Angular CLI at ${ngPath}`);
        }
    },
    {
        name: 'angular.json Configuration',
        test: () => {
            const angularJsonPath = path.join(__dirname, 'angular.json');
            if (!fs.existsSync(angularJsonPath)) {
                throw new Error('angular.json file not found');
            }

            const config = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));

            if (!config.projects.workplace) {
                throw new Error('Workplace project not configured in angular.json');
            }

            const workplaceConfig = config.projects.workplace;

            // Check required configurations
            const requiredTargets = ['build', 'serve', 'test', 'lint'];
            for (const target of requiredTargets) {
                if (!workplaceConfig.architect[target]) {
                    throw new Error(`Missing ${target} configuration for workplace project`);
                }
            }

            console.log('  ✅ angular.json properly configured for workplace project');
            console.log(`  ✅ Found targets: ${Object.keys(workplaceConfig.architect).join(', ')}`);
        }
    },
    {
        name: 'TypeScript Configuration',
        test: () => {
            const tsconfigPath = path.join(__dirname, 'tsconfig.json');
            if (!fs.existsSync(tsconfigPath)) {
                throw new Error('Root tsconfig.json not found');
            }

            const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

            // Check path mappings for libs
            if (!tsconfig.compilerOptions.paths) {
                throw new Error('Path mappings not found in tsconfig.json');
            }

            const expectedPaths = [
                '@placeos/common',
                '@placeos/components',
                '@placeos/bookings'
            ];

            for (const expectedPath of expectedPaths) {
                if (!tsconfig.compilerOptions.paths[expectedPath]) {
                    throw new Error(`Missing path mapping for ${expectedPath}`);
                }
            }

            console.log('  ✅ TypeScript configuration includes library path mappings');
            console.log(`  ✅ Found ${Object.keys(tsconfig.compilerOptions.paths).length} path mappings`);
        }
    },
    {
        name: 'Required Files Exist',
        test: () => {
            const requiredFiles = [
                'apps/workplace/src/main.ts',
                'apps/workplace/src/index.html',
                'apps/workplace/tsconfig.app.json',
                'config/proxy.conf.js',
                'apps/workplace/ngsw-config.json'
            ];

            for (const file of requiredFiles) {
                const filePath = path.join(__dirname, file);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`Required file not found: ${file}`);
                }
            }

            console.log('  ✅ All required files exist');
        }
    },
    {
        name: 'Angular CLI Version Check',
        test: () => {
            const cmd = 'node node_modules/@angular/cli/bin/ng.js version';
            const output = execSync(cmd, { cwd: __dirname, encoding: 'utf8' });

            if (!output.includes('Angular CLI:')) {
                throw new Error('Angular CLI version command failed');
            }

            const cliVersionMatch = output.match(/Angular CLI: ([\d.]+)/);
            if (cliVersionMatch) {
                console.log(`  ✅ Angular CLI version: ${cliVersionMatch[1]}`);
            }

            const angularVersionMatch = output.match(/Angular: ([\d.]+)/);
            if (angularVersionMatch) {
                console.log(`  ✅ Angular framework version: ${angularVersionMatch[1]}`);
            }
        }
    },
    {
        name: 'Project Recognition',
        test: () => {
            const cmd = 'node node_modules/@angular/cli/bin/ng.js build workplace --help';
            const output = execSync(cmd, { cwd: __dirname, encoding: 'utf8' });

            if (!output.includes('workplace')) {
                throw new Error('Angular CLI does not recognize workplace project');
            }

            console.log('  ✅ Angular CLI recognizes workplace project');
        }
    },
    {
        name: 'NPM Scripts',
        test: () => {
            const packageJsonPath = path.join(__dirname, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            const requiredScripts = [
                'ng:start',
                'ng:build',
                'ng:build:prod',
                'ng:test',
                'ng:version'
            ];

            for (const script of requiredScripts) {
                if (!packageJson.scripts[script]) {
                    throw new Error(`Missing npm script: ${script}`);
                }
            }

            console.log('  ✅ All Angular CLI npm scripts are configured');
            console.log(`  ✅ Available scripts: ${requiredScripts.join(', ')}`);
        }
    },
    {
        name: 'TypeScript Compilation Check',
        test: () => {
            try {
                const cmd = 'npx tsc --noEmit --project apps/workplace/tsconfig.app.json';
                execSync(cmd, { cwd: __dirname, stdio: 'pipe' });
                console.log('  ✅ TypeScript compilation successful');
            } catch (error) {
                throw new Error(`TypeScript compilation failed: ${error.message}`);
            }
        }
    }
];

let passed = 0;
let failed = 0;

console.log('Running verification tests...\n');

for (const test of tests) {
    try {
        console.log(`🧪 ${test.name}`);
        test.test();
        passed++;
        console.log();
    } catch (error) {
        console.log(`  ❌ ${error.message}\n`);
        failed++;
    }
}

console.log('📊 Verification Results:');
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%\n`);

if (failed === 0) {
    console.log('🎉 All tests passed! Angular CLI setup is working correctly.');
    console.log('\n📝 Quick start commands:');
    console.log('  npm run ng:start     # Start development server');
    console.log('  npm run ng:build     # Build for development');
    console.log('  npm run ng:build:prod # Build for production');
    console.log('  npm run ng:test      # Run tests');
    console.log('\n📖 For more information, see ANGULAR_CLI_SETUP.md');
    process.exit(0);
} else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
    console.log('   You may need to run the setup steps again or check the configuration.');
    process.exit(1);
}
