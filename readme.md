# vite-wallet
> The Desktop Wallet of [Vite](https://vite.org).

[![Version](https://img.shields.io/github/v/release/vitelabs/vite-wallet)](https://github.com/vitelabs/vite-wallet/releases/latest)
[![Version](https://img.shields.io/github/v/release/vitelabs/vite-wallet?include_prereleases&label=pre-release)](https://github.com/vitelabs/vite-wallet/releases)
[![Twitter Follow](https://img.shields.io/twitter/follow/vitelabs?style=social)](https://twitter.com/vitelabs)
[![GitHub all releases](https://img.shields.io/github/downloads/vitelabs/vite-wallet/total)](https://github.com/vitelabs/vite-wallet/releases/latest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[Changelog](./changelog.md)

## Installation

The Vite Desktop Wallet supports Mac and Windows. [Download and install](https://github.com/vitelabs/vite-wallet/releases).

## Development

### Init submodule

This project requires the [vite-web-wallet](https://github.com/vitelabs/vite-web-wallet). You need init submodules first.

```
git submodule init
git submodule update
```

### Install

Install dependencies

```bash
yarn
```

Install the dependencies of vite-web-wallet

```bash
cd ../vite-web-wallet
# Be sure you are in the folder of vite-web-wallet
yarn
```

### Develop Mode

Launch the local dev server of vite-web-wallet

```bash
# Be sure you are in the folder of vite-web-wallet
yarn dev
```
Now open a new tab on terminal

```bash
yarn dev
```

### Build

First, you need build the vite-web-wallet dist:

```bash
# Be sure you are in the folder of vite-web-wallet
yarn build
```

Second, you need to build vite-wallet:

```bash
cd ../vite-wallet
# Be sure you are in the folder of vite-wallet

# Build Mac installation
yarn build

# Build Windows installation
yarn build:win
```

### Resease

Here is the release script of vite-wallet. It will auto upload release to github release and bump version.

```bash
yarn release
```

### Verify Signature

**For Security Purpose, Please Verify The Installation File Before Using!!!**

First, import PGP Public Key: [BCB054E548A093056A8BAE91F8809A14954ACB1D](https://keys.openpgp.org/vks/v1/by-fingerprint/BCB054E548A093056A8BAE91F8809A14954ACB1D)

```bash
gpg --keyserver keys.openpgp.org --recv-keys BCB054E548A093056A8BAE91F8809A14954ACB1D
```

Second, make sure you have downloaded the Installation File (Windows: .exe, Mac: .dmg) and PGP Signature File (.asc).

Start verification: 

```bash
gpg --verify <Signature File> <Installation File> 
```
