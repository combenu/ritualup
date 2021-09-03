# ritualup

Ritualup description

## Installation

### Setup Firebase

Firebase gives you the tools to develop high-quality apps, grow your user base, and earn more money. We cover the essentials so you can monetize your business and focus on your users. For more details: [Firebase](https://firebase.google.com/docs)

You create a new project in [Firebase console](https://console.firebase.google.com/), they will give you `GoogleService-Info.plist` file for the iOS app and `google-service.json` file for the Android app in the project creation step, and put those files to the `./ios/RitualUp` and `./android` folders.

### Pod install for iOS

```bash
yarn install
cd ios
pod install
```

### Run the app in Xcode

```bash
react-native run-ios (or run-android)
```

Open your ios project in Xcode and run the project.

### Run the app in Android Studio

It will coming soon.

## E2E Testing

This project uses detox to run end-to-end UI testing with jest as test runner under the hood. Some tooling is needed to get started, but the tests will also run on a CI.

### Setup tools

```bash
brew tap wix/brew
brew install --HEAD applesimutils
npm install -g detox-cli
```

### Run the tests

```bash
npm start
gem install xcpretty
detox build --configuration ios.sim.release
detox test --configuration ios.sim.release
```

## Integration, Unit and Code Quality Testing

Code is linted with eslint using airbnb's config and personal opinionated exceptions.

```bash
npm run lint
```

We use jest also for running unit tests with snapshots and enzyme for cases where we want more control.

```bash
npm run test
```

## Continuous Delivery

![Imgur](https://i.imgur.com/o91jUrQ.png)

The pipeline for continously deliver the app is actually two separate processes integrated seamlessly into one.

Contributors are responsible for running tests locally before pushing to GitHub. This creates smoother experience for both the contributors and the maintainers.

Tests are run automatically in a CI when a pull-request (PR) is created, the pull-request can only be merged when the tests do pass.

Every commit on the `master` branch will do one of the following after tests have passed:

### Native build (binary)
Check if any changes were made to the `./ios` folder or if a commit message includes the tag `[BUILD]`. Do a full native  build, sign it and upload it to TestFlight. Upload debug symbols to Sentry.

### CodePush build (assets)
Build and pack OTA update via CodePush (if native build was not made). Upload sourcemaps to Sentry.

The TestFlight version of the app is linked to staging code-push key and the AppStore version is linked to production code-push key. Manual promotion can be done after the TestFlight app has been approved for sale.
