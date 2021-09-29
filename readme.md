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

Commit code:

```bash
yarn commit
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

### Release

#### Set .env

Before running release script, you need create a `.env` file. About `.env` config, you can look [.env.example](./.env.example);

```
GH_TOKEN=<Github Personal Token: required>
GPG_SIGN_KEY=<GPG Sign Key: optional>
```

#### Release

Here is the release script of vite-wallet. It do something like:

1. Bump version
2. Choose which platform to build
3. Release package to github
4. Sigin with GPG key


```bash
yarn release
```
