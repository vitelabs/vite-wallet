const path = require('path');
const execa = require('execa');
const semver = require('semver');
const inquirer = require('inquirer');

const curVersion = require('./package.json').version;

const execWrapper = async (...args) => {
    let _promise = execa(...args);
    _promise.stdout.pipe(process.stdout);
    return await _promise;
}

const release = async () => {
    console.log(`Current version: ${ curVersion }`);

    const bumps = ['prerelease', 'prepatch', 'preminor', 'premajor', 'patch', 'minor', 'major' ];
    const versions = {};
    bumps.forEach(b => {
        versions[b] = semver.inc(curVersion, b);
    });
    const bumpChoices = bumps.map(b => {
        return { name: `${ b } (${ versions[b] })`, value: b };
    });

    const { bump, customVersion } = await inquirer.prompt([
        {
            name: 'bump',
            message: 'Select release type:',
            type: 'list',
            choices: [
                ...bumpChoices,
                { name: 'custom', value: 'custom' }
            ]
        },
        {
            name: 'customVersion',
            message: 'Input version:',
            type: 'input',
            when: answers => answers.bump === 'custom'
        }
    ]);

    const version = customVersion || versions[bump];

    const { yes } = await inquirer.prompt([{
        name: 'yes',
        message: `Confirm releasing ${ version }?`,
        type: 'list',
        choices: [ 'N', 'Y' ]
    }]);

    if (yes === 'N') {
        console.log('[release] cancelled.');
        return;
    }

    console.log(`npm version ${bumps.indexOf(bump) > -1 ? bump : version }`);

    await execWrapper(`npm`, ['run', 'build'], {
        cwd: path.join(process.cwd(), 'vite-web-wallet')
    })

    await execa(`npm version ${bumps.indexOf(bump) > -1 ? bump : version }`);
    await execWrapper('npm', ['run', 'release:mac']);
    await execWrapper('npm', ['run', 'release:win']);
};

release().catch(err => {
    console.error(err);
    process.exit(1);
});
