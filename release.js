const execa = require('execa');
const semver = require('semver');
const inquirer = require('inquirer');

const curVersion = require('./package.json').version;

const execWrapper = async (...args) => {
    let _promise = execa(...args);
    _promise.stdout.pipe(process.stdout);
    return await _promise;
};

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

    const { bump, customVersion, isPublish, buildTarget } = await inquirer.prompt([
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
        },
        {
            name: 'isPublish',
            message: 'Do you want to publish to github?',
            type: 'list',
            choices: [ { name: 'N', value: false }, { name: 'Y', value: true } ]
        },
        {
            name: 'buildTarget',
            message: 'Which target do you want to build?',
            type: 'list',
            choices: ['all', 'mac', 'win']
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

    // Delete files
    await execWrapper('npm', ['run', 'clean']);

    await execWrapper('npm', ['run', 'build:web']);

    const releaseConfig = {
        env: {
            ...process.env,
            RELEASE: isPublish
        }
    };

    if (isPublish) {
        await execWrapper('npm', ['version', bumps.indexOf(bump) > -1 ? bump : version]);
        await execWrapper('git', ['push']);
        await execWrapper('git', ['push', '--tags', '-f']);
    }

    if (['all', 'mac'].indexOf(buildTarget) > -1) {
        await execWrapper('npm', ['run', 'release:mac'], releaseConfig);
    }
    if (['all', 'win'].indexOf(buildTarget) > -1) {
        await execWrapper('npm', ['run', 'release:win'], releaseConfig);
    }
};

release().catch(err => {
    console.error(err);
    process.exit(1);
});
