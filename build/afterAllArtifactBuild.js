const shell = require('shelljs');


exports.default = async (context) => {
    const { artifactPaths } = context;
    const signFiles = [];
    const signKey = process.env.GPG_SIGN_KEY;


    if (!signKey) {
        console.warn('GPG sign key is null, skiping gpg sign process.')
        return signFiles;
    }

    artifactPaths.forEach(item => {
        let cmd = `gpg --armor --detach-sign --local-user "${signKey}" --yes "${item}"`;
        console.log(cmd)
        if (shell.exec(cmd).code === 0) {
            signFiles.push(`${item}.asc`);
        };
    });
    return signFiles;
}