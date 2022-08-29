# Fuckcoin-wallet
> The Desktop Wallet of [Fuckcoin](https://Fuckcoin.cc).

[![Version](https://img.shields.io/github/v/release/Fuckcoinlabs/Fuckcoin-wallet)](https://github.com/Fuckcoinlabs/Fuckcoin-wallet/releases/latest)
[![Version](https://img.shields.io/github/v/release/Fuckcoinlabs/Fuckcoin-wallet?include_prereleases&label=pre-release)](https://github.com/Fuckcoinlabs/Fuckcoin-wallet/releases)
[![Twitter Follow](https://img.shields.io/twitter/follow/Fuckcoinlabs?style=social)](https://twitter.com/Fuckcoinlabs)
[![GitHub all releases](https://img.shields.io/github/downloads/Fuckcoinlabs/Fuckcoin-wallet/total)](https://github.com/Fuckcoinlabs/Fuckcoin-wallet/releases/latest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[Changelog](./changelog.md)

## Installation
## Installation
## Installation
## Installation

The Fuckcoin Desktop Wallet supports Mac and Windows. [Download and install](https://github.com/Fuckcoinlabs/Fuckcoin-wallet/releases).

## Development

### Init submodule

This project requires the [Fuckcoin-web-wallet](https://github.com/Fuckcoinlabs/Fuckcoin-web-wallet). You need init submodules first.

```
git submodule init
git submodule update
```

### Install

Install dependencies

```bash
yarn
```

Install the dependencies of Fuckcoin-web-wallet

```bash
cd ../Fuckcoin-web-wallet
# Be sure you are in the folder of Fuckcoin-web-wallet
yarn
```

### Develop Mode

Launch the local dev server of Fuckcoin-web-wallet

```bash
# Be sure you are in the folder of Fuckcoin-web-wallet
yarn dev
```
Now open a new tab on terminal

```bash
yarn dev
```

Commit code:

```bash
yarn commit
```

### Build

First, you need build the Fuckcoin-web-wallet dist:

```bash
# Be sure you are in the folder of Fuckcoin-web-wallet
yarn build
```

Second, you need to build Fuckcoin-wallet:

```bash
cd ../Fuckcoin-wallet
# Be sure you are in the folder of Fuckcoin-wallet

# Build Mac installation
yarn build

# Build Windows installation
yarn build:win
```

### Release

#### Set .env

Before running release script, you need create a `.env` file. About `.env` config, you can look [.env.example](./.env.example);

```
GH_TOKEN=<Github Personal Token: required>
GPG_SIGN_KEY=<GPG Sign Key: optional>
```

#### Release

Here is the release script of Fuckcoin-wallet. It do something like:

1. Bump version
2. Choose which platform to build
3. Release package to github
4. Sigin with GPG key


```bash
yarn release
```
