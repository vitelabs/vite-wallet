# vite-wallet
> The Desktop wallet of [vite](https://vite.org).

## Install

[Mac and Windows](https://github.com/vitelabs/vite-wallet/releases)

## Development

### Init 

This project contains the [vite-web-wallet](https://github.com/vitelabs/vite-web-wallet). You need init submodules first.

```
git submodule init
git submodule update
```

### Install

To install the dependencies of vite-wallet:

```
yarn
```

To install the dependencies of [vite-web-wallet](https://github.com/vitelabs/vite-web-wallet):

```
cd vite-web-wallet
yarn
```

### Developing

If want to use the local dev server of vite-web-wallet:

```bash
# You need get in to vite-web-wallet
yarn dev
```
And then, open a new tab on terminal:

```
yarn dev
```

### Build

First, you need build the vite-web-wallet dist:

```bash
cd vite-web-wallet
yarn build
```

Second, you need to build vite-wallet:

```bash
# In vite-wallet project root path

# Building mac
yarn build

# Building windows
yarn build:win
```

### Verify

**For Security, Please Verify Downloads Before Using!!!**

First, you need import Public Key: [BCB054E548A093056A8BAE91F8809A14954ACB1D](https://keys.openpgp.org/vks/v1/by-fingerprint/BCB054E548A093056A8BAE91F8809A14954ACB1D)

```bash
gpg --keyserver keys.openpgp.org --recv-keys BCB054E548A093056A8BAE91F8809A14954ACB1D
```

Second, please download both App File (In windows: .exe, In mac: .dmg) and gpg sign files (.asc);

And then verify: 

```
gpg --verify <App Sign File> <App File> 
```
